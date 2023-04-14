import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { redirect} from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const code = url.searchParams.get('code');
	const authStr = `\${clientId}:\${clientSecret}`;
	const b64AuthStr = Buffer.from(authStr).toString('base64');
	const headers = new Headers();
	headers.append('Authorization', `Basic ${b64AuthStr}`);
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
	
	const data = await result.json();

	const accessToken = data.access_token;
	const requestToken = data.refresh_token;
	console.log("it is " + result.status);
	console.log("access token " + accessToken);
	console.log("refresh token " + requestToken)
	
	
	if (!result.ok) {
		throw redirect(302, '/?error=A problemo');
	}
	
	throw redirect(302, "/dashboard")
	
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