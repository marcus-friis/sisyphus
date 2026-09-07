<script lang="ts">
  import type { BoulderWithStats } from '$lib/types';

  let { boulder }: { boulder: BoulderWithStats } = $props();

  const statusLabel = { project: 'Project', sent: 'Sent', flashed: 'Flashed' };
</script>

<a class="card" href="/boulders/{boulder.id}">
  <div class="card-top">
    <span class="grade">V{boulder.gradeV}</span>
    <span class="status status-{boulder.status}">{statusLabel[boulder.status]}</span>
  </div>
  <p class="name">{boulder.name ?? 'Untitled boulder'}</p>
  <p class="meta">
    {boulder.totalAttempts} {boulder.totalAttempts === 1 ? 'attempt' : 'attempts'}
    {#if boulder.lastTriedDate}· {boulder.lastTriedDate}{/if}
  </p>
</a>

<style>
  .card {
    display: block;
    padding: 0.9rem 1rem;
    border: 1px solid #333;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    width: 100%;
    max-width: 320px;
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .grade {
    font-weight: 700;
    font-size: 1.1rem;
  }

  .status {
    font-size: 0.7rem;
    text-transform: uppercase;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    background: #eee;
    color: #333;
  }
  .status-sent, .status-flashed { background: #d4edda; color: #256029; }
  .status-project { background: #fff3cd; color: #7a5c00; }

  .name {
    margin: 0.5rem 0 0.25rem;
    font-weight: 600;
  }

  .meta {
    margin: 0;
    font-size: 0.8rem;
    color: #888;
  }
</style>
