/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Vendor, ControlItem, ControlAnswer, MaturityLevel, getRiskDetails, UploadedFile } from '../types';
import { ControlCommentsSection } from './ControlCommentsSection';
import { Shield, AlertTriangle, CheckCircle, FileText, Upload, Trash2, ArrowRight, Save, Layers, HelpCircle, Search, Filter, Folder } from 'lucide-react';
import { AI_CAIQ_QUESTIONS, CaiqQuestion } from '../aiCaiqData';
import { CCM_CONTROLS, CcmControl } from '../ccmData';

interface AssessmentWizardTabProps {
  vendors: Vendor[];
  selectedVendorId: string | null;
  masterControls: ControlItem[];
  onSelectVendor: (id: string | null) => void;
  onSaveAssessment: (vendor: Vendor, logDetail: string) => void;
  onAddVendor: (vendor: { name: string; servicesProvided: string; description: string; usesAgenticAI: boolean; inherentLikelihood: number; inherentImpact: number }) => string;
}

export default function AssessmentWizardTab({
  vendors,
  selectedVendorId,
  masterControls,
  onSelectVendor,
  onSaveAssessment,
  onAddVendor
}: AssessmentWizardTabProps) {
  const [activeModule, setActiveModule] = useState<'privacy' | 'standard-ai' | 'agentic-ai'>('privacy');
  const [activeSet, setActiveSet] = useState<'matrix' | 'caiq' | 'ccm'>('matrix');
  const [caiqSearch, setCaiqSearch] = useState('');
  const [selectedCaiqDomain, setSelectedCaiqDomain] = useState<string>('All');
  const [ccmSearch, setCcmSearch] = useState('');
  const [selectedCcmDomain, setSelectedCcmDomain] = useState<string>('All');
  
  // New Vendor Form Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorServices, setNewVendorServices] = useState('');
  const [newVendorDesc, setNewVendorDesc] = useState('');
  const [newVendorAgentic, setNewVendorAgentic] = useState(false);
  const [newVendorL, setNewVendorL] = useState(3);
  const [newVendorI, setNewVendorI] = useState(3);

  // Local state for the actively edited vendor
  const [localVendor, setLocalVendor] = useState<Vendor | null>(null);
  
  // Drag-and-drop reference files
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActiveControlId, setDragActiveControlId] = useState<string | null>(null);

  // Fetch or sync the vendor to local state when selected vendor changes
  useEffect(() => {
    if (selectedVendorId) {
      const vend = vendors.find(v => v.id === selectedVendorId);
      if (vend) {
        // Deep copy the vendor to avoid directly mutating main state before clicking Save
        setLocalVendor(JSON.parse(JSON.stringify(vend)));
      }
    } else {
      setLocalVendor(null);
    }
  }, [selectedVendorId, vendors]);

  const activeVendor = localVendor;

  // Active controls based on current scoping (usesAgenticAI)
  const scopedControls = useMemo(() => {
    if (!activeVendor) return [];
    return masterControls.filter(ctrl => {
      if (ctrl.module === 'agentic-ai') {
        return activeVendor.usesAgenticAI;
      }
      return true;
    });
  }, [activeVendor, masterControls]);

  // Adjust active module tab if the current one gets scoped out
  useEffect(() => {
    if (activeVendor && !activeVendor.usesAgenticAI && activeModule === 'agentic-ai') {
      setActiveModule('privacy');
    }
  }, [activeVendor, activeModule]);

  // Calculate wizard stats
  const wizardStats = useMemo(() => {
    if (!activeVendor) return { total: 0, answered: 0, percentage: 0 };
    const total = scopedControls.length;
    let answered = 0;
    
    scopedControls.forEach(ctrl => {
      const ans = activeVendor.answers[ctrl.id];
      if (ans && ans.isImplemented) {
        answered++;
      }
    });

    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
    return { total, answered, percentage };
  }, [activeVendor, scopedControls]);

  // Dynamic list of unique CAIQ domains for drop-down filter
  const caiqDomains = useMemo(() => {
    const domains = new Set<string>();
    AI_CAIQ_QUESTIONS.forEach(q => domains.add(q.domain));
    return ['All', ...Array.from(domains)].sort();
  }, []);

  // Filtered list of CAIQ questions
  const filteredCaiqQuestions = useMemo(() => {
    return AI_CAIQ_QUESTIONS.filter(q => {
      const matchesDomain = selectedCaiqDomain === 'All' || q.domain === selectedCaiqDomain;
      const matchesSearch = q.id.toLowerCase().includes(caiqSearch.toLowerCase()) ||
                            q.question.toLowerCase().includes(caiqSearch.toLowerCase()) ||
                            (q.controlTitle && q.controlTitle.toLowerCase().includes(caiqSearch.toLowerCase())) ||
                            q.controlId.toLowerCase().includes(caiqSearch.toLowerCase());
      return matchesDomain && matchesSearch;
    });
  }, [selectedCaiqDomain, caiqSearch]);

  // CAIQ Progress stats
  const caiqStats = useMemo(() => {
    if (!activeVendor) return { total: 0, answered: 0, percentage: 0 };
    const total = AI_CAIQ_QUESTIONS.length;
    let answered = 0;
    
    AI_CAIQ_QUESTIONS.forEach(q => {
      const ans = activeVendor.answers[q.id];
      if (ans && ans.isImplemented) {
        answered++;
      }
    });

    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
    return { total, answered, percentage };
  }, [activeVendor]);

  // Domain-by-domain CAIQ progress breakdown
  const caiqDomainStats = useMemo(() => {
    const statsMap: Record<string, { total: number; answered: number }> = {};
    AI_CAIQ_QUESTIONS.forEach(q => {
      if (!statsMap[q.domain]) {
        statsMap[q.domain] = { total: 0, answered: 0 };
      }
      statsMap[q.domain].total += 1;
      if (activeVendor && activeVendor.answers[q.id]?.isImplemented) {
        statsMap[q.domain].answered += 1;
      }
    });
    return statsMap;
  }, [activeVendor]);

  // Dynamic list of unique CCM domains for drop-down filter
  const ccmDomains = useMemo(() => {
    const domains = new Set<string>();
    CCM_CONTROLS.forEach(q => domains.add(q.domain));
    return ['All', ...Array.from(domains)].sort();
  }, []);

  // Filtered list of CCM controls
  const filteredCcmControls = useMemo(() => {
    return CCM_CONTROLS.filter(q => {
      const matchesDomain = selectedCcmDomain === 'All' || q.domain === selectedCcmDomain;
      const matchesSearch = q.id.toLowerCase().includes(ccmSearch.toLowerCase()) ||
                            q.title.toLowerCase().includes(ccmSearch.toLowerCase()) ||
                            q.specification.toLowerCase().includes(ccmSearch.toLowerCase());
      return matchesDomain && matchesSearch;
    });
  }, [selectedCcmDomain, ccmSearch]);

  // CCM Progress stats
  const ccmStats = useMemo(() => {
    if (!activeVendor) return { total: 0, answered: 0, percentage: 0 };
    const total = CCM_CONTROLS.length;
    let answered = 0;
    
    CCM_CONTROLS.forEach(q => {
      const ans = activeVendor.answers[q.id];
      if (ans && ans.isImplemented) {
        answered++;
      }
    });

    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
    return { total, answered, percentage };
  }, [activeVendor]);

  // Domain-by-domain CCM progress breakdown
  const ccmDomainStats = useMemo(() => {
    const statsMap: Record<string, { total: number; answered: number }> = {};
    CCM_CONTROLS.forEach(q => {
      if (!statsMap[q.domain]) {
        statsMap[q.domain] = { total: 0, answered: 0 };
      }
      statsMap[q.domain].total += 1;
      if (activeVendor && activeVendor.answers[q.id]?.isImplemented) {
        statsMap[q.domain].answered += 1;
      }
    });
    return statsMap;
  }, [activeVendor]);

  // Calculations for sticky real-time scoring helper
  const scoreResults = useMemo(() => {
    if (!activeVendor) return null;
    const totalMax = scopedControls.reduce((sum, c) => sum + c.weight, 0);
    let actual = 0;

    scopedControls.forEach(ctrl => {
      const ans = activeVendor.answers[ctrl.id];
      if (ans && ans.isImplemented) {
        const factor = ans.maturity === 'Optimized' ? 1.0 : ans.maturity === 'Managed' ? 0.7 : 0.3;
        actual += ctrl.weight * factor;
      }
    });

    const controlEffectiveness = totalMax > 0 ? (actual / totalMax) * 100 : 0;
    
    // Risk formula mapping control mitigation
    const residualLikelihood = Math.max(1, Math.round(activeVendor.inherentLikelihood - (controlEffectiveness / 100) * (activeVendor.inherentLikelihood - 1) * 1.5));
    const residualImpact = Math.max(1, Math.round(activeVendor.inherentImpact - (controlEffectiveness / 100) * (activeVendor.inherentImpact - 1) * 0.5));

    return {
      controlEffectiveness,
      residualLikelihood,
      residualImpact,
      inherentRisk: getRiskDetails(activeVendor.inherentLikelihood, activeVendor.inherentImpact),
      residualRisk: getRiskDetails(residualLikelihood, residualImpact)
    };
  }, [activeVendor, scopedControls]);

  // Form event handlers
  const handleInherentLChange = (val: number) => {
    if (!activeVendor) return;
    setLocalVendor({ ...activeVendor, inherentLikelihood: val });
  };

  const handleInherentIChange = (val: number) => {
    if (!activeVendor) return;
    setLocalVendor({ ...activeVendor, inherentImpact: val });
  };

  const handleScopingToggle = (checked: boolean) => {
    if (!activeVendor) return;
    setLocalVendor({ ...activeVendor, usesAgenticAI: checked });
  };

  const handleControlToggle = (ctrlId: string, checked: boolean) => {
    if (!activeVendor) return;
    const answers = { ...activeVendor.answers };
    
    if (checked) {
      answers[ctrlId] = {
        controlId: ctrlId,
        isImplemented: true,
        maturity: answers[ctrlId]?.maturity || 'Managed',
        evidence: answers[ctrlId]?.evidence || '',
        uploadedFiles: answers[ctrlId]?.uploadedFiles || []
      };
    } else {
      // Keep other attributes but mark implemented as false
      answers[ctrlId] = {
        controlId: ctrlId,
        isImplemented: false,
        maturity: 'Ad-hoc',
        evidence: answers[ctrlId]?.evidence || '',
        uploadedFiles: answers[ctrlId]?.uploadedFiles || []
      };
    }
    setLocalVendor({ ...activeVendor, answers });
  };

  const handleMaturityChange = (ctrlId: string, value: MaturityLevel) => {
    if (!activeVendor) return;
    const answers = { ...activeVendor.answers };
    if (answers[ctrlId]) {
      answers[ctrlId].maturity = value;
      setLocalVendor({ ...activeVendor, answers });
    }
  };

  const handleEvidenceChange = (ctrlId: string, value: string) => {
    if (!activeVendor) return;
    const answers = { ...activeVendor.answers };
    if (!answers[ctrlId]) {
      answers[ctrlId] = { controlId: ctrlId, isImplemented: false, maturity: 'Ad-hoc', evidence: '', uploadedFiles: [] };
    }
    answers[ctrlId].evidence = value;
    setLocalVendor({ ...activeVendor, answers });
  };

  const getCaiqRiskRating = (impact: 'Low' | 'Medium' | 'High', probability: 'Low' | 'Medium' | 'High'): 'Low' | 'Medium' | 'High' | 'Critical' => {
    if (impact === 'High' && probability === 'High') return 'Critical';
    if (impact === 'High' && probability === 'Medium') return 'High';
    if (impact === 'Medium' && probability === 'High') return 'High';
    if (impact === 'Low' && probability === 'High') return 'Medium';
    if (impact === 'Medium' && probability === 'Medium') return 'Medium';
    if (impact === 'High' && probability === 'Low') return 'Medium';
    return 'Low';
  };

  const handleRiskImpactChange = (ctrlId: string, value: 'Low' | 'Medium' | 'High') => {
    if (!activeVendor) return;
    const answers = { ...activeVendor.answers };
    if (!answers[ctrlId]) {
      answers[ctrlId] = { controlId: ctrlId, isImplemented: false, maturity: 'Ad-hoc', evidence: '', uploadedFiles: [] };
    }
    answers[ctrlId].riskImpact = value;
    const probability = answers[ctrlId].riskProbability || 'Medium';
    answers[ctrlId].riskRating = getCaiqRiskRating(value, probability);
    setLocalVendor({ ...activeVendor, answers });
  };

  const handleRiskProbabilityChange = (ctrlId: string, value: 'Low' | 'Medium' | 'High') => {
    if (!activeVendor) return;
    const answers = { ...activeVendor.answers };
    if (!answers[ctrlId]) {
      answers[ctrlId] = { controlId: ctrlId, isImplemented: false, maturity: 'Ad-hoc', evidence: '', uploadedFiles: [] };
    }
    answers[ctrlId].riskProbability = value;
    const impact = answers[ctrlId].riskImpact || 'Medium';
    answers[ctrlId].riskRating = getCaiqRiskRating(impact, value);
    setLocalVendor({ ...activeVendor, answers });
  };

  const handleSafeguardsChange = (ctrlId: string, value: string) => {
    if (!activeVendor) return;
    const answers = { ...activeVendor.answers };
    if (!answers[ctrlId]) {
      answers[ctrlId] = { controlId: ctrlId, isImplemented: false, maturity: 'Ad-hoc', evidence: '', uploadedFiles: [] };
    }
    answers[ctrlId].safeguards = value;
    setLocalVendor({ ...activeVendor, answers });
  };

  const handleEvidenceTypeChange = (ctrlId: string, value: 'text' | 'upload' | 'both') => {
    if (!activeVendor) return;
    const answers = { ...activeVendor.answers };
    if (!answers[ctrlId]) {
      answers[ctrlId] = { controlId: ctrlId, isImplemented: false, maturity: 'Ad-hoc', evidence: '', uploadedFiles: [] };
    }
    answers[ctrlId].evidenceType = value;
    setLocalVendor({ ...activeVendor, answers });
  };

  // Upload/Evidence Vault Simulation
  const handleDrag = (e: React.DragEvent, ctrlId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveControlId(ctrlId);
    } else if (e.type === "dragleave") {
      setDragActiveControlId(null);
    }
  };

  const addMockFile = (ctrlId: string, fileName: string, fileSize: number) => {
    if (!activeVendor) return;
    const answers = { ...activeVendor.answers };
    if (!answers[ctrlId]) {
      answers[ctrlId] = { controlId: ctrlId, isImplemented: false, maturity: 'Ad-hoc', evidence: '', uploadedFiles: [] };
    }
    const newFile: UploadedFile = {
      id: `f-${Date.now()}`,
      name: fileName,
      size: fileSize,
      type: 'application/pdf',
      uploadedAt: new Date().toISOString()
    };
    answers[ctrlId].uploadedFiles = [...answers[ctrlId].uploadedFiles, newFile];
    setLocalVendor({ ...activeVendor, answers });
  };

  const handleDrop = (e: React.DragEvent, ctrlId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveControlId(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      addMockFile(ctrlId, file.name, file.size);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, ctrlId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      addMockFile(ctrlId, file.name, file.size);
    }
  };

  const handleDeleteFile = (ctrlId: string, fileId: string) => {
    if (!activeVendor) return;
    const answers = { ...activeVendor.answers };
    if (answers[ctrlId]) {
      answers[ctrlId].uploadedFiles = answers[ctrlId].uploadedFiles.filter(f => f.id !== fileId);
      setLocalVendor({ ...activeVendor, answers });
    }
  };

  // Save changes to App level
  const handleSaveClick = () => {
    if (!activeVendor || !scoreResults) return;
    
    // Formulate a clean, comprehensive audit log summary
    const status = wizardStats.percentage === 100 ? 'Completed' : 'In Progress';
    const updatedVendor: Vendor = {
      ...activeVendor,
      status: status as any,
      lastAssessedBy: 'Amit Kumar (Control Manager)',
      lastAssessedAt: new Date().toISOString()
    };

    const details = `Recalculated Residual Risk at Likelihood: ${scoreResults.residualLikelihood}, Impact: ${scoreResults.residualImpact} (${scoreResults.residualRisk.category}). Scoped Core Controls answered: ${wizardStats.answered}/${wizardStats.total} (${wizardStats.percentage}%). CSA AI-CAIQ v1.0.2 Questionnaire answered: ${caiqStats.answered}/${caiqStats.total} (${caiqStats.percentage}%). CSA CCM v4.1.0 answered: ${ccmStats.answered}/${ccmStats.total} (${ccmStats.percentage}%). Dynamic Scoping: Agentic AI is ${updatedVendor.usesAgenticAI ? 'ENABLED' : 'DISABLED'}.`;

    onSaveAssessment(updatedVendor, details);
  };

  // Add Vendor click
  const handleAddVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;

    const newId = onAddVendor({
      name: newVendorName,
      servicesProvided: newVendorServices || 'Standard Service Delivery',
      description: newVendorDesc || 'No vendor description provided.',
      usesAgenticAI: newVendorAgentic,
      inherentLikelihood: newVendorL,
      inherentImpact: newVendorI
    });

    // Reset Form
    setNewVendorName('');
    setNewVendorServices('');
    setNewVendorDesc('');
    setNewVendorAgentic(false);
    setNewVendorL(3);
    setNewVendorI(3);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Selector and Dynamic Scoping Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Selected Third-Party Vendor</label>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedVendorId || ''}
              onChange={e => onSelectVendor(e.target.value ? e.target.value : null)}
              className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 rounded-lg text-sm font-semibold text-slate-800 min-w-[240px] cursor-pointer"
            >
              <option value="">-- Choose Vendor to Assess --</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.status})
                </option>
              ))}
            </select>
            <span className="text-slate-300">or</span>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              + Create New Profile
            </button>
          </div>
        </div>

        {activeVendor && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-8 md:min-w-[320px]">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Control Scoping Module</span>
              <p className="font-bold text-slate-800 text-sm mt-0.5">Deploys Agentic AI capabilities?</p>
              <p className="text-[10px] text-slate-500 max-w-xs mt-0.5">Controls Module 3 (Autonomy boundaries) status</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={activeVendor.usesAgenticAI}
                onChange={e => handleScopingToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-slate-900 dark:bg-slate-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-400 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        )}
      </div>

      {!activeVendor ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-slate-800">No Vendor Selected</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            Please choose an existing third-party profile from the dropdown list above, or initialize a clean one to begin mapping controls.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Framework / Assessment Set Selector */}
          <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center gap-2 no-print">
            <button
              onClick={() => setActiveSet('matrix')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-2.5 ${
                activeSet === 'matrix'
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              <Shield className={`w-4 h-4 shrink-0 ${activeSet === 'matrix' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <div className="text-left truncate">
                <span className="block text-xs font-bold">Enterprise Core Matrix</span>
                <span className="block text-[9px] font-mono font-medium text-slate-400">13 Governance Controls (Weighted Score)</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveSet('caiq')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-2.5 ${
                activeSet === 'caiq'
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              <Layers className={`w-4 h-4 shrink-0 ${activeSet === 'caiq' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <div className="text-left truncate">
                <span className="block text-xs font-bold">CSA AI-CAIQ v1.0.2 Questionnaire</span>
                <span className="block text-[9px] font-mono font-medium text-slate-400">{AI_CAIQ_QUESTIONS.length} Framework Questions</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSet('ccm')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-2.5 ${
                activeSet === 'ccm'
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              <FileText className={`w-4 h-4 shrink-0 ${activeSet === 'ccm' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <div className="text-left truncate">
                <span className="block text-xs font-bold">CSA CCM v4.1.0 Specifications</span>
                <span className="block text-[9px] font-mono font-medium text-slate-400">{CCM_CONTROLS.length} Control Specifications</span>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Assessment Questionnaire (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeSet === 'matrix' ? (
              <>
                {/* Module Tab Selector and Progress */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={() => setActiveModule('privacy')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeModule === 'privacy' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    1. Data Privacy & Governance
                  </button>
                  <button
                    onClick={() => setActiveModule('standard-ai')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeModule === 'standard-ai' 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    2. Standard LLM Governance
                  </button>
                  {activeVendor.usesAgenticAI && (
                    <button
                      onClick={() => setActiveModule('agentic-ai')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeModule === 'agentic-ai' 
                          ? 'bg-slate-900 text-white shadow-xs' 
                          : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      3. Agentic AI Risk (Advanced)
                    </button>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-500">
                    SCORED: {wizardStats.answered} / {wizardStats.total} ({wizardStats.percentage}%)
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden min-w-[120px]">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full transition-all" 
                      style={{ width: `${wizardStats.percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Inherent Risk Config Details */}
              <div className="p-5 border-b border-slate-200 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Inherent Likelihood Rating</label>
                  <select
                    value={activeVendor.inherentLikelihood}
                    onChange={e => handleInherentLChange(parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer font-medium"
                  >
                    <option value={1}>1 - Rare (Highly improbable event)</option>
                    <option value={2}>2 - Unlikely (Occasional past frequency)</option>
                    <option value={3}>3 - Possible (Likely to occur once a year)</option>
                    <option value={4}>4 - Likely (High probability of execution failure)</option>
                    <option value={5}>5 - Almost Certain (Recurring system hazard)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Inherent Impact Rating</label>
                  <select
                    value={activeVendor.inherentImpact}
                    onChange={e => handleInherentIChange(parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer font-medium"
                  >
                    <option value={1}>1 - Insignificant (Negligible operational friction)</option>
                    <option value={2}>2 - Minor (Temporary performance degradation)</option>
                    <option value={3}>3 - Moderate (Localized compliance breach)</option>
                    <option value={4}>4 - Major (System downtime, data exposure)</option>
                    <option value={5}>5 - Critical (Catastrophic brand loss, massive fine)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Questions Grid list */}
            <div className="space-y-4">
              {masterControls
                .filter(ctrl => ctrl.module === activeModule)
                .map(ctrl => {
                  const ans = activeVendor.answers[ctrl.id] || {
                    controlId: ctrl.id,
                    isImplemented: false,
                    maturity: 'Ad-hoc',
                    evidence: '',
                    uploadedFiles: []
                  };

                  return (
                    <div 
                      key={ctrl.id} 
                      className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4"
                    >
                      {/* Top Code Badge & Question */}
                      <div className="flex justify-between items-start gap-3 flex-wrap">
                        <div className="space-y-1 max-w-[80%]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                              {ctrl.code}
                            </span>
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-bold">
                              {ctrl.frameworkMapping}
                            </span>
                            {ctrl.directoryTitle && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-indigo-50 border border-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-bold">
                                <Folder className="w-3 h-3 text-indigo-600 shrink-0" />
                                {ctrl.directoryTitle}
                              </span>
                            )}
                            <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">
                              Weight: {ctrl.weight}/5
                            </span>
                          </div>
                          <h4 className="font-display font-semibold text-slate-900 text-sm mt-1">{ctrl.question}</h4>
                          <p className="text-xs text-slate-500 leading-normal">{ctrl.description}</p>
                        </div>

                        {/* Implemented Toggle Switch */}
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Control Present</span>
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={ans.isImplemented}
                              onChange={e => handleControlToggle(ctrl.id, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-slate-900 dark:bg-slate-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-400 peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      </div>

                      {/* Maturity Level Dropdown */}
                      {ans.isImplemented && (
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg animate-fadeIn">
                          <div className="sm:col-span-1 space-y-1">
                            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Maturity Level</label>
                            <select
                              value={ans.maturity}
                              onChange={e => handleMaturityChange(ctrl.id, e.target.value as MaturityLevel)}
                              className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs cursor-pointer font-medium"
                            >
                              <option value="Ad-hoc">Ad-hoc (30%)</option>
                              <option value="Managed">Managed (70%)</option>
                              <option value="Optimized">Optimized (100%)</option>
                            </select>
                          </div>
                          <div className="sm:col-span-3 text-slate-500 text-xs flex flex-col justify-center">
                            <span className="font-semibold text-slate-700">Maturity Impact on Control Effectiveness:</span>
                            <span className="text-[11px] leading-relaxed mt-0.5">
                              {ans.maturity === 'Ad-hoc' && 'Reactive, non-documented controls. Limits efficacy to 30% of total pre-assigned weight.'}
                              {ans.maturity === 'Managed' && 'Formally documented and systematically reviewed. Multiplies control weight by 70%.'}
                              {ans.maturity === 'Optimized' && 'Continuously improved, automated guardrails with telemetry validation. Enforces full 100% control efficacy.'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Evidence Field & Vault Zone */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Evidence Links & Notes</label>
                          <textarea
                            rows={3}
                            placeholder="Provide link to SOC 2 report, system configuration, policies, or specify audit notes..."
                            value={ans.evidence}
                            onChange={e => handleEvidenceChange(ctrl.id, e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 rounded-lg text-xs"
                          />
                        </div>

                        {/* Drop Zone */}
                        <div className="space-y-1.5 flex flex-col">
                          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Evidence Vault (Uploader)</label>
                          <div
                            onDragEnter={e => handleDrag(e, ctrl.id)}
                            onDragOver={e => handleDrag(e, ctrl.id)}
                            onDragLeave={e => handleDrag(e, ctrl.id)}
                            onDrop={e => handleDrop(e, ctrl.id)}
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex-1 border-2 border-dashed rounded-lg p-3 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                              dragActiveControlId === ctrl.id 
                                ? 'border-indigo-600 bg-indigo-50' 
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                            }`}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={e => handleFileSelect(e, ctrl.id)}
                              className="hidden"
                              accept=".pdf,.docx,.xlsx,.png,.jpg"
                            />
                            <Upload className="w-4 h-4 text-slate-400 mb-1" />
                            <span className="text-[10px] font-semibold text-slate-600 block">Drag & Drop file or Click to upload</span>
                            <span className="text-[9px] text-slate-400">PDF, SOC2, Policies (Max 10MB)</span>
                          </div>

                          {/* Uploaded files display */}
                          {ans.uploadedFiles && ans.uploadedFiles.length > 0 && (
                            <div className="space-y-1 mt-1.5">
                              {ans.uploadedFiles.map(file => (
                                <div key={file.id} className="flex items-center justify-between p-1.5 bg-emerald-50 border border-emerald-100 text-[10px] rounded-md font-medium">
                                  <div className="flex items-center gap-1.5 text-emerald-800 truncate max-w-[80%]">
                                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="truncate" title={file.name}>{file.name}</span>
                                    <span className="text-emerald-500 font-mono text-[9px]">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteFile(ctrl.id, file.id)}
                                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                                    title="Delete file"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Comments & Gap Annotations */}
                      <ControlCommentsSection
                        controlId={ctrl.id}
                        vendorId={activeVendor.id}
                        answer={ans}
                        onUpdateAnswer={(ctrlId, updatedAns) => {
                          const answers = { ...activeVendor.answers, [ctrlId]: updatedAns };
                          setLocalVendor({ ...activeVendor, answers });
                        }}
                      />

                    </div>
                  );
                })}
            </div>
          </>
        ) : activeSet === 'caiq' ? (
          <>
            {/* CSA AI-CAIQ Filter and Stats Panel */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">CSA AI-CAIQ v1.0.2 Questionnaire</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Filter across {AI_CAIQ_QUESTIONS.length} specific controls mapped to the Cloud Controls Matrix.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    PROGRESS: {caiqStats.answered} / {caiqStats.total} ({caiqStats.percentage}%)
                  </span>
                  <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${caiqStats.percentage}%` }} />
                  </div>
                </div>
              </div>

              {/* Filter controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {/* Domain filter */}
                <div className="relative">
                  <select
                    value={selectedCaiqDomain}
                    onChange={e => setSelectedCaiqDomain(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-xs cursor-pointer font-medium focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  >
                    <option value="All">All Domains (Entire Questionnaire)</option>
                    {caiqDomains.filter(d => d !== 'All').map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                  <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>

                {/* Search box */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search questions, IDs or control codes..."
                    value={caiqSearch}
                    onChange={e => setCaiqSearch(e.target.value)}
                    className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  {caiqSearch && (
                    <button
                      onClick={() => setCaiqSearch('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Question results count */}
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium px-1">
              <span>Showing {filteredCaiqQuestions.length} of {AI_CAIQ_QUESTIONS.length} assessment questions</span>
              {selectedCaiqDomain !== 'All' && (
                <button
                  onClick={() => setSelectedCaiqDomain('All')}
                  className="text-indigo-600 hover:underline cursor-pointer font-semibold text-[11px]"
                >
                  Clear Domain Filter
                </button>
              )}
            </div>

            {/* CSA AI-CAIQ Questionnaire Questions */}
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
              {filteredCaiqQuestions.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                  <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No matching AI-CAIQ questions found. Adjust your search or filters.</p>
                </div>
              ) : (
                filteredCaiqQuestions.slice(0, 30).map(q => {
                  const ans = activeVendor.answers[q.id] || {
                    controlId: q.id,
                    isImplemented: false,
                    maturity: 'Ad-hoc' as MaturityLevel,
                    evidence: '',
                    uploadedFiles: []
                  };

                  const riskImpact = ans.riskImpact || 'Medium';
                  const riskProbability = ans.riskProbability || 'Medium';
                  const riskRating = ans.riskRating || getCaiqRiskRating(riskImpact, riskProbability);
                  const safeguards = ans.safeguards || '';
                  const evidenceType = ans.evidenceType || 'text';

                  return (
                    <div 
                      key={q.id} 
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 animate-fadeIn"
                    >
                      {/* Top Header Row */}
                      <div className="flex justify-between items-start gap-3 flex-wrap border-b border-slate-100 pb-3">
                        <div className="space-y-1 max-w-[80%]">
                          <div className="flex items-center gap-2 flex-wrap text-[10px]">
                            <span className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                              {q.id}
                            </span>
                            <span className="font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-bold">
                              {q.domain}
                            </span>
                            {q.controlTitle && (
                              <span className="text-slate-500 truncate max-w-[200px]" title={q.controlTitle}>
                                Ref: {q.controlTitle}
                              </span>
                            )}
                          </div>
                          <h4 className="font-sans font-medium text-slate-900 text-xs mt-1 leading-relaxed">{q.question}</h4>
                        </div>

                        {/* Yes/No Compliant Selector */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Is Compliant?</span>
                          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-150">
                            <button
                              type="button"
                              onClick={() => handleControlToggle(q.id, true)}
                              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                ans.isImplemented
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <span>Compliant</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleControlToggle(q.id, false)}
                              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                !ans.isImplemented
                                  ? 'bg-rose-600 text-white shadow-sm'
                                  : 'text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <span>Non-Compliant</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Main assessment sub-grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        
                        {/* LEFT COLUMN: Risk Profiling & Safeguards */}
                        <div className="space-y-4">
                          
                          {/* 1. Risk Profiling Box */}
                          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150 space-y-3">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">1. Risk Profiling & Rating</span>
                            
                            <div className="grid grid-cols-2 gap-3">
                              
                              {/* Risk Impact */}
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-600">Risk Impact</label>
                                <select
                                  value={riskImpact}
                                  onChange={e => handleRiskImpactChange(q.id, e.target.value as 'Low' | 'Medium' | 'High')}
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-[11px] cursor-pointer font-medium text-slate-700 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                                >
                                  <option value="Low">Low</option>
                                  <option value="Medium">Medium</option>
                                  <option value="High">High</option>
                                </select>
                              </div>

                              {/* Risk Probability */}
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-600">Risk Probability</label>
                                <select
                                  value={riskProbability}
                                  onChange={e => handleRiskProbabilityChange(q.id, e.target.value as 'Low' | 'Medium' | 'High')}
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-[11px] cursor-pointer font-medium text-slate-700 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                                >
                                  <option value="Low">Low</option>
                                  <option value="Medium">Medium</option>
                                  <option value="High">High</option>
                                </select>
                              </div>

                            </div>

                            {/* Aligned Risk Rating */}
                            <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between gap-4">
                              <span className="text-[10px] font-bold text-slate-500">Aligned Risk Rating:</span>
                              
                              {riskRating === 'Critical' && (
                                <span className="bg-red-950 text-red-200 border border-red-900 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase animate-pulse">
                                  🔥 CRITICAL RISK
                                </span>
                              )}
                              {riskRating === 'High' && (
                                <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase">
                                  🔴 HIGH RISK
                                </span>
                              )}
                              {riskRating === 'Medium' && (
                                <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase">
                                  🟡 MEDIUM RISK
                                </span>
                              )}
                              {riskRating === 'Low' && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase">
                                  🟢 LOW RISK
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 2. Safeguards Box */}
                          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150 space-y-2">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">2. Implemented Safeguards</span>
                            <textarea
                              rows={2}
                              placeholder="Specify technical, administrative or physical controls that mitigate the identified risk..."
                              value={safeguards}
                              onChange={e => handleSafeguardsChange(q.id, e.target.value)}
                              className="w-full p-2 bg-white border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 rounded-lg text-[11px] placeholder:text-slate-400 text-slate-700"
                            />
                          </div>

                          {/* 3. Compliance Maturity Level */}
                          {ans.isImplemented && (
                            <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider">3. Compliance Maturity Level</span>
                                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded uppercase">
                                  {ans.maturity === 'Optimized' ? '100% Score' : ans.maturity === 'Managed' ? '70% Score' : '30% Score'}
                                </span>
                              </div>
                              <select
                                value={ans.maturity}
                                onChange={e => handleMaturityChange(q.id, e.target.value as MaturityLevel)}
                                className="w-full px-2 py-1 bg-white border border-indigo-200 rounded-md text-[11px] cursor-pointer font-medium text-indigo-900 focus:ring-1 focus:ring-indigo-600"
                              >
                                <option value="Ad-hoc">Ad-hoc (Reactive, unmeasured)</option>
                                <option value="Managed">Managed (Documented & audited)</option>
                                <option value="Optimized">Optimized (Continuous & automated)</option>
                              </select>
                            </div>
                          )}

                        </div>

                        {/* RIGHT COLUMN: Evidence Submission Choice & Inputs */}
                        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-150 flex flex-col justify-between space-y-3">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">3. Evidence Submission</span>
                              
                              {/* Selector for evidenceType */}
                              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => handleEvidenceTypeChange(q.id, 'text')}
                                  className={`px-2 py-0.5 rounded-md text-[9px] font-bold cursor-pointer transition-all ${
                                    evidenceType === 'text' 
                                      ? 'bg-indigo-600 text-white shadow-xs' 
                                      : 'text-slate-500 hover:text-slate-700'
                                  }`}
                                >
                                  Text Notes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEvidenceTypeChange(q.id, 'upload')}
                                  className={`px-2 py-0.5 rounded-md text-[9px] font-bold cursor-pointer transition-all ${
                                    evidenceType === 'upload' 
                                      ? 'bg-indigo-600 text-white shadow-xs' 
                                      : 'text-slate-500 hover:text-slate-700'
                                  }`}
                                >
                                  Upload
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEvidenceTypeChange(q.id, 'both')}
                                  className={`px-2 py-0.5 rounded-md text-[9px] font-bold cursor-pointer transition-all ${
                                    evidenceType === 'both' 
                                      ? 'bg-indigo-600 text-white shadow-xs' 
                                      : 'text-slate-500 hover:text-slate-700'
                                  }`}
                                >
                                  Both
                                </button>
                              </div>
                            </div>

                            {/* Textarea Box (Visible if type is 'text' or 'both') */}
                            {(evidenceType === 'text' || evidenceType === 'both') && (
                              <div className="space-y-1 animate-fadeIn">
                                <label className="block text-[10px] font-bold text-slate-600">Evidence Documentation Notes</label>
                                <textarea
                                  rows={evidenceType === 'both' ? 2 : 5}
                                  placeholder="Specify SOC 2 references, policy titles, or architectural notes..."
                                  value={ans.evidence}
                                  onChange={e => handleEvidenceChange(q.id, e.target.value)}
                                  className="w-full p-2 bg-white border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 rounded-lg text-[11px] placeholder:text-slate-400 text-slate-700 font-medium"
                                />
                              </div>
                            )}

                            {/* File Upload Box (Visible if type is 'upload' or 'both') */}
                            {(evidenceType === 'upload' || evidenceType === 'both') && (
                              <div className="space-y-1 animate-fadeIn">
                                <label className="block text-[10px] font-bold text-slate-600">Evidence Vault Upload</label>
                                <div
                                  onDragEnter={e => handleDrag(e, q.id)}
                                  onDragOver={e => handleDrag(e, q.id)}
                                  onDragLeave={e => handleDrag(e, q.id)}
                                  onDrop={e => handleDrop(e, q.id)}
                                  onClick={() => fileInputRef.current?.click()}
                                  className={`border-2 border-dashed rounded-lg p-3 text-center flex flex-col items-center justify-center transition-all cursor-pointer bg-white ${
                                    dragActiveControlId === q.id 
                                      ? 'border-indigo-600 bg-indigo-50' 
                                      : 'border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/10'
                                  }`}
                                >
                                  <Upload className="w-5 h-5 text-indigo-600 mb-1 animate-pulse" />
                                  <span className="text-[10px] font-bold text-slate-700">Drag & Drop or Click to Upload</span>
                                  <span className="text-[9px] text-slate-400 mt-0.5">PDF, DOCX, XLSX, JSON or ZIP files</span>
                                </div>

                                {ans.uploadedFiles && ans.uploadedFiles.length > 0 && (
                                  <div className="space-y-1 mt-2">
                                    {ans.uploadedFiles.map(file => (
                                      <div key={file.id} className="flex items-center justify-between p-1.5 bg-indigo-50 border border-indigo-100 text-[10px] rounded-lg">
                                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                          <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                          <span className="truncate font-semibold text-indigo-950" title={file.name}>{file.name}</span>
                                        </div>
                                        <button
                                          onClick={() => handleDeleteFile(q.id, file.id)}
                                          className="text-rose-500 hover:text-rose-700 cursor-pointer p-0.5 hover:bg-rose-50 rounded"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                          </div>

                          <div className="text-[10px] text-slate-400 leading-normal flex items-center gap-1 bg-slate-100 p-2 rounded-lg border border-slate-200">
                            <CheckCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>Risk and compliance inputs auto-saved to active buffer.</span>
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })
              )}
              {filteredCaiqQuestions.length > 30 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-[11px] text-slate-500">
                    Showing first 30 of {filteredCaiqQuestions.length} questions. Please use the search input or domain filters to narrow down the active set.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* CSA CCM v4.1.0 Filter and Stats Panel */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">CSA Cloud Controls Matrix (CCM) v4.1.0 Specifications</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Filter across {CCM_CONTROLS.length} standard control specifications mapped to the Cloud Controls Matrix.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    PROGRESS: {ccmStats.answered} / {ccmStats.total} ({ccmStats.percentage}%)
                  </span>
                  <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${ccmStats.percentage}%` }} />
                  </div>
                </div>
              </div>

              {/* Filter controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {/* Domain filter */}
                <div className="relative">
                  <select
                    value={selectedCcmDomain}
                    onChange={e => setSelectedCcmDomain(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-xs cursor-pointer font-medium focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  >
                    <option value="All">All Domains (Entire CCM Specifications)</option>
                    {ccmDomains.filter(d => d !== 'All').map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                  <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>

                {/* Search box */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search controls, IDs or specifications..."
                    value={ccmSearch}
                    onChange={e => setCcmSearch(e.target.value)}
                    className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  {ccmSearch && (
                    <button
                      onClick={() => setCcmSearch('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Question results count */}
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium px-1">
              <span>Showing {filteredCcmControls.length} of {CCM_CONTROLS.length} CCM control specifications</span>
              {selectedCcmDomain !== 'All' && (
                <button
                  onClick={() => setSelectedCcmDomain('All')}
                  className="text-indigo-600 hover:underline cursor-pointer font-semibold text-[11px]"
                >
                  Clear Domain Filter
                </button>
              )}
            </div>

            {/* CSA CCM v4.1.0 Control Specifications */}
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
              {filteredCcmControls.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                  <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No matching CCM specifications found. Adjust your search or filters.</p>
                </div>
              ) : (
                filteredCcmControls.slice(0, 30).map(q => {
                  const ans = activeVendor.answers[q.id] || {
                    controlId: q.id,
                    isImplemented: false,
                    maturity: 'Ad-hoc',
                    evidence: '',
                    uploadedFiles: []
                  };

                  return (
                    <div 
                      key={q.id} 
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 animate-fadeIn"
                    >
                      <div className="flex justify-between items-start gap-3 flex-wrap">
                        <div className="space-y-1 max-w-[80%]">
                          <div className="flex items-center gap-2 flex-wrap text-[10px]">
                            <span className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                              {q.id}
                            </span>
                            <span className="font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-bold">
                              {q.domain}
                            </span>
                          </div>
                          <h4 className="font-sans font-bold text-slate-800 text-xs mt-1 leading-relaxed">{q.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">{q.specification}</p>
                        </div>

                        {/* Yes/No Implemented Toggle */}
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Compliant</span>
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={ans.isImplemented}
                              onChange={e => handleControlToggle(q.id, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-slate-900 dark:bg-slate-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-400 peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      </div>

                      {/* Maturity and Evidence details for CCM questions */}
                      {ans.isImplemented && (
                        <div className="space-y-3.5 border-t border-slate-100 pt-3 animate-fadeIn">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <div className="sm:col-span-1 space-y-1">
                              <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase">Maturity Level</label>
                              <select
                                value={ans.maturity}
                                onChange={e => handleMaturityChange(q.id, e.target.value as MaturityLevel)}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] cursor-pointer font-medium"
                              >
                                <option value="Ad-hoc">Ad-hoc (30%)</option>
                                <option value="Managed">Managed (70%)</option>
                                <option value="Optimized">Optimized (100%)</option>
                              </select>
                            </div>
                            <div className="sm:col-span-3 text-slate-500 text-[10px] flex flex-col justify-center">
                              <span className="font-semibold text-slate-700">Maturity:</span>
                              <span className="leading-relaxed mt-0.5 text-slate-500">
                                {ans.maturity === 'Ad-hoc' && 'Reactive, undocumented.'}
                                {ans.maturity === 'Managed' && 'Formally documented & reviewed.'}
                                {ans.maturity === 'Optimized' && 'Continuously audited & automated.'}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                            <div className="space-y-1">
                              <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase">Evidence Notes</label>
                              <textarea
                                rows={2}
                                placeholder="Specify SOC 2 reference, control evidence, policy title, or notes..."
                                value={ans.evidence}
                                onChange={e => handleEvidenceChange(q.id, e.target.value)}
                                className="w-full p-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 rounded-lg text-[11px]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase">Evidence Vault File</label>
                              <div
                                onDragEnter={e => handleDrag(e, q.id)}
                                onDragOver={e => handleDrag(e, q.id)}
                                onDragLeave={e => handleDrag(e, q.id)}
                                onDrop={e => handleDrop(e, q.id)}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg p-2 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                                  dragActiveControlId === q.id 
                                    ? 'border-indigo-600 bg-indigo-50' 
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                                }`}
                              >
                                <Upload className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                                <span className="text-[9px] font-semibold text-slate-600">Drag & Drop or Click</span>
                              </div>

                              {ans.uploadedFiles && ans.uploadedFiles.length > 0 && (
                                <div className="space-y-1 mt-1">
                                  {ans.uploadedFiles.map(file => (
                                    <div key={file.id} className="flex items-center justify-between p-1 bg-emerald-50 border border-emerald-100 text-[9px] rounded-md">
                                      <span className="truncate max-w-[80%] font-medium text-emerald-800" title={file.name}>{file.name}</span>
                                      <button
                                        onClick={() => handleDeleteFile(q.id, file.id)}
                                        className="text-rose-500 hover:text-rose-700 cursor-pointer"
                                      >
                                        <Trash2 className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              {filteredCcmControls.length > 30 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-[11px] text-slate-500">
                    Showing first 30 of {filteredCcmControls.length} specifications. Please use the search input or domain filters to narrow down the active set.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
          </div>

          {/* Sticky Calculator Panel (1/3 width) */}
          <div className="space-y-6 lg:sticky lg:top-6">
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">Real-Time Risk Calculator</h3>
                <p className="text-xs text-slate-500 mt-0.5">Assessor guidance panel reflecting modified answers.</p>
              </div>

              {scoreResults && (
                <div className="space-y-5">
                  
                  {/* Transition Posture */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Risk Mitigation Transition</span>
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="text-center flex-1">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Inherent</span>
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded inline-block mt-1 ${
                          scoreResults.inherentRisk.category === 'Critical' ? 'bg-red-50 text-red-700' :
                          scoreResults.inherentRisk.category === 'High' ? 'bg-orange-50 text-orange-700' :
                          scoreResults.inherentRisk.category === 'Medium' ? 'bg-amber-50 text-amber-700' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          {scoreResults.inherentRisk.category} ({scoreResults.inherentRisk.score})
                        </span>
                      </div>
                      
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                      <div className="text-center flex-1">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Residual</span>
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded inline-block mt-1 ${
                          scoreResults.residualRisk.category === 'Critical' ? 'bg-red-100 text-red-800' :
                          scoreResults.residualRisk.category === 'High' ? 'bg-orange-100 text-orange-800' :
                          scoreResults.residualRisk.category === 'Medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {scoreResults.residualRisk.category} ({scoreResults.residualRisk.score})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Effectiveness Meter */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Control Effectiveness</span>
                      <span className="text-sm font-mono font-extrabold text-emerald-700">{scoreResults.controlEffectiveness.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                      <div 
                        className="bg-emerald-600 h-2.5 rounded-full transition-all"
                        style={{ width: `${scoreResults.controlEffectiveness}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Efficacy is calculated based on checked controls weighed against pre-assigned control importances and maturity values (Ad-hoc: 30%, Managed: 70%, Optimized: 100%).
                    </p>
                  </div>

                  {/* Specific Coordinates */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-600">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase">Residual Likelihood</span>
                      <span className="font-bold text-slate-800 text-sm">{scoreResults.residualLikelihood}</span> / 5
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase">Residual Impact</span>
                      <span className="font-bold text-slate-800 text-sm">{scoreResults.residualImpact}</span> / 5
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <button
                      onClick={handleSaveClick}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save and Publish Assessment</span>
                    </button>
                    <button
                      onClick={() => onSelectVendor(null)}
                      className="w-full px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Close Assessment
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* CSA AI-CAIQ Progress Breakdown Widget in Sidebar */}
            {activeVendor && activeSet === 'caiq' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">CSA AI-CAIQ Domain Coverage</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Coverage rates for all 18 mapped control domains.</p>
                </div>
                
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 text-[11px]">
                  {Object.entries(caiqDomainStats).map(([domain, statVal]) => {
                    const stat = statVal as { total: number; answered: number };
                    const pct = stat.total > 0 ? Math.round((stat.answered / stat.total) * 100) : 0;
                    return (
                      <div key={domain} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-slate-600 font-medium">
                          <span className="truncate max-w-[70%]" title={domain}>{domain}</span>
                          <span>{stat.answered}/{stat.total} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden border border-slate-150">
                          <div 
                            className={`h-1 rounded-full transition-all ${pct === 100 ? 'bg-emerald-600' : pct > 0 ? 'bg-indigo-600' : 'bg-slate-300'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CSA CCM Progress Breakdown Widget in Sidebar */}
            {activeVendor && activeSet === 'ccm' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">CSA CCM Domain Coverage</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Coverage rates for all 17 mapped CCM control domains.</p>
                </div>
                
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 text-[11px]">
                  {Object.entries(ccmDomainStats).map(([domain, statVal]) => {
                    const stat = statVal as { total: number; answered: number };
                    const pct = stat.total > 0 ? Math.round((stat.answered / stat.total) * 100) : 0;
                    return (
                      <div key={domain} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-slate-600 font-medium">
                          <span className="truncate max-w-[70%]" title={domain}>{domain}</span>
                          <span>{stat.answered}/{stat.total} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden border border-slate-150">
                          <div 
                            className={`h-1 rounded-full transition-all ${pct === 100 ? 'bg-emerald-600' : pct > 0 ? 'bg-indigo-600' : 'bg-slate-300'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Assessment Guide Card */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-300 text-xs space-y-4">
              <div className="flex items-center gap-2 text-white">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold font-display">Control Manager Playbook</h4>
              </div>
              <ul className="space-y-2.5 text-[11px] list-disc list-inside leading-relaxed text-slate-300">
                <li><strong className="text-white font-sans">Toggle Scoping:</strong> Turn off Agentic AI scoping for vendors that only deploy static LLMs to hide irrelevant Module 3 questions.</li>
                <li><strong className="text-white font-sans">Establish Proofs:</strong> Require links or PDF evidence uploads in the Vault before rating controls as "Optimized".</li>
                <li><strong className="text-white font-sans">Audit Syncing:</strong> Saving your assessment automatically appends a timestamped record to the System Audit Log logbook.</li>
              </ul>
            </div>

          </div>

        </div>
        </div>
      )}

      {/* Initialize New Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-scaleIn">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-display font-semibold text-sm">Initialize New Vendor Assessment</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs">Close</button>
            </div>
            
            <form onSubmit={handleAddVendorSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Vendor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SynthText Solutions"
                  value={newVendorName}
                  onChange={e => setNewVendorName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Services Provided</label>
                <input
                  type="text"
                  placeholder="e.g. Autonomous Customer Support Engine"
                  value={newVendorServices}
                  onChange={e => setNewVendorServices(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of vendor capabilities and data access..."
                  value={newVendorDesc}
                  onChange={e => setNewVendorDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Inherent Likelihood</label>
                  <select
                    value={newVendorL}
                    onChange={e => setNewVendorL(parseInt(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                  >
                    <option value={1}>1 - Rare</option>
                    <option value={2}>2 - Unlikely</option>
                    <option value={3}>3 - Possible</option>
                    <option value={4}>4 - Likely</option>
                    <option value={5}>5 - Almost Certain</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">Inherent Impact</label>
                  <select
                    value={newVendorI}
                    onChange={e => setNewVendorI(parseInt(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                  >
                    <option value={1}>1 - Insignificant</option>
                    <option value={2}>2 - Minor</option>
                    <option value={3}>3 - Moderate</option>
                    <option value={4}>4 - Major</option>
                    <option value={5}>5 - Critical</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-xs">Deploy Agentic AI?</span>
                  <p className="text-[10px] text-slate-400">Scopes Module 3 compliance checks</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newVendorAgentic}
                    onChange={e => setNewVendorAgentic(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-400 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg cursor-pointer"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
