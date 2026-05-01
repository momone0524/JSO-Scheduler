<script lang="ts">
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface PollOption {
    optionId: string;
    joboption: string;
    scheduleoption: string;
    isWinner: boolean;
  }

  const lang = $derived(auth.user?.language ?? 'en');
  const pollId = page.params.pollId;
  let pollOptions: PollOption[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const result = await api.get<{ pollOptions: PollOption[] }>('/polls');
      pollOptions = result.pollOptions;
    } catch (error) {
      toast.error(t(lang, 'failleadPollOption'));
      pollOptions = [];
    } finally {
      loading = false;
    }
  });
</script>

<h1>{t(lang, 'pollOptions')}</h1>

<a href={`/polls/${pollId}/pollOptions/create`} role="button">
  {t(lang, `createPollOption`)};
</a>
