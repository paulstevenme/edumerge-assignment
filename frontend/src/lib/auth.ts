import type { User } from "../types";

export type Role = User["role"];

export const roleLabels: Record<Role, string> = {
  ADMIN: "Admin",
  ADMISSION_OFFICER: "Admission Officer",
  MANAGEMENT: "Management",
};

export function getStoredUser(): User | null {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    return null;
  }
}

export function hasRole(user: User | null, roles: Role[]) {
  return Boolean(user && roles.includes(user.role));
}
