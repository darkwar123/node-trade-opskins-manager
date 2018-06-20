const Item = require('./Item');

const Offer = function(offer) {
	this.id = offer['id'];
	this.state = offer['state'];
	this.sender_uid = offer['sender']['uid'];
	this.sender_steam_id = offer['sender']['steam_id'];
	this.sent_by_you = offer['sent_by_you'];
	this.time_created = offer['time_created'];
	this.recipient_uid = offer['recipient']['uid'];
	this.recipient_steam_id = offer['recipient']['steam_id'];
	this.items_to_give = offer['sent_by_you'] ? offer['sender']['items'] : offer['recipient']['items'];
	this.items_to_receive = offer['sent_by_you'] ? offer['recipient']['items'] : offer['sender']['items'];

	this.items_to_give = this.items_to_give.map((item) => new Item(item));
	this.items_to_receive = this.items_to_receive.map((item) => new Item(item));
};

module.exports = Offer;

