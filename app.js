const SpotifyWebApi = require('spotify-web-api-node');
const authenticate = require('./lib/authenticate');

const clientConfiguration = {
  redirectUri: 'http://localhost:4453',
  scopes: ['user-library-modify', 'user-read-currently-playing'],
};

async function main() {
  const tokens = await authenticate(clientConfiguration);
  const spotifyApi = new SpotifyWebApi(tokens);
  const currentlyPlaying = await spotifyApi.getMyCurrentPlayingTrack();
  const trackId = currentlyPlaying.body.item.id;
  await spotifyApi.addToMySavedTracks([trackId]);
}

main().finally(() => {
  process.exit();
});
