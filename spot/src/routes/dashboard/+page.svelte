<script lang="ts">
	import { authHandlers } from '../../store/store';
	import { authStore } from '../../store/store.js';
	const getUserId = async () => {
		await fetch('https://api.spotify.com/v1/me');
	};

	//get logged in user
	//then get there access token
	//then get send post request
</script>

<h1>Your songs</h1>
<div class="mainContainer">
	<div class="data">
		<!---->
	</div>

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
