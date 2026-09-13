<script module lang="ts">
  export interface SpinnerPattern {
    interval: number; // ms per frame
    frames: string[];
  }

  export const spinnerPresets = {
    squareCorners: {
      interval: 180,
      frames: ['◰', '◳', '◲', '◱'],
    },
    boxBounce: {
      interval: 120,
      frames: ['▖', '▘', '▝', '▗'],
    },
    dots: {
      interval: 80,
      frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    },
  } satisfies Record<string, SpinnerPattern>;
</script>

<script lang="ts">
  let {
    pattern = spinnerPresets.dots,
    size = 28,
  }: { pattern?: SpinnerPattern; size?: number } = $props();

  let frameIndex = $state(0);

  $effect(() => {
    frameIndex = 0; // restart cleanly whenever the pattern itself changes

    const id = setInterval(() => {
      frameIndex = (frameIndex + 1) % pattern.frames.length;
    }, pattern.interval);

    return () => clearInterval(id);
  });
</script>

<span class="spinner" style="font-size: {size}px" role="status" aria-label="Loading">
  {pattern.frames[frameIndex]}
</span>

<style>
  .spinner {
    font-family: var(--font-mono);
    color: var(--color-primary);
    line-height: 1;
    display: inline-block;
  }
</style>
