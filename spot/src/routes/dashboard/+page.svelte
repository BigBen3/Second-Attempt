<script>
	import { authHandlers } from '../../store/store';
</script>

<h1>Your songs</h1>

<button on:click={authHandlers.logout}> <p>Logout</p></button>
