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
  let pollOption = $state<PollOption[]>([]);
  let submitting = $state(false);

  interface PollOption {
    optionId: string;
    joboption: string;
    scheduleoption: string;
    isWinner: boolean;
  }

  onMount(async () => {
    console.log('pollId:', pollId);
    try {
      await api.post(`/polls/${pollId}/winner`, {});
      const result = await api.get<{ pollOptions: PollOption[] }>(`/polls/${pollId}/pollOptions`);
      pollOption = result.data.pollOptions ?? [];
    } catch (error) {
      console.error(error);
      toast.error(t(lang, 'pollOptionLoadFailed'));
      pollOption = [];
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(optionId: string): Promise<void> {
    submitting = true;

    try {
      const res = await api.post<{ error?: string }>(
        `/polls/${pollId}/pollOptions/${optionId}/pollvote`,
        {},
      );

      if (!res.ok) {
        toast.error(res.data?.error ?? t(lang, 'votefailed'));
        return;
      }
      toast.success('votecomplete');
      goto(`/polls`);
    } catch (error: any) {
      toast.error(error?.message ?? 'votefailed');
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
        {#if option.joboption}
          <p>{t(lang, 'jobOption')}:{option.joboption}</p>
        {/if}
        {#if option.scheduleoption}
          <p>{t(lang, 'scheduleOption')}:{option.scheduleoption}</p>
          {#if option.isWinner}
            <p>{t(lang, 'winnerDate')}</p>
          {:else}
            <button
              type="button"
              onclick={() => handleSubmit(option.optionId)}
              disabled={submitting}
            >
              {submitting ? t(lang, 'creatingpollvote') : t(lang, 'pollvote')}
            </button>
          {/if}
        {/if}
        <button type="button" onclick={() => handleSubmit(option.optionId)} disabled={submitting}>
          {submitting ? t(lang, 'creatingpollvote') : t(lang, 'pollvote')}
        </button>

        <a
          href={`/polls/${pollId}/pollOptions/${option.optionId}/pollvote`}
          role="button"
          class="secondary"
        >
          {t(lang, 'view')}
        </a>
      </article>
    {/each}
    <a href={`/polls`} role="button" class="secondary">
      {t(lang, 'cancel')}
    </a>
  </div>
{/if}
