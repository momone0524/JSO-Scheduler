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
  let pollType = $state('');

  const lang = $derived(auth.user?.language ?? 'en');
  const pollId = page.params.pollId;

  onMount(async () => {
    const result = await api.get<{ poll: { pollType: string } }>(`/polls/${pollId}`);
    pollType = result.data.poll.pollType;

    if (auth.user?.role !== 'Board Member') {
      toast.error(t(lang, 'unauthorized'));
      goto('/polls');
    }
  });

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      if (pollType === 'job') {
        await api.post(`/polls/${pollId}/pollOptions`, {
          joboption,
        });
      } else {
        await api.post(`/polls/${pollId}/pollOptions`, {
          scheduleoption,
        });
      }

      toast.success(t(lang, 'pollOptionCreated'));
      goto(`/polls/${pollId}/pollOptions`);
    } catch (error) {
      toast.error(t(lang, 'pollOptionCreateFailed'));
    } finally {
      submitting = false;
    }
  }
</script>

<h1>{t(lang, 'createPollOption')}</h1>
<p>{pollType}</p>

<form onsubmit={handleSubmit}>
  {#if pollType === t(lang, 'job')}
    <label>
      {t(lang, 'jobOption')}
      <input type="text" bind:value={joboption} required />
    </label>
  {:else}
    <label>
      {t(lang, 'scheduleOption')}
      <input type="date" bind:value={scheduleoption} required />
    </label>
  {/if}

  <button type="submit" disabled={submitting}>
    {submitting ? t(lang, 'creatingPollOption') : t(lang, 'createPollOption')}
  </button>

  <a href={`/polls`} role="button" class="secondary">
    {t(lang, 'cancel')}
  </a>
</form>
