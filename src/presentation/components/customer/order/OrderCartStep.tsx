import React from "react";
import { Typography, Row, Col, Button, InputNumber, Tag, Badge, Divider, Popconfirm } from "antd";
import {
  CoffeeOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  EditOutlined
} from "@ant-design/icons";
import { CartItem } from "@/types";
import { formatCurrencyTH } from '@/shared/utils/utils';
import { useOrderCartLogic } from '@/presentation/hooks/legacy/useCustomerOrderCart';

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
  const { totalAmount, totalItems } = useOrderCartLogic(cart);

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
              {/* <ShoppingCartOutlined className="text-4xl text-blue-500 mr-4" /> */}
              ตะกร้าสินค้าของคุณ
            </Title>
            <Paragraph className="text-gray-600 text-base mb-0">
              ตรวจสอบรายการก่อนสั่งซื้อ
              หากต้องการแก้ไขสามารถปรับจำนวนหรือลบรายการได้ทันที
            </Paragraph>
          </div>
        </div>
        <Badge count={totalItems} className="cart-badge">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <ShoppingCartOutlined className="text-2xl text-blue-600" />
          </div>
        </Badge>
      </div>{" "}
      {/* Cart Items Section */}
      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div
            key={item.id}
            className=" hover:bg-gray-50 transition-colors duration-150  mb-4 pr-16"
          >
            <Row align="middle" gutter={24} className="justify-between">
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
                      aria-label={`ลดจำนวน ${item.menu_item.name}`}
                      onClick={() =>
                        onQuantityUpdate(
                          item.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      disabled={item.quantity <= 1}
                      className="border-gray-300"
                    />
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      aria-label={`จำนวน ${item.menu_item.name}`}
                      onChange={(value) =>
                        onQuantityUpdate(item.id, value || 1)
                      }
                      size="small"
                      style={{ width: 50, textAlign: "center" }}
                      className="text-center"
                    />
                    <Button
                      icon={<PlusOutlined />}
                      size="small"
                      aria-label={`เพิ่มจำนวน ${item.menu_item.name}`}
                      onClick={() =>
                        onQuantityUpdate(item.id, item.quantity + 1)
                      }
                      className="border-gray-300"
                    />
                  </div>
                  <Text className="text-gray-500 text-xs">
                    ฿{formatCurrencyTH(item.total_price / item.quantity)}/ชิ้น
                  </Text>
                </div>
              </Col>

              {/* Price */}
              <Col span={3}>
                <div className="text-right">
                  <Text strong className="text-xl text-green-700">
                    ฿{formatCurrencyTH(item.total_price)}
                  </Text>
                </div>
              </Col>


              {/* Edit and Remove Buttons */}
                <Col span={1}>
                <div className="flex flex-row gap-3">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    style={{ color: "#d97706" }}
                    className="hover:bg-yellow-100"
                    size="large"
                    title="แก้ไขรายการ"
                    aria-label={`แก้ไข ${item.menu_item.name}`}
                  />
                  <Popconfirm
                    title="ยืนยันการลบรายการ?"
                    okText="ลบ"
                    cancelText="ยกเลิก"
                    onConfirm={() => onRemoveItem(item.id)}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      style={{ color: "#dc2626" }}
                      className="hover:bg-red-100"
                      size="large"
                      title="ลบรายการ"
                      aria-label={`ลบ ${item.menu_item.name}`}
                    />
                  </Popconfirm>
                </div>
                </Col>
            </Row>
          </div>
        ))}
      </div>
      {/* Summary Section */}
      <Divider className="mb-2" />

      {/* <Card className="bg-gradient-to-r from-green-50 to-emerald-100 border-0 shadow-xl mt-6">
    
      </Card> */}
      
      <div
      // className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} className="mb-0 text-gray-800">
              สรุปรายการสั่งซื้อ
            </Title>
          </Col>
          <Col>
            <Text className="text-gray-600">
              จำนวนรายการ: {totalItems} ชิ้น
            </Text>
          </Col>
        </Row>
        <Row justify="space-between" align="middle" className="mt-4">
          <Col>
            <Text className="text-gray-500">ยอดรวมทั้งหมด</Text>
          </Col>
          <Col>
            <Text strong className="text-xl text-green-700">
              ฿{formatCurrencyTH(totalAmount)}
            </Text>
          </Col>
        </Row>

        {/* Checkout Button */}
        <div className="mt-6 text-right">

            <div className="inline-block border border-gray-300 rounded-lg mr-4 bg-gray-50">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              size="large"
              onClick={onBackToMenu}
              className="text-gray-600 hover:text-gray-800 rounded-lg"
            >
              กลับไปเลือกเมนู
            </Button>
            </div>
  
  
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={onCheckout}
            className="h-12 px-8"
          >
            ดำเนินการชำระเงิน
          </Button>
        </div>

      </div>
    </div>
  );
};

export default OrderCartStep;
