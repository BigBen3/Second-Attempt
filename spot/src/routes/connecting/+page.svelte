<script lang="ts">
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebase/firebase';
	import { doc, setDoc } from 'firebase/firestore';
	// @ts-ignore
	import { authStore } from '../store/store';

	// data should contain access_token, token_type etc...
	export let data;

	$: finishAuth($authStore.user);

	/**
	 * @param {any} user
	 */
	async function finishAuth(user: any) {
		if (user) {
			const userRef = doc(db, 'users', user.uid);
			await setDoc(userRef, data.data, { merge: true });
			// you can now save the data in the database
			// then you can redirect the user to the page "dashboard"
			goto('/dashboard');
		}
	}
</script>

<strong>Finishing authentication...</strong>
