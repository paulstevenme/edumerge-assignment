export type Role = "ADMIN" | "ADMISSION_OFFICER" | "MANAGEMENT";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
