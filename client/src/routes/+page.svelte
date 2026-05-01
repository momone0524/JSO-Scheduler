<script lang="ts">
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { onMount } from 'svelte';

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const lang = $derived(auth.user?.language ?? 'en');

  const weekdays = $derived([
    t(lang, 'sun'),
    t(lang, 'mon'),
    t(lang, 'tue'),
    t(lang, 'wed'),
    t(lang, 'thu'),
    t(lang, 'fri'),
    t(lang, 'sat'),
  ]);

  function getCalendarData(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  }

  const cells = getCalendarData(currentYear, currentMonth);

  const monthLabel = $derived(
    new Date(currentYear, currentMonth, 1).toLocaleString(lang === 'ja' ? 'ja-JP' : 'en-US', {
      month: 'long',
      year: 'numeric',
    }),
  );

  interface EventItem {
    eventId: string;
    eventName: string;
    date: string;
    place: string;
  }

  interface GetEventsResponse {
    events: EventItem[];
  }

  let events = $state<EventItem[]>([]);

  async function loadEvents() {
    try {
      const result = await api.get<GetEventsResponse>('/events');

      console.log('raw result:', result);
      console.log('raw result.events:', result.data.events);
      console.log('first event from result:', result.data.events[0]);

      events = result.data.events;

      console.log('events after assign:', $state.snapshot(events));
    } catch (error) {
      console.error('Failed to load events:', error);
      events = [];
    }
  }

  function parseLocalDate(dateString: string): Date | null {
    if (!dateString) return null;

    const safeDate = dateString.slice(0, 10);
    const parts = safeDate.split('-').map(Number);

    if (parts.length !== 3 || parts.some(Number.isNaN)) {
      return null;
    }

    const [year, month, day] = parts;
    return new Date(year, month - 1, day);
  }

  function getEventsForDay(day: number) {
    return events.filter((event) => {
      const eventDate = parseLocalDate(event.date);
      if (!eventDate) return false;

      return (
        eventDate.getFullYear() === currentYear &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getDate() === day
      );
    });
  }

  onMount(() => {
    loadEvents();
  });
</script>

{#if auth.loading}
  <p aria-busy="true">{t(lang, 'checkingSession')}</p>
{:else if auth.user}
  <h1>{t(lang, 'welcomeToScheduler')}</h1>
  <p>{t(lang, 'signedInAs')} <strong>{auth.user.displayName}</strong> ({auth.user.email}).</p>

  <section>
    <h2>{t(lang, 'calendar')}</h2>
    <p>{t(lang, 'upcomingEventsHere')}</p>

    <article class="calendar-card">
      <header class="calendar-header">
        <strong>{monthLabel}</strong>
      </header>

      <div class="calendar-grid calendar-weekdays">
        {#each weekdays as day}
          <div class="calendar-cell weekday">{day}</div>
        {/each}
      </div>

      <div class="calendar-grid">
        {#each cells as day}
          <div class="calendar-cell day-cell">
            {#if day !== null}
              <div class="date-number">{day}</div>

              {#each getEventsForDay(day) as event}
                <div class="event-badge">{event.eventName}</div>
              {/each}
            {/if}
          </div>
        {/each}
      </div>
    </article>
  </section>

  <div class="actions">
    <a href="/events" role="button">{t(lang, 'viewEvents')}</a>
    <a href="/polls" role="button" class="secondary">{t(lang, 'viewPolls')}</a>
    <a href="/users" role="button">{t(lang, 'viewMembers')}</a>
    <a href={`/users/${auth.user.userId}`} role="button" class="secondary">{t(lang, 'myProfile')}</a
    >
  </div>
{:else}
  <h1>{t(lang, 'schedulerTitle')}</h1>
  <p>{t(lang, 'schedulerDescription')}</p>

  <a href="/register" role="button">{t(lang, 'getStarted')}</a>
  <a href="/login" role="button" class="secondary">{t(lang, 'login')}</a>
{/if}

<style>
  .calendar-card {
    margin-top: 1rem;
    padding: 1rem;
    overflow-x: auto;
  }

  .calendar-header {
    margin-bottom: 1rem;
    text-align: center;
    font-size: 1.1rem;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
  }

  .calendar-weekdays {
    margin-bottom: 0.5rem;
  }

  .calendar-cell {
    text-align: center;
    padding: 0.75rem 0.5rem;
    border: 1px solid #dcdfe4;
    border-radius: 0.5rem;
    min-height: 5rem;
    min-width: 0;
  }

  .weekday {
    font-weight: 700;
    background: #f5f7fa;
  }

  .day-cell {
    background: white;
  }

  .date-number {
    font-weight: 600;
    margin-bottom: 0.25rem;
    margin-bottom: 0.25rem;
  }

  .event-badge {
    margin-top: 0.25rem;
    padding: 0.2rem 0.4rem;
    border-radius: 0.4rem;
    background: #e8f0fe;
    font-size: 0.8rem;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }
</style>
