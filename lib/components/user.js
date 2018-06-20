/**
 * Modules
 * */
const TradeOpskinsManager = require('../');
const Item = require('../classes/Item');
const InternalAppID = require('../enums/InternalAppID');
const OpskinsError = require('../classes/OpskinsError');


TradeOpskinsManager.prototype.getInventory = function({app_id=InternalAppID['vgo'], per_page=100, page=1, search, sort=6}={}) {
	return new Promise((resolve, reject) => {
		let query = {"httpMethod": 'GET', "iface": 'IUser', "method": 'GetInventory', "data": {}};
		let opts = {app_id, per_page, page, search, sort};

		if (typeof opts['app_id'] === 'undefined') {
			throw new OpskinsError({"message": 'app_id is required'});
		}

		for (let key of Object.keys(opts)) {
			let opt = opts[key];

			if (opt) {
				query['data'][key] = opt;
			}
		}

		this._req(query).then(({data}) => {
				resolve({
					"items": data['response']['items'].map((item) => new Item(item)),
					"total": parseInt(data['response']['total'], 10),
				});
			})
			.catch(reject);
	})
};

