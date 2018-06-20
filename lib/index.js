/**
 * Modules
 * */
const md5 = require('md5');
const util = require('util');
const axios = require('axios');
const debug = require('debug');
const FileStorage = require('./FileStorage');
const AppDirectory = require('appdirectory');
const EventEmitter = require('events').EventEmitter;

/**
 * Classes
 * */
const Item = require('./classes/Item');
const Offer = require('./classes/Offer');
const OpskinsError = require('./classes/OpskinsError');

/**
 * Enums
 * */
const OfferState = require('./enums/OfferState');
const InternalAppID = require('./enums/InternalAppID');

/**
 * Constants
 * */
const ENDPOINT_TIMEOUT = 90000;
const DEBUG_PREFIX = 'trade-opskins-manager';
const ENDPOINT_URL = 'https://api-trade.opskins.com/';


const TradeOpskinsManager = function({uid='', apiKey, sharedSecret, pollInterval=10000, cancelTime=3 * 60 * 1000}={}) {
	if (typeof apiKey !== 'string') {
		throw new Error('apiKey is required');
	}

	if (typeof sharedSecret !== 'string') {
		throw new Error('sharedSecret is required');
	}

	if (typeof pollInterval !== 'undefined' && typeof pollInterval !== 'number') {
		throw new Error('pollInterval should be a number');
	}

	this._uid = uid;
	this.set('_apiKey', apiKey);
	this._cancelTime = cancelTime;
	this._pollInterval = pollInterval;
	this.set('_sharedSecret', sharedSecret);

	this._debug = debug(DEBUG_PREFIX + ':' + (this._uid || md5(this._apiKey)));
	this._error = debug(DEBUG_PREFIX + ':' + (this._uid || md5(this._apiKey)) + ':' + 'error');

	this._axios = axios.create({"responseType": 'json', "baseURL": ENDPOINT_URL, "timeout": ENDPOINT_TIMEOUT, "headers": {'Authorization': "Basic " + Buffer.from(this._apiKey + ":", "ascii").toString("base64")}});
	this._axios.interceptors.response.use((config) => config, this._handleReqError.bind(this));

	this._dataDir = new FileStorage((new AppDirectory({
		"appName": DEBUG_PREFIX,
		"appAuthor": 'darkwar123'
	})).userData());

	this._pollDataFileName = 'pollData_' + md5(this._apiKey) + '.json';
	this._pollData = this._dataDir.read(this._pollDataFileName);

	if (this._pollInterval > 0) {
		this._doPoll();
	}
};

/**
 * Set data in this and hide it from console.log
 * @param {String} key - this[key]
 * @param {*} value - this[key] = value
 * */
TradeOpskinsManager.prototype.set = function(key, value) {
	Object.defineProperty(this, key, {"get": () => value});
};


TradeOpskinsManager.prototype._handleReqError = function(error) {
	let data = error.response.data;
	let {message, response} = error;

	if (typeof data === 'object' && typeof data['message'] === 'string') {
		message = data['message'];
	}

	this._error(message);
	return Promise.reject(new OpskinsError({message, "statusCode": response['status']}));
};


TradeOpskinsManager.prototype._req = function({baseURL, headers, httpMethod = 'post', iface, method, version = 'v1', data={}}={}) {
	if (typeof iface !== 'string') {
		throw new Error('iface is required');
	}

	if (typeof method !== 'string') {
		throw new Error('method is required');
	}

	let url = [iface, method, version].join('/');
	baseURL = baseURL || this._axios.defaults["baseURL"];
	headers = Object.assign(Object.assign({}, this._axios.defaults["headers"]), headers);

	this._debug('send request %o', {baseURL, httpMethod, iface, method, version, data, headers});

	return this._axios({
		"url": url,
		"baseURL": baseURL,
		"headers": headers,
		"method": httpMethod,
		[httpMethod.toLowerCase() === 'get' ? 'params' : 'data']: data,
	});
};


/**
 * Inherits
 * */
util.inherits(TradeOpskinsManager, EventEmitter);

/**
 * Attach classes and enums to TradeOpskinsManager constructor
 * */
TradeOpskinsManager.Item = Item;
TradeOpskinsManager.Offer = Offer;
TradeOpskinsManager.OfferState = OfferState;
TradeOpskinsManager.OpskinsError = OpskinsError;
TradeOpskinsManager.InternalAppID = InternalAppID;

module.exports = TradeOpskinsManager;

/**
 * Components
 * */
require('./components/totp');
require('./components/poll');
require('./components/user');
require('./components/trade');
require('./components/price');

