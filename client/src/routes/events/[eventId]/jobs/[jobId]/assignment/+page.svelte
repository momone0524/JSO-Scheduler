<script lang="ts">
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  const lang = $derived(auth.user?.language ?? 'en');
  const jobId = page.params.jobId;
  const eventId = page.params.eventId;
  let loading = $state(true);
  let assignment = $state<JobAssignment[]>([]);

  interface JobAssignment {
    user: {
      name: string;
    };
  }

  interface GetJobAssignment {
    assignments: JobAssignment[];
  }

  onMount(async () => {
    try {
      const result = await api.get<GetJobAssignment>(`/jobs/${jobId}/assignment`);
      assignment = result.data.assignments ?? [];
    } catch (error) {
      console.error(error);
      toast.error(t(lang, 'jobAsignmentLoadFailed'));
      assignment = [];
    } finally {
      loading = false;
    }
  });
</script>

<h1>{t(lang, 'jobAssignments')}</h1>
{#if loading}
  <p aria-busy="true">{t(lang, 'loadingJobAssignment')}</p>
{:else if assignment.length === 0}
  <p>{t(lang, 'nojobAssignmentFound')}</p>
{:else}
  <div class="member-list">
    {#each assignment as assignment}
      <article class="member-card">
        <p>{assignment.user.name}</p>
      </article>
    {/each}
  </div>
{/if}
