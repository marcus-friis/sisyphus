<script lang="ts">
  import { goto } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';
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


let uploading = $state(false);

async function handleAddMedia() {
  uploading = true;
  try {
    const picked = await pickMediaFile();
    if (!picked) return; // cancelled
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
      <span class="status status-{boulder.status}">{statusLabel[boulder.status]}</span>
    </div>
    <button class="danger" onclick={handleDelete} disabled={deleting}>
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  </div>

  {#if boulder.wallAngle}
    <p class="meta">{boulder.wallAngle}</p>
  {/if}

  {#if boulder.notes}
    <p class="notes">{boulder.notes}</p>
  {/if}

<section class="media">
  <div class="attempts-header">
    <h2>Media</h2>
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

  <section class="attempts">
    <div class="attempts-header">
      <h2>Attempts ({attempts.reduce((sum, a) => sum + a.attempts, 0)} total)</h2>
      <button onclick={() => (showAttemptForm = !showAttemptForm)}>
        {showAttemptForm ? 'Cancel' : '+ Log attempt'}
      </button>
    </div>

    {#if showAttemptForm}
      <form onsubmit={handleAddAttempt}>
        <label>
          Result
          <select bind:value={newResult}>
            <option value="fell">Fell</option>
            <option value="sent">Sent</option>
            <option value="flash">Flash</option>
          </select>
        </label>
        <label>
          Attempts
          <input type="number" min="1" bind:value={newAttempts} disabled={newResult === 'flash'} />
        </label>
        <label>
          Date
          <input type="date" bind:value={newDate} />
        </label>
        <label>
          Notes
          <textarea bind:value={newNotes} placeholder="What changed this time?"></textarea>
        </label>
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
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
  }

  h1 {
    margin: 0 0 0.4rem;
    font-size: 1.4rem;
  }

  .grade {
    font-weight: 600;
    margin-right: 0.5rem;
  }

  .status {
    font-size: 0.8rem;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    background: #eee;
  }
  .status-sent, .status-flashed { background: #d4edda; color: #256029; }
  .status-project { background: #fff3cd; color: #7a5c00; }

  .meta { color: #666; text-transform: capitalize; margin: 0.5rem 0 0; }
  .notes { margin: 0.75rem 0; color: #333; }

  section { margin-top: 2rem; }
  h2 { font-size: 1.05rem; margin-bottom: 0.75rem; }

  .attempts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .empty { color: #888; font-size: 0.9rem; }

  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
  }
  .media-grid img, .media-grid video {
    width: 100%;
    border-radius: 6px;
    object-fit: cover;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1rem 0;
    padding: 1rem;
    background: #fafafa;
    border-radius: 8px;
  }
  label { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.85rem; }
  input, select, textarea {
    padding: 0.5rem 0.65rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-family: inherit;
  }

  .timeline { list-style: none; padding: 0; margin: 0; }
  .timeline li {
    padding: 0.75rem 0;
    border-bottom: 1px solid #eee;
  }
  .date { color: #888; font-size: 0.85rem; margin-right: 0.5rem; }
  .result { font-weight: 600; margin-right: 0.5rem; }
  .result-sent, .result-flash { color: #256029; }
  .result-fell { color: #888; }
  .count { font-size: 0.85rem; color: #666; }
  .attempt-notes { margin: 0.3rem 0 0; font-size: 0.9rem; color: #444; }

  button {
    padding: 0.5rem 0.9rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
  }
  button[type="submit"] { background: #333; color: white; border: none; }
  .danger { color: #c0392b; border-color: #f5c6cb; }
  button:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
