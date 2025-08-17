"use client";
import React, { useCallback } from 'react';
import { Layout, Typography, Card, Row, Col, Badge, Tabs, Empty, Input, DatePicker, Button } from 'antd';
import { SearchOutlined, ReloadOutlined, CoffeeOutlined } from '@ant-design/icons';
import type { RangePickerProps } from 'antd/es/date-picker';
import Header from '@/components/header';
import { sampleOrders } from '@/lib/mock-data';
import OrderCard from '@/components/barista/OrderCard';
import { useBaristaOrders } from '@/hooks/useBaristaOrders';
import { ORDER_STATUS_CONFIG } from '@/config/orderStatus';
import type { OrderStatus } from '@/types';
import CurrentTime from '@/components/barista/CurrentTime';
import StatisticsCard from '@/components/barista/StatisticsCard';

const { Text, Title } = Typography;
const { Content } = Layout;
const { Search } = Input;
const { RangePicker } = DatePicker;

const TABBED_STATUSES: OrderStatus[] = ['PENDING', 'IN_PROGRESS', 'READY', 'COMPLETED'];

const BaristaPage: React.FC = () => {

  const {
    searchText,
    setSearchText,
    expanded,
    toggleExpand,
    dateRange,
    setDateRange,
    allActive,
    byStatus,
    updateStatus,
    getStatusView,
    formatElapsed,
    getNextAction,
    resetFilters,
    activeTab,
    setActiveTab
  } = useBaristaOrders(sampleOrders, { persistKey: 'baristaOrders' });

  // Tab configuration helper
  const createTabItem = useCallback((status: OrderStatus, label: string, emptyMessage: string) => {
    const orders = byStatus(status);
    return {
      key: status,
      label: (
        <span className="flex items-center gap-2">
          {label}
          <Badge count={orders.length} />
        </span>
      ),
      children: (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders.length === 0 ? (
            <Empty description={emptyMessage} className="col-span-full" />
          ) : (
            orders.map(order => {
              const nextAction = getNextAction(order);
              return (
                <OrderCard
                  key={order.id}
                  order={order}
                  statusView={getStatusView(order.order_status)}
                  elapsed={formatElapsed(order)}
                  nextAction={nextAction && nextAction.text ? nextAction : undefined}
                  onAdvance={updateStatus}
                  isExpanded={expanded.has(order.id)}
                  onToggleExpand={toggleExpand}
                />
              );
            })
          )}
        </div>
      ),
    };
  }, [byStatus, expanded, formatElapsed, getNextAction, getStatusView, toggleExpand, updateStatus]);

  const handleDateRangeChange: RangePickerProps['onChange'] = (dates) => {
    if (dates) {
      setDateRange([dates[0]!, dates[1]!]);
    } else {
      setDateRange(null);
    }
  };

  // Create tab items
  const allOrdersTab = {
    key: 'all',
    label: (
      <span className="flex items-center gap-2">
        ทั้งหมด
        <Badge count={allActive().length} />
      </span>
    ),
    children: (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {allActive().length === 0 ? (
          <Empty description="ไม่มีรายการที่ต้องดำเนินการ" className="col-span-full" />
        ) : (
          allActive().map(order => {
            const nextAction = getNextAction(order);
            return (
              <OrderCard
                key={order.id}
                order={order}
                statusView={getStatusView(order.order_status)}
                elapsed={formatElapsed(order)}
                nextAction={nextAction && nextAction.text ? nextAction : undefined}
                onAdvance={updateStatus}
                isExpanded={expanded.has(order.id)}
                onToggleExpand={toggleExpand}
              />
            );
          })
        )}
      </div>
    ),
  };
  const statusTabs = TABBED_STATUSES.map(status => {
    let emptyMessage;
    switch (status) {
      case 'PENDING':
        emptyMessage = 'ไม่มีรายการที่รอดำเนินการ';
        break;
      case 'IN_PROGRESS':
        emptyMessage = 'ไม่มีรายการที่กำลังดำเนินการ';
        break;
      case 'READY':
        emptyMessage = 'ไม่มีรายการที่ดำเนินการเสร็จ';
        break;
      case 'COMPLETED':
        emptyMessage = 'ไม่มีรายการที่ส่งมอบแล้ว';
        break;
      default:
        emptyMessage = 'ไม่มีรายการ';
    }
    return createTabItem(status, ORDER_STATUS_CONFIG[status].labelTh, emptyMessage);
  });


  return (
    <Layout>
      <Header />      <Content className="container mx-auto px-4 py-8">        {/* Content Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>              <Title level={4} className="!mb-1">การจัดการงานเครื่องดื่ม</Title>
              <Text className="text-gray-600">จัดการคิวและติดตามสถานะการดำเนินการเครื่องดื่ม</Text>
            </div>            <CurrentTime />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatisticsCard            title="รอดำเนินการ"
            count={byStatus('PENDING').length}
            icon={<CoffeeOutlined className="text-xl text-orange-500" />}
            color="bg-orange-100"
          />
          <StatisticsCard
            title="กำลังดำเนินการ"
            count={byStatus('IN_PROGRESS').length}
            icon={<CoffeeOutlined className="text-xl text-blue-500" />}
            color="bg-blue-100"
          />
          <StatisticsCard
            title="ดำเนินการเสร็จ (พร้อมรับ)"
            count={byStatus('READY').length}
            icon={<CoffeeOutlined className="text-xl text-green-500" />}
            color="bg-green-100"
          />
          <StatisticsCard
            title="ส่งมอบแล้ว"
            count={byStatus('COMPLETED').length}
            icon={<CoffeeOutlined className="text-xl text-purple-500" />}
            color="bg-purple-100"
          />
        </div>

        {/* Filters Card */}
        <Card className="mb-5 shadow-sm">
          <Row gutter={12} align="middle">
            <Col xs={24} md={10} lg={8}>
              <Search              placeholder="ค้นหาจากชื่อลูกค้าหรือเลขออเดอร์"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              size="large"
              />
            </Col>
            <Col xs={24} md={10} lg={6} className="mt-3 md:mt-0">
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                format="DD/MM/YYYY"
                size="large"
                className="w-full"
              />
            </Col>
            <Col xs={24} md={4} lg={10} className="mt-3 md:mt-0 text-right">
              <Button
                icon={<ReloadOutlined />}
                onClick={resetFilters}
                size="large"
              >
                ล้างตัวกรอง
              </Button>
            </Col>
          </Row>
          <div className="mt-6">
          <Tabs
            activeKey={activeTab}
            onChange={key => setActiveTab(key as OrderStatus)}
            items={[allOrdersTab, ...statusTabs]}
          />
        </div>
        </Card>

        {/* Orders Tabs */}
        
      </Content>
    </Layout>
  );
};

export default BaristaPage;
