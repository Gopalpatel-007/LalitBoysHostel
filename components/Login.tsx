
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole, id?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'admin') {
      if (username === 'admin' && password === 'admin123') {
        onLogin('admin');
      } else {
        setError('Unauthorized: Admin credentials invalid.');
      }
    } else {
      onLogin('student', username); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f5f7] px-4 font-sans relative overflow-hidden">
      {/* Decorative corporate background elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-full bg-[#a6192e] skew-x-[-15deg] translate-x-32 shadow-2xl opacity-10 md:opacity-100"></div>
      
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden z-10 border border-slate-200">
        
        {/* Brand Side */}
        <div className="bg-[#a6192e] p-12 flex flex-col justify-between relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#f2a900]/10 rounded-bl-full"></div>
           <div>
              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-2xl">
                 <i className="fas fa-hotel text-[#a6192e] text-3xl"></i>
              </div>
              <h2 className="text-4xl font-black text-white leading-tight tracking-tight">LALIT HOSTEL<br/><span className="text-[#f2a900]">MANAGEMENT</span></h2>
              <p className="mt-6 text-white/60 font-bold uppercase tracking-widest text-[10px] max-w-xs">Professional Student Accommodation Management System for Lalit Boys Hostel.</p>
           </div>
           <div className="mt-20">
              <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">Official Access Portal</p>
           </div>
        </div>

        {/* Login Side */}
        <div className="p-12 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10">
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">Portal Access</h3>
             <p className="text-slate-700 text-xs font-bold uppercase tracking-widest mt-2">Narendi Campus, Lucknow</p>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-xl mb-10 border-2 border-slate-200">
            <button onClick={() => setRole('admin')} className={`flex-1 py-3 rounded-lg text-[10px] font-black tracking-widest transition-all ${role === 'admin' ? 'bg-[#a6192e] text-white shadow-lg shadow-[#a6192e]/20' : 'text-slate-600 hover:text-slate-900'}`}>ADMIN</button>
            <button onClick={() => setRole('student')} className={`flex-1 py-3 rounded-lg text-[10px] font-black tracking-widest transition-all ${role === 'student' ? 'bg-[#a6192e] text-white shadow-lg shadow-[#a6192e]/20' : 'text-slate-600 hover:text-slate-900'}`}>STUDENT</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-[10px] font-black border-2 border-red-200 uppercase tracking-widest">{error}</div>}
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Identity Access</label>
                <input required className="w-full px-5 py-4 bg-white border-2 border-slate-300 rounded-xl focus:bg-white focus:border-[#a6192e] focus:ring-2 focus:ring-[#a6192e]/10 outline-none font-bold text-slate-950 transition-all text-sm placeholder:text-slate-500" placeholder={role === 'admin' ? "Enter Admin ID" : "Enter Mobile Number"} value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              {role === 'admin' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Security Key</label>
                  <input required type="password" className="w-full px-5 py-4 bg-white border-2 border-slate-300 rounded-xl focus:bg-white focus:border-[#a6192e] focus:ring-2 focus:ring-[#a6192e]/10 outline-none font-bold text-slate-950 transition-all text-sm placeholder:text-slate-500" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              )}
            </div>

            <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all active:scale-95 mt-6 border-b-4 border-slate-700">Initialize Session</button>
          </form>
          
          <div className="mt-12 text-center">
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Authorized Use Only • Secure Link Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
