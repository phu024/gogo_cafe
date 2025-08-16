"use client";
import { useState, useTransition } from "react";
import { users, roles } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();

  const filtered = roleFilter === "ALL" ? users : users.filter(u => u.role_id.name.toLowerCase() === roleFilter.toLowerCase());

  const handleLogin = (id: number) => {
    startTransition(async () => {
      document.cookie = `userId=${id}; path=/`;
      document.cookie = `role=${users.find(u=>u.id===id)?.role_id.name}; path=/`;
      // Simple redirect logic: barista -> /barista else home
      const roleName = users.find(u=>u.id===id)?.role_id.name;
      if (roleName === 'Barista') router.push('/barista'); else router.push('/');
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-bold mb-6 text-center"><span style={{color:"var(--gogo-primary)"}}>GOGO</span> <span style={{color:"var(--gogo-secondary)"}}>Login</span></h1>
        <div className="flex gap-2 flex-wrap justify-center mb-6">
          <button onClick={()=>setRoleFilter('ALL')} className={`px-4 py-2 rounded-full text-sm border ${roleFilter==='ALL'?'bg-yellow-400 text-white border-yellow-400':'bg-white hover:bg-gray-50'}`}>ทั้งหมด</button>
          {roles.map(r => (
            <button key={r.id} onClick={()=>setRoleFilter(r.name)} className={`px-4 py-2 rounded-full text-sm border ${roleFilter===r.name?'bg-yellow-400 text-white border-yellow-400':'bg-white hover:bg-gray-50'}`}>{r.name}</button>
          ))}
        </div>
        <ul className="divide-y divide-gray-200 mb-6">
          {filtered.map(u => (
            <li key={u.id} className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{u.first_name} {u.last_name}</p>
                <p className="text-xs text-gray-500">Role: {u.role_id.name}</p>
              </div>
              <button disabled={isPending} onClick={()=>handleLogin(u.id)} className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-sm disabled:opacity-50">เลือก</button>
            </li>
          ))}
        </ul>
        <p className="text-center text-xs text-gray-400">Mock login เลือก user เพื่อจำลอง session (cookie)</p>
      </div>
    </div>
  );
}
