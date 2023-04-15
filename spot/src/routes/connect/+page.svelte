<script lang="ts">
	import { authHandlers } from '../../store/store';
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
<div class="mainContainer">
	<div class="headerContainer">
		<div class="headerBtns">
			<button on:click={authHandlers.logout}>
				<i class="fa-solid fa-right-from-bracket" />
				<p>Logout</p></button
			>
		</div>
	</div>
</div>

<style>
	.mainContainer {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		gap: 24px;
		padding: 24px;
		width: 100%;
		max-width: 1000px;
		margin: 0 auto;
	}

	.headerContainer {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.headerContainer button {
		background: #003c5b;
		color: white;
		padding: 10px 18px;
		border: none;
		border-radius: 4px;
		font-weight: 700;
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
	}

	.headerBtns {
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.headerContainer button i {
		font-size: 1.1rem;
	}

	.headerContainer button:hover {
		opacity: 0.7;
	}
</style>
