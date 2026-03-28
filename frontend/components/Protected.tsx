'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    else setReady(true);
  }, [router]);

  if (!ready) return <div className="container">Loading...</div>;
  return <>{children}</>;
}
