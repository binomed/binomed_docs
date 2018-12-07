// Imports the Google Cloud client library
const Hapi=require('hapi');
const detectLabel = require('./vision.js');


// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});
  
// Add the route
server.route({
      method:'POST',
      path:'/vision',
      handler: visionApi
});
server.route({
      method:'GET',
      path:'/automl',
      handler: autoMLApi
});

async function visionApi(request, h) {
    // Performs label detection on the local file
    
    console.log(request);
    console.log(request.payload);
    detectLabel(request.payload);

    return 'helloWorld'
}

async function autoMLApi(request, h){
    return 'hello auto ml';
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