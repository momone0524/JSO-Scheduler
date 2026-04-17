<script lang="ts">
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';
</script>

{#if auth.loading}
  <p aria-busy="true">Checking session…</p>
{:else if auth.user}
  <p>Signed in as <strong>{auth.user.displayName}</strong> ({auth.user.email}).</p>
  <p>What would you like to do?</p>

  <a href="/events" role="button">View Events</a>
  <a href="/polls" role="button" class="secondary">View Polls</a>
{:else}
  <h1>JSO Scheduler</h1>
  <p>
    Plan events, manage polls, and keep track of attendance for the Japanese Student Organization.
  </p>

  <a href="/register" role="button">Get Started</a>
  <a href="/login" role="button" class="secondary">Log In</a>
{/if}

<article>
  <footer>
    <button type="button" onclick={() => toast.success('Toasts work!')}>Try a toast</button>
  </footer>
</article>
