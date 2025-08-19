# UI/UX Improvements - ตะกร้าและชำระเงิน

## 🎯 **เป้าหมายการปรับปรุง**

### 1. **หน้าตะกร้า (OrderCartStep)**
- ลดความซับซ้อนของ UI
- เพิ่ม visual hierarchy
- ปรับปรุง mobile experience
- เพิ่ม micro-interactions

### 2. **หน้าชำระเงิน (OrderPaymentStep)**
- ลดความซ้ำซ้อน
- เพิ่ม payment validation
- ปรับปรุง order confirmation
- เพิ่ม security indicators

## 🎨 **Design System**

### **Color Palette**
```css
/* Primary Colors */
--primary-50: #fefce8;
--primary-100: #fef9c3;
--primary-500: #eab308;
--primary-600: #ca8a04;
--primary-700: #a16207;

/* Status Colors */
--success-50: #f0fdf4;
--success-500: #22c55e;
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--error-50: #fef2f2;
--error-500: #ef4444;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-900: #111827;
```

### **Typography Scale**
```css
/* Headings */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

### **Spacing System**
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
```

## 📱 **หน้าตะกร้า - ข้อเสนอแนะใหม่**

### **Layout Structure**
```
┌─────────────────────────────────────┐
│ Header: ตะกร้าสินค้าของคุณ           │
│ [Cart Icon] [Item Count] [Total]    │
├─────────────────────────────────────┤
│ Empty State (if cart is empty)      │
│ [Empty Cart Icon]                   │
│ "ยังไม่มีรายการในตะกร้า"             │
│ [Button: เลือกเมนู]                  │
├─────────────────────────────────────┤
│ Cart Items List                     │
│ ┌─────────────────────────────────┐ │
│ │ Item Card                       │ │
│ │ [Image] [Name] [Price]          │ │
│ │ [Toppings] [Notes] [Sugar]      │ │
│ │ [Quantity Controls] [Actions]   │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Order Summary                       │
│ [Subtotal] [Total Items] [Total]    │
├─────────────────────────────────────┤
│ Action Buttons                      │
│ [Back to Menu] [Proceed to Payment] │
└─────────────────────────────────────┘
```

### **Item Card Design**
```tsx
<Card className="cart-item-card">
  <div className="flex gap-4">
    {/* Item Image */}
    <div className="w-20 h-20 rounded-lg overflow-hidden">
      <img src={item.imageUrl} alt={item.name} />
    </div>
    
    {/* Item Details */}
    <div className="flex-1">
      <h3 className="font-semibold text-lg">{item.name}</h3>
      <p className="text-gray-600 text-sm">{item.description}</p>
      
      {/* Toppings */}
      {item.toppings.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {item.toppings.map(topping => (
            <Tag key={topping.id} size="small" color="blue">
              +{topping.name}
            </Tag>
          ))}
        </div>
      )}
      
      {/* Notes & Sugar Level */}
      {(item.notes || item.sugarLevel !== 100) && (
        <div className="mt-2 space-y-1">
          {item.notes && (
            <p className="text-xs text-gray-500">📝 {item.notes}</p>
          )}
          {item.sugarLevel !== 100 && (
            <p className="text-xs text-gray-500">🍯 ความหวาน: {item.sugarLevel}%</p>
          )}
        </div>
      )}
    </div>
    
    {/* Price & Actions */}
    <div className="text-right">
      <p className="font-semibold text-lg">฿{item.totalPrice}</p>
      <p className="text-sm text-gray-500">฿{item.unitPrice}/ชิ้น</p>
      
      {/* Quantity Controls */}
      <div className="flex items-center gap-2 mt-2">
        <Button size="small" icon={<MinusOutlined />} />
        <span className="w-8 text-center">{item.quantity}</span>
        <Button size="small" icon={<PlusOutlined />} />
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-1 mt-2">
        <Button size="small" icon={<EditOutlined />} />
        <Button size="small" danger icon={<DeleteOutlined />} />
      </div>
    </div>
  </div>
</Card>
```

## 💳 **หน้าชำระเงิน - ข้อเสนอแนะใหม่**

### **Layout Structure**
```
┌─────────────────────────────────────┐
│ Header: ชำระเงิน                    │
│ [Payment Icon] [Order Summary]      │
├─────────────────────────────────────┤
│ Order Summary Card                  │
│ [Order Items List - Compact]        │
│ [Subtotal] [Total Items] [Total]    │
├─────────────────────────────────────┤
│ Payment Method Selection            │
│ ┌─────────────────────────────────┐ │
│ │ [Credit Card Icon]              │ │
│ │ บัตรเครดิต/เดบิต                │ │
│ │ Visa, Mastercard, JCB           │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ [QR Code Icon]                  │ │
│ │ โอนเงินผ่าน QR Code             │ │
│ │ สแกน QR Code เพื่อโอนเงิน       │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Payment Details                     │
│ [Payment Method] [Amount] [Status]  │
├─────────────────────────────────────┤
│ Action Buttons                      │
│ [Back to Cart] [Confirm Payment]    │
└─────────────────────────────────────┘
```

### **Payment Method Card**
```tsx
<Card 
  className={`payment-method-card ${
    selectedMethod === method.key ? 'selected' : ''
  }`}
  onClick={() => setSelectedMethod(method.key)}
>
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center">
      {method.icon}
    </div>
    
    <div className="flex-1">
      <h3 className="font-semibold text-lg">{method.label}</h3>
      <p className="text-gray-600">{method.description}</p>
    </div>
    
    <Radio checked={selectedMethod === method.key} />
  </div>
</Card>
```

## 🎯 **Key Improvements**

### **1. Visual Hierarchy**
- ใช้ typography scale ที่ชัดเจน
- เพิ่ม spacing ที่เหมาะสม
- ใช้ color contrast ที่ดี

### **2. Micro-interactions**
- Hover effects บน cards
- Loading states
- Success/error animations
- Smooth transitions

### **3. Mobile-First Design**
- Responsive layout
- Touch-friendly buttons
- Swipe gestures
- Bottom sheet for actions

### **4. Accessibility**
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast mode

### **5. Performance**
- Lazy loading images
- Optimized animations
- Efficient re-renders
- Progressive enhancement

## 🚀 **Implementation Plan**

### **Phase 1: Foundation**
1. สร้าง Design System
2. ปรับปรุง Color Palette
3. สร้าง Component Library

### **Phase 2: Cart Page**
1. Redesign Item Cards
2. ปรับปรุง Layout
3. เพิ่ม Micro-interactions

### **Phase 3: Payment Page**
1. ลดความซ้ำซ้อน
2. เพิ่ม Payment Validation
3. ปรับปรุง Order Summary

### **Phase 4: Polish**
1. เพิ่ม Animations
2. ปรับปรุง Mobile Experience
3. เพิ่ม Accessibility Features
