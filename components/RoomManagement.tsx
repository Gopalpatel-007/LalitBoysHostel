
import React from 'react';
import { Student } from '../types';
import { TOTAL_ROOMS, BEDS_PER_ROOM } from '../constants';

interface RoomManagementProps {
  students: Student[];
}

const RoomManagement: React.FC<RoomManagementProps> = ({ students }) => {
  const rooms = Array.from({ length: TOTAL_ROOMS }, (_, i) => i + 1);
  const beds = Array.from({ length: BEDS_PER_ROOM }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {rooms.map((roomNum) => {
        const roomStudents = students.filter(s => s.roomNumber === roomNum);
        const occupancyRate = (roomStudents.length / BEDS_PER_ROOM) * 100;

        return (
          <div key={roomNum} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:border-[#a6192e] transition-all duration-300">
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex justify-between items-center group-hover:bg-[#a6192e]/5 transition-colors">
              <div>
                <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest">Executive Room {roomNum}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Campus Housing Division</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-[#f2a900] shadow-[0_0_8px_rgba(242,169,0,0.5)]"></div>
            </div>
            
            <div className="p-8 grid grid-cols-3 gap-5">
              {beds.map((bedNum) => {
                const student = roomStudents.find(s => s.bedNumber === bedNum);
                return (
                  <div key={bedNum} className="flex flex-col items-center">
                    <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-xl transition-all duration-300 ${
                      student 
                        ? 'bg-[#a6192e] text-white shadow-lg shadow-[#a6192e]/20 scale-105' 
                        : 'bg-slate-50 text-slate-200 border-2 border-dashed border-slate-100 hover:border-[#f2a900]/30 hover:bg-white'
                    }`}>
                      <i className={`fas ${student ? 'fa-user-tie' : 'fa-bed'}`}></i>
                    </div>
                    <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bed {bedNum}</p>
                    <p className={`text-[10px] text-center mt-1 font-bold uppercase truncate w-full ${student ? 'text-[#a6192e]' : 'text-slate-300'}`}>
                      {student ? student.name.split(' ')[0] : 'Vacant'}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#a6192e] transition-all duration-1000" 
                    style={{ width: `${occupancyRate}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-[10px] font-black text-[#a6192e] uppercase tracking-widest whitespace-nowrap">
                {roomStudents.length} / {BEDS_PER_ROOM} Occupied
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomManagement;
