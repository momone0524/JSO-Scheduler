<script lang="ts">
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function getCalendarData(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  }

  const cells = getCalendarData(currentYear, currentMonth);

  const monthLabel = new Date(currentYear, currentMonth, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  interface EventItem {
    eventId: string;
    eventName: string;
    date: string;
    place: string;
  }

  let events = $state<EventItem[]>([]);

  async function loadEvents() {
    try {
      events = await api.get<EventItem[]>('/events');
    } catch (error) {
      console.error('Failed to load events:', error);
      events = [];
    }
  }

  function getEventsForDay(day: number) {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === currentYear &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getDate() === day
      );
    });
  }

  $effect(() => {
    loadEvents();
  });
</script>

{#if auth.loading}
  <p aria-busy="true">Checking session…</p>
{:else if auth.user}
  <h1>Welcome to JSO Scheduler</h1>
  <p>Signed in as <strong>{auth.user.displayName}</strong> ({auth.user.email}).</p>

  <section>
    <h2>Calendar</h2>
    <p>Your upcoming events will appear here.</p>

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
    <a href="/events" role="button">View Events</a>
    <a href="/polls" role="button" class="secondary">View Polls</a>
    <a href="/users" role="button">View Members</a>
    <a href={`/users/${auth.user.userId}`} role="button" class="secondary">My Profile</a>
  </div>
{:else}
  <h1>JSO Scheduler</h1>
  <p>
    Plan events, manage polls, and keep track of attendance for the Japanese Student Organization.
  </p>

  <a href="/register" role="button">Get Started</a>
  <a href="/login" role="button" class="secondary">Log In</a>
{/if}

<style>
  .calendar-card {
    margin-top: 1rem;
    padding: 1rem;
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
    min-height: 3rem;
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
  }

  .event-badge {
    margin-top: 0.25rem;
    padding: 0.2rem 0.4rem;
    border-radius: 0.4rem;
    background: #e8f0fe;
    font-size: 0.8rem;
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }
</style>
