
import React from 'react';
import { ViewType } from '../types';

interface LayoutProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  children: React.ReactNode;
  onLogout: () => void;
  isAdmin: boolean;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children, onLogout, isAdmin }) => {
  const menuItems = isAdmin ? [
    { id: 'dashboard', label: 'Overview', icon: 'fa-chart-line' },
    { id: 'students', label: 'Students', icon: 'fa-user-graduate' },
    { id: 'rooms', label: 'Occupancy', icon: 'fa-th-large' },
    { id: 'rent', label: 'Fees & Rent', icon: 'fa-file-invoice-dollar' },
  ] : [
    { id: 'my-profile', label: 'My Dashboard', icon: 'fa-user-circle' }
  ];

  return (
    <div className="flex h-screen bg-[#f4f5f7] font-sans">
      {/* Sidebar - Deep Burgundy */}
      <aside className="w-64 bg-[#a6192e] text-white flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-white/10">
          <div className="h-14 w-14 bg-white rounded-xl flex items-center justify-center mb-4 shadow-xl">
             <i className="fas fa-hotel text-[#a6192e] text-2xl"></i>
          </div>
          <h1 className="text-xl font-black tracking-tight leading-none uppercase">LALIT HOSTEL</h1>
          <p className="text-white/60 text-[10px] font-bold mt-1 uppercase tracking-[0.2em]">Student Management</p>
        </div>

        <nav className="flex-1 mt-8 px-4 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewType)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 relative group ${
                currentView === item.id 
                  ? 'bg-white/10 text-[#f2a900]' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {currentView === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#f2a900] rounded-r-full"></div>
              )}
              <i className={`fas ${item.icon} w-6 text-sm`}></i>
              <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <button onClick={onLogout} className="w-full flex items-center px-4 py-4 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
            <i className="fas fa-sign-out-alt w-6 text-sm"></i>
            <span className="font-bold text-xs uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shadow-sm z-10">
          <div className="flex items-center gap-4">
             <div className="h-8 w-1 bg-[#a6192e]"></div>
             <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
               {currentView.replace('-', ' ')}
             </h2>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-[#a6192e] uppercase tracking-tighter">System Access</span>
              <span className="text-xs font-bold text-slate-500">{isAdmin ? 'Administrator' : 'Student Portal'}</span>
            </div>
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-[#a6192e] font-black text-lg border-2 border-white shadow-md">
              {isAdmin ? 'A' : 'S'}
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </section>
        
        <footer className="h-10 bg-white border-t border-slate-200 px-10 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <span>&copy; 2024 Lalit Boys Hostel</span>
          <span className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> System Operational
          </span>
        </footer>
      </main>
    </div>
  );
};

// Add default export to fix import error in App.tsx
export default Layout;