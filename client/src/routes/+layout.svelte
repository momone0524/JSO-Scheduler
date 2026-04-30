<script lang="ts">
  import { auth } from '$lib/auth.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import { t } from '$lib/i18n';
  import '../app.css';

  let { children } = $props();

  const loaded = $derived(!auth.loading);
  const user = $derived(auth.user);
  const lang = $derived(auth.user?.language ?? 'en');
</script>

{#if !loaded}
  <p aria-busy="true">{t(lang, 'startingUp')}</p>
{:else}
  <nav class="container">
    <ul>
      <li><a href="/"><strong>{t(lang, 'dashboard')}</strong></a></li>
    </ul>
    <ul>
      {#if user}
        <li>{user.displayName}</li>
        <li><a href="/logout">{t(lang, 'logout')}</a></li>
      {:else}
        <li><a href="/login">{t(lang, 'login')}</a></li>
        <li><a href="/register">{t(lang, 'register')}</a></li>
      {/if}
    </ul>
  </nav>

  <main class="container">
    {@render children()}
  </main>
  <Toast />
{/if}

<main class="container">
  {@render children()}
</main>
<Toast />
