<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';

  let name = $state('');
  let gradeYear = $state(1);
  let major = $state('');
  let birthday = $state('');
  let language = $state<'ja' | 'en'>('ja');
  let role = $state<'Board Member' | 'Member'>('Member');
  let email = $state('');
  let password = $state('');
  let submitting = $state(false);

  const lang = $derived(language);
  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      await api.post('/users', {
        name,
        gradeYear: Number(gradeYear),
        major,
        birthday,
        language,
        role,
        email,
        password,
      });

      toast.success(t(lang, 'accountCreated'));
      goto('/login');
    } catch (error) {
      toast.error(t(lang, 'registrationFailed'));
    } finally {
      submitting = false;
    }
  }
</script>

<h1>{t(lang, 'register')}</h1>

<form onsubmit={handleSubmit}>
  <label>
    {t(lang, 'name')}
    <input type="text" bind:value={name} required />
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
    {t(lang, 'major')}
    <input type="text" bind:value={major} required />
  </label>

  <label>
    {t(lang, 'birthday')}
    <input type="date" bind:value={birthday} required />
  </label>

  <label>
    {t(lang, 'language')}
    <select bind:value={language} required>
      <option value="ja">{t(lang, 'japanese')}</option>
      <option value="en">{t(lang, 'english')}</option>
    </select>
  </label>

  <label>
    {t(lang, 'role')}
    <select bind:value={role} required>
      <option value="Member">{t(lang, 'member')}</option>
      <option value="Board Member">{t(lang, 'boardMember')}</option>
    </select>
  </label>

  <label>
    {t(lang, 'email')}
    <input type="email" bind:value={email} required />
  </label>

  <label>
    {t(lang, 'password')}
    <input type="password" bind:value={password} minlength="8" required />
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? t(lang, 'creatingAccount') : t(lang, 'register')}
  </button>
</form>

<p>
  {t(lang, 'alreadyHaveAccount')}
  <a href="/login">{t(lang, 'login')}</a>
</p>
