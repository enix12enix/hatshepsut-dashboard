import { writable, type Writable } from 'svelte/store';

type Execution = {
  id: number;
  name: string;
  tag: string;
  created_by: string;
  time_created: number;
};

// Create a writable store for execution data
export const executionStore: Writable<Execution | null> = writable(null);

// Function to set execution data
export function setExecution(execution: Execution) {
  executionStore.set(execution);
}

// Function to clear execution data
export function clearExecution() {
  executionStore.set(null);
}