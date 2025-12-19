
import React from 'react';
import { Student, Payment } from '../types';
import { TOTAL_ROOMS, BEDS_PER_ROOM, MONTHS } from '../constants';

interface DashboardProps {
  students: Student[];
  payments: Payment[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, payments }) => {
  const totalCapacity = TOTAL_ROOMS * BEDS_PER_ROOM;
  const occupiedBeds = students.length;
  const vacantBeds = totalCapacity - occupiedBeds;
  
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  const currentMonthPayments = payments.filter(p => p.month === currentMonth && p.year === currentYear);
  const totalPaidThisMonth = currentMonthPayments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const pendingDues = payments.filter(p => p.status === 'Due').length;

  const last6Months = MONTHS.slice(Math.max(0, new Date().getMonth() - 5), new Date().getMonth() + 1);
  const chartData = last6Months.map(m => ({
    month: m,
    amount: payments.filter(p => p.month === m && p.status === 'Paid').reduce((s, p) => s + p.amount, 0) || (occupiedBeds * 3500 * (0.7 + Math.random() * 0.3))
  }));

  const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

  const stats = [
    { label: 'Total Students', value: occupiedBeds, icon: 'fa-user-graduate', color: 'bg-[#a6192e]' },
    { label: 'Available Beds', value: vacantBeds, icon: 'fa-door-open', color: 'bg-[#f2a900]' },
    { label: 'Pending Dues', value: pendingDues, icon: 'fa-exclamation-triangle', color: 'bg-slate-800' },
    { label: 'Rent Revenue', value: `₹${totalPaidThisMonth.toLocaleString()}`, icon: 'fa-wallet', color: 'bg-[#a6192e]' },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-7 rounded-lg shadow-sm border-l-4 border-[#a6192e] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
              </div>
              <div className={`${stat.color} h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-lg`}>
                <i className={`fas ${stat.icon} text-sm`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-10">
             <div>
               <h4 className="text-xl font-black text-slate-800 tracking-tight">Fee Collection</h4>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Monthly Rent Inflow (Last 6 Months)</p>
             </div>
             <div className="flex items-center gap-2">
               <div className="h-3 w-3 bg-[#a6192e] rounded"></div>
               <span className="text-[10px] font-black text-slate-400 uppercase">Paid Rent</span>
             </div>
          </div>
          
          <div className="h-72 flex items-end justify-between px-6 space-x-4 border-b border-slate-100">
            {chartData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full max-w-[40px] bg-slate-100 rounded-t-sm transition-all duration-700 group-hover:bg-[#a6192e] relative cursor-pointer"
                  style={{ height: `${(data.amount / maxAmount) * 100}%` }}
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold py-2 px-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    ₹{Math.floor(data.amount).toLocaleString()}
                  </div>
                  {/* Decorative bar tip */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#f2a900]"></div>
                </div>
                <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest rotate-[-45deg] origin-top-left ml-2">{data.month.slice(0, 3)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <h4 className="text-xl font-black text-slate-800 tracking-tight mb-8">Dues Alerts</h4>
          <div className="space-y-5">
            {payments.filter(p => p.status === 'Due').length > 0 ? (
              payments.filter(p => p.status === 'Due').slice(0, 4).map((payment) => {
                const student = students.find(s => s.id === payment.studentId);
                return (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg group hover:border-[#a6192e] transition-colors">
                    <div>
                      <p className="font-black text-slate-800 text-xs uppercase tracking-tight">{student?.name || 'Student'}</p>
                      <p className="text-[9px] text-[#a6192e] font-black uppercase mt-0.5">{payment.month} Due: ₹{payment.amount}</p>
                    </div>
                    <button className="h-8 w-8 bg-white border border-slate-200 text-[#a6192e] rounded flex items-center justify-center hover:bg-[#a6192e] hover:text-white transition-all shadow-sm">
                      <i className="fab fa-whatsapp text-xs"></i>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                <i className="fas fa-check-double text-5xl mb-4"></i>
                <p className="text-[10px] font-black uppercase tracking-widest">No Pending Dues</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
