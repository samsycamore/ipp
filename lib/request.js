const axios = require('axios').default;


module.exports = function (opts, buffer, cb) {
	let url
	//All IPP requires are POSTs- so we must have some data.
	//  10 is just a number I picked- this probably should have something more meaningful
	if (!Buffer.isBuffer(buffer) || buffer.length < 10) {
		return cb(new Error("Data required"));
	}

	if (typeof opts === "string") {
		url = opts
	} else {
		url = opts.href
	}
	const headers = {}
	headers['Content-Type'] = 'application/ipp';
	
	
	axios.post(url, buffer, {
		headers,
	})
		.then(res => {
			if (res.status === 200) {
				cb(null, res)
			} else {
				cb(new IppResponseError(res.status))
			}
		})
		.catch(err => {
			cb(err)
		})
}

function IppResponseError(statusCode, message) {
  this.name = 'IppResponseError';
  this.statusCode = statusCode;
  this.message = message || 'Received unexpected response status ' + statusCode + ' from the printer';
  this.stack = (new Error()).stack;
}
IppResponseError.prototype = Object.create(Error.prototype);
IppResponseError.prototype.constructor = IppResponseError;
