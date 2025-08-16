import React, { useState, useEffect } from 'react';
import { Modal, Typography, InputNumber, Input, Divider, Slider, Checkbox } from 'antd';
import { MenuItem, Topping } from '@/types';

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
  const [qtyError, setQtyError] = useState<string | null>(null);

  useEffect(()=>{
    if (!isVisible) { setQtyError(null); }
  }, [isVisible]);

  const validateQty = (val: number) => {
    if (!Number.isFinite(val) || val < 1) {
      setQtyError('จำนวนต้องเป็นตัวเลขตั้งแต่ 1 ขึ้นไป');
      return false;
    }
    setQtyError(null);
    return true;
  };

  const handleOk = () => {
    if (validateQty(quantity)) onOk();
  };

  const getTotalPrice = () => {
    if (!selectedItem) return 0;
    return (selectedItem.base_price + selectedToppings.reduce((sum, t) => sum + t.price, 0)) * quantity;
  };

  return (
    <Modal
      title={`เพิ่ม ${selectedItem?.name} ลงตะกร้า`}
      open={isVisible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="เพิ่มลงตะกร้า"
      cancelText="ยกเลิก"
      width={600}
      okButtonProps={{ disabled: !!qtyError || !selectedItem }}
    >
      {selectedItem && (
        <div>
          <div className="mb-4">
            <Text strong>ราคา: ฿{selectedItem.base_price}</Text>
          </div>

          <div className="mb-4">
            <Text strong>ท็อปปิ้ง:</Text>
            <div className="mt-2">
              <div className="grid grid-cols-2 gap-2">
                {toppings.map(topping => {
                  const checked = selectedToppings.some(t => t.id === topping.id);
                  return (
                    <label key={topping.id} className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-gray-50">
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
                      <span className="text-sm flex-1">
                        {topping.name}
                        <span className="text-gray-500 ml-1 text-xs">(+฿{topping.price})</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <Text strong>จำนวน:</Text>
            <InputNumber
              min={1}
              value={quantity}
              onChange={(value) => { const v = value || 1; onQuantityChange(v); validateQty(v); }}
              onBlur={() => validateQty(quantity)}
              className="ml-2"
            />
            {qtyError && <div className="text-red-500 text-xs mt-1">{qtyError}</div>}
          </div>

          <div className="mb-4">
            <Text strong>หมายเหตุ:</Text>
            <Input
              placeholder="เพิ่มหมายเหตุ (ถ้ามี)"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              className="ml-2 w-full"
            />
          </div>

          <div className="mb-4">
            <Text strong>ความหวาน (%):</Text>
            <div className="mt-2">
              <Slider
                min={0}
                max={100}
                step={5}
                value={sugarLevel}
                onChange={(v)=> onSugarLevelChange(Array.isArray(v)? v[0]: v)}
              />
              <div className="text-xs text-gray-600 mt-1">{sugarLevel}%</div>
            </div>
          </div>

          <Divider />

          <div className="text-right">
            <Text strong className="text-lg">
              ยอดรวม: ฿{getTotalPrice()}
            </Text>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddToCartModal;
