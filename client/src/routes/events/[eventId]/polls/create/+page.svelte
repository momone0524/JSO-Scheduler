<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
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

      toast.success('Poll created!');
      goto('/events');
    } catch (error) {
      toast.error('Poll Creation failed. Please check your input.');
    } finally {
      submitting = false;
    }
  }
</script>

<h1>Create Poll</h1>

<form onsubmit={handleSubmit}>
  <label>
    Title
    <input type="text" bind:value={title} required />
  </label>

  <label>
    Description
    <input type="text" bind:value={description} required />
  </label>

  <label>
    Close
    <input type="date" bind:value={closeAt} required />
  </label>

  <label>
    Poll Type
    <select bind:value={pollType} required>
      <option value="job">job</option>
      <option value="schedule">schedule</option>
    </select>
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? 'Creating poll...' : 'Create Poll'}
  </button>
</form>
