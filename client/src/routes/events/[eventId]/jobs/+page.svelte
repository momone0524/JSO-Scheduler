<script lang="ts">
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import Loading from '$lib/components/Loading.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  const eventId = page.params.eventId;
  const lang = $derived(auth.user?.language ?? 'en');

  interface Job {
    jobId: string;
    jobName: string;
  }

  let jobs = $state<Job[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const result = await api.get<{ jobs: Job[] }>(`/events/${eventId}/jobs`);
      let loadedJobs = result.data.jobs;
      if (loadedJobs.length === 0) {
        await api.post(`/events/${eventId}/jobs/auto`, {});

        const refreshed = await api.get<{ jobs: Job[] }>(`/events/${eventId}/jobs`);
        loadedJobs = refreshed.data.jobs ?? [];
      }
      jobs = result.data.jobs;
    } catch (error) {
      toast.error('Failed to load job');
    } finally {
      loading = false;
    }
  });
</script>

<h1>{t(lang, 'job')}</h1>

{#if loading}
  <Loading />
{:else if jobs.length === 0}
  <p>{t(lang, 'nojobfound')}</p>
{:else}
  {#each jobs as job}
    <article>
      <h2>{t(lang, 'jobName')}: {job.jobName}</h2>

      <a href={`/events/${eventId}/jobs/${job.jobId}/assignment`} role="button" class="secondary">
        {t(lang, 'member')}
      </a>

      <a href={`/events/${eventId}/jobs/${job.jobId}/update`} role="button" class="secondary">
        {t(lang, 'update')}
      </a>
    </article>
  {/each}
{/if}

<a href={`/events/${eventId}/jobs/create`} role="button" class="secondary">
  {t(lang, 'createJob')}
</a>
