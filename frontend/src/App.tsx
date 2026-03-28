import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Protected from "./components/Protected";
import AdmissionsPage from "./pages/AdmissionsPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import MastersPage from "./pages/MastersPage";
import ProgramsPage from "./pages/ProgramsPage";

function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/masters" element={<MastersPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/applicants" element={<ApplicantsPage />} />
        <Route path="/admissions" element={<AdmissionsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
