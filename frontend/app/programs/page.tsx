'use client';

import { FormEvent, useEffect, useState } from 'react';
import Protected from '../../components/Protected';
import { apiFetch } from '../../lib/api';

const initialForm = {
  institution: 'EduMerge',
  campus: 'Main Campus',
  department: 'Computer Science',
  programName: 'B.E Computer Science',
  branchCode: 'CSE',
  academicYear: '2026-2027',
  courseType: 'UG',
  entryType: 'Regular',
  intake: 60,
  quotas: [
    { type: 'KCET', seats: 30 },
    { type: 'COMEDK', seats: 20 },
    { type: 'Management', seats: 10 },
  ],
  supernumerarySeats: 0,
};

export default function ProgramsPage() {
  const [form, setForm] = useState<any>(initialForm);
  const [programs, setPrograms] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchPrograms = () => apiFetch('/programs').then(setPrograms).catch((err) => setError(err.message));
  useEffect(() => { fetchPrograms(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await apiFetch('/programs', { method: 'POST', body: JSON.stringify(form) });
      setMessage('Program created successfully');
      setForm(initialForm);
      fetchPrograms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  };

  const updateQuota = (index: number, value: number) => {
    const next = [...form.quotas];
    next[index].seats = value;
    setForm({ ...form, quotas: next });
  };

  return (
    <Protected>
      <div className="container grid">
        <h1>Program Setup</h1>
        <div className="card">
          <form className="grid grid-2" onSubmit={handleSubmit}>
            {['institution','campus','department','programName','branchCode','academicYear'].map((key) => (
              <div className="field" key={key}>
                <label>{key}</label>
                <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div className="field">
              <label>Course Type</label>
              <select value={form.courseType} onChange={(e) => setForm({ ...form, courseType: e.target.value })}>
                <option>UG</option><option>PG</option>
              </select>
            </div>
            <div className="field">
              <label>Entry Type</label>
              <select value={form.entryType} onChange={(e) => setForm({ ...form, entryType: e.target.value })}>
                <option>Regular</option><option>Lateral</option>
              </select>
            </div>
            <div className="field">
              <label>Intake</label>
              <input type="number" value={form.intake} onChange={(e) => setForm({ ...form, intake: Number(e.target.value) })} />
            </div>
            {form.quotas.map((quota: any, index: number) => (
              <div className="field" key={quota.type}>
                <label>{quota.type} Seats</label>
                <input type="number" value={quota.seats} onChange={(e) => updateQuota(index, Number(e.target.value))} />
              </div>
            ))}
            {message ? <div className="success">{message}</div> : null}
            {error ? <div className="error">{error}</div> : null}
            <div><button className="btn" type="submit">Save Program</button></div>
          </form>
        </div>

        <div className="card">
          <h3>Programs</h3>
          <table className="table">
            <thead><tr><th>Name</th><th>Intake</th><th>Quota Summary</th></tr></thead>
            <tbody>
              {programs.map((item) => (
                <tr key={item._id}>
                  <td>{item.programName}</td>
                  <td>{item.intake}</td>
                  <td>{item.quotas.map((q: any) => `${q.type}: ${q.filledSeats}/${q.seats}`).join(' | ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Protected>
  );
}
