import React from "react";
import { Typography, Card, Button, Space, Progress, QRCode, notification} from "antd";
import { 
  QrcodeOutlined, 
  CheckCircleOutlined, 
  DownloadOutlined,
  ShareAltOutlined,
  HomeOutlined,
  PlusOutlined,
  CoffeeOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { OrderStatus } from "@/types";
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
  READY: "พร้อมรับได้ทันที กรุณานำ QR Code ไปรับเครื่องดื่มที่เคาน์เตอร์",
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
    <div className="min-h-screen">
      {contextHolder}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Title level={2} className="mb-2 text-gray-800">
                <CheckCircleOutlined className="mr-2 text-[var(--gogo-primary)]" />
                สั่งซื้อสำเร็จ!
              </Title>
              <Text className="text-gray-600">
                เลขที่ออเดอร์: <Text strong className="text-blue-600">{orderDetails.orderId}</Text>
              </Text>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-white">
              <CheckCircleOutlined className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        {/* Main Content - Single Card */}
        <Card className="shadow-lg">
          {/* Order Status */}
          {renderableStatuses.includes(currentStatus as RenderableStatus) && (
            <div className="mb-6">
              <div className={`p-4 rounded-lg border ${statusColorMap[currentStatus as RenderableStatus].bg} ${statusColorMap[currentStatus as RenderableStatus].border}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusColorMap[currentStatus as RenderableStatus].iconBg}`}>
                    <CoffeeOutlined className={`text-xl ${statusColorMap[currentStatus as RenderableStatus].icon}`} />
                  </div>
                  <div className="flex-1">
                    <Title level={4} className={`mb-1 ${statusColorMap[currentStatus as RenderableStatus].text}`}>
                      {statusTextMap[currentStatus as RenderableStatus]}
                    </Title>
                    <Text className="text-sm text-gray-600">
                      {statusWaitTextMap[currentStatus as RenderableStatus]}
                    </Text>
                  </div>
                </div>
                
                {currentStatus === "ACCEPTED" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>ความคืบหน้า</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress
                      percent={Math.round(progress)}
                      status={progress >= 100 ? "success" : "active"}
                      strokeColor={statusColorMap[currentStatus as RenderableStatus].progress}
                      showInfo={false}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QR Code */}
          <div className="mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <QrcodeOutlined className="text-xl text-blue-500 mr-2" />
                <Title level={4} className="mb-0">QR Code สำหรับรับเครื่องดื่ม</Title>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="w-40 h-40 bg-white mx-auto border border-gray-200 flex items-center justify-center rounded-lg shadow">
                  <QRCode
                    value={JSON.stringify({
                      orderId: orderDetails.orderId,
                      totalItems: orderDetails.items.reduce((sum, item) => sum + item.quantity, 0),
                      totalAmount: orderDetails.totalAmount
                    })}
                    size={120}
                    bordered={false}
                    bgColor="#fff"
                  />
                </div>
              </div>
              
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    const canvas = document.querySelector('.ant-qrcode canvas') as HTMLCanvasElement;
                    if (canvas) {
                      const link = document.createElement('a');
                      link.href = canvas.toDataURL('image/png');
                      link.download = `order-${orderDetails.orderId}.png`;
                      link.click();
                    }
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0"
                >
                  ดาวน์โหลด QR
                </Button>
                {navigator.share && (
                  <Button
                    icon={<ShareAltOutlined />}
                    onClick={() => {
                      navigator.share({
                        title: 'GOGO CAFE - Order QR Code',
                        text: `เลขที่ออเดอร์: ${orderDetails.orderId}\nยอดรวม: ฿${formatCurrencyTH(orderDetails.totalAmount)}`,
                        url: window.location.href
                      });
                    }}
                  >
                    แชร์ QR
                  </Button>
                )}
              </Space>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <TrophyOutlined className="text-xl text-purple-500 mr-2" />
              <Title level={4} className="mb-0">สรุปออเดอร์</Title>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <Text className="text-gray-600">เวลาสั่งซื้อ:</Text>
                <Text strong>{displayOrderTime}</Text>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <Text className="text-gray-600">จำนวนรายการ:</Text>
                <Text strong>{orderDetails.items.reduce((sum, item) => sum + item.quantity, 0)} ชิ้น</Text>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
                <Text className="text-gray-600">ยอดรวม:</Text>
                <Text strong className="text-xl text-green-600">
                  ฿{formatCurrencyTH(orderDetails.totalAmount)}
                </Text>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="default"
              icon={<HomeOutlined />}
              size="large"
              onClick={onBackToHome}
              className="h-12 px-8 text-lg"
            >
              กลับหน้าหลัก
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={onResetOrder}
              className="h-12 px-8 text-lg bg-gradient-to-r from-green-500 to-emerald-600 border-0"
            >
              สั่งซื้อใหม่
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderSuccessStep;
