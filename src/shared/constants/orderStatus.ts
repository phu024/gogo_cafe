import type { OrderStatus } from '@/types';

// Centralized order status configuration usable across views
export interface OrderStatusConfigItem {
  key: OrderStatus;
  labelTh: string;      // Thai label
  labelEn: string;      // English label
  color: string;        // Base color (used for pill / border)
  showInTabs: boolean;  // Whether to render a dedicated tab in barista dashboard
  active: boolean;      // Considered part of active work queue
  next?: OrderStatus;   // Next status in the workflow
  nextAction?: string;  // Label for the action button
  description?: string; // Additional context about this status
}

// Workflow configuration
const ORDER_WORKFLOW: Partial<Record<OrderStatus, OrderStatus>> = {
  'WAITING': 'ACCEPTED',
  'ACCEPTED': 'READY',
  'READY': 'COMPLETED'
};

// Base configuration for all order statuses
export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusConfigItem> = {
  WAITING: { 
    key: 'WAITING',      
    labelTh: 'ใหม่',
    labelEn: 'Waiting',     
    color: '#3b82f6', 
    showInTabs: true,  
    active: true,
    next: ORDER_WORKFLOW['WAITING'],
    nextAction: 'รับออเดอร์',
    description: 'ออเดอร์ใหม่เข้ามา โปรดกด "รับออเดอร์" เพื่อเริ่มทำ'
  },
  ACCEPTED: { 
    key: 'ACCEPTED',  
    labelTh: 'กำลังทำ',
    labelEn: 'In Progress',  
    color: '#f97316', 
    showInTabs: true,  
    active: true,
    next: ORDER_WORKFLOW['ACCEPTED'],
    nextAction: 'ทำเสร็จแล้ว',
    description: 'ออเดอร์กำลังอยู่ในขั้นตอนการเตรียม'
  },
  READY: { 
    key: 'READY',        
    labelTh: 'เสร็จแล้ว',
    labelEn: 'Ready', 
    color: '#10b981', 
    showInTabs: true,  
    active: true,
    next: ORDER_WORKFLOW['READY'],
    nextAction: 'ลูกค้ารับแล้ว',
    description: 'เครื่องดื่มพร้อมเสิร์ฟ! รอให้ลูกค้ามารับที่เคาน์เตอร์'
  },
  COMPLETED: { 
    key: 'COMPLETED',    
    labelTh: 'สำเร็จ',
    labelEn: 'Completed', 
    color: '#6b7280', 
    showInTabs: true,  
    active: false,
    description: 'ลูกค้ารับเครื่องดื่มและออเดอร์เสร็จสมบูรณ์แล้ว'
  },
  CANCELED: { 
    key: 'CANCELED',     
    labelTh: 'ยกเลิก',
    labelEn: 'Canceled',   
    color: '#ef4444', 
    showInTabs: true, 
    active: false,
    description: 'ออเดอร์นี้ถูกยกเลิก ไม่ต้องดำเนินการใดๆ'
  }
};

// Derived configurations
export const BARISTA_TAB_STATUSES: OrderStatus[] = Object.values(ORDER_STATUS_CONFIG)
  .filter(s => s.showInTabs)
  .map(s => s.key);

export const ACTIVE_QUEUE_STATUSES: OrderStatus[] = Object.values(ORDER_STATUS_CONFIG)
  .filter(s => s.active)
  .map(s => s.key);

export const STATUS_COLOR_MAP: Record<OrderStatus, string> = Object.keys(ORDER_STATUS_CONFIG)
  .reduce((acc, k) => { 
    const key = k as OrderStatus; 
    acc[key] = ORDER_STATUS_CONFIG[key].color; 
    return acc; 
  }, {} as Record<OrderStatus,string>);

// Helper functions
export const getNextStatus = (currentStatus: OrderStatus): OrderStatus | undefined => {
  return ORDER_WORKFLOW[currentStatus];
};

export const isTerminalStatus = (status: OrderStatus): boolean => {
  return !ORDER_WORKFLOW[status];
};

export const isActiveStatus = (status: OrderStatus): boolean => {
  return ORDER_STATUS_CONFIG[status].active;
};
