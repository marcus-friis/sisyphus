<script lang="ts">
  import { goto } from '$app/navigation';
  import { createSettings } from '$lib/api/settings';

  let username = $state('');
  let submitting = $state(false);
  let error = $state<string | null>(null);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const trimmed = username.trim();
    if (!trimmed) {
      error = 'Please enter a name';
      return;
    }

    submitting = true;
    error = null;

    try {
      await createSettings(trimmed);
      await goto('/');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Something went wrong';
      submitting = false;
    }
  }
</script>

<div class="register">
  <h1>What's your name?</h1>
  <form onsubmit={handleSubmit}>
    <input
      type="text"
      bind:value={username}
      placeholder="e.g. Alex"
      disabled={submitting}
      autofocus
    />
    {#if error}
      <p class="error">{error}</p>
    {/if}
    <button type="submit" class="btn-primary" disabled={submitting}>
      {submitting ? 'Saving...' : 'Continue'}
    </button>
  </form>
</div>

<style>
  .register {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 1.25rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    width: 100%;
    max-width: 280px;
  }
</style>
