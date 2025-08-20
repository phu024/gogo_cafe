"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Layout, message } from "antd";
import { useRouter } from 'next/navigation';
import { 
  menuCategories as mockMenuCategories, 
  menuItems as mockMenuItems, 
  toppings as mockToppings 
} from "@/shared/utils/mock-data";
import type { MenuCategory, MenuItem, Topping, CartItem, OrderStatus } from "@/types";
import { calcItemTotalPrice } from '@/shared/utils/utils';
import Header from "@/presentation/components/shared/header";
import {
  OrderMenuStep,
  OrderCartStep,
  OrderPaymentStep,
  OrderSuccessStep,
  AddToCartModal,
  OrderProgressSteps,
  CartBadge
} from "@/presentation/components/customer/order";
import { useOrderCartLogic } from '@/presentation/hooks/legacy/useCustomerOrderCart';
import { generateOrderId } from '@/shared/utils/utils';

const { Content } = Layout;

type OrderStep = "menu" | "cart" | "payment" | "success";

const useOrderManagement = () => {
  // Core order state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<OrderStep>("menu");
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("WAITING");

  // Menu state
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  const [sugarLevel, setSugarLevel] = useState<number>(100);

  // Initialize menu data
  useEffect(() => {
    setMenuCategories(mockMenuCategories);
    setMenuItems(mockMenuItems);
    setToppings(mockToppings);
  }, []);

  const resetModalState = useCallback(() => {
    setSelectedItem(null);
    setSelectedToppings([]);
    setQuantity(1);
    setNotes("");
    setSugarLevel(100);
    setIsModalVisible(false);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!selectedItem) return;

    const totalPrice = calcItemTotalPrice(selectedItem, selectedToppings, quantity);
    const newItem: CartItem = {
      id: Date.now(),
      menu_item: selectedItem,
      toppings: selectedToppings,
      quantity,
      notes,
      total_price: totalPrice,
      sugar_level: sugarLevel
    };

    setCart(prev => [...prev, newItem]);
    message.success('เพิ่มลงตะกร้าสินค้าเรียบร้อย');
    resetModalState();
  }, [selectedItem, selectedToppings, quantity, notes, sugarLevel, resetModalState]);

  const handleQuantityUpdate = useCallback((itemId: number, quantity: number) => {
    setCart(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity, total_price: calcItemTotalPrice(item.menu_item, item.toppings, quantity) }
        : item
    ));
  }, []);

  const handleUpdateItem = useCallback((itemId: number, updates: Partial<CartItem>) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, ...updates };
        
        // Recalculate total price if quantity or toppings changed
        if (updates.quantity !== undefined || updates.toppings !== undefined) {
          const basePrice = item.menu_item.base_price;
          const toppingsPrice = (updates.toppings || item.toppings).reduce(
            (sum, topping) => sum + topping.price,
            0
          );
          const quantity = updates.quantity || item.quantity;
          updatedItem.total_price = (basePrice + toppingsPrice) * quantity;
        }
        
        return updatedItem;
      }
      return item;
    }));
  }, []);

  const handleRemoveItem = useCallback((itemId: string) => {
    setCart(prev => prev.filter(item => item.id.toString() !== itemId));
    message.success('ลบรายการออกจากตะกร้าเรียบร้อย');
  }, []);

  const handleEditItem = useCallback((updatedItem: CartItem) => {
    setCart(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    message.success('แก้ไขรายการเรียบร้อย');
  }, []);

  return {
    // State
    cart,
    currentStep,
    orderStatus,
    menuCategories,
    menuItems,
    toppings,
    selectedCategory,
    isModalVisible,
    selectedItem,
    selectedToppings,
    quantity,
    notes,
    sugarLevel,

    // Setters
    setCart,
    setCurrentStep,
    setOrderStatus,
    setSelectedCategory,
    setIsModalVisible,
    setSelectedItem,
    setSelectedToppings,
    setQuantity,
    setNotes,
    setSugarLevel,

    // Actions
    handleAddToCart,
    handleQuantityUpdate,
    handleUpdateItem,
    handleRemoveItem,
    handleEditItem,
    resetModalState
  };
};

