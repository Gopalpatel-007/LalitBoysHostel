
import React, { useState, useRef, useEffect } from 'react';
import { Student } from '../types';
import { TOTAL_ROOMS, BEDS_PER_ROOM, DEFAULT_RENT } from '../constants';

interface StudentManagementProps {
  students: Student[];
  onAdd: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ students, onAdd, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [showIdCard, setShowIdCard] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.roomNumber.toString() === searchTerm ||
    s.mobile.includes(searchTerm)
  );

  const initialFormData: Omit<Student, 'id'> = {
    name: '',
    fatherName: '',
    mobile: '',
    email: '',
    aadhaar: '',
    address: '',
    roomNumber: 1,
    bedNumber: 1,
    joiningDate: new Date().toISOString().split('T')[0],
    monthlyRent: DEFAULT_RENT,
    photo: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  // Helper to find occupied beds in a specific room (excluding current editing student)
  const getOccupiedBeds = (roomNum: number) => {
    return students
      .filter(s => s.roomNumber === roomNum && s.id !== editingStudent?.id)
      .map(s => s.bedNumber);
  };

  // Logic to handle room change and auto-adjust bed if occupied
  const handleRoomChange = (roomNum: number) => {
    const occupied = getOccupiedBeds(roomNum);
    let newBed = formData.bedNumber;
    
    // If current bed is occupied in new room, find first available
    if (occupied.includes(newBed)) {
      const available = Array.from({ length: BEDS_PER_ROOM }, (_, i) => i + 1)
        .find(b => !occupied.includes(b));
      newBed = available || 1; // Fallback to 1 if room is full (though validation should prevent this)
    }
    
    setFormData({ ...formData, roomNumber: roomNum, bedNumber: newBed });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final check for double booking
    const occupied = getOccupiedBeds(formData.roomNumber);
    if (occupied.includes(formData.bedNumber)) {
      alert(`Bed ${formData.bedNumber} in Room ${formData.roomNumber} is already occupied. Please select another bed.`);
      return;
    }

    if (editingStudent) {
      onEdit({ ...formData, id: editingStudent.id } as Student);
    } else {
      onAdd({ ...formData, id: Math.random().toString(36).substr(2, 9) } as Student);
    }
    setShowModal(false);
    setEditingStudent(null);
    setFormData(initialFormData);
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setShowModal(true);
  };

  const handlePrintIdCard = () => {
    window.print();
  };

  const occupiedBedsInCurrentRoom = getOccupiedBeds(formData.roomNumber);

  return (
    <div className="space-y-8">
      <style>{`
        @media print {
          @page {
            size: 3.375in 2.125in;
            margin: 0;
          }
          html, body {
            height: 2.125in;
            width: 3.375in;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden !important;
          }
          #id-card-printable, #id-card-printable * {
            visibility: visible !important;
          }
          #id-card-printable {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 3.375in !important;
            height: 2.125in !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="relative w-full md:w-96">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm"></i>
          <input 
            type="text" 
            placeholder="Search students by name, mobile or room..." 
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#a6192e]/20 focus:border-[#a6192e] outline-none text-sm font-semibold text-slate-950 placeholder:text-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setEditingStudent(null); setFormData(initialFormData); setShowModal(true); }}
          className="w-full md:w-auto bg-[#a6192e] hover:bg-[#8a1524] text-white px-8 py-3 rounded-lg font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#a6192e]/20 flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus"></i> New Student
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-8 py-5 text-[10px] font-black text-[#a6192e] uppercase tracking-[0.2em]">Student Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#a6192e] uppercase tracking-[0.2em]">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#a6192e] uppercase tracking-[0.2em]">Room Allocation</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#a6192e] uppercase tracking-[0.2em]">Rent (Monthly)</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#a6192e] uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden shadow-inner flex-shrink-0">
                        {student.photo ? <img src={student.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-slate-500">{student.name[0]}</div>}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm uppercase leading-tight">{student.name}</p>
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter mt-1">Aadhaar: {student.aadhaar || '---'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[11px] font-bold text-slate-700">
                    <p className="flex items-center gap-2 mb-1"><i className="fas fa-phone text-[#a6192e]"></i> {student.mobile}</p>
                    <p className="flex items-center gap-2 text-slate-500"><i className="fas fa-envelope text-[#f2a900]"></i> {student.email}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-[#a6192e] uppercase">Room {student.roomNumber}</span>
                       <span className="text-[11px] font-bold text-slate-600 uppercase">Bed No. {student.bedNumber}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-black text-slate-900">₹{student.monthlyRent.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Fixed Rate</p>
                  </td>
                  <td className="px-8 py-5 text-right space-x-2">
                    <button onClick={() => setShowIdCard(student)} className="h-9 w-9 text-slate-500 hover:text-[#f2a900] transition-colors rounded-lg hover:bg-slate-200" title="View ID Card"><i className="fas fa-id-card text-sm"></i></button>
                    <button onClick={() => handleEditClick(student)} className="h-9 w-9 text-slate-500 hover:text-[#a6192e] transition-colors rounded-lg hover:bg-slate-200" title="Edit Student"><i className="fas fa-edit text-sm"></i></button>
                    <button onClick={() => onDelete(student.id)} className="h-9 w-9 text-slate-500 hover:text-red-600 transition-colors rounded-lg hover:bg-slate-200" title="Delete Student"><i className="fas fa-trash text-sm"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ID Card Display Modal */}
      {showIdCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
          <div className="bg-white rounded-2xl p-10 max-w-xl w-full shadow-2xl relative overflow-hidden flex flex-col items-center">
             
             {/* CR80 Standard ID Card Container */}
             <div id="id-card-printable" className="bg-white border-[2px] border-slate-200 rounded-xl overflow-hidden w-[3.375in] h-[2.125in] shadow-2xl flex flex-col font-sans shrink-0 relative box-border">
                
                {/* Header Section */}
                <div className="bg-[#a6192e] text-white py-1.5 px-3 flex justify-between items-center h-[22%] relative">
                   <div className="flex items-center gap-1.5">
                      <div className="bg-white p-0.5 rounded shadow-sm">
                        <i className="fas fa-hotel text-[8px] text-[#a6192e]"></i>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider">Lalit Boys Hostel</span>
                   </div>
                   <div className="text-[6px] font-black bg-[#f2a900] text-[#a6192e] px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">Identity Card</div>
                </div>

                {/* Main Identity Body */}
                <div className="flex-1 flex px-3 py-2 gap-3 bg-white">
                  <div className="w-[30%] flex flex-col items-center">
                    <div className="w-[0.8in] h-[0.95in] rounded-sm border border-slate-200 overflow-hidden bg-slate-50 shadow-inner">
                      {showIdCard.photo ? (
                        <img src={showIdCard.photo} className="w-full h-full object-cover" alt="Student" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-200">
                          <i className="fas fa-user text-3xl"></i>
                        </div>
                      )}
                    </div>
                    <div className="mt-1 bg-[#a6192e] text-white text-[7px] font-black py-0.5 px-2 rounded uppercase tracking-widest w-full text-center">STUDENT</div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <p className="text-[6px] font-black text-slate-400 uppercase leading-none mb-0.5">Full Name</p>
                      <p className="text-[11px] font-black text-slate-900 uppercase leading-tight truncate">{showIdCard.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-1 mt-1">
                      <div>
                        <p className="text-[6px] font-black text-slate-400 uppercase leading-none mb-0.5">Room/Bed</p>
                        <p className="text-[9px] font-black text-[#a6192e] leading-none">{showIdCard.roomNumber} - {showIdCard.bedNumber}</p>
                      </div>
                      <div>
                        <p className="text-[6px] font-black text-slate-400 uppercase leading-none mb-0.5">Join Date</p>
                        <p className="text-[8px] font-bold text-slate-700 leading-none">{showIdCard.joiningDate}</p>
                      </div>
                    </div>

                    <div className="mt-1">
                      <p className="text-[6px] font-black text-slate-400 uppercase leading-none mb-0.5">Mobile Number</p>
                      <p className="text-[9px] font-bold text-slate-900 leading-none">{showIdCard.mobile}</p>
                    </div>

                    <div className="flex justify-between items-end mt-1">
                       <div className="flex flex-col">
                          <p className="text-[5px] font-black text-slate-300 uppercase leading-none">ID Ref</p>
                          <p className="text-[6px] font-mono font-bold text-slate-400 leading-none uppercase">{showIdCard.id.slice(0, 8)}</p>
                       </div>
                       <div className="text-center">
                          <div className="w-10 h-[0.5px] bg-slate-300 mx-auto mb-0.5"></div>
                          <p className="text-[4.5px] font-black text-slate-400 uppercase leading-none">Authorized Signatory</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border-t border-slate-100 px-3 py-1 flex justify-between items-center h-[16%]">
                   <p className="text-[6px] font-black text-slate-500 uppercase tracking-widest">Narendi, Lucknow • +91 999 000 1111</p>
                   <i className="fas fa-barcode text-slate-800 text-[14px] opacity-70"></i>
                </div>
             </div>

             <div className="mt-10 flex flex-col gap-3 w-full max-sm">
                <button 
                  onClick={handlePrintIdCard} 
                  className="w-full py-4 bg-[#a6192e] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#a6192e]/30 hover:bg-[#8a1524] transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-print"></i> Print Professional Card
                </button>
                <button 
                  onClick={() => setShowIdCard(null)} 
                  className="w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all border-2 border-slate-300"
                >
                  Close Preview
                </button>
             </div>
             <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Optimized for standard 3.375" x 2.125" card stock</p>
          </div>
        </div>
      )}

      {/* Enrollment Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden border border-slate-200">
            <div className="px-10 py-8 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{editingStudent ? 'Update Details' : 'New Student Enrollment'}</h3>
                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-1">Lalit Boys Hostel Records</p>
              </div>
              <button onClick={() => setShowModal(false)} className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors shadow-sm"><i className="fas fa-times text-slate-600"></i></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="flex flex-col items-center">
                 <div onClick={() => fileInputRef.current?.click()} className="h-32 w-32 rounded-2xl bg-white border-4 border-slate-100 shadow-xl overflow-hidden cursor-pointer hover:border-[#f2a900] transition-all flex items-center justify-center group relative">
                    {formData.photo ? <img src={formData.photo} className="w-full h-full object-cover" /> : <div className="text-center"><i className="fas fa-camera text-slate-500 text-3xl mb-2"></i><p className="text-[10px] font-black text-slate-500 uppercase">Upload Photo</p></div>}
                    <div className="absolute inset-0 bg-[#a6192e]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-black uppercase">Change</div>
                 </div>
                 <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoUpload} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Student Full Name</label>
                  <input required type="text" placeholder="e.g. Rajesh Kumar" className="w-full px-5 py-3 bg-white border-2 border-slate-300 rounded-lg focus:bg-white focus:border-[#a6192e] outline-none font-bold text-slate-950 transition-all shadow-sm placeholder:text-slate-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Father Name</label>
                  <input required type="text" placeholder="e.g. Suresh Kumar" className="w-full px-5 py-3 bg-white border-2 border-slate-300 rounded-lg focus:bg-white focus:border-[#a6192e] outline-none font-bold text-slate-950 transition-all shadow-sm placeholder:text-slate-500" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Contact Number</label>
                  <input required type="tel" placeholder="e.g. 9876543210" className="w-full px-5 py-3 bg-white border-2 border-slate-300 rounded-lg focus:bg-white focus:border-[#a6192e] outline-none font-bold text-slate-950 transition-all shadow-sm placeholder:text-slate-500" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Email ID</label>
                  <input required type="email" placeholder="e.g. rajesh@email.com" className="w-full px-5 py-3 bg-white border-2 border-slate-300 rounded-lg focus:bg-white focus:border-[#a6192e] outline-none font-bold text-slate-950 transition-all shadow-sm placeholder:text-slate-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Aadhaar Number</label>
                  <input required type="text" placeholder="e.g. 1234 5678 9012" className="w-full px-5 py-3 bg-white border-2 border-slate-300 rounded-lg focus:bg-white focus:border-[#a6192e] outline-none font-bold text-slate-950 transition-all shadow-sm placeholder:text-slate-500" value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Joining Date</label>
                  <input required type="date" className="w-full px-5 py-3 bg-white border-2 border-slate-300 rounded-lg focus:bg-white focus:border-[#a6192e] outline-none font-bold text-slate-950 transition-all shadow-sm" value={formData.joiningDate} onChange={e => setFormData({...formData, joiningDate: e.target.value})} />
                </div>

                {/* Bed and Room Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Room Number (1-6)</label>
                  <select 
                    required 
                    className="w-full px-5 py-3 bg-white border-2 border-slate-300 rounded-lg focus:bg-white focus:border-[#a6192e] outline-none font-bold text-slate-950 transition-all shadow-sm" 
                    value={formData.roomNumber} 
                    onChange={e => handleRoomChange(parseInt(e.target.value))}
                  >
                    {Array.from({ length: TOTAL_ROOMS }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>Room {num}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Bed Number (1-3)</label>
                  <select 
                    required 
                    className="w-full px-5 py-3 bg-white border-2 border-slate-300 rounded-lg focus:bg-white focus:border-[#a6192e] outline-none font-bold text-slate-950 transition-all shadow-sm" 
                    value={formData.bedNumber} 
                    onChange={e => setFormData({...formData, bedNumber: parseInt(e.target.value)})}
                  >
                    {Array.from({ length: BEDS_PER_ROOM }, (_, i) => i + 1).map(num => {
                      const isOccupied = occupiedBedsInCurrentRoom.includes(num);
                      return (
                        <option key={num} value={num} disabled={isOccupied}>
                          Bed {num} {isOccupied ? '(Occupied)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Monthly Rent</label>
                  <input required type="number" placeholder="e.g. 3500" className="w-full px-5 py-3 bg-white border-2 border-slate-300 rounded-lg focus:bg-white focus:border-[#a6192e] outline-none font-bold text-slate-950 transition-all shadow-sm placeholder:text-slate-500" value={formData.monthlyRent} onChange={e => setFormData({...formData, monthlyRent: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Full Address</label>
                <textarea required placeholder="Enter student's permanent address..." rows={3} className="w-full px-5 py-3 bg-white border-2 border-slate-300 rounded-lg focus:bg-white focus:border-[#a6192e] outline-none font-bold text-slate-950 transition-all shadow-sm placeholder:text-slate-500" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              
              <div className="pt-6 border-t border-slate-200 flex gap-4">
                 <button type="submit" className="flex-1 py-4 bg-[#a6192e] text-white rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-[#a6192e]/20 hover:bg-[#8a1524] transition-all">Enroll Student</button>
                 <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 bg-slate-100 text-slate-800 rounded-xl font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-200 transition-all border-2 border-slate-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
