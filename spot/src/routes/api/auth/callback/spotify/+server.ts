import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { auth, db } from '$lib/firebase/firebase';
import { redirect} from '@sveltejs/kit';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { parse } from 'cookie';
import type { IncomingMessage } from 'http';
export const GET = async ({ request, url }) => {
	const cookies = parse((request as unknown as IncomingMessage).headers.cookie || '');
  const userUID = cookies.userUID;
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
  spotifyURL.searchParams.append('redirect_uri', 'http://localhost:5173/api/auth/callback/spotify');
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

  console.log("access token " + accessToken);
  console.log("refresh token " + requestToken);

  const userRef = doc(db, 'users', userUID);
  const dataToStore = {
    accessToken: accessToken,
    refreshToken: requestToken
  };

  try {
    await setDoc(userRef, dataToStore, { merge: true });
    console.log("Data stored successfully");
  } catch (error) {
    console.error("Error storing user data", error);
    throw new Error('Error storing user data');
  }

  throw redirect(302, "/dashboard");
};

export const POST = async (refreshToken: string, clientId: string, clientSecret: string) => {
	const authKey = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
	const headers = new Headers();
	headers.append('Authorization', `Basic ${authKey}`);
	headers.append('Content-Type', 'application/x-www-form-urlencoded');
  
	const body = new URLSearchParams();
	body.append('grant_type', 'refresh_token');
	body.append('refresh_token', refreshToken);
  
	const spotifyURL = new URL('https://accounts.spotify.com/api/token');
  
	const result = await fetch(spotifyURL, {
	  method: 'POST',
	  headers,
	  body,
	});
  
	if (!result.ok) {
	  throw new Error('Failed to refresh access token');
	}
  
	const data = await result.json();
	return data.access_token;
  };