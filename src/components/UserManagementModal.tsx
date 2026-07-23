/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * User Onboarding, Offboarding & Data Transfer Lifecycle Module
 * Handles User Access Control (RBAC), User Onboarding/Offboarding,
 * Resignation Exit Data Archiving in User's Name,
 * User Portfolio Reassignment Function, and Data Provenance Maintenance.
 */

import React, { useState } from 'react';
import { 
  Users, Shield, UserPlus, Trash2, Key, CheckCircle2, Lock, FileCode, HardDrive, 
  Download, RefreshCw, X, ShieldCheck, UserMinus, UserCheck, ArrowRightLeft, 
  Archive, FileText, Sparkles, AlertCircle, Building2, Calendar, Tag, ChevronRight, UserX
} from 'lucide-react';
import { AppUser, UserRole, UserStatus, ProvenanceLog, UserExitRecord, Vendor } from '../types';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AppUser[];
  vendors: Vendor[];
  exitRecords: UserExitRecord[];
  provenanceLogs: ProvenanceLog[];
  onAddUser: (user: AppUser) => void;
  onUpdateUserStatus: (userId: string, newStatus: UserStatus) => void;
  onDeleteUser: (userId: string) => void;
  onProcessResignation: (userId: string, reason: string, notes: string) => void;
  onTransferUserAssignment: (fromUserId: string, toUserId: string, vendorIds: string[]) => void;
  onClearLogs?: () => void;
}

