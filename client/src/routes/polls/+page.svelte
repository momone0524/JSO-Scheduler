<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import { addToast } from 'lib/toast.svelte';
  import { onMount } from 'svelte';
  const { get } = api;

  interface Poll {
    pollId: string;
    title: string;
    closeDate: string;
    pollType: string;
  }

  let poll: Poll | null = $state(null);
  let loading = $state(true);

  onMount(async () => {
    const result = await get<Poll[]>('/api/polls');
    if (result.status === 401) {
      addToast('Please log in to contunue', 'error');
      goto('/login');
      return;
    }

    if (result.ok) {
      poll = result.data;
    } else {
      addToast('Failed to load polls', 'error');
    }
    loading = false;
  });
</script>

<h1>Polls</h1>

{#if loading}
  <Loading />
{:else if !poll}
  <p>Poll not found.</p>
{:else}
  <h1>{poll.title}</h1>
  <p>Type: {poll.pollType}</p>
  <p>Close Date:{poll.closeDate}</p>
{/if}

<a href="/login">Log In</a>
<a href="/register">Register</a>
