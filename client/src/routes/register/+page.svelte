<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
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

      toast.success('Account created! Please log in.');
      goto('/login');
    } catch (error) {
      toast.error('Registration failed. Please check your input.');
    } finally {
      submitting = false;
    }
  }
</script>

<h1>Register</h1>

<form onsubmit={handleSubmit}>
  <label>
    Name
    <input type="text" bind:value={name} required />
  </label>

  <label>
    Grade Year
    <select bind:value={gradeYear}>
      <option value={1}>1</option>
      <option value={2}>2</option>
      <option value={3}>3</option>
      <option value={4}>4</option>
      <option value={5}>5: Graduate Studeut</option>
    </select>
  </label>

  <label>
    Major
    <input type="text" bind:value={major} required />
  </label>

  <label>
    Birthday
    <input type="date" bind:value={birthday} required />
  </label>

  <label>
    Language
    <select bind:value={language} required>
      <option value="ja">Japanese</option>
      <option value="en">English</option>
    </select>
  </label>

  <label>
    Role
    <select bind:value={role} required>
      <option value="Member">Member</option>
      <option value="Board Member">Board Member</option>
    </select>
  </label>

  <label>
    Email
    <input type="email" bind:value={email} required />
  </label>

  <label>
    Password
    <input type="password" bind:value={password} minlength="8" required />
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? 'Creating account...' : 'Register'}
  </button>
</form>

<p>Already have an account? <a href="/login">Log in</a></p>
