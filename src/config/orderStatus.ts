import type { OrderStatus } from '@/types';

// Centralized order status configuration usable across Barista, Customer, Manager views
export interface OrderStatusConfigItem {
  key: OrderStatus;
  labelTh: string;      // Thai label
  color: string;        // Base color (used for pill / border)
  showInTabs: boolean;  // Whether to render a dedicated tab in barista dashboard
  active: boolean;      // Considered part of active work queue
}

// NOTE: UN_PAYMENT & CANCELED kept but hidden from normal barista tabs
export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusConfigItem> = {
  UN_PAYMENT:   { key: 'UN_PAYMENT',   labelTh: 'รอชำระ',   color: '#a855f7', showInTabs: false, active: false },
  PENDING:      { key: 'PENDING',      labelTh: 'รอทำ',     color: '#f59e0b', showInTabs: true,  active: true  },
  IN_PROGRESS:  { key: 'IN_PROGRESS',  labelTh: 'กำลังทำ',  color: '#3b82f6', showInTabs: true,  active: true  },
  READY:        { key: 'READY',        labelTh: 'พร้อมรับ', color: '#10b981', showInTabs: true,  active: true  },
  COMPLETED:    { key: 'COMPLETED',    labelTh: 'เสร็จสิ้น', color: '#6b7280', showInTabs: true,  active: false },
  CANCELED:     { key: 'CANCELED',     labelTh: 'ยกเลิก',   color: '#ef4444', showInTabs: false, active: false }
};

export const BARISTA_TAB_STATUSES: OrderStatus[] = Object.values(ORDER_STATUS_CONFIG)
  .filter(s => s.showInTabs)
  .map(s => s.key);

export const ACTIVE_QUEUE_STATUSES: OrderStatus[] = Object.values(ORDER_STATUS_CONFIG)
  .filter(s => s.active)
  .map(s => s.key);

export const STATUS_COLOR_MAP: Record<OrderStatus, string> = Object.keys(ORDER_STATUS_CONFIG)
  .reduce((acc, k) => { const key = k as OrderStatus; acc[key] = ORDER_STATUS_CONFIG[key].color; return acc; }, {} as Record<OrderStatus,string>);
