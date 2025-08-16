"use client";
import React, { useState } from 'react';
import { users } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleLogin = () => {
    if (!selectedUserId) return;
    const user = users.find(u => u.id === selectedUserId);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-bold mb-6 text-center"><span style={{color:"var(--gogo-primary)"}}>GOGO</span> <span style={{color:"var(--gogo-secondary)"}}>CAFE</span></h1>
        <p className="text-center text-gray-600 mb-4">เลือกผู้ใช้เพื่อจำลองการเข้าสู่ระบบ (mock)</p>

        <div className="flex items-center gap-3">
          <select
            value={selectedUserId ?? ''}
            onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
            className="flex-1 border rounded-md px-3 py-2"
          >
            <option value="">-- เลือกผู้ใช้ --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.first_name} {u.last_name} — {u.role_id.name}</option>
            ))}
          </select>

          <button
            onClick={handleLogin}
            className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white disabled:opacity-50"
            disabled={!selectedUserId}
          >
            เข้าสู่ระบบ
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-400 text-center">
          <p>หมายเหตุ: นี่เป็น mock-login สำหรับการพัฒนาเท่านั้น</p>
        </div>
      </div>
    </div>
  );
}
