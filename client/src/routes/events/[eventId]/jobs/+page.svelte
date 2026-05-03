<script lang="ts">
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  const eventId = page.params.eventId;

  interface Job {
    jobId: string;
    jobName: string;
  }

  let jobs = $state<Job[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const result = await api.get<{ jobs: Job[] }>(`/events/${eventId}/jobs`);
      console.log(result.data);
      jobs = result.data.jobs;
    } catch (error) {
      toast.error('Failed to load job');
    } finally {
      loading = false;
    }
  });
</script>

<h1>Jobs</h1>

<a href={`/events/${eventId}/jobs/create`} role="button" class="secondary"> Create Job </a>

{#if loading}
  <Loading />
{:else if jobs.length === 0}
  <p>Job not found</p>
{:else}
  {#each jobs as job}
    <article>
      <h2>{job.jobName}</h2>

      <a href={`/events/${eventId}/jobs/${job.jobId}`} role="button" class="secondary"> view </a>
    </article>
  {/each}
{/if}
