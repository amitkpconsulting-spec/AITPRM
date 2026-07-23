/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Company / Vendor Lifecycle Management Component
 * Manages full lifecycle states: Onboarding -> Assessment -> Continuous Monitoring -> Renewal -> Offboarded.
 */

import React, { useState } from 'react';
import { Building2, X, Plus, Trash2, CheckCircle2, ShieldAlert, Sparkles, Clock, AlertTriangle, Calendar, Mail, Tag, ArrowRight } from 'lucide-react';
import { Vendor, CompanyLifecycleState } from '../types';

interface CompanyLifecycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: Vendor[];
  onAddVendor: (vendor: Vendor) => void;
  onUpdateVendor: (vendor: Vendor) => void;
  onDeleteVendor: (vendorId: string) => void;
  selectedVendorId?: string;
}

const LIFECYCLE_STAGES: { id: CompanyLifecycleState; label: string; desc: string; color: string }[] = [
  { id: 'Onboarding', label: '1. Onboarding', desc: 'Initial registration and intake questionnaire setup', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'Assessment', label: '2. Assessment', desc: 'Active control evaluation, RAG analysis & risk scoring', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'Continuous Monitoring', label: '3. Continuous Monitoring', desc: 'Active vendor, periodic vector audits & drift tracking', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'Renewal', label: '4. Renewal', desc: 'Annual re-assessment and contract renewal review', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'Offboarded', label: '5. Offboarded', desc: 'Decommissioned AI service, data purged & accesses revoked', color: 'bg-slate-200 text-slate-700 border-slate-300' }
];

