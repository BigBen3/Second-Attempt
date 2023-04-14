<script>
	// @ts-nocheck

	//we have this in the layout so all the pages inherit this
	import { onDestroy, onMount } from 'svelte';
	import { auth, db } from '../lib/firebase/firebase';
	import { getDoc, doc, setDoc } from 'firebase/firestore';
	import { authStore } from '../store/store';
	const nonAuthRoutes = ['/', 'product'];
	let dataToSetToStore;
	/* 
            how it is being done: 
            Here's a high-level overview of the process:
    
    The onAuthStateChanged function listens for changes in the user's authentication state. If the user is not logged in and they are not trying to access a non-authenticated page, the function redirects the user to the root URL.
    
    If the user is logged in, the function retrieves the user's data from the Firebase Firestore database.
    
    If the user's data does not exist in the database, the function creates a new document for the user and sets their email and todos array.
    
    If the user's data does exist in the database, the function retrieves the data and sets it to the dataToSetToStore  variable.
    
    Finally, the function updates the authStore object with the user's authentication state, data, and loading status.
    
    By following this process, the application ensures that the user's data is properly initialized and that the user is redirected to the appropriate pages based on their authentication state.
        */

	//since this is in the layout every svelte page that includes this layout will call this method when you mount that component which just means go on it.
	onMount(() => {
		console.log('Mounting');
		//this listens to when the their is a change in the user authentication state
		//we also set it to a variable called unscribe
		//since this onAuthStateChanged returns a function that called unscribe.
		//This will let you unscribe from the onAuthStateChanged when you don't need it anymore
		//like when you get of this componenet you won't need to listen to auth changes.
		const unsusbribe = auth.onAuthStateChanged(async (user) => {
			//gets the url of the tab your own.
			const currentPath = window.location.pathname;

			// @ts-ignore
			//user variables stores information about the user like if it is logged in etc
			//and if they arent it would be null
			//and since null is considered false in js the ! will convert it to true
			//!user sees if the user exists and !nonAuthRoutes is seeing if the the user is trying to access pages without being logged in.
			//if they are sent them to the root url
			if (!user && !nonAuthRoutes.includes(currentPath)) {
				window.location.href = '/';
				return;
			}

			// if the user is logged in and it is the root url sent them do the dashboard.
			//if the user has some value that is not null it is considered logged in or in other way it is consired true.
			if (user && currentPath === '/') {
				window.location.href = '/dashboard';
				return;
			}

			//this is to catch any edge cases
			//so just in case the last two if statements messed something this will stop the user from going to code that needs them to be logged in.
			//if you are on the right page but not logged in we don't want to go to the firebase logic
			if (!user) {
				return;
			}
			//Firebase database has collections
			//Collections represent types of data
			//Example: Users and Posts
			// Each collectiosn have documents
			//Each document represents an indivudl piece of data in the colleciton
			//For example a docuement in the user collection represents an indivual user and in the post collection represents a indivual post.

			// @ts-ignore

			/*
                        So you first retrieve the specific doc that you want in the collection (its reference)
                        Then you get a snapshot of that doc because retrieving just gives you a reference to it nothing more
                        By getting the snapshot of the doc you know what it looked like like all the data it had but you are not actually reading that data
                        To actually read and use that data you use the .data method
                    */

			//so this code gets the the user doc for the user based on their uid in the user collection and sets it equal to this variable
			//doesn't actual get the data in the doc just gets the doc that contains the data. Like a reference to it
			//So a reference to a docuement is just where the documenet is going to be it does not actual mean that the documenet is there.
			//The reference could be refereing to nothing.
			const docRef = doc(db, 'users', user.uid);
			//This is all of the documenet exists.
			//this the gets a snapshot of the documenet when this method is called so how it looked like. not the actual data
			//if you wanted to get the data then you would do .data
			const docSnap = await getDoc(docRef);
			//since a reference to the documenet doesn't mean that docuemnet actually exists.
			//We check if the snapshot of the reference exits since the represents that data.
			if (!docSnap.exists()) {
				//if the docSnap doesnt exist create a new doc for the user in the users collection
				//creates another variable same as docRef
				//Don't know why but they represent the same thing
				const userRef = doc(db, 'users', user.uid);
				//assings the data to a js object
				dataToSetToStore = {
					email: user.email,
					todos: []
				};
				//merge that js object with the data in the database
				//the set doc creates the doc based off the reference
				//you don't need to merge becuase there is no data
				// you could not have it and it would completey ovverwrite everythign
				//but since there is nothing it doesn't matter;
				await setDoc(userRef, dataToSetToStore, { merge: true });
			}
			//meaning the doc already exists.
			//this is for a user logging in
			//it retreives the data
			//sets loading to false meaning the +page.svelte with load.
			//it seems like this part is for retriving the data of the existing user?
			else {
				//this gets the data from the snapShot
				const userData = docSnap.data();
				//sets that data equal to the js object.
				dataToSetToStore = userData;
			}
			//this updates the sveltestore not the database
			//the curr represents the current object in the store
			// we pass the curr in and spread its values
			authStore.update((curr) => {
				return {
					//creates a new curr object with the updated user data
					...curr,
					user,
					data: dataToSetToStore,
					loading: false
				};
			});
		});
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
