import { useEffect, useState } from 'react';

import Protected from '../components/Protected';
import { apiFetch } from '../lib/api';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/dashboard').then(setData).catch((err) => setError(err.message));
  }, []);

  return (
    <Protected>
      <div className="container grid">
        <h1>Dashboard</h1>
        {error ? <div className="error">{error}</div> : null}
        {data ? (
          <>
            <div className="grid grid-3">
              <div className="card">
                <h3>Total Intake</h3>
                <p>{data.summary.totalIntake}</p>
              </div>
              <div className="card">
                <h3>Total Admitted</h3>
                <p>{data.summary.totalAdmitted}</p>
              </div>
              <div className="card">
                <h3>Remaining Seats</h3>
                <p>{data.summary.remainingSeats}</p>
              </div>
            </div>

            <div className="card">
              <h3>Quota-wise Seat Status</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>Quota</th>
                    <th>Total</th>
                    <th>Filled</th>
                    <th>Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {data.quotaWise.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{item.program}</td>
                      <td>{item.quota}</td>
                      <td>{item.total}</td>
                      <td>{item.filled}</td>
                      <td>{item.remaining}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-2">
              <div className="card">
                <h3>Pending Documents</h3>
                <ul>
                  {data.pendingDocuments.map((item: any) => (
                    <li key={item._id}>
                      {item.firstName} {item.lastName}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card">
                <h3>Fee Pending</h3>
                <ul>
                  {data.feePending.map((item: any) => (
                    <li key={item._id}>
                      {item.firstName} {item.lastName}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div>Loading dashboard...</div>
        )}
      </div>
    </Protected>
  );
}