const options = {
	"uid": "2522259",
	"pollInterval": 10000,
	"cancelTime": 3 * 60 * 1000,
	"apiKey": '67ce5505a1bdcb6cddc3de5216604c',
	"sharedSecret": 'VMLDSWDJKWUHDLA5D'
};


const TradeOpskinsManager = require('../');
const manager = new TradeOpskinsManager(options);


// monitor events, try to turn this script
// and send offer to your friend or someone else then look at the console
manager.on('newOffer', console.log);
manager.on('newItems', console.log);
manager.on('unknownOffer', console.log);
manager.on('offerChangeState', console.log);

