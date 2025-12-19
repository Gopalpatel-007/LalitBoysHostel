
import { Student, Payment, UserRole } from './types';

const STUDENTS_KEY = 'lbh_students';
const PAYMENTS_KEY = 'lbh_payments';
const AUTH_KEY = 'lbh_auth';

export const storage = {
  getStudents: (): Student[] => {
    const data = localStorage.getItem(STUDENTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  setStudents: (students: Student[]) => {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  },
  getPayments: (): Payment[] => {
    const data = localStorage.getItem(PAYMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  setPayments: (payments: Payment[]) => {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
  },
  getAuth: (): { role: UserRole; id?: string } | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },
  setAuth: (role: UserRole, id?: string) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ role, id }));
  },
  clearAuth: () => {
    localStorage.removeItem(AUTH_KEY);
  }
};
