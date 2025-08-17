// filepath: g:\Train\Test\gogo_cafe\src\components\barista\OrderCard.tsx
import React, { useMemo } from 'react';
import { Card, Button } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import type { Order, OrderStatus } from '@/types';
import type { StatusViewConfig } from '@/hooks/useBaristaOrders';

export interface NextAction {
  to: OrderStatus;
  text?: string;
  color: string;
}

interface OrderCardProps {
  order: Order;
  statusView: StatusViewConfig;
  elapsed: string;
  nextAction?: NextAction;
  onAdvance: (orderId: string, toStatus: OrderStatus) => void;
  isExpanded: boolean;
  onToggleExpand: (orderId: string) => void;
}

const MAX_ITEMS_TO_SHOW = 3;

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  statusView,
  elapsed,
  nextAction,
  onAdvance,
  isExpanded,
  onToggleExpand
}) => {
  // Memoize item lines to prevent unnecessary recalculations
  const { itemLines, hiddenCount } = useMemo(() => {
    const lines = order.items.map(item => {
      const toppings = item.toppings?.length > 0
        ? ` (${item.toppings.map(t => t.name).join(', ')})`
        : '';
      return `${item.quantity}x ${item.menu_item.name}${toppings}`;
    });

    return {
      itemLines: isExpanded ? lines : lines.slice(0, MAX_ITEMS_TO_SHOW),
      hiddenCount: Math.max(0, lines.length - MAX_ITEMS_TO_SHOW)
    };
  }, [order.items, isExpanded]);
  return (
    <Card
      size="small"
      className="relative border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all h-full"
      bodyStyle={{ padding: 16, height: '100%' }}
      style={{ borderLeft: `6px solid ${statusView.color}` }}
      hoverable
    >
      <div className="flex flex-col h-full">        {/* Order Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-gray-800">#{order.id}</span>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-500">{elapsed}</span>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-medium text-sm">{order.User.first_name} {order.User.last_name}</span>
              <span
                className="text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1.5"
                style={{ background: `${statusView.color}15`, color: statusView.color }}
              >
                {statusView.icon}
                {statusView.text}
              </span>
            </div>
          </div>
        </div>        {/* Order Items */}
        <div className="space-y-2 mb-4">
          {itemLines.map((line, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-gray-800">{line}</span>
            </div>
          ))}
          {!isExpanded && hiddenCount > 0 && (
            <Button
              type="link"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => onToggleExpand(order.id)}
              className="p-0 h-auto text-xs text-blue-600 hover:text-blue-700"
            >
              +{hiddenCount} รายการเพิ่มเติม
            </Button>
          )}
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
            {order.notes}
          </div>
        )}

        {/* Order Footer */}
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">ยอดรวม</span>
            <span className="text-base font-semibold text-gray-900">฿{order.total_amount.toFixed(2)}</span>
          </div>

          {/* Action Button */}
          {nextAction && nextAction.text && (
            <Button
              type="primary"
              size="middle"
              style={{ background: nextAction.color, borderColor: nextAction.color }}
              className="w-full font-medium shadow-sm hover:opacity-90"
              onClick={() => onAdvance(order.id, nextAction.to)}
            >
              {nextAction.text}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;
