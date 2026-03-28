export type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'ADMISSION_OFFICER' | 'MANAGEMENT';
};
