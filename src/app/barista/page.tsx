"use client";
import React from 'react';
import { Layout, Typography, Card, Row, Col, Badge, Tabs, Empty, Input, DatePicker, Button } from 'antd';
import { SearchOutlined, ReloadOutlined, CoffeeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Header from '@/components/header';
import { sampleOrders } from '@/lib/mock-data';
import OrderCard from '@/components/barista/OrderCard';
import { useBaristaOrders } from '@/hooks/useBaristaOrders';
import { ORDER_STATUS_CONFIG } from '@/config/orderStatus';
import type { OrderStatus } from '@/types';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;
const { Search } = Input;
const { RangePicker } = DatePicker;

const TABBED_STATUSES: OrderStatus[] = ['PENDING','IN_PROGRESS','READY','COMPLETED'];

const BaristaPage: React.FC = () => {
  const {
    // orders (not currently needed directly)
    searchText, setSearchText,
    expanded, toggleExpand,
    dateRange, setDateRange,
    allActive, byStatus,
    updateStatus, getStatusView,
    formatElapsed, getNextAction,
    resetFilters,
    activeTab, setActiveTab
  } = useBaristaOrders(sampleOrders, { persistKey: 'baristaDashboardState' });

  const tabItem = (status: OrderStatus, label: string, empty: string) => ({
    key: status,
    label: <span className="flex items-center gap-2">{label}<Badge count={byStatus(status).length} /></span>,
    children: (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {byStatus(status).length === 0 ? (
          <Empty description={empty} className="col-span-full" />
        ) : (
          byStatus(status).map(o => (
            <OrderCard
              key={o.id}
              order={o}
              statusView={getStatusView(o.order_status)}
              elapsed={formatElapsed(o)}
              nextAction={getNextAction(o)}
              onAdvance={updateStatus}
              isExpanded={expanded.has(o.id)}
              onToggleExpand={toggleExpand}
            />
          ))
        )}
      </div>
    )
  });

  return (
    <Layout>
      <Header />
      <Content className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="rounded-xl bg-white border border-gray-200 p-6 mb-6 flex items-center justify-between">
            <div>
              <Title level={2} className="!mb-1 text-gray-800">Barista Dashboard</Title>
              <Paragraph className="!mb-0 text-gray-500">จัดการออเดอร์แบบเรียลไทม์ (FIFO)</Paragraph>
            </div>
            <div className="text-right">
              <Badge count={byStatus('PENDING').length} className="mb-1">
                <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center border border-orange-200">
                  <CoffeeOutlined className="text-xl text-orange-500" />
                </div>
              </Badge>
              <Text className="block text-gray-500 text-sm">ออเดอร์ที่รอ</Text>
            </div>
          </div>

          <Card className="mb-5 shadow-sm">
            <Row gutter={12} align="middle">
              <Col xs={24} md={10} lg={8}>
                <Search
                  placeholder="ค้นหาชื่อลูกค้าหรือรหัสออเดอร์"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined />}
                  size="large"
                />
              </Col>
              <Col xs={24} md={10} lg={6} className="mt-3 md:mt-0">
                <RangePicker
                  value={dateRange}
                  onChange={(vals) => {
                    if (vals && vals[0] && vals[1]) setDateRange([vals[0], vals[1]]); else setDateRange(null);
                  }}
                  size="large"
                  className="w-full"
                  format="YYYY-MM-DD"
                  placeholder={["วันเริ่ม", "วันสิ้นสุด"]}
                  allowClear
                  disabledDate={(current)=> current ? current > dayjs().endOf('day') : false}
                />
              </Col>
              <Col xs={12} md={4} lg={3} className="mt-3 md:mt-0">
                <Button
                  icon={<ReloadOutlined />}
                  size="large"
                  onClick={resetFilters}
                  className="w-full"
                >รีเซ็ต</Button>
              </Col>
            </Row>
          </Card>

          <Tabs
            activeKey={activeTab}
            onChange={(k)=> setActiveTab(k)}
            size="large"
            items={[
              {
                key: 'all',
                label: <span className="flex items-center gap-2">ทั้งหมด<Badge count={allActive().length} /></span>,
                children: (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {allActive().length === 0 ? (
                      <Empty description="ยังไม่มีออเดอร์" className="col-span-full" />
                    ) : (
                      allActive().map(o => (
                        <OrderCard
                          key={o.id}
                          order={o}
                          statusView={getStatusView(o.order_status)}
                          elapsed={formatElapsed(o)}
                          nextAction={getNextAction(o)}
                          onAdvance={updateStatus}
                          isExpanded={expanded.has(o.id)}
                          onToggleExpand={toggleExpand}
                        />
                      ))
                    )}
                  </div>
                )
              },
              ...TABBED_STATUSES.map(st => tabItem(st, ORDER_STATUS_CONFIG[st].labelTh, `ไม่มีออเดอร์ที่${ORDER_STATUS_CONFIG[st].labelTh}`))
            ]}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default BaristaPage;