// moved to utils: calcItemTotalPrice, generateOrderId

const OrderPage: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    currentStep,
    orderStatus,
    menuCategories,
    menuItems,
    toppings,
    selectedCategory,
    isModalVisible,
    selectedItem,
    selectedToppings,
    quantity,
    notes,
    sugarLevel,
    setCart,
    setCurrentStep,
    setOrderStatus,
    setSelectedCategory,
    setIsModalVisible,
    setSelectedItem,
    setSelectedToppings,
    setQuantity,
    setNotes,
    setSugarLevel,
    handleAddToCart,
    handleRemoveItem,
    handleEditItem,
    resetModalState
  } = useOrderManagement();

  const { totalItems } = useOrderCartLogic(cart);

  const handleItemSelect = useCallback((item: MenuItem) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  }, [setSelectedItem, setIsModalVisible]);

  const handleCartClick = useCallback(() => {
    setCurrentStep("cart");
  }, [setCurrentStep]);

  const handleCheckout = useCallback(() => {
    setCurrentStep("payment");
  }, [setCurrentStep]);

  const handlePayment = useCallback(() => {
    setCurrentStep("success");
    setOrderStatus("WAITING"); // หรือสถานะเริ่มต้นที่ต้องการ เช่น "WAITING" หรือ "ACCEPTED"
  }, [setCurrentStep, setOrderStatus]);

  const resetOrder = useCallback(() => {
    router.push('/customer/order');
    setCurrentStep("menu");
    setSelectedCategory(null);
    setCart([]);
  }, [router, setCurrentStep, setSelectedCategory, setCart]);

  const handleBackToHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const calculateOrderDetails = () => {
    return {
      orderId: generateOrderId(),
      items: cart.map(item => ({
        id: item.id,
        name: item.menu_item.name,
        quantity: item.quantity,
        price: item.total_price,
        toppings: item.toppings.map(t => t.name)
      })),
      totalAmount: cart.reduce((sum, item) => sum + item.total_price, 0)
    };
  };

  // Render current step content
  const renderCurrentStep = () => {
    switch (currentStep) {
      case "menu":
        return (
          <OrderMenuStep
            menuCategories={menuCategories}
            menuItems={menuItems}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onItemSelect={handleItemSelect}
          />
        );
      case "cart":
        return (
          <OrderCartStep
            cart={cart}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
            onBackToMenu={() => setCurrentStep("menu")}
            onEditItem={handleEditItem}
            availableToppings={toppings}
          />
        );
      case "payment":
        return (
          <OrderPaymentStep
            cart={cart}
            onPayment={handlePayment}
            onBackToCart={() => setCurrentStep("cart")}
          />
        );
      case "success":
        return (
          <OrderSuccessStep
            orderStatus={orderStatus}
            onResetOrder={resetOrder}
            onBackToHome={handleBackToHome}
            orderDetails={calculateOrderDetails()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Header />
      <Content className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <OrderProgressSteps currentStep={currentStep} />

          {currentStep === "menu" && (
            <CartBadge 
              cartCount={totalItems} 
              onCartClick={handleCartClick} 
            />
          )}

          <div className="bg-white p-8 rounded-lg shadow-sm mt-8">
            {renderCurrentStep()}
          </div>
        </div>

        <AddToCartModal
          isVisible={isModalVisible}
          mode="add"
          selectedItem={selectedItem}
          selectedToppings={selectedToppings}
          quantity={quantity}
          notes={notes}
          availableToppings={toppings}
          onOk={handleAddToCart}
          onCancel={resetModalState}
          onToppingsChange={setSelectedToppings}
          onQuantityChange={setQuantity}
          onNotesChange={setNotes}
          sugarLevel={sugarLevel}
          onSugarLevelChange={setSugarLevel}
        />
      </Content>
    </Layout>
  );
};

export default OrderPage;
