'use client';

import { useState } from 'react';
import { 
  Search, 
  MoreVertical, 
  Shield, 
  Mail, 
  Calendar,
  BrainCircuit,
  Ban,
  CheckCircle2
} from 'lucide-react';

export default function AdminUsersPage() {
  // Mock User Data
  const [users, setUsers] = useState([
    {
      id: "u_8832",
      name: "Yashvanth S",
      email: "yashvanth@example.com",
      role: "Customer",
      status: "Active",
      joined: "Sept 12, 2025",
      spent: 12450,
      persona: "Tech Enthusiast"
    },
    {
      id: "u_8833",
      name: "Aditya Kumar",
      email: "aditya.k@example.com",
      role: "Customer",
      status: "Active",
      joined: "Oct 04, 2025",
      spent: 4500,
      persona: "Fitness Buff"
    },
    {
      id: "u_8834",
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      role: "Customer",
      status: "Inactive",
      joined: "Nov 20, 2025",
      spent: 0,
      persona: "New Mom"
    },
    {
      id: "u_8835",
      name: "Admin User",
      email: "admin@scan2save.com",
      role: "Admin",
      status: "Active",
      joined: "Aug 01, 2025",
      spent: 0,
      persona: "System"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter logic
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-400">Monitor user activity and AI categorization.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950/50 text-slate-200 uppercase text-xs font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">User Identity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">AI Persona</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors group">
                  
                  {/* User Identity */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          {user.name}
                          {user.role === 'Admin' && (
                            <Shield className="w-3 h-3 text-indigo-400" />
                          )}
                        </div>
                        <div className="text-xs flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-slate-700/50 text-slate-400 border-slate-600'
                    }`}>
                      {user.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>

                  {/* AI Persona */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-indigo-400" />
                        <span className="text-white font-medium">{user.persona}</span>
                    </div>
                  </td>

                  {/* Spent */}
                  <td className="px-6 py-4 font-mono text-white">
                    ₹{user.spent.toLocaleString()}
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {user.joined}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-slate-500">
                No users found matching "{searchTerm}"
            </div>
        )}
      </div>
    </div>
  );
}