<script lang="ts">
  import { setExecution } from '$lib/stores/executionStore';
  import { goto } from '$app/navigation';
  import { fetchExecutions, type Execution } from '$lib/api/cleopatra';
  import { formatDateTime } from '$lib/utils/datetime';
  import { page } from '$app/stores';

  // States
  let executions = $state<Execution[]>([]);
  let offset = $state(0);
  let totalExecutions = $state(0);
  let loading = $state(false);
  let error = $state<string | null>(null);

  const limit = 50;

  // Reactive effect to update state from $page store
  $effect(() => {
    if ($page.data) {
      executions = $page.data.executions || [];
      offset = $page.data.offset || 0;
      totalExecutions = $page.data.total || 0;
    }
  });

  // Fetch executions from API
  async function fetchData(newOffset: number = 0) {
    loading = true;
    try {
      const result = await fetchExecutions(limit, newOffset);
      executions = result.items;
      offset = newOffset;
      totalExecutions = result.total;
      error = null;
    } catch (err) {
      console.error('Error fetching executions:', err);
      error = err instanceof Error ? err.message : 'An unknown error occurred';
    } finally {
      loading = false;
    }
  }

  // Navigate to execution details
  function goToResults(execution: Execution, event?: Event) {
    event?.preventDefault();
    setExecution(execution);
    goto(`/execution/${execution.id}`);
  }
</script>

<div class="container-xl">
  {#if loading}
    <div class="d-flex justify-content-center my-4">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  {:else if error}
    <div class="alert alert-danger my-4" role="alert">
      Error: {error}
    </div>
  {:else}
    <div class="card my-4">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-vcenter table-mobile-md card-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Tag</th>
                <th>Created By</th>
                <th>Time Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {#if executions.length === 0}
                <tr>
                  <td colspan="5" class="text-center text-muted py-4">
                    No executions found.
                  </td>
                </tr>
              {:else}
                {#each executions as execution (execution.id)}
                  <tr>
                    <td class="text-truncate">
                      <a href="/execution/{execution.id}" class="btn-link"
                         onclick={(e) => goToResults(execution, e)}>
                        {execution.name}
                      </a>
                    </td>
                    <td class="text-truncate">{execution.tag}</td>
                    <td class="text-truncate">{execution.created_by}</td>
                    <td class="text-truncate">{formatDateTime(execution.time_created)}</td>
                    <td>
                      <a href="/execution/{execution.id}" class="btn btn-outline-primary btn-sm"
                         onclick={(e) => goToResults(execution, e)}>
                        View Results
                      </a>
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination controls -->
    <div class="d-flex justify-content-between align-items-center mt-3">
      <button
        class="btn btn-primary"
        disabled={offset === 0 || loading}
        onclick={() => fetchData(Math.max(0, offset - limit))}
      >
        Previous
      </button>

      <span>
        Showing {executions.length === 0 ? 0 : offset + 1} - {offset + executions.length} of {totalExecutions} executions
      </span>

      <button
        class="btn btn-primary"
        disabled={executions.length < limit || offset + executions.length >= totalExecutions || loading}
        onclick={() => fetchData(offset + limit)}
      >
        Next
      </button>
    </div>
  {/if}
</div>
