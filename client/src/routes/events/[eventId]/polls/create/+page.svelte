<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';

  let title = $state('');
  let submitting = $state(false);
  let description = $state('');
  let closeAt = $state('');
  let pollType = $state('');
  const lang = $derived(auth.user?.language ?? 'en');
  const eventId = page.params.eventId;

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      await api.post(`/events/${eventId}/polls`, {
        title,
        description,
        closeAt,
        pollType,
      });

      toast.success(t(lang, 'pollcreated'));
      goto('/events');
    } catch (error) {
      toast.error(t(lang, 'Pollcreatefail'));
    } finally {
      submitting = false;
    }
  }
</script>

<h1>{t(lang, 'createPoll')}</h1>

<form onsubmit={handleSubmit}>
  <label>
    {t(lang, 'titile')}
    <input type="text" bind:value={title} required />
  </label>

  <label>
    {t(lang, 'description')}
    <input type="text" bind:value={description} required />
  </label>

  <label>
    {t(lang, 'closeDate')}
    <input type="date" bind:value={closeAt} required />
  </label>

  <label>
    {t(lang, 'pollType')}
    <select bind:value={pollType} required>
      <option value="job">job</option>
      <option value="schedule">schedule</option>
    </select>
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? t(lang, 'creatingpoll') : t(lang, 'createPoll')}
  </button>
</form>
