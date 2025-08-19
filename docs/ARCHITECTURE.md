# GOGO CAFE - Clean Architecture

## โครงสร้างโปรเจกต์

```
src/
├── domain/                    # Domain Layer (Business Logic)
│   ├── entities/             # Business Entities
│   │   ├── Order.ts         # Order, OrderItem, MenuItem, Topping, etc.
│   │   └── ...
│   ├── value-objects/       # Value Objects
│   │   ├── Price.ts         # Price value object with validation
│   │   ├── Quantity.ts      # Quantity value object with validation
│   │   └── ...
│   └── services/            # Domain Services
│       ├── OrderCalculationService.ts
│       ├── OrderIdGenerator.ts
│       └── ...
├── application/              # Application Layer (Use Cases)
│   └── use-cases/
│       └── order/
│           ├── AddItemToCartUseCase.ts
│           ├── UpdateCartItemQuantityUseCase.ts
│           ├── CreateOrderUseCase.ts
│           └── ...
├── infrastructure/           # Infrastructure Layer (External Concerns)
│   └── repositories/
│       ├── MenuRepository.ts
│       └── ...
├── presentation/             # Presentation Layer (UI/UX)
│   ├── components/
│   │   ├── shared/          # Reusable Components
│   │   │   ├── OrderSummary.tsx
│   │   │   └── ...
│   │   ├── customer/        # Customer-specific Components
│   │   └── barista/         # Barista-specific Components
│   └── hooks/               # Custom Hooks
│       ├── useOrderManagement.ts
│       ├── useMenuManagement.ts
│       └── ...
├── shared/                   # Shared Resources
│   ├── constants/
│   │   ├── orderStatus.ts
│   │   └── ...
│   └── utils/
│       └── ...
└── app/                      # Next.js App Router
    ├── customer/
    ├── barista/
    └── ...
```

## หลักการ Clean Architecture

### 1. Domain Layer (Core Business Logic)
- **Entities**: Business objects (Order, MenuItem, etc.)
- **Value Objects**: Immutable objects with validation (Price, Quantity)
- **Domain Services**: Business logic that doesn't belong to entities

### 2. Application Layer (Use Cases)
- **Use Cases**: Application-specific business rules
- **Interfaces**: Contracts between layers
- **DTOs**: Data Transfer Objects

### 3. Infrastructure Layer (External Concerns)
- **Repositories**: Data access implementations
- **External Services**: APIs, databases, etc.
- **Adapters**: Convert external data to domain objects

### 4. Presentation Layer (UI/UX)
- **Components**: React components
- **Hooks**: Custom React hooks
- **Pages**: Next.js pages

## ข้อดีของโครงสร้างใหม่

### 1. Separation of Concerns
- Business logic แยกจาก UI logic
- Data access แยกจาก business rules
- ทดสอบแต่ละ layer ได้แยกกัน

### 2. Maintainability
- เปลี่ยน UI โดยไม่กระทบ business logic
- เปลี่ยน database โดยไม่กระทบ business rules
- เพิ่ม feature ใหม่ได้ง่าย

### 3. Testability
- Unit test business logic ได้ง่าย
- Mock dependencies ได้ง่าย
- Integration test แต่ละ layer

### 4. Scalability
- เพิ่ม feature ใหม่โดยไม่กระทบ code เดิม
- แยก team ทำงานได้ตาม layer
- Reuse business logic ได้

## การใช้งาน

### 1. เพิ่ม Use Case ใหม่
```typescript
// src/application/use-cases/order/RemoveItemFromCartUseCase.ts
export class RemoveItemFromCartUseCase {
  execute(request: RemoveItemFromCartRequest): RemoveItemFromCartResponse {
    // Business logic here
  }
}
```

### 2. เพิ่ม Repository ใหม่
```typescript
// src/infrastructure/repositories/OrderRepository.ts
export interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
}
```

### 3. เพิ่ม Component ใหม่
```typescript
// src/presentation/components/customer/OrderHistory.tsx
export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  // UI logic here
};
```

## Migration Guide

### จากโครงสร้างเดิม
1. ย้าย business logic ไป Domain Layer
2. แยก use cases ไป Application Layer
3. ย้าย data access ไป Infrastructure Layer
4. ปรับ components ให้ใช้ hooks ใหม่

### การทดสอบ
1. Unit test domain entities และ value objects
2. Unit test use cases
3. Integration test repositories
4. Component test UI components
