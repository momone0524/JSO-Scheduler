<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  const lang = $derived(auth.user?.language ?? 'en');
  const eventId = page.params.eventId;

  let jobName = $state('');
  let startTime = $state('');
  let endTime = $state('');
  let description = $state('');
  let submitting = $state(false);

  onMount(() => {
    if (auth.user?.role !== 'Board Member') {
      toast.error(t(lang, 'unauthorized'));
      goto('/events');
    }
  });

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      await api.post(`/events/${eventId}/jobs`, {
        jobName,
        description,
        startTime,
        endTime,
      });

      toast.success(t(lang, 'jobCreated'));
      goto(`/events/${eventId}/jobs`);
    } catch (error) {
      toast.error(t(lang, 'jobCreateFailed'));
    } finally {
      submitting = false;
    }
  }
</script>

<h1>{t(lang, 'createJob')}</h1>

<form onsubmit={handleSubmit}>
  <label>
    {t(lang, 'jobName')}
    <input type="text" bind:value={jobName} required />
  </label>

  <label>
    {t(lang, 'description')}
    <input type="text" bind:value={description} required />
  </label>

  <label>
    {t(lang, 'startTime')}
    <input type="time" bind:value={startTime} required />
  </label>

  <label>
    {t(lang, 'endTime')}
    <input type="time" bind:value={endTime} required />
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? t(lang, 'creatingJob') : t(lang, 'createJob')}
  </button>

  <a href={`/events/${eventId}/jobs`} role="button" class="secondary">
    {t(lang, 'cancel')}
  </a>
</form>
