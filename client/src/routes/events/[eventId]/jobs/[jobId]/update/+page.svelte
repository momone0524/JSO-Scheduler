<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface JobItem {
    jobId: string;
    jobName: string;
    description: string;
  }

  interface GetJobResponse {
    job: JobItem;
  }

  const lang = $derived(auth.user?.language ?? 'en');
  const eventId = page.params.eventId;
  const jobId = page.params.jobId;
  let jobName = $state('');
  let description = $state('');
  let loading = $state(true);
  let submitting = $state(false);

  onMount(async () => {
    try {
      if (auth.user?.role !== 'Board Member') {
        toast.error(t(lang, 'unauthorized'));
        goto(`/events/${eventId}/jobs/${jobId}`);
      }

      const result = await api.get<GetJobResponse>(`/jobs/${jobId}`);
      const job = result.data.job;

      jobName = job.jobName;
      description = result.data.job.description;
    } catch (error) {
      toast.error(t(lang, 'jobLoadFailed'));
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      await api.patch(`/jobs/${jobId}/update`, {
        jobName,
        description,
      });

      toast.success(t(lang, 'jobUpdated'));
      goto(`/events/${eventId}/jobs`);
    } catch (error) {
      toast.error(t(lang, 'jobUpdateFailed'));
    } finally {
      submitting = false;
    }
  }
</script>

{#if loading}
  <p aria-busy="true">{t(lang, 'loadingjob')}</p>
{:else}
  <h1>{t(lang, 'updatejob')}</h1>

  <form onsubmit={handleSubmit}>
    <label>
      {t(lang, 'jobName')}
      <input type="text" bind:value={jobName} />
    </label>

    <label>
      {t(lang, 'description')}
      <input type="text" bind:value={description} />
    </label>

    <button type="submit" disabled={submitting}>
      {submitting ? t(lang, 'updating') : t(lang, 'update')}
    </button>

    <a href={`/events/${eventId}/jobs`} role="button" class="secondary">
      {t(lang, 'cancel')}
    </a>
  </form>
{/if}
