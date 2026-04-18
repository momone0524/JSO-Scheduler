<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  let eventName = $state('');
  let place = $state('');
  let date = $state('');
  let startTime = $state('');
  let endTime = $state('');
  let submitting = $state(false);

  const lang = $derived(auth.user?.language ?? 'en');

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
      const now = new Date();

      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);

      if (startDateTime <= now) {
        toast.error(t(lang, 'eventMustBeFuture'));
        submitting = false;
        return;
      }

      if (startDateTime >= endDateTime) {
        toast.error(t(lang, 'invalidTimeRange'));
        submitting = false;
        return;
      }

      await api.post('/events', {
        eventName,
        place,
        date,
        startTime,
        endTime,
      });

      toast.success(t(lang, 'eventCreated'));
      goto('/events');
    } catch (error) {
      toast.error(t(lang, 'eventCreateFailed'));
    } finally {
      submitting = false;
    }
  }
</script>

<h1>{t(lang, 'createEvent')}</h1>

<form onsubmit={handleSubmit}>
  <label>
    {t(lang, 'eventName')}
    <input type="text" bind:value={eventName} required />
  </label>

  <label>
    {t(lang, 'place')}
    <input type="text" bind:value={place} required />
  </label>

  <label>
    {t(lang, 'date')}
    <input type="date" bind:value={date} required />
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
    {submitting ? t(lang, 'creatingEvent') : t(lang, 'createEvent')}
  </button>

  <a href={`/events`} role="button" class="secondary">
    {t(lang, 'cancel')}
  </a>
</form>
