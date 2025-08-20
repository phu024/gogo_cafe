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
  notification,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { RangePickerProps } from "antd/es/date-picker";
import Header from "@/presentation/components/shared/header";
import { sampleOrders } from "@/shared/utils/mock-data";
import OrderCard from "@/presentation/components/barista/OrderCard";
import { useBaristaOrders } from "@/presentation/hooks/legacy/useBaristaOrders";
import { ORDER_STATUS_CONFIG } from "@/shared/constants/orderStatus";
import type { OrderStatus } from "@/types";
import CurrentTime from "@/presentation/components/barista/CurrentTime";
import dayjs from "dayjs";

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
  const [api, contextHolder] = notification.useNotification();
  const [lastOrderCount, setLastOrderCount] = React.useState(0);
  
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
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
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
      updateStatus,
      toggleExpand,
    ]
  );

  React.useEffect(() => {
    const waitingOrders = byStatus("WAITING");
    const currentOrderCount = waitingOrders.length;
    if (currentOrderCount > lastOrderCount && lastOrderCount > 0) {
      const newOrders = currentOrderCount - lastOrderCount;
      api.info({
        message: `มีออเดอร์ใหม่ ${newOrders} รายการ`,
        description: "กรุณาตรวจสอบออเดอร์ที่รอดำเนินการ",
        duration: 5,
        placement: 'topRight',
      });
      
    }
    setLastOrderCount(currentOrderCount);
  }, [byStatus, lastOrderCount, api]);

  const handleDateRangeChange: RangePickerProps["onChange"] = (dates) => {
    if (dates) {
      setDateRange([dates[0]!, dates[1]!]);
    } else {
      setDateRange(null);
    }
  };

  // จัดกลุ่มและเรียงลำดับออเดอร์สำหรับ tab "ทั้งหมด"
  const allTabOrders = byStatus("WAITING")
    .concat(byStatus("ACCEPTED"))
    .concat(byStatus("READY"))
    .concat(byStatus("COMPLETED"))
    .concat(byStatus("CANCELED"));

  const statusOrder = {
    WAITING: 1,
    ACCEPTED: 2,
    READY: 3,
    COMPLETED: 4,
    CANCELED: 5,
  } as const;

  // เรียงลำดับ: กลุ่มตามสถานะ -> เวลาออเดอร์ (เก่าก่อน)
  const allTabFiltered = allTabOrders
    .filter(order => order.order_status !== "CANCELED")
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
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
           {allTabFiltered.length === 0 ? (
             <Empty description="ไม่มีรายการออเดอร์" className="col-span-full" />
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
        emptyMessage = "ไม่มีรายการที่กำลังเตรียมเครื่องดื่ม";
        break;
      case "READY":
        emptyMessage = "ไม่มีรายการที่พร้อมเสิร์ฟ";
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
      <Header />
      {contextHolder}
      <Content className="container mx-auto px-4 py-8">
        {" "}
        {/* Content Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              {" "}
              <Title level={4} className="!mb-1">
                จัดการออเดอร์เครื่องดื่ม
              </Title>
              <Text className="text-gray-600">
                จัดการคิวและติดตามสถานะการเตรียมเครื่องดื่ม
              </Text>
            </div>{" "}
            <CurrentTime />
          </div>
        </div>

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
                 className="mr-2"
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
