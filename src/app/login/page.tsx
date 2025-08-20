"use client";
import { useState, useTransition, useCallback } from "react";
import { users, roles } from "@/shared/utils/mock-data";
import { useRouter } from "next/navigation";
import { Button } from "antd";

export default function LoginPage() {
  const router = useRouter();
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();

  const filtered = roleFilter === "ALL" ? users : users.filter(u => u.role_id.name.toLowerCase() === roleFilter.toLowerCase());

  const handleLogin = useCallback((id: number) => {
    startTransition(() => {
      document.cookie = `userId=${id}; path=/`;
      document.cookie = `role=${users.find(u=>u.id===id)?.role_id.name}; path=/`;
      const roleName = users.find(u=>u.id===id)?.role_id.name;
      if (roleName === 'Barista') router.push('/barista'); else router.push('/');
    });
  }, [router, startTransition]);

  const handleRoleFilter = useCallback((role: string) => {
    setRoleFilter(role);
  }, []);

  const handleLoginClick = useCallback((id: number) => {
    handleLogin(id);
  }, [handleLogin]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-bold mb-6 text-center"><span style={{color:"var(--gogo-primary)"}}>GOGO</span> <span style={{color:"var(--gogo-secondary)"}}>CAFE</span></h1>
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">เข้าสู่ระบบ</h2>
        <div className="flex gap-2 flex-wrap justify-center mb-6">
          <Button onClick={() => handleRoleFilter('ALL')} type={roleFilter==='ALL' ? 'primary' : 'default'} className="rounded-full text-sm border">ทั้งหมด</Button>
          {roles.map(r => (
            <Button key={r.id} onClick={() => handleRoleFilter(r.name)} type={roleFilter===r.name ? 'primary' : 'default'} className="rounded-full text-sm border">{r.name}</Button>
          ))}
        </div>
        <ul className="divide-y divide-gray-200 mb-6">
          {filtered.map(u => (
            <li key={u.id} className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{u.first_name} {u.last_name}</p>
                <p className="text-xs text-gray-500">ตำแหน่ง: {u.role_id.name}</p>
              </div>
              <Button disabled={isPending} onClick={() => handleLoginClick(u.id)} type="primary" className="rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-sm disabled:opacity-50">เข้าสู่ระบบ</Button>
            </li>
          ))}
        </ul>
        <p className="text-center text-xs text-gray-400">ระบบจำลองการเข้าสู่ระบบ - เลือกผู้ใช้เพื่อจำลองเซสชัน (cookie)</p>
      </div>
    </div>
  );
}
