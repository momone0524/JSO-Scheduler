<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { toast } from '$lib/toast.svelte';

  let title = $state('');
  let submitting = $state(false);
  let description = $state('');
  let closeDate = $state('');
  let pollType = $state('');

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      await api.post('/api/polls', {
        title,
        description,
        closeDate,
        pollType,
      });

      toast.success('Poll created!');
      goto('/Event');
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
    Close Date
    <input type="date" bind:value={closeDate} required />
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
