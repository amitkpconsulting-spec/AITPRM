/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Alignment Map (Radar) Interactive Visualizer Component
 * High-contrast 4-axis SVG Radar chart mapping NIST AI RMF core functions
 * (Govern, Map, Measure, Manage) for Third-Party AI Vendors.
 */

import React, { useState, useMemo } from 'react';
import { Vendor, ControlItem, getRiskDetails } from '../types';
import { Shield, AlertTriangle, CheckCircle, FileText, Activity, ArrowRight, XCircle, Info, Compass, Target, RefreshCw } from 'lucide-react';

interface AlignmentMapRadarTabProps {
  vendors: Vendor[];
  masterControls: ControlItem[];
  onSelectVendorToAssess: (vendorId: string) => void;
}

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
    color: '#4f46e5', // indigo
    bgColor: 'bg-indigo-50/70',
    borderColor: 'border-indigo-100',
    textColor: 'text-indigo-700'
  },
  {
    id: 'Map',
    title: 'Map',
    description: 'Contextualizes and identifies risks, mapping the intended purpose, data, and potential impacts across the AI lifecycle.',
    color: '#0284c7', // sky
    bgColor: 'bg-sky-50/70',
    borderColor: 'border-sky-100',
    textColor: 'text-sky-700'
  },
  {
    id: 'Measure',
    title: 'Measure',
    description: 'Evaluates and analyzes mapped AI risks using quantitative, qualitative, or mixed-method testing and monitoring.',
    color: '#d97706', // amber
    bgColor: 'bg-amber-50/70',
    borderColor: 'border-amber-100',
    textColor: 'text-amber-800'
  },
  {
    id: 'Manage',
    title: 'Manage',
    description: 'Prioritizes and implements ongoing risk mitigation strategies while dedicating resources to continuous improvement.',
    color: '#059669', // emerald
    bgColor: 'bg-emerald-50/70',
    borderColor: 'border-emerald-100',
    textColor: 'text-emerald-700'
  }
];

const CONTROL_TO_RMF: Record<string, RmfCategory> = {
  'm1-residency': 'Govern',
  'm2-lineage': 'Govern',
  'm3-autonomy': 'Govern',
  'm1-pseudonym': 'Map',
  'm1-crossborder': 'Map',
  'm3-tools': 'Map',
  'm2-bias': 'Measure',
  'm2-drift': 'Measure',
  'm2-redteam': 'Measure',
  'm1-encryption': 'Manage',
  'm2-owasp': 'Manage',
  'm3-hitl': 'Manage',
  'm3-blast': 'Manage'
};

