import React, { useState } from 'react';
import { 
  Users, Search, ShieldAlert, ShieldCheck, Mail, Calendar, 
  Trash2, FileText, CheckCircle, Flame, Plus, Key 
} from 'lucide-react';
import { UserProfile } from '../types';

interface ActivityLog {
  id: string;
  time: string;
  user: string;
  action: string;
  type: 'auth' | 'product' | 'order' | 'system' | 'coupon';
  status: 'success' | 'warn' | 'error';
}

interface AdminUsersProps {
  users: UserProfile[];
  onToggleUserRole: (email: string) => void;
  activityLogs: ActivityLog[];
}

const ADMIN_EMAILS = [
  'info.shorif0000@gmail.com',
  'geminizksipro@gmail.com',
  'admin@digimarkt.bd',
  'admin@gmail.com'
];

export default function AdminUsers({
  users,
  onToggleUserRole,
  activityLogs
}: AdminUsersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'customers' | 'audit'>('customers');

  // Filter Users
  const filteredUsers = users.filter(u => {
    if (ADMIN_EMAILS.includes(u.email.toLowerCase())) return false;
    return u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (u.phone && u.phone.includes(searchQuery));
  });

  const getLogTypeBadge = (type: ActivityLog['type']) => {
    switch (type) {
      case 'auth':
        return 'text-blue-600 bg-blue-50 border border-blue-100';
      case 'product':
        return 'text-indigo-600 bg-indigo-50 border border-indigo-100';
      case 'order':
        return 'text-emerald-600 bg-emerald-50 border border-emerald-100';
      case 'coupon':
        return 'text-purple-600 bg-purple-50 border border-purple-100';
      case 'system':
      default:
        return 'text-slate-600 bg-slate-50 border border-slate-100';
    }
  };

  const getLogStatusBullet = (status: ActivityLog['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'warn':
        return 'bg-amber-500';
      case 'error':
        return 'bg-red-500';
    }
  };

  const isAdminEmail = (email: string) => {
    return email === 'admin@digimarkt.bd' || email === 'admin@gmail.com' || email.toLowerCase().includes('admin');
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-100 gap-4 text-xs font-black">
        <button
          onClick={() => setActiveSubTab('customers')}
          className={`pb-2.5 px-1 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'customers' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Developer Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`pb-2.5 px-1 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'audit' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Security Audit Logs ({activityLogs.length})
        </button>
      </div>

      {activeSubTab === 'customers' ? (
        <div className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl px-3.5 py-1.5 max-w-md shadow-inner">
            <Search size={15} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search developer directory by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none"
            />
          </div>

          {/* User Table */}
          <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
                    <th className="p-4 pl-6">Developer Details</th>
                    <th className="p-4">Mobile contact</th>
                    <th className="p-4">Registration date</th>
                    <th className="p-4 text-center">Purchases</th>
                    <th className="p-4 text-center">Wishlist</th>
                    <th className="p-4 text-center">Security role</th>
                    <th className="p-4 text-right pr-6">Manage role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {filteredUsers.map((u) => {
                    const isUserAdmin = isAdminEmail(u.email);
                    return (
                      <tr key={u.email} className="hover:bg-slate-50/40 transition-colors">
                        {/* Avatar & Name */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full bg-blue-50 border border-slate-100 shadow-sm shrink-0 object-cover" />
                            <div className="min-w-0">
                              <h4 className="text-xs font-extrabold text-slate-900 leading-snug">{u.name}</h4>
                              <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="p-4 font-bold text-slate-600">
                          {u.phone || 'None registered'}
                        </td>

                        {/* Joined Date */}
                        <td className="p-4 text-slate-400 font-medium">
                          {new Date(u.joinedDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>

                        {/* Purchases count */}
                        <td className="p-4 text-center">
                          <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-xl">
                            {u.purchasedProductIds?.length || 0} assets
                          </span>
                        </td>

                        {/* Wishlist count */}
                        <td className="p-4 text-center text-slate-400 font-medium">
                          {u.wishlist?.length || 0} saved
                        </td>

                        {/* Security Role Badge */}
                        <td className="p-4 text-center">
                          {isUserAdmin ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100 animate-pulse">
                              <ShieldCheck size={11} />
                              <span>Admin User</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase bg-slate-50 text-slate-400 px-2.5 py-1 rounded-full border border-slate-100">
                              <span>Developer</span>
                            </span>
                          )}
                        </td>

                        {/* Role Switch Trigger */}
                        <td className="p-4 text-right pr-6">
                          <button
                            onClick={() => onToggleUserRole(u.email)}
                            className="text-[10px] font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                            id={`toggle-role-${u.email}`}
                          >
                            Toggle Role
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400 font-semibold">
                        No registered developer profiles found matching your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Full Security Audit Ledger
              </h3>
              <p className="text-xs text-slate-400 font-semibold">
                Audit trial capturing active mutations and authentication events.
              </p>
            </div>
            
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span>Active Logging Node Operational</span>
            </span>
          </div>

          {/* Audit Logs List */}
          <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl p-5 shadow-sm space-y-3">
            {activityLogs.map((log) => (
              <div 
                key={log.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-50 hover:bg-slate-50/50 rounded-2xl transition-all gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  {/* Status Indicator */}
                  <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${getLogStatusBullet(log.status)}`} title={`${log.status} state`} />
                  
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-slate-900 leading-none">
                        {log.user === 'info.shorif0000@gmail.com' ? 'System Admin' : log.user}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getLogTypeBadge(log.type)}`}>
                        {log.type}
                      </span>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed">{log.action}</p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono shrink-0 sm:text-right">
                  {log.time}
                </span>
              </div>
            ))}

            {activityLogs.length === 0 && (
              <div className="p-12 text-center text-slate-400 font-semibold">
                No system activity recorded in this session.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
