<script lang="ts">
  import BoulderCard from '$lib/components/BoulderCard.svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  let { data } = $props();
</script>

<main class="content">
  <p class="welcome">Hello, {data.username}.</p>

  <a class="btn btn-primary cta" href="/boulders/add">Log boulder</a>

  <section class="recent">
    <h2 class="section-label">Recent activity</h2>
    {#await data.boulders}
      <div class="loading-state">
        <Spinner size={48} />
      </div>
    {:then boulders}
      {#if boulders.length === 0}
        <p class="empty">Nothing logged yet — go climb something.</p>
      {:else}
        <div class="list">
          {#each boulders.slice(0, 5) as boulder (boulder.id)}
            <BoulderCard {boulder} />
          {/each}
        </div>
      {/if}
    {/await}
  </section>
</main>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.75rem;
    padding: 2.5rem 1.25rem;
  }

  .welcome {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 1.9rem;
    margin: 0;
    align-self: flex-center;
  }

  .cta {
    width: 100%;
    max-width: 320px;
    font-size: 1.1rem;
    padding: 0.85rem 1.5rem;
  }

  .recent {
    width: 100%;
    max-width: 320px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
</style>
