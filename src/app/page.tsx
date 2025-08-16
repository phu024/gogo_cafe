"use client";
import React, { useMemo, useState } from 'react';
import { users } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('All');

  const filteredUsers = useMemo(() => {
    if (roleFilter === 'All') return users;
    return users.filter(u => u.role_id.name === roleFilter);
  }, [roleFilter]);

  const handleLogin = (userId?: number) => {
    const idToUse = userId ?? selectedUserId;
    if (!idToUse) return;
    const user = users.find(u => u.id === idToUse);
    if (!user) return;

    // set cookies (simple mock session)
    document.cookie = `userId=${user.id}; path=/`;
    document.cookie = `role=${user.role_id.name}; path=/`;

    // redirect based on role
    if (user.role_id.name === 'Barista' || user.role_id.name === 'Manager') {
      router.push('/barista');
    } else {
      router.push('/order');
    }
  };

  const roles = ['All', 'Customer', 'Barista', 'Manager'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left hero */}
        <div className="p-10 bg-gradient-to-b from-yellow-100 to-white flex flex-col gap-6 justify-center">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight" style={{ color: 'var(--gogo-primary)' }}>
              GOGO <span style={{ color: 'var(--gogo-secondary)' }}>CAFE</span>
            </h1>
            <p className="mt-3 text-gray-600">เลือกผู้ใช้เพื่อจำลองการเข้าสู่ระบบ — ใช้สำหรับการพัฒนาและทดสอบ UI</p>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {roles.map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm transition-colors ${
                  roleFilter === r ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>เคล็ดลับ: คลิกที่บัตรผู้ใช้เพื่อเลือก แล้วกด &quot;เข้าสู่ระบบ&quot; หรือกดปุ่มเข้าสู่ระบบตรงบัตรเพื่อเข้าสู่ระบบทันที</p>
          </div>

          <div className="mt-6">
            <img src="/images/next.svg" alt="logo" className="w-32 opacity-60" />
          </div>
        </div>

        {/* Right: user list + actions */}
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">ผู้ใช้จำลอง (Mock Users)</h2>
            <div className="text-sm text-gray-500">รวม {filteredUsers.length} ผู้ใช้</div>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
            {filteredUsers.map(u => {
              const selected = selectedUserId === u.id;
              const initials = `${u.first_name?.[0] ?? ''}${u.last_name?.[0] ?? ''}`.toUpperCase();
              return (
                <div
                  key={u.id}
                  onClick={() => setSelectedUserId(u.id)}
                  className={`flex items-center justify-between gap-4 p-3 rounded-lg transition-shadow cursor-pointer ${
                    selected ? 'bg-yellow-50 shadow-inner border border-yellow-200' : 'hover:shadow-sm hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center text-xl font-bold text-white">
                      {initials}
                    </div>
                    <div>
                      <div className="font-medium">{u.first_name} {u.last_name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{u.phone_number ?? '—'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-sm px-2 py-1 rounded-full text-white font-semibold" style={{ background: u.role_id.name === 'Customer' ? 'linear-gradient(90deg,#34D399,#06B6D4)' : u.role_id.name === 'Barista' ? 'linear-gradient(90deg,#F59E0B,#F97316)' : 'linear-gradient(90deg,#7C3AED,#C084FC)' }}>
                      {u.role_id.name}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleLogin(u.id); }}
                      className="px-3 py-1 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                    >
                      เข้าสู่ระบบ
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t pt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">เลือกแล้ว: <span className="font-medium">{selectedUserId ? `${users.find(u=>u.id===selectedUserId)?.first_name ?? ''} ${users.find(u=>u.id===selectedUserId)?.last_name ?? ''}` : 'ยังไม่ได้เลือก'}</span></div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setSelectedUserId(null); setRoleFilter('All'); }}
                className="px-3 py-1 rounded-md border text-sm"
              >
                รีเซ็ต
              </button>

              <button
                onClick={() => handleLogin()}
                disabled={!selectedUserId}
                className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white disabled:opacity-50"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-400">หมายเหตุ: นี่เป็น mock-login สำหรับการพัฒนาเท่านั้น — ไม่มีการยืนยันรหัสผ่าน</div>
        </div>
      </div>
    </div>
  );
}
