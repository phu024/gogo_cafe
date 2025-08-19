import React from 'react';
import { Steps } from 'antd';
import { 
  CoffeeOutlined, 
  ShoppingCartOutlined, 
  CreditCardOutlined, 
  QrcodeOutlined 
} from '@ant-design/icons';
import { useOrderProgressLogic } from '@/hooks/useCustomerOrderProgress';

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

const OrderProgressSteps: React.FC<OrderProgressStepsProps> = ({ currentStep }) => {
  const { currentStepIndex, stepOrder } = useOrderProgressLogic(currentStep);

  return (
    <Steps
      current={currentStepIndex}
      className="mb-8"
      items={stepOrder.map(step => ({
        ...STEPS_CONFIG[step],
        status: stepOrder.indexOf(step) === currentStepIndex ? 'process' : undefined
      }))}
    />
  );
};

export default OrderProgressSteps;
