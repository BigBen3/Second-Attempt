<script lang="ts">
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebase/firebase';
	import { doc, setDoc } from 'firebase/firestore';
	import { authStore } from '../../store/store.js';
	// @ts-ignore

	// data should contain access_token, token_type etc...
	export let data;
	//$: reactive statement everytime something changes it calls the function again
	// $ in the authstore is a reactive element updates everytime a user changes and then the reactive statement kicks in and calls the function again
	$: finishAuth($authStore.user);

	/**
	 * @param {any} user
	 */
	async function finishAuth(user: any) {
		if (user) {
			const userRef = doc(db, 'users', user.uid);
			await setDoc(userRef, data.tokens, { merge: true });
			// you can now save the data in the database
			// then you can redirect the user to the page "dashboard"
			goto('/dashboard');
		}
	}
</script>

<strong>Finishing authentication...</strong>
