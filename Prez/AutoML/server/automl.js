const automl = require('@google-cloud/automl');
const configuration = require('./configuration.js');
const fs = require('fs');

const clientPredictionAutoML = new automl.PredictionServiceClient(require('./credentials.js'));
const clientPredictionIsItAShirtAutoML = new automl.PredictionServiceClient(require('./credentials-isitashirt.js'));

module.exports = async function automlDetection(modelToUse, bytes) {

  return new Promise(async (resolve, reject) => {

    let modelName = configuration.modelName;
    switch(modelToUse) {
      case 'shirt':
      modelName = configuration.modelNameIsItAShirt;
      break;
    }
    const body = {
      name: modelName,
      payload: {
        image: {
          imageBytes: Buffer.from(bytes.blob).toString('base64')
        }
      },
      params: {
        score_threshold: 0.1
      }
    };


    console.log('using model', body.name);
    console.log('sending request with body', JSON.stringify(body));

    try {
      let clientToUse = clientPredictionAutoML;
      switch(modelToUse) {
        case 'shirt':
          clientToUse = clientPredictionIsItAShirtAutoML;
        break;
      }
      const predictionResponse = await clientToUse.predict(body);

      console.log(' Got Prediction : ', JSON.stringify(predictionResponse));
      // We transform the response to match alpha api results
      let metadata = {
        responses: predictionResponse.length <= 0 ? [] : predictionResponse.filter(prediction => prediction).map(prediction => {
          return {
            customLabelAnnotations: prediction.payload
            .sort((annotation1, annotation2 ) => annotation2.classification.score - annotation1.classification.score)
            .map(annotation => {
              return {
                model: modelName,
                label: annotation.displayName,
                score: annotation.classification.score
              }
            })
          }
        })
      };

      console.log('got metadata', JSON.stringify(metadata));

      
      resolve(metadata);
    } catch (error) {
      reject({
        message: 'prediction failed',
        error
      });
    }
  });
}