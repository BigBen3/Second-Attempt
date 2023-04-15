<script lang="ts">
	import type { PageData } from './$types';
	//import { authHandlers } from  '../store/store';
	export let data: PageData;
</script>

<h1>Hello new user</h1>

<a href={data.spotifyAuthUrl}>
	<img
		src="https://play-lh.googleusercontent.com/eN0IexSzxpUDMfFtm-OyM-nNs44Y74Q3k51bxAMhTvrTnuA4OGnTi_fodN4cl-XxDQc"
		alt="hello"
		width="500"
		height="500"
	/>
</a>

<!-- <button on:click={authHandlers.logout}>
            <p>Logout</p></button>-->
