import React from 'react';
import { Modal, Typography, InputNumber, Input, Divider, Slider, Checkbox } from 'antd';
import { MenuItem, Topping } from '@/types';
import { useAddToCartModalLogic } from '@/hooks/useCustomerAddToCartModal';


const { Text } = Typography;

interface AddToCartModalProps {
  isVisible: boolean;
  selectedItem: MenuItem | null;
  selectedToppings: Topping[];
  quantity: number;
  notes: string;
  toppings: Topping[];
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
  selectedItem,
  selectedToppings,
  quantity,
  notes,
  toppings,
  onOk,
  onCancel,
  onToppingsChange,
  onQuantityChange,
  onNotesChange,
  sugarLevel,
  onSugarLevelChange,
}) => {
  const { qtyError, validateQty, getTotalPrice, } = useAddToCartModalLogic(isVisible, selectedItem, selectedToppings, quantity);

  const handleOk = () => {
    if (validateQty(quantity)) onOk();
  };

  if (!selectedItem) {
    return null; // Don't render modal if no item is selected
  }
  return (
    <Modal
      title={selectedItem ? `สั่งซื้อ: ${selectedItem.name}` : 'สั่งซื้อสินค้า'}
      open={isVisible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="ยืนยันการสั่งซื้อ"
      cancelText="ปิด"
      width={600}
      okButtonProps={{ disabled: !!qtyError || !selectedItem }}
    >
      {selectedItem && (
        <div className="space-y-6">
          {/* Item Info */}
          <div className="flex items-center gap-4">
            <div>
              <div className="text-gray-600 mt-1">ราคาเริ่มต้น: <span className="text-primary">฿{selectedItem.base_price}</span></div>
            </div>
          </div>
          <Divider className="mb-2" />
          
          {/* Toppings */}
          <div>
            <Text strong>เลือกท็อปปิ้งเพิ่มเติม</Text>
            <div className="flex flex-wrap gap-2 mt-2">
              {toppings.map(topping => {
                const checked = selectedToppings.some(t => t.id === topping.id);
                return (
                  <label key={topping.id} className={`flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer transition ${checked ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-200 hover:bg-blue-50'}`}>
                    <Checkbox
                      checked={checked}
                      onChange={() => {
                        let updated: Topping[];
                        if (checked) {
                          updated = selectedToppings.filter(t => t.id !== topping.id);
                        } else {
                          updated = [...selectedToppings, topping];
                        }
                        onToppingsChange(updated);
                      }}
                    />
                    <span className="text-sm font-medium">{topping.name}</span>
                    <span className="text-xs text-gray-500">+฿{topping.price}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sugar Level */}
          <div>
            <Text strong>ระดับความหวาน</Text>
            <div className="flex items-center gap-4 mt-2">
              <Slider
                min={0}
                max={100}
                step={5}
                value={sugarLevel}
                onChange={(v)=> onSugarLevelChange(Array.isArray(v)? v[0]: v)}
                className="flex-1"
              />
              <span className="text-gray-600">{sugarLevel}%</span>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <Text strong>จำนวนที่ต้องการ</Text>
            <div className="flex items-center gap-2 mt-2">
              <InputNumber
                min={1}
                value={quantity}
                onChange={(value) => { const v = value || 1; onQuantityChange(v); validateQty(v); }}
                onBlur={() => validateQty(quantity)}
                className="w-24"
              />
              <span className="text-gray-500">แก้ว</span>
            </div>
            {qtyError && <div className="text-red-500 text-xs mt-1">{qtyError}</div>}
          </div>

          {/* Notes */}
          <div>
            <Text strong>หมายเหตุเพิ่มเติม (ถ้ามี)</Text>
            <Input.TextArea
              placeholder="ระบุความต้องการพิเศษ เช่น ไม่ใส่ฟองนม, เพิ่มน้ำแข็ง ฯลฯ"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              className="mt-2 w-full"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </div>

          <Divider />

          {/* Total Price*/}
          <div className="flex justify-between items-center">
            <Text strong className="text-lg text-primary">ยอดรวม: ฿{getTotalPrice()}</Text>
            
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddToCartModal;
