/**
 * Modules
 * */
const TradeOpskinsManager = require('../');
const PriceAppID = require('../enums/PriceAppID');
const OpskinsError = require('../classes/OpskinsError');


TradeOpskinsManager.prototype.getAllLowestListPrices = function({app_id=PriceAppID['vgo']}={}) {
	return new Promise((resolve, reject) => {
		if (typeof app_id === 'undefined') {
			throw new OpskinsError({"message": 'app_id is required'});
		}

		let query = {"data": {"appid": app_id}, "headers": {'Authorization': ''}, "baseURL": "https://api.opskins.com/", "httpMethod": 'GET', "iface": 'IPricing', "method": 'GetAllLowestListPrices'};

		this._req(query).then(({data}) => {
				let items = data['response'];
				resolve(items)
			})
			.catch(reject);
	})
};


TradeOpskinsManager.prototype.getPriceList = function({app_id=PriceAppID['vgo']}={}) {
	return new Promise((resolve, reject) => {
		if (typeof app_id === 'undefined') {
			throw new OpskinsError({"message": 'app_id is required'});
		}

		let query = {"data": {"appid": app_id}, "headers": {'Authorization': ''}, "version": 'v2', "baseURL": "https://api.opskins.com/", "httpMethod": 'GET', "iface": 'IPricing', "method": 'GetSuggestedPrices'};

		this._req(query).then(({data}) => {
				let items = data['response'];

				for (let key of Object.keys(items)) {
					items[key] = (parseInt(items[key]["op_7_day"]) + parseInt(items[key]["op_30_day"])) / 2;
				}

				resolve(items)
			})
			.catch(reject);
	})
};