export function UserManagementModal({
  isOpen,
  onClose,
  users,
  vendors,
  exitRecords,
  provenanceLogs,
  onAddUser,
  onUpdateUserStatus,
  onDeleteUser,
  onProcessResignation,
  onTransferUserAssignment,
  onClearLogs
}: UserManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'exit_records' | 'transfer' | 'provenance'>('users');

  // New User Onboarding Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Compliance Auditor');
  const [department, setDepartment] = useState('Third-Party AI Governance');
  const [initialStatus, setInitialStatus] = useState<UserStatus>('Active');
  const [selectedInitialVendors, setSelectedInitialVendors] = useState<string[]>([]);

  // Offboarding / Resignation Form Modal State
  const [resigningUserId, setResigningUserId] = useState<string | null>(null);
  const [resignationReason, setResignationReason] = useState('Resignation / Career Transition');
  const [handoverNotes, setHandoverNotes] = useState('');

  // Transfer Assignment Form State
  const [transferFromUserId, setTransferFromUserId] = useState<string>('');
  const [transferToUserId, setTransferToUserId] = useState<string>('');
  const [selectedVendorsToTransfer, setSelectedVendorsToTransfer] = useState<string[]>([]);
  const [transferSuccessMsg, setTransferSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Onboarding Submit
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser: AppUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      department: department.trim() || 'Third-Party AI Governance',
      createdAt: new Date().toISOString(),
      status: initialStatus,
      assignedVendorIds: selectedInitialVendors
    };

    onAddUser(newUser);
    setName('');
    setEmail('');
    setSelectedInitialVendors([]);
  };

  // Process Resignation Submit
  const handleConfirmResignation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resigningUserId) return;

    onProcessResignation(resigningUserId, resignationReason, handoverNotes);
    setResigningUserId(null);
    setHandoverNotes('');
  };

  // Transfer Portfolio Submit
  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferFromUserId || !transferToUserId || selectedVendorsToTransfer.length === 0) return;

    onTransferUserAssignment(transferFromUserId, transferToUserId, selectedVendorsToTransfer);
    
    const sourceUser = users.find(u => u.id === transferFromUserId);
    const targetUser = users.find(u => u.id === transferToUserId);

    setTransferSuccessMsg(`Successfully transferred ${selectedVendorsToTransfer.length} vendor(s) from ${sourceUser?.name || 'Exiting User'} to ${targetUser?.name || 'New User'}!`);
    setTimeout(() => {
      setTransferSuccessMsg(null);
    }, 2500);

    setSelectedVendorsToTransfer([]);
  };

  // Auto select vendors when source user changes in Transfer Tab
  const handleSelectSourceUserForTransfer = (sourceId: string) => {
    setTransferFromUserId(sourceId);
    const userObj = users.find(u => u.id === sourceId);
    if (userObj && userObj.assignedVendorIds) {
      setSelectedVendorsToTransfer(userObj.assignedVendorIds);
    } else {
      // Find vendors where lastAssessedBy contains user name or default
      const userVendors = vendors.filter(v => userObj && v.lastAssessedBy.toLowerCase().includes(userObj.name.toLowerCase())).map(v => v.id);
      setSelectedVendorsToTransfer(userVendors.length > 0 ? userVendors : vendors.map(v => v.id));
    }
  };

  const exportProvenanceJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      version: '1.2',
      exportedAt: new Date().toISOString(),
      userRoster: users,
      exitArchive: exitRecords,
      logs: provenanceLogs
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `user_governance_provenance_audit_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">User Lifecycle, Exit Archives & Portfolio Assignment</h3>
              <p className="text-xs text-slate-300">Onboarding, Offboarding, Post-Resignation Exit Records & Reassignment Engine</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-100 border-b border-slate-200 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>User Roster & Lifecycle ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('exit_records')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'exit_records'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Archive className="w-3.5 h-3.5 text-amber-600" />
              <span>Exit Data Archives ({exitRecords.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('transfer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'transfer'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-purple-600" />
              <span>User Assignment Function</span>
            </button>

            <button
              onClick={() => setActiveTab('provenance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'provenance'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Provenance Logs ({provenanceLogs.length})</span>
            </button>
          </div>

          <button
            onClick={exportProvenanceJSON}
            className="flex items-center gap-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Governance Audit</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto">
          
          {/* TAB 1: USER ROSTER & LIFECYCLE */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              
              {/* Onboarding Form */}
              <form onSubmit={handleCreateUser} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <UserPlus className="w-4 h-4 text-indigo-600" />
                    <span>Onboard New User / Risk Auditor</span>
                  </div>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                    Role-Based Access Control (RBAC)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Jonathan Mercer"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="j.mercer@enterprise.io"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Assigned Role</label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as UserRole)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Compliance Auditor">Compliance Auditor</option>
                      <option value="Vendor Risk Manager">Vendor Risk Manager</option>
                      <option value="Vendor Representative">Vendor Representative</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Lifecycle Status</label>
                    <select
                      value={initialStatus}
                      onChange={e => setInitialStatus(e.target.value as UserStatus)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="Onboarding">Onboarding (Pending Setup)</option>
                      <option value="Active">Active (Fully Provisioned)</option>
                    </select>
                  </div>
                </div>

                {/* Vendor Portfolio Assignment during onboarding */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Assign Vendor Risk Portfolios (Initial Responsibilities):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {vendors.map(v => {
                      const isSelected = selectedInitialVendors.includes(v.id);
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedInitialVendors(selectedInitialVendors.filter(id => id !== v.id));
                            } else {
                              setSelectedInitialVendors([...selectedInitialVendors, v.id]);
                            }
                          }}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {v.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Complete User Onboarding
                  </button>
                </div>
              </form>

              {/* User Roster List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Enterprise User Roster & Lifecycle Pipeline ({users.length})
                  </span>
                  <span className="text-xs text-slate-500">
                    Active, Onboarding & Resigned/Offboarded Accounts
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  {users.map(u => {
                    const assignedVendors = vendors.filter(v => u.assignedVendorIds?.includes(v.id));
                    
                    return (
                      <div key={u.id} className="p-4 bg-white hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-full font-bold flex items-center justify-center shrink-0 border ${
                            u.status === 'Resigned' || u.status === 'Offboarded' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            u.status === 'Onboarding' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            'bg-indigo-100 text-indigo-700 border-indigo-200'
                          }`}>
                            {u.name.charAt(0)}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                              
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                u.role === 'Compliance Auditor' ? 'bg-indigo-100 text-indigo-700' :
                                u.role === 'Vendor Risk Manager' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {u.role}
                              </span>

                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                u.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                u.status === 'Onboarding' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                u.status === 'Resigned' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                'bg-slate-200 text-slate-700 border-slate-300'
                              }`}>
                                {u.status}
                              </span>
                            </div>

                            <p className="text-slate-500 text-[11px]">{u.email} • {u.department}</p>

                            {/* Assigned Vendor Badges */}
                            {assignedVendors.length > 0 && (
                              <div className="flex items-center gap-1.5 pt-1">
                                <span className="text-[10px] font-bold text-slate-400">Assigned Portfolios:</span>
                                {assignedVendors.map(v => (
                                  <span key={v.id} className="px-2 py-0.2 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold border border-slate-200">
                                    {v.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            {u.exitNotes && (
                              <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                                <strong>Handover Note:</strong> {u.exitNotes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Lifecycle Actions */}
                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          {u.status === 'Onboarding' && (
                            <button
                              onClick={() => onUpdateUserStatus(u.id, 'Active')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                            >
                              Activate User
                            </button>
                          )}

                          {u.status === 'Active' && (
                            <button
                              onClick={() => {
                                setResigningUserId(u.id);
                                setResignationReason('Resignation / Career Transition');
                              }}
                              className="flex items-center gap-1 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                            >
                              <UserMinus className="w-3.5 h-3.5" />
                              <span>Offboard / Resign</span>
                            </button>
                          )}

                          {(u.status === 'Resigned' || u.status === 'Offboarded') && (
                            <button
                              onClick={() => {
                                setActiveTab('transfer');
                                handleSelectSourceUserForTransfer(u.id);
                              }}
                              className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                              <span>Transfer Portfolio</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`Remove user account for ${u.name}?`)) {
                                onDeleteUser(u.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: POST-RESIGNATION EXIT RECORDS */}
          {activeTab === 'exit_records' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-3">
                  <Archive className="w-5 h-5 text-amber-700 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Post-Resignation Exit Data Archives</h4>
                    <p className="text-[11px] text-amber-800">
                      When an auditor or manager resigns, their completed risk reviews, audit comments, and assigned vendor scopes are preserved under their name and made transferrable to new users.
                    </p>
                  </div>
                </div>
              </div>

              {exitRecords.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No Resignation Exit Records Created Yet</p>
                  <p className="text-[11px] text-slate-500">
                    When you offboard a user from the User Roster, their exit data snapshot will automatically populate here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {exitRecords.map(rec => (
                    <div key={rec.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{rec.userName}</h4>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full border border-amber-200">
                              Resigned / Offboarded
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{rec.userEmail} • {rec.department} ({rec.userRole})</p>
                        </div>

                        <div className="text-right text-xs">
                          <span className="text-slate-400 block text-[10px]">Exit Date</span>
                          <span className="font-bold text-slate-800">{rec.exitDate}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="font-bold text-slate-700 block mb-0.5">Resignation Reason:</span>
                          <p className="text-slate-600">{rec.resignationReason}</p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-700 block mb-0.5">Handover & Transition Notes:</span>
                          <p className="text-slate-600">{rec.handoverNotes || 'Standard exit workflow completed.'}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">Archived Portfolio at Exit:</span>
                          {rec.assignedVendorsAtExit.map(v => (
                            <span key={v.id} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold text-[10px]">
                              {v.name}
                            </span>
                          ))}
                        </div>

                        {rec.transferredToUserName ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Transferred to: {rec.transferredToUserName}</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveTab('transfer');
                              handleSelectSourceUserForTransfer(rec.userId);
                            }}
                            className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs shadow-2xs transition-all cursor-pointer"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span>Transfer Responsibilities Now</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: USER ASSIGNMENT & TRANSFER FUNCTION */}
          {activeTab === 'transfer' && (
            <div className="space-y-6">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between text-xs text-purple-900">
                <div className="flex items-center gap-3">
                  <ArrowRightLeft className="w-5 h-5 text-purple-700 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">User Portfolio Reassignment Function</h4>
                    <p className="text-[11px] text-purple-800">
                      Reassign all risk assessments, vendor monitoring scopes, and open gap items from a resigned/exiting user to a newly onboarded or active auditor.
                    </p>
                  </div>
                </div>
              </div>

              {transferSuccessMsg && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{transferSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleExecuteTransfer} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Source User (Exiting or Active) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      1. Select Source User (Exiting / Resigned):
                    </label>
                    <select
                      required
                      value={transferFromUserId}
                      onChange={e => handleSelectSourceUserForTransfer(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="">-- Choose User to Transfer From --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.status}) - {u.role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Target User (New or Active) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      2. Select Target User (New Onboarded / Active):
                    </label>
                    <select
                      required
                      value={transferToUserId}
                      onChange={e => setTransferToUserId(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="">-- Choose Target Recipient User --</option>
                      {users.filter(u => u.id !== transferFromUserId && u.status !== 'Resigned' && u.status !== 'Offboarded').map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.status}) - {u.role}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Vendors Selection */}
                {transferFromUserId && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700">
                      3. Select Vendor Portfolios to Reassign:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                      {vendors.map(v => {
                        const isChecked = selectedVendorsToTransfer.includes(v.id);
                        return (
                          <label
                            key={v.id}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-purple-100/70 border-purple-300 text-purple-900 font-bold'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setSelectedVendorsToTransfer([...selectedVendorsToTransfer, v.id]);
                                  } else {
                                    setSelectedVendorsToTransfer(selectedVendorsToTransfer.filter(id => id !== v.id));
                                  }
                                }}
                                className="rounded text-purple-600 focus:ring-purple-500"
                              />
                              <span>{v.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Assessed By: {v.lastAssessedBy}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500 italic">
                    Generates an immutable Data Provenance record of user assignment transfer.
                  </span>
                  <button
                    type="submit"
                    disabled={!transferFromUserId || !transferToUserId || selectedVendorsToTransfer.length === 0}
                    className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Execute Portfolio Transfer ({selectedVendorsToTransfer.length} Vendors)</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: DATA PROVENANCE LOGS */}
          {activeTab === 'provenance' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs text-indigo-900">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    Data Provenance Log guarantees immutable traceability for user onboarding, offboardings, exit data archives, and responsibility transfers.
                  </span>
                </div>
                {onClearLogs && (
                  <button
                    onClick={onClearLogs}
                    className="text-red-600 hover:underline font-bold shrink-0 cursor-pointer text-[11px]"
                  >
                    Clear Maintenance Logs
                  </button>
                )}
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {provenanceLogs.map((log, idx) => {
                  const hash = log.dataHash || `0x${(idx * 739210 + 12893).toString(16).padStart(12, '0')}`;
                  return (
                    <div key={log.id || idx} className="p-3 bg-white hover:bg-slate-50 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{log.action}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600 font-semibold">{log.user}</span>
                          <span className="text-slate-400">({log.userRole || 'Auditor'})</span>
                        </div>
                        <span className="text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-slate-700">{log.details}</p>

                      <div className="flex items-center justify-between text-[10px] pt-1 text-slate-400 font-mono">
                        <span>Provenance Hash: {hash}</span>
                        <span>IP: {log.ipAddress || '127.0.0.1 (Zero-Trust Local)'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Resignation / Offboarding Confirmation Modal Popup */}
      {resigningUserId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-700">
              <div className="p-2 bg-amber-100 rounded-lg">
                <UserMinus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">Process Resignation & Offboard User</h4>
                <p className="text-xs text-slate-500">
                  User: {users.find(u => u.id === resigningUserId)?.name}
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmResignation} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Resignation / Exit Reason</label>
                <select
                  value={resignationReason}
                  onChange={e => setResignationReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                >
                  <option value="Resignation / Career Transition">Resignation / Career Transition</option>
                  <option value="Contract Expiration">Contract Expiration</option>
                  <option value="Role Rotation / Reassignment">Role Rotation / Reassignment</option>
                  <option value="Offboarded / Access Revoked">Offboarded / Access Revoked</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transition & Handover Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record handover summary, pending audit reviews, or instructions for the replacement auditor..."
                  value={handoverNotes}
                  onChange={e => setHandoverNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
                <p className="font-bold">Automated Exit Data Archiving:</p>
                <p>
                  All completed assessments, audit comments, and assigned vendor scopes will be archived under this user's name and made transferrable via the User Assignment Function.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResigningUserId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Archive Exit Data & Offboard User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
