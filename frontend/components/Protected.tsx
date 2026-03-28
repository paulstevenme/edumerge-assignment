"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser, hasRole, type Role } from "../lib/auth";

export default function Protected({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Role[];
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = getStoredUser();

    if (!token || !user) {
      router.push("/login");
      return;
    }

    if (allowedRoles?.length && !hasRole(user, allowedRoles)) {
      setAllowed(false);
    }

    setReady(true);
  }, [allowedRoles, router]);

  if (!ready) return <div className="container">Loading...</div>;

  if (!allowed) {
    return (
      <div className="container">
        You do not have permission to access this page.
      </div>
    );
  }

  return <>{children}</>;
}
