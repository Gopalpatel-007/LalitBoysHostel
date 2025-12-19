
import React, { useState } from 'react';
import { Student, Payment, PaymentStatus } from '../types';
import { MONTHS } from '../constants';

interface RentManagementProps {
  students: Student[];
  payments: Payment[];
  onAddPayment: (payment: Payment) => void;
  onUpdatePayment: (payment: Payment) => void;
}

const RentManagement: React.FC<RentManagementProps> = ({ students, payments, onAddPayment, onUpdatePayment }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [showStatusModal, setShowStatusModal] = useState<{payment?: Payment, studentId: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const studentsWithStatus = students.map(student => {
    const payment = payments.find(p => p.studentId === student.id && p.month === selectedMonth && p.year === selectedYear);
    return { ...student, payment };
  });

  const handleUpdateStatus = (studentId: string, status: PaymentStatus, amount: number, isOnline = false) => {
    if (isOnline) {
      setIsProcessing(true);
      setTimeout(() => {
        completePayment(studentId, status, amount, 'Online');
        setIsProcessing(false);
        setShowStatusModal(null);
      }, 2000);
    } else {
      completePayment(studentId, status, amount, 'Cash');
      setShowStatusModal(null);
    }
  };

  const completePayment = (studentId: string, status: PaymentStatus, amount: number, method: string) => {
    const existing = payments.find(p => p.studentId === studentId && p.month === selectedMonth && p.year === selectedYear);
    const txId = method === 'Online' ? 'TXN' + Math.random().toString(36).toUpperCase().substr(2, 10) : undefined;
    
    if (existing) {
      onUpdatePayment({ ...existing, status, amount, paymentDate: status === 'Paid' ? new Date().toISOString().split('T')[0] : undefined, transactionId: txId });
    } else {
      onAddPayment({
        id: Math.random().toString(36).substr(2, 9),
        studentId,
        month: selectedMonth,
        year: selectedYear,
        amount,
        status,
        paymentDate: status === 'Paid' ? new Date().toISOString().split('T')[0] : undefined,
        transactionId: txId
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Fee Ledger</h3>
          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mt-1">Hostel Billing: {selectedMonth} {selectedYear}</p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <select 
            className="flex-1 md:w-40 px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#a6192e]/20 focus:border-[#a6192e] outline-none text-xs font-black uppercase tracking-widest text-slate-950 cursor-pointer shadow-sm" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select 
            className="flex-1 md:w-32 px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#a6192e]/20 focus:border-[#a6192e] outline-none text-xs font-black uppercase tracking-widest text-slate-950 cursor-pointer shadow-sm" 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-8 py-5 text-[10px] font-black text-[#a6192e] uppercase tracking-[0.2em]">Student</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#a6192e] uppercase tracking-[0.2em]">Room Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#a6192e] uppercase tracking-[0.2em]">Monthly Fee</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#a6192e] uppercase tracking-[0.2em]">Fee Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#a6192e] uppercase tracking-[0.2em] text-right">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentsWithStatus.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 group transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-black text-slate-900 text-sm uppercase leading-none">{item.name}</p>
                    <p className="text-[10px] text-slate-700 font-bold uppercase tracking-tighter mt-1.5">{item.mobile}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">RM {item.roomNumber}</span>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-slate-950">₹{(item.payment?.amount || item.monthlyRent).toLocaleString()}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-widest ${
                      item.payment?.status === 'Paid' 
                        ? 'bg-green-100 text-green-900' 
                        : 'bg-[#a6192e]/10 text-[#a6192e]'
                    }`}>
                      {item.payment?.status || 'Due'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {item.payment?.transactionId ? (
                      <span className="text-[10px] font-mono font-bold text-slate-500">{item.payment.transactionId}</span>
                    ) : (
                      <button 
                        onClick={() => setShowStatusModal({ payment: item.payment, studentId: item.id })} 
                        className="h-9 px-4 bg-white border-2 border-slate-300 text-[#a6192e] rounded font-black text-[9px] uppercase tracking-widest hover:bg-[#a6192e] hover:text-white transition-all shadow-sm"
                      >
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 relative overflow-hidden border border-slate-200">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#a6192e]"></div>
            
            {isProcessing ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 border-4 border-[#f2a900] border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight">Verifying Fee Payment</h3>
                <p className="text-slate-700 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Connecting to Secure Gateway</p>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <h3 className="text-2xl font-black text-slate-950 tracking-tight uppercase">Fee Settlement</h3>
                  <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest mt-1">Hostel Fee Verification</p>
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => handleUpdateStatus(showStatusModal.studentId, 'Paid', students.find(s => s.id === showStatusModal.studentId)?.monthlyRent || 0, true)}
                    className="w-full py-5 px-8 rounded-xl bg-[#a6192e] text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#a6192e]/20 hover:bg-[#8a1524] transition-all flex items-center justify-between"
                  >
                    <span>Online Payment</span>
                    <i className="fas fa-credit-card text-[#f2a900]"></i>
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(showStatusModal.studentId, 'Paid', students.find(s => s.id === showStatusModal.studentId)?.monthlyRent || 0, false)}
                    className="w-full py-5 px-8 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-between"
                  >
                    <span>Cash Payment</span>
                    <i className="fas fa-hand-holding-usd text-[#f2a900]"></i>
                  </button>
                  <button onClick={() => setShowStatusModal(null)} className="w-full py-4 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:text-slate-950 transition-colors">Abort Transaction</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RentManagement;
