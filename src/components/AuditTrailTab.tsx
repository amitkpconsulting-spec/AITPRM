/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { AuditLog } from '../types';
import { Search, Clock, User, ShieldAlert, FileSpreadsheet, Trash2 } from 'lucide-react';

interface AuditTrailTabProps {
  logs: AuditLog[];
  onClearLogs: () => void;
}

export default function AuditTrailTab({ logs, onClearLogs }: AuditTrailTabProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = useMemo(() => {
    return logs
      .filter(log => {
        return log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
               log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
               log.details.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort descending (newest first)
  }, [logs, searchTerm]);

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Log ID,Timestamp,User,Action,Details\n";
    
    filteredLogs.forEach(log => {
      const row = [
        log.id,
        log.timestamp,
        `"${log.user.replace(/"/g, '""')}"`,
        `"${log.action.replace(/"/g, '""')}"`,
        `"${log.details.replace(/"/g, '""')}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system_audit_trail_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-slate-900 text-lg">System Audit Trail Log</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable, chronological record logging user actions, control score changes, file uploads, and governance overrides.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md transition-all shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Logs (CSV)</span>
          </button>
          <button
            onClick={onClearLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-md transition-all shadow-2xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Clear Logbook</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs relative">
        <Search className="absolute left-7 top-6.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter audit trail by assessor name, specific action, or vendor details..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 rounded-lg text-xs"
        />
      </div>

      {/* Chronological Feed */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 italic text-xs">
            No audit logs match your search criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map(log => {
              const dateObj = new Date(log.timestamp);
              
              return (
                <div key={log.id} className="p-4 sm:px-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row gap-3 items-start text-xs">
                  {/* Left Column: Timestamp */}
                  <div className="sm:w-44 shrink-0 font-mono text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  {/* Middle Column: User & Action */}
                  <div className="sm:w-56 shrink-0 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{log.user}</span>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded font-mono font-extrabold text-[9px] uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {log.action}
                    </span>
                  </div>

                  {/* Right Column: Detailed Context */}
                  <div className="flex-1 space-y-1">
                    <p className="text-slate-600 leading-relaxed font-medium">{log.details}</p>
                    <div className="text-[10px] text-slate-400 font-mono font-bold tracking-tight">
                      LOG_ID: {log.id.toUpperCase()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
