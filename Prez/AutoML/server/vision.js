const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient(require('./credentials.js'));



module.exports = function detectLabel(bytes) {

    return new Promise((resolve, reject) => {
        client
            .labelDetection({
                image: {
                    content: bytes.blob
                }
            })
            .then(results => {
                resolve(results);
                //const labels = results[0].labelAnnotations;
                //console.log('Labels:');
                //labels.forEach(label => console.log(label.description));
            })
            .catch(err => {
                reject(err);
                //console.error('ERROR:', err);
            });
    });
}