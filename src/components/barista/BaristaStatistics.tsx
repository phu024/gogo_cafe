import React from "react";
import { Row, Col } from "antd";
import StatisticsCard from "@/components/barista/StatisticsCard";
import { CoffeeOutlined } from "@ant-design/icons";
import type { OrderStatus } from "@/types";

interface BaristaStatisticsProps {
  byStatus: (status: OrderStatus) => unknown[];
}

const BaristaStatistics: React.FC<BaristaStatisticsProps> = ({ byStatus }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
    <StatisticsCard
      title="รอดำเนินการ"
      count={byStatus("WAITING").length}
      icon={<CoffeeOutlined className="text-xl text-orange-500" />}
      color="bg-orange-100"
    />
    <StatisticsCard
      title="กำลังดำเนินการ"
      count={byStatus("IN_PROGRESS").length}
      icon={<CoffeeOutlined className="text-xl text-blue-500" />}
      color="bg-blue-100"
    />
    <StatisticsCard
      title="ดำเนินการเสร็จ (พร้อมรับ)"
      count={byStatus("READY").length}
      icon={<CoffeeOutlined className="text-xl text-green-500" />}
      color="bg-green-100"
    />
    <StatisticsCard
      title="ส่งมอบแล้ว"
      count={byStatus("COMPLETED").length}
      icon={<CoffeeOutlined className="text-xl text-purple-500" />}
      color="bg-purple-100"
    />
  </div>
);

export default BaristaStatistics;
