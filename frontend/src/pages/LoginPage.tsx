import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { apiFetch } from '../lib/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@edumerge.local');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
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
            <input onChange={(event) => setEmail(event.target.value)} value={email} />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </div>
          {error ? <div className="error">{error}</div> : null}
          <button className="btn" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}