<script lang="ts">
  import { page } from '$app/state';

  const links = [
    { href: '/', label: 'Home' },
    { href: '/boulders', label: 'Boulders' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/settings', label: 'Settings' },
  ];
</script>

<nav>
  {#each links as link (link.href)}
    <a href={link.href} class:active={page.url.pathname === link.href}>
      {link.label}
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
    text-align: center;
    padding: 0.7rem 0;
    font-size: 0.75rem;
    text-decoration: none;
    color: #888;
  }

  a.active {
    color: #333;
    font-weight: 600;
  }
</style>
