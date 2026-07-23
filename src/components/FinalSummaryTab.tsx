/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Vendor, ControlItem, getRiskDetails } from '../types';
import { Shield, AlertTriangle, CheckCircle, FileText, Layers, Activity, Sparkles, TrendingUp, Info, HelpCircle, XCircle, FileSpreadsheet, ArrowRight, CornerDownRight } from 'lucide-react';

interface FinalSummaryTabProps {
  vendors: Vendor[];
  masterControls: ControlItem[];
  onSelectVendorToAssess: (vendorId: string) => void;
}

// 4 NIST AI RMF Categories
type RmfCategory = 'Govern' | 'Map' | 'Measure' | 'Manage';

interface CategoryConfig {
  id: RmfCategory;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

const RMF_CATEGORIES: CategoryConfig[] = [
  {
    id: 'Govern',
    title: 'Govern',
    description: 'Establishes a risk management culture, accountability, and organizational processes to guide AI strategy.',
    color: 'rgb(79, 110, 229)', // indigo
    bgColor: 'bg-indigo-50/70',
    borderColor: 'border-indigo-100',
    textColor: 'text-indigo-700'
  },
  {
    id: 'Map',
    title: 'Map',
    description: 'Contextualizes and identifies risks, mapping the intended purpose, data, and potential impacts across the AI lifecycle.',
    color: 'rgb(14, 165, 233)', // sky blue
    bgColor: 'bg-sky-50/70',
    borderColor: 'border-sky-100',
    textColor: 'text-sky-700'
  },
  {
    id: 'Measure',
    title: 'Measure',
    description: 'Evaluates and analyzes mapped AI risks using quantitative, qualitative, or mixed-method testing and monitoring.',
    color: 'rgb(245, 158, 11)', // amber
    bgColor: 'bg-amber-50/70',
    borderColor: 'border-amber-100',
    textColor: 'text-amber-800'
  },
  {
    id: 'Manage',
    title: 'Manage',
    description: 'Prioritizes and implements ongoing risk mitigation strategies while dedicating resources to continuous improvement.',
    color: 'rgb(16, 185, 129)', // emerald
    bgColor: 'bg-emerald-50/70',
    borderColor: 'border-emerald-100',
    textColor: 'text-emerald-700'
  }
];

// Controls mapping to NIST AI RMF
const CONTROL_TO_RMF: Record<string, RmfCategory> = {
  // Govern
  'm1-residency': 'Govern',
  'm2-lineage': 'Govern',
  'm3-autonomy': 'Govern',
  // Map
  'm1-pseudonym': 'Map',
  'm1-crossborder': 'Map',
  'm3-tools': 'Map',
  // Measure
  'm2-bias': 'Measure',
  'm2-drift': 'Measure',
  'm2-redteam': 'Measure',
  // Manage
  'm1-encryption': 'Manage',
  'm2-owasp': 'Manage',
  'm3-hitl': 'Manage',
  'm3-blast': 'Manage'
};

export default function FinalSummaryTab({
  vendors,
  masterControls,
  onSelectVendorToAssess
}: FinalSummaryTabProps) {
  // Selected Vendor State
  const [selectedVendorId, setSelectedVendorId] = useState<string>(
    vendors.length > 0 ? vendors[0].id : ''
  );

  const activeVendor = useMemo(() => {
    return vendors.find(v => v.id === selectedVendorId) || null;
  }, [vendors, selectedVendorId]);

  // Calculate scores per NIST category for active vendor
  const rmfScores = useMemo<Record<
    RmfCategory, 
    { score: number; total: number; percentage: number; implemented: ControlItem[]; pending: ControlItem[] }
  >>(() => {
    if (!activeVendor) {
      return {
        Govern: { score: 0, total: 0, percentage: 0, implemented: [], pending: [] },
        Map: { score: 0, total: 0, percentage: 0, implemented: [], pending: [] },
        Measure: { score: 0, total: 0, percentage: 0, implemented: [], pending: [] },
        Manage: { score: 0, total: 0, percentage: 0, implemented: [], pending: [] }
      };
    }

    // Initialize scores structure
    const results: Record<
      RmfCategory, 
      { score: number; total: number; percentage: number; implemented: ControlItem[]; pending: ControlItem[] }
    > = {
      Govern: { score: 0, total: 0, percentage: 0, implemented: [], pending: [] },
      Map: { score: 0, total: 0, percentage: 0, implemented: [], pending: [] },
      Measure: { score: 0, total: 0, percentage: 0, implemented: [], pending: [] },
      Manage: { score: 0, total: 0, percentage: 0, implemented: [], pending: [] }
    };

    // Filter controls by what is scoped in
    const scopedCtrls = masterControls.filter(c => c.module !== 'agentic-ai' || activeVendor.usesAgenticAI);

    scopedCtrls.forEach(ctrl => {
      const cat = CONTROL_TO_RMF[ctrl.id];
      if (!cat) return;

      results[cat].total += ctrl.weight;
      
      const ans = activeVendor.answers[ctrl.id];
      if (ans && ans.isImplemented) {
        const factor = ans.maturity === 'Optimized' ? 1.0 : ans.maturity === 'Managed' ? 0.7 : 0.3;
        results[cat].score += ctrl.weight * factor;
        results[cat].implemented.push(ctrl);
      } else {
        results[cat].pending.push(ctrl);
      }
    });

    // Compute percentages
    RMF_CATEGORIES.forEach(cat => {
      const data = results[cat.id];
      data.percentage = data.total > 0 ? Math.round((data.score / data.total) * 100) : 0;
    });

    return results;
  }, [activeVendor, masterControls]);

  // Overall compliance percent across NIST AI RMF
  const overallComplianceScore = useMemo(() => {
    let totalScore = 0;
    let totalMax = 0;
    RMF_CATEGORIES.forEach(cat => {
      const scoreData = rmfScores[cat.id];
      totalScore += scoreData.score;
      totalMax += scoreData.total;
    });
    return totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  }, [rmfScores]);

  // Compute overall Residual Risk details
  const residualRisk = useMemo(() => {
    if (!activeVendor) return null;
    const scoreResult = overallComplianceScore;
    
    const residualLikelihood = Math.max(1, Math.round(activeVendor.inherentLikelihood - (scoreResult / 100) * (activeVendor.inherentLikelihood - 1) * 1.5));
    const residualImpact = Math.max(1, Math.round(activeVendor.inherentImpact - (scoreResult / 100) * (activeVendor.inherentImpact - 1) * 0.5));
    
    return {
      likelihood: residualLikelihood,
      impact: residualImpact,
      details: getRiskDetails(residualLikelihood, residualImpact)
    };
  }, [activeVendor, overallComplianceScore]);

  // Interactive Selected Category State for Detailed Showcase
  const [selectedRmfTab, setSelectedRmfTab] = useState<RmfCategory>('Govern');

  // Coordinates helper for Custom SVG Radar Chart (Center: 200, 200; Radius: 120)
  const radarChartData = useMemo(() => {
    const cx = 200;
    const cy = 200;
    const r = 120;

    // Angles: Govern=0, Map=90, Measure=180, Manage=270
    // We deduct Math.PI/2 to make Govern point straight UP
    const getCoordinates = (percentage: number, index: number) => {
      const angle = (index * Math.PI) / 2 - Math.PI / 2;
      const length = (percentage / 100) * r;
      return {
        x: cx + length * Math.cos(angle),
        y: cy + length * Math.sin(angle)
      };
    };

    const categoriesList: RmfCategory[] = ['Govern', 'Map', 'Measure', 'Manage'];
    
    // Vendor Polygon path
    const points = categoriesList.map((cat, idx) => {
      const pct = rmfScores[cat].percentage;
      return getCoordinates(pct, idx);
    });

    const polygonPointsStr = points.map(p => `${p.x},${p.y}`).join(' ');

    // Concentric grid diamonds (25%, 50%, 75%, 100%)
    const grids = [25, 50, 75, 100].map(pct => {
      const gridPoints = categoriesList.map((_, idx) => getCoordinates(pct, idx));
      return gridPoints.map(p => `${p.x},${p.y}`).join(' ');
    });

    // Outer label positions
    const labelPositions = categoriesList.map((_, idx) => {
      const angle = (idx * Math.PI) / 2 - Math.PI / 2;
      // offset a bit further out than r
      const labelRadius = r + 24;
      return {
        x: cx + labelRadius * Math.cos(angle),
        y: cy + labelRadius * Math.sin(angle)
      };
    });

    return {
      cx,
      cy,
      r,
      points,
      polygonPointsStr,
      grids,
      labelPositions
    };
  }, [rmfScores]);

  if (vendors.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-4">
        <Shield className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-display font-extrabold text-slate-800 text-lg">No Vendor Portfolios Available</h3>
        <p className="text-slate-500 text-xs">Create or load a vendor first to see RMF executive dashboards.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Controller Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
              <Shield className="w-4 h-4" />
            </span>
            <h2 className="font-display font-bold text-slate-900 text-base">NIST AI Risk Management Framework (RMF) Summary</h2>
          </div>
          <p className="text-slate-500 text-[11px] font-medium">
            Executive oversight, alignment dashboard, and control maturity breakdown against NIST SP 1270.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-600 shrink-0">Select Target Vendor:</label>
          <select
            value={selectedVendorId}
            onChange={e => setSelectedVendorId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 cursor-pointer focus:ring-1 focus:ring-indigo-600 outline-hidden min-w-[200px]"
          >
            {vendors.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeVendor && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Metrics & Radar Chart */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Vendor Profile & Rating Highlights */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase">
                  ACTIVE DOSSIER
                </span>
                <h3 className="font-display font-black text-slate-900 text-lg mt-1">{activeVendor.name}</h3>
                <p className="text-slate-500 text-[11px] leading-relaxed mt-1 font-medium italic">
                  "{activeVendor.servicesProvided}"
                </p>
              </div>

              {/* Stats Block */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-250 text-center">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">RMF Compliance</span>
                  <span className="text-2xl font-display font-black text-indigo-700 block mt-0.5">
                    {overallComplianceScore}%
                  </span>
                  <span className="text-[9px] font-semibold text-slate-500">Aggregate Score</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-250 text-center flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">Residual Risk</span>
                    {residualRisk && (
                      <span className={`text-xs font-mono font-black uppercase mt-1 inline-block px-2 py-0.5 rounded-md ${residualRisk.details.color}`}>
                        {residualRisk.details.category}
                      </span>
                    )}
                  </div>
                  {residualRisk && (
                    <span className="text-[9px] text-slate-500 block">
                      Score: {residualRisk.likelihood} × {residualRisk.impact} = {residualRisk.details.score}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Gauges */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold text-slate-600 block uppercase">NIST Core Strengths</span>
                <div className="space-y-2">
                  {RMF_CATEGORIES.map(cat => {
                    const pct = rmfScores[cat.id].percentage;
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-slate-700">{cat.title}</span>
                          <span className="font-mono font-bold text-slate-600">{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${pct}%`, 
                              backgroundColor: cat.color 
                            }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {activeVendor.status === 'Pending' && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2 text-rose-800 text-[10px]">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-500 mt-0.5" />
                  <div>
                    <span className="font-bold block">Assessment is Pending</span>
                    <span>No controls have been evaluated for this vendor yet. Aligned scores are initialized to baseline values.</span>
                    <button
                      onClick={() => onSelectVendorToAssess(activeVendor.id)}
                      className="mt-1.5 flex items-center gap-1 font-bold text-rose-700 hover:text-rose-900 cursor-pointer"
                    >
                      <span>Start Assessment Wizard</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Columns: NIST Categories Detailed Showcase */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Horizontal Segment Tabs */}
            <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-2xs flex overflow-x-auto gap-1">
              {RMF_CATEGORIES.map(cat => {
                const isSelected = selectedRmfTab === cat.id;
                const score = rmfScores[cat.id].percentage;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedRmfTab(cat.id)}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-1 border ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-white border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] font-mono tracking-wider block uppercase">{cat.title}</span>
                    <span className="text-base font-display font-black block">{score}%</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Category Blueprint Showcase */}
            {(() => {
              const catData = RMF_CATEGORIES.find(c => c.id === selectedRmfTab)!;
              const stats = rmfScores[selectedRmfTab];
              return (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Category Blueprint Header */}
                  <div className={`${catData.bgColor} border ${catData.borderColor} p-5 rounded-2xl space-y-3`}>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase">
                          NIST core function
                        </span>
                        <h3 className="font-display font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                          {catData.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500">Maturity Performance:</span>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                          stats.percentage >= 80 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : stats.percentage >= 50
                            ? 'bg-amber-50 text-amber-800 border-amber-100'
                            : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          {stats.percentage}% COMPLIANT
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed font-medium">
                      {catData.description}
                    </p>
                  </div>

                  {/* Side-by-Side: What is Good vs. What is Not */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* What is Good (Strengths) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
                      <div className="bg-emerald-50 border-b border-slate-100 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </span>
                          <span className="font-display font-bold text-emerald-950 text-xs">WHAT IS GOOD (Strengths)</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                          {stats.implemented.length} Verified
                        </span>
                      </div>

                      <div className="p-4 space-y-4 flex-1">
                        {stats.implemented.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 space-y-2">
                            <Info className="w-8 h-8 mx-auto text-slate-300" />
                            <p className="text-[10px] font-semibold">No mature strengths identified.</p>
                            <p className="text-[9px] leading-normal text-slate-400">Implement controls and document evidence with the wizard to build score weights.</p>
                          </div>
                        ) : (
                          stats.implemented.map(ctrl => {
                            const ans = activeVendor.answers[ctrl.id];
                            return (
                              <div key={ctrl.id} className="border border-slate-100 rounded-lg p-3 hover:border-slate-200 transition-all space-y-2.5">
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <div className="flex items-center gap-1.5 text-[9px] font-mono">
                                      <span className="bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-bold">{ctrl.code}</span>
                                      <span className="text-slate-400 truncate max-w-[120px]">{ctrl.frameworkMapping}</span>
                                    </div>
                                    <h4 className="font-semibold text-slate-900 text-xs mt-1 leading-relaxed">{ctrl.question}</h4>
                                  </div>
                                  <span className="shrink-0 bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-[9px] font-bold font-mono">
                                    {ans?.maturity} ({(ans?.maturity === 'Optimized' ? 100 : 70)}%)
                                  </span>
                                </div>

                                {ans?.safeguards && (
                                  <div className="bg-slate-50 p-2 rounded text-[10px] border border-slate-150">
                                    <span className="font-bold text-slate-500 block">Safeguards:</span>
                                    <p className="text-slate-700 font-medium leading-relaxed mt-0.5">{ans.safeguards}</p>
                                  </div>
                                )}

                                {ans?.evidence && (
                                  <div className="flex items-start gap-1 text-[9px] text-slate-400 leading-normal">
                                    <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.2 shrink-0" />
                                    <span><span className="font-bold text-slate-500">Evidence Notes:</span> {ans.evidence}</span>
                                  </div>
                                )}

                                {ans?.uploadedFiles && ans.uploadedFiles.length > 0 && (
                                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                    {ans.uploadedFiles.map(file => (
                                      <div key={file.id} className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-[8px] px-1.5 py-0.2 rounded font-semibold text-indigo-700">
                                        <FileText className="w-2.5 h-2.5" />
                                        <span>{file.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* What is Not (Weaknesses / Gaps) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
                      <div className="bg-rose-50 border-b border-slate-100 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-rose-100 rounded-lg text-rose-700 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5" />
                          </span>
                          <span className="font-display font-bold text-rose-950 text-xs">WHAT IS NOT (Gaps & Weaknesses)</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded-md">
                          {stats.pending.length} Unresolved
                        </span>
                      </div>

                      <div className="p-4 space-y-4 flex-1">
                        {stats.pending.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 space-y-2">
                            <CheckCircle className="w-8 h-8 mx-auto text-emerald-400" />
                            <p className="text-[10px] font-bold text-slate-700">All Core Controls Fully Implemented!</p>
                            <p className="text-[9px] leading-normal text-slate-400">This category has achieved maximum possible baseline defense scoring.</p>
                          </div>
                        ) : (
                          stats.pending.map(ctrl => {
                            const ans = activeVendor.answers[ctrl.id];
                            const riskImp = ans?.riskImpact || 'Medium';
                            const riskProb = ans?.riskProbability || 'Medium';
                            const riskRat = ans?.riskRating || 'Medium';

                            return (
                              <div key={ctrl.id} className="border border-slate-100 rounded-lg p-3 hover:border-slate-200 transition-all space-y-2">
                                <div>
                                  <div className="flex justify-between items-center text-[9px] font-mono">
                                    <div className="flex items-center gap-1.5">
                                      <span className="bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-bold">{ctrl.code}</span>
                                      <span className="text-slate-400 truncate max-w-[120px]">{ctrl.frameworkMapping}</span>
                                    </div>
                                    <span className="text-rose-500 font-bold bg-rose-50 border border-rose-100 px-1.5 py-0.2 rounded">
                                      Deficient / Not Met
                                    </span>
                                  </div>
                                  <h4 className="font-semibold text-slate-900 text-xs mt-1 leading-relaxed">{ctrl.question}</h4>
                                </div>

                                {/* Profiling Detail */}
                                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded text-[9px] border border-slate-150">
                                  <div>
                                    <span className="text-slate-400 uppercase font-bold block">Impact</span>
                                    <span className="font-bold text-slate-700">{riskImp}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 uppercase font-bold block">Probability</span>
                                    <span className="font-bold text-slate-700">{riskProb}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 uppercase font-bold block">Risk Rating</span>
                                    <span className={`font-bold ${
                                      riskRat === 'Critical' ? 'text-red-700' : riskRat === 'High' ? 'text-orange-600' : 'text-slate-600'
                                    }`}>
                                      {riskRat}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex justify-between items-center pt-1 text-[10px]">
                                  <span className="text-slate-400 font-medium">Control baseline weight: {ctrl.weight}</span>
                                  <button
                                    onClick={() => onSelectVendorToAssess(activeVendor.id)}
                                    className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <span>Remediate in Wizard</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              );
            })()}

            {/* NIST AI RMF Playbook Advisory Guidance */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h4 className="font-display font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>NIST SP 1270 Playbook Advisory Actions</span>
              </h4>
              <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed font-medium">
                <div className="flex gap-2">
                  <span className="text-indigo-600 font-mono font-bold">01.</span>
                  <div>
                    <span className="font-bold text-slate-800 block">Deploy Continuous Drift Monitoring (Measure)</span>
                    <span>For models in active training pipelines, regular concepts monitoring is critical to prevent concept degradation. Enforce metric collections.</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-indigo-600 font-mono font-bold">02.</span>
                  <div>
                    <span className="font-bold text-slate-800 block">Audit Agentic Rate Boundaries (Manage)</span>
                    <span>Ensure that maximum autonomous loops, sandbox Connectors, and recursion caps are enforced server-side to prevent system lockouts or cascading outages.</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-indigo-600 font-mono font-bold">03.</span>
                  <div>
                    <span className="font-bold text-slate-800 block">Perform Regular Safety Red-Teaming (Measure)</span>
                    <span>Review adversarial reports and jailbreak mitigation results quarterly. Document exceptions with detailed safeguards.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
