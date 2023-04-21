<script>
	import { goto } from '$app/navigation';
	// @ts-ignore
	import { authStore } from '../store/store';

	// data should contain access_token, token_type etc...
	export let data;

	$: finishAuth($authStore.user);

	/**
	 * @param {any} user
	 */
	async function finishAuth(user) {
		if (user) {
			// you can now save the data in the database
			// then you can redirect the user to the page "dashboard"
			goto('/dashboard');
		}
	}
</script>

<strong>Finishing authentication...</strong>
