<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  import { auth } from '$lib/auth.svelte';
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

  let loading = $state(true);
  let submitting = $state(false);

  let name = $state('');
  let email = $state('');
  let major = $state('');
  let gradeYear = $state(1);
  let birthday = $state('');
  let role = $state('');
  let language = $state('');

  onMount(async () => {
    try {
      const id = page.params.userId;
      const result = await api.get<GetUserResponse>(`/users/${id}`);
      const user = result.data.user;

      name = user.name;
      email = user.email;
      major = user.major;
      gradeYear = user.gradeYear;
      birthday = user.birthday.split('T')[0];
      role = user.role;
      language = user.language;
    } catch (error) {
      console.error(error);
      toast.error(t(lang, 'failedToLoadProfile'));
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      const id = page.params.userId;

      await api.patch(`/users/${id}/update`, {
        name,
        gradeYear: Number(gradeYear),
        major,
        birthday,
        language,
        role,
        email,
      });

      toast.success(t(lang, 'profileUpdated'));
      goto(`/users/${id}`);
    } catch (error) {
      toast.error(t(lang, 'updateFailed'));
    } finally {
      submitting = false;
    }
  }
</script>

{#if loading}
  <p aria-busy="true">{t(lang, 'loadingProfile')}</p>
{:else}
  <h1>{t(lang, 'updateMyProfile')}</h1>

  <form onsubmit={handleSubmit}>
    <label>
      {t(lang, 'name')}
      <input type="text" bind:value={name} required />
    </label>

    <label>
      {t(lang, 'email')}
      <input type="email" bind:value={email} required />
    </label>

    <label>
      {t(lang, 'major')}
      <input type="text" bind:value={major} required />
    </label>

    <label>
      {t(lang, 'gradeYear')}
      <select bind:value={gradeYear}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>{t(lang, 'graduateStudent')}</option>
      </select>
    </label>

    <label>
      {t(lang, 'birthday')}
      <input type="date" bind:value={birthday} required />
    </label>

    <label>
      {t(lang, 'role')}
      <select bind:value={role}>
        <option value="Member">{t(lang, 'member')}</option>
        <option value="Board Member">{t(lang, 'boardMember')}</option>
      </select>
    </label>

    <label>
      {t(lang, 'language')}
      <select bind:value={language}>
        <option value="en">{t(lang, 'english')}</option>
        <option value="ja">{t(lang, 'japanese')}</option>
      </select>
    </label>

    <div class="actions">
      <button type="submit" disabled={submitting}>
        {submitting ? t(lang, 'updating') : t(lang, 'updateProfile')}
      </button>

      <a href={`/users/${page.params.userId}`} role="button" class="secondary">
        {t(lang, 'cancel')}
      </a>
    </div>
  </form>
{/if}
