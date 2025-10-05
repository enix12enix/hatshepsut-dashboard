<script lang="ts">
  export let offset: number = 0;            // Current offset (start index)
  export let limit: number = 50;            // Items per page
  export let total: number = 0;             // Total number of items
  export let loading: boolean = false;      // Disable buttons while loading
  export let fetchData: (newOffset: number) => void;
  export let label: string = "results";

  $: start = total === 0 ? 0 : offset + 1;
  $: end = Math.min(offset + limit, total);

  function prevPage() {
    const newOffset = Math.max(0, offset - limit);
    fetchData(newOffset);
  }

  function nextPage() {
    const newOffset = offset + limit;
    fetchData(newOffset);
  }
</script>

<div class="d-flex justify-content-between align-items-center mt-3">
  <button
    class="btn btn-primary"
    disabled={offset === 0 || loading}
    on:click={prevPage}
  >
    Previous
  </button>

  <span>
    {#if total > 0}
      Showing {start}–{end} of {total} {label}
    {:else}
      Showing 0 {label}
    {/if}
  </span>

  <button
    class="btn btn-primary"
    disabled={end >= total || loading}
    on:click={nextPage}
  >
    Next
  </button>
</div>
