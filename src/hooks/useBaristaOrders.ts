// filepath: g:\Train\Test\gogo_cafe\src\hooks\useBaristaOrders.ts
import { useState, useMemo, useCallback, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { message } from 'antd';
import type { Order, OrderStatus } from '@/types';
import { ORDER_STATUS_CONFIG, ACTIVE_QUEUE_STATUSES } from '@/config/orderStatus';
import {
  CoffeeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CheckOutlined
} from '@ant-design/icons';
import React from 'react';

export interface StatusViewConfig {
  color: string;
  icon: React.ReactNode;
  text: string;
}

// Constant configurations
const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  WAITING: React.createElement(ClockCircleOutlined),
  IN_PROGRESS: React.createElement(CoffeeOutlined),
  READY: React.createElement(CheckCircleOutlined),
  COMPLETED: React.createElement(CheckOutlined),
  CANCELED: null
};

interface UseBaristaOrdersOptions {
  persistKey?: string;
}

export function useBaristaOrders(initialOrders: Order[], options?: UseBaristaOrdersOptions) {
  // State management
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchText, setSearchText] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Initialize date range to today on first load
  useEffect(() => {
    const storedDateRange = localStorage.getItem('baristaDateRange');
    if (storedDateRange) {
      const [start, end] = JSON.parse(storedDateRange);
      setDateRange([dayjs(start), dayjs(end)]);
    } else {
      const today = dayjs();
      const newRange: [Dayjs, Dayjs] = [today.startOf('day'), today.endOf('day')];
      setDateRange(newRange);
      localStorage.setItem('baristaDateRange', JSON.stringify([
        newRange[0].toISOString(),
        newRange[1].toISOString()
      ]));
    }
  }, []);

  // Persist orders if needed
  useEffect(() => {
    if (options?.persistKey) {
      const stored = localStorage.getItem(options.persistKey);
      if (stored) {
        try {
          setOrders(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse stored orders:', e);
        }
      }
    }
  }, [options?.persistKey]);

  // Order filtering and sorting
  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        // Apply search filter
        if (searchText) {
          const searchLower = searchText.toLowerCase();
          return (
            order.id.toLowerCase().includes(searchLower) ||
            order.User.first_name.toLowerCase().includes(searchLower) ||
            order.User.last_name.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .filter(order => {
        // Apply date filter
        if (dateRange) {
          const [start, end] = dateRange;
          const orderDate = dayjs(order.order_time);
          return orderDate.isAfter(start) && orderDate.isBefore(end);
        }
        return true;
      })
      .sort((a, b) => new Date(b.order_time).getTime() - new Date(a.order_time).getTime());
  }, [orders, searchText, dateRange]);

  // Status-based order grouping
  const byStatus = useCallback((status: OrderStatus) => {
    return filteredOrders.filter(o => o.order_status === status);
  }, [filteredOrders]);

  const allActive = useCallback(() => {
    return filteredOrders.filter(o => ACTIVE_QUEUE_STATUSES.includes(o.order_status));
  }, [filteredOrders]);

  // Utility functions
  const formatElapsed = useCallback((order: Order) => {
    const start = dayjs(order.order_time);
    const end = order.completed_time ? dayjs(order.completed_time) : dayjs();
    const mins = end.diff(start, 'minute');
    return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }, []);

  const getStatusView = useCallback((status: OrderStatus): StatusViewConfig => {
    const config = ORDER_STATUS_CONFIG[status];
    return {
      color: config.color,
      icon: STATUS_ICONS[status],
      text: config.labelTh
    };
  }, []);

  const getNextAction = useCallback((order: Order) => {
    const config = ORDER_STATUS_CONFIG[order.order_status];
    return config.next ? {
      to: config.next,
      text: config.nextAction,
      color: ORDER_STATUS_CONFIG[config.next].color
    } : undefined;
  }, []);

  // Action handlers
  const toggleExpand = useCallback((orderId: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  }, []);

  const updateStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            order_status: newStatus,
            completed_time: newStatus === 'COMPLETED' ? new Date() : o.completed_time
          };
        }
        return o;
      });

      // Persist if needed
      if (options?.persistKey) {
        localStorage.setItem(options.persistKey, JSON.stringify(updated));
      }

      return updated;
    });

    message.success(`อัพเดทสถานะออเดอร์ ${orderId} เป็น ${ORDER_STATUS_CONFIG[newStatus].labelTh}`);
  }, [options?.persistKey]);
  const updateDateRange = useCallback((newRange: [Dayjs, Dayjs] | null) => {
    setDateRange(newRange);
    if (newRange) {
      localStorage.setItem('baristaDateRange', JSON.stringify([
        newRange[0].toISOString(),
        newRange[1].toISOString()
      ]));
    } else {
      localStorage.removeItem('baristaDateRange');
    }
  }, []);

  const resetFilters = useCallback(() => {
    setSearchText('');
    updateDateRange(null);
  }, [updateDateRange]);

  const resetOrders = useCallback(() => {
    setOrders(initialOrders);
    if (options?.persistKey) {
      localStorage.removeItem(options.persistKey);
    }
  }, [initialOrders, options?.persistKey]);

  return {
    // State
    orders,
    searchText,
    expanded,
    dateRange,
    activeTab,

    // Filtered data
    byStatus,
    allActive,    // Actions
    setSearchText,
    toggleExpand,
    setDateRange: updateDateRange,
    updateStatus,
    setActiveTab,
    resetFilters,
    resetOrders,

    // Utilities
    formatElapsed,
    getStatusView,
    getNextAction,
  };
}
