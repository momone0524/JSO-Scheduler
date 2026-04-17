<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';

  let email = $state('');
  let password = $state('');
  let submitting = $state(false);

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      await api.post('/login', { email, password });
      await auth.refresh();
      toast.success('Logged in successfully.');
      goto('/');
    } catch (error) {
      toast.error('Invalid email or password.');
    } finally {
      submitting = false;
    }
  }
</script>

<h1>Log In</h1>

<form onsubmit={handleSubmit}>
  <label>
    Email
    <input type="email" bind:value={email} required />
  </label>

  <label>
    Password
    <input type="password" bind:value={password} required />
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? 'Logging in...' : 'Log In'}
  </button>
</form>

<p>Don’t have an account? <a href="/register">Register</a></p>
