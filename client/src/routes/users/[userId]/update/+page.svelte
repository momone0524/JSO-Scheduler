<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
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
      const user = result.user;

      name = user.name;
      email = user.email;
      major = user.major;
      gradeYear = user.gradeYear;
      birthday = user.birthday.split('T')[0];
      role = user.role;
      language = user.language;
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile.');
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

      toast.success('Profile Updated!');
      goto(`/users/${id}`);
    } catch (error) {
      toast.error('Update failed. Please check your input.');
    } finally {
      submitting = false;
    }
  }
</script>

{#if loading}
  <p aria-busy="true">Loading profile...</p>
{:else}
  <h1>Update My Profile</h1>

  <form onsubmit={handleSubmit}>
    <label>
      Name
      <input type="text" bind:value={name} required />
    </label>

    <label>
      Email
      <input type="email" bind:value={email} required />
    </label>

    <label>
      Major
      <input type="text" bind:value={major} required />
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
      Birthday
      <input type="date" bind:value={birthday} required />
    </label>

    <label>
      Role
      <select bind:value={role}>
        <option value="Member">Member</option>
        <option value="Board Member">Board Member</option>
      </select>
    </label>

    <label>
      Language
      <select bind:value={language}>
        <option value="en">English</option>
        <option value="ja">Japanese</option>
      </select>
    </label>

    <div class="actions">
      <button type="submit" disabled={submitting}>
        {submitting ? 'Updating...' : 'Update Profile'}
      </button>

      <a href={`/users/${page.params.userId}`} role="button" class="secondary"> Cancel </a>
    </div>
  </form>
{/if}
