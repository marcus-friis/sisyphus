<script lang="ts">
  import type { BoulderWithStats } from '$lib/types';
  import { convertFileSrc } from '@tauri-apps/api/core';
  import { Mountain } from '@lucide/svelte';

  let { boulder }: { boulder: BoulderWithStats } = $props();

  const statusLabel = { project: 'Project', sent: 'Sent', flashed: 'Flashed' };
</script>

<a class="card boulder-card" href="/boulders/{boulder.id}">
  <div class="thumb">
    {#if boulder.thumbnailPath}
      <img src={convertFileSrc(boulder.thumbnailPath)} alt="" />
    {:else}
      <Mountain size={20} strokeWidth={1.5} />
    {/if}
  </div>

  <div class="content">
    <div class="card-top">
      <span class="grade">V{boulder.gradeV}</span>
      <span class="status-tag status-{boulder.status}">
        <span class="status-dot"></span>
        {statusLabel[boulder.status]}
      </span>
    </div>
    <p class="name">{boulder.name ?? 'Untitled boulder'}</p>
    <p class="meta">
      {boulder.totalAttempts} {boulder.totalAttempts === 1 ? 'attempt' : 'attempts'}
      {#if boulder.lastTriedDate}· {boulder.lastTriedDate}{/if}
    </p>
  </div>
</a>

<style>
  .boulder-card {
    display: flex;
    gap: 0.85rem;
    text-decoration: none;
    color: inherit;
    width: 100%;
  }

  .thumb {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border: 2px solid var(--color-border);
    background: var(--color-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
    overflow: hidden;
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .grade {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 1.2rem;
  }

  .status-tag {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    background: var(--color-border);
  }

  .status-sent .status-dot,
  .status-flashed .status-dot {
    background: var(--color-highlight);
  }

  .status-sent,
  .status-flashed {
    color: var(--color-highlight);
  }

  .name {
    margin: 0.5rem 0 0.2rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta {
    margin: 0;
    font-size: 0.8rem;
    color: var(--color-text-muted);
  }
</style>
