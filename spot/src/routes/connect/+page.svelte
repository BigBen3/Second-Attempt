<script lang="ts">
    import type { PageData } from './$types';
    import { authHandlers } from  '../store/store';
    export let data: PageData;
</script>


<h1>Hello new user</h1>


<a
			href={data.spotifyAuthUrl}
			class="px-4 py-2 rounded-full bg-[#1DB954] font-bold hover:bg-opacity-90 active:translate-y-1 transition-all duration-300"
		>
			Get started
		</a>


        <button on:click={authHandlers.logout}>
            <p>Logout</p></button>