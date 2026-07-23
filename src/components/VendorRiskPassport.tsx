/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Vendor, ControlItem, getRiskDetails, MaturityLevel } from '../types';
import { Shield, AlertTriangle, CheckCircle, Clock, Printer, X, Download, FileText } from 'lucide-react';
import { AI_CAIQ_QUESTIONS } from '../aiCaiqData';
import { CCM_CONTROLS } from '../ccmData';

interface VendorRiskPassportProps {
  vendor: Vendor;
  masterControls: ControlItem[];
  onClose: () => void;
}

export default function VendorRiskPassport({ vendor, masterControls, onClose }: VendorRiskPassportProps) {
  const printRef = useRef<HTMLDivElement>(null);

  // Calculate CSA AI-CAIQ metrics
  const totalCaiq = AI_CAIQ_QUESTIONS.length;
  let answeredCaiq = 0;
  AI_CAIQ_QUESTIONS.forEach(q => {
    if (vendor.answers[q.id]?.isImplemented) {
      answeredCaiq++;
    }
  });
  const caiqPct = totalCaiq > 0 ? Math.round((answeredCaiq / totalCaiq) * 100) : 0;

  // Calculate CSA CCM metrics
  const totalCcm = CCM_CONTROLS.length;
  let answeredCcm = 0;
  CCM_CONTROLS.forEach(q => {
    if (vendor.answers[q.id]?.isImplemented) {
      answeredCcm++;
    }
  });
  const ccmPct = totalCcm > 0 ? Math.round((answeredCcm / totalCcm) * 100) : 0;

  // Filter controls based on dynamic scoping
  const activeControls = masterControls.filter(ctrl => {
    if (ctrl.module === 'agentic-ai') {
      return vendor.usesAgenticAI;
    }
    return true;
  });

  // Calculate scores
  const totalMaxScore = activeControls.reduce((sum, c) => sum + c.weight, 0);
  let actualScore = 0;

  activeControls.forEach(ctrl => {
    const ans = vendor.answers[ctrl.id];
    if (ans && ans.isImplemented) {
      let factor = 0.3; // Ad-hoc
      if (ans.maturity === 'Managed') factor = 0.7;
      if (ans.maturity === 'Optimized') factor = 1.0;
      actualScore += ctrl.weight * factor;
    }
  });

  const controlEffectiveness = totalMaxScore > 0 ? (actualScore / totalMaxScore) * 100 : 0;

  // Calculate Residual Coordinates
  const residualLikelihood = Math.max(1, Math.round(vendor.inherentLikelihood - (controlEffectiveness / 100) * (vendor.inherentLikelihood - 1) * 1.5));
  const residualImpact = Math.max(1, Math.round(vendor.inherentImpact - (controlEffectiveness / 100) * (vendor.inherentImpact - 1) * 0.5));

  const inherentRisk = getRiskDetails(vendor.inherentLikelihood, vendor.inherentImpact);
  const residualRisk = getRiskDetails(residualLikelihood, residualImpact);

  // Identify Top 5 critical control gaps
  const controlGaps = activeControls
    .map(ctrl => {
      const ans = vendor.answers[ctrl.id];
      const isImplemented = ans ? ans.isImplemented : false;
      const maturity = ans ? ans.maturity : 'Ad-hoc';
      
      // A gap exists if control is not implemented, or if implemented but maturity is Ad-hoc
      const isGap = !isImplemented || (isImplemented && maturity === 'Ad-hoc');
      return {
        ctrl,
        isImplemented,
        maturity,
        score: ctrl.weight,
        reason: !isImplemented ? 'Control not implemented' : 'Maturity is Ad-hoc (Lacks structured control management)'
      };
    })
    .filter(item => {
      const ans = vendor.answers[item.ctrl.id];
      return !ans || !ans.isImplemented || ans.maturity === 'Ad-hoc';
    })
    .sort((a, b) => b.ctrl.weight - a.ctrl.weight) // Sort by descending weight (most critical first)
    .slice(0, 5);

  // Helper for 5x5 matrix visual inside PDF
  const rows = [5, 4, 3, 2, 1];
  const cols = [1, 2, 3, 4, 5];

  // Self-generated Executive Summary
  const getExecutiveSummary = () => {
    const aiContext = vendor.usesAgenticAI 
      ? "deploys highly autonomous Agentic AI capabilities, exposing the enterprise to advanced tool-execution and recursion loop vectors. Consequently, advanced controls from the CSA AI Controls Matrix (AICM) were included in scope."
      : "utilizes standard model capabilities (non-agentic). Module 3 (Agentic Autonomy) controls were scoped out to streamline evaluation.";
    
    const outcome = residualRisk.category === 'Critical' || residualRisk.category === 'High'
      ? `exhibits a remaining posture of **${residualRisk.category} Risk** (Score: ${residualRisk.score}). Significant control gaps exist in key areas, requiring a remediation plan prior to final system integration and deployment approval.`
      : `maintains a strong **${residualRisk.category} Risk** rating (Score: ${residualRisk.score}) post-mitigation. The current control effectiveness of **${controlEffectiveness.toFixed(1)}%** provides sufficient reasonable assurance of safety for standard enterprise operations.`;

    return `This Third-Party Vendor Risk Passport documents the technical and privacy assessment of **${vendor.name}** as conducted by the IT Governance and Risk team. The vendor ${aiContext} Based on rigorous control testing across Data Privacy (CAIQ v4) and AI Governance frameworks, the vendor ${outcome}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      passportVersion: "1.0",
      generatedAt: new Date().toISOString(),
      vendorName: vendor.name,
      assessmentStatus: vendor.status,
      scoping: vendor.usesAgenticAI ? "Agentic AI + Data Privacy Scoped" : "Standard LLM + Data Privacy Scoped",
      inherentRisk: { likelihood: vendor.inherentLikelihood, impact: vendor.inherentImpact, category: inherentRisk.category, score: inherentRisk.score },
      residualRisk: { likelihood: residualLikelihood, impact: residualImpact, category: residualRisk.category, score: residualRisk.score },
      controlEffectiveness: `${controlEffectiveness.toFixed(1)}%`,
      criticalControlGaps: controlGaps.map(g => ({
        code: g.ctrl.code,
        framework: g.ctrl.frameworkMapping,
        question: g.ctrl.question,
        severity: g.ctrl.weight
      })),
      answers: vendor.answers
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${vendor.name.toLowerCase().replace(/\s+/g, '_')}_risk_passport.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        
        {/* Header Actions */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="font-display font-semibold text-lg">Vendor Risk Passport</h2>
              <p className="text-xs text-slate-400">Confidential Security Attestation Document</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md transition-colors"
              title="Print Risk Passport"
            >
              <Printer className="w-4 h-4" />
              <span>Print PDF</span>
            </button>
            <button
              onClick={downloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md transition-colors"
              title="Export Flat Data"
            >
              <Download className="w-4 h-4" />
              <span>Export Raw Data</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div 
          ref={printRef} 
          className="flex-1 overflow-y-auto p-8 space-y-6 print:p-0 print:space-y-4 print:text-xs"
          id="passport-print-area"
        >
          {/* Cover Badge and Title */}
          <div className="border-b-2 border-slate-900 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block text-[10px] tracking-widest font-mono font-bold bg-slate-100 border border-slate-300 text-slate-700 px-2 py-0.5 rounded-sm mb-2">
                  CONFIDENTIAL / ENTERPRISE RISK USE ONLY
                </span>
                <h1 className="text-3xl font-display font-extrabold text-slate-900 print:text-2xl">
                  {vendor.name} Risk Passport
                </h1>
                <p className="text-slate-500 mt-1 text-sm">
                  Generated on July 4, 2026 • Verified by {vendor.lastAssessedBy || 'Control Manager'}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider ${
                  residualRisk.category === 'Critical' ? 'bg-red-100 text-red-800' :
                  residualRisk.category === 'High' ? 'bg-orange-100 text-orange-800' :
                  residualRisk.category === 'Medium' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  <Shield className="w-3.5 h-3.5" />
                  RESIDUAL: {residualRisk.category.toUpperCase()} ({residualRisk.score})
                </span>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-4 gap-4 mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 print:grid-cols-4 print:p-2 print:mt-4">
              <div>
                <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Assessment Status</span>
                <span className="font-semibold text-slate-800 text-sm">{vendor.status}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Scoping Domain</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {vendor.usesAgenticAI ? 'Agentic AI + LLM' : 'Standard LLM Only'}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Control Effectiveness</span>
                <span className="font-semibold text-indigo-700 text-sm font-mono">{controlEffectiveness.toFixed(1)}%</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Last Reviewed</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {vendor.lastAssessedAt ? new Date(vendor.lastAssessedAt).toLocaleDateString() : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h3 className="font-display font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2.5">
              1. Executive Assessment Summary
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm print:leading-normal print:text-xs" 
               dangerouslySetInnerHTML={{ __html: getExecutiveSummary() }} />
          </div>

          {/* Inherent vs Residual Mapping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 print:grid-cols-2 print:gap-4">
            {/* Risk Posture Overview */}
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-sm text-slate-900">
                Risk Posture Transition
              </h4>
              <div className="space-y-3">
                {/* Inherent Risk Card */}
                <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Inherent Risk Rating</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">
                      {inherentRisk.category} Posture ({inherentRisk.score})
                    </p>
                    <p className="text-xs text-slate-500">Likelihood: {vendor.inherentLikelihood} • Impact: {vendor.inherentImpact}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                    inherentRisk.category === 'Critical' ? 'bg-red-100 text-red-700' :
                    inherentRisk.category === 'High' ? 'bg-orange-100 text-orange-700' :
                    inherentRisk.category === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {inherentRisk.category}
                  </span>
                </div>

                {/* Arrow indicator */}
                <div className="flex justify-center -my-2">
                  <div className="bg-white border border-slate-200 shadow-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono text-emerald-600">
                    Mitigated by controls
                  </div>
                </div>

                {/* Residual Risk Card */}
                <div className={`p-3.5 border rounded-lg flex items-center justify-between ${residualRisk.border} ${residualRisk.bgLight}`}>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-600 uppercase">Residual Risk Rating</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">
                      {residualRisk.category} Posture ({residualRisk.score})
                    </p>
                    <p className="text-xs text-slate-600">Likelihood: {residualLikelihood} • Impact: {residualImpact}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                    residualRisk.category === 'Critical' ? 'bg-red-200 text-red-900' :
                    residualRisk.category === 'High' ? 'bg-orange-200 text-orange-900' :
                    residualRisk.category === 'Medium' ? 'bg-amber-200 text-amber-950' :
                    'bg-emerald-200 text-emerald-950'
                  }`}>
                    {residualRisk.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic 5x5 Matrix Visualizer for current vendor */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
              <div>
                <h4 className="font-display font-semibold text-sm text-slate-900 mb-2">
                  Interactive Risk Passport Heatmap
                </h4>
                <p className="text-xs text-slate-500 mb-4 no-print">
                  Visual mapping of the vendor\'s Inherent (I) and Residual (R) coordinates.
                </p>
              </div>

              {/* Mini Heatmap Grid */}
              <div className="w-full max-w-[280px] mx-auto space-y-1">
                {rows.map(r => (
                  <div key={r} className="flex gap-1 items-center">
                    {/* Y Axis Label */}
                    <span className="w-3 text-[10px] font-mono text-slate-400 text-right mr-1">{r}</span>
                    <div className="flex gap-1 flex-1">
                      {cols.map(c => {
                        const cellDetails = getRiskDetails(r, c);
                        const isOriginal = r === vendor.inherentLikelihood && c === vendor.inherentImpact;
                        const isResidual = r === residualLikelihood && c === residualImpact;
                        
                        let cellBg = 'bg-slate-100';
                        if (cellDetails.category === 'Low') cellBg = 'bg-emerald-200/50';
                        if (cellDetails.category === 'Medium') cellBg = 'bg-amber-200/50';
                        if (cellDetails.category === 'High') cellBg = 'bg-orange-200/50';
                        if (cellDetails.category === 'Critical') cellBg = 'bg-red-200/50';

                        let cellBorder = 'border-transparent';
                        if (isResidual) cellBorder = 'border-slate-900 ring-2 ring-slate-900 scale-105 z-10';
                        else if (isOriginal) cellBorder = 'border-dashed border-slate-500';

                        return (
                          <div 
                            key={c}
                            className={`aspect-square flex-1 rounded-sm border ${cellBorder} ${cellBg} relative flex items-center justify-center`}
                            style={{ minWidth: '32px', minHeight: '32px' }}
                            title={`L:${r} I:${c} (${cellDetails.category})`}
                          >
                            {isOriginal && isResidual && (
                              <span className="font-mono font-black text-xs text-slate-900" title="Inherent & Residual overlay">I+R</span>
                            )}
                            {isOriginal && !isResidual && (
                              <span className="font-mono font-bold text-xs text-slate-500" title="Inherent Location">I</span>
                            )}
                            {isResidual && !isOriginal && (
                              <span className="font-mono font-black text-xs text-slate-950 animate-pulse" title="Residual Location">R</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {/* X Axis Labels */}
                <div className="flex gap-1 items-center">
                  <span className="w-3"></span>
                  <div className="flex gap-1 flex-1">
                    {cols.map(c => (
                      <span key={c} className="flex-1 text-center text-[9px] font-mono text-slate-400 mt-0.5">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 Critical Control Gaps */}
          <div>
            <h3 className="font-display font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-3.5">
              2. Key Control Deficiencies (Gaps Ranked by Priority)
            </h3>
            {controlGaps.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium">No critical control gaps identified! The vendor conforms fully to the requested compliance baseline.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {controlGaps.map((gap, index) => (
                  <div key={gap.ctrl.id} className="p-3.5 border border-slate-200 rounded-lg bg-slate-50 flex gap-3 items-start">
                    <span className="bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold px-2 py-1 rounded font-mono uppercase shrink-0 mt-0.5">
                      GAP 0{index + 1}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 text-sm">{gap.ctrl.code}: {gap.ctrl.question}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                          {gap.ctrl.frameworkMapping}
                        </span>
                        <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">
                          Weight: {gap.ctrl.weight}/5
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{gap.ctrl.description}</p>
                      <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium mt-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Deficiency Details: {gap.reason}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Control Scorecard Section */}
          <div className="print:break-before-page pt-4">
            <h3 className="font-display font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-3.5">
              3. Structural Framework Compliance Mapping
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Module 1 Scorecard */}
              <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 font-display">
                  Data Governance & Privacy
                </h4>
                <div className="space-y-1.5 mt-2">
                  {masterControls.filter(c => c.module === 'privacy').map(c => {
                    const ans = vendor.answers[c.id];
                    return (
                      <div key={c.id} className="flex justify-between items-center text-xs border-b border-slate-100 pb-1.5">
                        <span className="font-mono text-slate-500 font-bold">{c.code}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-600 max-w-[120px] truncate" title={c.question}>{c.question}</span>
                          {ans && ans.isImplemented ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                              {ans.maturity}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded">
                              Ad-hoc
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Module 2 Scorecard */}
              <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 font-display">
                  Standard LLM Governance
                </h4>
                <div className="space-y-1.5 mt-2">
                  {masterControls.filter(c => c.module === 'standard-ai').map(c => {
                    const ans = vendor.answers[c.id];
                    return (
                      <div key={c.id} className="flex justify-between items-center text-xs border-b border-slate-100 pb-1.5">
                        <span className="font-mono text-slate-500 font-bold">{c.code}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-600 max-w-[120px] truncate" title={c.question}>{c.question}</span>
                          {ans && ans.isImplemented ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                              {ans.maturity}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded">
                              Ad-hoc
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Module 3 Scorecard */}
              <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 font-display">
                  Agentic AI Control Posture
                </h4>
                {!vendor.usesAgenticAI ? (
                  <div className="text-center py-6 text-xs text-slate-400 italic">
                    Agentic AI controls scoped out of assessment.
                  </div>
                ) : (
                  <div className="space-y-1.5 mt-2">
                    {masterControls.filter(c => c.module === 'agentic-ai').map(c => {
                      const ans = vendor.answers[c.id];
                      return (
                        <div key={c.id} className="flex justify-between items-center text-xs border-b border-slate-100 pb-1.5">
                          <span className="font-mono text-slate-500 font-bold">{c.code}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-600 max-w-[120px] truncate" title={c.question}>{c.question}</span>
                            {ans && ans.isImplemented ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                                {ans.maturity}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded">
                                Ad-hoc
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* CSA AI-CAIQ v1.0.2 Compliance Summary */}
            <div className="mt-6 p-4 border border-slate-200 rounded-lg bg-indigo-50/20">
              <h4 className="font-bold text-indigo-950 text-xs uppercase tracking-wider mb-2 font-display flex items-center justify-between">
                <span>CSA AI-CAIQ v1.0.2 Compliance Posture</span>
                <span className="font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-150 font-bold text-[10px]">
                  {answeredCaiq} / {totalCaiq} COMPLIANT ({caiqPct}%)
                </span>
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                Comprehensive vendor compliance verified across 18 CSA Cloud Controls Matrix Domains (AI-CAIQ v1.0.2). Detailed questionnaire records are securely archived inside the Risk Management system database.
              </p>
              <div className="w-full bg-slate-200/50 rounded-full h-2 overflow-hidden border border-slate-200">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${caiqPct}%` }} />
              </div>
            </div>

            {/* CSA CCM v4.1.0 Compliance Summary */}
            <div className="mt-4 p-4 border border-slate-200 rounded-lg bg-indigo-50/20">
              <h4 className="font-bold text-indigo-950 text-xs uppercase tracking-wider mb-2 font-display flex items-center justify-between">
                <span>CSA CCM v4.1.0 Compliance Posture</span>
                <span className="font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-150 font-bold text-[10px]">
                  {answeredCcm} / {totalCcm} COMPLIANT ({ccmPct}%)
                </span>
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                Comprehensive vendor compliance verified across all 17 standard domains of the CSA Cloud Controls Matrix (CCM) v4.1.0. Detailed specification tracking and implementation statuses are archived.
              </p>
              <div className="w-full bg-slate-200/50 rounded-full h-2 overflow-hidden border border-slate-200">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${ccmPct}%` }} />
              </div>
            </div>

          </div>

          {/* Print Sign-off Section */}
          <div className="pt-8 border-t border-slate-200 mt-6 grid grid-cols-3 gap-6 print:grid-cols-3 print:gap-4">
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">PREPARED BY</p>
              <div className="border-b border-slate-300 h-8 mt-2"></div>
              <p className="text-xs font-semibold text-slate-700 mt-1">{vendor.lastAssessedBy || 'Assessor Analyst'}</p>
              <p className="text-[10px] text-slate-400">Governance & Risk Assessor</p>
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">CONTROL MANAGER SIGN-OFF</p>
              <div className="border-b border-slate-300 h-8 mt-2"></div>
              <p className="text-xs font-semibold text-slate-700 mt-1">Amit Kumar</p>
              <p className="text-[10px] text-slate-400">Head of Enterprise AI Governance</p>
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">DATE APPROVED</p>
              <div className="border-b border-slate-300 h-8 mt-2"></div>
              <p className="text-xs font-semibold text-slate-700 mt-1">
                {vendor.lastAssessedAt ? new Date(vendor.lastAssessedAt).toLocaleDateString() : 'July 4, 2026'}
              </p>
              <p className="text-[10px] text-slate-400">Verification Timestamp</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex justify-between items-center text-xs text-slate-400 font-mono no-print">
          <span>CLASSIFICATION: INT-STRICTLY-CONFIDENTIAL</span>
          <span>ID: VP-{vendor.id.toUpperCase()}-2026</span>
        </div>
      </div>
    </div>
  );
}
