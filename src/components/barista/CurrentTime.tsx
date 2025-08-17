"use client";
import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const CurrentTime: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
