"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { users } from "@/lib/mock-data";
import type { User as UserType } from "@/types";
import { menuByRole, publicNav } from "@/config/navigation";

const Header: React.FC = () => {
  // State management
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // User session management
  useEffect(() => {
    const getUserFromCookie = () => {
      const match = document.cookie.match(/(?:^|;\s*)userId=([^;]+)/);
      if (match) {
        const id = Number(match[1]);
        return users.find(u => u.id === id) ?? null;
      }
      return null;
    };

    setCurrentUser(getUserFromCookie());
  }, []);

  // Click outside handler for menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handlers
  const handleLogout = useCallback(async (ev: React.MouseEvent) => {
    ev.preventDefault();
    try {
      await fetch('/api/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    window.location.href = '/';
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  // Computed values
  const navigationItems = currentUser ? (menuByRole[currentUser.role_id.name] ?? []) : publicNav;
  const fullName = currentUser 
    ? `${currentUser.first_name}${currentUser.last_name ? ' ' + currentUser.last_name : ''}`
    : '';
  const userInitial = currentUser?.first_name ? currentUser.first_name.charAt(0) : 'U';

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 h-20">
        <div className="flex items-center gap-4 h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mt-4" aria-label="GOGO CAFE home">
            <h1 className="text-4xl font-bold leading-none">
              <span style={{ color: "var(--gogo-primary)" }}>GOGO</span>{" "}
              <span style={{ color: "var(--gogo-secondary)" }}>CAFE</span>
            </h1>
          </Link>

          {/* Navigation Links */}
          <nav className="flex-1 flex items-center justify-end gap-2" role="navigation" aria-label="Primary">
            {navigationItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition-shadow duration-150"
                  aria-label={item.label}
                >
                  {Icon && <Icon className="h-4 w-4 text-gray-600" />}
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div ref={menuRef} className="relative">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow hover:shadow-md transition-all duration-150"
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                >
                  {/* User Info */}
                  <div className="hidden sm:flex flex-col items-end text-right mr-2">
                    <span className="text-sm font-semibold text-gray-800 truncate max-w-[14rem]" title={fullName}>
                      {fullName}
                    </span>
                    <span className="text-xs text-gray-500">{currentUser.role_id.name}</span>
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-700 font-medium shadow-inner">
                    {userInitial}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-lg z-50 transform transition ease-out duration-150 origin-top-right">
                    <button 
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">ออกจากระบบ</span>
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
