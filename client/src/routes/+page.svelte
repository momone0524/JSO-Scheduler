<script lang="ts">
  import { auth } from '$lib/auth.svelte';

  let currentDate = $state(new Date());

  function prevMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  }

  function nextMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function getCalendarData(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  }

  const cells = $derived(getCalendarData(currentDate));

  const monthLabel = $derived(
    currentDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    }),
  );
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
        <button on:click={prevMonth}>◀</button>
        <strong>{monthLabel}</strong>
        <button on:click={nextMonth}>▶</button>
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
              {day}
            {/if}
          </div>
        {/each}
      </div>
    </article>
  </section>

  <div class="actions">
    <a href="/events" role="button">View Events</a>
    <a href="/polls" role="button" class="secondary">View Polls</a>
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
  .calendar-section {
    margin-top: 2rem;
  }

  .calendar-card {
    margin-top: 1rem;
    padding: 1rem;
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

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }
</style>
