import { useMemo } from 'react';
import type { OrderStatus } from '@/types';

export function useBaristaStatisticsLogic(byStatus: (status: OrderStatus) => unknown[]) {
  const stats = useMemo(() => ({
    waiting: byStatus('WAITING').length,
    inProgress: byStatus('IN_PROGRESS').length,
    ready: byStatus('READY').length,
    completed: byStatus('COMPLETED').length,
  }), [byStatus]);

  return stats;
}
