<script lang="ts">
  import { page } from '$app/state';
  import { House, Mountain, ChartColumn, Settings } from '@lucide/svelte';

  const links = [
    { href: '/', label: 'House', icon: House },
    { href: '/boulders', label: 'Boulders', icon: Mountain },
    { href: '/analytics', label: 'Analytics', icon: ChartColumn },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];
</script>

<nav>
  {#each links as link (link.href)}
    <a href={link.href} class:active={page.url.pathname === link.href}>
      <link.icon size={22} strokeWidth={page.url.pathname === link.href ? 2.4 : 1.8} />
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
    background: white;
    border-top: 1px solid #eee;
    padding-bottom: env(safe-area-inset-bottom);
  }

  a {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    text-align: center;
    padding: 0.5rem 0 0.4rem;
    font-size: 0.7rem;
    text-decoration: none;
    color: #888;
  }

  a.active {
    color: #333;
    font-weight: 600;
  }
</style>
