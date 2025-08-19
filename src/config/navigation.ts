import type { ComponentType } from "react";
import { Clock, Coffee, User, Clipboard,House  } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  roles?: string[];
}

// Role-based navigation items
const ROLE_NAVIGATION: Record<string, NavItem[]> = {
  Customer: [
    {
      href: "/customer/order",
      label: "หน้าแรก",
      icon: House,
      roles: ['Customer']
    },
    {
      href: "/customer/history",
      label: "ประวัติการสั่งซื้อ",
      icon: Clock,
      roles: ['Customer']
    },
  ],
  Barista: [
    {
      href: "/barista",
      label: "รายการสั่งซื้อ",
      icon: Coffee,
      roles: ['Barista']
    }
  ],
  Manager: [
    {
      href: "/barista",
      label: "รายการสั่งซื้อ",
      icon: Coffee,
      roles: ['Manager']
    },
    {
      href: "/staff/reports",
      label: "รายงาน",
      icon: Clipboard,
      roles: ['Manager']
    },
  ],
};

// Links shown when there is no authenticated user
export const publicNav: NavItem[] = [
  { href: "/login", label: "เข้าสู่ระบบ", icon: User },
];

// Helper function to get navigation items by role
export const getNavigationByRole = (role: string): NavItem[] => {
  return ROLE_NAVIGATION[role] || [];
};

// Export role-based navigation with memoization
export const menuByRole = Object.keys(ROLE_NAVIGATION).reduce((acc, role) => {
  acc[role] = ROLE_NAVIGATION[role];
  return acc;
}, {} as Record<string, NavItem[]>);
