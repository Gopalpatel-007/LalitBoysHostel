
import React from 'react';
import { Student, Payment } from '../types';

interface StudentDashboardProps {
  student: Student;
  payments: Payment[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, payments }) => {
  const myPayments = payments.filter(p => p.studentId === student.id);

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Student Profile Header */}
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#a6192e]/5 rounded-bl-full -mr-20 -mt-20"></div>
        
        <div className="h-44 w-44 rounded-2xl bg-white border-4 border-slate-50 shadow-2xl overflow-hidden flex-shrink-0 z-10">
          {student.photo ? (
            <img src={student.photo} className="w-full h-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-5xl font-black text-slate-100 bg-slate-50">
              {student.name[0]}
            </div>
          )}
        </div>
        
        <div className="text-center md:text-left space-y-4 z-10 flex-1">
          <div>
            <p className="text-[10px] font-black text-[#a6192e] uppercase tracking-[0.3em] mb-1">Official Student Profile</p>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight uppercase leading-none">{student.name}</h2>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
             <div className="px-5 py-3 bg-[#a6192e] rounded-lg shadow-xl shadow-[#a6192e]/20">
               <p className="text-[8px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">Room Allocation</p>
               <p className="text-xs font-black text-white uppercase tracking-widest">RM {student.roomNumber} • Bed {student.bedNumber}</p>
             </div>
             <div className="px-5 py-3 bg-white border border-slate-200 rounded-lg">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Enrollment Date</p>
               <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{student.joiningDate}</p>
             </div>
             <div className="px-5 py-3 bg-[#f2a900] rounded-lg shadow-xl shadow-[#f2a900]/20">
               <p className="text-[8px] font-black text-black/40 uppercase tracking-widest leading-none mb-1">Monthly Rent</p>
               <p className="text-xs font-black text-slate-900 uppercase tracking-widest">₹{student.monthlyRent.toLocaleString()}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         {/* Hostel Info */}
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">Hostel Details</h4>
            <div className="space-y-6">
               <div className="flex items-start gap-5">
                  <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[#a6192e] text-lg shadow-inner"><i className="fas fa-map-marked-alt"></i></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Campus Address</p>
                    <p className="text-sm font-bold text-slate-700">Lalit Boys Hostel, Narendi, near Lucknow Airport, UP</p>
                  </div>
               </div>
               <div className="flex items-start gap-5">
                  <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[#f2a900] text-lg shadow-inner"><i className="fas fa-headset"></i></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Warden Support</p>
                    <p className="text-sm font-bold text-slate-700">Internal Helpline: +91 999 000 1111</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Personal Records */}
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">Student Identification</h4>
            <div className="space-y-6">
               <div className="flex items-center justify-between group">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aadhaar Reference</span>
                  <span className="text-sm font-black text-slate-800 tracking-tighter">{student.aadhaar}</span>
               </div>
               <div className="flex items-center justify-between group">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</span>
                  <span className="text-sm font-black text-slate-800 tracking-tighter">{student.mobile}</span>
               </div>
               <div className="flex items-center justify-between group">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email ID</span>
                  <span className="text-sm font-bold text-[#a6192e] lowercase">{student.email}</span>
               </div>
            </div>
         </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Rent Payment Ledger</h4>
          <div className="h-6 w-1 bg-[#f2a900]"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Month/Year</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Paid</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {myPayments.length > 0 ? myPayments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-10 py-5 text-sm font-black text-slate-700 uppercase tracking-tight">{p.month} {p.year}</td>
                  <td className="px-10 py-5 text-sm font-black text-slate-800">₹{p.amount.toLocaleString()}</td>
                  <td className="px-10 py-5">
                    <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-[0.2em] ${
                      p.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-[#a6192e]'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-10 py-5 text-right text-[10px] font-mono font-bold text-slate-300">{p.transactionId || '---'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center">
                    <i className="fas fa-file-invoice text-slate-100 text-6xl mb-4"></i>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No fee payment history found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Add default export to fix import error in App.tsx
export default StudentDashboard;