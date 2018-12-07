const automl = require('@google-cloud/automl');

const clientPredictionAutoML = new automl.PredictionServiceClient();
  const body ={
    name: formattedName,
    payload: 
    {
      image: 
      {
        imageBytes: downloadContent[0].toString('base64')
      }
    },
    params : {
      score_threshold: 0.1
    }
  };


  console.log('using model', body.name);
  console.log('sending request with body', JSON.stringify(body));

  try {
    const predictionResponse = await clientPredictionAutoML.predict(body);

    console.log(' Got Prediction : ', JSON.stringify(predictionResponse));
    // We transform the response to match alpha api results
    let metadata = {
        responses: predictionResponse.length <= 0 ? [] : predictionResponse.filter(prediction => prediction).map(prediction => {
          return {
            customLabelAnnotations : prediction.payload.map(annotation => {return {
                model: formattedName,
                label: annotation.displayName,
                score: annotation.classification.score
            }})
          }
        })
    };

    console.log('got metadata', JSON.stringify(metadata));

    if (metadata.responses && metadata.responses[0] && metadata.responses[0].customLabelAnnotations) {
      console.log('mixing metadat with artists profiles');

      metadata = await removeNoiseEntriesAndAddArtistProfile(metadata);
    }

    sendResponse(response,  metadata);
  } catch (error) {
    sendError(response, {
      message: 'prediction failed',
      error
    });
  }
});
