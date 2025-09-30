// API service for Cleopatra backend

export type Execution = {
  id: number;
  name: string;
  tag: string;
  created_by: string;
  time_created: number;
};

export type ExecutionsResponse = {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  items: Execution[];
};

export type TestResult = {
  id: number;
  execution_id: number;
  name: string;
  platform: string;
  description: string;
  status: string;
  execution_time: number;
  counter: number;
  log: string;
  screenshot_id: number;
  created_by: string;
  time_created: number;
};

export type TestResultsResponse = {
  execution_id: number;
  summary: {
    total: number;
    pass: number;
    fail: number;
    ignor: number;
  };
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  items: TestResult[];
};

const API_BASE = '';

export async function fetchExecutions(limit: number, offset: number, serverFetch?: typeof fetch): Promise<ExecutionsResponse> {
  const fetchFn = serverFetch || fetch;
  try {
    const response = await fetchFn(`${API_BASE}/api/executions?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch executions: ${response.status} ${response.statusText}`);
    }
    const data: ExecutionsResponse = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching executions:', err);
    throw err;
  }
}

export async function fetchExecutionResults(executionId: number, limit: number, offset: number, serverFetch?: typeof fetch): Promise<TestResultsResponse> {
  const fetchFn = serverFetch || fetch;
  try {
    const response = await fetchFn(`${API_BASE}/api/execution/${executionId}/result?limit=${limit}&offset=${offset}&include_summary=true`);
    if (!response.ok) {
      throw new Error(`Failed to fetch test results: ${response.status} ${response.statusText}`);
    }
    const data: TestResultsResponse = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching test results:', err);
    throw err;
  }
}

export async function updateTestResultStatus(resultId: number, status: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/result/${resultId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error(`Failed to update test result status: ${response.status} ${response.statusText}`);
    }
    // 204 No Content is expected on success
  } catch (err) {
    console.error('Error updating test result status:', err);
    throw err;
  }
}