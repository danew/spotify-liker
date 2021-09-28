# Spotlify Liker
The is a simple script which uses the Spotify Web API to like the song you're currently playing.

## Getting Started
1. Clone and change directory
   ```sh
   git clone git@github.com:danew/spotify-liker.git && cd spotify-liker
   ```
2. Install
   ```sh
   npm i
   ```
3. Initialise config with your client configuration, if you don't have one create one in [Spotify's Developer Dashboard](https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app) — make sure to configure the redirect URL to `http://localhost:4453`.
   ```sh
   ./setCreds <client id> <client secret>
   ```
4. Run the script — beware it will open a browser so you can authorize your account to be accessed.
   ```sh
   node app.js
   ```
5. Connect it to your favourite hotkey manager — I use [Alfred](https://www.alfredapp.com/).