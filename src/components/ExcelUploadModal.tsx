/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Custom Assessment Upload & Repository Directory Ingestion Module
 * Parses .xlsx, .xls, or .csv custom questionnaires, allows re-writing the Assessment Directory Title,
 * auto-derives risk criteria, and organizes controls into directory folders within the Control Repository.
 */

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Sparkles, Download, ArrowRight, ShieldAlert, X, FolderPlus, Folder } from 'lucide-react';
import { ControlItem } from '../types';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportControls: (controls: ControlItem[], targetVendorId?: string, directoryTitle?: string) => void;
  vendorName?: string;
  vendorId?: string;
}

interface ParsedRow {
  code: string;
  question: string;
  frameworkMapping: string;
  description: string;
  module: 'privacy' | 'standard-ai' | 'agentic-ai';
  weight: number;
  responseType: 'Yes/No + Evidence' | 'Maturity Rating' | 'File Upload Required';
  rawRow: any;
}

export function ExcelUploadModal({ isOpen, onClose, onImportControls, vendorName, vendorId }: ExcelUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [assessmentTitle, setAssessmentTitle] = useState<string>('Custom AI Risk Assessment Directory');
  const [importTarget, setImportTarget] = useState<'master' | 'vendor'>(vendorId ? 'vendor' : 'master');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<number | null>(null);

  if (!isOpen) return null;

  // Keyword-based automatic Risk Criteria & Response Mechanism Derivation
  const autoClassifyQuestion = (question: string, description: string, categoryCol?: string): {
    module: 'privacy' | 'standard-ai' | 'agentic-ai';
    weight: number;
    framework: string;
    responseType: 'Yes/No + Evidence' | 'Maturity Rating' | 'File Upload Required';
  } => {
    const text = `${question} ${description} ${categoryCol || ''}`.toLowerCase();

    // Module classification
    let module: 'privacy' | 'standard-ai' | 'agentic-ai' = 'standard-ai';
    if (text.includes('agent') || text.includes('autonomy') || text.includes('hitl') || text.includes('tool') || text.includes('blast') || text.includes('loop')) {
      module = 'agentic-ai';
    } else if (text.includes('gdpr') || text.includes('privacy') || text.includes('pii') || text.includes('residency') || text.includes('encryption') || text.includes('sovereignty') || text.includes('crossborder')) {
      module = 'privacy';
    }

    // Weight classification (1 to 5)
    let weight = 3;
    if (text.includes('critical') || text.includes('injection') || text.includes('sanction') || text.includes('hitl') || text.includes('financial') || text.includes('unauthorized')) {
      weight = 5;
    } else if (text.includes('encryption') || text.includes('residency') || text.includes('drift') || text.includes('owasp') || text.includes('redteam')) {
      weight = 4;
    } else if (text.includes('optional') || text.includes('survey') || text.includes('periodic')) {
      weight = 2;
    }

    // Framework auto-mapping
    let framework = 'Custom Assessment Criteria';
    if (module === 'agentic-ai') {
      framework = 'CSA AICM AAGT-01 / Agent Governance';
    } else if (module === 'privacy') {
      framework = 'CSA CAIQ v4 AIS-02 / GDPR Data Protection';
    } else {
      framework = 'NIST AI RMF / CSA CAIQ v4';
    }

    // Response Type
    let responseType: 'Yes/No + Evidence' | 'Maturity Rating' | 'File Upload Required' = 'Yes/No + Evidence';
    if (text.includes('soc 2') || text.includes('audit') || text.includes('certif') || text.includes('upload') || text.includes('report') || text.includes('diagram')) {
      responseType = 'File Upload Required';
    } else if (text.includes('maturity') || text.includes('level') || text.includes('scale')) {
      responseType = 'Maturity Rating';
    }

    return { module, weight, framework, responseType };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    
    // Auto-derive assessment title from filename if default
    const derivedName = uploadedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    setAssessmentTitle(`${derivedName.toUpperCase()} Directory`);

    setError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (data.length === 0) {
          setError('The uploaded assessment sheet is empty or invalid.');
          setIsProcessing(false);
          return;
        }

        const rows: ParsedRow[] = data.map((row, index) => {
          // Normalize column names
          const keys = Object.keys(row);
          const getVal = (possibleKeys: string[]) => {
            const foundKey = keys.find(k => possibleKeys.some(pk => k.toLowerCase().trim().includes(pk)));
            return foundKey ? String(row[foundKey]).trim() : '';
          };

          const questionText = getVal(['question', 'control', 'requirement', 'query', 'description']) || `Assessment Item ${index + 1}`;
          const codeVal = getVal(['code', 'id', 'ref', 'item']) || `CUST-${index + 1}`;
          const descVal = getVal(['desc', 'detail', 'guidance', 'note']) || questionText;
          const categoryCol = getVal(['category', 'module', 'domain', 'framework']);

          const derived = autoClassifyQuestion(questionText, descVal, categoryCol);

          return {
            code: codeVal,
            question: questionText,
            frameworkMapping: derived.framework,
            description: descVal,
            module: derived.module,
            weight: derived.weight,
            responseType: derived.responseType,
            rawRow: row
          };
        });

        setParsedRows(rows);
        setIsProcessing(false);
      } catch (err: any) {
        setError(`Failed to parse assessment file: ${err.message || 'Invalid format'}`);
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading file.');
      setIsProcessing(false);
    };

    reader.readAsBinaryString(uploadedFile);
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;

    const finalDirectoryTitle = assessmentTitle.trim() || 'Custom Assessment Directory';

    const importedControls: ControlItem[] = parsedRows.map((r, i) => ({
      id: `cust-ctrl-${Date.now()}-${i}`,
      module: r.module,
      code: r.code,
      frameworkMapping: r.frameworkMapping,
      question: r.question,
      description: r.description,
      weight: r.weight,
      responseType: r.responseType,
      directoryTitle: finalDirectoryTitle
    }));

    onImportControls(importedControls, importTarget === 'vendor' ? vendorId : undefined, finalDirectoryTitle);
    setImportSuccess(importedControls.length);
    setTimeout(() => {
      setImportSuccess(null);
      onClose();
    }, 1500);
  };

  // Generate Sample Custom Assessment Template Download
  const downloadSampleTemplate = () => {
    const sampleData = [
      {
        Code: 'CUST-01',
        Question: 'Is customer data processed or stored within isolated regional data centers?',
        Description: 'Verifies geographical data boundary enforcement and regional data residency.',
        Category: 'Data Privacy',
        Weight: '5'
      },
      {
        Code: 'CUST-02',
        Question: 'Does the AI agent utilize fine-grained API scopes to restrict database write actions?',
        Description: 'Least-privilege permission validation for agentic autonomous API connectors.',
        Category: 'Agentic AI',
        Weight: '4'
      },
      {
        Code: 'CUST-03',
        Question: 'Is an independent red-teaming report or SOC 2 Type II compliance audit available?',
        Description: 'Third-party independent security assessment and penetration test report.',
        Category: 'Standard AI',
        Weight: '5'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Custom Assessment');
    XLSX.writeFile(wb, 'Custom_AI_Risk_Assessment_Template.xlsx');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <FolderPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Custom Assessment Upload</h3>
              <p className="text-xs text-slate-300">Ingest Custom Questionnaires into Control Repository Directory Folders</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {importSuccess !== null ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Successfully Imported {importSuccess} Controls!</h4>
              <p className="text-sm text-slate-600">
                Created Directory Folder <strong className="text-indigo-600 font-mono">"{assessmentTitle}"</strong> in {importTarget === 'vendor' ? vendorName : 'Master Control Repository'}.
              </p>
            </div>
          ) : (
            <>
              {/* Assessment Title & Directory Customizer */}
              <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs">
                  <Folder className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Control Repository Directory Name (Rewrite Title):</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. ISO 42001 Custom AI Safety Audit 2026 Directory"
                  value={assessmentTitle}
                  onChange={e => setAssessmentTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white shadow-2xs"
                />
                <p className="text-[11px] text-indigo-800">
                  This custom title will be registered as an isolated directory folder in the Control Repository for easy filtering and audit organization.
                </p>
              </div>

              {/* Target Destination Selector */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-sm font-bold text-slate-900">Repository Scope:</span>
                  <p className="text-xs text-slate-500">Select target scope for this Custom Assessment directory</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setImportTarget('master')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      importTarget === 'master'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Master Control Repository
                  </button>
                  {vendorId && (
                    <button
                      type="button"
                      onClick={() => setImportTarget('vendor')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        importTarget === 'vendor'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {vendorName || 'Selected Company'} Scope
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Drop Zone */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50/20 transition-all">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="excel-file-input"
                />
                <label htmlFor="excel-file-input" className="cursor-pointer space-y-3 block">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      {file ? file.name : 'Click to upload or drag Custom Assessment file (.xlsx, .xls, .csv)'}
                    </span>
                    <span className="text-xs text-slate-500 block mt-1">
                      Auto-detects Questions, Descriptions, Codes, and auto-derives risk weightings
                    </span>
                  </div>
                </label>
              </div>

              {/* Sample Template Download */}
              <div className="flex items-center justify-between text-xs text-slate-600 bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Need a custom template? Download our sample Custom Assessment structure.</span>
                </div>
                <button
                  type="button"
                  onClick={downloadSampleTemplate}
                  className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template</span>
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Parsed Rows Preview */}
              {parsedRows.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Parsed Criteria Preview ({parsedRows.length} Controls)
                    </span>
                    <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                      <Folder className="w-3.5 h-3.5 text-indigo-500" />
                      Target Folder: <strong className="font-mono text-slate-900">{assessmentTitle}</strong>
                    </span>
                  </div>

                  <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                    {parsedRows.map((row, idx) => (
                      <div key={idx} className="p-3 hover:bg-slate-50 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">
                              {row.code}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              row.module === 'agentic-ai' ? 'bg-purple-100 text-purple-700' :
                              row.module === 'privacy' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {row.module.toUpperCase()}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 font-medium">{row.frameworkMapping}</span>
                          </div>
                          <p className="font-semibold text-slate-900">{row.question}</p>
                          <p className="text-slate-500 line-clamp-1">{row.description}</p>
                        </div>

                        <div className="text-right shrink-0 space-y-1">
                          <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">
                            Weight: {row.weight}/5
                          </span>
                          <span className="block text-[10px] text-slate-500 font-medium">
                            {row.responseType}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {importSuccess === null && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={parsedRows.length === 0 || isProcessing || !assessmentTitle.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Add to Directory ({parsedRows.length} Controls)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

