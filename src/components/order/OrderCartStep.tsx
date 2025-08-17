import React from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Button,
  InputNumber,
  Tag,
  Badge,
} from "antd";
import {
  CoffeeOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { CartItem } from "@/types";

const { Title, Text, Paragraph } = Typography;

interface OrderCartStepProps {
  cart: CartItem[];
  onQuantityUpdate: (itemId: number, quantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onCheckout: () => void;
  onBackToMenu: () => void;
}

const OrderCartStep: React.FC<OrderCartStepProps> = ({
  cart,
  onQuantityUpdate,
  onRemoveItem,
  onCheckout,
  onBackToMenu,
}) => {
  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.total_price, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCartOutlined className="text-4xl text-gray-400" />
          </div>
          <Title level={2} className="mb-4 text-gray-600">
            ตะกร้าว่างเปล่า
          </Title>
          <Paragraph className="text-gray-500 mb-8 text-lg">
            ยังไม่มีรายการในตะกร้า
            <br />
            เริ่มต้นเลือกเมนูเครื่องดื่มของคุณ
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<CoffeeOutlined />}
            onClick={onBackToMenu}
            className="h-12 px-8 text-lg"
          >
            เลือกเมนู
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Title level={2} className="mb-2 text-gray-800">
              🛒 ตะกร้าสินค้า
            </Title>
            <Paragraph className="text-gray-600 mb-0 text-lg">
              ตรวจสอบรายการและดำเนินการสั่งซื้อ
            </Paragraph>
          </div>
          <Badge count={getTotalItems()} className="cart-badge">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <ShoppingCartOutlined className="text-2xl text-blue-600" />
            </div>
          </Badge>
        </div>
      </div>

      {/* Cart Items Section */}
      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <Card
            key={item.id}
            className="shadow-sm hover:shadow-md transition-shadow duration-200 border-0 bg-white"
            style={{ marginBottom: "16px" }}
          >
            <Row align="middle" gutter={24} className="justify-between px-10">
              {/* Item Details */}
              <Col span={12}>
                <div className="space-y-3">
                  <div>
                    <Title level={4} className="mb-1 text-gray-800">
                      {item.menu_item.name}
                    </Title>
                    <Text className="text-gray-500">
                      {item.menu_item.description}
                    </Text>
                  </div>

                  {/* Toppings */}
                  {item.toppings.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.toppings.map((topping) => (
                        <div
                          key={topping.id}
                          className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 rounded-full"
                          style={{ display: "inline-block" }}
                        >
                          <Tag style={{ background: "transparent", border: "none", color: "inherit", padding: 0, margin: 0 }}>
                            ✨ {topping.name}
                          </Tag>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                      <Text className="text-yellow-800 text-sm">
                        📝 {item.notes}
                      </Text>
                    </div>
                  )}
                </div>
              </Col>

              {/* Quantity Controls */}
              <Col span={4}>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) =>
                        onQuantityUpdate(item.id, value || 1)
                      }
                      size="small"
                      style={{ width: 60, textAlign: "center" }}
                      className="text-center"
                    />
                  </div>
                  <Text className="text-gray-500 text-sm">
                    ฿{Math.round(item.total_price / item.quantity)}/ชิ้น
                  </Text>
                </div>
              </Col>

              {/* Price */}
              <Col span={3}>
                <div className="text-right">
                  <Text strong className="text-xl">
                    ฿{item.total_price}
                  </Text>
                </div>
              </Col>

              {/* Delete Button */}
              <Col span={1}>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onRemoveItem(item.id)}
                  className="hover:bg-red-50"
                  size="large"
                />
              </Col>
            </Row>
          </Card>
        ))}
      </div>

      {/* Summary Section */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 ">

            <div>
              <Title level={2} className="mb-1 text-gray-800">
                ยอดรวมทั้งหมด
              </Title>
           
            </div>
          </div>

          <Title level={1} className="text-green-600 mb-8">
            ฿{getTotalAmount().toLocaleString()}
          </Title>
        </div>
        <div className="flex justify-end gap-4">
            <Button
              onClick={onBackToMenu}
              size="large"
              className="h-12 px-8 text-lg border-gray-300"
            >
              เลือกเมนูเพิ่ม
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={onCheckout}
              disabled={cart.length === 0}
              className="h-12 px-8 text-lg"
            >
              ดำเนินการสั่งซื้อ
            </Button>
          </div>
      </Card>
    </div>
  );
};

export default OrderCartStep;
