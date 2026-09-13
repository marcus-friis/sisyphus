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
    <h2 class="section-label">Profile</h2>
    <form onsubmit={handleSaveUsername}>
      <label class="field">
        Name
        <input type="text" bind:value={username} placeholder="Your name" />
      </label>
      <button type="submit" class="btn-primary" disabled={savingUsername}>
        {savingUsername ? 'Saving...' : 'Save'}
      </button>
      {#if usernameSaved}<span class="saved">Saved</span>{/if}
    </form>
  </section>

  <section>
    <h2 class="section-label">Grade system</h2>
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

  form {
    display: flex;
    align-items: flex-end;
    gap: 0.75rem;
  }

  .radio-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  .saved {
    font-size: 0.85rem;
    color: var(--color-highlight);
  }
</style>
