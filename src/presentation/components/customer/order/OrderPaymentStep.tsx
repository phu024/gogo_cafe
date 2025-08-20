import React, { useState } from "react";
import { Typography, Card, Button, Spin } from "antd";
import {
  CreditCardOutlined,
  QrcodeOutlined,
  ArrowLeftOutlined,
  DollarOutlined,
  StarOutlined,
  MobileOutlined,
  LoadingOutlined,
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
  const [loadingMethod, setLoadingMethod] = useState<string | null>(null);

  const handlePaymentMethodClick = async (methodKey: string) => {
    setLoadingMethod(methodKey);
    
    // Simulate loading for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoadingMethod(null);
    onPayment();
  };

  const paymentMethods = [
    {
      key: "credit",
      icon: <CreditCardOutlined className="text-2xl" />,
      label: "บัตรเครดิต/เดบิต",
      description: "ชำระผ่านบัตร Visa, Mastercard, JCB",
      onClick: () => handlePaymentMethodClick("credit"),
    },
    {
      key: "qr",
      icon: <QrcodeOutlined className="text-2xl" />,
      label: "โอนเงินผ่าน QR Code",
      description: "สแกน QR Code เพื่อโอนเงินผ่านธนาคาร",
      onClick: () => handlePaymentMethodClick("qr"),
    },
    {
      key: "bankapp",
      icon: <MobileOutlined className="text-2xl" />,
      label: "ชำระผ่าน App ธนาคาร",
      description: "โอนเงินผ่าน Mobile Banking App",
      onClick: () => handlePaymentMethodClick("bankapp"),
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
                {/* <CreditCardOutlined className="mr-2 text-[var(--gogo-primary)]" /> */}
                ยืนยันการสั่งซื้อ
              </Title>
              <Text className="text-gray-600">
                กรุณาตรวจสอบรายการและเลือกวิธีชำระเงิน
              </Text>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-white">
              <CreditCardOutlined className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        {/* Main Content - Single Card */}
        <Card className="shadow-lg">
                      {/* Order Summary */}
            <div className="mb-6">
              <div className="mb-4">
                <Title level={4} className="mb-1">สรุปการสั่งซื้อ</Title>
                <Text className="text-gray-600">{totalItems} รายการ</Text>
              </div>

              {/* Order Items - Compact */}
              <div className="space-y-2 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start p-2 text-sm">
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

                      </div>
                    </div>
                    <Text strong className="text-green-600 ml-2">
                      ฿{formatCurrencyTH(item.total_price)}
                    </Text>
                  </div>
                ))}
                          </div>
          </div>

          {/* Total Amount */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <Text className="text-lg font-medium">ยอดรวมทั้งหมด</Text>
              <Text className="text-3xl font-bold text-blue-600">
                ฿{formatCurrencyTH(totalAmount)}
              </Text>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              {/* <CreditCardOutlined className="text-xl text-[var(--gogo-primary)] mr-2" /> */}
              <Title level={4} className="mb-0">วิธีชำระเงิน</Title>
            </div>

            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const isLoading = loadingMethod === method.key;
                const isDisabled = loadingMethod !== null && !isLoading;
                
                return (
                  <div
                    key={method.key}
                    className={`border border-gray-200 rounded-lg p-4 transition-all duration-300 cursor-pointer ${
                      isLoading 
                        ? 'border-blue-400 bg-blue-50 shadow-md' 
                        : isDisabled 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:border-blue-400 hover:shadow-md'
                    }`}
                    onClick={isDisabled ? undefined : method.onClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                        {isLoading ? (
                          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        ) : (
                          method.icon
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Text strong className="block">{method.label}</Text>
                          {isLoading && (
                            <Text className="text-blue-600 text-sm">กำลังประมวลผล...</Text>
                          )}
                        </div>
                        <Text className="text-sm text-gray-600">{method.description}</Text>
                      </div>
                    </div>
                  </div>
                );
              })}
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
      
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderPaymentStep;
