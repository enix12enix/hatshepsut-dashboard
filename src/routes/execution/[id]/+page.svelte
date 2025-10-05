<script lang="ts">
  import { onMount } from "svelte";
  import { executionStore, setExecution } from "$lib/stores/executionStore";
  import {
    fetchExecutionResults,
    updateTestResultStatus,
    type TestResult,
  } from "$lib/api/cleopatra";
  import { formatDateTime, formatExecutionTime } from "$lib/utils/datetime";
  import IconTabler from "$lib/components/IconTabler.svelte";
  import DynamicFilters from "$lib/components/DynamicFilters.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { getStatusInfo } from "$lib/utils/common";
  import IgnoreButton from "$lib/components/IgnoreButton.svelte";

  // Props/data from server load
  export let data: any;

  // Local state
  let results: TestResult[] = data.results || [];
  let summary = data.summary || { total: 0, pass: 0, fail: 0, ignor: 0 };
  let offset: number = data.offset || 0;
  let executionId: number = data.executionId || 0;
  let executionName: string = "";
  let loading: boolean = false;
  let error: string | null = null;
  let success: string | null = null;

  const limit = 50;

  // Filter variables
  let selectedPlatform: string = "all";
  let selectedStatus: string = "all";
  let availablePlatforms: string[] = data.availablePlatforms || [];
  let availableStatuses: string[] = data.availableStatuses || [];

  // Subscribe to executionStore to get execution name
  onMount(() => {
    const unsubscribe = executionStore.subscribe((value) => {
      if (value && value.id === executionId) {
        executionName = value.name;
      }
    });

    return () => {
      unsubscribe();
    };
  });

  // Reactive filtered results
  $: filteredResults = results.filter((result) => {
    const platformMatch =
      selectedPlatform === "all" || result.platform === selectedPlatform;
    const statusMatch =
      selectedStatus === "all" || result.status === selectedStatus;
    return platformMatch && statusMatch;
  });

  // Utility to get status text and class
  function getStatusInfoLocal(status: string) {
    return getStatusInfo(status);
  }

  // Filter configuration
  const filters = [
    {
      id: "platform",
      label: "Filter by Platform",
      type: "select" as const,
    },
    {
      id: "status",
      label: "Filter by Status",
      type: "select" as const,
    },
  ];

  // Current filter values
  $: filterValues = {
    platform: selectedPlatform,
    status: selectedStatus,
  };

  // Available data for dynamic options
  $: availableData = {
    platform: availablePlatforms,
    status: availableStatuses,
  };

  async function fetchData(newOffset: number = 0) {
    loading = true;
    error = null;
    try {
      const result = await fetchExecutionResults(executionId, limit, newOffset);
      results = result.items;
      summary = result.summary;
      offset = newOffset;

      // Update filter options
      availablePlatforms = [...new Set(result.items.map((r) => r.platform))];
      availableStatuses = [...new Set(result.items.map((r) => r.status))];
    } catch (err) {
      console.error("Error fetching test results:", err);
      error = err instanceof Error ? err.message : "An unknown error occurred";
    } finally {
      loading = false;
    }
  }

  function clearSuccess() {
    success = null;
  }

  // Dynamic filter handler
  function handleFilterChange(id: string, value: string) {
    if (id === "platform") {
      selectedPlatform = value;
    } else if (id === "status") {
      selectedStatus = value;
    }
  }

  // Helper function for setting filters with keyboard support
  function setFilter(status: string, platform: string = "all") {
    selectedStatus = status;
    selectedPlatform = platform;
  }

  // Helper function to handle keyboard events for accessibility
  function handleKeyDown(
    e: KeyboardEvent,
    status: string,
    platform: string = "all"
  ) {
    if (e.key === "Enter" || e.key === " ") {
      setFilter(status, platform);
    }
  }

  function handleIgnored(resultId: number, originalStatus: string) {
    // Update the result status
    const index = results.findIndex((r) => r.id === resultId);
    if (index !== -1) {
      results[index].status = "I";
    }

    // Update summary counts
    if (originalStatus === "P") summary.pass = Math.max(0, summary.pass - 1);
    if (originalStatus === "F") summary.fail = Math.max(0, summary.fail - 1);
    summary.ignor += 1;

    // Show success message
    success = "Test result has been ignored successfully";
    setTimeout(() => (success = null), 5000);
  }
</script>

