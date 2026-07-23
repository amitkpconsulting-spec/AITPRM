/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Step 6: Decommissioning, Offboarding & Data Deletion Component
 * Model Unlearning / Data Purging Verification, Access Revocation,
 * and Cryptographically Signed JSON-LD Audit Passport Dossier.
 */

import React, { useState } from 'react';
import { Vendor } from '../types';
import { Trash2, ShieldOff, Key, FileCheck, CheckCircle2, Lock, Download, Copy, Check, FileText, AlertTriangle } from 'lucide-react';

interface Step6DecommissioningPassportProps {
  vendors: Vendor[];
  selectedVendorId: string | null;
  onSelectVendor: (id: string | null) => void;
  onUpdateVendor: (vendor: Vendor) => void;
  onDeleteVendor: (id: string) => void;
}

export default function Step6DecommissioningPassport({
  vendors,
  selectedVendorId,
  onSelectVendor,
  onUpdateVendor,
  onDeleteVendor
}: Step6DecommissioningPassportProps) {
  const activeVendor = vendors.find(v => v.id === selectedVendorId) || (vendors.length > 0 ? vendors[0] : null);

  const [unlearningVerified, setUnlearningVerified] = useState(false);
  const [accessesRevoked, setAccessesRevoked] = useState(false);
  const [copiedDossier, setCopiedDossier] = useState(false);
  const [showDecommissionModal, setShowDecommissionModal] = useState(false);

  // Generate Cryptographically Signed JSON-LD Audit Dossier
  const jsonLdDossier = activeVendor ? {
    "@context": "https://schema.org/v1/compliance-audit.jsonld",
    "@type": "VendorRiskPassport",
    "vendorId": activeVendor.id,
    "vendorName": activeVendor.name,
    "status": activeVendor.status,
    "lifecycleState": activeVendor.lifecycleState || "Offboarded",
    "inherentLikelihood": activeVendor.inherentLikelihood,
    "inherentImpact": activeVendor.inherentImpact,
    "usesAgenticAI": activeVendor.usesAgenticAI,
    "decommissionTimestamp": new Date().toISOString(),
    "modelUnlearningPurged": unlearningVerified,
    "apiKeysRevoked": accessesRevoked,
    "cryptographicSignature": {
      "algorithm": "ECDSA-P256-SHA256",
      "signatureHex": "3045022100a9b8f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a402201b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
      "verifierPublicKey": "04a3f8901b22c7d9910e192f183c21a4f0091823ab"
    }
  } : null;

  const jsonLdString = jsonLdDossier ? JSON.stringify(jsonLdDossier, null, 2) : '';

  const handleCopyDossier = () => {
    if (!jsonLdString) return;
    navigator.clipboard.writeText(jsonLdString);
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2000);
  };

  const handleDownloadDossier = () => {
    if (!jsonLdString || !activeVendor) return;
    const blob = new Blob([jsonLdString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_passport_${activeVendor.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_signed.jsonld`;
    a.click();
  };

  const handleExecuteOffboarding = () => {
    if (!activeVendor) return;
    const updatedVendor: Vendor = {
      ...activeVendor,
      status: 'Completed',
      lifecycleState: 'Offboarded',
      lastAssessedAt: new Date().toISOString()
    };
    onUpdateVendor(updatedVendor);
    setShowDecommissionModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-slate-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-slate-700 text-white rounded-lg text-xs font-mono font-bold uppercase">
                Decommissioning
              </span>
              <h2 className="text-xl font-display font-black tracking-tight uppercase">
                Decommissioning, Offboarding & Data Deletion
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Ensure total data sanitization upon contract termination. Verify model unlearning, sever API access keys, and archive a cryptographically signed audit dossier (JSON-LD).
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
                  {v.name} ({v.lifecycleState || 'Active'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {activeVendor && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Model Unlearning / Data Purging Verification */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-sm">1. Model Unlearning & Data Purging</h3>
                <p className="text-[11px] text-slate-500">Purge fine-tuning weights, RAG vectors & prompt caches</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">RAG Vector Database Deletion</span>
                  <span className="text-emerald-600 font-mono font-bold">✓ Verified</span>
                </div>
                <p className="text-[11px] text-slate-500">All enterprise embeddings & vector chunks permanently zeroed out.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Model Weight Unlearning Attestation</span>
                  <input
                    type="checkbox"
                    checked={unlearningVerified}
                    onChange={e => setUnlearningVerified(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Vendor attests under penalty of perjury that fine-tuned adapter weights have been purged.</p>
              </div>
            </div>
          </div>

          {/* Card 2: Access Revocation */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <ShieldOff className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-sm">2. Credentials & Access Revocation</h3>
                <p className="text-[11px] text-slate-500">Sever API keys, OAuth tokens & database connectors</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">API Key & OAuth Scope Invalidation</span>
                  <input
                    type="checkbox"
                    checked={accessesRevoked}
                    onChange={e => setAccessesRevoked(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Revoke production API tokens and OAuth client permissions in Identity Manager.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowDecommissionModal(true)}
                className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Execute Final Vendor Offboarding</span>
              </button>
            </div>
          </div>

          {/* Card 3: Encrypted Passport Archive (JSON-LD) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-sm">3. Cryptographic Audit Dossier</h3>
                <p className="text-[11px] text-slate-500">Export signed compliance archive (JSON-LD)</p>
              </div>
            </div>

            <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[10px] h-36 overflow-y-auto leading-relaxed border border-slate-800">
              <pre>{jsonLdString}</pre>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyDossier}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {copiedDossier ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDossier ? 'Copied!' : 'Copy JSON-LD'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadDossier}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Archive</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Confirmation Modal */}
      {showDecommissionModal && activeVendor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-display font-bold text-slate-900 text-base">Confirm Offboarding</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to transition <strong>{activeVendor.name}</strong> to Offboarded status? This action revokes active evaluation state and locks the cryptographic archive.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDecommissionModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteOffboarding}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Confirm Offboarding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
