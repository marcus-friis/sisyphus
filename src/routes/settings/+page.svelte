<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import type { PageProps } from './$types';
  import { updateUsername, updateGradeSystem } from '$lib/api/settings';

  let { data }: PageProps = $props();

  let username = $derived(data.settings?.username ?? '');
  let gradeSystem = $derived(data.settings?.gradeSystem ?? 'v');

  let savingUsername = $state(false);
  let usernameSaved = $state(false);

  async function handleSaveUsername(e: SubmitEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    savingUsername = true;
    usernameSaved = false;
    try {
      await updateUsername(username.trim());
      usernameSaved = true;
      await invalidateAll();
    } finally {
      savingUsername = false;
    }
  }

  async function handleGradeSystemChange() {
    await updateGradeSystem(gradeSystem);
    await invalidateAll();
  }
</script>

<main class="settings">
  <h1>Settings</h1>

  <section>
    <h2>Profile</h2>
    <form onsubmit={handleSaveUsername}>
      <label>
        Name
        <input type="text" bind:value={username} placeholder="Your name" />
      </label>
      <button type="submit" disabled={savingUsername}>
        {savingUsername ? 'Saving...' : 'Save'}
      </button>
      {#if usernameSaved}<span class="saved">Saved</span>{/if}
    </form>
  </section>

  <section>
    <h2>Grade system</h2>
    <label class="radio-row">
      <input type="radio" bind:group={gradeSystem} value="v" onchange={handleGradeSystemChange} />
      V-scale
    </label>
    <label class="radio-row">
      <input type="radio" bind:group={gradeSystem} value="font" onchange={handleGradeSystemChange} />
      Font scale
    </label>
  </section>
</main>

<style>
  .settings {
    max-width: 420px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  section {
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 1rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.75rem;
  }

  form {
    display: flex;
    align-items: flex-end;
    gap: 0.6rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.9rem;
    color: #444;
  }

  .radio-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.4rem;
    font-size: 0.95rem;
  }

  input[type="text"] {
    padding: 0.5rem 0.65rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-family: inherit;
  }

  button {
    padding: 0.55rem 0.9rem;
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

  .saved {
    font-size: 0.85rem;
    color: #256029;
  }
</style>
