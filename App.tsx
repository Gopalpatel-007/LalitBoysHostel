
import React, { useState, useEffect } from 'react';
import { ViewType, Student, Payment, UserRole } from './types';
import { storage } from './storage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import RoomManagement from './components/RoomManagement';
import RentManagement from './components/RentManagement';
import StudentDashboard from './components/StudentDashboard';
import Login from './components/Login';

const App: React.FC = () => {
  const [auth, setAuth] = useState<{ role: UserRole; id?: string } | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const savedAuth = storage.getAuth();
    if (savedAuth) setAuth(savedAuth);
    
    setStudents(storage.getStudents());
    setPayments(storage.getPayments());
  }, []);

  const handleLogin = (role: UserRole, id?: string) => {
    storage.setAuth(role, id);
    setAuth({ role, id });
    if (role === 'student') setCurrentView('my-profile');
  };

  const handleLogout = () => {
    storage.clearAuth();
    setAuth(null);
  };

  const handleAddStudent = (student: Student) => {
    const updated = [...students, student];
    setStudents(updated);
    storage.setStudents(updated);
  };

  const handleEditStudent = (updatedStudent: Student) => {
    const updated = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updated);
    storage.setStudents(updated);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Delete student record? All related payment data will be lost.')) {
      const updatedS = students.filter(s => s.id !== id);
      const updatedP = payments.filter(p => p.studentId !== id);
      setStudents(updatedS);
      setPayments(updatedP);
      storage.setStudents(updatedS);
      storage.setPayments(updatedP);
    }
  };

  const handlePayment = (payment: Payment) => {
    const updated = [...payments, payment];
    setPayments(updated);
    storage.setPayments(updated);
  };

  const handleUpdatePayment = (updatedPayment: Payment) => {
    const updated = payments.map(p => p.id === updatedPayment.id ? updatedPayment : p);
    setPayments(updated);
    storage.setPayments(updated);
  };

  if (!auth) {
    return <Login onLogin={handleLogin} />;
  }

  const studentUser = auth.role === 'student' ? students.find(s => s.mobile === auth.id) : null;

  const renderView = () => {
    if (auth.role === 'student') {
      return studentUser ? <StudentDashboard student={studentUser} payments={payments} /> : <div className="p-10 text-center font-bold">Profile not found for this mobile number.</div>;
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard students={students} payments={payments} />;
      case 'students': return <StudentManagement students={students} onAdd={handleAddStudent} onEdit={handleEditStudent} onDelete={handleDeleteStudent} />;
      case 'rooms': return <RoomManagement students={students} />;
      case 'rent': return <RentManagement students={students} payments={payments} onAddPayment={handlePayment} onUpdatePayment={handleUpdatePayment} />;
      default: return <Dashboard students={students} payments={payments} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView} onLogout={handleLogout} isAdmin={auth.role === 'admin'}>
      {renderView()}
    </Layout>
  );
};

export default App;
