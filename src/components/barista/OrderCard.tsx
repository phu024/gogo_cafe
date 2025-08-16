// filepath: g:\Train\Test\gogo_cafe\src\components\barista\OrderCard.tsx
import React from 'react';
import { Card, Button } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import type { Order, OrderStatus } from '@/types';
import type { StatusViewConfig } from '@/hooks/useBaristaOrders';

interface NextAction { text: string; to: OrderStatus; color: string }

interface OrderCardProps {
  order: Order;
  statusView: StatusViewConfig;
  elapsed: string;
  nextAction: NextAction | null;
  onAdvance: (id: string, to: OrderStatus) => void;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

const MAX_SHOW = 3;

const OrderCard: React.FC<OrderCardProps> = ({ order, statusView, elapsed, nextAction, onAdvance, isExpanded, onToggleExpand }) => {
  const itemLines = order.items.map(it => {
    const toppingText = it.toppings && it.toppings.length > 0 ? ` (${it.toppings.map(t => t.name).join(', ')})` : '';
    return `${it.quantity}x ${it.menu_item.name}${toppingText}`;
  });
  const hidden = itemLines.length - MAX_SHOW;

  return (
    <Card
      size="small"
      className="relative border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all h-full"
      bodyStyle={{ padding: 14, height: '100%' }}
      style={{ borderLeft: `6px solid ${statusView.color}` }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-semibold text-gray-700 shrink-0">#{order.id}</span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"
                style={{ background: `${statusView.color}20`, color: statusView.color }}
              >
                {statusView.icon}
                {statusView.text}
              </span>
              <span className="truncate text-xs text-gray-500">
                {order.User.first_name} {order.User.last_name}{order.User.phone_number ? ` (${order.User.phone_number})` : ''}
              </span>
            </div>
          </div>
          {elapsed && (
            <div
              className="text-center px-2 py-1 rounded-md text-[10px] font-semibold leading-none"
              style={{ background: `${statusView.color}15`, color: statusView.color }}
            >{elapsed}</div>
          )}
        </div>

        {/* Items */}
        <div className="mb-3 space-y-1">
          {(isExpanded ? itemLines : itemLines.slice(0, MAX_SHOW)).map((line, i) => (
            <div key={i} className="text-[11px] text-gray-800 leading-snug">• {line}</div>
          ))}
          {hidden > 0 && !isExpanded && (
            <button type="button" onClick={() => onToggleExpand(order.id)} className="text-[11px] text-blue-600 hover:underline">+ อีก {hidden} รายการ</button>
          )}
          {hidden > 0 && isExpanded && (
            <button type="button" onClick={() => onToggleExpand(order.id)} className="text-[11px] text-blue-600 hover:underline">แสดงน้อยลง</button>
          )}
        </div>

        {order.notes && (
          <div className="mb-3 rounded-md bg-yellow-50 border border-yellow-200 px-2 py-1 flex items-start gap-1">
            <FileTextOutlined className="text-yellow-500 mt-0.5" />
            <span className="text-[11px] text-yellow-800 leading-snug whitespace-pre-wrap">{order.notes}</span>
          </div>
        )}

        <div className="flex items-center justify-end mb-2 text-[11px] text-gray-500">
          <span className="text-sm font-semibold text-gray-900">฿{order.total_amount}</span>
        </div>

        {/* Action (sticks to bottom) */}
        <div className="mt-auto">
          {nextAction ? (
            <Button
              size="small"
              type="primary"
              style={{ background: nextAction.color, borderColor: nextAction.color }}
              className="w-full text-xs font-medium"
              onClick={() => onAdvance(order.id, nextAction.to)}
            >{nextAction.text}</Button>
          ) : (
            <div className="h-8" /> /* reserve height to align */
          )}
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;
