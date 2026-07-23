/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Vendor, ControlItem, AuditLog, AppUser, ProvenanceLog, UserExitRecord, UserStatus } from './types';
import { MASTER_CONTROLS, INITIAL_VENDORS, INITIAL_AUDIT_LOGS, INITIAL_USERS, INITIAL_EXIT_RECORDS } from './data';
import DashboardTab from './components/DashboardTab';
import AssessmentWizardTab from './components/AssessmentWizardTab';
import FinalSummaryTab from './components/FinalSummaryTab';
import ControlRepositoryTab from './components/ControlRepositoryTab';
import AuditTrailTab from './components/AuditTrailTab';
import ReferencesTab from './components/ReferencesTab';
import Step1IntakeTriage from './components/Step1IntakeTriage';
import Step2RiskProfiling from './components/Step2RiskProfiling';
import Step5ContinuousMonitoring from './components/Step5ContinuousMonitoring';
import Step6DecommissioningPassport from './components/Step6DecommissioningPassport';
import VendorRiskPassport from './components/VendorRiskPassport';
import { ExcelUploadModal } from './components/ExcelUploadModal';
import { CompanyLifecycleModal } from './components/CompanyLifecycleModal';
import { UserManagementModal } from './components/UserManagementModal';
import ThemeSelectorModal, { THEME_PRESETS } from './components/ThemeSelectorModal';
import AlignmentMapRadarTab from './components/AlignmentMapRadarTab';
import { Shield, BookOpen, Settings, Clock, Activity, Sparkles, CheckCircle2, TrendingUp, FileSpreadsheet, Building2, Users, FolderPlus, Cpu, Target, Database, RefreshCw, Trash2, Layers, Palette, Compass } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<
    | 'step1_intake'
    | 'step2_profiling'
    | 'step3_ingestion'
    | 'step4_safeguards'
    | 'step5_monitoring'
    | 'step6_decommissioning'
    | 'radar_visualizer'
    | 'repository'
    | 'logs'
    | 'references'
  >('step1_intake');
  
  // Master states initialized from LocalStorage or Fallbacks
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('vendor_risk_vendors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to restore vendors state", e);
      }
    }
    return INITIAL_VENDORS;
  });

  const [masterControls, setMasterControls] = useState<ControlItem[]>(() => {
    const saved = localStorage.getItem('vendor_risk_controls');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to restore master controls state", e);
      }
    }
    return MASTER_CONTROLS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('vendor_risk_audit_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to restore audit logs state", e);
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('vendor_risk_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to restore users state", e);
      }
    }
    return INITIAL_USERS;
  });

  const [exitRecords, setExitRecords] = useState<UserExitRecord[]>(() => {
    const saved = localStorage.getItem('vendor_risk_exit_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to restore exit records state", e);
      }
    }
    return INITIAL_EXIT_RECORDS;
  });

  const [provenanceLogs, setProvenanceLogs] = useState<ProvenanceLog[]>(() => {
    return [
      {
        id: 'prov-01',
        timestamp: '2026-07-02T10:15:00Z',
        user: 'Amit Kumar',
        userRole: 'Admin',
        action: 'SOC 2 PDF Provenance Verification',
        details: 'Verified SHA-256 hash checksum for soc2_type2_cognitive.pdf',
        dataHash: '0xa3f8901b22c7d9910e192f183c21a4',
        provenanceType: 'AUDIT_SIGN_OFF',
        ipAddress: '127.0.0.1 (Zero-Trust Local)'
      },
      {
        id: 'prov-02',
        timestamp: '2026-07-03T14:20:00Z',
        user: 'Sarah Jenkins',
        userRole: 'Compliance Auditor',
        action: 'Excel Questionnaire Ingestion',
        details: 'Parsed 15 custom control criteria from NIST_AI_CAIQ_v4.xlsx',
        dataHash: '0x992c10b4f8101a9382104112c',
        provenanceType: 'EXCEL_IMPORT',
        ipAddress: '127.0.0.1 (Zero-Trust Local)'
      }
    ];
  });

  // Modal Visibility States
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isLifecycleModalOpen, setIsLifecycleModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState<string>('slate-zerotrust');

  // Auxiliary UI States
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [selectedPassportVendor, setSelectedPassportVendor] = useState<Vendor | null>(null);
  
  // Custom Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vendor_risk_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('vendor_risk_controls', JSON.stringify(masterControls));
  }, [masterControls]);

  useEffect(() => {
    localStorage.setItem('vendor_risk_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('vendor_risk_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('vendor_risk_exit_records', JSON.stringify(exitRecords));
  }, [exitRecords]);

  // Apply active theme to document root and body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentThemeId);
    document.body.className = `theme-${currentThemeId}`;
  }, [currentThemeId]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Custom Assessment Upload & Directory Ingestion Handler
  const handleImportExcelControls = (importedControls: ControlItem[], targetVendorId?: string, directoryTitle?: string) => {
    const dirName = directoryTitle || 'Custom Assessment Directory';

    if (targetVendorId) {
      setVendors(prev => prev.map(v => {
        if (v.id === targetVendorId) {
          const currentCustom = v.customQuestions || [];
          return { ...v, customQuestions: [...currentCustom, ...importedControls] };
        }
        return v;
      }));
    } else {
      setMasterControls(prev => [...prev, ...importedControls]);
    }

    const provLog: ProvenanceLog = {
      id: `prov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Current Auditor',
      userRole: 'Compliance Auditor',
      action: 'CUSTOM_ASSESSMENT_DIRECTORY_CREATED',
      details: `Created Assessment Directory "${dirName}" with ${importedControls.length} custom controls in ${targetVendorId ? 'Vendor Scope' : 'Master Control Repository'}.`,
      dataHash: `0x${Math.floor(Math.random() * 1e14).toString(16)}`,
      provenanceType: 'EXCEL_IMPORT',
      ipAddress: '127.0.0.1 (Zero-Trust Local)'
    };

    setProvenanceLogs(prev => [provLog, ...prev]);
    showToast(`Added ${importedControls.length} controls to Directory "${dirName}"!`);
  };

  // Company Lifecycle Management Handlers
  const handleAddVendor = (newVendor: Vendor) => {
    setVendors(prev => [...prev, newVendor]);
    
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Amit Kumar (Control Manager)',
      action: 'Company Created',
      details: `Added new vendor company ${newVendor.name}. Initial lifecycle stage set to ${newVendor.lifecycleState}.`
    };
    setAuditLogs(prev => [log, ...prev]);
    showToast(`Company ${newVendor.name} registered and set to ${newVendor.lifecycleState}!`);
  };

  const handleUpdateVendor = (updatedVendor: Vendor) => {
    setVendors(prev => prev.map(v => v.id === updatedVendor.id ? updatedVendor : v));
    showToast(`Lifecycle and profile for ${updatedVendor.name} updated.`);
  };

  const handleDeleteVendor = (vendorId: string) => {
    const v = vendors.find(item => item.id === vendorId);
    setVendors(prev => prev.filter(item => item.id !== vendorId));
    if (v) {
      showToast(`Company ${v.name} offboarded and removed.`, 'info');
    }
  };

  // User Management Handlers & Onboarding/Offboarding Lifecycle
  const handleAddUser = (newUser: AppUser) => {
    setUsers(prev => [...prev, newUser]);
    
    // Log provenance
    const provLog: ProvenanceLog = {
      id: `prov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Amit Kumar (Admin)',
      userRole: 'Admin',
      action: 'USER_ONBOARDED',
      details: `Provisioned user ${newUser.name} (${newUser.email}) as ${newUser.role}. Initial Status: ${newUser.status}.`,
      dataHash: `0x${Math.floor(Math.random() * 1e14).toString(16)}`,
      provenanceType: 'USER_ACTION',
      ipAddress: '127.0.0.1 (Zero-Trust Local)'
    };
    setProvenanceLogs(prev => [provLog, ...prev]);

    showToast(`User ${newUser.name} onboarded as ${newUser.role}.`);
  };

  const handleUpdateUserStatus = (userId: string, newStatus: UserStatus) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: newStatus };
      }
      return u;
    }));
    showToast(`User status updated to ${newStatus}.`);
  };

  const handleProcessResignation = (userId: string, reason: string, notes: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Assigned vendors at exit
    const assignedVendors = vendors.filter(v => 
      user.assignedVendorIds?.includes(v.id) || v.lastAssessedBy.toLowerCase().includes(user.name.toLowerCase())
    ).map(v => ({ id: v.id, name: v.name }));

    // Count completed assessments
    const assessmentsCount = vendors.reduce((acc, v) => {
      const isAssessedByMe = v.lastAssessedBy.toLowerCase().includes(user.name.toLowerCase());
      return acc + (isAssessedByMe ? Object.keys(v.answers || {}).length : 0);
    }, 0);

    const newExitRecord: UserExitRecord = {
      id: `exit-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      department: user.department,
      exitDate: new Date().toISOString().slice(0, 10),
      resignationReason: reason,
      handoverNotes: notes,
      assignedVendorsAtExit: assignedVendors,
      assessmentsCount
    };

    setExitRecords(prev => [newExitRecord, ...prev]);

    // Update user status
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Resigned', resignationDate: newExitRecord.exitDate, exitNotes: notes } : u));

    // Log in provenance
    const provLog: ProvenanceLog = {
      id: `prov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Amit Kumar (Admin)',
      userRole: 'Admin',
      action: 'USER_RESIGNATION_ARCHIVED',
      details: `Archived exit data for ${user.name} (${user.email}). ${assignedVendors.length} vendor portfolios preserved for transfer.`,
      dataHash: `0x${Math.floor(Math.random() * 1e14).toString(16)}`,
      provenanceType: 'USER_ACTION',
      ipAddress: '127.0.0.1 (Zero-Trust Local)'
    };
    setProvenanceLogs(prev => [provLog, ...prev]);

    showToast(`Resignation processed. Exit data for ${user.name} archived under their name.`);
  };

  const handleTransferUserAssignment = (fromUserId: string, toUserId: string, vendorIdsToTransfer: string[]) => {
    const sourceUser = users.find(u => u.id === fromUserId);
    const targetUser = users.find(u => u.id === toUserId);

    if (!sourceUser || !targetUser) return;

    // 1. Update target user's assigned vendor IDs
    setUsers(prev => prev.map(u => {
      if (u.id === targetUser.id) {
        const currentAssigned = u.assignedVendorIds || [];
        const merged = Array.from(new Set([...currentAssigned, ...vendorIdsToTransfer]));
        return { ...u, assignedVendorIds: merged };
      }
      if (u.id === sourceUser.id) {
        const currentAssigned = u.assignedVendorIds || [];
        const remaining = currentAssigned.filter(id => !vendorIdsToTransfer.includes(id));
        return { ...u, assignedVendorIds: remaining };
      }
      return u;
    }));

    // 2. Update vendors' lastAssessedBy or assigned auditor tag
    setVendors(prev => prev.map(v => {
      if (vendorIdsToTransfer.includes(v.id)) {
        return {
          ...v,
          lastAssessedBy: `${targetUser.name} (Transferred from ${sourceUser.name})`,
          lastAssessedAt: new Date().toISOString()
        };
      }
      return v;
    }));

    // 3. Update Exit Record if applicable
    setExitRecords(prev => prev.map(rec => {
      if (rec.userId === sourceUser.id) {
        return {
          ...rec,
          transferredToUserId: targetUser.id,
          transferredToUserName: targetUser.name,
          transferredAt: new Date().toISOString()
        };
      }
      return rec;
    }));

    // 4. Provenance Log
    const provLog: ProvenanceLog = {
      id: `prov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Amit Kumar (Admin)',
      userRole: 'Admin',
      action: 'RESPONSIBILITY_TRANSFER',
      details: `Reassigned ${vendorIdsToTransfer.length} vendor portfolios from ${sourceUser.name} to ${targetUser.name}.`,
      dataHash: `0x${Math.floor(Math.random() * 1e14).toString(16)}`,
      provenanceType: 'USER_ACTION',
      ipAddress: '127.0.0.1 (Zero-Trust Local)'
    };
    setProvenanceLogs(prev => [provLog, ...prev]);

    showToast(`Transferred ${vendorIdsToTransfer.length} vendor portfolios to ${targetUser.name}.`);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    showToast('User removed from roster.', 'info');
  };

  // State manipulation handlers
  const handleSelectVendorToAssess = (vendorId: string | null) => {
    setSelectedVendorId(vendorId);
    setActiveTab('wizard');
  };

  const handleSaveAssessment = (updatedVendor: Vendor, logDetail: string) => {
    // Update vendors array
    setVendors(prev => prev.map(v => v.id === updatedVendor.id ? updatedVendor : v));
    
    // Add audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Amit Kumar (Control Manager)',
      action: 'Assessment Saved',
      details: `Saved scorecard baseline for ${updatedVendor.name}. ${logDetail}`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    showToast(`Scorecard baseline for ${updatedVendor.name} updated successfully!`);
  };

  const handleCreateNewVendor = (info: {
    name: string;
    servicesProvided: string;
    description: string;
    usesAgenticAI: boolean;
    inherentLikelihood: number;
    inherentImpact: number;
  }) => {
    const newVendorId = `vnd-${Date.now()}`;
    const newVendor: Vendor = {
      id: newVendorId,
      name: info.name,
      description: info.description,
      servicesProvided: info.servicesProvided,
      inherentLikelihood: info.inherentLikelihood,
      inherentImpact: info.inherentImpact,
      usesAgenticAI: info.usesAgenticAI,
      status: 'Pending',
      lifecycleState: 'Onboarding',
      answers: {},
      lastAssessedBy: 'System',
      lastAssessedAt: new Date().toISOString()
    };

    setVendors(prev => [...prev, newVendor]);

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Amit Kumar (Control Manager)',
      action: 'Vendor Created',
      details: `Initialized new third-party portfolio for ${info.name}. Scope set to ${info.usesAgenticAI ? 'Agentic AI + Data Privacy' : 'Standard LLM Only'}.`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setSelectedVendorId(newVendorId);
    setActiveTab('wizard');
    showToast(`Vendor ${info.name} created! Loading wizard...`);
    return newVendorId;
  };

  const handleUpdateControlWeight = (controlId: string, newWeight: number) => {
    const targetCtrl = masterControls.find(c => c.id === controlId);
    if (!targetCtrl) return;

    const oldWeight = targetCtrl.weight;
    if (oldWeight === newWeight) return; // No change

    // Update weight in state
    setMasterControls(prev => prev.map(c => c.id === controlId ? { ...c, weight: newWeight } : c));

    // Register Audit Log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Amit Kumar (Control Manager)',
      action: 'Control Overridden',
      details: `Overrode compliance baseline weight of ${targetCtrl.code} (${targetCtrl.frameworkMapping}) from ${oldWeight} to ${newWeight}. All vendor residual calculations updated.`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    showToast(`Weight of ${targetCtrl.code} changed to ${newWeight}! Scores recalibrated.`, 'info');
  };

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to clear the entire audit logbook? This action cannot be reversed.")) {
      setAuditLogs([]);
      showToast("Audit logbook cleared successfully.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      
      {/* Premium Workspace Navbar Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white shadow-md no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-inner">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-display font-black tracking-tight uppercase">
                  AITPRM Control Room
                </h1>
                <span className="text-[9px] tracking-wider font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded uppercase">
                  AI TPRM Platform
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5 font-medium">
                AITPRM • AI Third-Party Risk Management • CSA CAIQ v4 & AICM Controls
              </p>
            </div>
          </div>

          {/* User Persona & Management Action Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            
            <button
              onClick={() => setIsLifecycleModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Companies ({vendors.length})</span>
            </button>

            <button
              onClick={() => setIsExcelModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Custom Assessment</span>
            </button>

            <button
              onClick={() => setIsUserModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Users ({users.length})</span>
            </button>

            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Themes</span>
            </button>

            <div className="bg-slate-800/80 border border-slate-700 p-2 rounded-xl flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold font-display text-indigo-400 text-xs">
                AK
              </div>
              <div className="text-[11px]">
                <p className="font-semibold text-slate-100">Amit Kumar</p>
                <p className="text-[9px] text-slate-400 font-mono">Role: Admin</p>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* Primary Sub-Navigation Tab Panel - Modular Workspace Tabs */}
      <div className="bg-white border-b border-slate-200 shadow-2xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 py-2.5 text-xs">
            
            <button
              onClick={() => setActiveTab('step1_intake')}
              className={`flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg sm:rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'step1_intake'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 bg-slate-50/60 border border-slate-200/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-500 group-hover:text-indigo-600" />
              <span>Intake & Triage</span>
            </button>

            <button
              onClick={() => setActiveTab('step2_profiling')}
              className={`flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg sm:rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'step2_profiling'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 bg-slate-50/60 border border-slate-200/60'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-amber-500" />
              <span>Risk Profiling</span>
            </button>

            <button
              onClick={() => setActiveTab('step3_ingestion')}
              className={`flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg sm:rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'step3_ingestion'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 bg-slate-50/60 border border-slate-200/60'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-sky-500" />
              <span>Evidence & RAG</span>
            </button>

            <button
              onClick={() => setActiveTab('step4_safeguards')}
              className={`flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg sm:rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'step4_safeguards'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 bg-slate-50/60 border border-slate-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              <span>Safeguards</span>
            </button>

            <button
              onClick={() => setActiveTab('step5_monitoring')}
              className={`flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg sm:rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'step5_monitoring'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 bg-slate-50/60 border border-slate-200/60'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
              <span>Monitoring</span>
            </button>

            <button
              onClick={() => setActiveTab('step6_decommissioning')}
              className={`flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg sm:rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'step6_decommissioning'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 bg-slate-50/60 border border-slate-200/60'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Decommissioning</span>
            </button>

            <button
              onClick={() => setActiveTab('radar_visualizer')}
              className={`flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3.5 rounded-lg sm:rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'radar_visualizer'
                  ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>Alignment Map (Radar)</span>
            </button>

            <button
              onClick={() => setActiveTab('repository')}
              className={`flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg sm:rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'repository'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 bg-slate-50/60 border border-slate-200/60'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Control Repository</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg sm:rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'logs'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 bg-slate-50/60 border border-slate-200/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Audit Trail</span>
            </button>

            <button
              onClick={() => setActiveTab('references')}
              className={`flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg sm:rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'references'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 bg-slate-50/60 border border-slate-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>References</span>
            </button>

          </div>
        </div>
      </div>

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slideIn no-print max-w-sm">
          <div className={`p-4 rounded-xl shadow-xl border flex items-start gap-3 ${
            toast.type === 'success' 
              ? 'bg-indigo-950 border-indigo-800 text-indigo-100' 
              : 'bg-slate-950 border-slate-800 text-slate-100'
          }`}>
            <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${toast.type === 'success' ? 'text-indigo-400' : 'text-blue-400'}`} />
            <div>
              <p className="font-bold text-xs">System Notification</p>
              <p className="text-[11px] leading-relaxed text-slate-300 mt-0.5">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Frame container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 no-print">
        {activeTab === 'step1_intake' && (
          <Step1IntakeTriage
            vendors={vendors}
            selectedVendorId={selectedVendorId}
            onSelectVendor={setSelectedVendorId}
            onUpdateVendor={(updated) => {
              setVendors(prev => prev.map(v => v.id === updated.id ? updated : v));
              showToast(`Updated Triage classification for ${updated.name}`);
            }}
            onAddVendor={handleCreateNewVendor}
          />
        )}

        {activeTab === 'step2_profiling' && (
          <div className="space-y-6">
            <Step2RiskProfiling
              vendors={vendors}
              selectedVendorId={selectedVendorId}
              onSelectVendor={setSelectedVendorId}
              onUpdateVendor={(updated) => {
                setVendors(prev => prev.map(v => v.id === updated.id ? updated : v));
                showToast(`Updated Risk Profile & Tiering for ${updated.name}`);
              }}
            />
            <DashboardTab
              vendors={vendors}
              masterControls={masterControls}
              onAssessVendor={handleSelectVendorToAssess}
              onViewPassport={setSelectedPassportVendor}
              onAddVendorClick={() => setIsLifecycleModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'step3_ingestion' && (
          <AssessmentWizardTab
            vendors={vendors}
            selectedVendorId={selectedVendorId}
            masterControls={masterControls}
            onSelectVendor={setSelectedVendorId}
            onSaveAssessment={handleSaveAssessment}
            onAddVendor={handleCreateNewVendor}
          />
        )}

        {activeTab === 'step4_safeguards' && (
          <FinalSummaryTab
            vendors={vendors}
            masterControls={masterControls}
            onSelectVendorToAssess={handleSelectVendorToAssess}
          />
        )}

        {activeTab === 'radar_visualizer' && (
          <AlignmentMapRadarTab
            vendors={vendors}
            masterControls={masterControls}
            onSelectVendorToAssess={handleSelectVendorToAssess}
          />
        )}

        {activeTab === 'step5_monitoring' && (
          <Step5ContinuousMonitoring
            vendors={vendors}
            selectedVendorId={selectedVendorId}
            onSelectVendor={setSelectedVendorId}
          />
        )}

        {activeTab === 'step6_decommissioning' && (
          <Step6DecommissioningPassport
            vendors={vendors}
            selectedVendorId={selectedVendorId}
            onSelectVendor={setSelectedVendorId}
            onUpdateVendor={(updated) => {
              setVendors(prev => prev.map(v => v.id === updated.id ? updated : v));
              showToast(`Offboarded vendor ${updated.name}`);
            }}
            onDeleteVendor={(id) => {
              setVendors(prev => prev.filter(v => v.id !== id));
              showToast('Deleted vendor record');
            }}
          />
        )}

        {activeTab === 'repository' && (
          <ControlRepositoryTab
            controls={masterControls}
            vendors={vendors}
            onUpdateWeight={handleUpdateControlWeight}
          />
        )}

        {activeTab === 'logs' && (
          <AuditTrailTab
            logs={auditLogs}
            onClearLogs={handleClearLogs}
          />
        )}

        {activeTab === 'references' && (
          <ReferencesTab />
        )}
      </main>

      {/* Excel Sheet Questionnaire Upload Modal */}
      <ExcelUploadModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onImportControls={handleImportExcelControls}
        vendorName={vendors.find(v => v.id === selectedVendorId)?.name}
        vendorId={selectedVendorId || undefined}
      />

      {/* Company Lifecycle Management Modal */}
      <CompanyLifecycleModal
        isOpen={isLifecycleModalOpen}
        onClose={() => setIsLifecycleModalOpen(false)}
        vendors={vendors}
        onAddVendor={handleAddVendor}
        onUpdateVendor={handleUpdateVendor}
        onDeleteVendor={handleDeleteVendor}
        selectedVendorId={selectedVendorId || undefined}
      />

      {/* User Management & Data Provenance Modal */}
      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        users={users}
        vendors={vendors}
        exitRecords={exitRecords}
        provenanceLogs={provenanceLogs}
        onAddUser={handleAddUser}
        onUpdateUserStatus={handleUpdateUserStatus}
        onDeleteUser={handleDeleteUser}
        onProcessResignation={handleProcessResignation}
        onTransferUserAssignment={handleTransferUserAssignment}
        onClearLogs={() => setProvenanceLogs([])}
      />

      {/* Design Themes & Template Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentThemeId={currentThemeId}
        onSelectTheme={(themeId) => {
          setCurrentThemeId(themeId);
          const foundTheme = THEME_PRESETS.find(t => t.id === themeId);
          showToast(`Applied Design Theme: ${foundTheme?.name || themeId}`);
        }}
      />

      {/* Global Render Overlays: Printable Vendor Risk Passport Modal */}
      {selectedPassportVendor && (
        <VendorRiskPassport
          vendor={selectedPassportVendor}
          masterControls={masterControls}
          onClose={() => setSelectedPassportVendor(null)}
        />
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-[10px] font-mono text-slate-400 bg-white shadow-2xs mt-12 no-print">
        <span>© 2026 Enterprise Risk Engine v1.2.0 • Zero-Trust Portable AI Governance</span>
      </footer>

      {/* CSS Stylesheet Injector */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #passport-print-area, #passport-print-area * {
            visibility: visible;
          }
          #passport-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            box-shadow: none;
            border: none;
          }
          .no-print {
            display: none !important;
          }
        }
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}
