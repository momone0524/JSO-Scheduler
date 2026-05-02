<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  const lang = $derived(auth.user?.language ?? 'en');
  const pollId = page.params.pollId;
  let loading = $state(true);
  let pollOption: PollOption[] = $state([]);
  let submitting = $state(false);

  interface PollOption {
    optionId: string;
    jobOptions: string;
    scheduleoption: string;
  }

  onMount(async () => {
    try {
      const result = await api.get<{ pollOptions: PollOption[] }>(`/polls/${pollId}/pollOptions`);

      pollOption = result.data.pollOptions;
    } catch (error) {
      toast.error(t(lang, 'pollOptionLoadFailed'));
      pollOption = [];
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      const optionId = page.params.optionId;
      await api.post(`/poll/${pollId}/pollOptions/${optionId}/pollvote`, {});

      toast.success('PollVotecreated!');
      goto(`/polls`);
    } catch (error) {
      toast.error('pollvotecreatefailed');
    } finally {
      submitting = false;
    }
  }
</script>

<h1>{t(lang, 'pollVote')}</h1>

{#if loading}
  <p aria-busy="true">{t(lang, 'loadingPollVote')}</p>
{:else if pollOption.length === 0}
  <p>{t(lang, 'noPollVoteFound')}</p>
{:else}
  <div class="member-list">
    {#each pollOption as option}
      <article class="member-card">
        <p>{t(lang, 'jobOption')}{option.jobOptions}</p>
        <p>{t(lang, 'scheduleOption')}{option.scheduleoption}</p>
        <form onsubmit={handleSubmit}>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating poll vote...' : 'Create Pollvote'}
          </button>
        </form>
      </article>
    {/each}
  </div>
{/if}
