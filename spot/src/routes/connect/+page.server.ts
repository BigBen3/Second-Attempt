//maybe load this to the public load and get the cookie there
export const load = async () => {


  const spotifyAuthUrl = new URL(`https://accounts.spotify.com/authorize?`);
  const state = crypto.randomUUID();

  spotifyAuthUrl.searchParams.append('response_type', 'code');
  spotifyAuthUrl.searchParams.append('client_id', import.meta.env.VITE_SPOTIFY_CLIENT_ID);
  spotifyAuthUrl.searchParams.append(
    'scope',
    'playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-read-email user-read-private'
  );
  spotifyAuthUrl.searchParams.append(
    'redirect_uri',
    'http://localhost:5173/connecting'
  );
  spotifyAuthUrl.searchParams.append('state', state);

  return { spotifyAuthUrl: spotifyAuthUrl.toString() };
};
