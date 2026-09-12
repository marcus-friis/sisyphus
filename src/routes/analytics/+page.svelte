<script lang="ts">
  import type { PageProps } from './$types';
  import GradePyramid from '$lib/components/GradePyramid.svelte';
  import ProgressChart from '$lib/components/ProgressChart.svelte';

  let { data }: PageProps = $props();
</script>

<main class="analytics">
  <h1>Analytics</h1>

  <section class="stats-row">
    <div class="stat">
      <span class="value">{data.stats.totalSent + data.stats.totalFlashed}</span>
      <span class="label">Sent</span>
    </div>
    <div class="stat">
      <span class="value">{data.stats.totalFlashed}</span>
      <span class="label">Flashed</span>
    </div>
    <div class="stat">
      <span class="value">{data.stats.totalProjects}</span>
      <span class="label">Projects</span>
    </div>
    <div class="stat">
      <span class="value">{data.stats.avgAttemptsToSend?.toFixed(1) ?? '–'}</span>
      <span class="label">Avg tries/send</span>
    </div>
  </section>

  <section>
    <h2 class="section-label">Grade pyramid</h2>
    <GradePyramid data={data.pyramid} />
  </section>

  <section>
    <h2 class="section-label">Progress over time</h2>
    <ProgressChart data={data.progress} />
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

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem 0.25rem;
    border: 1px solid #eee;
    border-radius: 8px;
  }

  .stat .value {
    font-size: 1.4rem;
    font-weight: 700;
  }

  .stat .label {
    font-size: 0.7rem;
    color: #888;
    text-align: center;
  }

  section {
    margin-bottom: 2rem;
  }

</style>
