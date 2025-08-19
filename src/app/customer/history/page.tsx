"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { Layout, Typography, Card, Empty, Input, DatePicker, Button, Tag, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import Header from '@/presentation/components/shared/header';
import { sampleOrders, users } from '@/shared/utils/mock-data';
import { Order, User } from '@/types';
import { ORDER_STATUS_CONFIG } from '@/shared/constants/orderStatus';

const { Title, Text } = Typography;
const { Content } = Layout;
const { RangePicker } = DatePicker;

const OrderHistoryPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Get current user from cookie and load their orders
  useEffect(() => {
    const getUserFromCookie = () => {
      const match = document.cookie.match(/(?:^|;\s*)userId=([^;]+)/);
      if (match) {
        const id = Number(match[1]);
        return users.find(u => u.id === id) ?? null;
      }
      return null;
    };

    const user = getUserFromCookie();
    setCurrentUser(user);
    
    // Filter orders for current user
    if (user) {
      const userOrders = sampleOrders.filter(order => order.User.id === user.id);
      setOrders(userOrders);
    }
  }, []);

  const handleDateRangeChange: RangePickerProps['onChange'] = (dates) => {
    if (dates) {
      setDateRange([dates[0]!, dates[1]!]);
    } else {
      setDateRange(null);
    }
  };

  const resetFilters = useCallback(() => {
    setSearchText('');
    setDateRange(null);
  }, []);

  const filteredOrders = orders
    .filter(order => {
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        return (
          order.id.toLowerCase().includes(searchLower) ||
          order.items.some(item => 
            item.menu_item.name.toLowerCase().includes(searchLower) ||
            item.toppings.some(topping => 
              topping.name.toLowerCase().includes(searchLower)
            )
          )
        );
      }
      return true;
    })
    .filter(order => {
      if (dateRange) {
        const [start, end] = dateRange;
        const orderDate = dayjs(order.order_time);
        return orderDate.isAfter(start) && orderDate.isBefore(end);
      }
      return true;
    })
    .sort((a, b) => new Date(b.order_time).getTime() - new Date(a.order_time).getTime());

  const getStatusTag = (status: string) => {
    const config = ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG];
    return (
      <Tag
        color={config.color}
        className="rounded-full px-3 py-1"
      >
        {config.labelTh}
      </Tag>
    );
  };

  return (
    <Layout>
      <Header />
      <Content className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <Title level={2}>ประวัติการสั่งซื้อ</Title>
            <Text className="text-gray-600">
              ดูประวัติการสั่งซื้อของคุณทั้งหมด
            </Text>
          </div>

          {/* Filters Section */}
          <Card className="mb-6 shadow-sm">
            <div className="flex flex-wrap gap-4 items-center">
              <Input
                placeholder="ค้นหาด้วยเลขที่ออเดอร์ หรือชื่อเครื่องดื่ม"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                prefix={<SearchOutlined className="text-gray-400" />}
                className="w-64"
              />
              <RangePicker
                onChange={handleDateRangeChange}
                value={dateRange}
                format="DD/MM/YYYY"
                placeholder={['วันเริ่มต้น', 'วันสิ้นสุด']}
                className="w-72"
              />
              <Button
                onClick={resetFilters}
                icon={<ReloadOutlined />}
              >
                รีเซ็ตตัวกรอง
              </Button>
            </div>
          </Card>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Empty description="ไม่พบรายการสั่งซื้อ" />
            ) : (
              filteredOrders.map((order) => (
                <Card 
                  key={order.id}
                  className="shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="space-y-4">
                    {/* Order Header */}
                    <div className="flex items-center justify-between">
                      <Space size="middle">
                        <Text strong className="text-lg">#{order.id}</Text>
                        {getStatusTag(order.order_status)}
                      </Space>
                      <Text className="text-gray-500">
                        {dayjs(order.order_time).format('DD/MM/YYYY HH:mm')}
                      </Text>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-b border-gray-100 py-4">
                      {order.items.map((item, index) => (
                        <div 
                          key={index}
                          className="flex justify-between items-center mb-2 last:mb-0"
                        >
                          <div>
                            <Text>{item.quantity}x {item.menu_item.name}</Text>
                            {item.toppings.length > 0 && (
                              <div className="text-gray-500 text-sm ml-6">
                                + {item.toppings.map(t => t.name).join(', ')}
                              </div>
                            )}
                          </div>
                          <Text strong>฿{item.total_price}</Text>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="flex justify-between items-center">
                      <div>
                        <Text className="text-gray-500">วิธีชำระเงิน: </Text>
                        <Text strong className="ml-2">
                          {order.payment_method === 'CREDIT_CARD' ? 'บัตรเครดิต/เดบิต' :
                           order.payment_method === 'QR_CODE' ? 'QR Code' :
                           order.payment_method === 'CASH' ? 'เงินสด' : '-'}
                        </Text>
                      </div>
                      <div>
                        <Text className="text-gray-500">ยอดรวม: </Text>
                        <Text strong className="text-xl text-green-600 ml-2">
                          ฿{order.total_amount}
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default OrderHistoryPage;
