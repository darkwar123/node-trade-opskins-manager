const options = {
	"uid": "2522259",
	"pollInterval": 10000,
	"cancelTime": 3 * 60 * 1000,
	"apiKey": '67ce5505a1bdcb6cddc3de5216604c',
	"sharedSecret": 'VMLDSWDJKWUHDLA5D'
};


const TradeOpskinsManager = require('../');
const manager = new TradeOpskinsManager(options);
const InternalAppID = TradeOpskinsManager.InternalAppID;


// create new function and attach it to manager
// this function will load manager inventory from 3 different games
manager.set('getAllInventory', async function() {
	let getInventoryVGO = manager.getInventory({"app_id": InternalAppID['vgo']});
	let getInventoryCSGO = manager.getInventory({"app_id": InternalAppID['csgo']});
	let getInventoryPUBG = manager.getInventory({"app_id": InternalAppID['pubg']});

	return await Promise.all([getInventoryVGO, getInventoryCSGO, getInventoryPUBG]);
});


// show your inventory from 3 games in console or error if something wrong
manager.getAllInventory().then(console.log).catch(console.error);

