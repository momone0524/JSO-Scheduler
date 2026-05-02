<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  const lang = $derived(auth.user?.language ?? 'en');

  interface PollItem {
    pollId: string;
    title: string;
    description: string;
    closeAt: string;
  }

  interface GetPollResponse {
    poll: PollItem;
  }

  let title = $state('');
  let description = $state('');
  let loading = $state(true);
  let submitting = $state(false);
  let closeAt = $state('');

  onMount(async () => {
    if (auth.user?.role !== 'Board Member') {
      toast.error(t(lang, 'unauthorized'));
      goto('/polls');
      return;
    }

    try {
      const pollId = page.params.pollId;
      const result = await api.get<GetPollResponse>(`/polls/${pollId}`);
      const poll = result.data.poll;

      title = poll.title;
      description = poll.description;
      closeAt = poll.closeAt.slice(0, 16);
    } catch (error) {
      toast.error(t(lang, 'pollLoadFailed'));
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      const pollId = page.params.pollId;
      await api.patch(`/polls/${pollId}/update`, {
        title,
        description,
        closeAt,
      });

      toast.success(t(lang, 'pollUpdated'));
      goto(`/polls`);
    } catch (error) {
      toast.error(t(lang, 'pollUpdateFailed'));
    } finally {
      submitting = false;
    }
  }
</script>

{#if loading}
  <p aria-busy="true">{t(lang, 'loadingPoll')}</p>
{:else}
  <h1>{t(lang, 'updatePoll')}</h1>

  <form onsubmit={handleSubmit}>
    <label>
      {t(lang, 'title')}
      <input type="text" bind:value={title} required />
    </label>

    <label>
      {t(lang, 'description')}
      <input type="text" bind:value={description} required />
    </label>

    <label>
      {t(lang, 'closeAt')}
      <input type="datetime-local" bind:value={closeAt} required />
    </label>

    <button type="submit" disabled={submitting}>
      {submitting ? t(lang, 'updating') : t(lang, 'update')}
    </button>

    <a href={`/polls`} role="button" class="secondary">
      {t(lang, 'cancel')}
    </a>
  </form>
{/if}
