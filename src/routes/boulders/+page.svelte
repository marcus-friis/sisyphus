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
    <a class="btn" href="/boulders/add">+ Add</a>
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
    <p class="empty">Nothing matches — try a different filter.</p>
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
    margin-bottom: 1rem;
  }

  .header h1 {
    margin: 0;
  }

  .btn {
    border: 1px solid #c00;
    color: white;
    background-color: #200;
    padding: 6px 10px;
    border-radius: 8px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.9rem;
    text-decoration: none;
  }

  .filters {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .filters select {
    padding: 0.4rem 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.85rem;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    align-items: center;
  }

  .empty {
    color: #888;
    font-size: 0.9rem;
    text-align: center;
    margin-top: 2rem;
  }
</style>
