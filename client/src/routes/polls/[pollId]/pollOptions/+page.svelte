<script lang="ts">
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  const lang = $derived(auth.user?.language ?? 'en');
  const pollId = page.params.pollId;
  const eventId = page.params.eventId;
  let pollOptions: PollOption[] = $state([]);
  let loading = $state(true);

  interface PollOption {
    optionId: string;
    optionDateTime: string;
  }

  onMount(async () => {
    try {
      const result = await api.get<{ pollOptions: PollOption[] }>(`/polls/${pollId}/pollOptions`);

      pollOptions = result.data.pollOptions;
    } catch (error) {
      toast.error(t(lang, 'pollOptionLoadFailed'));
      pollOptions = [];
    } finally {
      loading = false;
    }
  });
</script>

<h1>{t(lang, 'pollOptions')}</h1>

{#if loading}
  <p aria-busy="true">{t(lang, 'loadingPollOptions')}</p>
{:else if pollOptions.length === 0}
  <p>{t(lang, 'noPollOptionFound')}</p>
{:else}
  <div class="member-list">
    {#each pollOptions as option}
      <article class="member-card">
        <p>{t(lang, 'optionDateTime')}{option.optionDateTime}</p>
        <p>
          <a
            href={`/events/${eventId}/polls/${pollId}/pollOptions/${option.optionId}`}
            role="button">{t(lang, 'detail')}</a
          >
        </p>
      </article>
    {/each}
  </div>
{/if}
