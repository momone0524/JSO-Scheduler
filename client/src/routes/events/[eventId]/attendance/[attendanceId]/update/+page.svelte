<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface AttendanceItem {
    attend: string;
    attendTime: string;
  }

  interface GetAttendanceResponse {
    attendance: AttendanceItem;
  }

  let attend = $state('');
  let attendTime = $state('');

  let submitting = $state(false);
  let loading = $state(true);

  const lang = $derived(auth.user?.language ?? 'en');

  onMount(async () => {
    try {
      const id = page.params.attendanceId;
      const result = await api.get<GetAttendanceResponse>(`/attendance/${id}`);
      const attendance = result.attendance;

      attend = attendance.attend;
      attendTime = attendance.attendTime ? attendance.attendTime.slice(0, 5) : '';
    } catch (error) {
      console.error(error);
      toast.error(t(lang, 'failedToLoadAttendance'));
    } finally {
      loading = false;
    }
  });

  const eventid = page.params.eventId;
  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      const attendanceid = page.params.attendanceId;
      await api.patch(`/attendance/${attendanceid}/update`, {
        attend,
        attendTime,
      });

      toast.success(t(lang, 'attendanceUpdated'));
      goto(`/events/${eventid}/attendance`);
    } catch (error) {
      toast.error(t(lang, 'updateFailed'));
    } finally {
      submitting = false;
    }
  }
</script>

{#if loading}
  <p aria-busy="true">{t(lang, 'loadingAttendanceInfo')}</p>
{:else}
  <h1>{t(lang, 'updateAttendance')}</h1>

  <form onsubmit={handleSubmit}>
    <label>
      {t(lang, 'attend')}
      <select bind:value={attend}>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
        <option value="Joining Midway">{t(lang, 'joiningMidawy')}</option>
      </select>
    </label>

    <label>
      {t(lang, 'attnedTime')}
      <input type="time" bind:value={attendTime} required={attend !== 'No'} />
    </label>

    <button type="submit" disabled={submitting}>
      {submitting ? t(lang, 'updating') : t(lang, 'update')}
    </button>

    <a href={`/events/${eventid}/attendance`} role="button" class="secondary">
      {t(lang, 'cancel')}
    </a>
  </form>
{/if}
