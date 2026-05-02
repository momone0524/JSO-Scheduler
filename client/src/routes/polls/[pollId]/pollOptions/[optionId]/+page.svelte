<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  const lang = $derived(auth.user?.language ?? 'en');
  const eventId = page.params.eventId;
  const pollId = page.params.pollId;
  const optionId = page.params.optionId;
  let pollOption: OptionItem | null = $state(null);
  let loading = $state(true);

  interface OptionItem {
    optionId: string;
    optionDateTime: string;
  }

  onMount(async () => {
    if (auth.user?.role !== 'Board Member') {
      toast.error(t(lang, 'unauthorized'));
      goto('/polls');
      return;
    }

    try {
      const result = await api.get<OptionItem>(`/pollOptions/${optionId}`);
      pollOption = result.data;
    } catch (error) {
      toast.error(t(lang, 'pollOptionLoadFailed'));
      pollOption = null;
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p aria-busy="true">{t(lang, 'loadingEvents')}</p>
{:else if pollOption === null}
  <p>{t(lang, 'noPollOptionFound')}</p>
{:else}
  <h1>{t(lang, 'pollOption')}</h1>
  <p>{t(lang, 'optionDateTime')}:{pollOption.optionDateTime}</p>

  <p>
    <a href={`/events/${eventId}/polls/${pollId}/pollOptions/`} role="button">{t(lang, 'detail')}</a
    >
  </p>
{/if}
