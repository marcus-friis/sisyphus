<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageProps } from './$types';
  import { createBoulderWithFirstAttempt } from '$lib/api/boulders';
  import { createGym } from '$lib/api/gyms';
  import { createMedia } from '$lib/api/media';
  import { pickMediaFile, type PickedMedia } from '$lib/media/upload';

  let { data }: PageProps = $props();

  let gyms = $state(data.gyms);
  let gymId = $state<number | 'new' | null>(gyms[0]?.id ?? null);
  let newGymName = $state('');

  let gradeV = $state(2);
  let wallAngle = $state<'slab' | 'vertical' | 'overhang' | 'roof'>('vertical');
  let result = $state<'fell' | 'sent' | 'flash'>('sent');
  let attempts = $state(1);
  let date = $state(new Date().toISOString().slice(0, 10));
  let notes = $state('');

  // Media is picked and copied to disk immediately, but only linked to a
  // boulder row once the boulder itself exists (after submit).
  let stagedMedia = $state<PickedMedia[]>([]);
  let pickingMedia = $state(false);

  let submitting = $state(false);
  let error = $state<string | null>(null);

  async function handleAddMedia() {
    pickingMedia = true;
    try {
      const picked = await pickMediaFile();
      if (picked) stagedMedia = [...stagedMedia, picked];
    } finally {
      pickingMedia = false;
    }
  }

  function removeStagedMedia(index: number) {
    stagedMedia = stagedMedia.filter((_, i) => i !== index);
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    submitting = true;
    error = null;

    try {
      let resolvedGymId: number | null = typeof gymId === 'number' ? gymId : null;

      if (gymId === 'new' && newGymName.trim()) {
        resolvedGymId = await createGym(newGymName.trim());
      }

      const boulderId = await createBoulderWithFirstAttempt(
        { gradeV, wallAngle, gymId: resolvedGymId ?? undefined, notes: notes || undefined },
        { date, attempts, result },
      );

      for (const item of stagedMedia) {
        await createMedia(boulderId, item.type, item.storedPath);
      }

      await goto(`/boulders/${boulderId}`);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Something went wrong';
      submitting = false;
    }
  }
</script>

<div class="add-boulder">
  <h1>Log a boulder</h1>

  <form onsubmit={handleSubmit}>
    <label>
      Grade
      <select bind:value={gradeV}>
        {#each Array.from({ length: 17 }, (_, i) => i) as v}
          <option value={v}>V{v}</option>
        {/each}
      </select>
    </label>

    <label>
      Wall angle
      <select bind:value={wallAngle}>
        <option value="slab">Slab</option>
        <option value="vertical">Vertical</option>
        <option value="overhang">Overhang</option>
        <option value="roof">Roof</option>
      </select>
    </label>

    <label>
      Gym
      <select bind:value={gymId}>
        {#each gyms as gym (gym.id)}
          <option value={gym.id}>{gym.name}</option>
        {/each}
        <option value="new">+ Add new gym</option>
      </select>
    </label>

    {#if gymId === 'new'}
      <label>
        New gym name
        <input type="text" bind:value={newGymName} placeholder="e.g. Beta Boulders" />
      </label>
    {/if}

    <label>
      Result
      <select bind:value={result}>
        <option value="flash">Flash</option>
        <option value="sent">Sent</option>
        <option value="fell">Still working it</option>
      </select>
    </label>

    <label>
      Attempts today
      <input type="number" min="1" bind:value={attempts} disabled={result === 'flash'} />
    </label>

    <label>
      Date
      <input type="date" bind:value={date} />
    </label>

    <label>
      Notes
      <textarea bind:value={notes} placeholder="Beta, sequence, how it felt..."></textarea>
    </label>

    <div class="media-field">
      <div class="media-field-header">
        <span>Photos/videos</span>
        <button type="button" onclick={handleAddMedia} disabled={pickingMedia}>
          {pickingMedia ? 'Adding...' : '+ Add'}
        </button>
      </div>

      {#if stagedMedia.length > 0}
        <div class="media-preview-grid">
          {#each stagedMedia as item, i (item.storedPath)}
            <div class="media-preview">
              {#if item.type === 'photo'}
                <img src={item.displaySrc} alt="Selected upload" />
              {:else}
                <video src={item.displaySrc} muted></video>
              {/if}
              <button type="button" class="remove" onclick={() => removeStagedMedia(i)}>✕</button>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <button type="submit" disabled={submitting}>
      {submitting ? 'Saving...' : 'Log it'}
    </button>
  </form>
</div>

<style>
  .add-boulder {
    max-width: 420px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.9rem;
    color: #444;
  }

  input, select, textarea {
    padding: 0.55rem 0.7rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-family: inherit;
  }

  textarea {
    min-height: 70px;
    resize: vertical;
  }

  .media-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .media-field-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    color: #444;
  }

  .media-field-header button {
    padding: 0.3rem 0.6rem;
    font-size: 0.85rem;
    margin-top: 0;
    background: white;
    color: #333;
    border: 1px solid #ccc;
  }

  .media-preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.5rem;
  }

  .media-preview {
    position: relative;
  }

  .media-preview img, .media-preview video {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
  }

  .media-preview .remove {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 20px;
    height: 20px;
    padding: 0;
    margin: 0;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 0.7rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  button {
    padding: 0.65rem;
    font-size: 1rem;
    border-radius: 6px;
    border: none;
    background: #333;
    color: white;
    cursor: pointer;
    margin-top: 0.5rem;
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
