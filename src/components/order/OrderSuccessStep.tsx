import React, { useEffect, useState } from "react";
import { Typography, Card, Button, Space, Progress } from "antd";
import { QrcodeOutlined, CoffeeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface OrderSuccessStepProps {
  orderStatus: number;
  onResetOrder: () => void;
  onBackToHome: () => void;
  orderDetails: {
    orderId: string;
    items: {
      id: number;
      name: string;
      quantity: number;
      price: number;
      toppings?: string[];
    }[];
    totalAmount: number;
  };
}

const ORDER_STATUS_TIMING = {
  PREPARING: { status: 1, time: 5000 }, // 5 seconds
  BREWING: { status: 2, time: 8000 },   // 8 seconds
  READY: { status: 3, time: 0 }         // Final state
};

const OrderSuccessStep: React.FC<OrderSuccessStepProps> = ({
  orderStatus: initialStatus,
  onResetOrder,
  onBackToHome,
  orderDetails,
}) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let statusTimeout: NodeJS.Timeout;

    const simulateProgress = (duration: number) => {
      const startTime = Date.now();
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
        }
      }, 100);
    };

    if (currentStatus === ORDER_STATUS_TIMING.PREPARING.status) {
      simulateProgress(ORDER_STATUS_TIMING.PREPARING.time);
      statusTimeout = setTimeout(() => {
        setCurrentStatus(ORDER_STATUS_TIMING.BREWING.status);
      }, ORDER_STATUS_TIMING.PREPARING.time);
    } else if (currentStatus === ORDER_STATUS_TIMING.BREWING.status) {
      setProgress(0);
      simulateProgress(ORDER_STATUS_TIMING.BREWING.time);
      statusTimeout = setTimeout(() => {
        setCurrentStatus(ORDER_STATUS_TIMING.READY.status);
      }, ORDER_STATUS_TIMING.BREWING.time);
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(statusTimeout);
    };
  }, [currentStatus]);

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CoffeeOutlined className="text-4xl text-white" />
          </div>
          <Title level={2} className="text-green-600 !mb-2">
            สั่งซื้อสำเร็จ!
          </Title>
          <Text className="text-gray-600">
            เลขที่ออเดอร์: <Text strong className="text-blue-600">{orderDetails.orderId}</Text>
          </Text>
        </div>

        {/* Main Card */}
        <Card className="shadow-sm">
          {/* Status Section */}
          <div className="mb-8">
            <div
              className={`p-5 rounded-lg border ${
                currentStatus === 1
                  ? "bg-blue-50 border-blue-300"
                  : currentStatus === 2
                  ? "bg-orange-50 border-orange-300"
                  : "bg-green-50 border-green-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    currentStatus === 1
                      ? "bg-blue-100"
                      : currentStatus === 2
                      ? "bg-orange-100"
                      : "bg-green-100"
                  }`}
                >
                  <CoffeeOutlined
                    className={`text-2xl ${
                      currentStatus === 1
                        ? "text-blue-600"
                        : currentStatus === 2
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <Text strong className={`text-lg block mb-1 ${
                    currentStatus === 1
                      ? "text-blue-700"
                      : currentStatus === 2
                      ? "text-orange-700"
                      : "text-green-700"
                  }`}>
                    {currentStatus === 1
                      ? "กำลังเตรียมเครื่องดื่ม"
                      : currentStatus === 2
                      ? "กำลังชงเครื่องดื่ม"
                      : "พร้อมรับที่เคาน์เตอร์"}
                  </Text>
                  {currentStatus !== 3 && (
                    <Progress 
                      percent={Math.round(progress)} 
                      status={progress >= 100 ? "success" : "active"}
                      strokeColor={currentStatus === 1 ? "#3B82F6" : "#F97316"}
                      className="mb-1"
                    />
                  )}
                  <Text className="text-gray-600 text-sm">
                    {currentStatus === 3 
                      ? "พร้อมรับได้ทันที"
                      : currentStatus === 2 
                      ? "เวลารอโดยประมาณ 2-3 นาที"
                      : "เวลารอโดยประมาณ 5-7 นาที"}
                  </Text>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="mb-8">
            <Title level={5} className="mb-3">รายละเอียดการสั่งซื้อ</Title>
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <Text strong>{item.name}</Text>
                    <div className="text-gray-500 text-sm">
                      จำนวน: {item.quantity}
                    </div>
                    {item.toppings && item.toppings.length > 0 && (
                      <div className="text-gray-500 text-sm">
                        ท็อปปิ้ง: {item.toppings.join(", ")}
                      </div>
                    )}
                  </div>
                  <Text>฿{item.price.toFixed(2)}</Text>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <Text strong className="text-lg">ยอดรวมทั้งสิ้น</Text>
                <Text strong className="text-lg text-blue-600">
                  ฿{orderDetails.totalAmount.toFixed(2)}
                </Text>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="border-t border-gray-100 pt-6 text-center">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 -mx-6 mb-6">
              <div className="w-40 h-40 bg-white mx-auto border border-gray-200 flex items-center justify-center rounded-lg shadow-sm">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    JSON.stringify({
                      orderId: orderDetails.orderId,
                      totalItems: orderDetails.items.reduce((sum, item) => sum + item.quantity, 0),
                      totalAmount: orderDetails.totalAmount
                    })
                  )}`} 
                  alt="Order QR Code"
                  className="w-32 h-32"
                />
              </div>
            </div>

            <Text className="block mb-4 text-gray-600">
              กรุณาแสดง QR Code นี้ที่เคาน์เตอร์เพื่อรับเครื่องดื่ม
            </Text>

            <Space size="middle">
              <Button
                type="primary"
                icon={<QrcodeOutlined />}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                    JSON.stringify({
                      orderId: orderDetails.orderId,
                      totalItems: orderDetails.items.reduce((sum, item) => sum + item.quantity, 0),
                      totalAmount: orderDetails.totalAmount
                    })
                  )}`;
                  link.download = `order-${orderDetails.orderId}.png`;
                  link.click();
                }}
              >
                ดาวน์โหลด QR Code
              </Button>
              {navigator.share && (
                <Button
                  icon={<QrcodeOutlined />}
                  onClick={() => {
                    navigator.share({
                      title: 'GOGO CAFE - Order QR Code',
                      text: `เลขที่ออเดอร์: ${orderDetails.orderId}\nยอดรวม: ฿${orderDetails.totalAmount.toFixed(2)}`,
                      url: window.location.href
                    });
                  }}
                >
                  แชร์ QR Code
                </Button>
              )}
            </Space>
          </div>
        </Card>

        {/* Bottom Actions */}
        <div className="text-center mt-6">
          <Space size="middle">
            <Button type="primary" onClick={onResetOrder}>
              สั่งซื้อใหม่
            </Button>
            <Button onClick={onBackToHome}>
              กลับหน้าหลัก
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessStep;
