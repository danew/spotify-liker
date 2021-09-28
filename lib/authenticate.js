const http = require('http');
const url = require('url');
const SpotifyWebApi = require('spotify-web-api-node');
const open = require('open');
const config = require('./config');

function getAuthorizationUrl({ redirectUri, clientId, scopes }) {
  const state = 'khulgcpszvu';
  const spotifyApi = new SpotifyWebApi({ redirectUri, clientId });
  return spotifyApi.createAuthorizeURL(scopes, state);
}

function getCode() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('request timeout'), 30000);
    let server;
    async function requestHandler(req, res) {
      const { query } = url.parse(req.url, true);
      res.writeHead(200);
      res.end();
      server.close();
      resolve(query.code);
    }
    server = http.createServer(requestHandler);
    server.listen(4453);
  });
}

async function getAuthorizationCode(options) {
  const authorizationUrl = getAuthorizationUrl(options);
  const code = getCode();
  await open(authorizationUrl);
  return code;
}

async function getTokens(options) {
  try {
    const code = await getAuthorizationCode(options);
    const spotifyApi = new SpotifyWebApi(options);
    const data = await spotifyApi.authorizationCodeGrant(code);
    const expiry = Date.now() + (data.body['expires_in'] * 1000);
    return {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiry,
    }
  } catch {
    return null;
  }
}

async function refreshTokens({ clientId, clientSecret, refreshToken }) {
  try {
    const spotifyApi = new SpotifyWebApi({ clientId, clientSecret, refreshToken });
    const data = await spotifyApi.refreshAccessToken();
    const expiry = Date.now() + (data.body['expires_in'] * 1000);
    return {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiry,
    }
  } catch {
    return null;
  }
}

function saveTokens({ accessToken, refreshToken, expiry }) {
  config.set('accessToken', accessToken);
  config.set('refreshToken', refreshToken);
  config.set('expiry', expiry);
}

module.exports = async function authenticate(options) {
  if (!options) {
    throw new Error('Needs to provide authentication options');
  }

  const expiredAt = config.get('expiry');
  if (expiredAt && expiredAt < Date.now()) {
    const refreshToken = config.get('refreshToken');
    let tokens = await refreshTokens({ ...options, refreshToken });
    if (tokens) {
      tokens = await getTokens(options);
    }
    if (!tokens) {
      throw new Error('failed to authenticate');
    }
    saveTokens(tokens);
  }

  if (!(config.has('accessToken') && config.has('refreshToken') && config.has('expiry'))) {
    const tokens = await getTokens(options);
    saveTokens(tokens);
  }

  return {
    accessToken: config.get('accessToken'),
    refreshToken: config.get('refreshToken'),
  }
}
