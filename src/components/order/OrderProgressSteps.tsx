import React from 'react';
import { Steps } from 'antd';
import { CoffeeOutlined, ShoppingCartOutlined, CreditCardOutlined, QrcodeOutlined } from '@ant-design/icons';

interface OrderProgressStepsProps {
  currentStep: string;
}

const OrderProgressSteps: React.FC<OrderProgressStepsProps> = ({ currentStep }) => {
  const steps = [
    {
      title: "เลือกเมนู",
      description: "เลือกเครื่องดื่มที่ต้องการ",
      icon: <CoffeeOutlined />
    },
    {
      title: "ตะกร้า",
      description: "ตรวจสอบรายการ",
      icon: <ShoppingCartOutlined />
    },
    {
      title: "ชำระเงิน",
      description: "เลือกวิธีชำระเงิน",
      icon: <CreditCardOutlined />
    },
    {
      title: "เสร็จสิ้น",
      description: "รับ QR Code",
      icon: <QrcodeOutlined />
    }
  ];

  const getCurrentStepIndex = () => {
    switch (currentStep) {
      case "menu": return 0;
      case "cart": return 1;
      case "payment": return 2;
      case "success": return 3;
      default: return 0;
    }
  };

  return (
    <div className="mb-8">
      <Steps 
        current={getCurrentStepIndex()}
        items={steps}
      />
    </div>
  );
};

export default OrderProgressSteps;
