# GOGO CAFE - ระบบสั่งซื้อเครื่องดื่มออนไลน์

## โครงสร้างโปรเจกต์

```
src/
├── domain/                    # Domain Layer (Business Logic)
│   └── entities/             # Business Entities
│       └── Order.ts         # Order, OrderItem, MenuItem, Topping, etc.
├── presentation/             # Presentation Layer (UI/UX)
│   ├── components/
│   │   ├── shared/          # Reusable Components
│   │   │   ├── header.tsx
│   │   │   └── ...
│   │   ├── customer/        # Customer-specific Components
│   │   │   └── order/
│   │   │       ├── OrderMenuStep.tsx
│   │   │       ├── OrderCartStep.tsx
│   │   │       ├── OrderPaymentStep.tsx
│   │   │       ├── OrderSuccessStep.tsx
│   │   │       ├── AddToCartModal.tsx
│   │   │       ├── ItemCustomizationModal.tsx
│   │   │       └── ...
│   │   └── barista/         # Barista-specific Components
│   └── hooks/               # Custom Hooks (Legacy)
│       └── legacy/
│           ├── useCustomerOrderCart.ts
│           ├── useCustomerOrderMenu.ts
│           ├── useCustomerAddToCartModal.ts
│           └── ...
├── shared/                   # Shared Resources
│   ├── constants/
│   │   ├── orderStatus.ts
│   │   ├── navigation.ts
│   │   └── ...
│   └── utils/
│       ├── mock-data.ts
│       ├── utils.ts
│       └── ...
├── types/                    # TypeScript Type Definitions
│   └── index.ts
└── app/                      # Next.js App Router
    ├── customer/
    │   ├── order/
    │   │   └── page.tsx     # Main order page with local state management
    │   └── history/
    │       └── page.tsx
    ├── barista/
    │   └── page.tsx
    └── page.tsx             # Landing page
```

## สถาปัตยกรรมระบบ

ระบบนี้ใช้ Clean Architecture แบ่งเป็น 4 ชั้นหลัก:

### 1. Domain Layer
- **หน้าที่**: เก็บ Business Logic และ Business Rules
- **ไฟล์**: `src/domain/entities/Order.ts`
- **ประกอบด้วย**: Order, OrderItem, MenuItem, Topping และ Business Rules

### 2. Application Layer
- **หน้าที่**: จัดการ Use Cases และ Application Logic
- **ไฟล์**: `src/application/`
- **ประกอบด้วย**: Use Cases สำหรับการสั่งซื้อ, จัดการออเดอร์

### 3. Infrastructure Layer
- **หน้าที่**: จัดการ Data Access และ External Services
- **ไฟล์**: `src/infrastructure/`
- **ประกอบด้วย**: Repositories, External API calls

### 4. Presentation Layer
- **หน้าที่**: จัดการ UI/UX และ User Interaction
- **ไฟล์**: `src/presentation/`
- **ประกอบด้วย**: React Components, Custom Hooks

## การทำงานของระบบ

### สำหรับลูกค้า
1. **เลือกเมนู**: ลูกค้าเลือกเครื่องดื่มและท็อปปิ้ง
2. **ตะกร้าสินค้า**: ตรวจสอบและแก้ไขรายการ
3. **ชำระเงิน**: เลือกวิธีชำระเงินที่ปลอดภัย
4. **รับ QR Code**: รับ QR Code สำหรับรับเครื่องดื่ม

### สำหรับบาริสต้า
1. **ดูออเดอร์**: ดูรายการออเดอร์ที่รอดำเนินการ
2. **จัดการสถานะ**: อัพเดทสถานะการเตรียมเครื่องดื่ม
3. **ติดตามความคืบหน้า**: ดูสถิติและความคืบหน้าการทำงาน

## เทคโนโลยีที่ใช้

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Framework**: Ant Design, Tailwind CSS
- **State Management**: React Hooks, Local State
- **Icons**: Lucide React, Ant Design Icons
- **Architecture**: Clean Architecture, Domain-Driven Design