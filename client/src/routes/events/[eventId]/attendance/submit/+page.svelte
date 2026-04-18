<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';

  let attend = $state('');
  let attendTime = $state('');
  let submitting = $state(false);

  const lang = $derived(auth.user?.language ?? 'en');
  const id = page.params.eventId;

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      await api.post(`/events/${id}/attendance`, {
        attend,
        attendTime,
      });

      toast.success(t(lang, 'attendanceCreated'));
      goto(`/events/${id}/attendance`);
    } catch (error) {
      toast.error(t(lang, 'attendanceCreateFailed'));
    } finally {
      submitting = false;
    }
  }
</script>

<h1>{t(lang, 'submitAttendance')}</h1>

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
    {t(lang, 'attendTime')}
    <input type="time" bind:value={attendTime} required={attend !== 'No'} />
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? t(lang, 'creatingAttendance') : t(lang, 'submit')}
  </button>

  <a href={`/events/${id}/attendance`} role="button" class="secondary">
    {t(lang, 'cancel')}
  </a>
</form>
