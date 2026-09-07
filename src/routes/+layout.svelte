<script lang="ts">
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();

</script>

<nav>
    <a href="/">Home</a>
    <a href="/boulders">Boulders</a>
    <a href="/analytics">Analytics</a>
    <a href="/settings">Settings</a>
</nav>

{@render children()}
