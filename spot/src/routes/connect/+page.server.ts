import { setCookie } from '@sveltejs/kit/node';
//maybe load this to the public load and get the cookie there
export const load = async ({ context }) => {
  setCookie(context, 'userUID', '12345', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });


  const spotifyAuthUrl = new URL(`https://accounts.spotify.com/authorize?`);
  const state = crypto.randomUUID();

  spotifyAuthUrl.searchParams.append('response_type', 'code');
  spotifyAuthUrl.searchParams.append('client_id', import.meta.env.VITE_SPOTIFY_CLIENT_ID);
  spotifyAuthUrl.searchParams.append(
    'scope',
    'playlist-read-private playlist-read-collaborative'
  );
  spotifyAuthUrl.searchParams.append(
    'redirect_uri',
    'http://localhost:5173/api/auth/callback/spotify'
  );
  spotifyAuthUrl.searchParams.append('state', state);

  return { spotifyAuthUrl: spotifyAuthUrl.toString() };
};
