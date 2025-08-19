# Migration Guide - จากโครงสร้างเก่าไป Clean Architecture

## การเปลี่ยนแปลงที่ทำแล้ว

### 1. ย้ายไฟล์ไปยังโครงสร้างใหม่

#### Domain Layer
- ✅ สร้าง `src/domain/entities/Order.ts` - Business entities
- ✅ สร้าง `src/domain/value-objects/Price.ts` - Value objects
- ✅ สร้าง `src/domain/value-objects/Quantity.ts` - Value objects
- ✅ สร้าง `src/domain/services/OrderCalculationService.ts` - Domain services
- ✅ สร้าง `src/domain/services/OrderIdGenerator.ts` - Domain services

#### Application Layer
- ✅ สร้าง `src/application/use-cases/order/` - Use cases
- ✅ สร้าง `src/infrastructure/repositories/MenuRepository.ts` - Repositories

#### Presentation Layer
- ✅ ย้าย `src/components/customer/order/` → `src/presentation/components/customer/order/`
- ✅ ย้าย `src/components/barista/` → `src/presentation/components/barista/`
- ✅ ย้าย `src/components/header.tsx` → `src/presentation/components/shared/`
- ✅ ย้าย `src/hooks/` → `src/presentation/hooks/legacy/`

#### Shared Resources
- ✅ ย้าย `src/config/` → `src/shared/constants/`
- ✅ ย้าย `src/lib/` → `src/shared/utils/`

### 2. อัปเดต Import Paths

#### Components
- ✅ `OrderCartStep.tsx` - อัปเดต import paths
- ✅ `OrderPaymentStep.tsx` - อัปเดต import paths
- ✅ `AddToCartModal.tsx` - อัปเดต import paths
- ✅ `OrderSuccessStep.tsx` - อัปเดต import paths
- ✅ `OrderProgressSteps.tsx` - อัปเดต import paths
- ✅ `OrderMenuStep.tsx` - อัปเดต import paths

#### Pages
- ✅ `src/app/customer/order/page.tsx` - อัปเดต import paths

### 3. ลบไฟล์เก่าที่ซ้ำซ้อน

- ✅ ลบ `src/components/` (ย้ายไป presentation layer แล้ว)
- ✅ ลบ `src/hooks/` (ย้ายไป presentation layer แล้ว)
- ✅ ลบ `src/config/` (ย้ายไป shared constants แล้ว)
- ✅ ลบ `src/lib/` (ย้ายไป shared utils แล้ว)

## โครงสร้างใหม่

```
src/
├── domain/                    # Business Logic
│   ├── entities/             # Order, MenuItem, etc.
│   ├── value-objects/        # Price, Quantity
│   └── services/             # OrderCalculationService
├── application/              # Use Cases
│   └── use-cases/order/
├── infrastructure/           # External Concerns
│   └── repositories/
├── presentation/             # UI/UX
│   ├── components/
│   │   ├── customer/order/   # Customer order components
│   │   ├── barista/          # Barista components
│   │   └── shared/           # Shared components
│   └── hooks/
│       ├── legacy/           # Old hooks (temporary)
│       ├── useOrderManagement.ts
│       └── useMenuManagement.ts
├── shared/                   # Shared Resources
│   ├── constants/
│   └── utils/
└── app/                      # Next.js App Router
```

## ขั้นตอนต่อไป

### 1. ปรับ Components ให้ใช้ Hooks ใหม่
- [ ] ปรับ `OrderCartStep` ให้ใช้ `useOrderManagement`
- [ ] ปรับ `OrderPaymentStep` ให้ใช้ `OrderSummary` component
- [ ] ปรับ `AddToCartModal` ให้ใช้ domain services

### 2. ลบ Legacy Code
- [ ] ลบ `src/presentation/hooks/legacy/` หลังจากปรับ components หมดแล้ว
- [ ] ลบ `src/shared/utils/utils.ts` หลังจากใช้ domain services หมดแล้ว

### 3. เพิ่ม Tests
- [ ] Unit tests สำหรับ domain entities
- [ ] Unit tests สำหรับ use cases
- [ ] Integration tests สำหรับ repositories
- [ ] Component tests สำหรับ UI

### 4. เพิ่ม Error Handling
- [ ] Domain exceptions
- [ ] Application error handling
- [ ] UI error boundaries

## ข้อดีของการ Migration

1. **Separation of Concerns** - แยก business logic จาก UI
2. **Testability** - ทดสอบแต่ละ layer ได้แยกกัน
3. **Maintainability** - เปลี่ยน UI โดยไม่กระทบ business logic
4. **Scalability** - เพิ่ม feature ใหม่ได้ง่าย
5. **Reusability** - ใช้ business logic ร่วมกันได้

## การใช้งานใหม่

### Domain Services
```typescript
import { OrderCalculationService } from '@/domain/services/OrderCalculationService';
import { Price } from '@/domain/value-objects/Price';

const unitPrice = OrderCalculationService.calculateItemUnitPrice(menuItem, toppings);
const formattedPrice = Price.create(100).format();
```

### Use Cases
```typescript
import { AddItemToCartUseCase } from '@/application/use-cases/order/AddItemToCartUseCase';

const useCase = new AddItemToCartUseCase();
const result = useCase.execute(request);
```

### Custom Hooks
```typescript
import { useOrderManagement } from '@/presentation/hooks/useOrderManagement';

const { cart, addItemToCart, updateCartItemQuantity } = useOrderManagement();
```
