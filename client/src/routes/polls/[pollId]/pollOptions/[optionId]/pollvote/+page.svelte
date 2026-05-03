<script lang="ts">
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
</script>

<h1>{t(lang, 'pollVote')}</h1>
{#if loading}
  <p aria-busy="true">{t(lang, 'loadingPollVote')}</p>
{:else if pollVotes.length === 0}
  <p>{t(lang, 'noPollVoteFound')}</p>
{:else}
  <div class="member-list">
    {#each pollVotes as vote}
      <article class="member-card">
        <p>{vote.user.name}</p>
      </article>
    {/each}
  </div>
{/if}
