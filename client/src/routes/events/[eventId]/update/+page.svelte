<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface EventItem {
    eventName: string;
    place: string;
    date: string;
    startTime: string;
    endTime: string;
  }

  interface GetEventResponse {
    event: EventItem;
  }

  const lang = $derived(auth.user?.language ?? 'en');

  let loading = $state(true);
  let submitting = $state(false);

  let eventName = $state('');
  let place = $state('');
  let date = $state('');
  let startTime = $state('');
  let endTime = $state('');

  onMount(async () => {
    try {
      const id = page.params.eventId;
      const result = await api.get<GetEventResponse>(`/events/${id}`);
      const event = result.event;

      eventName = event.eventName;
      place = event.place;
      date = event.date.split('T')[0];
      startTime = event.startTime;
      endTime = event.endTime;
    } catch (error) {
      console.error(error);
      toast.error(t(lang, 'failedToLoadEvent'));
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      const id = page.params.eventId;

      await api.patch(`/events/${id}/update`, {
        eventName,
        place,
        date,
        startTime,
        endTime,
      });

      toast.success(t(lang, 'eventUpdated'));
      goto(`/events`);
    } catch (error) {
      toast.error(t(lang, 'updateFailed'));
    } finally {
      submitting = false;
    }
  }
</script>

{#if loading}
  <p aria-busy="true">{t(lang, 'loadingEvent')}</p>
{:else}
  <h1>{t(lang, 'updateEvent')}</h1>

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
      {submitting ? t(lang, 'updating') : t(lang, 'update')}
    </button>

    <a href={`/events`} role="button" class="secondary">
      {t(lang, 'cancel')}
    </a>
  </form>
{/if}
