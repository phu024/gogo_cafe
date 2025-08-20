import React from 'react';
import { MenuItem, Topping, CartItem } from '@/types';
import { useAddToCartModalLogic } from '@/presentation/hooks/legacy/useCustomerAddToCartModal';
import { Modal, InputNumber, Slider, Checkbox, Typography, Input, CheckboxChangeEvent, Tag } from 'antd';
import { PlusOutlined, EditOutlined, CoffeeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface AddToCartModalProps {
  isVisible: boolean;
  mode?: 'add' | 'edit';
  selectedItem: MenuItem | null;
  editingItem?: CartItem | null;
  selectedToppings: Topping[];
  quantity: number;
  notes: string;
  availableToppings: Topping[];
  onOk: () => void;
  onCancel: () => void;
  onToppingsChange: (toppings: Topping[]) => void;
  onQuantityChange: (quantity: number) => void;
  onNotesChange: (notes: string) => void;
  sugarLevel: number; // 0-100
  onSugarLevelChange: (val: number) => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  isVisible,
  mode = 'add',
  selectedItem,
  editingItem,
  availableToppings,
  selectedToppings,
  quantity,
  notes,
  sugarLevel,
  onOk,
  onCancel,
  onToppingsChange,
  onQuantityChange,
  onNotesChange,
  onSugarLevelChange,
}) => {
  const currentItem = mode === 'edit' ? editingItem?.menu_item : selectedItem;
  const { totalPrice } = useAddToCartModalLogic(currentItem || null, selectedToppings, quantity);

  return (
    <Modal
      title={
                  <div className="flex items-center gap-2">
            {mode === 'add' ? (
              <PlusOutlined className="text-[var(--gogo-primary)]" />
            ) : (
              <EditOutlined className="text-[var(--gogo-secondary)]" />
            )}
          {mode === 'add' ? 'เพิ่มลงตะกร้าสินค้า' : 'แก้ไขรายการสินค้า'}
        </div>
      }
      open={isVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText={mode === 'add' ? "เพิ่มลงตะกร้า" : "บันทึกการแก้ไข"}
      cancelText="ยกเลิก"
      width={600}
      okButtonProps={{
        className: mode === 'add' ? 
          "bg-[var(--gogo-primary)] hover:bg-[#e69c00] border-[var(--gogo-primary)]" : 
          "bg-[var(--gogo-secondary)] hover:bg-[#0091cc] border-[var(--gogo-secondary)]",
      }}
    >
      {currentItem && (
        <div className="space-y-6">
          {/* Item Info */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
              {currentItem.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentItem.image_url}
                  alt={currentItem.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <CoffeeOutlined className="text-2xl text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <Title level={4} className="mb-2">{currentItem.name}</Title>
              <Text className="text-gray-600 mb-2 block">{currentItem.description}</Text>
              <Text strong className="text-lg text-[var(--gogo-primary)]">฿{currentItem.base_price}</Text>
            </div>
          </div>

          {/* Toppings - ขั้นตอนที่ 1 */}
          {availableToppings.length > 0 && (
            <div>
              <Text strong className="block mb-2">เลือกท็อปปิ้งเพิ่มเติม</Text>
              <div className="grid grid-cols-2 gap-2">
                {availableToppings.map((topping: Topping) => (
                  <Checkbox
                    key={topping.id}
                    checked={selectedToppings.some(t => t.id === topping.id)}
                    onChange={(e: CheckboxChangeEvent) => {
                      if (e.target.checked) {
                        onToppingsChange([...selectedToppings, topping]);
                      } else {
                        onToppingsChange(selectedToppings.filter(t => t.id !== topping.id));
                      }
                    }}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span>{topping.name}</span>
                      <span className="text-[var(--gogo-primary)]">+฿{topping.price}</span>
                    </div>
                  </Checkbox>
                ))}
              </div>
            </div>
          )}

          {/* Sugar Level - ขั้นตอนที่ 2 */}
          <div>
            <Text strong className="block mb-2">ระดับความหวาน</Text>
            <Slider
              min={0}
              max={100}
              step={25}
              value={sugarLevel}
              onChange={onSugarLevelChange}
              marks={{
                0: 'ไม่หวาน',
                25: 'หวานน้อย',
                50: 'หวานปานกลาง',
                75: 'หวานมาก',
                100: 'หวานมากที่สุด'
              }}
              tooltip={{
                formatter: (value) => `${value}%`
              }}
            />
          </div>

          {/* Quantity - ขั้นตอนที่ 3 */}
          <div>
            <Text strong className="block mb-2">จำนวน</Text>
            <InputNumber
              min={1}
              max={10}
              value={quantity}
              onChange={(value) => onQuantityChange(value || 1)}
              className="w-1/4"
              addonBefore="ชิ้น"
            />
          </div>

          {/* Notes */}
          <div>
            <Text strong className="block mb-2">หมายเหตุ (ไม่บังคับ)</Text>
            <TextArea
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onNotesChange(e.target.value)}
              placeholder="ระบุความต้องการพิเศษ เช่น ไม่ใส่น้ำแข็ง, ใส่น้ำแข็งน้อย, ฯลฯ"
              rows={3}
              maxLength={200}
              showCount
            />
          </div>

          {/* Total Price */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <Text strong className="text-lg">ราคารวม:</Text>
              <Text strong className="text-2xl text-[var(--gogo-primary)]">฿{totalPrice}</Text>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <div className="flex flex-wrap gap-2">
                <Tag color="blue">เมนู: ฿{currentItem.base_price} × {quantity}</Tag>
                {selectedToppings.length > 0 && (
                  <Tag color="green">ท็อปปิ้ง: ฿{selectedToppings.reduce((sum, t) => sum + t.price, 0)} × {quantity}</Tag>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddToCartModal;
