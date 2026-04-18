<script lang="ts">
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface EventItem {
    eventId: string;
    eventName: string;
    place: string;
    date: string;
    startTime: string;
    endTime: string;
  }

  const isBoardMember = $derived(auth.user?.role === 'Board Member');
  const lang = $derived(auth.user?.language ?? 'en');
  let events: EventItem[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const result = await api.get<{ events: EventItem[] }>('/events');
      console.log('users response:', result);
      events = result.events;
    } catch (error) {
      toast.error(t(lang, 'failedToLoadEvents'));
      events = [];
    } finally {
      loading = false;
    }
  });
</script>

<h1>{t(lang, 'events')}</h1>
<p>{t(lang, 'viewAllEvents')}</p>

{#if loading}
  <p aria-busy="true">{t(lang, 'loadingEvents')}</p>
{:else if events.length === 0}
  <p>{t(lang, 'noEventsFound')}</p>
{:else}
  <div class="member-list">
    {#each events as event}
      <article class="member-card">
        <h2>{event.eventName}</h2>
        <p><strong>{t(lang, 'place')}:</strong> {event.place}</p>
        <p><strong>{t(lang, 'date')}:</strong> {event.date.split('T')[0]}</p>
        <p><strong>{t(lang, 'startTime')}:</strong> {event.startTime.slice(0, 5)}</p>
        <p><strong>{t(lang, 'endTime')}:</strong> {event.endTime.slice(0, 5)}</p>

        {#if isBoardMember}
          <p>
            <a href={`/events/${event.eventId}/update`} role="button" class="secondary">
              {t(lang, 'update')}
            </a>

            <a href={`/events/${event.eventId}/polls`} role="button" class="secondary">
              {t(lang, 'createPoll')}
            </a>
          </p>
        {/if}

        <p>
          <a href={`/events/${event.eventId}/attendance`} role="button">
            {t(lang, 'attendance')}
          </a>

          <a href={`/events/${event.eventId}/jobs`} role="button">
            {t(lang, 'checkJobs')}
          </a>
        </p>
      </article>
    {/each}
    {#if isBoardMember}
      <p>
        <a href={`/events/create`} role="button">
          {t(lang, 'createEvent')}
        </a>
      </p>
    {/if}
  </div>
{/if}
