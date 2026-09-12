<script lang="ts">
  import { page } from '$app/state';
  import { House, Mountain, ChartColumn, Settings } from '@lucide/svelte';

  const links = [
    { href: '/', label: 'Home', icon: House },
    { href: '/boulders', label: 'Boulders', icon: Mountain },
    { href: '/analytics', label: 'Analytics', icon: ChartColumn },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];
</script>

<nav>
  {#each links as link (link.href)}
    <a href={link.href} class:active={page.url.pathname === link.href}>
      <link.icon size={22} strokeWidth={2} />
      <span>{link.label}</span>
    </a>
  {/each}
</nav>

<style>
  nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    background: var(--color-surface);
    border-top: 2px solid var(--color-border);
    padding-bottom: env(safe-area-inset-bottom);
  }

  a {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    text-align: center;
    padding: 0.6rem 0 0.4rem;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 700;
    text-decoration: none;
    color: var(--color-text-muted);
    border-top: 2px solid transparent;
  }

  a.active {
    color: var(--color-primary);
    border-top-color: var(--color-primary);
  }
</style>
