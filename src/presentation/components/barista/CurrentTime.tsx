"use client";
import React from 'react';
import { Typography } from 'antd';
import { useCurrentTimeLogic } from '@/presentation/hooks/legacy/useCurrentTime';

const { Text } = Typography;

const CurrentTime: React.FC = () => {
  const { currentDate } = useCurrentTimeLogic();

  return (
    <div className="text-right">
      <Text className="block text-sm text-gray-500">
        {currentDate.toLocaleDateString('th-TH', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </Text>
      <Text className="block text-sm text-gray-500">
        {currentDate.toLocaleTimeString('th-TH')}
      </Text>
    </div>
  );
};

export default CurrentTime;
