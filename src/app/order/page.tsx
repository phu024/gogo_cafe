"use client";
import React, { useState, useEffect } from "react";
import { Layout, message } from "antd";
import { useRouter } from 'next/navigation';
import { 
  menuCategories as mockMenuCategories, 
  menuItems as mockMenuItems, 
  toppings as mockToppings 
} from "@/lib/mock-data";
import { MenuCategory, MenuItem, Topping, CartItem } from "@/types";
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

type Step = "menu" | "cart" | "payment" | "success";

const OrderPage: React.FC = () => {
  const router = useRouter();
  // State management
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>("menu");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  const [sugarLevel, setSugarLevel] = useState<number>(100); // default full sweetness
  const [orderStatus, setOrderStatus] = useState<number>(1);

  // Initialize data
  useEffect(() => {
    setMenuCategories(mockMenuCategories);
    setMenuItems(mockMenuItems);
    setToppings(mockToppings);
  }, []);

  // Event handlers
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handleItemSelect = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleAddToCart = () => {
    // require login before adding to cart
    const isLoggedIn = () => {
      return document.cookie.match(/(?:^|;\s*)(userId|role)=([^;]+)/) != null;
    };
    if (!isLoggedIn()) {
      message.warning("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้า");
      router.push('/login');
      return;
    }
    if (!selectedItem) return;

    const totalPrice = (selectedItem.base_price + selectedToppings.reduce((sum, t) => sum + t.price, 0)) * quantity;
    
    const newCartItem: CartItem = {
      id: Date.now(),
      menu_item: selectedItem,
      toppings: selectedToppings,
      quantity,
      notes,
      total_price: totalPrice,
      sugar_level: sugarLevel,
    };

    setCart([...cart, newCartItem]);
    message.success(`${selectedItem.name} เพิ่มลงตะกร้าแล้ว`);
    
    // Reset form
    setSelectedItem(null);
    setSelectedToppings([]);
    setQuantity(1);
    setNotes("");
    setSugarLevel(100);
    setIsModalVisible(false);
  };

  const handleRemoveFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
    message.success("ลบรายการออกจากตะกร้าแล้ว");
  };

  const handleQuantityUpdate = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const totalPrice = (item.menu_item.base_price + item.toppings.reduce((sum, t) => sum + t.price, 0)) * newQuantity;
        return { ...item, quantity: newQuantity, total_price: totalPrice };
      }
      return item;
    }));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      message.warning("กรุณาเลือกเมนูก่อน");
      return;
    }
    // require login before checkout
    const isLoggedIn = () => {
      return document.cookie.match(/(?:^|;\s*)(userId|role)=([^;]+)/) != null;
    };
    if (!isLoggedIn()) {
      message.warning("กรุณาเข้าสู่ระบบก่อนทำการชำระเงิน");
      router.push('/login');
      return;
    }
    setCurrentStep("payment");
  };

  const handlePayment = () => {
    message.success("ชำระเงินสำเร็จ! กำลังสร้าง QR Code...");
    setTimeout(() => {
      setCurrentStep("success");
      // จำลองการอัปเดตสถานะการสั่งซื้อ
      simulateOrderProgress();
    }, 2000);
  };

  const simulateOrderProgress = () => {
    // สถานะ 1: กำลังเตรียม (เริ่มต้น)
    setTimeout(() => {
      setOrderStatus(2); // กำลังทำ
      message.info("บาริสตากำลังชงเครื่องดื่ม...");
    }, 5000);

    setTimeout(() => {
      setOrderStatus(3); // พร้อมรับ
      message.success("เครื่องดื่มพร้อมรับแล้ว! กรุณาไปรับที่เคาน์เตอร์");
    }, 15000);
  };

  const handleResetOrder = () => {
    setCart([]);
    setCurrentStep("menu");
    setOrderStatus(1);
    message.info("เริ่มต้นการสั่งซื้อใหม่");
  };

  const handleCartClick = () => {
    setCurrentStep("cart");
  };

  const handleBackToMenu = () => {
    setCurrentStep("menu");
  };

  const handleBackFromMenu = () => {
    // ถ้าอยู่ในหน้า menu และมีรายการในตะกร้า ให้กลับไปหน้า cart
    // ถ้าไม่มีรายการในตะกร้า ให้กลับไปหน้าแรก
    if (cart.length > 0) {
      setCurrentStep("cart");
    } else {
      // กลับไปหน้าแรก (อาจจะเป็น home page)
      window.history.back();
    }
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case "menu":
        return (
          <OrderMenuStep
            menuCategories={menuCategories}
            menuItems={menuItems}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            onItemSelect={handleItemSelect}
            onBack={handleBackFromMenu}
          />
        );
      case "cart":
        return (
          <OrderCartStep
            cart={cart}
            onQuantityUpdate={handleQuantityUpdate}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handleCheckout}
            onBackToMenu={handleBackToMenu}
          />
        );
      case "payment":
        return (
          <OrderPaymentStep
            cart={cart}
            onPayment={handlePayment}
          />
        );
      case "success":
        return (
          <OrderSuccessStep
            orderStatus={orderStatus}
            onResetOrder={handleResetOrder}
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
          {/* Progress Steps */}
          <OrderProgressSteps currentStep={currentStep} />

          {/* Cart Badge */}
          {currentStep === "menu" && (
            <CartBadge 
              cartCount={cart.length} 
              onCartClick={handleCartClick} 
            />
          )}

          {/* Main Content */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            {renderCurrentStep()}
          </div>
        </div>

        {/* Add to Cart Modal */}
        <AddToCartModal
          isVisible={isModalVisible}
          selectedItem={selectedItem}
          selectedToppings={selectedToppings}
          quantity={quantity}
          notes={notes}
          toppings={toppings}
          onOk={handleAddToCart}
          onCancel={() => setIsModalVisible(false)}
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
