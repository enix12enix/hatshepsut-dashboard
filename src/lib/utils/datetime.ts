// Utility functions for date and time formatting

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

export function formatExecutionTime(time: number): string {
  return `${(time / 1000).toFixed(2)}s`;
}