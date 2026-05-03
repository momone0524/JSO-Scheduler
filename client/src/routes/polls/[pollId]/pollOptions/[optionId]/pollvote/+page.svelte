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
    user: {
      name: string;
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

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      await api.del(`/polls/${pollId}/pollOptions/${optionId}/pollvote`);

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
        <form onsubmit={handleSubmit}>
          <button type="submit" disabled={submitting}>
            {submitting ? t(lang, 'deleting') : t(lang, 'delete')}
          </button>
        </form>
      </article>
    {/each}

    <a href={`/polls/${pollId}/pollOptions`} role="button" class="secondary">
      {t(lang, 'goBack')}
    </a>
  </div>
{/if}
