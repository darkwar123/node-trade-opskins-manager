const Item = function(item) {
	this.id = item['id'];
	this.sku = item['sku'];
	this.wear = item['wear'];
	this.name = item['name'];
	this.type = item['type'];
	this.color = item['color'];
	this.image = item['image'];
	this.rarity = item['rarity'];
	this.category = item['category'];
	this.inspect = item['inspect'];
	this.category = item['category'];
	this.eth_inspect = item['eth_inspect'];
	this.paint_index = item['paint_index'];
	this.preview_urls = item['preview_urls'];
	this.pattern_index = item['pattern_index'];
	this.internal_app_id = item['internal_app_id'];
	this.trade_hold_expires = item['trade_hold_expires'];
	this.suggested_price = parseInt(item['suggested_price'], 10) || 0;
	this.suggested_price_floor = parseInt(item['suggested_price_floor'], 10) || 0;
};

module.exports = Item;

