import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { fetchExecutions } from '$lib/api/cleopatra';

export const load: PageLoad = async ({ url, fetch }) => {
  const limit = parseInt(url.searchParams.get('limit') ?? '50') || 50;
  const offset = parseInt(url.searchParams.get('offset') ?? '0') || 0;

  try {
    const response = await fetchExecutions(limit, offset, fetch);
    return {
      executions: response.items,
      total: response.total,
      limit: response.limit,
      offset: response.offset,
      has_next: response.has_next
    };
  } catch (error) {
    console.error('Error loading executions:', error);
    return {
      executions: [],
      total: 0,
      limit,
      offset,
      has_next: false,
      error: (error as Error).message
    };
  }
};