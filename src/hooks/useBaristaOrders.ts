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

export interface StatusViewConfig { color: string; icon: React.ReactNode; text: string; }

const ICON_MAP: Partial<Record<OrderStatus, React.ReactNode>> = {
  PENDING: React.createElement(ClockCircleOutlined),
  IN_PROGRESS: React.createElement(CoffeeOutlined),
  READY: React.createElement(CheckCircleOutlined),
  COMPLETED: React.createElement(CheckOutlined)
};

export function useBaristaOrders(initialOrders: Order[], options?: { persistKey?: string }) {
  const persistKey = options?.persistKey || 'baristaDashboardState';
  // Only persist the selected date range (start & end) in localStorage
  const dateStorageKey = 'baristaSelectedDateRange';

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchText, setSearchText] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [dateRange, _setDateRange] = useState<[Dayjs, Dayjs] | null>(null); // hydrated later
  const [activeTab, setActiveTab] = useState<string>('all');

  // Hydrate UI state (except date) from sessionStorage once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = sessionStorage.getItem(persistKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.searchText) setSearchText(parsed.searchText);
      if (parsed.expanded && Array.isArray(parsed.expanded)) {
        setExpanded(new Set(parsed.expanded));
      }
      if (parsed.activeTab) setActiveTab(parsed.activeTab);
    } catch {/* ignore hydrate error */}
  }, [persistKey]);

  // Hydrate date range from localStorage (supports old single-date format)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(dateStorageKey);
      if (raw) {
        let startIso: string | null = null;
        let endIso: string | null = null;
        if (raw.startsWith('{')) {
          // new format
          const parsed = JSON.parse(raw);
          startIso = parsed.start || null;
          endIso = parsed.end || parsed.start || null;
        } else {
          // legacy single date string
          startIso = raw;
          endIso = raw;
        }
        if (startIso && endIso) {
          _setDateRange([dayjs(startIso), dayjs(endIso)]);
          return;
        }
      }
      const today = dayjs();
      _setDateRange([today, today]);
    } catch {
      const today = dayjs();
      _setDateRange([today, today]);
    }
  }, [dateStorageKey]);

  // Persist non-date UI state in sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = JSON.stringify({
      searchText,
      expanded: Array.from(expanded),
      activeTab
    });
    try { sessionStorage.setItem(persistKey, payload); } catch { /* ignore */ }
  }, [searchText, expanded, activeTab, persistKey]);

  // Persist ONLY the selected date range (both start & end) to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (dateRange && dateRange[0] && dateRange[1]) {
      try {
        localStorage.setItem(dateStorageKey, JSON.stringify({ start: dateRange[0].toISOString(), end: dateRange[1].toISOString() }));
      } catch { /* ignore */ }
    } else {
      try { localStorage.removeItem(dateStorageKey); } catch {/* ignore */}
    }
  }, [dateRange, dateStorageKey]);

  const validateAndSetDateRange = useCallback((range: [Dayjs, Dayjs] | null) => {
    if (!range) { _setDateRange(null); return; }
    let [start, end] = range;
    const today = dayjs().endOf('day');
    let changed = false;
    if (start.isAfter(end)) { // swap if inverted
      const tmp = start; start = end; end = tmp; changed = true; }
    if (start.isAfter(today)) { start = today.startOf('day'); changed = true; }
    if (end.isAfter(today)) { end = today; changed = true; }
    if (changed) { message.warning('ไม่สามารถเลือกวันที่อนาคต ระบบได้ปรับให้เป็นวันนี้'); }
    _setDateRange([start, end]);
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }, []);

  const filtered = useMemo(() => orders.filter(o => {
    const name = (o.User.first_name + (o.User.last_name ? ' ' + o.User.last_name : '')).toLowerCase();
    const q = searchText.toLowerCase();
    const matchesSearch = name.includes(q) || o.id.toLowerCase().includes(q);
    const matchesDate = (() => {
      if (!dateRange) return true; const [start, end] = dateRange; const ot = dayjs(o.order_time);
      return ot.isSame(start,'day') || ot.isSame(end,'day') || (ot.isAfter(start,'day') && ot.isBefore(end,'day'));
    })();
    return matchesSearch && matchesDate;
  }), [orders, searchText, dateRange]);

  const allActive = useCallback(() => filtered
    .filter(o => ACTIVE_QUEUE_STATUSES.includes(o.order_status))
    .sort((a,b)=> dayjs(a.order_time).valueOf() - dayjs(b.order_time).valueOf()), [filtered]);

  const byStatus = useCallback((status: OrderStatus) => filtered
    .filter(o => o.order_status === status)
    .sort((a,b)=> dayjs(a.order_time).valueOf() - dayjs(b.order_time).valueOf()), [filtered]);

  const updateStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, order_status: status, ...(status === 'COMPLETED' && !o.completed_time ? { completed_time: new Date() } : {}) } : o));
    message.success(`อัปเดตสถานะออเดอร์ ${id} แล้ว`);
  }, []);

  const getStatusView = useCallback((status: OrderStatus): StatusViewConfig => {
    const base = ORDER_STATUS_CONFIG[status];
    return { color: base.color, icon: ICON_MAP[status] ?? React.createElement(ClockCircleOutlined), text: base.labelTh };
  }, []);

  const formatElapsed = useCallback((order: Order) => {
    if (order.order_status === 'COMPLETED') return '';
    const mins = dayjs().diff(dayjs(order.order_time), 'minute');
    if (mins > 1440) return '';
    if (mins < 60) return `${mins} นาที`;
    const h = Math.floor(mins/60); const r = mins % 60; return r===0 ? `${h} ชม.` : `${h} ชม. ${r} นาที`;
  }, []);

  const getNextAction = useCallback((order: Order): { text: string; to: OrderStatus; color: string } | null => {
    switch(order.order_status){
      case 'PENDING': return { text: 'เริ่มทำ', to: 'IN_PROGRESS', color: ORDER_STATUS_CONFIG.PENDING.color };
      case 'IN_PROGRESS': return { text: 'พร้อมแล้ว', to: 'READY', color: ORDER_STATUS_CONFIG.IN_PROGRESS.color };
      case 'READY': return { text: 'เสร็จแล้ว', to: 'COMPLETED', color: ORDER_STATUS_CONFIG.READY.color };
      default: return null;
    }
  }, []);

  const resetFilters = useCallback(()=> {
    setSearchText('');
    setExpanded(new Set());
    const today = dayjs();
    validateAndSetDateRange([today, today]); // reset date to today as requested
  }, [validateAndSetDateRange]);

  const showAllDates = useCallback(()=> {
    validateAndSetDateRange(null); // clears date filter; persistence effect will remove key
  }, [validateAndSetDateRange]);

  const resetOrders = useCallback(()=>{ setOrders(initialOrders); }, [initialOrders]);

  return { orders, searchText, setSearchText, expanded, toggleExpand, dateRange, setDateRange: validateAndSetDateRange, allActive, byStatus, updateStatus, getStatusView, formatElapsed, getNextAction, resetFilters, activeTab, setActiveTab, resetOrders, showAllDates };
}
