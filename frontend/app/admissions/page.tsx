'use client';

import { FormEvent, useEffect, useState } from 'react';
import Protected from '../../components/Protected';
import { apiFetch } from '../../lib/api';

export default function AdmissionsPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [form, setForm] = useState({ applicantId: '', programId: '', quotaType: 'KCET', allotmentNumber: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadAll = async () => {
    try {
      const [applicantData, programData, admissionData] = await Promise.all([
        apiFetch('/applicants'),
        apiFetch('/programs'),
        apiFetch('/admissions'),
      ]);
      setApplicants(applicantData);
      setPrograms(programData);
      setAdmissions(admissionData);
      if (applicantData[0] && !form.applicantId) setForm((prev) => ({ ...prev, applicantId: applicantData[0]._id }));
      if (programData[0] && !form.programId) setForm((prev) => ({ ...prev, programId: programData[0]._id }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    }
  };

  useEffect(() => { loadAll(); }, []);

  const handleAllocate = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await apiFetch('/admissions/allocate', { method: 'POST', body: JSON.stringify(form) });
      setMessage('Seat allocated and locked');
      loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Allocation failed');
    }
  };

  const confirmAdmission = async (applicantId: string) => {
    try {
      const data = await apiFetch(`/admissions/confirm/${applicantId}`, { method: 'POST' });
      setMessage(`Admission confirmed: ${data.admissionNumber}`);
      loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Confirmation failed');
    }
  };

  return (
    <Protected>
      <div className="container grid">
        <h1>Admissions</h1>
        <div className="card">
          <h3>Seat Allocation</h3>
          <form className="grid grid-2" onSubmit={handleAllocate}>
            <div className="field">
              <label>Applicant</label>
              <select value={form.applicantId} onChange={(e) => setForm({ ...form, applicantId: e.target.value })}>
                {applicants.filter((item) => item.admissionStatus === 'APPLIED').map((item) => (
                  <option key={item._id} value={item._id}>{item.firstName} {item.lastName}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Program</label>
              <select value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value })}>
                {programs.map((item) => (
                  <option key={item._id} value={item._id}>{item.programName}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Quota</label>
              <select value={form.quotaType} onChange={(e) => setForm({ ...form, quotaType: e.target.value })}>
                <option>KCET</option><option>COMEDK</option><option>Management</option>
              </select>
            </div>
            <div className="field">
              <label>Allotment Number</label>
              <input value={form.allotmentNumber} onChange={(e) => setForm({ ...form, allotmentNumber: e.target.value })} />
            </div>
            {message ? <div className="success">{message}</div> : null}
            {error ? <div className="error">{error}</div> : null}
            <div><button className="btn" type="submit">Allocate Seat</button></div>
          </form>
        </div>

        <div className="card">
          <h3>Admission Records</h3>
          <table className="table">
            <thead><tr><th>Applicant</th><th>Program</th><th>Quota</th><th>Seat Locked</th><th>Admission No</th><th>Action</th></tr></thead>
            <tbody>
              {admissions.map((item) => (
                <tr key={item._id}>
                  <td>{item.applicantId?.firstName} {item.applicantId?.lastName}</td>
                  <td>{item.programId?.programName}</td>
                  <td>{item.quotaType}</td>
                  <td>{item.seatLocked ? 'Yes' : 'No'}</td>
                  <td>{item.admissionNumber || '-'}</td>
                  <td>
                    {!item.admissionNumber ? (
                      <button className="btn" onClick={() => confirmAdmission(item.applicantId?._id)}>Confirm Admission</button>
                    ) : 'Confirmed'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Protected>
  );
}
