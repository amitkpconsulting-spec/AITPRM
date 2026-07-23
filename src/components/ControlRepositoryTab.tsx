/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ControlItem, Vendor } from '../types';
import { 
  Shield, 
  Settings, 
  Sliders, 
  AlertCircle, 
  Save, 
  BarChart2, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  Filter,
  Folder,
  FolderPlus
} from 'lucide-react';

interface ControlRepositoryTabProps {
  controls: ControlItem[];
  vendors: Vendor[];
  onUpdateWeight: (controlId: string, newWeight: number) => void;
}

export default function ControlRepositoryTab({ controls, vendors, onUpdateWeight }: ControlRepositoryTabProps) {
  const [filterModule, setFilterModule] = useState<string>('All');
  const [directoryFilter, setDirectoryFilter] = useState<string>('All Directories');
  const [viewMode, setViewMode] = useState<'config' | 'gap'>('config');
  const [gapSearch, setGapSearch] = useState('');
  const [gapSeverityFilter, setGapSeverityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'lowest_score' | 'highest_score' | 'highest_weight' | 'code'>('lowest_score');
  const [expandedControlId, setExpandedControlId] = useState<string | null>(null);

  // Derive unique assessment directories
  const availableDirectories = useMemo(() => {
    const set = new Set<string>();
    controls.forEach(c => {
      set.add(c.directoryTitle || 'Standard Framework Directory');
    });
    return Array.from(set);
  }, [controls]);

  const filteredControls = controls.filter(c => {
    const matchesModule = filterModule === 'All' || c.module === filterModule;
    const matchesDir = directoryFilter === 'All Directories' || (c.directoryTitle || 'Standard Framework Directory') === directoryFilter;
    return matchesModule && matchesDir;
  });

  // Calculate detailed gap analysis metrics for each control
  const gapData = useMemo(() => {
    return controls.map(ctrl => {
      // Find all vendors where this control is in scope
      const inScopeVendors = vendors.filter(v => ctrl.module !== 'agentic-ai' || v.usesAgenticAI);
      const inScopeCount = inScopeVendors.length;

      let sumScore = 0;
      let optimizedCount = 0;
      let managedCount = 0;
      let adhocCount = 0;
      let notImplementedCount = 0;

      inScopeVendors.forEach(v => {
        const ans = v.answers[ctrl.id];
        if (ans && ans.isImplemented) {
          if (ans.maturity === 'Optimized') {
            sumScore += 100;
            optimizedCount++;
          } else if (ans.maturity === 'Managed') {
            sumScore += 70;
            managedCount++;
          } else {
            sumScore += 30;
            adhocCount++;
          }
        } else {
          notImplementedCount++;
        }
      });

      const averageScore = inScopeCount > 0 ? Math.round(sumScore / inScopeCount) : 0;

      // Determine Gap Severity based on average score and control weight
      let severity: 'Critical' | 'High' | 'Medium' | 'Satisfactory';
      if (averageScore < 40) {
        if (ctrl.weight >= 4) {
          severity = 'Critical';
        } else if (ctrl.weight === 3) {
          severity = 'High';
        } else {
          severity = 'Medium';
        }
      } else if (averageScore >= 40 && averageScore < 75) {
        if (ctrl.weight >= 4) {
          severity = 'High';
        } else if (ctrl.weight === 3) {
          severity = 'Medium';
        } else {
          severity = 'Satisfactory';
        }
      } else {
        severity = 'Satisfactory';
      }

      return {
        ...ctrl,
        averageScore,
        inScopeCount,
        optimizedCount,
        managedCount,
        adhocCount,
        notImplementedCount,
        severity
      };
    });
  }, [controls, vendors]);

  // Compute overall baseline compliance statistics from gapData
  const stats = useMemo(() => {
    const totalControls = gapData.length;
    
    const overallScore = totalControls > 0 
      ? Math.round(gapData.reduce((sum, item) => sum + item.averageScore, 0) / totalControls) 
      : 0;

    const criticalGapsCount = gapData.filter(item => item.severity === 'Critical').length;
    const highGapsCount = gapData.filter(item => item.severity === 'High').length;
    const mediumGapsCount = gapData.filter(item => item.severity === 'Medium').length;

    // Weakest links (lowest 3 controls)
    const weakestLinks = [...gapData]
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 3);

    return {
      overallScore,
      criticalGapsCount,
      highGapsCount,
      mediumGapsCount,
      weakestLinks
    };
  }, [gapData]);

  // Filter and sort controls for the Gap Analysis view
  const filteredAndSortedGapData = useMemo(() => {
    return gapData
      .filter(item => {
        // Module filter
        const matchesModule = filterModule === 'All' || item.module === filterModule;

        // Severity filter
        const matchesSeverity = gapSeverityFilter === 'All' || item.severity === gapSeverityFilter;

        // Search filter
        const matchesSearch = 
          item.code.toLowerCase().includes(gapSearch.toLowerCase()) ||
          item.question.toLowerCase().includes(gapSearch.toLowerCase()) ||
          item.description.toLowerCase().includes(gapSearch.toLowerCase()) ||
          item.frameworkMapping.toLowerCase().includes(gapSearch.toLowerCase());

        return matchesModule && matchesSeverity && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'lowest_score') {
          return a.averageScore - b.averageScore;
        }
        if (sortBy === 'highest_score') {
          return b.averageScore - a.averageScore;
        }
        if (sortBy === 'highest_weight') {
          if (b.weight !== a.weight) {
            return b.weight - a.weight;
          }
          return a.averageScore - b.averageScore; // secondary sort by lowest score
        }
        // code order
        return a.code.localeCompare(b.code);
      });
  }, [gapData, filterModule, gapSeverityFilter, gapSearch, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Tab Header Info */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-slate-900 text-lg">Master Control Repository Manager</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin console for Control Managers to customize baseline control weights and perform cross-vendor gap analysis.
          </p>
        </div>

        {/* Filter Controls & Directory Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 overflow-x-auto pb-1 md:pb-0">
          {/* Assessment Directory Folder Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shrink-0">
            <Folder className="w-4 h-4 text-indigo-600 shrink-0" />
            <select
              value={directoryFilter}
              onChange={e => setDirectoryFilter(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer max-w-[220px] truncate"
            >
              <option value="All Directories">All Directory Folders ({controls.length})</option>
              {availableDirectories.map(dir => (
                <option key={dir} value={dir}>
                  📂 {dir} ({controls.filter(c => (c.directoryTitle || 'Standard Framework Directory') === dir).length})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={() => setFilterModule('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterModule === 'All'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              All Baseline Controls
            </button>
            <button
              onClick={() => setFilterModule('privacy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterModule === 'privacy'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              Privacy
            </button>
            <button
              onClick={() => setFilterModule('standard-ai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterModule === 'standard-ai'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              Standard LLM
            </button>
            <button
              onClick={() => setFilterModule('agentic-ai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterModule === 'agentic-ai'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              Agentic Controls
            </button>
          </div>
        </div>
      </div>

      {/* Primary View Switcher: Config vs Gap Analysis */}
      <div className="flex border-b border-slate-200 no-print">
        <button
          onClick={() => setViewMode('config')}
          className={`pb-3 px-6 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            viewMode === 'config'
              ? 'border-indigo-600 text-indigo-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Control Weight Configuration</span>
        </button>
        <button
          onClick={() => setViewMode('gap')}
          className={`pb-3 px-6 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            viewMode === 'gap'
              ? 'border-indigo-600 text-indigo-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart2 className="w-4 h-4 animate-pulse" />
          <span>Cross-Vendor Gap Analysis</span>
          <span className="bg-rose-100 text-rose-750 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider">
            Insights
          </span>
        </button>
      </div>

      {viewMode === 'config' ? (
        <>
          {/* Advisory Banner */}
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-semibold text-amber-950">Caution: Cascading Calculations Active</strong>
              <p>
                Modifying pre-assigned weights will automatically re-evaluate Inherent Risk coverage and Control Effectiveness percentage calculations across all completed, in-progress, and pending third-party profiles in localStorage. Verify compliance baseline guidelines (CSA CAIQ v4 or AICM) before publishing modifications.
              </p>
            </div>
          </div>

          {/* Grid of Control Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredControls.map(ctrl => (
              <div key={ctrl.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                
                {/* Header info */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                        {ctrl.code}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded uppercase">
                        {ctrl.frameworkMapping}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-indigo-900 bg-indigo-50/80 border border-indigo-200 px-1.5 py-0.5 rounded">
                        <Folder className="w-3 h-3 text-indigo-600 shrink-0" />
                        {ctrl.directoryTitle || 'Standard Framework Directory'}
                      </span>
                    </div>
                    <h4 className="font-semibold font-display text-slate-800 text-sm mt-1">{ctrl.question}</h4>
                  </div>
                </div>

                <p className="text-slate-500 text-xs leading-normal">{ctrl.description}</p>

                {/* Weight Slider Adjuster */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-6">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Sliders className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Assigned Control Weight</span>
                  </div>
                  
                  <div className="flex items-center gap-3 w-2/3 max-w-[200px]">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={ctrl.weight}
                      onChange={e => onUpdateWeight(ctrl.id, parseInt(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                    />
                    <span className="font-mono font-bold text-xs bg-indigo-600 text-white rounded px-2 py-0.5 min-w-[28px] text-center shrink-0">
                      {ctrl.weight}
                    </span>
                  </div>
                </div>

                {/* Quick Context Summary */}
                <div className="text-[10px] text-slate-400 leading-normal font-medium bg-slate-50/50 p-2 rounded border border-slate-100">
                  {ctrl.weight === 5 && '🔴 Critical Vector: Baseline control is non-negotiable. Missing state triggers immediate Residual High rating.'}
                  {ctrl.weight === 4 && '🟠 High Importance: Protects sensitive PII processing and security pipelines. Requires managed maturity.'}
                  {ctrl.weight === 3 && '🟡 Moderate Importance: Essential procedural governance documentation control.'}
                  {ctrl.weight === 2 && '🟢 Minor Importance: Auxiliary tracking framework compliance safeguard.'}
                  {ctrl.weight === 1 && '🔵 Insignificant Vector: Optional operational preference parameter.'}
                </div>

              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          
          {/* Stats Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Overall Baseline Compliance */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Average Baseline Compliance</span>
                <h4 className="text-2xl font-bold font-display text-slate-950 mt-1">{stats.overallScore}%</h4>
              </div>
              <div className="mt-4">
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                  <div 
                    className={`h-1.5 rounded-full ${stats.overallScore > 75 ? 'bg-emerald-600' : stats.overallScore > 45 ? 'bg-amber-500' : 'bg-rose-600'}`} 
                    style={{ width: `${stats.overallScore}%` }} 
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1.5 block leading-normal">Mean score across all control standards</span>
              </div>
            </div>

            {/* Metric 2: Critical Gaps */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Critical Gaps Detected</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h4 className={`text-2xl font-bold font-display ${stats.criticalGapsCount > 0 ? 'text-rose-700' : 'text-slate-950'}`}>
                    {stats.criticalGapsCount}
                  </h4>
                  <span className="text-[10px] text-slate-450 font-mono font-bold">HIGH WT & LOW COMPLIANCE</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-4 leading-normal">
                {stats.criticalGapsCount > 0 
                  ? '⚠️ High-priority gaps requiring urgent remediation plans.' 
                  : '✅ No critical baseline control gaps detected.'}
              </p>
            </div>

            {/* Metric 3: Portfolio Risk Level */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Risk Distribution Summary</span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-red-50 border border-red-150 rounded text-red-700">
                    {stats.criticalGapsCount} Critical
                  </span>
                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-orange-50 border border-orange-150 rounded text-orange-700">
                    {stats.highGapsCount} High
                  </span>
                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-amber-50 border border-amber-150 rounded text-amber-800">
                    {stats.mediumGapsCount} Med
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-4 leading-normal">
                Synthesized by combining baseline weight with actual execution rating.
              </p>
            </div>

            {/* Metric 4: Weakest Control */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Lowest Scored Baseline</span>
                {stats.weakestLinks.length > 0 ? (
                  <div className="mt-1">
                    <span className="font-mono text-[9px] font-bold text-red-700 bg-red-50 border border-red-150 px-1.5 py-0.5 rounded">
                      {stats.weakestLinks[0].code}
                    </span>
                    <h5 className="font-bold text-xs text-slate-800 truncate mt-1">{stats.weakestLinks[0].question}</h5>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 block mt-2">No active controls.</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-2 leading-normal">
                {stats.weakestLinks.length > 0 
                  ? `Average score across vendors is currently ${stats.weakestLinks[0].averageScore}%.` 
                  : 'N/A'}
              </p>
            </div>

          </div>

          {/* Filters and Sorting Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search gap analyses by keyword, code, or framework..."
                value={gapSearch}
                onChange={e => setGapSearch(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              {gapSearch && (
                <button
                  onClick={() => setGapSearch('')}
                  className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              
              {/* Severity Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase whitespace-nowrap">Gap Severity:</span>
                <select
                  value={gapSeverityFilter}
                  onChange={e => setGapSeverityFilter(e.target.value)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold cursor-pointer text-slate-700"
                >
                  <option value="All">All Gaps</option>
                  <option value="Critical">Critical Risk Gaps</option>
                  <option value="High">High Risk Gaps</option>
                  <option value="Medium">Medium Risk Gaps</option>
                  <option value="Satisfactory">Satisfactory Controls</option>
                </select>
              </div>

              {/* Sorting Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase whitespace-nowrap">Sort:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold cursor-pointer text-slate-700"
                >
                  <option value="lowest_score">Lowest Score First (Worst Weaknesses)</option>
                  <option value="highest_score">Highest Score First (Strongest Anchors)</option>
                  <option value="highest_weight">Highest Control Weight First</option>
                  <option value="code">Control Identifier Code</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results list */}
          <div className="space-y-4">
            {filteredAndSortedGapData.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-bounce" />
                <h4 className="font-bold text-slate-800 text-sm">No Gap Analysis Results Found</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                  Adjust your search query, compliance category, or gap severity filter parameters to discover common weaknesses.
                </p>
              </div>
            ) : (
              filteredAndSortedGapData.map(item => {
                const isExpanded = expandedControlId === item.id;
                
                // Color mapping for Gap Severity Badges
                let severityBadge = '';
                if (item.severity === 'Critical') {
                  severityBadge = 'bg-red-50 text-red-700 border-red-200';
                } else if (item.severity === 'High') {
                  severityBadge = 'bg-orange-50 text-orange-700 border-orange-200';
                } else if (item.severity === 'Medium') {
                  severityBadge = 'bg-amber-50 text-amber-700 border-amber-200';
                } else {
                  severityBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                }

                // Color mapping for Average Score Progress Indicator
                let scoreColor = 'bg-rose-600';
                if (item.averageScore >= 75) {
                  scoreColor = 'bg-emerald-600';
                } else if (item.averageScore >= 40) {
                  scoreColor = 'bg-amber-500';
                }

                return (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden transition-all duration-200 animate-fadeIn"
                  >
                    <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      
                      {/* Left Side: Identifiers, Title, Framework, Severity */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                            {item.code}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded uppercase">
                            {item.frameworkMapping}
                          </span>
                          <span className={`text-[9px] font-mono font-bold border px-1.5 py-0.5 rounded uppercase tracking-wider ${severityBadge}`}>
                            {item.severity} GAP
                          </span>
                          <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded uppercase">
                            Weight: {item.weight}
                          </span>
                        </div>
                        <h4 className="font-semibold font-display text-slate-800 text-sm leading-relaxed">{item.question}</h4>
                        <p className="text-slate-500 text-[11px] leading-relaxed max-w-4xl">{item.description}</p>
                      </div>

                      {/* Right Side: Score Bar & interactive detailed roster toggle */}
                      <div className="w-full md:w-56 shrink-0 space-y-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Average Score</span>
                          <span className="font-mono text-base font-extrabold text-slate-900">{item.averageScore}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div className={`h-2 rounded-full transition-all ${scoreColor}`} style={{ width: `${item.averageScore}%` }} />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span className="font-medium">Scope: {item.inScopeCount} Vendors</span>
                          <button 
                            onClick={() => setExpandedControlId(isExpanded ? null : item.id)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            <span>{isExpanded ? 'Hide Details' : 'View Roster'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Expandable Vendor-Level Details List */}
                    {isExpanded && (
                      <div className="bg-slate-50 border-t border-slate-150 p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <h5 className="font-semibold font-display text-xs text-slate-700 flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span>Detailed Vendor Compliance Roster</span>
                          </h5>
                          
                          {/* Mini Summary Chips */}
                          <div className="flex flex-wrap gap-1.5 text-[9px] font-mono font-semibold">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-150">
                              Optimized: {item.optimizedCount}
                            </span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded border border-blue-150">
                              Managed: {item.managedCount}
                            </span>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-850 rounded border border-amber-150">
                              Ad-hoc: {item.adhocCount}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded border border-slate-250">
                              Not Implemented: {item.notImplementedCount}
                            </span>
                          </div>
                        </div>

                        {/* Roster Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {vendors.map(v => {
                            const isCtrlInScope = item.module !== 'agentic-ai' || v.usesAgenticAI;
                            const ans = v.answers[item.id];
                            
                            let badgeClass = 'bg-slate-200 text-slate-600 border-slate-250';
                            let statusLabel = 'Not Implemented';
                            let scoreLabel = '0%';

                            if (!isCtrlInScope) {
                              badgeClass = 'bg-slate-100 text-slate-400 border-slate-200 line-through';
                              statusLabel = 'Out of Scope';
                              scoreLabel = 'N/A';
                            } else if (ans && ans.isImplemented) {
                              if (ans.maturity === 'Optimized') {
                                badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                                statusLabel = 'Optimized';
                                scoreLabel = '100%';
                              } else if (ans.maturity === 'Managed') {
                                badgeClass = 'bg-blue-50 text-blue-850 border-blue-200';
                                statusLabel = 'Managed';
                                scoreLabel = '70%';
                              } else {
                                badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
                                statusLabel = 'Ad-hoc';
                                scoreLabel = '30%';
                              }
                            }

                            return (
                              <div 
                                key={v.id} 
                                className="bg-white p-3 rounded-lg border border-slate-150 flex items-center justify-between text-xs"
                              >
                                <div className="space-y-0.5 min-w-0 flex-1 pr-4">
                                  <p className="font-semibold text-slate-800 truncate">{v.name}</p>
                                  <p className="text-[10px] text-slate-400 font-medium truncate" title={v.servicesProvided}>
                                    {v.servicesProvided}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`text-[10px] font-mono font-bold border px-1.5 py-0.5 rounded ${badgeClass}`}>
                                    {statusLabel} ({scoreLabel})
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

    </div>
  );
}
