<script lang="ts">
  type FilterType = 'select' | 'text' | 'date' | 'number';

  // Event dispatcher for filter changes
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher<{ filterChange: { id: string, value: string } }>();

  export let filters: FilterOption[];
  export let filterValues: FilterValue;
  export let availableData: { [key: string]: string[] }; // For dynamic options like available platforms/statuses
  export let statusTextConverter: (status: string) => string; // Function to convert status codes to text

  function handleChange(e: Event, filterId: string) {
    const target = e.target as HTMLSelectElement | HTMLInputElement;
    dispatch('filterChange', { id: filterId, value: target.value });
  }

  // Default status text converter if not provided
  function defaultStatusTextConverter(status: string): string {
    switch(status) {
      case "P":
        return "Passed";
      case "F":
        return "Failed";
      case "I":
        return "Ignored";
      default:
        return status;
    }
  }

  // Define types in the instance script
  type FilterOption = {
    id: string;
    label: string;
    type: FilterType;
    options?: { value: string; label: string }[];
  };

  type FilterValue = {
    [key: string]: string;
  };
</script>

<div class="card mb-3">
  <div class="card-body">
    <div class="row g-3">
      {#each filters as filter}
        <div class="col-md-6">
          <label for={filter.id} class="form-label">{filter.label}</label>
          {#if filter.type === 'select'}
            <select
              id={filter.id}
              class="form-select"
              value={filterValues[filter.id] || 'all'}
              on:change={(e) => handleChange(e, filter.id)}
            >
              <option value="all">All {filter.label.replace('Filter by ', '')}s</option>
              {#if filter.options}
                {#each filter.options as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              {:else if availableData[filter.id]}
                {#each availableData[filter.id] as item}
                  <option value={item}>
                    {filter.id === 'status' ? (statusTextConverter || defaultStatusTextConverter)(item) : item}
                  </option>
                {/each}
              {/if}
            </select>
          {:else if filter.type === 'text'}
            <input
              type="text"
              id={filter.id}
              class="form-control"
              value={filterValues[filter.id] || ''}
              on:input={(e) => handleChange(e, filter.id)}
            />
          {:else if filter.type === 'date'}
            <input
              type="date"
              id={filter.id}
              class="form-control"
              value={filterValues[filter.id] || ''}
              on:input={(e) => handleChange(e, filter.id)}
            />
          {:else if filter.type === 'number'}
            <input
              type="number"
              id={filter.id}
              class="form-control"
              value={filterValues[filter.id] || ''}
              on:input={(e) => handleChange(e, filter.id)}
            />
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>