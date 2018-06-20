/**
 * Modules
 * */
const Offer = require('../classes/Offer');
const TradeOpskinsManager = require('../');
const Item = require('../classes/Item');
const InternalAppID = require('../enums/InternalAppID');
const OpskinsError = require('../classes/OpskinsError');


TradeOpskinsManager.prototype.cancelOffer = function({id}) {
	return new Promise((resolve, reject) => {
		if (typeof id === 'undefined') {
			throw new OpskinsError({"message": 'offer.id is required'});
		}

		let query = {"httpMethod": 'POST', "iface": 'ITrade', "method": 'CancelOffer', "data": {"offer_id": id}};

		this._req(query).then(({data}) => resolve(new Offer(data['response']['offer'])))
			.catch(reject);
	});
};


TradeOpskinsManager.prototype.getUserInventory = function({uid, app_id=InternalAppID['vgo'], per_page=100, page=1, search}) {
	return new Promise((resolve, reject) => {
		let query = {"httpMethod": 'GET', "iface": 'ITrade', "method": 'GetUserInventory', "data": {}};
		let opts = {uid, app_id, per_page, page, search};

		if (typeof opts['uid'] === 'undefined') {
			throw new OpskinsError({"message": 'uid is required'});
		}

		for (let key of Object.keys(opts)) {
			let opt = opts[key];

			if (opt) {
				query['data'][key] = opt;
			}
		}

		this._req(query).then(({data}) => {
				resolve({
					"user_data": data['response']['user_data'],
					"total": parseInt(data['response']['total'], 10),
					"items": data['response']['items'].map((item) => new Item(item)),
				})
			})
			.catch(reject);
	})
};


TradeOpskinsManager.prototype.getUserInventoryFromSteamId = function({steam_id, app_id=InternalAppID['vgo'], per_page=100, page=1, search}) {
	return new Promise((resolve, reject) => {
		let query = {"httpMethod": 'GET', "iface": 'ITrade', "method": 'GetUserInventoryFromSteamId', "data": {}};
		let opts = {steam_id, app_id, per_page, page, search};

		if (typeof opts['steam_id'] === 'undefined') {
			throw new OpskinsError({"message": 'uid is required'});
		}

		for (let key of Object.keys(opts)) {
			let opt = opts[key];

			if (opt) {
				query['data'][key] = opt;
			}
		}

		this._req(query).then(({data}) => {
				resolve({
					"user_data": data['response']['user_data'],
					"total": parseInt(data['response']['total'], 10),
					"items": data['response']['items'].map((item) => new Item(item)),
				})
			})
			.catch(reject);
	})
};


TradeOpskinsManager.prototype.sendOffer = function({trade_url, uid, token, items}) {
	return new Promise((resolve, reject) => {
		let query = {"httpMethod": 'POST', "iface": 'ITrade', "method": 'SendOffer', "data": {}};
		let opts = {uid, token, items, "twofactor_code": this.getTwoFactorCode()};

		if (typeof trade_url === 'string') {
			const reg = /(\d+)\/(.+)$/i.exec(trade_url);

			if (reg === null) {
				throw new OpskinsError({"message": 'trade_url parsing error'});
			}

			opts['uid'] = reg[1];
			opts['token'] = reg[2];
		} else {
			if (typeof opts['uid'] === 'undefined') {
				throw new OpskinsError({"message": 'uid is required'});
			}

			if (typeof opts['token'] === 'undefined') {
				throw new OpskinsError({"message": 'token is required'});
			}
		}

		if (!Array.isArray(opts['items']) || !opts['items'].length) {
			throw new OpskinsError({"message": 'items is required'});
		} else {
			opts['items'] = opts['items'].join(',');
		}


		for (let key of Object.keys(opts)) {
			let opt = opts[key];

			if (opt) {
				query['data'][key] = opt;
			}
		}

		this._req(query).then(({data}) => {
				let offer = new Offer(data['response']['offer']);

				// Add created offer to pollData and keep track of it
				this._addOfferToPollData(offer);
				this._updatePollData();

				resolve(offer)
			})
			.catch(reject);
	})
};

