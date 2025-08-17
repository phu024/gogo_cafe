import React from 'react';
import { Steps } from 'antd';
import { 
  CoffeeOutlined, 
  ShoppingCartOutlined, 
  CreditCardOutlined, 
  QrcodeOutlined 
} from '@ant-design/icons';

type OrderStep = "menu" | "cart" | "payment" | "success";

interface StepConfig {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface OrderProgressStepsProps {
  currentStep: OrderStep;
}

const STEPS_CONFIG: Record<OrderStep, StepConfig> = {
  menu: {
    title: "เลือกเมนู",
    description: "เลือกเครื่องดื่มที่ต้องการ",
    icon: <CoffeeOutlined />
  },
  cart: {
    title: "ตะกร้า",
    description: "ตรวจสอบรายการ",
    icon: <ShoppingCartOutlined />
  },
  payment: {
    title: "ชำระเงิน",
    description: "เลือกวิธีชำระเงิน",
    icon: <CreditCardOutlined />
  },
  success: {
    title: "เสร็จสิ้น",
    description: "รับ QR Code",
    icon: <QrcodeOutlined />
  }
};

const STEP_ORDER: OrderStep[] = ['menu', 'cart', 'payment', 'success'];

const OrderProgressSteps: React.FC<OrderProgressStepsProps> = ({ currentStep }) => {
  const getCurrentStepIndex = () => STEP_ORDER.indexOf(currentStep);

  return (
    <Steps
      current={getCurrentStepIndex()}
      className="mb-8"
      items={STEP_ORDER.map(step => ({
        ...STEPS_CONFIG[step],
        status: STEP_ORDER.indexOf(step) === getCurrentStepIndex() ? 'process' : undefined
      }))}
    />
  );
};

export default OrderProgressSteps;
