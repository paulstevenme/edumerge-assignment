"use client";

import { FormEvent, useEffect, useState } from "react";
import Protected from "../../components/Protected";
import { getStoredUser, hasRole } from "../../lib/auth";
import { apiFetch } from "../../lib/api";

const initialForm = {
  firstName: "Rahul",
  lastName: "Kumar",
  gender: "Male",
  dob: "2007-06-10",
  mobile: "9876543210",
  email: "rahul@example.com",
  address: "MG Road",
  state: "Karnataka",
  city: "Bengaluru",
  pincode: "560001",
  category: "GM",
  qualifyingExam: "12th",
  marks: 87,
  entryType: "Regular",
  quotaType: "KCET",
  documentStatus: "Pending",
  feeStatus: "Pending",
};

export default function ApplicantsPage() {
  const [form, setForm] = useState<any>(initialForm);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [canManageApplicants, setCanManageApplicants] = useState(false);

  const fetchApplicants = () =>
    apiFetch("/applicants")
      .then(setApplicants)
      .catch((err) => setError(err.message));
  useEffect(() => {
    setCanManageApplicants(hasRole(getStoredUser(), ["ADMISSION_OFFICER"]));
    fetchApplicants();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await apiFetch("/applicants", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setMessage("Applicant created");
      setForm(initialForm);
      fetchApplicants();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  };

  const quickUpdate = async (id: string, payload: any) => {
    await apiFetch(`/applicants/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    fetchApplicants();
  };

  return (
    <Protected>
      <div className="container grid">
        <h1>Applicants</h1>
        {canManageApplicants ? (
          <div className="card">
            <form className="grid grid-3" onSubmit={handleSubmit}>
              {Object.keys(initialForm).map((key) => (
                <div className="field" key={key}>
                  <label>{key}</label>
                  {[
                    "gender",
                    "entryType",
                    "quotaType",
                    "documentStatus",
                    "feeStatus",
                  ].includes(key) ? (
                    <select
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                    >
                      {key === "gender" && (
                        <>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </>
                      )}
                      {key === "entryType" && (
                        <>
                          <option>Regular</option>
                          <option>Lateral</option>
                        </>
                      )}
                      {key === "quotaType" && (
                        <>
                          <option>KCET</option>
                          <option>COMEDK</option>
                          <option>Management</option>
                        </>
                      )}
                      {key === "documentStatus" && (
                        <>
                          <option>Pending</option>
                          <option>Submitted</option>
                          <option>Verified</option>
                        </>
                      )}
                      {key === "feeStatus" && (
                        <>
                          <option>Pending</option>
                          <option>Paid</option>
                        </>
                      )}
                    </select>
                  ) : (
                    <input
                      type={
                        key === "dob"
                          ? "date"
                          : key === "marks"
                            ? "number"
                            : "text"
                      }
                      value={form[key]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [key]:
                            key === "marks"
                              ? Number(e.target.value)
                              : e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}
              {message ? <div className="success">{message}</div> : null}
              {error ? <div className="error">{error}</div> : null}
              <div>
                <button className="btn" type="submit">
                  Create Applicant
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="card">
            Only Admission Officer can create applicants or update document and
            fee statuses. Your role has read-only access here.
          </div>
        )}

        <div className="card">
          <h3>Applicant List</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quota</th>
                <th>Docs</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.firstName} {item.lastName}
                  </td>
                  <td>{item.quotaType}</td>
                  <td>{item.documentStatus}</td>
                  <td>{item.feeStatus}</td>
                  <td>{item.admissionStatus}</td>
                  <td>
                    {canManageApplicants ? (
                      <div className="flex">
                        <button
                          className="btn"
                          onClick={() =>
                            quickUpdate(item._id, {
                              documentStatus: "Verified",
                            })
                          }
                        >
                          Verify Docs
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() =>
                            quickUpdate(item._id, { feeStatus: "Paid" })
                          }
                        >
                          Mark Fee Paid
                        </button>
                      </div>
                    ) : (
                      "View Only"
                    )}
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
