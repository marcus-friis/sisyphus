<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import type { PageProps } from './$types';
  import { deleteBoulder } from '$lib/api/boulders';
  import { addAttempt } from '$lib/api/attempts';
  import { pickMediaFile } from '$lib/media/upload';
  import { createMedia } from '$lib/api/media';
  import { convertFileSrc } from '@tauri-apps/api/core';

  let { data }: PageProps = $props();
  let { boulder, attempts, media } = $derived(data);

  let showAttemptForm = $state(false);
  let newResult = $state<'fell' | 'sent' | 'flash'>('fell');
  let newAttempts = $state(1);
  let newDate = $state(new Date().toISOString().slice(0, 10));
  let newNotes = $state('');
  let saving = $state(false);
  let deleting = $state(false);
  let uploading = $state(false);

  const statusLabel = { project: 'Project', sent: 'Sent', flashed: 'Flashed' };
  const resultLabel = { fell: 'Fell', sent: 'Sent', flash: 'Flash' };

  async function handleAddAttempt(e: SubmitEvent) {
    e.preventDefault();
    saving = true;
    try {
      await addAttempt(boulder.id, {
        date: newDate,
        attempts: newAttempts,
        result: newResult,
        notes: newNotes || undefined,
      });
      showAttemptForm = false;
      newNotes = '';
      newAttempts = 1;
      await invalidateAll();
    } finally {
      saving = false;
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this boulder and all its attempts? This can\'t be undone.')) return;
    deleting = true;
    await deleteBoulder(boulder.id);
    await goto('/boulders');
  }

  async function handleAddMedia() {
    uploading = true;
    try {
      const picked = await pickMediaFile();
      if (!picked) return;
      await createMedia(boulder.id, picked.type, picked.storedPath);
      await invalidateAll();
    } finally {
      uploading = false;
    }
  }
</script>

<div class="boulder-detail">
  <div class="header">
    <div>
      <h1>{boulder.name ?? `V${boulder.gradeV} project`}</h1>
      <span class="grade">V{boulder.gradeV}</span>
      <span class="status-{boulder.status}">{statusLabel[boulder.status]}</span>
    </div>
    <button class="btn-danger" onclick={handleDelete} disabled={deleting}>
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  </div>

  {#if boulder.wallAngle}
    <p class="meta">{boulder.wallAngle}</p>
  {/if}

  {#if boulder.notes}
    <p class="notes">{boulder.notes}</p>
  {/if}

  <section>
    <div class="section-header">
      <h2 class="section-label">Media</h2>
      <button onclick={handleAddMedia} disabled={uploading}>
        {uploading ? 'Adding...' : '+ Add photo/video'}
      </button>
    </div>

    {#if media.length === 0}
      <p class="empty">No photos or videos yet.</p>
    {:else}
      <div class="media-grid">
        {#each media as item (item.id)}
          {#if item.type === 'photo'}
            <img src={convertFileSrc(item.filePath)} alt={item.caption ?? 'Boulder photo'} />
          {:else}
            <video src={convertFileSrc(item.filePath)} controls></video>
          {/if}
        {/each}
      </div>
    {/if}
  </section>

  <section>
    <div class="section-header">
      <h2 class="section-label">Attempts ({attempts.reduce((sum, a) => sum + a.attempts, 0)} total)</h2>
      <button onclick={() => (showAttemptForm = !showAttemptForm)}>
        {showAttemptForm ? 'Cancel' : '+ Log attempt'}
      </button>
    </div>

    {#if showAttemptForm}
      <form class="card" onsubmit={handleAddAttempt}>
        <label class="field">
          Result
          <select bind:value={newResult}>
            <option value="fell">Fell</option>
            <option value="sent">Sent</option>
            <option value="flash">Flash</option>
          </select>
        </label>
        <label class="field">
          Attempts
          <input type="number" min="1" bind:value={newAttempts} disabled={newResult === 'flash'} />
        </label>
        <label class="field">
          Date
          <input type="date" bind:value={newDate} />
        </label>
        <label class="field">
          Notes
          <textarea bind:value={newNotes} placeholder="What changed this time?"></textarea>
        </label>
        <button type="submit" class="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    {/if}

    {#if attempts.length === 0}
      <p class="empty">No attempts logged.</p>
    {:else}
      <ul class="timeline">
        {#each attempts as attempt (attempt.id)}
          <li>
            <span class="date">{attempt.date}</span>
            <span class="result result-{attempt.result}">{resultLabel[attempt.result]}</span>
            <span class="count">{attempt.attempts} {attempt.attempts === 1 ? 'try' : 'tries'}</span>
            {#if attempt.notes}<p class="attempt-notes">{attempt.notes}</p>{/if}
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</div>

<style>
  .boulder-detail {
    max-width: 560px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  h1 {
    margin: 0 0 0.5rem;
    font-size: 1.3rem;
  }

  .grade {
    font-family: var(--font-mono);
    font-weight: 700;
    margin-right: 0.75rem;
  }

  .meta {
    color: var(--color-text-muted);
    text-transform: capitalize;
    margin: 0.5rem 0 0;
  }

  .notes {
    margin: 0.75rem 0;
  }

  section {
    margin-top: 2rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--color-border);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }

  .section-header .section-label {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }

  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.6rem;
  }

  .media-grid img,
  .media-grid video {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border: 2px solid var(--color-border);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    margin: 0 0 1rem;
  }

  .timeline {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .timeline li {
    padding: 0.85rem 0;
    border-bottom: 2px solid var(--color-border);
  }

  .date {
    color: var(--color-text-muted);
    font-size: 0.85rem;
    margin-right: 0.6rem;
  }

  .result {
    font-weight: 700;
    margin-right: 0.5rem;
  }

  .result-sent,
  .result-flash {
    color: var(--color-highlight);
  }

  .result-fell {
    color: var(--color-text-muted);
  }

  .count {
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  .attempt-notes {
    margin: 0.35rem 0 0;
    font-size: 0.9rem;
  }
</style>
