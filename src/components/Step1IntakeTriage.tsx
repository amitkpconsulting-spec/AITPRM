/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Step 1: Intake & AI System Triage Component
 * Categorizes AI deployments, agentic capabilities, and data sensitivity scope.
 */

import React, { useState } from 'react';
import { Vendor } from '../types';
import { Sparkles, Cpu, Shield, Database, Lock, AlertCircle, CheckCircle2, Save, Users, Layers, Activity, ArrowRight, Bot, Server, FileText } from 'lucide-react';

interface Step1IntakeTriageProps {
  vendors: Vendor[];
  selectedVendorId: string | null;
  onSelectVendor: (id: string | null) => void;
  onUpdateVendor: (vendor: Vendor) => void;
  onAddVendor: (vendor: { name: string; servicesProvided: string; description: string; usesAgenticAI: boolean; inherentLikelihood: number; inherentImpact: number }) => string;
}

export default function Step1IntakeTriage({
  vendors,
  selectedVendorId,
  onSelectVendor,
  onUpdateVendor,
  onAddVendor
}: Step1IntakeTriageProps) {
  const activeVendor = vendors.find(v => v.id === selectedVendorId) || (vendors.length > 0 ? vendors[0] : null);

  // Local form state for selected vendor triage
  const [aiTypes, setAiTypes] = useState<string[]>(['Autonomous Agents', 'Generative AI']);
  const [hasToolExecution, setHasToolExecution] = useState(true);
  const [hasAutonomousDecision, setHasAutonomousDecision] = useState(true);
  const [hasPersistentMemory, setHasPersistentMemory] = useState(false);
  const [hasPii, setHasPii] = useState(true);
  const [hasIp, setHasIp] = useState(true);
  const [hasRegulatedData, setHasRegulatedData] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleAiType = (type: string) => {
    if (aiTypes.includes(type)) {
      setAiTypes(aiTypes.filter(t => t !== type));
    } else {
      setAiTypes([...aiTypes, type]);
    }
  };

  const handleSaveTriage = () => {
    if (!activeVendor) return;
    const isAgentic = aiTypes.includes('Autonomous Agents') || hasToolExecution || hasAutonomousDecision;
    const updatedVendor: Vendor = {
      ...activeVendor,
      usesAgenticAI: isAgentic,
      description: `${activeVendor.description} | AI Triage: [${aiTypes.join(', ')}]`,
      lastAssessedAt: new Date().toISOString()
    };
    onUpdateVendor(updatedVendor);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-mono font-bold uppercase">
                Intake & AI Triage
              </span>
              <h2 className="text-xl font-display font-black tracking-tight uppercase">
                Intake & AI System Triage
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Before reviewing security policies, classify whether the vendor utilizes or provides Artificial Intelligence, check agentic tool privileges, and scope data sensitivity.
            </p>
          </div>

          {/* Vendor Selector */}
          <div className="flex items-center gap-3 shrink-0">
            <label className="text-xs font-bold text-slate-300 uppercase font-mono">Select Vendor:</label>
            <select
              value={activeVendor ? activeVendor.id : ''}
              onChange={(e) => onSelectVendor(e.target.value)}
              className="px-3.5 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} {v.usesAgenticAI ? '(Agentic AI)' : '(Standard)'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {activeVendor ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: AI Deployment Categorization */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-sm">1. AI Model Categorization</h3>
                <p className="text-[11px] text-slate-500">Determine system architecture & underlying model type</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'Predictive Models', title: 'Predictive Models', desc: 'Statistical ML, regression, classification & risk scoring algorithms.' },
                { id: 'Generative AI', title: 'Generative AI', desc: 'LLMs, image/multimodal generation, prompt completion APIs.' },
                { id: 'Autonomous Agents', title: 'Autonomous Agents', desc: 'Agentic workflows with planning, execution loops & API tools.' },
                { id: 'Fine-Tuned LLMs', title: 'Fine-Tuned LLMs', desc: 'Custom weights fine-tuned on proprietary enterprise domain data.' }
              ].map(item => {
                const isSelected = aiTypes.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAiType(item.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 text-slate-900 shadow-2xs'
                        : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] font-bold ${
                        isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected ? '✓' : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 2: Agentic Capability Check */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-sm">2. Agentic Capability Check</h3>
                <p className="text-[11px] text-slate-500">Flag tool execution, autonomy & memory persistence</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Tool-Execution Privileges</span>
                  <input
                    type="checkbox"
                    checked={hasToolExecution}
                    onChange={e => setHasToolExecution(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Can the agent invoke external APIs, webhooks, code interpreters, or database queries?</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Autonomous Decision Loops</span>
                  <input
                    type="checkbox"
                    checked={hasAutonomousDecision}
                    onChange={e => setHasAutonomousDecision(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Does the system execute multi-step reasoning without mandatory Human-In-The-Loop approval?</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Persistent Long-Term Memory</span>
                  <input
                    type="checkbox"
                    checked={hasPersistentMemory}
                    onChange={e => setHasPersistentMemory(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Does the agent retain vector memory embeddings across user sessions and tenant boundaries?</p>
              </div>
            </div>
          </div>

          {/* Card 3: Data Sensitivity Scope */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-sm">3. Data Sensitivity Scope</h3>
                <p className="text-[11px] text-slate-500">Scope datasets used for training, fine-tuning or RAG</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Enterprise PII Processing</span>
                  <input
                    type="checkbox"
                    checked={hasPii}
                    onChange={e => setHasPii(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Includes customer PII, employee identifiers, or health/financial records.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Proprietary IP & Source Code</span>
                  <input
                    type="checkbox"
                    checked={hasIp}
                    onChange={e => setHasIp(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Includes trade secrets, internal source code repositories, or confidential strategy.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Regulated Datasets (EU AI Act / HIPAA)</span>
                  <input
                    type="checkbox"
                    checked={hasRegulatedData}
                    onChange={e => setHasRegulatedData(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Subject to statutory audit obligations or biometric / high-risk AI classification.</p>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveTriage}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Intake & System Triage</span>
              </button>
              {saveSuccess && (
                <p className="text-center text-xs text-emerald-600 font-bold mt-2 animate-fadeIn">
                  ✓ Vendor Triage Classification Saved!
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
          <p className="text-sm font-bold text-slate-600">No vendor selected. Please add or select a vendor to begin Triage.</p>
        </div>
      )}
    </div>
  );
}
