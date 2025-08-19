import React from "react";
import StatisticsCard from "./StatisticsCard";
import { CoffeeOutlined } from "@ant-design/icons";
import type { OrderStatus } from "@/types";
import { useBaristaStatisticsLogic } from '@/presentation/hooks/legacy/useBaristaStatistics';

interface BaristaStatisticsProps {
  byStatus: (status: OrderStatus) => unknown[];
}

const BaristaStatistics: React.FC<BaristaStatisticsProps> = ({ byStatus }) => {
  const stats = useBaristaStatisticsLogic(byStatus);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      <StatisticsCard
        title="รอดำเนินการ"
        count={stats.waiting}
        icon={<CoffeeOutlined className="text-xl text-orange-500" />}
        color="bg-orange-100"
      />
      <StatisticsCard
        title="กำลังดำเนินการ"
        count={stats.inProgress}
        icon={<CoffeeOutlined className="text-xl text-blue-500" />}
        color="bg-blue-100"
      />
      <StatisticsCard
        title="ดำเนินการเสร็จ (พร้อมรับ)"
        count={stats.ready}
        icon={<CoffeeOutlined className="text-xl text-green-500" />}
        color="bg-green-100"
      />
      <StatisticsCard
        title="ส่งมอบแล้ว"
        count={stats.completed}
        icon={<CoffeeOutlined className="text-xl text-purple-500" />}
        color="bg-purple-100"
      />
    </div>
  );
};

export default BaristaStatistics;
