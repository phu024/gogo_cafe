import { useMemo } from 'react';
import dayjs from 'dayjs';
import type { Order } from '@/types';

export function useBaristaOrderCardLogic(order: Order, isExpanded: boolean) {
  const MAX_ITEMS_TO_SHOW = 3;

  const { itemLines, hiddenCount } = useMemo(() => {
    const lines = order.items.map((item) => {
      const toppings = item.toppings?.length > 0 ? ` (${item.toppings.map((t) => t.name).join(", ")})` : "";
      return `${item.quantity}x ${item.menu_item.name}${toppings}`;
    });
    return {
      itemLines: isExpanded ? lines : lines.slice(0, MAX_ITEMS_TO_SHOW),
      hiddenCount: Math.max(0, lines.length - MAX_ITEMS_TO_SHOW),
    };
  }, [order.items, isExpanded]);

  const badgeType = useMemo(() => {
    const now = dayjs();
    const orderTime = dayjs(order.order_time);
    const completed = order.order_status === "COMPLETED";
    const ready = order.order_status === "READY";
    const minutesElapsed = now.diff(orderTime, "minute");
    if (!completed && !ready && order.order_status !== "CANCELED") {
      if (minutesElapsed < 1) return "new";
      if (minutesElapsed < 5) return "urgent";
      if (minutesElapsed > 15) return "late";
    }
    return null;
  }, [order]);

  return { itemLines, hiddenCount, badgeType };
}
