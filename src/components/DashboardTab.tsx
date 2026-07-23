/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Vendor, ControlItem, getRiskDetails, RiskCategory } from '../types';
import { Search, Filter, Shield, Activity, PlusCircle, FileText, ChevronRight, Download, RefreshCw, Layers } from 'lucide-react';

interface DashboardTabProps {
  vendors: Vendor[];
  masterControls: ControlItem[];
  onAssessVendor: (vendorId: string) => void;
  onViewPassport: (vendor: Vendor) => void;
  onAddVendorClick: () => void;
}

export default function DashboardTab({ 
  vendors, 
  masterControls, 
  onAssessVendor, 
  onViewPassport,
  onAddVendorClick
}: DashboardTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [capabilityFilter, setCapabilityFilter] = useState<string>('All');
  const [selectedCell, setSelectedCell] = useState<{ likelihood: number; impact: number } | null>(null);

  // Compute stats
  const stats = useMemo(() => {
    let total = vendors.length;
    let completed = vendors.filter(v => v.status === 'Completed').length;
    let inProgress = vendors.filter(v => v.status === 'In Progress').length;
    let agenticCount = vendors.filter(v => v.usesAgenticAI).length;
    
    // Calculate average residual risk score for completed/in-progress
    let totalResidualScore = 0;
    let assessedCount = 0;
    let criticalCount = 0;

    vendors.forEach(v => {
      // Calculate control effectiveness
      const activeCtrls = masterControls.filter(c => c.module !== 'agentic-ai' || v.usesAgenticAI);
      const totalMax = activeCtrls.reduce((sum, c) => sum + c.weight, 0);
      let actual = 0;
      activeCtrls.forEach(ctrl => {
        const ans = v.answers[ctrl.id];
        if (ans && ans.isImplemented) {
          const factor = ans.maturity === 'Optimized' ? 1.0 : ans.maturity === 'Managed' ? 0.7 : 0.3;
          actual += ctrl.weight * factor;
        }
      });
      const ce = totalMax > 0 ? (actual / totalMax) * 100 : 0;
      
      const rL = Math.max(1, Math.round(v.inherentLikelihood - (ce / 100) * (v.inherentLikelihood - 1) * 1.5));
      const rI = Math.max(1, Math.round(v.inherentImpact - (ce / 100) * (v.inherentImpact - 1) * 0.5));
      const rScore = rL * rI;
      const details = getRiskDetails(rL, rI);

      totalResidualScore += rScore;
      assessedCount++;
      if (details.category === 'Critical' || details.category === 'High') {
        criticalCount++;
      }
    });

    const avgScore = assessedCount > 0 ? (totalResidualScore / assessedCount).toFixed(1) : '0';

    return { total, completed, inProgress, agenticCount, avgScore, criticalCount };
  }, [vendors, masterControls]);

  // Helper to resolve specific vendor scores
  const getVendorScores = (vendor: Vendor) => {
    const activeCtrls = masterControls.filter(c => c.module !== 'agentic-ai' || vendor.usesAgenticAI);
    const totalMax = activeCtrls.reduce((sum, c) => sum + c.weight, 0);
    let actual = 0;
    activeCtrls.forEach(ctrl => {
      const ans = vendor.answers[ctrl.id];
      if (ans && ans.isImplemented) {
        const factor = ans.maturity === 'Optimized' ? 1.0 : ans.maturity === 'Managed' ? 0.7 : 0.3;
        actual += ctrl.weight * factor;
      }
    });
    const ce = totalMax > 0 ? (actual / totalMax) * 100 : 0;
    
    const rL = Math.max(1, Math.round(vendor.inherentLikelihood - (ce / 100) * (vendor.inherentLikelihood - 1) * 1.5));
    const rI = Math.max(1, Math.round(vendor.inherentImpact - (ce / 100) * (vendor.inherentImpact - 1) * 0.5));
    
    return {
      controlEffectiveness: ce,
      residualLikelihood: rL,
      residualImpact: rI,
      inherentRisk: getRiskDetails(vendor.inherentLikelihood, vendor.inherentImpact),
      residualRisk: getRiskDetails(rL, rI)
    };
  };

  // Get headcount for cells in 5x5 heatmap
  const matrixCounts = useMemo(() => {
    const counts: Record<string, { count: number; vendors: Vendor[] }> = {};
    
    // Initialize
    for (let r = 1; r <= 5; r++) {
      for (let c = 1; c <= 5; c++) {
        counts[`${r}-${c}`] = { count: 0, vendors: [] };
      }
    }

    // Populate based on residual scores
    vendors.forEach(v => {
      const { residualLikelihood, residualImpact } = getVendorScores(v);
      const key = `${residualLikelihood}-${residualImpact}`;
      if (counts[key]) {
        counts[key].count += 1;
        counts[key].vendors.push(v);
      }
    });

    return counts;
  }, [vendors, masterControls]);

  // Filter vendors based on all filters
  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      // Search matches name or description or services
      const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            v.servicesProvided.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
      
      const matchesCapability = capabilityFilter === 'All' || 
                                 (capabilityFilter === 'Agentic' && v.usesAgenticAI) || 
                                 (capabilityFilter === 'Standard' && !v.usesAgenticAI);

      let matchesCell = true;
      if (selectedCell) {
        const { residualLikelihood, residualImpact } = getVendorScores(v);
        matchesCell = residualLikelihood === selectedCell.likelihood && residualImpact === selectedCell.impact;
      }

      return matchesSearch && matchesStatus && matchesCapability && matchesCell;
    });
  }, [vendors, searchTerm, statusFilter, capabilityFilter, selectedCell, masterControls]);

  const handleCellClick = (l: number, i: number) => {
    if (selectedCell && selectedCell.likelihood === l && selectedCell.impact === i) {
      setSelectedCell(null); // Clear filter on re-click
    } else {
      setSelectedCell({ likelihood: l, impact: i });
    }
  };

  // CSV export for the active list
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Vendor ID,Vendor Name,Status,Capabilities,Inherent Likelihood,Inherent Impact,Inherent Score,Inherent Category,Control Effectiveness %,Residual Likelihood,Residual Impact,Residual Score,Residual Category,Services Provided\n";
    
    vendors.forEach(v => {
      const s = getVendorScores(v);
      const row = [
        v.id,
        `"${v.name.replace(/"/g, '""')}"`,
        v.status,
        v.usesAgenticAI ? "Agentic AI Enabled" : "Standard LLM Only",
        v.inherentLikelihood,
        v.inherentImpact,
        s.inherentRisk.score,
        s.inherentRisk.category,
        `${s.controlEffectiveness.toFixed(1)}%`,
        s.residualLikelihood,
        s.residualImpact,
        s.residualRisk.score,
        s.residualRisk.category,
        `"${v.servicesProvided.replace(/"/g, '""')}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendor_risk_register_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Monitored Vendors</span>
            <p className="text-2xl font-display font-extrabold text-slate-900 mt-1">{stats.total}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{stats.completed} Completed Assessments</p>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-lg text-slate-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Avg Residual Score</span>
            <p className="text-2xl font-display font-extrabold text-slate-900 mt-1">{stats.avgScore}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Scale of 1 (Rare) to 25 (Critical)</p>
          </div>
          <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600 border border-indigo-100">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">High/Critical Residuals</span>
            <p className={`text-2xl font-display font-extrabold mt-1 ${stats.criticalCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {stats.criticalCount}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Vendors requiring mitigation review</p>
          </div>
          <div className={`p-2.5 rounded-lg border ${stats.criticalCount > 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-600 border-transparent'}`}>
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Agentic AI Vendors</span>
            <p className="text-2xl font-display font-extrabold text-slate-900 mt-1">{stats.agenticCount}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Subject to Module 3 controls</p>
          </div>
          <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 border border-blue-100">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid Layout: 5x5 Heatmap on left, Scoping/Guide on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heatmap Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-bold text-slate-900 text-lg">Interactive 5x5 Residual Risk Heatmap</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click on any cell to filter the Vendor Register below. Metrics show active count of vendor residual positions.
                </p>
              </div>
              {selectedCell && (
                <button 
                  onClick={() => setSelectedCell(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer"
                >
                  Clear Matrix Filter
                </button>
              )}
            </div>

            {/* Matrix Container */}
            <div className="mt-6 flex flex-col items-center">
              <div className="w-full max-w-[480px] space-y-1">
                {/* Header Labels (Impact) */}
                <div className="text-center text-[11px] font-mono font-bold text-slate-400 tracking-wider uppercase mb-1">
                  ← Control Impact Level →
                </div>
                
                {[5, 4, 3, 2, 1].map(r => (
                  <div key={r} className="flex items-center gap-1">
                    {/* Y Axis Labels (Likelihood) */}
                    <span className="w-28 text-right pr-2 text-[10px] font-mono font-bold text-slate-400 uppercase">
                      {r === 5 ? '5 - Almost Certain' : 
                       r === 4 ? '4 - Likely' : 
                       r === 3 ? '3 - Possible' : 
                       r === 2 ? '2 - Unlikely' : 
                       '1 - Rare'}
                    </span>

                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4, 5].map(c => {
                        const cellDetails = getRiskDetails(r, c);
                        const cellKey = `${r}-${c}`;
                        const cellData = matrixCounts[cellKey] || { count: 0, vendors: [] };
                        const isFiltered = selectedCell && selectedCell.likelihood === r && selectedCell.impact === c;
                        
                        let cellBg = '';
                        if (cellDetails.category === 'Low') cellBg = 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-100';
                        if (cellDetails.category === 'Medium') cellBg = 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-100';
                        if (cellDetails.category === 'High') cellBg = 'bg-orange-50 text-orange-800 hover:bg-orange-100 border-orange-100';
                        if (cellDetails.category === 'Critical') cellBg = 'bg-red-50 text-red-800 hover:bg-red-100 border-red-100';

                        let cellBorder = 'border';
                        if (isFiltered) {
                          cellBorder = 'border-slate-900 ring-2 ring-slate-950 scale-102 z-10';
                        }

                        return (
                          <button
                            key={c}
                            onClick={() => handleCellClick(r, c)}
                            className={`flex-1 aspect-video rounded-md ${cellBorder} ${cellBg} flex flex-col items-center justify-center p-1 transition-all relative cursor-pointer group`}
                            style={{ minHeight: '52px' }}
                          >
                            <span className="text-[10px] font-mono font-bold opacity-40">{cellDetails.score}</span>
                            {cellData.count > 0 ? (
                              <span className="text-sm font-extrabold font-mono tracking-tight bg-slate-900 text-white rounded-full px-2 py-0.2 shrink-0 shadow-xs scale-105">
                                {cellData.count}
                              </span>
                            ) : (
                              <span className="text-[9px] font-medium tracking-tight opacity-50 uppercase group-hover:opacity-100">
                                {cellDetails.category[0]}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Bottom X-axis indices */}
                <div className="flex items-center gap-1">
                  <span className="w-28"></span>
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4, 5].map(idx => (
                      <span key={idx} className="flex-1 text-center text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase">
                        {idx === 1 ? '1-Insignif.' : 
                         idx === 2 ? '2-Minor' : 
                         idx === 3 ? '3-Mod.' : 
                         idx === 4 ? '4-Major' : 
                         '5-Crit.'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Framework Reference (Scoping Guard) */}
          <div className="bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-400" />
                <h3 className="font-display font-bold text-md text-white">IT & AI Governance Framework</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our Control Engine maps raw responses directly to industry standard frameworks to calculate real-time residual scores:
              </p>
              
              <div className="space-y-2.5 mt-2">
                <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs">
                  <span className="font-bold text-indigo-400 font-mono">CSA CAIQ v4</span>
                  <p className="text-slate-400 text-[10px] mt-0.5">Enforces data residency, encryption pipelines, PII scrubbing, and GDPR compliance safeguards.</p>
                </div>
                <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs">
                  <span className="font-bold text-amber-400 font-mono">OWASP Top 10 for LLMs</span>
                  <p className="text-slate-400 text-[10px] mt-0.5">Evaluates adversarial testing boundaries, lineage protection, and localized prompt-injection guards.</p>
                </div>
                <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs">
                  <span className="font-bold text-blue-400 font-mono">CSA AI Controls Matrix (AICM)</span>
                  <p className="text-slate-400 text-[10px] mt-0.5">Evaluates advanced autonomy levels, recursive tool caps, and human-in-the-loop (HITL) gatekeepers.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4">
              <button
                onClick={onAddVendorClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Initialize New Vendor Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vendor Risk Register (Table) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-5 border-b border-slate-200 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between bg-slate-50/50">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-md">Vendor Risk Register</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedCell 
                  ? `Filtering: Residual Likelihood ${selectedCell.likelihood}, Impact ${selectedCell.impact} (${filteredVendors.length} found)`
                  : `Flat-file listing of corporate third-party portfolios (${filteredVendors.length} total)`
                }
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md transition-all shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Register</span>
              </button>
            </div>
          </div>

          {/* Search and Filters Grid */}
          <div className="p-4 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search vendor, description or service..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500 font-mono font-bold uppercase shrink-0 text-[10px]">Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full bg-transparent focus:outline-hidden text-xs cursor-pointer"
              >
                <option value="All">All Assessments</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500 font-mono font-bold uppercase shrink-0 text-[10px]">Capabilities:</span>
              <select
                value={capabilityFilter}
                onChange={e => setCapabilityFilter(e.target.value)}
                className="w-full bg-transparent focus:outline-hidden text-xs cursor-pointer"
              >
                <option value="All">All Capabilities</option>
                <option value="Agentic">Agentic AI Enabled</option>
                <option value="Standard">Standard LLM Only</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-mono font-bold text-[10px] tracking-wider uppercase">
                  <th className="px-5 py-3">Vendor / Service</th>
                  <th className="px-5 py-3">Capabilities</th>
                  <th className="px-5 py-3 text-center">Inherent Risk</th>
                  <th className="px-5 py-3">Control Effect.</th>
                  <th className="px-5 py-3 text-center">Residual Risk</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 italic">
                      No vendors matched the current criteria. Try clearing active filters.
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map(v => {
                    const { controlEffectiveness, inherentRisk, residualRisk } = getVendorScores(v);
                    
                    return (
                      <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900 text-sm">{v.name}</div>
                          <div className="text-slate-400 mt-0.5 max-w-xs truncate" title={v.servicesProvided}>
                            {v.servicesProvided}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {v.usesAgenticAI ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 font-medium text-[10px]">
                              Agentic AI
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px]">
                              Standard LLM
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                            inherentRisk.category === 'Critical' ? 'bg-red-50 text-red-700 border border-red-100' :
                            inherentRisk.category === 'High' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                            inherentRisk.category === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            {inherentRisk.category.toUpperCase()} ({inherentRisk.score})
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-100 rounded-full h-1.5 max-w-[60px] overflow-hidden">
                              <div 
                                className="bg-emerald-600 h-1.5 rounded-full"
                                style={{ width: `${controlEffectiveness}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-slate-700 text-[11px]">{controlEffectiveness.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                            residualRisk.category === 'Critical' ? 'bg-red-100 text-red-800 border border-red-200' :
                            residualRisk.category === 'High' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                            residualRisk.category === 'Medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {residualRisk.category.toUpperCase()} ({residualRisk.score})
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase font-mono ${
                            v.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                            v.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              v.status === 'Completed' ? 'bg-emerald-500' :
                              v.status === 'In Progress' ? 'bg-amber-500' :
                              'bg-slate-400'
                            }`} />
                            {v.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onAssessVendor(v.id)}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md transition-colors text-[10px] cursor-pointer"
                            >
                              Assess
                            </button>
                            {v.status === 'Completed' && (
                              <button
                                onClick={() => onViewPassport(v)}
                                className="flex items-center gap-1 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold rounded-md transition-colors text-[10px] cursor-pointer"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Passport</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
