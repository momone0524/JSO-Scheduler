<script lang="ts">
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import Loading from '$lib/components/Loading.svelte';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  const eventId = page.params.eventId;
  const jobId = page.params.jobId;

  interface Job {
    jobId: string;
    jobName: string;
    description: string;
    startTime: string;
    endTime: string;
  }

  let job: Job | null = $state(null);
  let loading = $state(true);

  onMount(async () => {
    try {
      const result = await api.get<Job>(`/events/${eventId}/jobs/${jobId}`);
      job = result.data;
    } catch (error) {
      toast.error('Failed to load job');
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <Loading />
{:else if !job}
  <p>Job not found</p>
{:else}
  <h1>{job.jobName}</h1>

  <p>{job.description}</p>

  <p>
    {job.startTime} - {job.endTime}
  </p>

  <a href={`/events/${eventId}/jobs`} role="button" class="secondary"> Back to Jobs </a>
{/if}
