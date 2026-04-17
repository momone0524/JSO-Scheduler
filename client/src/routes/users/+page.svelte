<script lang="ts">
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

  let users: UserItem[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const result = await api.get<{ users: UserItem[] }>('/users');
      console.log('users response:', result);
      users = result.users;
    } catch (error) {
      toast.error('Failed to load members.');
      users = [];
    } finally {
      loading = false;
    }
  });
</script>

<h1>Members</h1>
<p>View all registered JSO members.</p>

{#if loading}
  <p aria-busy="true">Loading members...</p>
{:else if users.length === 0}
  <p>No members found.</p>
{:else}
  <div class="member-list">
    {#each users as user}
      <article class="member-card">
        <h2>{user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Major:</strong> {user.major}</p>
        <p><strong>Grade Year:</strong> {user.gradeYear}</p>
        <p><strong>Birthday:</strong> {user.birthday.split('T')[0]}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Language:</strong> {user.language}</p>
      </article>
    {/each}
  </div>
{/if}
