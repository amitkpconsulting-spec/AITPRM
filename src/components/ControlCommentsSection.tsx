/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Control Comments & Gap Annotation Component
 * Provides audit discussions, gap flagging with severity levels, and reviewer resolution notes.
 */

import React, { useState } from 'react';
import { MessageSquare, Flag, AlertTriangle, CheckCircle, Trash2, Send, ShieldAlert, Sparkles, User, Tag } from 'lucide-react';
import { ControlComment, ControlAnswer, UserRole } from '../types';

interface ControlCommentsSectionProps {
  controlId: string;
  vendorId: string;
  answer: ControlAnswer | undefined;
  onUpdateAnswer: (controlId: string, updatedAnswer: ControlAnswer) => void;
  currentUser?: { name: string; role: UserRole };
}

export function ControlCommentsSection({
  controlId,
  vendorId,
  answer,
  onUpdateAnswer,
  currentUser = { name: 'Amit Kumar', role: 'Compliance Auditor' }
}: ControlCommentsSectionProps) {
  const [newCommentText, setNewCommentText] = useState('');
  const [isGapFlagChecked, setIsGapFlagChecked] = useState(answer?.isFlaggedForGap || false);
  const [gapSeverity, setGapSeverity] = useState<'Minor' | 'Moderate' | 'Critical'>(answer?.gapSeverity || 'Critical');
  const [gapNotes, setGapNotes] = useState(answer?.gapNotes || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const comments = answer?.comments || [];
  const isFlagged = answer?.isFlaggedForGap || false;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: ControlComment = {
      id: `cm-${Date.now()}`,
      controlId,
      vendorId,
      author: currentUser.name,
      authorRole: currentUser.role,
      timestamp: new Date().toISOString(),
      text: newCommentText.trim(),
      isGapFlag: isGapFlagChecked,
      gapSeverity: isGapFlagChecked ? gapSeverity : undefined,
      status: 'Open'
    };

    const updatedComments = [...comments, newComment];
    const currentAns: ControlAnswer = answer || {
      controlId,
      isImplemented: false,
      maturity: 'Ad-hoc',
      evidence: '',
      uploadedFiles: []
    };

    onUpdateAnswer(controlId, {
      ...currentAns,
      comments: updatedComments,
      isFlaggedForGap: isGapFlagChecked || currentAns.isFlaggedForGap,
      gapSeverity: isGapFlagChecked ? gapSeverity : currentAns.gapSeverity,
      gapNotes: isGapFlagChecked ? gapNotes : currentAns.gapNotes
    });

    setNewCommentText('');
  };

  const handleToggleGapFlag = (flagState: boolean) => {
    setIsGapFlagChecked(flagState);
    const currentAns: ControlAnswer = answer || {
      controlId,
      isImplemented: false,
      maturity: 'Ad-hoc',
      evidence: '',
      uploadedFiles: []
    };

    onUpdateAnswer(controlId, {
      ...currentAns,
      isFlaggedForGap: flagState,
      gapSeverity: flagState ? gapSeverity : undefined,
      gapNotes: flagState ? gapNotes : ''
    });
  };

  const handleUpdateGapSeverity = (sev: 'Minor' | 'Moderate' | 'Critical') => {
    setGapSeverity(sev);
    if (answer) {
      onUpdateAnswer(controlId, {
        ...answer,
        gapSeverity: sev
      });
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (!answer) return;
    const updated = (answer.comments || []).filter(c => c.id !== commentId);
    onUpdateAnswer(controlId, {
      ...answer,
      comments: updated
    });
  };

  return (
    <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition-all">
      
      {/* Accordion Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-100/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-800">
            Audit Discussions & Gap Notes ({comments.length})
          </span>
          {isFlagged && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
              answer?.gapSeverity === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' :
              answer?.gapSeverity === 'Moderate' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
              'bg-amber-100 text-amber-700 border border-amber-200'
            }`}>
              <Flag className="w-3 h-3 fill-current" />
              <span>Flagged Gap ({answer?.gapSeverity || 'Critical'})</span>
            </span>
          )}
        </div>

        <span className="text-xs font-semibold text-indigo-600 hover:underline">
          {isExpanded ? 'Hide Discussions' : 'View / Add Comments'}
        </span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-200 space-y-4 bg-white">
          
          {/* Gap Flagging Control Bar */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs font-bold text-slate-900">Flag as Compliance Gap</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleGapFlag(!isGapFlagChecked)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isGapFlagChecked
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                {isGapFlagChecked ? 'Gap Flag Active' : 'Flag Control Gap'}
              </button>
            </div>

            {isGapFlagChecked && (
              <div className="space-y-2 pt-2 border-t border-amber-200/60">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-700">Gap Severity:</span>
                  {(['Minor', 'Moderate', 'Critical'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleUpdateGapSeverity(s)}
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        gapSeverity === s
                          ? s === 'Critical' ? 'bg-red-700 text-white' : s === 'Moderate' ? 'bg-orange-600 text-white' : 'bg-amber-600 text-white'
                          : 'bg-white text-slate-600 border border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Remediation requirement or gap notes..."
                  value={gapNotes}
                  onChange={(e) => {
                    setGapNotes(e.target.value);
                    if (answer) {
                      onUpdateAnswer(controlId, { ...answer, gapNotes: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
              </div>
            )}
          </div>

          {/* Comment Stream */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-2">
                No comments or audit notes recorded for this control yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {comments.map(c => (
                  <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-bold text-slate-900">{c.author}</span>
                        <span className="text-slate-400">({c.authorRole})</span>
                        {c.isGapFlag && (
                          <span className="px-1.5 py-0.2 bg-red-100 text-red-700 font-bold text-[9px] rounded">
                            {c.gapSeverity || 'Critical'} Gap Flag
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">
                          {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-slate-400 hover:text-red-600 p-0.5 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{c.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              placeholder="Add audit comment or evidence request..."
              value={newCommentText}
              onChange={e => setNewCommentText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post</span>
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
