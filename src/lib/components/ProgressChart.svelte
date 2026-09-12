<script lang="ts">
  import type { ProgressRow } from '$lib/api/analytics';

  let { data }: { data: ProgressRow[] } = $props();

  const width = 320;
  const height = 140;
  const padding = 24;

  let points = $derived.by(() => {
    if (data.length === 0) return [];
    const maxGrade = Math.max(...data.map((d) => d.maxGrade), 1);
    const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

    return data.map((d, i) => ({
      x: padding + i * stepX,
      y: height - padding - (d.maxGrade / maxGrade) * (height - padding * 2),
      month: d.month,
      grade: d.maxGrade,
    }));
  });

  let pathD = $derived(points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '));
</script>

<div class="progress-chart">
  {#if data.length === 0}
    <p class="empty">No sends logged yet.</p>
  {:else}
    <svg viewBox="0 0 {width} {height}" width="100%">
      <path d={pathD} fill="none" stroke="var(--color-primary)" stroke-width="2" />
      {#each points as p (p.month)}
        <circle cx={p.x} cy={p.y} r="3.5" fill="var(--color-primary)" />
        <text x={p.x} y={p.y - 10} text-anchor="middle" font-size="10" fill="var(--color-primary)">V{p.grade}</text>
        <text x={p.x} y={height - 6} text-anchor="middle" font-size="8" fill="var(--color-text)">
          {p.month.slice(5)}
        </text>
      {/each}
    </svg>
  {/if}
</div>

<style>
  .progress-chart {
    width: 100%;
  }
</style>
