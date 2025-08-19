import React from 'react';
import { Typography, Badge } from 'antd';

const { Text } = Typography;

interface StatisticsCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, count, icon, color }) => (
  <div className="flex items-center gap-4 bg-white rounded-lg shadow-sm p-4">
    <Badge count={count} showZero>
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center shadow-lg`}>
        {icon}
      </div>
    </Badge>
    <Text className="block text-gray-500 text-sm">{title}</Text>
  </div>
);

export default StatisticsCard;
