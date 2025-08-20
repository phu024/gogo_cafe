"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { users } from "@/shared/utils/mock-data";
import type { User as UserType } from "@/types";
import { menuByRole, publicNav } from "@/shared/constants/navigation";

const Header: React.FC = () => {
  // State management
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



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



  // Clear localStorage on browser close
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.clear();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Handlers
  const handleLogout = useCallback(async (ev: React.MouseEvent) => {
    ev.preventDefault();
    try {
      await fetch('/api/logout');
    } catch {
      // Handle logout error silently
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
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 h-20">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mt-4 z-50" aria-label="GOGO CAFE หน้าหลัก">
              <h1 className="text-3xl md:text-4xl font-bold leading-none">
                <span style={{ color: "var(--gogo-primary)" }}>GOGO</span>{" "}
                <span style={{ color: "var(--gogo-secondary)" }}>CAFE</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2" role="navigation" aria-label="เมนูหลัก">
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
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                                 <div className="relative">
                  <button
                    onClick={toggleMenu}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow hover:shadow-md transition-all duration-150"
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                  >
                    {/* User Info */}
                    <div className="flex flex-col items-end text-right mr-2">
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

            {/* Mobile Hamburger Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              {/* User Avatar for Mobile */}
              {currentUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-700 font-medium text-sm shadow-inner">
                  {userInitial}
                </div>
              )}
              
                             {/* Simple Hamburger Button */}
               <button
                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                 className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
               >
                 ☰
               </button>
            </div>
          </div>
        </div>
      </header>



      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
                 <div 
           className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-[9999] md:hidden"
         >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">เมนู</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="ปิดเมนู"
            >
              <span className="text-gray-500 text-xl">×</span>
            </button>
          </div>

          {/* User Info Section for Mobile */}
          {currentUser && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-700 font-medium shadow-inner">
                  {userInitial}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{fullName}</p>
                  <p className="text-sm text-gray-500">{currentUser.role_id.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <nav className="flex-1 px-6 py-4">
            <div className="space-y-2">
              {navigationItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={`mobile-${item.href}-${item.label}`}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    {Icon && <Icon className="h-5 w-5 text-gray-600" />}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Mobile Logout Button */}
          {currentUser && (
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLogout(e);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-150"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">ออกจากระบบ</span>
              </button>
            </div>
          )}
        </div>
      </div>
      )}
    </>
  );
};

export default Header;
