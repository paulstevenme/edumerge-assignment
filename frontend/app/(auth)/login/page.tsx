'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@edumerge.local');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 440, marginTop: 80 }}>
      <div className="card">
        <h1>Login</h1>
        <p>Use seeded demo credentials.</p>
        <form className="grid" onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error ? <div className="error">{error}</div> : null}
          <button className="btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
