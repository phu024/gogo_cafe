import React from 'react';
import { Typography, Card } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { OrderItem } from '../../../domain/entities/Order';
import { Price } from '../../../domain/value-objects/Price';

const { Text } = Typography;

interface OrderSummaryProps {
  items: OrderItem[];
  totalAmount: number;
  totalItems: number;
  title?: string;
  showQuantity?: boolean;
  className?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  totalAmount,
  totalItems,
  title = 'สรุปรายการสั่งซื้อ',
  showQuantity = true,
  className = '',
}) => {
  return (
    <Card
      title={
        <div className="flex items-center">
          <ShoppingCartOutlined className="text-xl mr-2" />
          <span>{title}</span>
        </div>
      }
      className={className}
      style={{
        background: "linear-gradient(to right, #f0f4ff, #e0e7ff)",
      }}
    >
      {/* รายการสินค้า */}
      <div className="mb-6">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-start py-1"
            >
              <div>
                <div className="text-gray-800">{item.menuItem.name}</div>
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
                {item.sugarLevel !== 100 && (
                  <div className="text-gray-500 text-sm ml-4">
                    🍯 ความหวาน: {item.sugarLevel}%
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-gray-800">฿{Price.create(item.totalPrice).format()}</div>
                {showQuantity && (
                  <div className="text-gray-500 text-sm">
                    x{item.quantity}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* สรุปยอดรวม */}
      <div className="pt-4 border-t-2 border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <Text className="text-gray-600">จำนวนรวม</Text>
            <div className="text-2xl font-bold text-blue-600">
              {totalItems} ชิ้น
            </div>
          </div>
          <div className="text-right">
            <Text className="text-gray-600">ยอดรวม</Text>
            <div className="text-3xl font-bold text-green-600">
              ฿{Price.create(totalAmount).format()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
