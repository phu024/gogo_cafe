"use client";
import React, { useState } from 'react';
import { users } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import { Select, Button } from 'antd';
import 'antd/dist/reset.css';

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
      router.push('/customer/order');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-bold mb-6 text-center"><span style={{color:"var(--gogo-primary)"}}>GOGO</span> <span style={{color:"var(--gogo-secondary)"}}>CAFE</span></h1>
        <p className="text-center text-gray-600 mb-4">เลือกผู้ใช้เพื่อจำลองการเข้าสู่ระบบ (mock)</p>

        <div className="flex items-center gap-3">
          <Select
            className="w-full"
            placeholder="-- เลือกผู้ใช้ --"
            value={selectedUserId ?? undefined}
            onChange={(value) => setSelectedUserId(value)}
            options={users.map(u => ({
              label: `${u.first_name} ${u.last_name} — ${u.role_id.name}`,
              value: u.id
            }))}
            style={{ minWidth: 220 }}
          />
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            type="primary"
            onClick={handleLogin}
            disabled={!selectedUserId}
            style={{ background: '#facc15', borderColor: '#facc15', width: '100%' }}
          >
            เข้าสู่ระบบ
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-400 text-center">
          <p>หมายเหตุ: mock-login สำหรับการพัฒนาเท่านั้น</p>
        </div>
      </div>
    </div>
  );
}
