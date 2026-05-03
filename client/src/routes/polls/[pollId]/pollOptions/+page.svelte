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
  }

  onMount(async () => {
    console.log('pollId:', pollId);
    try {
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
      await api.post(`/polls/${pollId}/pollOptions/${optionId}/pollvote`, {});

      toast.success('votecomplete');
      goto(`/polls`);
    } catch (error) {
      toast.error('votefailed');
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
        {/if}
        <button type="button" onclick={() => handleSubmit(option.optionId)} disabled={submitting}>
          {submitting ? 'Creating poll vote...' : 'Vote'}
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
