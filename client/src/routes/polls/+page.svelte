<script lang="ts">
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface Poll {
    pollId: string;
    title: string;
    closeAt: string;
    pollType: string;
    description: string;
    isClose: boolean;
  }

  const isBoardMember = $derived(auth.user?.role === 'Board Member');
  const lang = $derived(auth.user?.language ?? 'en');
  let polls: Poll[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const result = await api.get<{ polls: Poll[] }>('/polls');
      polls = result.polls;
    } catch (error) {
      toast.error(t(lang, 'failleadPoll'));
      polls = [];
    } finally {
      loading = false;
    }
  });
</script>

<h1>{t(lang, 'poll')}</h1>

{#if loading}
  <p aria-busy="true">{t(lang, 'loadingPoll')}</p>
{:else if polls.length === 0}
  <p>{t(lang, 'noPollFound')}</p>
{:else}
  <div class="member-list">
    {#each polls as poll}
      <article class="member-card">
        <h2>{poll.title}</h2>
        <p><strong>{t(lang, 'closeDate')}:</strong> {poll.closeAt}</p>
        <p><strong>{t(lang, 'pollType')}:</strong> {poll.pollType}</p>
        <p><strong>{t(lang, 'description')}:</strong> {poll.description}</p>
        <p>
          <strong>{t(lang, 'isClose')}:</strong>
          <span>{poll.isClose === true ? t(lang, 'Close') : t(lang, 'Open')}</span>
        </p>

        {#if isBoardMember}
          <p>
            <a href={`/polls/${poll.pollId}/update`} role="button" class="secondary">
              {t(lang, 'update')}
            </a>
          </p>
          <p>
            <a href={`/polls/${poll.pollId}/pollOptions/create`} role="button">
              {t(lang, 'createPollOption')}
            </a>
          </p>
          <p>
            <a href={`/polls/${poll.pollId}/pollOptions`} role="button">
              {t(lang, 'takeVote')}
            </a>
          </p>
        {/if}
      </article>
    {/each}
  </div>
{/if}
