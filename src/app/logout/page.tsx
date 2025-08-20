"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Call the API logout route which clears cookies and redirects
    fetch('/api/logout', { method: 'GET' })
      .then(() => {
        router.replace('/');
      })
      .catch(() => {
        router.replace('/');
      });
  }, [router]);

  return <div>กำลังออกจากระบบ...</div>;
}
