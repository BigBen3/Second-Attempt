
//this happens first then the server.ts
//this sends you to the auth page
//the server ts gets the 
export const load = async () => {

	const idToken = await loadFirebaseIdToken();

	const cookieHeader = `Authorization=Bearer ${idToken}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24}`;
	const headers = {
	  'Set-Cookie': cookieHeader,
	};
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
		'http://localhost:5173/api/auth/callback/spotify'
	);
	spotifyAuthUrl.searchParams.append('state', state);


	return {headers,  spotifyAuthUrl: spotifyAuthUrl.toString() };
};
function loadFirebaseIdToken() {
	throw new Error("Function not implemented.");
}

