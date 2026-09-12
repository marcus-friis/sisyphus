<script lang="ts">
  import type { BoulderWithStats } from '$lib/types';

  let { boulder }: { boulder: BoulderWithStats } = $props();

  const statusLabel = { project: 'Project', sent: 'Sent', flashed: 'Flashed' };
</script>

<a class="card boulder-card" href="/boulders/{boulder.id}">
  <div class="card-top">
    <span class="grade">V{boulder.gradeV}</span>
    <span class="status-{boulder.status}">{statusLabel[boulder.status]}</span>
  </div>
  <p class="name">{boulder.name ?? 'Untitled boulder'}</p>
  <p class="meta">
    {boulder.totalAttempts} {boulder.totalAttempts === 1 ? 'attempt' : 'attempts'}
    {#if boulder.lastTriedDate}· {boulder.lastTriedDate}{/if}
  </p>
</a>

<style>
  .boulder-card {
    text-decoration: none;
    color: inherit;
    width: 100%;
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

  .name {
    margin: 0.6rem 0 0.25rem;
    font-weight: 500;
  }

  .meta {
    margin: 0;
    font-size: 0.8rem;
    color: var(--color-text-muted);
  }
</style>
