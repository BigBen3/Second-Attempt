<script>
	// @ts-nocheck

	import { onDestroy, onMount } from 'svelte';
	import { auth, db } from '../lib/firebase/firebase';
	import { getDoc, doc, setDoc } from 'firebase/firestore';
	import { authStore } from '../store/store';

	const nonAuthRoutes = ['/', 'connecting', 'connect', 'dashboard'];

	let dataToSetToStore;

	onMount(async () => {
		console.log('Mounting');
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			const currentPath = window.location.pathname;

			if (!user && !nonAuthRoutes.includes(currentPath)) {
				window.location.href = '/';
				return;
			}

			if (user && currentPath === '/') {
				window.location.href = '/connect';
				return;
			}

			if (!user) {
				return;
			}

			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) {
				const userDocRef = doc(db, 'users', user.uid);
				await setDoc(userDocRef, {
					email: user.email
				});
			} else {
				dataToSetToStore = docSnap.data();
			}

			authStore.update((store) => ({
				...store,
				user,
				data: dataToSetToStore,
				loading: false
			}));
		});

		// Cleanup function to unsubscribe from the auth state observer
		onDestroy(() => {
			unsubscribe();
		});

		// Check for a userUID cookie and log in the user if it exists
		const cookies = parse(document.cookie);
		const userUID = cookies.userUID;
		if (userUID) {
			const docRef = doc(db, 'users', userUID);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				dataToSetToStore = docSnap.data();
				authStore.update((store) => ({
					...store,
					isLoggedIn: true,
					userData: dataToSetToStore,
					isLoading: false
				}));
			}
		}
	});
</script>

<div class="mainContainer">
	<slot />
</div>

<style>
	.mainContainer {
		min-height: 100vh;
		background: linear-gradient(to right, #000428, #000046);
		color: white;
		position: relative;
		display: flex;
		flex-direction: column;
	}
</style>
