// /api/auth/callback/spotify/+page.server.js
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

/** @type {import('$types').PageServerLoad} */
export async function load({ url }) {

  const code = url.searchParams.get('code');
  const authKey = Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString(
    'base64'
  );
  const headers = new Headers();
  headers.append('Authorization', `Basic ${authKey}`);
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Accept', 'application/json');

  const spotifyURL = new URL('https://accounts.spotify.com/api/token');
  spotifyURL.searchParams.append('code', code as string);
  spotifyURL.searchParams.append('redirect_uri', 'http://localhost:5173/connecting');
  spotifyURL.searchParams.append('grant_type', 'authorization_code');
  spotifyURL.searchParams.append('client_id', SPOTIFY_CLIENT_ID);

  console.log(spotifyURL.toString());

  const result = await fetch(spotifyURL, {
    method: 'POST',
    headers
  });
  if (!result.ok) {
    throw redirect(302, '/?error=A problemo');
  }
  const data = await result.json();
  const accessToken = data.access_token;
  const requestToken = data.refresh_token;
  const dataToStore = {
    accessToken: accessToken,
    refreshToken: requestToken
  };
  return {tokens: dataToStore};
}