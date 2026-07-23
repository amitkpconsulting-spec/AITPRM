/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Governance & Compliance Reference Hub Component
 * External standards, regulatory guidance, and official AI risk management playbooks.
 */

import React, { useState, useMemo } from 'react';
import { ExternalLink, Search, Bookmark, ShieldCheck, Globe, BookOpen, Copy, Check, Filter } from 'lucide-react';

export interface ReferenceItem {
  id: string;
  title: string;
  organization: string;
  category: 'NIST Frameworks' | 'Cloud & AI Security' | 'Data Privacy & Regulation' | 'Legal & Policy Intelligence';
  url: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

const REFERENCES_DATA: ReferenceItem[] = [
  {
    id: 'ref-nist-playbook',
    title: 'NIST AI Risk Management Framework (AI RMF) Playbook',
    organization: 'National Institute of Standards and Technology (NIST)',
    category: 'NIST Frameworks',
    url: 'https://airc.nist.gov/airmf-resources/playbook/',
    description: 'Actionable guidance and concrete suggested steps for operationalizing the NIST AI Risk Management Framework (AI RMF 1.0) across GOVERN, MAP, MEASURE, and MANAGE functions.',
    tags: ['NIST AI RMF 1.0', 'Govern', 'Map', 'Measure', 'Manage', 'AI Safety'],
    featured: true
  },
  {
    id: 'ref-nist-metrology',
    title: 'NIST AI Metrology & Evaluation Protocols',
    organization: 'NIST AI Resource Center (AIRC)',
    category: 'NIST Frameworks',
    url: 'https://airc.nist.gov/metrology/',
    description: 'Scientific standards, benchmarking protocols, and measurement methodologies for testing AI trustworthiness, adversarial robustness, model drift, and evaluation metrics.',
    tags: ['AI Metrology', 'Red-Teaming', 'Evaluation', 'Bias & Hallucination', 'Benchmark'],
    featured: true
  },
  {
    id: 'ref-csa-caiq',
    title: 'CSA Consensus Assessments Initiative Questionnaire (CAIQ v3.1)',
    organization: 'Cloud Security Alliance (CSA)',
    category: 'Cloud & AI Security',
    url: 'https://cloudsecurityalliance.org/artifacts/consensus-assessments-initiative-questionnaire-v3-1',
    description: 'Standardized third-party vendor assessment matrix providing transparency into cloud service provider control implementations and compliance posture.',
    tags: ['CSA CAIQ v3.1', 'Cloud Security Matrix', 'Vendor Risk', 'Security Audit'],
    featured: false
  },
  {
    id: 'ref-ico-gdpr',
    title: 'ICO UK GDPR Guidance & Data Protection Resources',
    organization: "Information Commissioner's Office (ICO UK)",
    category: 'Data Privacy & Regulation',
    url: 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/',
    description: 'Comprehensive regulatory framework for lawful personal data processing, automated decision-making controls, Data Protection Impact Assessments (DPIA), and privacy rights.',
    tags: ['UK GDPR', 'Data Privacy', 'DPIA', 'Automated Decision Making', 'Regulatory Compliance'],
    featured: false
  },
  {
    id: 'ref-dla-piper',
    title: 'DLA Piper AI Governance & Law Intelligence Tracker',
    organization: 'DLA Piper Global Law Firm',
    category: 'Legal & Policy Intelligence',
    url: 'https://intelligence.dlapiper.com/artificial-intelligence/',
    description: 'Global legal intelligence database monitoring worldwide artificial intelligence regulations, EU AI Act compliance timelines, cross-border liability, and statutory obligations.',
    tags: ['Global AI Laws', 'EU AI Act', 'Liability', 'Legal Intelligence', 'Statutory Audit'],
    featured: false
  }
];

export default function ReferencesTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredReferences = useMemo(() => {
    return REFERENCES_DATA.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['All', 'NIST Frameworks', 'Cloud & AI Security', 'Data Privacy & Regulation', 'Legal & Policy Intelligence'];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-600 rounded-xl text-white">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-display font-black tracking-tight uppercase">
                Compliance & Framework References
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Official regulatory standards, AI risk playbooks, metrology benchmarks, and global legal intelligence backing our zero-trust assessment algorithms.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Primary Sources</p>
              <p className="text-lg font-bold font-display text-indigo-400">{REFERENCES_DATA.length}</p>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Global Domains</p>
              <p className="text-lg font-bold font-display text-emerald-400">4 Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search standards, frameworks, NIST, GDPR, CAIQ..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50"
          />
        </div>

        {/* Category Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reference Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReferences.map(ref => (
          <div 
            key={ref.id}
            className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Category & Organization */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${
                  ref.category === 'NIST Frameworks'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : ref.category === 'Cloud & AI Security'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : ref.category === 'Data Privacy & Regulation'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {ref.category}
                </span>

                <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" />
                  {ref.organization}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                {ref.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {ref.description}
              </p>

              {/* Topic Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {ref.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-md text-[10px] font-mono font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleCopyUrl(ref.id, ref.url)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer transition-colors"
                title="Copy reference link"
              >
                {copiedId === ref.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 text-[11px]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy Link</span>
                  </>
                )}
              </button>

              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>Open Reference</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredReferences.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">No references found</h4>
          <p className="text-xs text-slate-500">
            No compliance framework matched your search criteria "{searchTerm}".
          </p>
        </div>
      )}
    </div>
  );
}
