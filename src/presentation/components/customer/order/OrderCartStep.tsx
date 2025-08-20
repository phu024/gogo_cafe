import React, { useState } from "react";
import { Typography, Button, Tag, Badge, Card } from "antd";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  DollarOutlined,
  CalculatorOutlined,
  ShoppingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { CartItem, Topping } from "@/types";
import { formatCurrencyTH } from '@/shared/utils/utils';
import { useOrderCartLogic } from '@/presentation/hooks/legacy/useCustomerOrderCart';
import AddToCartModal from './AddToCartModal';

const { Title, Text } = Typography;

interface OrderCartStepProps {
  cart: CartItem[];
  availableToppings: Topping[];
  onBackToMenu: () => void;
  onCheckout: () => void;
  onRemoveItem: (itemId: string) => void;
  onEditItem: (item: CartItem) => void;
}

const OrderCartStep: React.FC<OrderCartStepProps> = ({
  cart,
  availableToppings,
  onBackToMenu,
  onCheckout,
  onRemoveItem,
  onEditItem,
}) => {
  const { totalAmount, totalItems } = useOrderCartLogic(cart);
  
  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editSugarLevel, setEditSugarLevel] = useState(100);
  const [editNotes, setEditNotes] = useState('');
  const [editToppings, setEditToppings] = useState<Topping[]>([]);

  // Edit handlers
  const handleEditItem = (item: CartItem) => {
    setEditingItem(item);
    setEditQuantity(item.quantity);
    setEditSugarLevel(item.sugar_level || 100);
    setEditNotes(item.notes || '');
    setEditToppings(item.toppings);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      onEditItem({
        ...editingItem,
        quantity: editQuantity,
        sugar_level: editSugarLevel,
        notes: editNotes,
        toppings: editToppings,
      });
    }
    setEditModalVisible(false);
    setEditingItem(null);
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingItem(null);
  };

  // Empty cart component
  const EmptyCart = () => (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Header totalItems={0} />
        <Card className="shadow-lg">
          <div className="text-center py-12">
            <ShoppingCartOutlined className="text-6xl text-gray-300 mb-4" />
            <Title level={3} className="text-gray-500 mb-2">
              ตะกร้าสินค้าว่าง
            </Title>
            <Text className="text-gray-400 mb-6 block">
              ยังไม่มีรายการสินค้าในตะกร้า
            </Text>
            <Button
              type="primary"
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={onBackToMenu}
              className="h-12 px-8 text-lg bg-gradient-to-r from-[var(--gogo-primary)] to-[#e69c00] border-0"
            >
              เลือกเมนูเครื่องดื่ม
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  // Header component
  const Header = ({ totalItems }: { totalItems: number }) => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="mb-2 text-gray-800">
            <ShoppingOutlined className="mr-2 text-[var(--gogo-primary)]" />
            ตะกร้าสินค้า
          </Title>
          <Text className="text-gray-600">
            ตรวจสอบและแก้ไขรายการก่อนดำเนินการสั่งซื้อ
          </Text>
        </div>
        <Badge count={totalItems} className="cart-badge">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-white">
            <ShoppingCartOutlined className="text-2xl text-white" />
          </div>
        </Badge>
      </div>
    </div>
  );

  // Cart item component
  const CartItemComponent = ({ item }: { item: CartItem }) => (
    <div className="border-b border-gray-100 pb-4 last:border-b-0">
      {/* Item Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <Title level={4} className="mb-1 text-gray-800 truncate">
            {item.menu_item.name}
          </Title>
          <Text className="text-gray-600 text-sm">
            {item.menu_item.description}
          </Text>
        </div>
        <div className="text-right ml-4">
          <Title level={4} className="text-[var(--gogo-primary)] mb-0">
            ฿{formatCurrencyTH(item.total_price)}
          </Title>
          <Text className="text-gray-400 text-xs">
            ราคารวม ({item.quantity} ชิ้น)
          </Text>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <Text className="text-gray-600">ราคาเมนู:</Text>
            <Text>฿{formatCurrencyTH(item.menu_item.base_price)}</Text>
          </div>
          {item.toppings.length > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Text className="text-gray-600">ท็อปปิ้ง:</Text>
                <div className="flex flex-wrap gap-1">
                  {item.toppings.map((topping) => (
                    <Tag key={topping.id} className="text-xs">
                      {topping.name} (+฿{formatCurrencyTH(topping.price)})
                    </Tag>
                  ))}
                </div>
              </div>
              <Text>฿{formatCurrencyTH(item.toppings.reduce((sum, t) => sum + t.price, 0))}</Text>
            </div>
          )}
          {item.sugar_level !== 50 && (
            <div className="flex justify-between">
              <Text className="text-gray-600">ความหวาน:</Text>
              <Text>{item.sugar_level}%</Text>
            </div>
          )}
          <div className="flex justify-between border-t pt-1 mt-1">
            <Text className="text-gray-700 font-medium">ราคาต่อชิ้น:</Text>
            <Text strong className="text-blue-600">฿{formatCurrencyTH(item.total_price / item.quantity)}</Text>
          </div>
        </div>
      </div>

      {/* Notes */}
      {item.notes && (
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-blue-500" />
            <Text strong className="text-sm text-gray-700">หมายเหตุ:</Text>
            <Text className="text-sm text-gray-600">{item.notes}</Text>
          </div>
        </div>
      )}

      {/* Item Footer */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Text className="text-gray-600 text-sm">จำนวน:</Text>
            <div className="bg-blue-50 rounded px-2 py-1">
              <Text strong className="text-sm text-blue-600">
                {item.quantity} ชิ้น
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Text className="text-gray-600 text-sm">ราคารวม:</Text>
            <div className="bg-green-50 rounded px-2 py-1">
              <Text strong className="text-sm text-green-600">
                ฿{formatCurrencyTH(item.total_price)}
              </Text>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 border-0"
            size="small"
            title="แก้ไขรายการ"
            onClick={() => handleEditItem(item)}
          >
            แก้ไข
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            className="bg-gradient-to-r from-red-500 to-pink-500 border-0"
            title="ลบรายการ"
            onClick={() => onRemoveItem(item.id.toString())}
          >
            ลบ
          </Button>
        </div>
      </div>
    </div>
  );

  // Summary component
  const Summary = () => (
    <div className="border-t border-gray-200 pt-6">
      <Title level={3} className="mb-4 text-gray-800">
        <CalculatorOutlined className="mr-2 text-blue-500" />
        สรุปการสั่งซื้อ
      </Title>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Text className="text-gray-600 text-sm">จำนวนรายการ</Text>
          <div className="text-2xl font-bold text-blue-600">
            {totalItems} ชิ้น
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Text className="text-gray-600 text-sm">ยอดรวมทั้งหมด</Text>
          <div className="text-right">
            <div className="text-3xl font-bold text-[var(--gogo-primary)]">
              ฿{formatCurrencyTH(totalAmount)}
            </div>
            {/* <Text className="text-gray-400 text-xs">
              รวมภาษีและค่าบริการแล้ว
            </Text> */}
          </div>
        </div>
      </div>
    </div>
  );

  // Action buttons component
  const ActionButtons = () => (
    <div className="flex flex-col sm:flex-row gap-3 justify-end">
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        size="large"
        onClick={onBackToMenu}
        className="h-12 px-8 text-lg"
      >
        เพิ่มเมนู
      </Button>
      <Button
        type="primary"
        size="large"
        icon={<DollarOutlined />}
        onClick={onCheckout}
        className="h-12 px-8 text-lg bg-gradient-to-r from-green-500 to-emerald-600 border-0"
      >
        ดำเนินการชำระเงิน
      </Button>
    </div>
  );

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Header totalItems={totalItems} />

        {/* Cart Items & Summary */}
        <Card className="shadow-lg">
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))}
            </div>

            <Summary />
            <ActionButtons />
          </div>
        </Card>

        {/* Edit Modal */}
        <AddToCartModal
          isVisible={editModalVisible}
          mode="edit"
          selectedItem={null}
          editingItem={editingItem}
          selectedToppings={editToppings}
          availableToppings={availableToppings}
          quantity={editQuantity}
          notes={editNotes}
          sugarLevel={editSugarLevel}
          onOk={handleSaveEdit}
          onCancel={handleCancelEdit}
          onToppingsChange={setEditToppings}
          onQuantityChange={setEditQuantity}
          onNotesChange={setEditNotes}
          onSugarLevelChange={setEditSugarLevel}
        />
      </div>
    </div>
  );
};

export default OrderCartStep;
