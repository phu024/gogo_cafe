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
import { formatCurrencyTH, calcItemTotalPrice } from '@/shared/utils/utils';
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
      const newTotalPrice = calcItemTotalPrice(editingItem.menu_item, editToppings, editQuantity);
      
      onEditItem({
        ...editingItem,
        quantity: editQuantity,
        sugar_level: editSugarLevel,
        notes: editNotes,
        toppings: editToppings,
        total_price: newTotalPrice,
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
            {/* <ShoppingCartOutlined className="text-6xl text-gray-300 mb-4" /> */}
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
            {/* <ShoppingOutlined className="mr-2 text-[var(--gogo-primary)]" /> */}
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
    <div className="border-b border-gray-300 pb-4 mb-4 last:border-b-0">
      {/* Item Header */}
      <div className="mb-3">
        <Title level={4} className="mb-0">
          {item.menu_item.name}
        </Title>
      </div>

      {/* Item Details */}
      <div className="space-y-2 text-sm mb-3">
        <div className="flex justify-between">
          <Text>ราคาเครื่องดื่ม</Text>
          <Text>฿{formatCurrencyTH(item.menu_item.base_price)}</Text>
        </div>
        
        {item.toppings.length > 0 && (
          <div>
            <div className="flex justify-between mb-1">
              <Text>ท็อปปิ้ง</Text>
              <Text>฿{formatCurrencyTH(item.toppings.reduce((sum, t) => sum + t.price, 0))}</Text>
            </div>
            <div className="flex flex-wrap gap-1">
              {item.toppings.map((topping) => (
                <Tag key={topping.id} className="text-xs">
                  {topping.name} (+฿{formatCurrencyTH(topping.price)})
                </Tag>
              ))}
            </div>
          </div>
        )}
        
        {item.sugar_level !== 50 && (
          <div className="flex justify-between">
            <Text>ความหวาน</Text>
            <Text>{item.sugar_level}%</Text>
          </div>
        )}
        
        <div className="flex justify-between">
          <Text className="font-medium">ราคาต่อรายการ</Text>
          <Text className="font-medium">฿{formatCurrencyTH(item.total_price / item.quantity)}</Text>
        </div>
        
        <div className="flex justify-between">
          <Text>จำนวน</Text>
          <Text>{item.quantity} รายการ</Text>
        </div>
        
        <div className="flex justify-between border-t border-gray-100 pt-2">
          <Text className="font-medium text-lg">ราคารวม</Text>
          <Text className="font-medium text-lg">฿{formatCurrencyTH(item.total_price)}</Text>
        </div>
      </div>

      {/* Notes */}
      {item.notes && (
        <div className="mb-3">
          <div className="flex items-start gap-2">
            <FileTextOutlined className="text-gray-500 mt-0.5" />
            <Text className="text-sm font-medium">หมายเหตุ:</Text>
            <Text className="text-sm text-gray-600">{item.notes}</Text>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button
          type="default"
          icon={<EditOutlined />}
          size="small"
          onClick={() => handleEditItem(item)}
        >
          แก้ไข
        </Button>
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => onRemoveItem(item.id.toString())}
        >
          ลบ
        </Button>
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
          <div className="text-xl font-bold">
            {totalItems} รายการ
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Text className="text-gray-600 text-sm">ยอดรวมทั้งหมด</Text>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
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
