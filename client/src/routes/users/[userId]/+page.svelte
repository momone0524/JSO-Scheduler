<script lang="ts">
  import { page } from '$app/state';
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

  interface GetUserResponse {
    user: UserItem;
  }

  const lang = $derived(auth.user?.language ?? 'en');

  let user = $state<UserItem | null>(null);
  let loading = $state(true);

  onMount(async () => {
    try {
      const id = page.params.userId;

      const result = await api.get<GetUserResponse>(`/users/${id}`);
      user = result.data.user;
    } catch (error) {
      console.error(error);
      toast.error(t(lang, 'failedToLoadProfile'));
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p aria-busy="true">{t(lang, 'loadingProfile')}</p>
{:else if !user}
  <p>{t(lang, 'userNotFound')}</p>
{:else}
  <h1>{t(lang, 'myProfile')}</h1>

  <article class="profile-card">
    <div class="profile-row">
      <strong>{t(lang, 'name')}</strong>
      <span>{user.name}</span>
    </div>

    <div class="profile-row">
      <strong>{t(lang, 'email')}</strong>
      <span>{user.email}</span>
    </div>

    <div class="profile-row">
      <strong>{t(lang, 'major')}</strong>
      <span>{user.major}</span>
    </div>

    <div class="profile-row">
      <strong>{t(lang, 'gradeYear')}</strong>
      <span>{user.gradeYear}</span>
    </div>

    <div class="profile-row">
      <strong>{t(lang, 'birthday')}</strong>
      <span>{user.birthday.split('T')[0]}</span>
    </div>

    <div class="profile-row">
      <strong>{t(lang, 'role')}</strong>
      <span>{user.role === 'Board Member' ? t(lang, 'boardMember') : t(lang, 'member')}</span>
    </div>

    <div class="profile-row">
      <strong>{t(lang, 'language')}</strong>
      <span>{user.language === 'ja' ? t(lang, 'japanese') : t(lang, 'english')}</span>
    </div>
  </article>

  {#if auth.user && auth.user.userId === user.userId}
    <p>
      <a href={`/users/${user.userId}/update`} role="button" class="secondary">
        {t(lang, 'updateMyProfile')}
      </a>
    </p>
  {/if}
{/if}

<style>
  .profile-card {
    margin-top: 1rem;
    padding: 1rem;
  }

  .profile-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .profile-row:last-child {
    border-bottom: none;
  }
</style>
