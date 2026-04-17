<script lang="ts">
import { page } from '$app/state';
import { onMount } from 'svelte';
import { get } from '$lib/api';

interface Poll{
  pollId: string;
  title: string;
  description: string;
  closeDate: string;
  pollType:string;
}
  let poll: Poll | null = $state(null);
  let loading = $state(true);


<h1>Poll</h1>
<h1>Poll</h1>

<form onsubmit={handleSubmit}>
  <label>
    Title
    <input type="text" bind:value={title} required />
  </label>

  <label>
    Description
    <input type="text" bind:value={title} required />
  </label>

  <label>
    Close Date
    <input type="date" bind:value={closeDate} required />
  </label>

  <label>
    Close Date
    <select bind:value={closeDate} required>
      <option value="job">job</option>
      <option value="scedule">schedule</option>
    </select>
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? 'Creating poll...' : 'Create Poll'}
  </button>
</form>

<a href="/login">Log In</a>
<a href="/register">Register</a>
