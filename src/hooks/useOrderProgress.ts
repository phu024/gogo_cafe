import { useMemo } from 'react';

type OrderStep = 'menu' | 'cart' | 'payment' | 'success';

export function useOrderProgressLogic(currentStep: OrderStep) {
  const stepOrder: OrderStep[] = useMemo(() => ['menu', 'cart', 'payment', 'success'], []);
  const currentStepIndex = useMemo(() => stepOrder.indexOf(currentStep), [currentStep, stepOrder]);
  return { currentStepIndex, stepOrder };
}
