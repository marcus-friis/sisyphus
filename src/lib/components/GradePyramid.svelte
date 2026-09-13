<script lang="ts">
  import type { GradePyramidRow } from '$lib/api/analytics';

  let { data }: { data: GradePyramidRow[] } = $props();

  let maxCount = $derived(Math.max(1, ...data.map((d) => d.count)));
</script>

<div class="pyramid">
  {#if data.length === 0}
    <p class="empty">Send a few boulders to see your pyramid.</p>
  {:else}
    {#each data.slice().reverse() as row (row.gradeV)}
      <div class="row">
        <span class="grade-label">V{row.gradeV}</span>
        <div class="bar-track">
          <div class="bar" style="width: {(row.count / maxCount) * 100}%"></div>
        </div>
        <span class="count">{row.count}</span>
      </div>
    {/each}
  {/if}
</div>

<style>
  .pyramid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }

  .grade-label {
    width: 2.5rem;
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 0.85rem;
  }

  .bar-track {
    flex: 1;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    height: 20px;
  }

  .bar {
    height: 100%;
    background: var(--color-primary);
    min-width: 3px;
  }

  .count {
    width: 1.5rem;
    text-align: right;
    font-size: 0.8rem;
    color: var(--color-text-muted);
  }
</style>
