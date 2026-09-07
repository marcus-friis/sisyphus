<script lang="ts">
  import BoulderCard from '$lib/components/BoulderCard.svelte';
  let { data } = $props();
</script>

<main class="content">
  <p class="welcome">Hello {data.username}.</p>
  <a class="btn" href="/boulders/add">add boulder</a>

  <section class="recent">
    <h2>Recent activity</h2>
    {#await data.boulders}
      <p>Loading...</p>
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
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem 1rem;
  }
  .welcome {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 3rem;
    margin: 0;
  }
  .btn {
    border: 1px solid black;
    color: black;
    padding: 8px;
    border-radius: 8px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 2rem;
    width: fit-content;
  }
  .recent {
    width: 100%;
    max-width: 320px;
  }
  .recent h2 {
    font-size: 1rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .empty {
    color: #888;
    font-size: 0.9rem;
  }
</style>
