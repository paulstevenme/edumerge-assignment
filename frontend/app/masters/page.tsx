"use client";

import { FormEvent, useEffect, useState } from "react";
import Protected from "../../components/Protected";
import { getStoredUser, hasRole } from "../../lib/auth";
import { apiFetch } from "../../lib/api";

const initialForm = {
  institution: "EduMerge",
  campus: "Main Campus",
  department: "Computer Science",
  academicYear: "2026-2027",
  courseType: "UG",
  entryType: "Regular",
  admissionMode: "Government",
};

export default function MastersPage() {
  const [form, setForm] = useState<any>(initialForm);
  const [masters, setMasters] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [canEdit, setCanEdit] = useState(false);

  const loadMasters = () =>
    apiFetch("/masters")
      .then(setMasters)
      .catch((err) => setError(err.message));
  useEffect(() => {
    setCanEdit(hasRole(getStoredUser(), ["ADMIN"]));
    loadMasters();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await apiFetch("/masters", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setMessage("Master setup saved");
      loadMasters();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <Protected>
      <div className="container grid">
        <h1>Master Setup</h1>
        {canEdit ? (
          <div className="card">
            <form className="grid grid-2" onSubmit={handleSubmit}>
              {["institution", "campus", "department", "academicYear"].map(
                (key) => (
                  <div className="field" key={key}>
                    <label>{key}</label>
                    <input
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                    />
                  </div>
                ),
              )}
              <div className="field">
                <label>Course Type</label>
                <select
                  value={form.courseType}
                  onChange={(e) =>
                    setForm({ ...form, courseType: e.target.value })
                  }
                >
                  <option>UG</option>
                  <option>PG</option>
                </select>
              </div>
              <div className="field">
                <label>Entry Type</label>
                <select
                  value={form.entryType}
                  onChange={(e) =>
                    setForm({ ...form, entryType: e.target.value })
                  }
                >
                  <option>Regular</option>
                  <option>Lateral</option>
                </select>
              </div>
              <div className="field">
                <label>Admission Mode</label>
                <select
                  value={form.admissionMode}
                  onChange={(e) =>
                    setForm({ ...form, admissionMode: e.target.value })
                  }
                >
                  <option>Government</option>
                  <option>Management</option>
                </select>
              </div>
              {message ? <div className="success">{message}</div> : null}
              {error ? <div className="error">{error}</div> : null}
              <div>
                <button className="btn" type="submit">
                  Save Master
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="card">
            Only Admin can set up masters. Your role has read-only access here.
          </div>
        )}
        <div className="card">
          <h3>Saved Master Records</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Institution</th>
                <th>Campus</th>
                <th>Department</th>
                <th>Year</th>
                <th>Mode</th>
              </tr>
            </thead>
            <tbody>
              {masters.map((item) => (
                <tr key={item._id}>
                  <td>{item.institution}</td>
                  <td>{item.campus}</td>
                  <td>{item.department}</td>
                  <td>{item.academicYear}</td>
                  <td>{item.admissionMode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Protected>
  );
}
