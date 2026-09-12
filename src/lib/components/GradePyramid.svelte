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
        <span class="label">V{row.gradeV}</span>
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
    gap: 0.4rem;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .label {
    width: 2.5rem;
    font-weight: 600;
    font-size: 0.85rem;
  }
  .bar-track {
    flex: 1;
    background: var(--color-surface);
    height: 18px;
    overflow: hidden;
  }
  .bar {
    height: 100%;
    background: var(--color-primary);
    min-width: 2px;
  }
  .count {
    width: 1.5rem;
    text-align: right;
    font-size: 0.8rem;
    color: var(--color-text);
  }
</style>
