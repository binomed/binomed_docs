// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
// const fileName = 'Local image file, e.g. /path/to/image.png';



  const Hapi=require('hapi');

  // Create a server with a host and port
  const server=Hapi.server({
      host:'localhost',
      port:8000
  });
  
// Add the route
server.route({
      method:'GET',
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
    client
    .labelDetection(fileName)
    .then(results => {
    const labels = results[0].labelAnnotations;
    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
    })
    .catch(err => {
    console.error('ERROR:', err);
    });

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