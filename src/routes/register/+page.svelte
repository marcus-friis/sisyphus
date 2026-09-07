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
    <button type="submit" disabled={submitting}>
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
    gap: 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    max-width: 280px;
  }

  input {
    padding: 0.6rem 0.8rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  button {
    padding: 0.6rem;
    font-size: 1rem;
    border-radius: 6px;
    border: none;
    background: #333;
    color: white;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error {
    color: #c0392b;
    font-size: 0.875rem;
    margin: 0;
  }
</style>
