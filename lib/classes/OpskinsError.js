const OpskinsError = function({message, statusCode}) {
	Error['captureStackTrace'](this, this.constructor);
	this.name = this.constructor.name;
	this.message = String(message);
	this.statusCode = parseInt(statusCode || 500, 10);
};

module.exports = OpskinsError;

