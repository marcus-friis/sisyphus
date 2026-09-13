<script lang="ts">
  import type { PageProps } from './$types';
  import GradePyramid from '$lib/components/GradePyramid.svelte';
  import ProgressChart from '$lib/components/ProgressChart.svelte';
  import Spinner from '$lib/components/Spinner.svelte';

  let { data }: PageProps = $props();
</script>

{#snippet loading()}
  <div class="loading-state">
    <Spinner />
  </div>
{/snippet}

{#snippet statCard(value: string | number, label: string)}
  <div class="stat">
    <span class="value">{value}</span>
    <span class="label">{label}</span>
  </div>
{/snippet}

<main class="analytics">
  <h1>Analytics</h1>

  <section class="stats-row">
    {#await data.stats}
      {@render loading()}
    {:then stats}
      {@render statCard(stats.totalSent + stats.totalFlashed, 'Sent')}
      {@render statCard(stats.totalFlashed, 'Flashed')}
      {@render statCard(stats.totalProjects, 'Projects')}
      {@render statCard(stats.avgAttemptsToSend?.toFixed(1) ?? '–', 'Avg tries/send')}
    {/await}
  </section>

  <section>
    <h2 class="section-label">Grade pyramid</h2>
    {#await data.pyramid}
      {@render loading()}
    {:then pyramid}
      <GradePyramid data={pyramid} />
    {/await}
  </section>

  <section>
    <h2 class="section-label">Progress over time</h2>
    {#await data.progress}
      {@render loading()}
    {:then progress}
      <ProgressChart data={progress} />
    {/await}
  </section>
</main>

<style>
  .analytics {
    max-width: 480px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    margin: 1.5rem 0 2rem;
  }

  .stats-row .loading-state {
    grid-column: 1 / -1;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem 0.25rem;
    border: 2px solid var(--color-border);
  }

  .stat .value {
    font-family: var(--font-mono);
    font-size: 1.4rem;
    font-weight: 700;
  }

  .stat .label {
    font-size: 0.7rem;
    color: var(--color-text-muted);
    text-align: center;
  }

  section {
    margin-bottom: 2rem;
  }
</style>
