/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ControlItem, Vendor, AuditLog, AppUser, ProvenanceLog, UserExitRecord } from './types';

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-01',
    name: 'Amit Kumar',
    email: 'amit.kumar@enterprise-risk.io',
    role: 'Admin',
    department: 'Third-Party AI Governance',
    createdAt: '2026-01-15T08:00:00Z',
    status: 'Active',
    assignedVendorIds: ['vnd-01', 'vnd-04']
  },
  {
    id: 'usr-02',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@enterprise-risk.io',
    role: 'Compliance Auditor',
    department: 'Global Security & Audit',
    createdAt: '2026-02-10T09:30:00Z',
    status: 'Active',
    assignedVendorIds: ['vnd-02']
  },
  {
    id: 'usr-03',
    name: 'Michael Vance',
    email: 'm.vance@cognitiveagents.ai',
    role: 'Vendor Representative',
    department: 'CognitiveAgents Compliance',
    createdAt: '2026-03-01T11:00:00Z',
    status: 'Active',
    assignedVendorIds: ['vnd-01']
  },
  {
    id: 'usr-04',
    name: 'Elena Rostova',
    email: 'elena.r@enterprise-risk.io',
    role: 'Vendor Risk Manager',
    department: 'Procurement & Risk',
    createdAt: '2026-04-12T14:15:00Z',
    status: 'Active',
    assignedVendorIds: ['vnd-03']
  },
  {
    id: 'usr-05',
    name: 'David Chen',
    email: 'david.chen@enterprise-risk.io',
    role: 'Compliance Auditor',
    department: 'AI Security & Risk',
    createdAt: '2025-08-01T09:00:00Z',
    status: 'Resigned',
    assignedVendorIds: ['vnd-02'],
    resignationDate: '2026-06-30',
    exitNotes: 'Resigned for higher studies. Portfolio needs handover to new auditor.'
  }
];

export const INITIAL_EXIT_RECORDS: UserExitRecord[] = [
  {
    id: 'exit-01',
    userId: 'usr-05',
    userName: 'David Chen',
    userEmail: 'david.chen@enterprise-risk.io',
    userRole: 'Compliance Auditor',
    department: 'AI Security & Risk',
    exitDate: '2026-06-30',
    resignationReason: 'Career Change / Higher Education',
    handoverNotes: 'Completed Module 1 & 2 reviews for SecureChat Enterprise. Handover pending for final sign-off.',
    assignedVendorsAtExit: [
      { id: 'vnd-02', name: 'SecureChat Enterprise' }
    ],
    assessmentsCount: 8,
    transferredToUserId: undefined,
    transferredToUserName: undefined
  }
];

