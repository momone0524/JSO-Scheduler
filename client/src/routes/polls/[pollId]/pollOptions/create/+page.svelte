<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  let joboption = $state('');
  let submitting = $state(false);
  let scheduleoption = $state('');

  const lang = $derived(auth.user?.language ?? 'en');
  const pollId = page.params.pollId;

  onMount(() => {
    if (auth.user?.role !== 'Board Member') {
      toast.error(t(lang, 'unauthorized'));
      goto('/events');
    }
  });

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      await api.post(`/polls/${pollId}/pollOptions`, {
        joboption,
        scheduleoption,
      });

      toast.success(t(lang, 'pollOptionCreated'));
      goto('/polls');
    } catch (error) {
      toast.error(t(lang, 'pollOptionCreateFailed'));
    } finally {
      submitting = false;
    }
  }
</script>

<h1>{t(lang, 'createPollOption')}</h1>

<form onsubmit={handleSubmit}>
  <label>
    <input type="date" bind:value={scheduleoption} />
  </label>

  <label>
    {t(lang, 'jobOption')}
    <input type="text" bind:value={joboption} />
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? t(lang, 'creatingPollOption') : t(lang, 'createPollOption')}
  </button>

  <a href="/polls" role="button" class="secondary">
    {t(lang, 'cancel')}
  </a>
</form>
