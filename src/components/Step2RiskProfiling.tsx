/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Step 2: Contextual Risk Profiling & Tiering Component
 * Computes Inherent Risk = Impact x Probability, analyzes AI threat surfaces,
 * and classifies vendors into Tier 1 (Critical), Tier 2 (High), or Tier 3 (Standard).
 */

import React, { useState } from 'react';
import { Vendor } from '../types';
import { ShieldAlert, AlertTriangle, Activity, Flame, ShieldCheck, Target, ArrowRight, Layers, Save, CheckCircle2 } from 'lucide-react';

interface Step2RiskProfilingProps {
  vendors: Vendor[];
  selectedVendorId: string | null;
  onSelectVendor: (id: string | null) => void;
  onUpdateVendor: (vendor: Vendor) => void;
}

export default function Step2RiskProfiling({
  vendors,
  selectedVendorId,
  onSelectVendor,
  onUpdateVendor
}: Step2RiskProfilingProps) {
  const activeVendor = vendors.find(v => v.id === selectedVendorId) || (vendors.length > 0 ? vendors[0] : null);

  const [likelihood, setLikelihood] = useState<number>(activeVendor?.inherentLikelihood || 3);
  const [impact, setImpact] = useState<number>(activeVendor?.inherentImpact || 4);
  const [tier, setTier] = useState<'Tier 1 (Critical AI Risk)' | 'Tier 2 (High Risk)' | 'Tier 3 (Standard Risk)'>(
    (activeVendor?.vendorTier as any) || 'Tier 2 (High Risk)'
  );
  const [promptLeakageRisk, setPromptLeakageRisk] = useState<'High' | 'Medium' | 'Low'>('High');
  const [promptInjectionRisk, setPromptInjectionRisk] = useState<'High' | 'Medium' | 'Low'>('High');
  const [agentEscalationRisk, setAgentEscalationRisk] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const rawScore = likelihood * impact;
  const scoreMax = 25;
  const rawPct = Math.round((rawScore / scoreMax) * 100);

  const handleSaveRiskProfile = () => {
    if (!activeVendor) return;
    const updatedVendor: Vendor = {
      ...activeVendor,
      inherentLikelihood: likelihood,
      inherentImpact: impact,
      vendorTier: tier,
      lastAssessedAt: new Date().toISOString()
    };
    onUpdateVendor(updatedVendor);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-xs font-mono font-bold uppercase">
                Risk Profiling
              </span>
              <h2 className="text-xl font-display font-black tracking-tight uppercase">
                Contextual Risk Profiling & Tiering
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Calculate inherent risk (Inherent Risk = Impact × Probability), evaluate AI-specific threat vectors (prompt leakage, injection, agent escalation), and assign tiering depth.
            </p>
          </div>

          {/* Vendor Selector */}
          <div className="flex items-center gap-3 shrink-0">
            <label className="text-xs font-bold text-slate-300 uppercase font-mono">Select Vendor:</label>
            <select
              value={activeVendor ? activeVendor.id : ''}
              onChange={(e) => {
                onSelectVendor(e.target.value);
                const v = vendors.find(item => item.id === e.target.value);
                if (v) {
                  setLikelihood(v.inherentLikelihood);
                  setImpact(v.inherentImpact);
                  if (v.vendorTier) setTier(v.vendorTier as any);
                }
              }}
              className="px-3.5 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.vendorTier || 'Tier 2'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {activeVendor && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: 5x5 Impact x Probability Matrix Calculator */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-sm">1. Impact Matrix Calculation</h3>
                <p className="text-[11px] text-slate-500">Inherent Risk = Impact × Probability</p>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Probability / Likelihood:</span>
                  <span className="text-amber-600 font-mono">{likelihood} / 5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={likelihood}
                  onChange={e => setLikelihood(parseInt(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Business Impact Level:</span>
                  <span className="text-red-600 font-mono">{impact} / 5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={impact}
                  onChange={e => setImpact(parseInt(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              {/* Computed Score Display */}
              <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Inherent Risk Score</p>
                  <p className="text-2xl font-black font-display text-amber-400">{rawScore} / 25 ({rawPct}%)</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                  rawScore >= 16 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  rawScore >= 9 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {rawScore >= 16 ? 'Critical' : rawScore >= 9 ? 'High' : 'Moderate'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: AI-Specific Threat Surface */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-sm">2. AI-Specific Threat Surface</h3>
                <p className="text-[11px] text-slate-500">Assess vulnerabilities unique to GenAI & autonomous loops</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Prompt History & Fine-Tuning Data Leakage</span>
                  <select
                    value={promptLeakageRisk}
                    onChange={e => setPromptLeakageRisk(e.target.value as any)}
                    className="px-2 py-0.5 border border-slate-300 rounded font-bold text-[11px]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-500">Risk of proprietary prompts or customer text entering vendor model training sets.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Prompt Injection & Jailbreak Vulnerability</span>
                  <select
                    value={promptInjectionRisk}
                    onChange={e => setPromptInjectionRisk(e.target.value as any)}
                    className="px-2 py-0.5 border border-slate-300 rounded font-bold text-[11px]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-500">Risk of indirect prompt injection attacks overriding safety guardrails or data filters.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Agent Privilege Escalation & Runaway Loops</span>
                  <select
                    value={agentEscalationRisk}
                    onChange={e => setAgentEscalationRisk(e.target.value as any)}
                    className="px-2 py-0.5 border border-slate-300 rounded font-bold text-[11px]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-500">Risk of autonomous tools taking unapproved database writes or API mutations.</p>
              </div>
            </div>
          </div>

          {/* Card 3: Vendor Risk Tiering */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-sm">3. Risk Tier Classification</h3>
                <p className="text-[11px] text-slate-500">Dictates evaluation depth and audit frequency</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'Tier 1 (Critical AI Risk)', title: 'Tier 1 (Critical AI Risk)', desc: 'Requires full NIST AI RMF + CAIQ v4 + Graph Blast Radius + Monthly vector drift audit.' },
                { id: 'Tier 2 (High Risk)', title: 'Tier 2 (High Risk)', desc: 'Requires standard controls audit, bi-annual re-certification & evidence RAG checks.' },
                { id: 'Tier 3 (Standard Risk)', title: 'Tier 3 (Standard Risk)', desc: 'Requires baseline privacy attestation & annual questionnaire review.' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTier(t.id as any)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                    tier === t.id
                      ? 'bg-amber-50/80 border-amber-300 text-slate-900 shadow-2xs font-bold'
                      : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{t.title}</span>
                    <span className={`w-3.5 h-3.5 rounded-full border ${tier === t.id ? 'bg-amber-600 border-amber-600' : 'border-slate-300'}`} />
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-1 leading-relaxed">{t.desc}</p>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSaveRiskProfile}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Risk Profile & Tiering</span>
            </button>
            {saveSuccess && (
              <p className="text-center text-xs text-emerald-600 font-bold mt-2 animate-fadeIn">
                ✓ Risk Profile & Tiering Updated!
              </p>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
