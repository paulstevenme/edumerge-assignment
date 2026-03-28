"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser, roleLabels, type Role } from "../lib/auth";

const navByRole: Record<Role, Array<{ href: string; label: string }>> = {
  ADMIN: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/masters", label: "Masters" },
    { href: "/programs", label: "Programs" },
  ],
  ADMISSION_OFFICER: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/applicants", label: "Applicants" },
    { href: "/admissions", label: "Admissions" },
    { href: "/programs", label: "Programs" },
    { href: "/masters", label: "Masters" },
  ],
  MANAGEMENT: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/masters", label: "Masters" },
    { href: "/programs", label: "Programs" },
    { href: "/applicants", label: "Applicants" },
    { href: "/admissions", label: "Admissions" },
  ],
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<Role | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setUserName(user.name);
      setUserRole(user.role);
    } else {
      setUserName("");
      setUserRole(null);
    }
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (pathname === "/login") return null;

  const links = userRole ? navByRole[userRole] : [];

  return (
    <div className="nav between">
      <div>
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex">
        <span>
          {userName}
          {userRole ? ` (${roleLabels[userRole]})` : ""}
        </span>
        <button className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
