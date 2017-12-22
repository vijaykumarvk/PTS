const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: YOUR_API_KEY,
  apiSecret: YOUR_API_SECRET
});
nexmo.message.sendSms('7448987114', 'yo',
    function(err, responseData) {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
      }
    }
 );