export default function AlignmentMapRadarTab({
  vendors,
  masterControls,
  onSelectVendorToAssess
}: AlignmentMapRadarTabProps) {
  const [selectedVendorId, setSelectedVendorId] = useState<string>(
    vendors.length > 0 ? vendors[0].id : ''
  );
  const [selectedRmfTab, setSelectedRmfTab] = useState<RmfCategory>('Govern');

  const activeVendor = useMemo(() => {
    return vendors.find(v => v.id === selectedVendorId) || null;
  }, [vendors, selectedVendorId]);

  // Compute category scores
  const rmfScores = useMemo<Record<
    RmfCategory, 
    { score: number; total: number; percentage: number; implemented: ControlItem[]; pending: ControlItem[] }
  >>(() => {
    const results: Record<
      RmfCategory, 
      { score: number; total: number; percentage: number; implemented: ControlItem[]; pending: ControlItem[] }
    > = {
      Govern: { score: 0, total: 0, percentage: 0, implemented: [], pending: [] },
      Map: { score: 0, total: 0, percentage: 0, implemented: [], pending: [] },
      Measure: { score: 0, total: 0, percentage: 0, implemented: [], pending: [] },
      Manage: { score: 0, total: 0, percentage: 0, implemented: [], pending: [] }
    };

    if (!activeVendor) return results;

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

    RMF_CATEGORIES.forEach(cat => {
      const data = results[cat.id];
      data.percentage = data.total > 0 ? Math.round((data.score / data.total) * 100) : 0;
    });

    return results;
  }, [activeVendor, masterControls]);

  // Overall compliance score
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

  // Residual risk calculation
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

  // Radar SVG Math
  const radarChartData = useMemo(() => {
    const cx = 220;
    const cy = 220;
    const r = 140;

    const getCoordinates = (percentage: number, index: number) => {
      const angle = (index * Math.PI) / 2 - Math.PI / 2;
      const length = (percentage / 100) * r;
      return {
        x: cx + length * Math.cos(angle),
        y: cy + length * Math.sin(angle)
      };
    };

    const categoriesList: RmfCategory[] = ['Govern', 'Map', 'Measure', 'Manage'];
    
    const points = categoriesList.map((cat, idx) => {
      const pct = rmfScores[cat].percentage;
      return getCoordinates(pct, idx);
    });

    const polygonPointsStr = points.map(p => `${p.x},${p.y}`).join(' ');

    const grids = [25, 50, 75, 100].map(pct => {
      const gridPoints = categoriesList.map((_, idx) => getCoordinates(pct, idx));
      return gridPoints.map(p => `${p.x},${p.y}`).join(' ');
    });

    const labelPositions = categoriesList.map((_, idx) => {
      const angle = (idx * Math.PI) / 2 - Math.PI / 2;
      const labelRadius = r + 28;
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
        <p className="text-slate-500 text-xs">Create or load a vendor first to launch the Alignment Radar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display font-black text-slate-900 text-base uppercase tracking-tight">
                ALIGNMENT MAP (RADAR) Interactive Visualizer
              </h2>
              <p className="text-slate-500 text-xs font-medium">
                Dynamic 4-axis NIST AI RMF compliance radar & posture alignment breakdown.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 shrink-0">Target Vendor Dossier:</label>
          <select
            value={selectedVendorId}
            onChange={e => setSelectedVendorId(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs font-bold text-slate-800 cursor-pointer focus:ring-2 focus:ring-indigo-600 outline-hidden min-w-[220px]"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Main Column: Radar Visualizer */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Interactive Radar Chart Box */}
            <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                    NIST AI RMF 1.0 RADAR POLYGON
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800 px-2 py-0.5 rounded-md">
                  {activeVendor.name}
                </span>
              </div>

              {/* SVG Canvas Container */}
              <div className="flex justify-center py-2 relative select-none">
                <svg width="440" height="440" className="overflow-visible">
                  <defs>
                    <radialGradient id="radarCenterGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(99, 102, 241, 0.25)" />
                      <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                    </radialGradient>
                  </defs>

                  {/* Background Glow */}
                  <circle cx={radarChartData.cx} cy={radarChartData.cy} r={radarChartData.r} fill="url(#radarCenterGlow)" />

                  {/* Axis lines */}
                  {radarChartData.labelPositions.map((_, idx) => {
                    const angle = (idx * Math.PI) / 2 - Math.PI / 2;
                    const edgeX = radarChartData.cx + radarChartData.r * Math.cos(angle);
                    const edgeY = radarChartData.cy + radarChartData.r * Math.sin(angle);
                    return (
                      <line
                        key={idx}
                        x1={radarChartData.cx}
                        y1={radarChartData.cy}
                        x2={edgeX}
                        y2={edgeY}
                        stroke="#334155"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                    );
                  })}

                  {/* Concentric Grid Rings */}
                  {radarChartData.grids.map((gridPointsStr, idx) => {
                    const level = (idx + 1) * 25;
                    return (
                      <g key={idx}>
                        <polygon
                          points={gridPointsStr}
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth="1.5"
                        />
                        <text
                          x={radarChartData.cx + 5}
                          y={radarChartData.cy - (radarChartData.r * level / 100) + 3}
                          fill="#64748b"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {level}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Outer Boundary */}
                  <polygon
                    points={radarChartData.grids[3]}
                    fill="none"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />

                  {/* Active Compliance Polygon */}
                  {overallComplianceScore > 0 && (
                    <polygon
                      points={radarChartData.polygonPointsStr}
                      fill="rgba(99, 102, 241, 0.35)"
                      stroke="#818cf8"
                      strokeWidth="3"
                      className="transition-all duration-500"
                    />
                  )}

                  {/* Interactive Vertex Dots */}
                  {radarChartData.points.map((p, idx) => {
                    const cat = RMF_CATEGORIES[idx];
                    const isSelected = selectedRmfTab === cat.id;
                    return (
                      <g 
                        key={idx} 
                        className="cursor-pointer group"
                        onClick={() => setSelectedRmfTab(cat.id)}
                      >
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isSelected ? 8 : 5}
                          fill={isSelected ? '#f43f5e' : '#6366f1'}
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="transition-all duration-300 hover:scale-150"
                        />
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="16"
                          fill="transparent"
                        />
                      </g>
                    );
                  })}

                  {/* Labels for Categories */}
                  {radarChartData.labelPositions.map((p, idx) => {
                    const cat = RMF_CATEGORIES[idx];
                    const isSelected = selectedRmfTab === cat.id;
                    
                    let textAnchor = 'middle';
                    let dy = '0.35em';
                    if (idx === 1) textAnchor = 'start';
                    if (idx === 3) textAnchor = 'end';
                    if (idx === 0) dy = '-0.6em';
                    if (idx === 2) dy = '1.3em';

                    return (
                      <text
                        key={idx}
                        x={p.x}
                        y={p.y}
                        dy={dy}
                        textAnchor={textAnchor}
                        fill={isSelected ? '#f43f5e' : '#cbd5e1'}
                        fontSize="11"
                        fontWeight="black"
                        fontFamily="sans-serif"
                        className="cursor-pointer select-none transition-colors hover:fill-indigo-400"
                        onClick={() => setSelectedRmfTab(cat.id)}
                      >
                        {cat.title.toUpperCase()} ({rmfScores[cat.id].percentage}%)
                      </text>
                    );
                  })}
                </svg>
              </div>

              {/* Instructions Banner */}
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                  Click any radar vertex or function pill to inspect specific controls.
                </span>
                <span className="font-mono text-[10px] text-slate-500 font-bold">NIST SP 1270</span>
              </div>
            </div>

            {/* Overall Score Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Aggregate Compliance</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-black text-indigo-700">{overallComplianceScore}%</span>
                  <span className="text-xs font-bold text-slate-500">NIST Score</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${overallComplianceScore}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Residual Risk Rating</span>
                {residualRisk && (
                  <div>
                    <span className={`text-sm font-mono font-black uppercase inline-block px-2.5 py-0.5 rounded-md ${residualRisk.details.color}`}>
                      {residualRisk.details.category}
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">
                      Score: {residualRisk.likelihood} × {residualRisk.impact} = {residualRisk.details.score}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Category Breakdown & Controls Inspection */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Category Selector Tabs */}
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex gap-1">
              {RMF_CATEGORIES.map(cat => {
                const isSelected = selectedRmfTab === cat.id;
                const score = rmfScores[cat.id].percentage;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedRmfTab(cat.id)}
                    className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                        : 'bg-white border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[9px] font-mono tracking-wider block uppercase">{cat.title}</span>
                    <span className="text-sm font-display font-black block">{score}%</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Category Details */}
            {(() => {
              const catData = RMF_CATEGORIES.find(c => c.id === selectedRmfTab)!;
              const stats = rmfScores[selectedRmfTab];

              return (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Category Header */}
                  <div className={`${catData.bgColor} border ${catData.borderColor} p-5 rounded-2xl space-y-2`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-display font-extrabold text-slate-900 text-base">
                        NIST Core: {catData.title}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                        stats.percentage >= 80 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : stats.percentage >= 50
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}>
                        {stats.percentage}% COMPLIANT
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs font-medium leading-relaxed">
                      {catData.description}
                    </p>
                  </div>

                  {/* Dual Grid: Implemented vs Pending */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Implemented Controls */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
                      <div className="bg-emerald-50 border-b border-slate-100 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="font-display font-bold text-emerald-950 text-xs">WHAT IS GOOD</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {stats.implemented.length} Verified
                        </span>
                      </div>

                      <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[360px]">
                        {stats.implemented.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 space-y-1">
                            <Info className="w-6 h-6 mx-auto text-slate-300" />
                            <p className="text-xs font-semibold">No mature controls verified yet.</p>
                          </div>
                        ) : (
                          stats.implemented.map(ctrl => {
                            const ans = activeVendor.answers[ctrl.id];
                            return (
                              <div key={ctrl.id} className="border border-slate-150 rounded-xl p-3 space-y-2 bg-slate-50/50">
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                                      {ctrl.code}
                                    </span>
                                    <h4 className="font-semibold text-slate-900 text-xs mt-1 leading-snug">
                                      {ctrl.question}
                                    </h4>
                                  </div>
                                </div>
                                {ans?.safeguards && (
                                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-[10px]">
                                    <span className="font-bold text-slate-600 block">Safeguards:</span>
                                    <p className="text-slate-800 font-medium leading-relaxed">{ans.safeguards}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Pending / Deficient Controls */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
                      <div className="bg-rose-50 border-b border-slate-100 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span className="font-display font-bold text-rose-950 text-xs">WHAT IS NOT</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                          {stats.pending.length} Deficient
                        </span>
                      </div>

                      <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[360px]">
                        {stats.pending.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 space-y-1">
                            <CheckCircle className="w-6 h-6 mx-auto text-emerald-500" />
                            <p className="text-xs font-bold text-slate-700">All controls implemented!</p>
                          </div>
                        ) : (
                          stats.pending.map(ctrl => {
                            return (
                              <div key={ctrl.id} className="border border-rose-100 rounded-xl p-3 space-y-2 bg-rose-50/20">
                                <div>
                                  <span className="text-[9px] font-mono font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded">
                                    {ctrl.code}
                                  </span>
                                  <h4 className="font-semibold text-slate-900 text-xs mt-1 leading-snug">
                                    {ctrl.question}
                                  </h4>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-[10px] text-slate-500 font-medium">Weight: {ctrl.weight}</span>
                                  <button
                                    onClick={() => onSelectVendorToAssess(activeVendor.id)}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Remediate</span>
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

          </div>

        </div>
      )}

    </div>
  );
}
