// const paypal = require('@paypal/checkout-server-sdk'); 

// paypal.configure({
//     mode: 'sandbox',
//     client_id:'AdxouF5nAVTGuOsgK_9JvbS5ybsax7tv6FuNxkFXuVlkOEIp_fyXQep7e7Z05EQI1RNZLh2kNyGg-9sh',
//     client_secret:'EN2ABP38tmd6PwsaEryTlWvnJ1542lsPtyw_ToWyGTMKNKP7v_8eHOJMEMht5MxeEygE7IiIQwfcpxQF'
// });

// module.exports = paypal;





const paypalSDK = require('@paypal/checkout-server-sdk');

const client_id = 'AdxouF5nAVTGuOsgK_9JvbS5ybsax7tv6FuNxkFXuVlkOEIp_fyXQep7e7Z05EQI1RNZLh2kNyGg-9sh';
const client_secret = 'EN2ABP38tmd6PwsaEryTlWvnJ1542lsPtyw_ToWyGTMKNKP7v_8eHOJMEMht5MxeEygE7IiIQwfcpxQF';

const environment = new paypalSDK.core.SandboxEnvironment(client_id, client_secret);
const client = new paypalSDK.core.PayPalHttpClient(environment);

// ✅ Export with the name `paypal` and include the client
const paypal = {
  sdk: paypalSDK,
  client: client,
};

module.exports = paypal;
