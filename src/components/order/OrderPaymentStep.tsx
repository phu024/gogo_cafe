import React from "react";
import { Typography, Card, Button } from "antd";
import {
  ShoppingCartOutlined,
  CreditCardOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { CartItem } from "@/types";

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
  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.total_price, 0);
  };

  const paymentMethods = [
    {
      key: "credit",
      icon: <CreditCardOutlined className="text-2xl text-blue-600" />,
      border: "hover:border-blue-400",
      label: "บัตรเครดิต/เดบิต",
      description: "ชำระผ่านบัตร Visa, Mastercard, JCB",
      onClick: onPayment,
    },
    {
      key: "qr",
      icon: <QrcodeOutlined className="text-2xl text-green-600" />,
      border: "hover:border-green-400",
      label: "โอนเงินผ่าน QR Code",
      description: "สแกน QR Code เพื่อโอนเงินผ่านธนาคาร",
      onClick: onPayment,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <Title level={2} className="mb-2">
          ชำระเงิน
        </Title>
        <Typography.Paragraph className="text-gray-600 text-lg">
          เลือกวิธีชำระเงินที่สะดวกสำหรับคุณ
        </Typography.Paragraph>
      </div>

      {/* รายละเอียดการสั่งซื้อ */}

      <div>
        <div className="mb-8">
          <Card
            title={
              <div className="flex items-center">
                <ShoppingCartOutlined className="text-xl mr-2" />
                <span>สรุปรายการสั่งซื้อ</span>
              </div>
            }
            className=""
            style={{
              background: "linear-gradient(to right, #f0f4ff, #e0e7ff)",
            }}
          >
            {" "}
            {/* รายการสินค้า */}
            <div className="mb-6">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start py-1 "
                  >
                    <div>
                      <div className="text-gray-800">{item.menu_item.name}</div>
                      {item.toppings.length > 0 && (
                        <div className="text-gray-500 text-sm ml-4">
                          + {item.toppings.map((t) => t.name).join(", ")}
                        </div>
                      )}
                      {item.notes && (
                        <div className="text-gray-500 text-sm ml-4 italic">
                          📝 {item.notes}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-gray-800">฿{item.total_price}</div>
                      <div className="text-gray-500 text-sm">
                        x{item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* สรุปยอดรวม */}
            <div className="pt-4 border-t-2 border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <Text className="text-gray-600">จำนวนรายการ</Text>
                  <div className="text-2xl font-bold text-blue-600">
                    {cart.length} รายการ
                  </div>
                </div>
                <div className="text-right">
                  <Text className="text-gray-600">ยอดรวม</Text>
                  <div className="text-3xl font-bold text-green-600">
                    ฿{getTotalAmount().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* วิธีชำระเงิน */}
        <Card
          title={
            <div className="flex items-center">
              <CreditCardOutlined className="text-xl text-green-500 mr-2" />
              <span>เลือกวิธีชำระเงิน</span>
            </div>
          }
          className="mt-0 shadow-sm"
        >
          {" "}
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.key}
                className={`border-2 border-gray-200 rounded-lg p-4 transition-all duration-200 cursor-pointer ${method.border} hover:shadow-md hover:-translate-y-0.5`}
              >
                <Button
                  type="text"
                  className="w-full h-auto p-0 text-left"
                  onClick={method.onClick}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-16 h-16
                         rounded-xl flex items-center justify-center mr-6`}
                    >
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">
                        {method.label}
                      </div>
                      <div className="text-gray-500">{method.description}</div>
                    </div>
                  </div>
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {onBackToCart && (
          <div className="mt-8 text-end">
            <Button
              onClick={onBackToCart}
              icon={<ShoppingCartOutlined />}
              size="large"
              className="border-gray-300 hover:border-blue-400 hover:text-blue-500 h-12 px-6"
            >
              กลับไปแก้ไขรายการในตะกร้า
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPaymentStep;
