/**
 * Modules
 * */
const OfferState = require('../enums/OfferState');
const Offer = require('../classes/Offer');
const TradeOpskinsManager = require('../');


/**
 * Add new offer to pollData
 * @param {Offer} offer - the offer to add to pollData
 * */
TradeOpskinsManager.prototype._addOfferToPollData = function(offer) {
	this._pollData[offer['id']] = {"state": offer['state'], "sent_by_you": offer['sent_by_you'], "time_created": offer['time_created']};
};

/**
 * Save pollData in the file
 * @param {Object} [data] - pollData object
 * */
TradeOpskinsManager.prototype._updatePollData = function(data) {
	this._pollData = data || this._pollData;
	this._dataDir.save(this._pollDataFileName, this._pollData);
};

/**
 * GetOffers and manage it
 * @param {Array} offersToCheck - specified offer ids array
 * */
TradeOpskinsManager.prototype._doPoll = function({offersToCheck=[]}={}) {
	let query = {"httpMethod": 'GET', "iface": 'ITrade', "method": 'GetOffers', "data": {}};

	// if some of offers in our pollData with status "active" but we can't see them in response, search only this offers
	let activeOfferIDs = [];
	if (offersToCheck.length) {
		query['data']['ids'] = offersToCheck.join(',');
		activeOfferIDs = offersToCheck;
	} else if (Math.random() <= 1 / 5) {
		// sometimes check only active offers with probability 1 / 5
		query['data']['state'] = 2;
	}

	this._req(query).then(({data}) => {
			const offers = data['response']['offers'].map((offer) => new Offer(offer));

			// if it's our first login in opskins account
			if (this._pollData === null) {
				this._pollData = [];

				for (let offer of offers) {
					this._addOfferToPollData(offer);
				}

				this._updatePollData();
			} else {
				if (!activeOfferIDs.length) {
					for (const i in this._pollData) {
						if (this._pollData.hasOwnProperty(i) && this._pollData[i]['state'] === OfferState.active) {
							activeOfferIDs.push(i);
						}
					}
				}

				for (const offer of offers) {
					let index = activeOfferIDs.indexOf(String(offer['id']));

					if (index !== -1) {
						activeOfferIDs.splice(index, 1);
					}

					if (this._pollData[offer['id']]) {
						if (this._pollData[offer['id']]['state'] !== offer['state']) {
							this._debug('emit offerChangeState for %s from %s to %s', offer.id, this._pollData[offer['id']]['state'], offer['state']);
							this.emit('offerChangeState', offer, this._pollData[offer['id']]['state']);

							// If offer was accepted and we receive items emit event "newItems"
							if (offer['state'] === OfferState.accepted && offer['items_to_receive'].length > 0) {
								this.emit('newItems', offer['items_to_receive']);
							}

							delete this._pollData[offer['id']];
						} else {
							// if become cancelTime cancel offer
							if (this._cancelTime > 0 && offer['time_created'] * 1000 + this._cancelTime <= Date.now()) {
								this.cancelOffer(offer).then(()=>{}).catch(()=>{});
							}
						}
					} else if (offer['state'] === OfferState.active && !offer['sent_by_you']) {
						this._debug('emit newOffer for %s', offer.id);
						this.emit('newOffer', offer);
						this._addOfferToPollData(offer);
					} else if (offer['state'] === OfferState.active && offer['sent_by_you']) {
						this._debug('emit unknownOffer for %s', offer.id);
						this.emit('unknownOffer', offer);
						this._addOfferToPollData(offer);
					}
				}

				if (offers.length === 0 && query['data']['ids']) {
					for (const i in this._pollData) {
						if (this._pollData.hasOwnProperty(i) && activeOfferIDs.indexOf(i) !== -1) {
							delete this._pollData[i];
						}
					}

					activeOfferIDs = [];
				}

				this._updatePollData(this._pollData);
			}

			this.emit('pollSuccess', data);
		})
		.catch((error) => {
			this.emit('pollFailure', error);
		})
		.then(() => setTimeout(this._doPoll.bind(this, {"offersToCheck": activeOfferIDs}), this._pollInterval));
};

