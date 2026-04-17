<script lang="ts">
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';
  import { onMount } from 'svelte';

  interface UserItem {
    userId: string;
    name: string;
    email: string;
    major: string;
    gradeYear: number;
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
      await api.patch('/users/${id}', {
        name,
        gradeYear: Number(gradeYear),
        major,
        birthday,
        language,
        role,
        email,
      });

      toast.success('Account created! Please log in.');
      goto('/login');
    } catch (error) {
      toast.error('Registration failed. Please check your input.');
    } finally {
      submitting = false;
    }
</script>

{#if loading}
  <p aria-busy="true">Loading profile...</p>
{:else if !user}
  <p>User not found.</p>
{:else}
  <h1>My Profile</h1>

  <article class="profile-card">
    <div class="profile-row">
      <strong>Name</strong>
      <span>{user.name}</span>
    </div>

    <div class="profile-row">
      <strong>Email</strong>
      <span>{user.email}</span>
    </div>

    <div class="profile-row">
      <strong>Major</strong>
      <span>{user.major}</span>
    </div>

    <div class="profile-row">
      <strong>Grade Year</strong>
      <span>{user.gradeYear}</span>
    </div>

    <div class="profile-row">
      <strong>Role</strong>
      <span>{user.role}</span>
    </div>

    <div class="profile-row">
      <strong>Language</strong>
      <span>{user.language}</span>
    </div>
  </article>

  {#if auth.user && auth.user.userId === user.userId}
    <p>
      <a href={`/users/${user.userId}/update`} role="button" class="secondary">
        Update My Profile
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