<div class="container-xl">
  <div class="page-header">
    <div class="row align-items-center">
      <div class="col">
        <h2 class="page-title">
          {#if executionName && executionName !== ""}
            {executionName}
          {:else}
            Execution #{executionId}
          {/if}
        </h2>
      </div>
    </div>

    <!-- Summary cards -->

    <div class="row row-cards">
      <div class="col-sm-6 col-md-3">
        <div
          class="card"
          style="cursor: pointer;"
          role="button"
          tabindex="0"
          on:click={() => setFilter("all", "all")}
          on:keydown={(e) => handleKeyDown(e, "all", "all")}
        >
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <div class="h3 mt-0">{summary.total}</div>
                <div class="text-muted">Total Tests</div>
              </div>
              <div class="col-auto">
                <span class="bg-blue-lt avatar">
                  <IconTabler
                    name="list-check"
                    className="icon-tabler-list-check"
                    stroke_width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke_linecap="round"
                    stroke_linejoin="round"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-md-3">
        <div
          class="card"
          style="cursor: pointer;"
          role="button"
          tabindex="0"
          on:click={() => setFilter("P")}
          on:keydown={(e) => handleKeyDown(e, "P")}
        >
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <div class="h3 mt-0">{summary.pass}</div>
                <div class="text-muted">Passed</div>
              </div>
              <div class="col-auto">
                <span class="bg-green-lt avatar">
                  <IconTabler
                    name="check"
                    className="icon-tabler-check"
                    stroke_width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke_linecap="round"
                    stroke_linejoin="round"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-md-3">
        <div
          class="card"
          style="cursor: pointer;"
          role="button"
          tabindex="0"
          on:click={() => setFilter("F")}
          on:keydown={(e) => handleKeyDown(e, "F")}
        >
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <div class="h3 mt-0">{summary.fail}</div>
                <div class="text-muted">Failed</div>
              </div>
              <div class="col-auto">
                <span class="bg-red-lt avatar">
                  <IconTabler
                    name="x"
                    className="icon-tabler-x"
                    stroke_width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke_linecap="round"
                    stroke_linejoin="round"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-md-3">
        <div
          class="card"
          style="cursor: pointer;"
          role="button"
          tabindex="0"
          on:click={() => setFilter("I")}
          on:keydown={(e) => handleKeyDown(e, "I")}
        >
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <div class="h3 mt-0">{summary.ignor}</div>
                <div class="text-muted">Ignored</div>
              </div>
              <div class="col-auto">
                <span class="bg-gray-lt avatar">
                  <IconTabler
                    name="ban"
                    className="icon-tabler-ban"
                    stroke_width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke_linecap="round"
                    stroke_linejoin="round"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  {:else}
    {#if error}
      <div class="alert alert-danger" role="alert">
        Error: {error}
      </div>
    {:else if success}
      <div class="alert alert-success alert-dismissible" role="alert">
        {success}
        <button
          type="button"
          class="btn-close"
          on:click={clearSuccess}
          aria-label="Close"
        ></button>
      </div>
    {/if}

    <!-- Filter controls -->
    <DynamicFilters
      {filters}
      {filterValues}
      {availableData}
      on:filterChange={(e) => handleFilterChange(e.detail.id, e.detail.value)}
      statusTextConverter={(status) => getStatusInfoLocal(status).text}
    />

    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-vcenter table-mobile-md card-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Execution Time</th>
                <th>Counter</th>
                <th>Created By</th>
                <th>Time Created</th>
                <th>Screenshot</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {#each filteredResults as result (result.id)}
                <tr>
                  <td class="text-truncate">{result.name}</td>
                  <td class="text-truncate">{result.platform}</td>
                  <td class="text-truncate">
                    <span
                      class="status-badge {getStatusInfo(result.status).class}"
                    >
                      {getStatusInfo(result.status).text}
                    </span>
                  </td>
                  <td class="text-truncate"
                    >{formatExecutionTime(result.execution_time)}</td
                  >
                  <td class="text-truncate">{result.counter}</td>
                  <td class="text-truncate">{result.created_by}</td>
                  <td class="text-truncate"
                    >{formatDateTime(result.time_created)}</td
                  >
                  <td class="text-truncate">
                    {#if result.screenshot_id}
                      ID: {result.screenshot_id}
                    {:else}
                      N/A
                    {/if}
                  </td>
                  <td>
                    <IgnoreButton {result} onIgnored={handleIgnored} />
                  </td>
                </tr>
              {/each}
              {#if filteredResults.length === 0}
                <tr>
                  <td colspan="9" class="text-center text-muted"
                    >No results found</td
                  >
                </tr>
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination controls -->
    <Pagination
      {offset}
      {limit}
      total={summary.total}
      {loading}
      {fetchData}
      label="results"
    />
  {/if}
</div>
