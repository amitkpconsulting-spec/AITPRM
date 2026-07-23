/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MaturityLevel = 'Ad-hoc' | 'Managed' | 'Optimized';

export type RiskCategory = 'Low' | 'Medium' | 'High' | 'Critical';

export type CompanyLifecycleState = 'Onboarding' | 'Assessment' | 'Continuous Monitoring' | 'Renewal' | 'Offboarded';

export type UserRole = 'Admin' | 'Compliance Auditor' | 'Vendor Risk Manager' | 'Vendor Representative';

export type UserStatus = 'Onboarding' | 'Active' | 'Resigned' | 'Offboarded';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  createdAt: string;
  status: UserStatus;
  assignedVendorIds?: string[];
  resignationDate?: string;
  exitNotes?: string;
}

export interface UserExitRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  department: string;
  exitDate: string;
  resignationReason: string;
  handoverNotes: string;
  assignedVendorsAtExit: { id: string; name: string }[];
  assessmentsCount: number;
  transferredToUserId?: string;
  transferredToUserName?: string;
  transferredAt?: string;
}

export interface ControlComment {
  id: string;
  controlId: string;
  vendorId: string;
  author: string;
  authorRole: string;
  timestamp: string;
  text: string;
  isGapFlag?: boolean;
  gapSeverity?: 'Minor' | 'Moderate' | 'Critical';
  status?: 'Open' | 'Under Review' | 'Resolved';
}

export interface ControlItem {
  id: string;
  module: 'privacy' | 'standard-ai' | 'agentic-ai';
  code: string;
  frameworkMapping: string; // e.g., "CSA CAIQ v4 AIS-02", "CSA AICM AAGT-01"
  question: string;
  description: string;
  weight: number; // 1 to 5
  responseType?: 'Yes/No + Evidence' | 'Maturity Rating' | 'File Upload Required';
  directoryTitle?: string; // Custom Assessment Directory title in repository
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface ControlAnswer {
  controlId: string;
  isImplemented: boolean;
  maturity: MaturityLevel;
  evidence: string;
  uploadedFiles: UploadedFile[];
  riskImpact?: 'Low' | 'Medium' | 'High';
  riskProbability?: 'Low' | 'Medium' | 'High';
  riskRating?: 'Low' | 'Medium' | 'High' | 'Critical';
  safeguards?: string;
  evidenceType?: 'text' | 'upload' | 'both';
  comments?: ControlComment[];
  isFlaggedForGap?: boolean;
  gapSeverity?: 'Minor' | 'Moderate' | 'Critical';
  gapNotes?: string;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  servicesProvided: string;
  inherentLikelihood: number; // 1-5
  inherentImpact: number; // 1-5
  usesAgenticAI: boolean; // Dynamic scoping toggle
  status: 'Pending' | 'In Progress' | 'Completed';
  lifecycleState: CompanyLifecycleState; // Onboarding -> Assessment -> Continuous Monitoring -> Renewal -> Offboarded
  contactEmail?: string;
  vendorTier?: 'Tier 1 (Critical)' | 'Tier 2 (High)' | 'Tier 3 (Medium/Low)';
  nextReviewDate?: string;
  answers: Record<string, ControlAnswer>;
  lastAssessedBy: string;
  lastAssessedAt: string;
  customQuestions?: ControlItem[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface ProvenanceLog extends AuditLog {
  userRole?: string;
  targetEntity?: string;
  dataHash?: string;
  provenanceType?: 'USER_ACTION' | 'EXCEL_IMPORT' | 'SYSTEM_LOG' | 'AUDIT_SIGN_OFF';
  ipAddress?: string;
}

export interface RiskCellDetails {
  category: RiskCategory;
  score: number;
  color: string; // Tailwind class
  bgLight: string; // Tailwind class for light variant
  border: string; // Tailwind border
}

// 5x5 Matrix helper
export function getRiskDetails(likelihood: number, impact: number): RiskCellDetails {
  const score = likelihood * impact;
  
  // Matrix rows represent Likelihood (5 to 1) and cols represent Impact (1 to 5)
  // Matching the user's specific table precisely:
  if (likelihood === 5) {
    if (impact === 1) return { category: 'Medium', score, color: 'text-amber-600 bg-amber-50', bgLight: 'bg-amber-100', border: 'border-amber-200' };
    if (impact === 2 || impact === 3) return { category: 'High', score, color: 'text-orange-600 bg-orange-50', bgLight: 'bg-orange-100', border: 'border-orange-200' };
    return { category: 'Critical', score, color: 'text-red-700 bg-red-50', bgLight: 'bg-red-100', border: 'border-red-200' };
  }
  
  if (likelihood === 4) {
    if (impact === 1) return { category: 'Low', score, color: 'text-emerald-600 bg-emerald-50', bgLight: 'bg-emerald-100', border: 'border-emerald-200' };
    if (impact === 2) return { category: 'Medium', score, color: 'text-amber-600 bg-amber-50', bgLight: 'bg-amber-100', border: 'border-amber-200' };
    if (impact === 3 || impact === 4) return { category: 'High', score, color: 'text-orange-600 bg-orange-50', bgLight: 'bg-orange-100', border: 'border-orange-200' };
    return { category: 'Critical', score, color: 'text-red-700 bg-red-50', bgLight: 'bg-red-100', border: 'border-red-200' };
  }
  
  if (likelihood === 3) {
    if (impact === 1) return { category: 'Low', score, color: 'text-emerald-600 bg-emerald-50', bgLight: 'bg-emerald-100', border: 'border-emerald-200' };
    if (impact === 2 || impact === 3) return { category: 'Medium', score, color: 'text-amber-600 bg-amber-50', bgLight: 'bg-amber-100', border: 'border-amber-200' };
    return { category: 'High', score, color: 'text-orange-600 bg-orange-50', bgLight: 'bg-orange-100', border: 'border-orange-200' };
  }
  
  if (likelihood === 2) {
    if (impact === 1 || impact === 2) return { category: 'Low', score, color: 'text-emerald-600 bg-emerald-50', bgLight: 'bg-emerald-100', border: 'border-emerald-200' };
    if (impact === 3 || impact === 4) return { category: 'Medium', score, color: 'text-amber-600 bg-amber-50', bgLight: 'bg-amber-100', border: 'border-amber-200' };
    return { category: 'High', score, color: 'text-orange-600 bg-orange-50', bgLight: 'bg-orange-100', border: 'border-orange-200' };
  }
  
  // likelihood === 1
  if (impact === 5) return { category: 'Medium', score, color: 'text-amber-600 bg-amber-50', bgLight: 'bg-amber-100', border: 'border-amber-200' };
  return { category: 'Low', score, color: 'text-emerald-600 bg-emerald-50', bgLight: 'bg-emerald-100', border: 'border-emerald-200' };
}
