import { useEffect, useState } from 'react';
import type { OrderStatus } from '@/types';

const ORDER_STATUS_TIMING: Partial<Record<OrderStatus, { time: number }>> = {
  WAITING: { time: 5000 },
  IN_PROGRESS: { time: 20000 },
  READY: { time: 5000 },
  COMPLETED: undefined,
  CANCELED: undefined,
};

export function useOrderSuccessLogic(orderStatus: OrderStatus) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(orderStatus);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let statusTimeout: NodeJS.Timeout | null = null;
    let progressInterval: NodeJS.Timeout | null = null;

    const simulateProgress = (duration: number) => {
      setProgress(0);
      let elapsed = 0;
      progressInterval = setInterval(() => {
        elapsed += 100;
        setProgress(Math.min((elapsed / duration) * 100, 100));
        if (elapsed >= duration) {
          clearInterval(progressInterval!);
        }
      }, 100);
    };

    if (currentStatus === 'WAITING' && ORDER_STATUS_TIMING['WAITING']) {
      simulateProgress(ORDER_STATUS_TIMING['WAITING']!.time);
      statusTimeout = setTimeout(() => {
        setCurrentStatus('IN_PROGRESS');
      }, ORDER_STATUS_TIMING['WAITING']!.time);
    } else if (currentStatus === 'IN_PROGRESS' && ORDER_STATUS_TIMING['IN_PROGRESS']) {
      simulateProgress(ORDER_STATUS_TIMING['IN_PROGRESS']!.time);
      statusTimeout = setTimeout(() => {
        setCurrentStatus('READY');
      }, ORDER_STATUS_TIMING['IN_PROGRESS']!.time);
    } else if (currentStatus === 'READY' && ORDER_STATUS_TIMING['READY']) {
      statusTimeout = setTimeout(() => {
        setCurrentStatus('COMPLETED');
      }, ORDER_STATUS_TIMING['READY']!.time);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (statusTimeout) clearTimeout(statusTimeout);
    };
  }, [currentStatus]);

  return {
    currentStatus,
    progress,
    setCurrentStatus,
  };
}
