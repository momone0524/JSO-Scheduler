<script lang="ts">
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface UserItem {
    userId: string;
    name: string;
    email: string;
    major: string;
    gradeYear: number;
    birthday: string;
    role: string;
    language: string;
  }

  const lang = $derived(auth.user?.language ?? 'en');
  let users: UserItem[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const result = await api.get<{ users: UserItem[] }>('/users');
      console.log('users response:', result);
      users = result.users;
    } catch (error) {
      toast.error(t(lang, 'failedToLoadMembers'));
      users = [];
    } finally {
      loading = false;
    }
  });
</script>

<h1>{t(lang, 'members')}</h1>
<p>{t(lang, 'viewAllMembers')}</p>

{#if loading}
  <p aria-busy="true">{t(lang, 'loadingMembers')}</p>
{:else if users.length === 0}
  <p>{t(lang, 'noMembersFound')}</p>
{:else}
  <div class="member-list">
    {#each users as user}
      <article class="member-card">
        <h2>{user.name}</h2>
        <p><strong>{t(lang, 'email')}:</strong> {user.email}</p>
        <p><strong>{t(lang, 'major')}:</strong> {user.major}</p>
        <p><strong>{t(lang, 'gradeYear')}:</strong> {user.gradeYear}</p>
        <p><strong>{t(lang, 'birthday')}:</strong> {user.birthday.split('T')[0]}</p>
        <p><strong>{t(lang, 'role')}:</strong> {user.role}</p>
        <p><strong>{t(lang, 'language')}:</strong> {user.language}</p>
      </article>
    {/each}
  </div>
{/if}
