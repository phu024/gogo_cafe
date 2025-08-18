"use client";
import React, { useCallback } from "react";
import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Badge,
  Tabs,
  Empty,
  Input,
  DatePicker,
  Button,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import type { RangePickerProps } from "antd/es/date-picker";
import Header from "@/components/header";
import { sampleOrders } from "@/lib/mock-data";
import OrderCard from "@/components/barista/OrderCard";
import { useBaristaOrders } from "@/hooks/useBaristaOrders";
import { ORDER_STATUS_CONFIG } from "@/config/orderStatus";
import type { OrderStatus } from "@/types";
import CurrentTime from "@/components/barista/CurrentTime";
import StatisticsCard from "@/components/barista/StatisticsCard";
import dayjs from "dayjs";
import BaristaStatistics from "@/components/barista/BaristaStatistics";

const { Text, Title } = Typography;
const { Content } = Layout;
const { Search } = Input;
const { RangePicker } = DatePicker;

const TABBED_STATUSES: OrderStatus[] = [
  "WAITING",
  "ACCEPTED",
  "READY",
  "COMPLETED",
  "CANCELED",
];

const BaristaPage: React.FC = () => {
  const {
    searchText,
    setSearchText,
    expanded,
    toggleExpand,
    dateRange,
    setDateRange,
    byStatus,
    updateStatus,
    getStatusView,
    formatElapsed,
    getNextAction,
    resetFilters,
    activeTab,
    setActiveTab,
  } = useBaristaOrders(sampleOrders, { persistKey: "baristaOrders" });

  // Tab configuration helper
  const createTabItem = useCallback(
    (status: OrderStatus, label: string, emptyMessage: string) => {
      // เรียง order เก่าขึ้นก่อนในแต่ละ tab สถานะเฉพาะ
      const orders = byStatus(status).slice().sort((a, b) => new Date(a.order_time).getTime() - new Date(b.order_time).getTime());
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
              orders.map((order) => {
                const nextAction = getNextAction(order);
                return (
                  <OrderCard
                    key={order.id}
                    order={order}
                    statusView={getStatusView(order.order_status)}
                    elapsed={formatElapsed(order)}
                    nextAction={
                      nextAction && nextAction.text ? nextAction : undefined
                    }
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
    },
    [
      byStatus,
      expanded,
      formatElapsed,
      getNextAction,
      getStatusView,
      toggleExpand,
      updateStatus,
    ]
  );

  const handleDateRangeChange: RangePickerProps["onChange"] = (dates) => {
    if (dates) {
      setDateRange([dates[0]!, dates[1]!]);
    } else {
      setDateRange(null);
    }
  };
  const allTabOrders = byStatus("WAITING")
    .concat(byStatus("ACCEPTED"))
    .concat(byStatus("READY"))
    .concat(byStatus("COMPLETED"))
    .concat(byStatus("CANCELED")); // เพิ่ม CANCELED

  const statusOrder = {
    WAITING: 1,
    ACCEPTED: 2,
    READY: 3,
    COMPLETED: 4,
    CANCELED: 5,
  } as const;

  const allTabFiltered = allTabOrders
    .filter(order => order.order_status !== "CANCELED") // ไม่กรอง WAITING แล้ว
    .sort((a, b) => {
      // เรียงตามลำดับสถานะก่อน
      const aStatus = statusOrder[a.order_status as keyof typeof statusOrder] ?? 99;
      const bStatus = statusOrder[b.order_status as keyof typeof statusOrder] ?? 99;
      if (aStatus !== bStatus) {
        return aStatus - bStatus;
      }
      // ภายในสถานะเดียวกัน เรียง order เก่าขึ้นก่อน
      return new Date(a.order_time).getTime() - new Date(b.order_time).getTime();
    });

  const allOrdersTab = {
    key: "all",
    label: (
      <span className="flex items-center gap-2">
        ทั้งหมด
        <Badge count={allTabFiltered.length} />
      </span>
    ),
    children: (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {allTabFiltered.length === 0 ? (
          <Empty
            description="ไม่มีรายการที่ต้องดำเนินการ"
            className="col-span-full"
          />
        ) : (
          allTabFiltered.map((order) => {
            const nextAction = getNextAction(order);
            return (
              <OrderCard
                key={order.id}
                order={order}
                statusView={getStatusView(order.order_status)}
                elapsed={formatElapsed(order)}
                nextAction={
                  nextAction && nextAction.text ? nextAction : undefined
                }
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

  const statusTabs = TABBED_STATUSES.map((status) => {
    let emptyMessage;
    switch (status) {
      case "WAITING":
        emptyMessage = "ไม่มีรายการที่รอดำเนินการ";
        break;
      case "ACCEPTED":
        emptyMessage = "ไม่มีรายการที่กำลังดำเนินการ";
        break;
      case "READY":
        emptyMessage = "ไม่มีรายการที่ดำเนินการเสร็จ";
        break;
      case "COMPLETED":
        emptyMessage = "ไม่มีรายการที่ส่งมอบแล้ว";
        break;
      case "CANCELED":
        emptyMessage = "ไม่มีรายการที่ถูกยกเลิก";
        break;
      default:
        emptyMessage = "ไม่มีรายการ";
    }
    return createTabItem(
      status,
      ORDER_STATUS_CONFIG[status].labelTh,
      emptyMessage
    );
  });

  return (
    <Layout>
      <Header />{" "}
      <Content className="container mx-auto px-4 py-8">
        {" "}
        {/* Content Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              {" "}
              <Title level={4} className="!mb-1">
                การจัดการงานเครื่องดื่ม
              </Title>
              <Text className="text-gray-600">
                จัดการคิวและติดตามสถานะการดำเนินการเครื่องดื่ม
              </Text>
            </div>{" "}
            <CurrentTime />
          </div>
        </div>
        {/* Statistics Cards */}
        {/* <BaristaStatistics byStatus={byStatus} /> */}
        {/* Filters Card */}
        <Card className="mb-5 shadow-sm">
          <Row gutter={12} align="middle">
            <Col xs={24} md={10} lg={8}>
              <Search
                placeholder="ค้นหาจากชื่อลูกค้าหรือเลขออเดอร์"
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
                // เลือกได้ไม่เกินวันที่ปัจจุบัน
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
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
              onChange={(key) => setActiveTab(key as OrderStatus)}
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
