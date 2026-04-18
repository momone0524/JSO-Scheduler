<script lang="ts">
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface AttendanceItem {
    attendanceId: string;
    attend: string;
    attendTime: string;
    user: {
      userId: string;
      name: string;
    };
  }

  interface GetAttendResponse {
    attendances: AttendanceItem[];
  }

  const lang = $derived(auth.user?.language ?? 'en');

  let attendanceList = $state<AttendanceItem[]>([]);
  let loading = $state(true);

  const id = page.params.eventId;
  onMount(async () => {
    try {
      const result = await api.get<GetAttendResponse>(`/events/${id}/attendance`);
      attendanceList = result.attendances;
    } catch (error) {
      console.error(error);
      toast.error(t(lang, 'failedToLoadAttendance'));
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p aria-busy="true">{t(lang, 'loadingAttendance')}</p>
{:else if attendanceList.length === 0}
  <p>{t(lang, 'attendanceNotFound')}</p>

  <a href={`/events`} role="button" class="secondary">
    {t(lang, 'goback')}
  </a>
  <a href={`/events/${id}/attendance/submit`} role="button">
    {t(lang, 'submitAttendance')}
  </a>
{:else}
  <h1>{t(lang, 'attendance')}</h1>

  <div class="member-list">
    {#each attendanceList as attendance}
      <article class="member-card">
        <div class="profile-row">
          <strong>{t(lang, 'name')}</strong>
          <span>{attendance.user.name}</span>
        </div>

        <div class="profile-row">
          <strong>{t(lang, 'attend')}</strong>
          <span>{attendance.attend}</span>
        </div>

        <div class="profile-row">
          <strong>{t(lang, 'attnedTime')}</strong>
          <span>{attendance.attendTime ? attendance.attendTime.slice(0, 5) : '-'}</span>
        </div>

        {#if auth.user && auth.user.userId === attendance.user.userId}
          <a href={`/attendance/${attendance.attendanceId}/update`} role="button" class="secondary">
            {t(lang, 'update')}
          </a>
        {/if}
      </article>
    {/each}

    <a href={`/events`} role="button" class="secondary">
      {t(lang, 'goback')}
    </a>
    <a href={`/events/${id}/attendance/submit`} role="button">
      {t(lang, 'submitAttendance')}
    </a>
  </div>
{/if}

<style>
  .member-list {
    display: grid;
    gap: 1rem;
    margin-top: 1rem;
  }

  .profile-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .profile-row:last-child {
    border-bottom: none;
  }
</style>
