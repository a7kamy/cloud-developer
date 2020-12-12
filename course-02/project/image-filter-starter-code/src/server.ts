import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
var validUrl = require('valid-url');
var onFinished = require('on-finished');
var appRoot = require('app-root-path');
(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get('/filteredimage/', async(req, res , n ) =>{

    let {image_url} = req.query

    if(!validUrl.isUri(image_url)){
      res.status(404).send({"error": "Inavlid query field : Image Url "})
    }
    else
    {
      try
    {
      let filteredpath = await filterImageFromURL(image_url)
      
      const directoryPath = path.join(__dirname, '/util/tmp')
      let direFiles : string[] = [];
      fs.readdir(directoryPath, function(err, files) {
         if (err) {

           res.status(400).send({"error messag": err})

         } else {
          direFiles = files;
        }
      })
      res.sendFile(filteredpath)
      onFinished(res, function () {
        deleteLocalFiles(direFiles.map(file=>{
          file = directoryPath+ "/" + file;
          return file;
        }));
      })
    }
    catch(error)
    {
      res.status(400).send(error);
    }

    }
    
})
  //! END @TODO1
  
 
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();