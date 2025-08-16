import type { ComponentType } from "react";
import { ShoppingCart, Clock, Coffee, User } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
};

// Add role-specific navigation items here. Keep this file free of styling classes.
export const menuByRole: Record<string, NavItem[]> = {
  Customer: [
    { href: "/order", label: "สั่งซื้อ", icon: ShoppingCart },
    { href: "/history", label: "ประวัติการสั่งซื้อ", icon: Clock },
  ],

  Barista: [
    { href: "/barista", label: "Order", icon: Coffee },
  ],
  Manager: [
    { href: "/barista", label: "Order", icon: Coffee },
  ],
};

// Links shown when there is no authenticated user.
export const publicNav: NavItem[] = [
  { href: "/login", label: "เข้าสู่ระบบ", icon: User },
];
