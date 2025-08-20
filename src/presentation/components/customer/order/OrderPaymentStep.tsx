import React from "react";
import { Typography, Card, Button } from "antd";
import {
  CreditCardOutlined,
  QrcodeOutlined,
  ArrowLeftOutlined,
  SafetyOutlined,
  DollarOutlined,
  StarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { CartItem } from "@/types";
import { useOrderCartLogic } from '@/presentation/hooks/legacy/useCustomerOrderCart';
import { formatCurrencyTH } from '@/shared/utils/utils';

const { Title, Text } = Typography;

interface OrderPaymentStepProps {
  cart: CartItem[];
  onPayment: () => void;
  onBackToCart?: () => void;
}

const OrderPaymentStep: React.FC<OrderPaymentStepProps> = ({
  cart,
  onPayment,
  onBackToCart,
}) => {
  const { totalAmount, totalItems } = useOrderCartLogic(cart);

  const paymentMethods = [
    {
      key: "credit",
      icon: <CreditCardOutlined className="text-2xl text-blue-600" />,
      label: "บัตรเครดิต/เดบิต",
      description: "ชำระผ่านบัตร Visa, Mastercard, JCB",
      onClick: onPayment,
    },
    {
      key: "qr",
      icon: <QrcodeOutlined className="text-2xl text-green-600" />,
      label: "โอนเงินผ่าน QR Code",
      description: "สแกน QR Code เพื่อโอนเงินผ่านธนาคาร",
      onClick: onPayment,
    },
    {
      key: "bankapp",
      icon: <DollarOutlined className="text-2xl text-purple-600" />,
      label: "ชำระผ่าน App ธนาคาร",
      description: "โอนเงินผ่าน Mobile Banking App",
      onClick: onPayment,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Title level={2} className="mb-2 text-gray-800">
                <CreditCardOutlined className="mr-2 text-[var(--gogo-primary)]" />
                ยืนยันการสั่งซื้อ
              </Title>
              <Text className="text-gray-600">
                ตรวจสอบรายการและเลือกวิธีชำระเงินที่ปลอดภัย
              </Text>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-white">
              <DollarOutlined className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        {/* Main Content - Single Card */}
        <Card className="shadow-lg">
          {/* Order Summary */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Title level={4} className="mb-1">สรุปการสั่งซื้อ</Title>
                <Text className="text-gray-600">{totalItems} รายการ</Text>
              </div>
              <div className="text-right">
                <Text className="text-2xl font-bold text-green-600">
                  ฿{formatCurrencyTH(totalAmount)}
                </Text>
              </div>
            </div>

            {/* Order Items - Compact */}
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start p-2 bg-gray-50 rounded text-sm">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Text strong>{item.menu_item.name}</Text>
                      <Text className="text-gray-500">x{item.quantity}</Text>
                    </div>
                    <div className="text-gray-600 mt-1">
                      {item.toppings.length > 0 && (
                        <div><StarOutlined className="mr-1" /> {item.toppings.map((t) => t.name).join(", ")}</div>
                      )}
                      {item.sugar_level !== 100 && (
                        <div>ความหวาน {item.sugar_level}%</div>
                      )}
                      {item.notes && (
                        <div className="text-orange-600"><FileTextOutlined className="mr-1" /> {item.notes}</div>
                      )}
                    </div>
                  </div>
                  <Text strong className="text-green-600 ml-2">
                    ฿{formatCurrencyTH(item.total_price)}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <CreditCardOutlined className="text-xl text-[var(--gogo-primary)] mr-2" />
              <Title level={4} className="mb-0">วิธีชำระเงิน</Title>
            </div>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.key}
                  className="border border-gray-200 rounded-lg p-4 transition-all duration-300 cursor-pointer hover:border-green-400 hover:shadow-md"
                  onClick={method.onClick}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <Text strong className="block">{method.label}</Text>
                      <Text className="text-sm text-gray-600">{method.description}</Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Info - Compact */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <SafetyOutlined className="text-[var(--gogo-primary)]" />
              <span>การชำระเงินผ่านระบบที่ปลอดภัย SSL</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            {onBackToCart && (
              <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                size="large"
                onClick={onBackToCart}
                className="h-12 px-8 text-lg"
              >
                แก้ไขรายการ
              </Button>
            )}
            <Button
              type="primary"
              size="large"
              icon={<DollarOutlined />}
              onClick={onPayment}
              className="h-12 px-8 text-lg bg-gradient-to-r from-green-500 to-emerald-600 border-0"
            >
              ยืนยันการสั่งซื้อ
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderPaymentStep;
