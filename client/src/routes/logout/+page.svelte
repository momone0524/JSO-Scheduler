<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  onMount(async () => {
    try {
      await api.del('/sessions');
      auth.setUser(null);
      toast.info('Logged out');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out');
    } finally {
      goto('/');
    }
  });
</script>

<p>Logging out...</p>
