/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Step 5: Continuous Monitoring & Dynamic Re-Assessment Component
 * Model Drift tracking, Threat Feed monitoring, and Dynamic Framework Cross-Walking
 * (Mapping CAIQ controls to EU AI Act & ISO 42001 requirements).
 */

import React, { useState } from 'react';
import { Vendor } from '../types';
import { Activity, ShieldAlert, RefreshCw, AlertCircle, CheckCircle2, Globe, Sparkles, Filter, ExternalLink, ArrowRight } from 'lucide-react';

interface Step5ContinuousMonitoringProps {
  vendors: Vendor[];
  selectedVendorId: string | null;
  onSelectVendor: (id: string | null) => void;
}

export default function Step5ContinuousMonitoring({
  vendors,
  selectedVendorId,
  onSelectVendor
}: Step5ContinuousMonitoringProps) {
  const activeVendor = vendors.find(v => v.id === selectedVendorId) || (vendors.length > 0 ? vendors[0] : null);

  const [activeTab, setActiveTab] = useState<'drift' | 'threats' | 'crosswalk'>('drift');

  // Simulated Model Drift Alerts
  const driftAlerts = [
    {
      id: 'drift-1',
      modelName: 'Cognitive-LLM v4.2 -> v4.5',
      vendorName: 'CognitiveScale AI',
      metric: 'Toxicity & Bias Deviation',
      change: '+12.4%',
      status: 'Action Required',
      timestamp: '2026-07-22 14:30',
      description: 'Vendor updated foundational model weights without prior change advisory. Triggering automated re-eval on CC6.1 & m2-bias.'
    },
    {
      id: 'drift-2',
      modelName: 'NeuralAgent-Vision v2.0',
      vendorName: 'NeuralVision Corp',
      metric: 'Tool Execution Hallucination Rate',
      change: '+4.1%',
      status: 'Monitored',
      timestamp: '2026-07-20 09:15',
      description: 'Minor variance detected in multi-modal OCR output parser. Confidence score remains above 92% threshold.'
    }
  ];

  // Threat Feed Alerts
  const threatFeeds = [
    {
      id: 'threat-101',
      title: 'Zero-Day Prompt Injection via PDF Metadata (CVE-2026-9182)',
      severity: 'CRITICAL',
      affectedVendor: 'CognitiveScale AI',
      mitigation: 'Verify HITL approval gates & sanitizer middleware (m2-owasp)',
      source: 'NIST NVD / MITRE ATLAS'
    },
    {
      id: 'threat-102',
      title: 'Supply Chain Dependency Drift in LangChain RAG Connectors',
      severity: 'HIGH',
      affectedVendor: 'Agentic Flow Systems',
      mitigation: 'Verify pin-locked package dependencies in vendor SBOM',
      source: 'OWASP Top 10 for LLMs'
    }
  ];

  // Dynamic Framework Cross-Walk Matrix (CAIQ -> EU AI Act -> ISO 42001)
  const crosswalkMatrix = [
    {
      caiqCode: 'AIS-01.1',
      controlTitle: 'AI System Inventory & Model Cards',
      euAiActArticle: 'Article 11 (Technical Documentation & Registration)',
      iso42001Clause: 'Clause 6.1 (Actions to address AI risks)',
      status: 'Mapped & Compliant'
    },
    {
      caiqCode: 'AIS-02.3',
      controlTitle: 'Data Quality & Bias Testing',
      euAiActArticle: 'Article 10 (Data & Data Governance)',
      iso42001Clause: 'Clause 8.2 (AI System Assessment)',
      status: 'Mapped & Compliant'
    },
    {
      caiqCode: 'AIS-04.2',
      controlTitle: 'Human Oversight & Override (HITL)',
      euAiActArticle: 'Article 14 (Human Oversight)',
      iso42001Clause: 'Clause 8.4 (AI System Impact)',
      status: 'Partial Match (Review Required)'
    },
    {
      caiqCode: 'AIS-05.1',
      controlTitle: 'Robustness, Security & Red-Teaming',
      euAiActArticle: 'Article 15 (Accuracy, Robustness & Cybersecurity)',
      iso42001Clause: 'Clause 9.1 (Monitoring & Measurement)',
      status: 'Mapped & Compliant'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-mono font-bold uppercase">
                Continuous Monitoring
              </span>
              <h2 className="text-xl font-display font-black tracking-tight uppercase">
                Continuous Monitoring & Dynamic Re-Assessment
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              AI risk is non-static. Track model drift triggers, zero-day threat feeds, and run dynamic multi-framework cross-walking across CSA CAIQ, EU AI Act, and ISO 42001.
            </p>
          </div>

          {/* Vendor Selector */}
          <div className="flex items-center gap-3 shrink-0">
            <label className="text-xs font-bold text-slate-300 uppercase font-mono">Select Vendor:</label>
            <select
              value={activeVendor ? activeVendor.id : ''}
              onChange={(e) => onSelectVendor(e.target.value)}
              className="px-3.5 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('drift')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            activeTab === 'drift'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Model Drift & Base Model Updates
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('threats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            activeTab === 'threats'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Zero-Day Threat Feed Tracking
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('crosswalk')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            activeTab === 'crosswalk'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Multi-Framework Cross-Walk (CAIQ ➔ EU AI Act ➔ ISO 42001)
        </button>
      </div>

      {/* View 1: Model Drift */}
      {activeTab === 'drift' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-bold text-slate-900 text-sm">Automated Model Drift Monitor</h3>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-mono font-bold">
                Live Vector Telemetry
              </span>
            </div>

            <div className="space-y-3">
              {driftAlerts.map(alert => (
                <div key={alert.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{alert.modelName} ({alert.vendorName})</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      alert.status === 'Action Required' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{alert.description}</p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                    <span>Metric: <strong>{alert.metric}</strong> ({alert.change})</span>
                    <span>Timestamp: {alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View 2: Zero-Day Threat Feeds */}
      {activeTab === 'threats' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h3 className="font-display font-bold text-slate-900 text-sm">External AI Threat Surface Feeds</h3>
              </div>
              <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-[10px] font-mono font-bold">
                MITRE ATLAS & OWASP Feed
              </span>
            </div>

            <div className="space-y-3">
              {threatFeeds.map(feed => (
                <div key={feed.id} className="p-4 bg-red-50/50 border border-red-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-900 text-xs">{feed.title}</span>
                    <span className="px-2 py-0.5 bg-red-600 text-white font-mono text-[10px] font-bold rounded">
                      {feed.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">Affected Vendor: <strong>{feed.affectedVendor}</strong></p>
                  <p className="text-xs text-slate-600">Mitigation Safeguard: <span className="font-mono text-slate-900">{feed.mitigation}</span></p>
                  <span className="text-[10px] text-slate-400 font-mono">Source: {feed.source}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View 3: Multi-Framework Cross-Walking */}
      {activeTab === 'crosswalk' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              <h3 className="font-display font-bold text-slate-900 text-sm">CSA CAIQ v4 ➔ EU AI Act ➔ ISO/IEC 42001 Cross-Walk Matrix</h3>
            </div>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-mono font-bold">
              Dynamic Regulatory Harmonization
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase font-mono text-[10px] border-b border-slate-200">
                  <th className="p-3">CAIQ v4 Code</th>
                  <th className="p-3">Control Domain</th>
                  <th className="p-3">EU AI Act Statutory Clause</th>
                  <th className="p-3">ISO 42001 Standard Mapping</th>
                  <th className="p-3">Harmonization Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {crosswalkMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-indigo-600">{row.caiqCode}</td>
                    <td className="p-3 font-bold text-slate-800">{row.controlTitle}</td>
                    <td className="p-3 text-slate-600">{row.euAiActArticle}</td>
                    <td className="p-3 text-slate-600">{row.iso42001Clause}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
