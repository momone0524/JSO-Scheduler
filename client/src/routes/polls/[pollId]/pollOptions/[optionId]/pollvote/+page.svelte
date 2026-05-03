<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  const lang = $derived(auth.user?.language ?? 'en');
  const optionId = page.params.optionId;
  const pollId = page.params.pollId;
  let pollVotes = $state<PollVote[]>([]);
  let loading = $state(true);
  let submitting = $state(false);

  interface PollVote {
    voteId: string;
    user: {
      name: string;
      userId: string;
    };
  }

  onMount(async () => {
    try {
      const result = await api.get<{ votes: PollVote[] }>(
        `/polls/${pollId}/pollOptions/${optionId}/pollvote`,
      );
      pollVotes = result.data.votes ?? [];
    } catch (error) {
      console.error(error);
      toast.error(t(lang, 'pollOptionLoadFailed'));
      pollVotes = [];
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(event: Event, voteId: string): Promise<void> {
    submitting = true;

    try {
      await api.del(`/pollvote/${voteId}/delete`);

      toast.success(t(lang, 'pollvoteDeleted'));
      goto(`/polls/${pollId}/pollOptions/`);
    } catch (error) {
      toast.error(t(lang, 'deleteFailed'));
    } finally {
      submitting = false;
    }
  }
</script>

<h1>{t(lang, 'pollVote')}</h1>
{#if loading}
  <p aria-busy="true">{t(lang, 'loadingPollVote')}</p>
{:else if pollVotes.length === 0}
  <p>{t(lang, 'noPollVoteFound')}</p>
  <a href={`/polls/${pollId}/pollOptions`} role="button" class="secondary">
    {t(lang, 'goBack')}
  </a>
{:else}
  <div class="member-list">
    {#each pollVotes as vote}
      <article class="member-card">
        <p>{vote.user.name}</p>
        {#if auth.user && auth.user.userId === vote.user.userId}
          <form onsubmit={(event) => handleSubmit(event, vote.voteId)}>
            <button type="submit" disabled={submitting}>
              {submitting ? t(lang, 'deleting') : t(lang, 'delete')}
            </button>
          </form>
        {/if}
      </article>
    {/each}

    <a href={`/polls/${pollId}/pollOptions`} role="button" class="secondary">
      {t(lang, 'goBack')}
    </a>
  </div>
{/if}
