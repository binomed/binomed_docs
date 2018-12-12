// Imports the Google Cloud client library
const Hapi=require('hapi');
const detectLabel = require('./vision.js');
const automlDetection = require('./automl.js');


// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000,
    routes:{
        cors:true
    }
});
  
// Add the route
server.route({
      method:'POST',
      path:'/vision',
      handler: visionApi
    });
    server.route({
        method:'POST',
        path:'/automl',
        handler: autoMLApi
});

async function visionApi(request, h) {
    // Performs label detection on the local file
    
    try {
        const test = await detectLabel(request.payload);
        console.log(test);
        return test;
    }catch(err){
        return 'error';
    }
}

async function autoMLApi(request, h){
    try {
        const test = await automlDetection(request.payload);
        console.log(test);
        return test;
    }catch(err){
        return 'error';
    }
}
  
  // Start the server
  async function start() {
  
      try {
          await server.start();
      }
      catch (err) {
          console.log(err);
          process.exit(1);
      }
  
      console.log('Server running at:', server.info.uri);
  };
  
  start();