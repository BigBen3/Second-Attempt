// /api/auth/callback/spotify/+page.server.js
import { SPOTIFY_CLIENT_ID, SPOTIFY_SECRET } from '$env/static/private';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function GET({ url }) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: JSON.stringify({
      code: code,
      redirect_uri: 'https://yourdomain.com/api/auth/callback/spotify',
      grant_type: 'authorization_code'
    }),
    headers: {
        'Authorization': 'Basic ' + (new Buffer.fromn(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_SECRET).toString('base64'))
      },
  });
  
  if (res.ok) {
    return await res.json();
  } else {
    throw error(500, 'Internal error');
  }
}