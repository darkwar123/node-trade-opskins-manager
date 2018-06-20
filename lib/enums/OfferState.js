module.exports = {
	'active': 2, /** The offer is active and the recipient can accept it to exchange the items */
	'accepted': 3, /** The recipient accepted the offer and items were exchanged */
	'expired': 5, /** The offer expired from inactivity */
	'canceled': 6, /** The sender canceled the offer */
	'declined': 7, /** The recipient declined the offer */
	'invalid items': 8, /** One of the items in the offer is no longer available/eligible so the offer was canceled automatically */
	2: 'active',
	3: 'accepted',
	5: 'expired',
	6: 'canceled',
	7: 'declined',
	8: 'invalid items',
};

