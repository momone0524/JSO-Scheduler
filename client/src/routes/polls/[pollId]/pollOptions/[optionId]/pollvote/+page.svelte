<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';

  const lang = $derived(auth.user?.language ?? 'en');
  const optionId = page.params.optionId;
  const pollId = page.params.pollId;
  let submitting = $state(false);

  async function handleSubmit(): Promise<void> {
    submitting = true;

    try {
      await api.post(`/polls/${pollId}/pollOptions/${optionId}/pollvote`, {});

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
<button type="button" onclick={handleSubmit} disabled={submitting}>
  {submitting ? 'Creating poll vote...' : 'Vote'}
</button>