export function CompanyLifecycleModal({
  isOpen,
  onClose,
  vendors,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor,
  selectedVendorId
}: CompanyLifecycleModalProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [editingVendorId, setEditingVendorId] = useState<string | null>(selectedVendorId || null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [servicesProvided, setServicesProvided] = useState('');
  const [inherentLikelihood, setInherentLikelihood] = useState<number>(3);
  const [inherentImpact, setInherentImpact] = useState<number>(3);
  const [usesAgenticAI, setUsesAgenticAI] = useState<boolean>(true);
  const [lifecycleState, setLifecycleState] = useState<CompanyLifecycleState>('Onboarding');
  const [contactEmail, setContactEmail] = useState('');
  const [vendorTier, setVendorTier] = useState<'Tier 1 (Critical)' | 'Tier 2 (High)' | 'Tier 3 (Medium/Low)'>('Tier 2 (High)');
  const [nextReviewDate, setNextReviewDate] = useState('2027-01-01');

  if (!isOpen) return null;

  const startAddVendor = () => {
    setName('');
    setDescription('');
    setServicesProvided('');
    setInherentLikelihood(3);
    setInherentImpact(3);
    setUsesAgenticAI(true);
    setLifecycleState('Onboarding');
    setContactEmail('');
    setVendorTier('Tier 2 (High)');
    setNextReviewDate('2027-01-01');
    setActiveTab('add');
  };

  const startEditVendor = (v: Vendor) => {
    setEditingVendorId(v.id);
    setName(v.name);
    setDescription(v.description);
    setServicesProvided(v.servicesProvided);
    setInherentLikelihood(v.inherentLikelihood);
    setInherentImpact(v.inherentImpact);
    setUsesAgenticAI(v.usesAgenticAI);
    setLifecycleState(v.lifecycleState || 'Assessment');
    setContactEmail(v.contactEmail || '');
    setVendorTier(v.vendorTier || 'Tier 2 (High)');
    setNextReviewDate(v.nextReviewDate || '2027-01-01');
    setActiveTab('edit');
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newVendor: Vendor = {
      id: `vnd-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'AI System Provider',
      servicesProvided: servicesProvided.trim() || 'AI Integration Services',
      inherentLikelihood,
      inherentImpact,
      usesAgenticAI,
      status: 'Pending',
      lifecycleState,
      contactEmail: contactEmail.trim(),
      vendorTier,
      nextReviewDate,
      answers: {},
      lastAssessedBy: 'Current Auditor',
      lastAssessedAt: new Date().toISOString()
    };

    onAddVendor(newVendor);
    setActiveTab('list');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendorId) return;

    const existing = vendors.find(v => v.id === editingVendorId);
    if (!existing) return;

    const updatedVendor: Vendor = {
      ...existing,
      name: name.trim() || existing.name,
      description: description.trim(),
      servicesProvided: servicesProvided.trim(),
      inherentLikelihood,
      inherentImpact,
      usesAgenticAI,
      lifecycleState,
      contactEmail: contactEmail.trim(),
      vendorTier,
      nextReviewDate,
      lastAssessedBy: 'Current Auditor',
      lastAssessedAt: new Date().toISOString()
    };

    onUpdateVendor(updatedVendor);
    setActiveTab('list');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Company & Vendor Lifecycle Management</h3>
              <p className="text-xs text-slate-300">Register, transition lifecycle stages, and govern AI Vendor risk portfolios</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls / Tabs */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-100 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vendor Portfolio ({vendors.length})
            </button>
            <button
              onClick={startAddVendor}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'add'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New AI Company</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Active Lifecycle Pipeline Monitoring
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          
          {/* TAB 1: LIST VENDORS */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendors.map(v => {
                  const stageObj = LIFECYCLE_STAGES.find(s => s.id === (v.lifecycleState || 'Assessment')) || LIFECYCLE_STAGES[1];
                  return (
                    <div 
                      key={v.id}
                      className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm leading-tight">{v.name}</h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{v.servicesProvided}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${stageObj.color}`}>
                            {v.lifecycleState || 'Assessment'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                          <Tag className="w-3.5 h-3.5 text-slate-400" />
                          <span>{v.vendorTier || 'Tier 2 (High)'}</span>
                          <span className="text-slate-300">•</span>
                          <span className={v.usesAgenticAI ? 'text-purple-600 font-bold' : 'text-slate-500'}>
                            {v.usesAgenticAI ? 'Agentic AI' : 'Standard AI'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {v.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-400">
                          Review: {v.nextReviewDate || '2027-01-01'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditVendor(v)}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                          >
                            Edit Lifecycle
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to offboard/remove vendor ${v.name}?`)) {
                                onDeleteVendor(v.id);
                              }
                            }}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Offboard Vendor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2 / 3: ADD OR EDIT FORM */}
          {(activeTab === 'add' || activeTab === 'edit') && (
            <form onSubmit={activeTab === 'add' ? handleSaveAdd : handleSaveEdit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Vendor Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g., Anthropic, Cohere, Internal ML Platform"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vendor Compliance Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="grc@company.ai"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Services Provided */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Services Provided & AI Integration Scope</label>
                  <input
                    type="text"
                    value={servicesProvided}
                    onChange={e => setServicesProvided(e.target.value)}
                    placeholder="e.g., Autonomous Billing Agent & RAG Knowledge Engine API"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Overview & Risk Context</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide a brief summary of how customer data and model outputs interact with corporate infrastructure..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Lifecycle State Selector */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Vendor Lifecycle State Transition</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {LIFECYCLE_STAGES.map(s => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setLifecycleState(s.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          lifecycleState === s.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-bold text-xs block">{s.label}</span>
                        <span className={`text-[10px] block line-clamp-2 mt-1 ${lifecycleState === s.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {s.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vendor Tier */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vendor Risk Tiering</label>
                  <select
                    value={vendorTier}
                    onChange={e => setVendorTier(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="Tier 1 (Critical)">Tier 1 (Critical - Core System Access)</option>
                    <option value="Tier 2 (High)">Tier 2 (High - PII / Sensitive Data)</option>
                    <option value="Tier 3 (Medium/Low)">Tier 3 (Medium/Low - Public Data Only)</option>
                  </select>
                </div>

                {/* Next Review Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Annual Review Date</label>
                  <input
                    type="date"
                    value={nextReviewDate}
                    onChange={e => setNextReviewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Inherent Likelihood & Impact */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Inherent Likelihood (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={inherentLikelihood}
                    onChange={e => setInherentLikelihood(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Inherent Impact (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={inherentImpact}
                    onChange={e => setInherentImpact(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Uses Agentic AI Toggle */}
                <div className="md:col-span-2 p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-purple-900 block">Deploys Autonomous Agentic AI Capabilities?</span>
                    <span className="text-[11px] text-purple-700 block">
                      Enables Module 3 (Agentic Autonomy, HITL Approval Gates, Tool Boundaries, & Blast Radius Limits)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUsesAgenticAI(!usesAgenticAI)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      usesAgenticAI ? 'bg-purple-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        usesAgenticAI ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{activeTab === 'add' ? 'Create & Launch Lifecycle' : 'Save Lifecycle Changes'}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
