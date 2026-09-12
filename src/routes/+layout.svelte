<script lang="ts">
  import { onMount } from 'svelte';
  import type { LayoutProps } from './$types';
  import { onBackButtonPress } from '@tauri-apps/api/app';
  import { edgeSwipeBack } from '$lib/gestures/edgeSwipeBack';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import '../app.css';

  let { children }: LayoutProps = $props();

  onMount(() => {
    let unlisten: (() => void) | undefined;

    onBackButtonPress(() => {
      if (window.location.pathname === '/') return; // let OS default happen on Home
      history.back();
    }).then((listener) => {
      unlisten = () => listener.unregister();
    });

    return () => unlisten?.();
  });
</script>

<div class="app-shell" use:edgeSwipeBack={() => history.back()}>
  <main>
    {@render children()}
  </main>
  <BottomNav />
</div>

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding-top: env(safe-area-inset-top);
  }

  main {
    flex: 1;
    padding-bottom: 4.5rem; /* clears the fixed bottom nav so content isn't hidden behind it */
  }
</style>
