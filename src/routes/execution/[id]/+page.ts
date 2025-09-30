import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { fetchExecutionResults } from '$lib/api/cleopatra';

export const load: PageLoad = async ({ params, url, fetch }) => {
  const executionId = parseInt(params.id);
  const limit = parseInt(url.searchParams.get('limit') ?? '50') || 50;
  const offset = parseInt(url.searchParams.get('offset') ?? '0') || 0;

  try {
    const response = await fetchExecutionResults(executionId, limit, offset, fetch);
    
    // Get available platforms and statuses for filters
    const availablePlatforms = [...new Set(response.items.map(r => r.platform))];
    const availableStatuses = [...new Set(response.items.map(r => r.status))];
    
    return {
      results: response.items,
      summary: response.summary,
      total: response.total,
      limit: response.limit,
      offset: response.offset,
      has_next: response.has_next,
      executionId,
      // executionName will be populated from store on client-side
      availablePlatforms,
      availableStatuses
    };
  } catch (error) {
    console.error('Error loading test results:', error);
    return {
      results: [],
      summary: { total: 0, pass: 0, fail: 0, ignor: 0 },
      total: 0,
      limit,
      offset,
      has_next: false,
      executionId,
      availablePlatforms: [],
      availableStatuses: [],
      error: (error as Error).message
    };
  }
};