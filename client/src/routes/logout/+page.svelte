<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  const lang = $derived(auth.user?.language ?? 'en');
  onMount(async () => {
    try {
      await api.del('/sessions');
      auth.setUser(null);

      toast.info(t(lang, 'loggedOut'));
    } catch (error) {
      console.error('Logout failed:', error);

      toast.error(t(lang, 'logoutFailed'));
    } finally {
      goto('/');
    }
  });
</script>

<p>{t(lang, 'loggingOut')}</p>
