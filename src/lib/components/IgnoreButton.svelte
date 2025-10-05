<script lang="ts">
  import { updateTestResultStatus, type TestResult } from "$lib/api/cleopatra";

  export let result: TestResult;
  export let onIgnored: (resultId: number, originalStatus: string) => void;

  async function ignore() {
    try {
      const originalStatus = result.status;
      await updateTestResultStatus(result.id, "I");

      // Call the parent function directly
      onIgnored(result.id, originalStatus);
    } catch (err) {
      console.error("Error ignoring test result:", err);
    }
  }
</script>

{#if result.status === "P" || result.status === "F"}
  <button class="btn btn-sm btn-outline-warning" on:click={ignore}>
    Ignore It
  </button>
{:else}
  <span class="text-muted">-</span>
{/if}