export const MASTER_CONTROLS: ControlItem[] = [
  // Module 1: Data Governance & Privacy
  {
    id: 'm1-residency',
    module: 'privacy',
    code: 'DG-01',
    frameworkMapping: 'CSA CAIQ v4 AIS-02 / GDPR Art. 44',
    question: 'Are data residency and sovereignty requirements strictly enforced for customer data stored or processed?',
    description: 'Verifies if vendor restricts data storage and processing to specific geographic boundaries (e.g., EU-only, US-only) as mandated by contracts or local regulations.',
    weight: 5
  },
  {
    id: 'm1-encryption',
    module: 'privacy',
    code: 'DG-02',
    frameworkMapping: 'CSA CAIQ v4 EKC-01 / AES-256',
    question: 'Is training and operational data encrypted both in transit (TLS 1.3) and at rest (AES-256) across all storage mediums?',
    description: 'Assesses the strength of cryptographic controls protecting organizational datasets from unauthorized disclosures.',
    weight: 4
  },
  {
    id: 'm1-pseudonym',
    module: 'privacy',
    code: 'DG-03',
    frameworkMapping: 'CSA CAIQ v4 DSP-08 / GDPR Art. 32',
    question: 'Is PII pseudonymized, masked, or scrubbed before being utilized for model training, fine-tuning, or prompt processing?',
    description: 'Ensures that sensitive personal identifiable information (PII) is securely stripped or anonymized to prevent leakage or memorization by neural networks.',
    weight: 5
  },
  {
    id: 'm1-crossborder',
    module: 'privacy',
    code: 'DG-04',
    frameworkMapping: 'CSA CAIQ v4 AIS-04 / DPDP Act Sec. 16',
    question: 'Are cross-border data transfer mechanisms fully compliant with GDPR, DPDP, and relevant regional privacy legislations?',
    description: 'Checks for valid Standard Contractual Clauses (SCCs), transfer impact assessments, or regulatory approvals for international data pipelines.',
    weight: 3
  },

  // Module 2: Standard AI & LLM Governance
  {
    id: 'm2-lineage',
    module: 'standard-ai',
    code: 'SG-01',
    frameworkMapping: 'CSA AICM DLG-01 / ISO/IEC 42001',
    question: 'Is there comprehensive documentation of training data lineage, including licensing, sourcing, and pre-processing?',
    description: 'Requires full visibility into the content origin, verification of copyright or open-source licenses, and data cleaning techniques used in foundational models.',
    weight: 3
  },
  {
    id: 'm2-bias',
    module: 'standard-ai',
    code: 'SG-02',
    frameworkMapping: 'CSA AICM BMT-02 / NIST AI RMF',
    question: 'Are systematic bias detection, mitigation, and toxicity testing procedures conducted and documented regularly?',
    description: 'Assesses active efforts to identify, evaluate, and reduce algorithmic bias, discriminatory outputs, and toxic responses before release.',
    weight: 3
  },
  {
    id: 'm2-drift',
    module: 'standard-ai',
    code: 'SG-03',
    frameworkMapping: 'CSA AICM MDM-03 / ISO/IEC 22989',
    question: 'Is model performance and drift actively monitored with defined automated threshold alerts for retraining?',
    description: 'Checks for operational systems that track input distribution shifts (data drift) and output accuracy decline (concept drift) in production.',
    weight: 4
  },
  {
    id: 'm2-owasp',
    module: 'standard-ai',
    code: 'SG-04',
    frameworkMapping: 'OWASP Top 10 for LLM / CSA AICM SEC-02',
    question: 'Are controls aligned with the OWASP Top 10 for LLMs implemented (e.g., prompt injection defense, insecure output handling)?',
    description: 'Evaluates the technical defenses guarding against prompt injection, model denial-of-service, training data poisoning, and sensitive data exposure.',
    weight: 5
  },
  {
    id: 'm2-redteam',
    module: 'standard-ai',
    code: 'SG-05',
    frameworkMapping: 'CSA AICM SEC-05 / NIST AI RMF Playbook',
    question: 'Are adversarial testing, red-teaming reports, or independent AI safety audits available for review?',
    description: 'Ensures that the LLM has undergone thorough, independent safety testing and jailbreak attempts by internal or third-party expert safety teams.',
    weight: 5
  },

  // Module 3: Agentic AI Risk (Advanced)
  {
    id: 'm3-autonomy',
    module: 'agentic-ai',
    code: 'AG-01',
    frameworkMapping: 'CSA AICM AAGT-01 / Agent Autonomy Ceiling',
    question: 'Is the agent\'s autonomy level documented, capped, and aligned with organizational risk appetites?',
    description: 'Ensures a formal classification of agentic capabilities, with technical limits placed on independent goal-setting and execution parameters.',
    weight: 5
  },
  {
    id: 'm3-hitl',
    module: 'agentic-ai',
    code: 'AG-02',
    frameworkMapping: 'CSA AICM AAGT-03 / Human-in-the-Loop Trigger',
    question: 'Does the agent require explicit, multi-factor human-in-the-loop (HITL) approval before executing financial or state-changing actions?',
    description: 'A critical control preventing autonomous agents from initiating wire transfers, modifying system records, or sending client-facing messages without human sign-off.',
    weight: 5
  },
  {
    id: 'm3-tools',
    module: 'agentic-ai',
    code: 'AG-03',
    frameworkMapping: 'CSA AICM AAGT-05 / Tool Boundary Control',
    question: 'Are tool-execution boundaries strictly enforced via fine-grained API scopes, sandboxed runtimes, and read-only connectors?',
    description: 'Verifies if tool permissions are locked down (Least Privilege), preventing agents from executing arbitrary bash commands, editing databases, or accessing unauthorized internal APIs.',
    weight: 4
  },
  {
    id: 'm3-blast',
    module: 'agentic-ai',
    code: 'AG-04',
    frameworkMapping: 'CSA AICM AAGT-07 / Cascading Failure Prevention',
    question: 'Are cascading blast-radius limits, recursion guards, and transaction rate-limits implemented for agent tasks?',
    description: 'Technical constraints that interrupt runaway autonomous feedback loops, limit maximum API requests per session, and prevent accidental mass modifications or financial losses.',
    weight: 5
  }
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'vnd-01',
    name: 'CognitiveAgents LLC',
    description: 'Deploys autonomous customer service and back-office agents capable of directly accessing CRM databases and resolving complex billing disputes.',
    servicesProvided: 'Autonomous Agentic Customer Support & Billing Reconciliation API',
    inherentLikelihood: 4,
    inherentImpact: 5,
    usesAgenticAI: true,
    status: 'Completed',
    lifecycleState: 'Continuous Monitoring',
    contactEmail: 'compliance@cognitiveagents.ai',
    vendorTier: 'Tier 1 (Critical)',
    nextReviewDate: '2027-01-15',
    lastAssessedBy: 'Amit Kumar (Control Manager)',
    lastAssessedAt: '2026-07-02T14:30:00-07:00',
    answers: {
      'm1-residency': {
        controlId: 'm1-residency',
        isImplemented: true,
        maturity: 'Optimized',
        evidence: 'SOC 2 Type II report (Section 4.2) states EU West 1 and 2 are isolated.',
        uploadedFiles: [{ id: 'f-1', name: 'soc2_type2_cognitive.pdf', size: 2450000, type: 'application/pdf', uploadedAt: '2026-07-02T10:15:00-07:00' }]
      },
      'm1-encryption': {
        controlId: 'm1-encryption',
        isImplemented: true,
        maturity: 'Optimized',
        evidence: 'TLS 1.3 enforced for CRM endpoints, database keys managed in AWS KMS with automatic rotation.',
        uploadedFiles: []
      },
      'm1-pseudonym': {
        controlId: 'm1-pseudonym',
        isImplemented: true,
        maturity: 'Managed',
        evidence: 'Presidio-based masking proxy intercepts prompts. Slight delay observed.',
        uploadedFiles: [{ id: 'f-2', name: 'masking_proxy_spec.pdf', size: 1040000, type: 'application/pdf', uploadedAt: '2026-07-02T10:18:00-07:00' }]
      },
      'm1-crossborder': {
        controlId: 'm1-crossborder',
        isImplemented: false,
        maturity: 'Ad-hoc',
        evidence: 'SCC clauses are present, but active flows show backup data replicating to US-East without separate TIAs.',
        uploadedFiles: []
      },
      'm2-lineage': {
        controlId: 'm2-lineage',
        isImplemented: true,
        maturity: 'Managed',
        evidence: 'Uses custom fine-tuned Llama 3 models; dataset lineage is tracked via DVC repositories.',
        uploadedFiles: []
      },
      'm2-bias': {
        controlId: 'm2-bias',
        isImplemented: true,
        maturity: 'Managed',
        evidence: 'Bias assessments run monthly; results compiled in corporate safety portal.',
        uploadedFiles: []
      },
      'm2-drift': {
        controlId: 'm2-drift',
        isImplemented: false,
        maturity: 'Ad-hoc',
        evidence: 'No active data drift detection or alerting currently implemented in production pipeline.',
        uploadedFiles: []
      },
      'm2-owasp': {
        controlId: 'm2-owasp',
        isImplemented: true,
        maturity: 'Optimized',
        evidence: 'System employs multi-layered prompt filtering, output guardrails via NeMo Guardrails.',
        uploadedFiles: []
      },
      'm2-redteam': {
        controlId: 'm2-redteam',
        isImplemented: true,
        maturity: 'Managed',
        evidence: 'Completed safety audit and red-teaming in March 2026 with Cohere Safety Labs.',
        uploadedFiles: [{ id: 'f-3', name: 'cohere_safety_audit_2026.pdf', size: 3120000, type: 'application/pdf', uploadedAt: '2026-07-02T10:20:00-07:00' }]
      },
      'm3-autonomy': {
        controlId: 'm3-autonomy',
        isImplemented: true,
        maturity: 'Managed',
        evidence: 'Autonomy level set to 4 (Supervised task execution). Constraints defined in agent manifest.',
        uploadedFiles: []
      },
      'm3-hitl': {
        controlId: 'm3-hitl',
        isImplemented: true,
        maturity: 'Optimized',
        evidence: 'Explicit manual confirmation screen is triggered in our backend for any charge exceeding $200.',
        uploadedFiles: [{ id: 'f-4', name: 'hitl_workflow_diagram.pdf', size: 450000, type: 'application/pdf', uploadedAt: '2026-07-02T10:25:00-07:00' }]
      },
      'm3-tools': {
        controlId: 'm3-tools',
        isImplemented: true,
        maturity: 'Managed',
        evidence: 'Agent API token has strict read/write scope limited to specific database views. Sandboxed docker runtime.',
        uploadedFiles: []
      },
      'm3-blast': {
        controlId: 'm3-blast',
        isImplemented: false,
        maturity: 'Ad-hoc',
        evidence: 'No technical limits to prevent infinite tool loops if the CRM rejects response format. Critical gap.',
        uploadedFiles: []
      }
    }
  },
  {
    id: 'vnd-02',
    name: 'SecureChat AI',
    description: 'Internal corporate chatbot provider leveraging foundational models to answer HR queries and search employee policy handbooks.',
    servicesProvided: 'Retrieval-Augmented Generation (RAG) HR Portal',
    inherentLikelihood: 3,
    inherentImpact: 3,
    usesAgenticAI: false, // Hides Module 3 dynamically
    status: 'In Progress',
    lifecycleState: 'Assessment',
    contactEmail: 'security@securechat.io',
    vendorTier: 'Tier 2 (High)',
    nextReviewDate: '2026-11-30',
    lastAssessedBy: 'Sarah Jenkins (Risk Analyst)',
    lastAssessedAt: '2026-07-03T09:15:00-07:00',
    answers: {
      'm1-residency': {
        controlId: 'm1-residency',
        isImplemented: true,
        maturity: 'Managed',
        evidence: 'Data hosted entirely on AWS Ireland (eu-west-1). Verified server config.',
        uploadedFiles: []
      },
      'm1-encryption': {
        controlId: 'm1-encryption',
        isImplemented: true,
        maturity: 'Optimized',
        evidence: 'Enforces AES-256 and TLS 1.3 throughout.',
        uploadedFiles: []
      },
      'm2-lineage': {
        controlId: 'm2-lineage',
        isImplemented: false,
        maturity: 'Ad-hoc',
        evidence: 'Uses third-party vendor models directly, lineage of foundation models is outsourced to OpenAI/Microsoft.',
        uploadedFiles: []
      },
      'm2-bias': {
        controlId: 'm2-bias',
        isImplemented: false,
        maturity: 'Ad-hoc',
        evidence: 'Relying completely on OpenAI system prompt alignment; no localized bias testing run.',
        uploadedFiles: []
      }
    }
  },
  {
    id: 'vnd-03',
    name: 'AutoCodeGen Tech',
    description: 'High-access coding copilot plugin that reads corporate Git repositories and automatically commits refactored code directly to pull requests.',
    servicesProvided: 'Autonomous Software Engineering Agent & Pull-Request Committer',
    inherentLikelihood: 5,
    inherentImpact: 5,
    usesAgenticAI: true,
    status: 'Pending',
    lifecycleState: 'Onboarding',
    contactEmail: 'grc@autocodegen.com',
    vendorTier: 'Tier 1 (Critical)',
    nextReviewDate: '2026-09-01',
    lastAssessedBy: 'System',
    lastAssessedAt: '2026-07-04T12:00:00-07:00',
    answers: {} // No questions answered yet, fresh assessment
  },
  {
    id: 'vnd-04',
    name: 'InsightSynthetics',
    description: 'Predictive market forecasting platform that generates synthetic consumer panels and conducts automated competitive landscape crawls.',
    servicesProvided: 'Market Intelligence & Competitor Simulation Engine',
    inherentLikelihood: 2,
    inherentImpact: 3,
    usesAgenticAI: false,
    status: 'Completed',
    lifecycleState: 'Renewal',
    contactEmail: 'risk@insightsynthetics.ai',
    vendorTier: 'Tier 3 (Medium/Low)',
    nextReviewDate: '2026-08-15',
    lastAssessedBy: 'Amit Kumar (Control Manager)',
    lastAssessedAt: '2026-06-30T11:20:00-07:00',
    answers: {
      'm1-residency': {
        controlId: 'm1-residency',
        isImplemented: true,
        maturity: 'Optimized',
        evidence: 'No persistent client data is kept on servers. All prompts deleted immediately post-session.',
        uploadedFiles: [{ id: 'f-5', name: 'zero_retention_policy.pdf', size: 560000, type: 'application/pdf', uploadedAt: '2026-06-30T11:00:00-07:00' }]
      },
      'm1-encryption': {
        controlId: 'm1-encryption',
        isImplemented: true,
        maturity: 'Managed',
        evidence: 'Standard HTTPS and at-rest EBS volume encryption.',
        uploadedFiles: []
      },
      'm1-pseudonym': {
        controlId: 'm1-pseudonym',
        isImplemented: true,
        maturity: 'Optimized',
        evidence: 'Inputs contain no business data; simulated profiles use synthetic names exclusively.',
        uploadedFiles: []
      },
      'm1-crossborder': {
        controlId: 'm1-crossborder',
        isImplemented: true,
        maturity: 'Managed',
        evidence: 'Fully compliant standard GDPR clause contract signed.',
        uploadedFiles: []
      },
      'm2-lineage': {
        controlId: 'm2-lineage',
        isImplemented: true,
        maturity: 'Managed',
        evidence: 'Synthetic dataset generators are open source and fully documented.',
        uploadedFiles: []
      },
      'm2-bias': {
        controlId: 'm2-bias',
        isImplemented: true,
        maturity: 'Managed',
        evidence: 'Outputs calibrated against national demographic benchmarks to prevent skewed forecasting.',
        uploadedFiles: []
      },
      'm2-drift': {
        controlId: 'm2-drift',
        isImplemented: true,
        maturity: 'Managed',
        evidence: 'Validation tests run on fresh market surveys twice a year to flag divergence.',
        uploadedFiles: []
      },
      'm2-owasp': {
        controlId: 'm2-owasp',
        isImplemented: true,
        maturity: 'Optimized',
        evidence: 'Strict prompt filters block user attempts to extract proprietary market data.',
        uploadedFiles: []
      },
      'm2-redteam': {
        controlId: 'm2-redteam',
        isImplemented: true,
        maturity: 'Managed',
        evidence: 'Internal penetration testing completed. Reports provided.',
        uploadedFiles: []
      }
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-07-04T12:30:00-07:00',
    user: 'Amit Kumar (Control Manager)',
    action: 'Dynamic Scoping Configured',
    details: 'Toggled usesAgenticAI to false for SecureChat AI. Out-of-scope Module 3 hidden, max score recalibrated from 51 to 33.'
  },
  {
    id: 'log-02',
    timestamp: '2026-07-03T09:15:00-07:00',
    user: 'Sarah Jenkins (Risk Analyst)',
    action: 'Assessment Modified',
    details: 'Updated residency control status to "Implemented" with maturity "Managed" for SecureChat AI.'
  },
  {
    id: 'log-03',
    timestamp: '2026-07-02T14:30:00-07:00',
    user: 'Amit Kumar (Control Manager)',
    action: 'Risk Assessment Signed Off',
    details: 'Completed third-party review for CognitiveAgents LLC. Final Residual Risk plotted at Likelihood: 3, Impact: 4 (High Risk).'
  },
  {
    id: 'log-04',
    timestamp: '2026-07-02T10:25:00-07:00',
    user: 'Amit Kumar (Control Manager)',
    action: 'Evidence File Uploaded',
    details: 'Uploaded "hitl_workflow_diagram.pdf" to AG-02 (Human-in-the-Loop Triggers) for CognitiveAgents LLC.'
  },
  {
    id: 'log-05',
    timestamp: '2026-06-30T11:20:00-07:00',
    user: 'Amit Kumar (Control Manager)',
    action: 'Assessment Created',
    details: 'Initialized new standard AI assessment for InsightSynthetics. Dynamic scoping set to standard LLM only.'
  }
];
