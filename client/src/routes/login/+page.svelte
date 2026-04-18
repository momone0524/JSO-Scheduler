<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/toast.svelte';

  let email = $state('');
  let password = $state('');
  let submitting = $state(false);

  let lang = $state<'en' | 'ja'>('en');

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    try {
      await api.post('/login', { email, password });
      await auth.refresh();
      toast.success(t(lang, 'loginSuccess'));
      goto('/');
    } catch (error) {
      toast.error(t(lang, 'loginFailed'));
    } finally {
      submitting = false;
    }
  }
</script>

<h1>{t(lang, 'login')}</h1>

<label>
  {t(lang, 'language')}
  <select bind:value={lang}>
    <option value="en">{t(lang, 'english')}</option>
    <option value="ja">{t(lang, 'japanese')}</option>
  </select>
</label>

<form onsubmit={handleSubmit}>
  <label>
    {t(lang, 'email')}
    <input type="email" bind:value={email} required />
  </label>

  <label>
    {t(lang, 'password')}
    <input type="password" bind:value={password} required />
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? t(lang, 'loggingIn') : t(lang, 'login')}
  </button>
</form>

<p>
  {t(lang, 'noAccount')}
  <a href="/register">{t(lang, 'register')}</a>
</p>
