import React from "react";
import { Typography, Card, Button, Space, Progress, QRCode, notification } from "antd";
import { QrcodeOutlined, CoffeeOutlined } from "@ant-design/icons";
import { OrderStatus } from "../../../types";
import { useOrderSuccessLogic } from '@/presentation/hooks/legacy/useCustomerOrderSuccess';
import { formatCurrencyTH } from '@/shared/utils/utils';

const { Title, Text } = Typography;

interface OrderSuccessStepProps {
  orderStatus: OrderStatus;
  onResetOrder: () => void;
  onBackToHome: () => void;
  orderDetails: {
    orderId: string;
    orderTime?: string;
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

// Helper to filter out WAITING from status rendering
const renderableStatuses = ["WAITING", "ACCEPTED", "READY", "COMPLETED", "CANCELED"] as const;
type RenderableStatus = typeof renderableStatuses[number];

const statusColorMap: Record<RenderableStatus, { bg: string; border: string; iconBg: string; icon: string; text: string; progress: string }> = {
  WAITING: { bg: "bg-yellow-50", border: "border-yellow-300", iconBg: "bg-yellow-100", icon: "text-yellow-600", text: "text-yellow-700", progress: "#FACC15" },
  ACCEPTED: { bg: "bg-blue-50", border: "border-blue-300", iconBg: "bg-blue-100", icon: "text-blue-600", text: "text-blue-700", progress: "#3B82F6" },
  READY: { bg: "bg-green-50", border: "border-green-300", iconBg: "bg-green-100", icon: "text-green-600", text: "text-green-700", progress: "#22C55E" },
  COMPLETED: { bg: "bg-green-50", border: "border-green-300", iconBg: "bg-green-100", icon: "text-green-600", text: "text-green-700", progress: "#22C55E" },
  CANCELED: { bg: "bg-red-50", border: "border-red-300", iconBg: "bg-red-100", icon: "text-red-600", text: "text-red-700", progress: "#EF4444" },
};

const statusTextMap: Record<RenderableStatus, string> = {
  WAITING: "รอคิว",
  ACCEPTED: "กำลังเตรียม/ชงเครื่องดื่ม",
  READY: "พร้อมรับที่เคาน์เตอร์",
  COMPLETED: "รับเครื่องดื่มแล้ว",
  CANCELED: "ออเดอร์ถูกยกเลิก",
};

const statusWaitTextMap: Record<RenderableStatus, string> = {
  WAITING: "รอคิวก่อนเริ่มเตรียมเครื่องดื่ม",
  ACCEPTED: "เวลารอโดยประมาณ 5-7 นาที",
  READY: "พร้อมรับได้ทันที",
  COMPLETED: "ขอบคุณที่ใช้บริการ GOGO CAFE",
  CANCELED: "ออเดอร์ถูกยกเลิก",
};

const OrderSuccessStep: React.FC<OrderSuccessStepProps> = ({
  orderStatus,
  onResetOrder,
  onBackToHome,
  orderDetails,
}) => {
  const { currentStatus, progress } = useOrderSuccessLogic(orderStatus);
  const [api, contextHolder] = notification.useNotification();
  const lastNotifiedStatusRef = React.useRef<string | null>(null);

  const nowTime = React.useMemo(() => new Date().toLocaleString('th-TH'), []);
  const displayOrderTime = orderDetails.orderTime ?? nowTime;

  React.useEffect(() => {
    if (lastNotifiedStatusRef.current !== currentStatus) {
      api.success({
        message: `สถานะออเดอร์: ${statusTextMap[currentStatus as RenderableStatus]}`,
        description: `${statusWaitTextMap[currentStatus as RenderableStatus]}`,
        duration: 3,
      });
      lastNotifiedStatusRef.current = currentStatus;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStatus]);

  return (
    <div className="py-8">
      {contextHolder}
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CoffeeOutlined className="text-4xl text-white" />
          </div>
          <Title level={2} className="text-green-600 !mb-2">
            สั่งซื้อสำเร็จ!
          </Title>
          {/* <Text className="text-gray-600">
            เลขที่ออเดอร์: <Text strong className="text-blue-600">{orderDetails.orderId}</Text>
          </Text> */}
        </div>

        {/* Main Card */}
        <Card className="shadow-sm">
          {/* Status Section */}
          {renderableStatuses.includes(currentStatus as RenderableStatus) && (
            <div className="mb-8">
              <div
                className={`p-5 rounded-lg border ${statusColorMap[currentStatus as RenderableStatus].bg} ${statusColorMap[currentStatus as RenderableStatus].border}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center ${statusColorMap[currentStatus as RenderableStatus].iconBg}`}
                  >
                    <CoffeeOutlined
                      className={`text-2xl ${statusColorMap[currentStatus as RenderableStatus].icon}`}
                    />
                  </div>
                  <div className="flex-1">
                    <Text strong className={`text-lg block mb-1 ${statusColorMap[currentStatus as RenderableStatus].text}`}>
                      {statusTextMap[currentStatus as RenderableStatus]}
                    </Text>
                    {currentStatus === "ACCEPTED" && (
                      <Progress
                        percent={Math.round(progress)}
                        status={progress >= 100 ? "success" : "active"}
                        strokeColor={statusColorMap[currentStatus as RenderableStatus].progress}
                        className="mb-1"
                      />
                    )}
                    <Text className="text-gray-600 text-sm">
                      {statusWaitTextMap[currentStatus as RenderableStatus]}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="mb-8">
            <Title level={5} className="mb-3">รายละเอียดการสั่งซื้อ</Title>
            <div className="mb-2 flex flex-col gap-1">
              <Text className="text-gray-600">หมายเลขออเดอร์: <Text strong className="text-blue-600">{orderDetails.orderId}</Text></Text>
              <Text className="text-gray-600">เวลาสั่งซื้อ: <Text strong>{displayOrderTime}</Text></Text>
            </div>
            
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start py-2  last:border-0">
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
                  <Text>฿{formatCurrencyTH(item.price)}</Text>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <Text strong className="text-lg">ยอดรวมทั้งสิ้น</Text>
                <Text strong className="text-lg text-blue-600">
                  ฿{formatCurrencyTH(orderDetails.totalAmount)}
                </Text>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="border-t border-gray-100 pt-6 text-center">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 -mx-6 mb-6">
              <div className="w-40 h-40 bg-white mx-auto border border-gray-200 flex items-center justify-center rounded-lg shadow-sm">
                <QRCode
                  value={JSON.stringify({
                    orderId: orderDetails.orderId,
                    totalItems: orderDetails.items.reduce((sum, item) => sum + item.quantity, 0),
                    totalAmount: orderDetails.totalAmount
                  })}
                  size={128}
                  bordered={false}
                  bgColor="#fff"
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
                  const canvas = document.querySelector('.ant-qrcode canvas') as HTMLCanvasElement;
                  if (canvas) {
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = `order-${orderDetails.orderId}.png`;
                    link.click();
                  }
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
                      text: `เลขที่ออเดอร์: ${orderDetails.orderId}\nยอดรวม: ฿${formatCurrencyTH(orderDetails.totalAmount)}`,
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
