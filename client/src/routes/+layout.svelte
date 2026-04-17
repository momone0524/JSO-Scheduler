<script lang="ts">
  import { auth } from '$lib/auth.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import '../app.css';

  let { children } = $props();
  const loaded = $derived(!auth.loading);
  const user = $derived(auth.user);
</script>

{#if !loaded}
  <p aria-busy="true">Starting up...</p>
{:else}
  <nav class="container">
    <ul>
      <li><a href="/"><strong>Dashboard</strong></a></li>
    </ul>
    <ul>
      {#if user}
        <li>{user.displayName}</li>
        <li><a href="/logout">Log Out</a></li>
      {:else}
        <li><a href="/login">Log In</a></li>
        <li><a href="/register">Register</a></li>
      {/if}
    </ul>
  </nav>

  <main class="container">
    {@render children()}
  </main>
  <Toast />
{/if}
