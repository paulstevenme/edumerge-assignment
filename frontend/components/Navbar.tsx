'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) setUserName(JSON.parse(user).name);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (pathname === '/login') return null;

  return (
    <div className="nav between">
      <div>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/masters">Masters</Link>
        <Link href="/programs">Programs</Link>
        <Link href="/applicants">Applicants</Link>
        <Link href="/admissions">Admissions</Link>
      </div>
      <div className="flex">
        <span>{userName}</span>
        <button className="btn btn-secondary" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
