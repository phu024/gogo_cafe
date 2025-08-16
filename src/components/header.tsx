"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { LogOut, Coffee, ShoppingCart, User, Clock } from "lucide-react";
import { users } from "@/lib/mock-data";
import type { User as UserType } from "@/types";

export default function Header() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Read simple mock session from cookies on client
    const match = document.cookie.match(/(?:^|;\s*)userId=([^;]+)/);
    if (match) {
      const id = Number(match[1]);
      const user = users.find(u => u.id === id) ?? null;
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  async function handleLogout(ev: React.MouseEvent) {
    ev.preventDefault();
    try {
      await fetch('/api/logout');
    } catch {
      // ignore - still redirect
    }
    // force full reload to clear any client state
    window.location.href = '/';
  }

  const fullName = currentUser ? `${currentUser.first_name}${currentUser.last_name ? ' ' + currentUser.last_name : ''}` : '';

  return (
    <header className="bg-white border-b border-gray-200 sticky z-40">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center gap-4 h-full">
          <Link href="/" className="flex items-center gap-3" aria-label="GOGO CAFE home">
            <h1 className="text-4xl font-bold leading-none">
              <span style={{ color: "#ffad00" }}>GOGO</span>{" "}
              <span style={{ color: "#00a2e1" }}>CAFE</span>
            </h1>
          </Link>

          {/* Navigation Links: compact, icon-first centered nav */}
          <nav className="flex-1 flex items-center justify-end gap-3" role="navigation" aria-label="Primary">
            {currentUser ? (
              currentUser.role_id.name === "Customer" ? (
                <div className="flex items-center gap-2">
                  <Link href="/order" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-gray-50" aria-label="Order">
                    <ShoppingCart className="h-4 w-4 text-gray-600" />
                    <span className="hidden sm:inline text-sm text-gray-700">สั่งซื้อ</span>
                  </Link>

                  <Link href="/history" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-gray-50" aria-label="OrderHistory">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="hidden sm:inline text-sm text-gray-700">ประวัติการสั่งซื้อ</span>
                  </Link>
                </div>
              ) : (
                <Link href="/barista" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-gray-50" aria-label="Barista">
                  <Coffee className="h-4 w-4 text-gray-600" />
                  <span className="hidden sm:inline text-sm text-gray-700">Barista</span>
                </Link>
              )
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500 text-white hover:bg-yellow-600" aria-label="Login">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">เข้าสู่ระบบ</span>
                </Link>
              </div>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen(v => !v)}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50"
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                >
                  <div className="hidden sm:flex flex-col items-end text-right mr-2">
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[12rem]" title={fullName}>{fullName}</span>
                    <span className="text-xs text-gray-400">{currentUser.role_id.name}</span>
                  </div>
                  <User className="h-6 w-6 text-gray-600" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-md shadow-lg z-50">
                    <button onClick={handleLogout} className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-50">
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
}
