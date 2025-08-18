"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Layout, message } from "antd";
import { useRouter } from 'next/navigation';
import { 
  menuCategories as mockMenuCategories, 
  menuItems as mockMenuItems, 
  toppings as mockToppings 
} from "@/lib/mock-data";
import type { MenuCategory, MenuItem, Topping, CartItem, OrderStatus } from "@/types";
import Header from "@/components/header";
import {
  OrderMenuStep,
  OrderCartStep,
  OrderPaymentStep,
  OrderSuccessStep,
  AddToCartModal,
  OrderProgressSteps,
  CartBadge
} from "@/components/order";

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

    const totalPrice = calculateTotalPrice(selectedItem, selectedToppings, quantity);
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
    message.success('เพิ่มลงตะกร้าเรียบร้อย');
    resetModalState();
  }, [selectedItem, selectedToppings, quantity, notes, sugarLevel, resetModalState]);

  const handleQuantityUpdate = useCallback((itemId: number, newQuantity: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const newTotalPrice = (item.menu_item.base_price + 
          item.toppings.reduce((sum, t) => sum + t.price, 0)) * newQuantity;
        return { ...item, quantity: newQuantity, total_price: newTotalPrice };
      }
      return item;
    }));
  }, []);

  const handleRemoveItem = useCallback((itemId: number) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    message.success('ลบรายการเรียบร้อย');
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
    handleRemoveItem,
    resetModalState
  };
};

const calculateTotalPrice = (item: MenuItem, toppings: Topping[], quantity: number): number => {
  const basePrice = item.base_price;
  const toppingsPrice = toppings.reduce((sum, t) => sum + t.price, 0);
  return (basePrice + toppingsPrice) * quantity;
};

const generateOrderId = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `GO${year}${month}${day}${random}`;
};

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
    handleQuantityUpdate,
    handleRemoveItem,
    resetModalState
  } = useOrderManagement();

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
    setOrderStatus("WAITING"); // หรือสถานะเริ่มต้นที่ต้องการ เช่น "WAITING" หรือ "IN_PROGRESS"
  }, [setCurrentStep, setOrderStatus]);

  const resetOrder = useCallback(() => {
    router.push('/order');
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
            onQuantityUpdate={handleQuantityUpdate}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
            onBackToMenu={() => setCurrentStep("menu")}
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
              cartCount={cart.length} 
              onCartClick={handleCartClick} 
            />
          )}

          <div className="bg-white p-8 rounded-lg shadow-sm mt-8">
            {renderCurrentStep()}
          </div>
        </div>

        <AddToCartModal
          isVisible={isModalVisible}
          selectedItem={selectedItem}
          selectedToppings={selectedToppings}
          quantity={quantity}
          notes={notes}
          toppings={toppings}
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
