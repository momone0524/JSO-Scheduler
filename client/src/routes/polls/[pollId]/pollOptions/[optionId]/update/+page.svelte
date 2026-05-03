<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  const lang = $derived(auth.user?.language ?? 'en');
  const eventId = page.params.eventId;
  const pollId = page.params.pollId;
  const optionId = page.params.optionId;
  let optionDateTime = $state('');
  let loading = $state(true);
  let submitting = $state(false);

  interface OptionItem {
    optionId: string;
    optionDateTime: string;
  }

  onMount(async () => {
    if (auth.user?.role !== 'Board Member') {
      toast.error(t(lang, 'unauthorized'));
      goto('/polls');
    }

    try {
      const result = await api.get<OptionItem>(`/pollOptions/${optionId}`);
      optionDateTime = result.data.optionDateTime;
    } catch (error) {
      toast.error(t(lang, 'pollOptionLoadFailed'));
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      await api.patch(`/pollOptions/${optionId}/update`, {
        optionDateTime,
      });

      toast.success(t(lang, 'pollOptionCreated'));
      goto(`/events/${eventId}/polls/${pollId}/pollOptions/${optionId}`);
    } catch (error) {
      toast.error(t(lang, 'pollOptionUpdateFailed'));
    } finally {
      submitting = false;
    }
  }
</script>

<h1>{t(lang, 'updatePollOption')}</h1>

{#if loading}
  <p aria-busy="true">{t(lang, 'loading')}</p>
{:else}
  <form onsubmit={handleSubmit}>
    <label>
      {t(lang, 'optionDateTime')}
      <input type="datetime" bind:value={optionDateTime} required />
    </label>

    <button type="submit" disabled={submitting}>
      {submitting ? t(lang, 'updating') : t(lang, 'update')}
    </button>

    <a
      href={`/events/${eventId}/polls/${pollId}/pollOptions/${optionId}`}
      role="button"
      class="secondary"
    >
      {t(lang, 'cancel')}
    </a>
  </form>
{/if}
