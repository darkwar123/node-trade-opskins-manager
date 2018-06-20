/**
 * Modules
 * */
const totp  = require('node-2fa');
const TradeOpskinsManager = require('../');

/**
 * Generate two_factor code
 * @return {String}
 * */
TradeOpskinsManager.prototype.getTwoFactorCode = function() {
	return totp.generateToken(this._sharedSecret)['token'];
};

