<script>
// @ts-nocheck

import { onDestroy, onMount } from 'svelte';
import { auth, db } from '../lib/firebase/firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { authStore } from '../store/store';
import { serialize, parse } from 'cookie';

const nonAuthRoutes = ['/', 'api/auth/callback/spotify', 'dashboard'];

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
      // Clear the 'userUID' cookie when the user logs out
      const uidCookie = serialize('userUID', '', {
        maxAge: -1,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict'
      });
      document.cookie = uidCookie;
      return;
    }

    // Set the user's Firebase UID in a cookie
    const userUID = user.uid;
    const uidCookie = serialize('userUID', userUID, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict'
    });
    document.cookie = uidCookie;

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        todos: [],
      });
    } else {
      dataToSetToStore = docSnap.data();
    }

    authStore.update((store) => ({
      ...store,
      isLoggedIn: true,
      userData: dataToSetToStore,
      isLoading: false,
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
        isLoading: false,
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
