/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Design Theme & Template Selector Component
 * Allows live previews and switching between high-contrast enterprise design themes.
 */

import React, { useState } from 'react';
import { Palette, Check, Sparkles, Moon, Sun, Shield, Layout, Eye, Monitor } from 'lucide-react';

export interface ThemePreset {
  id: string;
  name: string;
  tagline: string;
  category: 'Enterprise Default' | 'SOC / Security Operations' | 'Legal & Regulatory' | 'Modern Cloud' | 'Agentic Swarm & Cyber';
  description: string;
  primaryColor: string;
  bgGradient: string;
  badgeStyle: string;
  previewColors: string[];
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'slate-zerotrust',
    name: 'Slate Zero-Trust (Default)',
    tagline: 'High-Contrast Enterprise Security Audit Layout',
    category: 'Enterprise Default',
    description: 'Clean slate-900 navigation headers with indigo accents, precision spacing, and crisp neutral canvas engineered for CISO audit reviews.',
    primaryColor: 'indigo',
    bgGradient: 'from-slate-900 to-indigo-950',
    badgeStyle: 'bg-indigo-600 text-white',
    previewColors: ['#0f172a', '#4f46e5', '#f8fafc', '#1e293b']
  },
  {
    id: 'midnight-ultra',
    name: 'Midnight Deep Dark',
    tagline: 'High-Contrast Midnight Violet & Electric Indigo Canvas',
    category: 'SOC / Security Operations',
    description: 'Deep midnight navy/violet dark canvas engineered for night-shift SOC operators, zero eye-strain, and ultra-crisp high-contrast audit typography.',
    primaryColor: 'indigo',
    bgGradient: 'from-slate-950 via-indigo-950 to-slate-900',
    badgeStyle: 'bg-indigo-500 text-white',
    previewColors: ['#020617', '#312e81', '#6366f1', '#090d16']
  },
  {
    id: 'cyber-mecca',
    name: 'Cyber Mecca Swarm',
    tagline: 'Agentic Swarm Obsidian & Matrix Neon Lime Glow',
    category: 'Agentic Swarm & Cyber',
    description: 'Inspired by agentswarms.fyi — high-density autonomous agent swarm telemetry with neon lime, electric cyan accents, and obsidian tactical grid styling.',
    primaryColor: 'lime',
    bgGradient: 'from-black via-zinc-950 to-emerald-950',
    badgeStyle: 'bg-lime-500 text-black font-black',
    previewColors: ['#000000', '#84cc16', '#06b6d4', '#18181b']
  },
  {
    id: 'cyber-ops-dark',
    name: 'Cyber Defense SOC Dark',
    tagline: 'Obsidian Canvas & Tactical Neon Telemetry',
    category: 'SOC / Security Operations',
    description: 'Dark mode canvas with emerald & cyan vector telemetry badges, glowing status indicators, and high-visibility red-team indicators.',
    primaryColor: 'emerald',
    bgGradient: 'from-slate-950 via-slate-900 to-emerald-950',
    badgeStyle: 'bg-emerald-600 text-white',
    previewColors: ['#020617', '#059669', '#10b981', '#0f172a']
  },
  {
    id: 'warm-regulatory',
    name: 'Warm Regulatory Enterprise',
    tagline: 'Classic Navy, Warm Neutral Canvas & Amber Accents',
    category: 'Legal & Regulatory',
    description: 'Tailored for legal counsel, board risk committees, and financial services regulators with soft warm background tones and navy contrast.',
    primaryColor: 'amber',
    bgGradient: 'from-blue-950 to-amber-950',
    badgeStyle: 'bg-amber-600 text-white',
    previewColors: ['#172554', '#d97706', '#fef3c7', '#f8fafc']
  },
  {
    id: 'nordic-minimal',
    name: 'Nordic Minimal Light',
    tagline: 'Crisp Sapphire Blue, Clean Monospaced Precision',
    category: 'Modern Cloud',
    description: 'Ultra-clean white surfaces with soft sapphire blue accents, subtle 1px dividers, and monospaced data badges for cloud-native teams.',
    primaryColor: 'sky',
    bgGradient: 'from-slate-900 via-sky-950 to-slate-900',
    badgeStyle: 'bg-sky-600 text-white',
    previewColors: ['#0369a1', '#0284c7', '#ffffff', '#f1f5f9']
  }
];

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export default function ThemeSelectorModal({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme
}: ThemeSelectorModalProps) {
  const [activePreviewId, setActivePreviewId] = useState<string>(currentThemeId);

  if (!isOpen) return null;

  const handleApplyTheme = (themeId: string) => {
    onSelectTheme(themeId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-600 rounded-xl text-white">
              <Palette className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display font-bold text-base uppercase tracking-tight">Design Theme Templates</h2>
              <p className="text-xs text-slate-300">Select an enterprise design theme tailored for your governance and operational workflows.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Theme Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THEME_PRESETS.map(theme => {
              const isSelected = currentThemeId === theme.id;
              const isPreviewing = activePreviewId === theme.id;

              return (
                <div
                  key={theme.id}
                  onClick={() => setActivePreviewId(theme.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/30 shadow-md'
                      : isPreviewing
                      ? 'border-indigo-300 bg-slate-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Category & Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {theme.category}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Active Theme
                        </span>
                      )}
                    </div>

                    {/* Name & Tagline */}
                    <div>
                      <h3 className="font-display font-bold text-slate-900 text-sm">{theme.name}</h3>
                      <p className="text-[11px] font-medium text-slate-600">{theme.tagline}</p>
                    </div>

                    {/* Color Swatch Bar */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {theme.previewColors.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-6 h-6 rounded-lg border border-slate-200/80 shadow-2xs"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed pt-1">
                      {theme.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyTheme(theme.id);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-200 text-slate-700 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {isSelected ? 'Currently Selected' : 'Apply Theme'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Monitor className="w-4 h-4 text-slate-400" />
            Themes adapt dynamically across all 6 platform pipeline steps.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
