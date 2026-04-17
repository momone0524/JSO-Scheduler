<script lang="ts">
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface Poll {
    pollId: string;
    title: string;
    closeDate: string;
    pollType: string;
  }

  let polls: Poll[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      polls = await api.get<Poll[]>('/api/polls');
    } catch (error) {
      toast.error('Failed to load polls.');
    } finally {
      loading = false;
    }
  });
</script>

<h1>Polls</h1>

{#if loading}
  <Loading />
{:else if polls.length === 0}
  <p>There are not polls yet.</p>
{:else}
  <ul>
    {#each polls as poll (poll.pollId)}
      <li>
        <a href="/polls/{poll.pollId}">{poll.title}</a>
        <strong>{poll.title}</strong><br />
        Close Date: {poll.closeDate}<br />
        Poll Type: {poll.pollType}<br />
        <a href="/polls/{poll.pollId}" role="button">Detail</a>
      </li>
    {/each}
  </ul>
{/if}

<a href="/login">Log In</a>
<a href="/register">Register</a>
