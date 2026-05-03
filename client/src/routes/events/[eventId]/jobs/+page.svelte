<script lang="ts">
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface JobItem {
    jobId: string;
    jobName: string;
  }

  interface GetJobResponse {
    jobs: JobItem[];
  }

  const isBoardMember = $derived(auth.user?.role === 'Board Member');
  const lang = $derived(auth.user?.language ?? 'en');
  let jobs = $state<JobItem[]>([]);
  let loading = $state(true);
  const eventId = page.params.eventId;

  onMount(async () => {
    try {
      const result = await api.get<GetJobResponse>(`/event/${eventId}/jobs`);
      jobs = result.data.jobs;
    } catch (error) {
      console.error(error);
      toast.error(t(lang, 'jobLoadFailed'));
    } finally {
      loading = false;
    }
  });
</script>

<h1>{t(lang, 'jobs')}</h1>

{#if loading}
  <p aria-busy="true">{t(lang, 'loadingJobs')}</p>
{:else if jobs.length === 0}
  <p>{t(lang, 'noJobFound')}</p>
{:else}
  <div class="member-list">
    {#each jobs as job}
      <article class="member-card">
        <h2>{job.jobName}</h2>
        <a href={`/events/${eventId}/jobs/${job.jobId}`} role="button">
          {t(lang, 'checkAssignment')}
        </a>
      </article>
    {/each}
    <a href={`/events`} role="button" class="secondary">
      {t(lang, 'goback')}
    </a>

    {#if isBoardMember}
      <a href={`/events/${eventId}/jobs/create`} role="button" class="secondary">
        {t(lang, 'createJob')}
      </a>
    {/if}
  </div>
{/if}
