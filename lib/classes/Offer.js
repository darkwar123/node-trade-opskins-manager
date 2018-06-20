const Item = require('./Item');

const Offer = function(offer) {
	this.id = offer['id'];
	this.state = offer['state'];
	this.state_name = offer['state_name'];

	this.sender = offer['sender'];
	this.recipient = offer['recipient'];

	this.message = offer['message'];
	this.sent_by_you = offer['sent_by_you'];
	this.time_created = offer['time_created'];
	this.time_updated = offer['time_updated'];
	this.time_expires = offer['time_expires'];

	this.items_to_give = offer['sent_by_you'] ? offer['sender']['items'] : offer['recipient']['items'];
	this.items_to_receive = offer['sent_by_you'] ? offer['recipient']['items'] : offer['sender']['items'];

	this.items_to_give = this.items_to_give.map((item) => new Item(item));
	this.items_to_receive = this.items_to_receive.map((item) => new Item(item));

	delete this.sender['items'];
	delete this.recipient['items'];
};

module.exports = Offer;

