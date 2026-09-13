<script lang="ts">
  import type { PageProps } from './$types';
  import BoulderCard from '$lib/components/BoulderCard.svelte';

  let { data }: PageProps = $props();

  let statusFilter = $state<'all' | 'project' | 'sent' | 'flashed'>('all');
  let sortBy = $state<'recent' | 'grade'>('recent');

  let filtered = $derived(
    data.boulders
      .filter((b) => statusFilter === 'all' || b.status === statusFilter)
      .sort((a, b) =>
        sortBy === 'grade'
          ? b.gradeV - a.gradeV
          : (b.lastTriedDate ?? '').localeCompare(a.lastTriedDate ?? ''),
      ),
  );
</script>

<main class="log">
  <div class="header">
    <h1>Boulders</h1>
    <a class="btn btn-primary" href="/boulders/add">+ Add</a>
  </div>

  <div class="filters">
    <select bind:value={statusFilter}>
      <option value="all">All</option>
      <option value="project">Projects</option>
      <option value="sent">Sent</option>
      <option value="flashed">Flashed</option>
    </select>

    <select bind:value={sortBy}>
      <option value="recent">Most recent</option>
      <option value="grade">Hardest first</option>
    </select>
  </div>

  {#if filtered.length === 0}
    <p class="empty centered">Nothing matches — try a different filter.</p>
  {:else}
    <div class="list">
      {#each filtered as boulder (boulder.id)}
        <BoulderCard {boulder} />
      {/each}
    </div>
  {/if}
</main>

<style>
  .log {
    max-width: 480px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }

  .filters {
    display: flex;
    gap: 0.6rem;
    margin-bottom: 1.25rem;
  }

  .filters select {
    flex: 1;
    font-size: 0.85rem;
    padding: 0.5rem 0.6rem;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .centered {
    text-align: center;
    margin-top: 2rem;
  }
</style>
