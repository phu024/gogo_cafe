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
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-8 mb-8 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            
            <Title level={2} className="mb-1 text-gray-900">
              <ShoppingCartOutlined className="text-4xl text-blue-500 mr-4" />
              ตะกร้าสินค้าของคุณ
            </Title>
            <Paragraph className="text-gray-600 text-base mb-0">
              ตรวจสอบรายการก่อนสั่งซื้อ หากต้องการแก้ไขสามารถปรับจำนวนหรือลบรายการได้ทันที
            </Paragraph>
          </div>
        </div>
        <Badge count={getTotalItems()} className="cart-badge">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <ShoppingCartOutlined className="text-2xl text-blue-600" />
          </div>
        </Badge>
      </div>

      {/* Cart Items Section */}
      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <Card
            key={item.id}
            className="shadow-md border-0 bg-gradient-to-r from-white to-blue-50 hover:scale-[1.01] transition-transform duration-150"
            style={{ marginBottom: "16px" }}
          >
            <Row align="middle" gutter={24} className="justify-between px-6">
              {/* Item Details */}
              <Col span={12}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CoffeeOutlined className="text-xl text-emerald-500" />
                    <Title level={4} className="mb-0 text-gray-800">
                      {item.menu_item.name}
                    </Title>
                  </div>
                  <Text className="text-gray-500 text-sm">
                    {item.menu_item.description}
                  </Text>
                  {/* Toppings */}
                  {item.toppings.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.toppings.map((topping) => (
                        <Tag
                          key={topping.id}
                          color="blue"
                          className="rounded-full px-3 py-1 text-sm"
                        >
                          ✨ {topping.name}
                        </Tag>
                      ))}
                    </div>
                  )}
                  {/* Notes */}
                  {item.notes && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded-r-lg mt-1">
                      <Text className="text-yellow-800 text-xs">
                        📝 หมายเหตุ: {item.notes}
                      </Text>
                    </div>
                  )}
                </div>
              </Col>

              {/* Quantity Controls */}
              <Col span={4}>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      icon={<MinusOutlined />}
                      size="small"
                      onClick={() => onQuantityUpdate(item.id, Math.max(1, item.quantity - 1))}
                      className="border-gray-300"
                    />
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => onQuantityUpdate(item.id, value || 1)}
                      size="small"
                      style={{ width: 50, textAlign: "center" }}
                      className="text-center"
                    />
                    <Button
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => onQuantityUpdate(item.id, item.quantity + 1)}
                      className="border-gray-300"
                    />
                  </div>
                  <Text className="text-gray-500 text-xs">
                    ฿{Math.round(item.total_price / item.quantity)}/ชิ้น
                  </Text>
                </div>
              </Col>

              {/* Price */}
              <Col span={3}>
                <div className="text-right">
                  <Text strong className="text-xl text-green-700">
                    ฿{item.total_price.toLocaleString()}
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
                  title="ลบรายการนี้"
                />
              </Col>
            </Row>
          </Card>
        ))}
      </div>

      {/* Summary Section */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-100 border-0 shadow-xl mt-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Title level={3} className="mb-0 text-gray-800">
              ยอดรวมสุทธิ
            </Title>
          </div>
          <Title level={1} className="text-green-600 mb-6">
            ฿{getTotalAmount().toLocaleString()}
          </Title>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            onClick={onBackToMenu}
            size="large"
            className="h-12 px-8 text-lg border-gray-300 bg-white hover:bg-green-50"
            icon={<ArrowLeftOutlined />}
          >
            กลับไปเลือกเมนู
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="h-12 px-8 text-lg bg-gradient-to-r from-emerald-400 to-green-500 border-0"
            icon={<ShoppingCartOutlined />}
          >
            ยืนยันการสั่งซื้อ
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderCartStep;
