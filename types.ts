
export type PaymentStatus = 'Paid' | 'Due' | 'Processing';

export interface Transaction {
  id: string;
  paymentId: string;
  transactionId: string;
  gateway: 'UPI' | 'Razorpay' | 'Cash';
  date: string;
}

export interface Payment {
  id: string;
  studentId: string;
  month: string;
  year: number;
  amount: number;
  status: PaymentStatus;
  paymentDate?: string;
  transactionId?: string;
}

export interface Student {
  id: string;
  name: string;
  fatherName: string;
  mobile: string;
  email: string;
  aadhaar: string;
  address: string;
  roomNumber: number;
  bedNumber: number;
  joiningDate: string;
  monthlyRent: number;
  photo?: string;
}

export type UserRole = 'admin' | 'student';

export type ViewType = 'dashboard' | 'students' | 'rooms' | 'rent' | 'my-profile';
