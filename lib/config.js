const Conf = require('conf');

const schema = {
	accessToken: {
		type: 'string',
	},
	refreshToken: {
		type: 'string',
	},
  expiry: {
		type: 'number',
	},
	clientId: {
		type: 'string',
	},
	clientSecret: {
		type: 'string',
	},
};

const config = new Conf({ schema });

module.exports = config;
