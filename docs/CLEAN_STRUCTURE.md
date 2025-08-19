# GOGO CAFE - โครงสร้าง Clean Architecture ที่สะอาด

## โครงสร้างไฟล์ปัจจุบัน

```
src/
├── domain/                    # Business Logic (Core)
│   ├── entities/             # Business Entities
│   │   └── Order.ts         # Order, OrderItem, MenuItem, etc.
│   ├── value-objects/        # Value Objects
│   │   ├── Price.ts         # Price with validation
│   │   └── Quantity.ts      # Quantity with validation
│   ├── services/            # Domain Services
│   │   ├── OrderCalculationService.ts
│   │   └── OrderIdGenerator.ts
│   └── index.ts             # Domain exports
├── application/              # Use Cases (Application Logic)
│   ├── use-cases/order/
│   │   ├── AddItemToCartUseCase.ts
│   │   ├── UpdateCartItemQuantityUseCase.ts
│   │   └── CreateOrderUseCase.ts
│   └── index.ts             # Application exports
├── infrastructure/           # External Concerns
│   ├── repositories/
│   │   └── MenuRepository.ts
│   └── index.ts             # Infrastructure exports
├── presentation/             # UI/UX Layer
│   ├── components/
│   │   ├── customer/order/  # Customer order components
│   │   │   ├── OrderMenuStep.tsx
│   │   │   ├── OrderCartStep.tsx
│   │   │   ├── OrderPaymentStep.tsx
│   │   │   ├── OrderSuccessStep.tsx
│   │   │   ├── AddToCartModal.tsx
│   │   │   ├── OrderProgressSteps.tsx
│   │   │   ├── CartBadge.tsx
│   │   │   └── index.ts
│   │   ├── barista/         # Barista components
│   │   │   ├── OrderCard.tsx
│   │   │   ├── CurrentTime.tsx
│   │   │   ├── StatisticsCard.tsx
│   │   │   ├── BaristaStatistics.tsx
│   │   │   └── index.ts
│   │   └── shared/          # Shared components
│   │       ├── header.tsx
│   │       ├── OrderSummary.tsx
│   │       └── index.ts
│   ├── hooks/
│   │   ├── legacy/          # Old hooks (temporary)
│   │   │   ├── useCustomerOrderCart.ts
│   │   │   ├── useCustomerOrderMenu.ts
│   │   │   ├── useCustomerOrderPayment.ts
│   │   │   ├── useCustomerOrderSuccess.ts
│   │   │   ├── useCustomerOrderProgress.ts
│   │   │   ├── useCustomerAddToCartModal.ts
│   │   │   ├── useBaristaOrders.ts
│   │   │   ├── useBaristaOrderCard.ts
│   │   │   ├── useBaristaStatistics.ts
│   │   │   ├── useBaristaStatisticsLogic.ts
│   │   │   └── useCurrentTime.ts
│   │   ├── useOrderManagement.ts  # New clean hook
│   │   ├── useMenuManagement.ts   # New clean hook
│   │   └── index.ts
│   └── index.ts             # Presentation exports
├── shared/                   # Shared Resources
│   ├── constants/
│   │   ├── orderStatus.ts
│   │   └── navigation.ts
│   ├── utils/
│   │   ├── mock-data.ts
│   │   └── utils.ts
│   └── index.ts             # Shared exports
├── app/                      # Next.js App Router
│   ├── customer/
│   │   ├── order/
│   │   │   └── page.tsx
│   │   └── history/
│   │       └── page.tsx
│   ├── barista/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── logout/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── types/                    # TypeScript Types
│   └── index.ts
└── middleware.ts
```

## การใช้งาน

### 1. Import จาก Domain Layer
```typescript
import { Order, MenuItem, Price, OrderCalculationService } from '@/domain';
```

### 2. Import จาก Application Layer
```typescript
import { AddItemToCartUseCase, CreateOrderUseCase } from '@/application';
```

### 3. Import จาก Infrastructure Layer
```typescript
import { MockMenuRepository } from '@/infrastructure';
```

### 4. Import จาก Presentation Layer
```typescript
import { 
  OrderCartStep, 
  OrderPaymentStep, 
  useOrderManagement 
} from '@/presentation';
```

### 5. Import จาก Shared Layer
```typescript
import { 
  ORDER_STATUS_CONFIG, 
  formatCurrencyTH 
} from '@/shared';
```

## ข้อดีของโครงสร้างใหม่

1. **แยก Concerns ชัดเจน** - แต่ละ layer มีหน้าที่เฉพาะ
2. **Import ง่าย** - ใช้ index files ทำให้ import สะดวก
3. **ไม่มีไฟล์ซ้ำซ้อน** - ลบไฟล์เก่าที่ไม่ได้ใช้งานแล้ว
4. **Scalable** - เพิ่ม feature ใหม่ได้ง่าย
5. **Maintainable** - เปลี่ยน UI โดยไม่กระทบ business logic

## ขั้นตอนต่อไป

1. **ปรับ Components ให้ใช้ Hooks ใหม่**
   - ใช้ `useOrderManagement` แทน legacy hooks
   - ใช้ `OrderSummary` component ร่วมกัน

2. **ลบ Legacy Code**
   - ลบ `legacy/` hooks หลังจากปรับเสร็จ
   - ลบ utils เก่าหลังจากใช้ domain services

3. **เพิ่ม Tests**
   - Unit tests สำหรับ domain layer
   - Component tests สำหรับ UI
