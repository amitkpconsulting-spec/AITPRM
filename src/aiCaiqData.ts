/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CaiqQuestion {
  id: string;
  question: string;
  controlId: string;
  controlTitle?: string;
  domain: string;
}

export const AI_CAIQ_QUESTIONS: CaiqQuestion[] = [
  // Audit & Assurance (A&A)
  {
    id: 'A&A-01.1',
    question: 'Are audit and assurance policies, procedures, and standards established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'A&A-01',
    controlTitle: 'Audit and Assurance Policy and Procedures',
    domain: 'Audit & Assurance'
  },
  {
    id: 'A&A-01.2',
    question: 'Are audit and assurance policies, procedures, and standards reviewed and updated at least annually or upon significant changes?',
    controlId: 'A&A-01',
    controlTitle: 'Audit and Assurance Policy and Procedures',
    domain: 'Audit & Assurance'
  },
  {
    id: 'A&A-02.1',
    question: 'Are independent audit and assurance assessments conducted according to relevant standards at least annually?',
    controlId: 'A&A-02',
    controlTitle: 'Independent Assessments',
    domain: 'Audit & Assurance'
  },
  {
    id: 'A&A-03.1',
    question: 'Are independent audit and assurance assessments performed in response to significant changes or emerging risks and according to risk-based plans and policies?',
    controlId: 'A&A-03',
    controlTitle: 'Risk Based Planning Assessment',
    domain: 'Audit & Assurance'
  },
  {
    id: 'A&A-04.1',
    question: 'Is compliance verified with all relevant standards, regulations, legal/contractual, and statutory requirements applicable to the audit?',
    controlId: 'A&A-04',
    controlTitle: 'Requirements Compliance',
    domain: 'Audit & Assurance'
  },
  {
    id: 'A&A-05.1',
    question: 'Are Audit Management processes aligned with global auditing standards, defined and implemented to support audit planning, risk analysis, security control assessment, conclusion, remediation schedules, report generation, review of past reports and supporting evidence?',
    controlId: 'A&A-05',
    controlTitle: 'Audit Management Process',
    domain: 'Audit & Assurance'
  },
  {
    id: 'A&A-06.1',
    question: 'Is a risk-based corrective action plan established, documented, approved, communicated, applied, evaluated, and maintained to remediate audit findings, regularly review, and report remediation status to relevant stakeholders?',
    controlId: 'A&A-06',
    controlTitle: 'Remediation',
    domain: 'Audit & Assurance'
  },

  // Application & Interface Security (AIS)
  {
    id: 'AIS-01.1',
    question: 'Are policies and procedures for application security established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'AIS-01',
    controlTitle: 'Application and Interface Security Policy and Procedures',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-01.2',
    question: 'Are the policies and procedures for application security reviewed and updated at least annually or upon significant system changes?',
    controlId: 'AIS-01',
    controlTitle: 'Application and Interface Security Policy and Procedures',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-02.1',
    question: 'Are baseline requirements for securing applications established, documented, and maintained?',
    controlId: 'AIS-02',
    controlTitle: 'Application Security Baseline Requirements',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-03.1',
    question: 'Are technical and operational metrics defined and implemented in alignment with business objectives, security requirements, and compliance obligations?',
    controlId: 'AIS-03',
    controlTitle: 'Application Security Metrics',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-04.1',
    question: 'Is a secure software development lifecycle (SDLC) process defined and implemented for application requirements analysis, planning, design, development, testing, deployment, and operation in accordance with security requirements defined by the organization?',
    controlId: 'AIS-04',
    controlTitle: 'Secure Application Development Lifecycle',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-05.1',
    question: 'Is a testing strategy implemented, including criteria for acceptance of new information systems, upgrades, and new versions, to provide application security assurance, maintain compliance, and meet organizational delivery goals?',
    controlId: 'AIS-05',
    controlTitle: 'Application Security Testing',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-05.2',
    question: 'Is automation applied where applicable and possible?',
    controlId: 'AIS-05',
    controlTitle: 'Application Security Testing',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-06.1',
    question: 'Are strategies and capabilities established and implemented for secure, standardized, and compliant application deployment?',
    controlId: 'AIS-06',
    controlTitle: 'Secure Application Deployment',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-07.1',
    question: 'Are processes defined and implemented to remediate application security vulnerabilities, automating remediation when possible?',
    controlId: 'AIS-07',
    controlTitle: 'Application Vulnerability Remediation',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-08.1',
    question: 'Is the input against adversarial patterns, failure patterns and unwanted behaviour, validated, filtered, modified, or blocked as necessary, according to organisational policies, applicable laws and regulations?',
    controlId: 'AIS-08',
    controlTitle: 'Input Validation',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-09.1',
    question: 'Is the output against adversarial patterns, failure patterns and unwanted behaviour, validated, filtered, modified, or blocked as necessary, according to organisational policies, applicable laws and regulations?',
    controlId: 'AIS-09',
    controlTitle: 'Output Validation',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-10.1',
    question: 'Are processes, procedures and technical measures to secure APIs, including authorization flaws, API key management, regular security testing, defined, implemented and evaluated?',
    controlId: 'AIS-10',
    controlTitle: 'API Security',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-10.2',
    question: 'Are technical measures for any improvements reviewed and updated at least annually or after significant system changes?',
    controlId: 'AIS-10',
    controlTitle: 'API Security',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-11.1',
    question: 'Are the security boundaries for agents established?',
    controlId: 'AIS-11',
    controlTitle: 'Agents Security Boundaries',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-12.1',
    question: 'Are source code management practices, such as version control, code review and static code analysis, implemented and aligning with the SDLC process?',
    controlId: 'AIS-12',
    controlTitle: 'Source Code Managemement',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-13.1',
    question: 'Are sandboxing techniques implemented to execute AI tools and plugins in isolated environments to prevent unintended interactions with critical systems or data and to limit the possibility of lateral movement?',
    controlId: 'AIS-13',
    controlTitle: 'AI Sandboxing',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-14.1',
    question: 'Are security measures implemented to protect cache systems in GenAI systems and services?',
    controlId: 'AIS-14',
    controlTitle: 'AI Cache Protection',
    domain: 'Application & Interface Security'
  },
  {
    id: 'AIS-15.1',
    question: 'Are mechanisms implemented to enable the model to clearly distinguish user-provided input instructions from data and system instructions (e.g., system prompts)?',
    controlId: 'AIS-15',
    controlTitle: 'Prompt Differentation',
    domain: 'Application & Interface Security'
  },

  // Business Continuity Management and Operational Resilience (BCR)
  {
    id: 'BCR-01.1',
    question: 'Are business continuity management and operational resilience policies and procedures established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'BCR-01',
    controlTitle: 'Business Continuity Management Policy and Procedures',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-01.2',
    question: 'Are policies and procedures reviewed and updated at least annually, or when significant changes occur that could impact risk exposure?',
    controlId: 'BCR-01',
    controlTitle: 'Business Continuity Management Policy and Procedures',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-02.1',
    question: 'Is the impact of business disruptions and risks determined to establish criteria for developing business continuity and operational resilience strategies and capabilities?',
    controlId: 'BCR-02',
    controlTitle: 'Risk Assessment and Impact Analysis',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-02.2',
    question: 'Is the risk assessment and impact analysis, reviewed and updated at least annually or upon significant changes?',
    controlId: 'BCR-02',
    controlTitle: 'Risk Assessment and Impact Analysis',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-03.1',
    question: 'Are strategies established to reduce the impact of business disruptions, and improve resiliency and recovery from business disruptions?',
    controlId: 'BCR-03',
    controlTitle: 'Business Continuity Strategy',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-04.1',
    question: 'Is a business continuity plan - based on the results of operational resilience strategies and capabilities - established, documented, approved, communicated, applied, evaluated and maintained?',
    controlId: 'BCR-04',
    controlTitle: 'Business Continuity Planning',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-05.1',
    question: 'Is relevant documentation, both internal and from external parties, for supporting the business continuity and operational resilience programs, developed, identified, and acquired?',
    controlId: 'BCR-05',
    controlTitle: 'Documentation',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-05.2',
    question: 'Is the documentation available to authorized stakeholders and reviewed at least annually or upon significant changes?',
    controlId: 'BCR-05',
    controlTitle: 'Documentation',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-06.1',
    question: 'Is a structured approach to evaluate the effectiveness of the business continuity and operational resilience plans, followed at planned intervals or upon significant changes?',
    controlId: 'BCR-06',
    controlTitle: 'Business Continuity Exercises',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-07.1',
    question: 'Are communication channels with all relevant stakeholders established and maintained in the course of business continuity and resilience procedures?',
    controlId: 'BCR-07',
    controlTitle: 'Communication',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-08.1',
    question: 'Are backups periodically performed?',
    controlId: 'BCR-08',
    controlTitle: 'Backup',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-08.2',
    question: 'Is the confidentiality, integrity and availability of the backup, ensured and data restoration from backup verified for resiliency?',
    controlId: 'BCR-08',
    controlTitle: 'Backup',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-09.1',
    question: 'Is a disaster response plan to recover from natural and man-made disasters established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'BCR-09',
    controlTitle: 'Disaster Response Plan',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-09.2',
    question: 'Is the Disaster Response Plan updated at least annually or upon significant changes?',
    controlId: 'BCR-09',
    controlTitle: 'Disaster Response Plan',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-10.1',
    question: 'Is a structured approach to evaluate the effectiveness of the disaster response plan followed at planned intervals or upon significant changes, including, if possible, participation of local emergency authorities?',
    controlId: 'BCR-10',
    controlTitle: 'Response Plan Exercise',
    domain: 'Business Continuity Management and Operational Resilience'
  },
  {
    id: 'BCR-11.1',
    question: 'Are business-critical equipment supplemented with both locally redundant and geographically dispersed equipment located at a reasonable minimum distance in accordance with applicable industry standards?',
    controlId: 'BCR-11',
    controlTitle: 'Equipment Redundancy',
    domain: 'Business Continuity Management and Operational Resilience'
  },

  // Change Control and Configuration Management (CCC)
  {
    id: 'CCC-01.1',
    question: 'Are policies and procedures for managing the risks associated with applying changes to assets owned, controlled or used by the organization, established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'CCC-01',
    controlTitle: 'Change Management Policy and Procedures',
    domain: 'Change Control and Configuration Management'
  },
  {
    id: 'CCC-01.2',
    question: 'Are the policies and procedures reviewed and updated at least annually or upon significant changes?',
    controlId: 'CCC-01',
    controlTitle: 'Change Management Policy and Procedures',
    domain: 'Change Control and Configuration Management'
  },
  {
    id: 'CCC-02.1',
    question: 'Is a defined quality change control, approval and testing process incorporating baselines, testing and release standards, established, maintained and implemented?',
    controlId: 'CCC-02',
    controlTitle: 'Quality Testing',
    domain: 'Change Control and Configuration Management'
  },
  {
    id: 'CCC-03.1',
    question: 'Is a change management procedure implemented to manage the risks associated with applying changes to assets owned, controlled or used by the organization?',
    controlId: 'CCC-03',
    controlTitle: 'Change Management Technology',
    domain: 'Change Control and Configuration Management'
  },
  {
    id: 'CCC-04.1',
    question: 'Are procedures implemented and enforced to authorize the addition, removal, update, and management of assets owned, controlled, or used by the organization?',
    controlId: 'CCC-04',
    controlTitle: 'Change Authorization',
    domain: 'Change Control and Configuration Management'
  },
  {
    id: 'CCC-05.1',
    question: 'Are provisions included that limit changes directly impacting customer owned environments/tenants to explicitly authorized requests within service level agreements?',
    controlId: 'CCC-05',
    controlTitle: 'Change Agreements',
    domain: 'Change Control and Configuration Management'
  },
  {
    id: 'CCC-06.1',
    question: 'Are change management baselines established for all relevant authorized changes on organization assets?',
    controlId: 'CCC-06',
    controlTitle: 'Change Management Baseline',
    domain: 'Change Control and Configuration Management'
  },
  {
    id: 'CCC-06.2',
    question: 'Is the change management baseline reviewed an updated at least annually or upon significant changes?',
    controlId: 'CCC-06',
    controlTitle: 'Change Management Baseline',
    domain: 'Change Control and Configuration Management'
  },
  {
    id: 'CCC-07.1',
    question: 'Are detection measures with proactive notification implemented in case of changes deviating from the established baseline?',
    controlId: 'CCC-07',
    controlTitle: 'Detection of Baseline Deviation',
    domain: 'Change Control and Configuration Management'
  },
  {
    id: 'CCC-08.1',
    question: 'Is a procedure implemented (aligning with the requirements of GRC-04: Policy Exception Process) for the management of exceptions, including emergencies, in the change and configuration process?',
    controlId: 'CCC-08',
    controlTitle: 'Exception Management',
    domain: 'Change Control and Configuration Management'
  },
  {
    id: 'CCC-09.1',
    question: 'Is a process defined and implemented to proactively roll back changes to a previous known good state in case of errors or security concerns?',
    controlId: 'CCC-09',
    controlTitle: 'Change Restoration',
    domain: 'Change Control and Configuration Management'
  },

  // Cryptography, Encryption & Key Management (CEK)
  {
    id: 'CEK-01.1',
    question: 'Are cryptography, encryption, and key management policies and procedures established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'CEK-01',
    controlTitle: 'Encryption and Key Management Policy and Procedures',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-01.2',
    question: 'Are cryptography, encryption, and key management policies and procedures reviewed and updated at least annually or upon significant changes?',
    controlId: 'CEK-01',
    controlTitle: 'Encryption and Key Management Policy and Procedures',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-02.1',
    question: 'Are cryptography, encryption, and key management roles and responsibilities defined and implemented?',
    controlId: 'CEK-02',
    controlTitle: 'CEK Roles and Responsibilities',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-03.1',
    question: 'Is data protection, at-rest, in-transit and where applicable in-use, provided by using cryptographic libraries certified to approved standards?',
    controlId: 'CEK-03',
    controlTitle: 'Data Encryption',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-04.1',
    question: 'Are encryption algorithms utilized following industry standards for protecting data, based on the data classification and associated risks?',
    controlId: 'CEK-04',
    controlTitle: 'Encryption Algorithm',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-05.1',
    question: 'Are standard change management procedures established to review, approve, implement, and communicate cryptography, encryption, and key management technology changes that accommodate internal and external sources?',
    controlId: 'CEK-05',
    controlTitle: 'Encryption Change Management',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-06.1',
    question: 'Are changes to cryptography-, encryption- and key management-related systems, policies, and procedures, managed and adopted in a manner that fully accounts for downstream effects of proposed changes, including residual risk, cost, and benefits analysis?',
    controlId: 'CEK-06',
    controlTitle: 'Encryption Change Cost Benefit Analysis',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-07.1',
    question: 'Is a cryptography, encryption, and key management risk program established and maintained that includes risk assessment, risk treatment, risk context, monitoring, and feedback provisions?',
    controlId: 'CEK-07',
    controlTitle: 'Encryption Risk Management',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-08.1',
    question: 'Are providers providing customers with the capability to manage their own data encryption keys?',
    controlId: 'CEK-08',
    controlTitle: 'Customer Key Management Capability',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-09.1',
    question: 'Are encryption and key management systems, policies, and processes audited with a frequency proportional to the system\'s risk exposure?',
    controlId: 'CEK-09',
    controlTitle: 'Encryption and Key Management Audit',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-09.2',
    question: 'Are encryption and key management systems, policies, and processes audited preferably continuously but at least annually and after any security event?',
    controlId: 'CEK-09',
    controlTitle: 'Encryption and Key Management Audit',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-10.1',
    question: 'Are cryptographic keys generated using industry-accepted and approved cryptographic libraries that specify algorithm strength and random number generator specifications?',
    controlId: 'CEK-10',
    controlTitle: 'Key Generation',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-11.1',
    question: 'Are cryptographic secrets and private keys that are provisioned for a unique purpose properly managed?',
    controlId: 'CEK-11',
    controlTitle: 'Key Purpose',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-12.1',
    question: 'Are cryptographic keys rotated based on a cryptoperiod calculated while considering information disclosure risks, and legal and regulatory requirements?',
    controlId: 'CEK-12',
    controlTitle: 'Key Rotation',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-13.1',
    question: 'Are cryptographic keys revoked and removed before the end of the established cryptoperiod (when a key is compromised, or an entity is no longer part of the organization) per defined, implemented, and evaluated processes, procedures, and technical measures which include legal and regulatory requirement provisions?',
    controlId: 'CEK-13',
    controlTitle: 'Key Revocation',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-14.1',
    question: 'Are processes, procedures, and technical measures which include provisions for legal and regulatory requirements, defined, implemented and evaluated, to securely destroy cryptographic keys when they are no longer needed?',
    controlId: 'CEK-14',
    controlTitle: 'Key Destruction',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-15.1',
    question: 'Are processes, procedures, and technical measures to create keys in a pre-activated state (i.e., when they have been generated but not authorized for use) defined, implemented, and evaluated, including provisions for legal and regulatory requirements?',
    controlId: 'CEK-15',
    controlTitle: 'Key Activation',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-16.1',
    question: 'Are processes, procedures, and technical measures to monitor, review, and approve key transitions (e.g., from any state to/from suspension) defined, implemented, and evaluated including provisions for legal and regulatory requirements?',
    controlId: 'CEK-16',
    controlTitle: 'Key Suspension',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-17.1',
    question: 'Are processes, procedures, and technical measures to deactivate keys (at the time of their expiration date) defined, implemented, and evaluated including provisions for legal and regulatory requirements?',
    controlId: 'CEK-17',
    controlTitle: 'Key Deactivation',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-18.1',
    question: 'Are processes, procedures, and technical measures to manage archived keys in a secure repository (requiring least privilege access) defined, implemented, and evaluated including provisions for legal and regulatory requirements?',
    controlId: 'CEK-18',
    controlTitle: 'Key Archival',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-19.1',
    question: 'Are processes, procedures, and technical measures to use compromised keys to encrypt information in specific scenarios (e.g., only in controlled circumstances and thereafter only for data decryption and never for encryption) defined implemented, and evaluated including provisions for legal and regulatory requirement?',
    controlId: 'CEK-19',
    controlTitle: 'Key Compromise',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-20.1',
    question: 'Are processes, procedures, and technical measures to assess operational continuity risks (versus the risk of losing control of keying material and exposing protected data) defined, implemented, and evaluated, including provisions for legal and regulatory requirement provisions?',
    controlId: 'CEK-20',
    controlTitle: 'Key Recovery',
    domain: 'Cryptography, Encryption & Key Management'
  },
  {
    id: 'CEK-21.1',
    question: 'Are key management system processes, procedures, and technical measures defined, implemented, and evaluated to track and report all cryptographic materials and status changes including provisions for legal and regulatory requirements?',
    controlId: 'CEK-21',
    controlTitle: 'Key Inventory Management',
    domain: 'Cryptography, Encryption & Key Management'
  },

  // Datacenter Security (DCS)
  {
    id: 'DCS-01.1',
    question: 'Are policies and procedures for the secure disposal of equipment used outside the organization\'s premises established, documented, approved, communicated, enforced, and maintained?',
    controlId: 'DCS-01',
    controlTitle: 'Off-Site Equipment Disposal Policy and Procedures',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-01.2',
    question: 'Is a data destruction procedure applied that renders information recovery information impossible if equipment is not physically destroyed?',
    controlId: 'DCS-01',
    controlTitle: 'Off-Site Equipment Disposal Policy and Procedures',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-01.3',
    question: 'Are all policies and procedures for the secure disposal of equipment used outside the organization\'s premises reviewed and updated at least annually, or upon significant changes?',
    controlId: 'DCS-01',
    controlTitle: 'Off-Site Equipment Disposal Policy and Procedures',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-02.1',
    question: 'Are policies and procedures for the relocation or transfer of hardware, software, or data/information to an offsite or alternate location established, documented, approved, communicated, implemented, enforced, maintained?',
    controlId: 'DCS-02',
    controlTitle: 'Off-Site Transfer Authorization Policy and Procedures',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-02.2',
    question: 'Are the written or cryptographically verifiable authorization required for relocation or transfer request?',
    controlId: 'DCS-02',
    controlTitle: 'Off-Site Transfer Authorization Policy and Procedures',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-02.3',
    question: 'Are policies and procedures for the relocation or transfer of hardware, software, or data/information to an offsite or alternate location reviewed and updated at least annually, or upon significant changes?',
    controlId: 'DCS-02',
    controlTitle: 'Off-Site Transfer Authorization Policy and Procedures',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-03.1',
    question: 'Are policies and procedures for maintaining a safe and secure working environment (in offices, rooms, and facilities) established, documented, approved, communicated, applied, evaluated and maintained?',
    controlId: 'DCS-03',
    controlTitle: 'Secure Area Policy and Procedures',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-03.2',
    question: 'Are policies and procedures for maintaining safe, secure working environments (e.g., offices, rooms, and facilities) reviewed and updated at least annually, or upon significant changes?',
    controlId: 'DCS-03',
    controlTitle: 'Secure Area Policy and Procedures',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-04.1',
    question: 'Are policies and procedures for the secure transportation of physical media established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'DCS-04',
    controlTitle: 'Secure Media Transportation Policy and Procedures',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-04.2',
    question: 'Are policies and procedures for the secure transportation of physical media reviewed and updated at least annually, or upon significant changes?',
    controlId: 'DCS-04',
    controlTitle: 'Secure Media Transportation Policy and Procedures',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-05.1',
    question: 'Are the physical and logical assets (e.g. applications) classified and documented based on the organizational business risk?',
    controlId: 'DCS-05',
    controlTitle: 'Assets Classification',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-05.2',
    question: 'Is the assets\' classification reviewed and updated at least annually or upon significant changes?',
    controlId: 'DCS-05',
    controlTitle: 'Assets Classification',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-06.1',
    question: 'Are all relevant physical and logical assets located at service provider sites catalogued and tracked within a secured system?',
    controlId: 'DCS-06',
    controlTitle: 'Assets Cataloguing and Tracking',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-06.2',
    question: 'Are catalogues reviewed and updated at least annually or upon significant changes?',
    controlId: 'DCS-06',
    controlTitle: 'Assets Cataloguing and Tracking',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-07.1',
    question: 'Are physical security perimeters designed and implemented to safeguard personnel, data, and information systems?',
    controlId: 'DCS-07',
    controlTitle: 'Controlled Physical Access Points',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-08.1',
    question: 'Is equipment identification used as a method for connection authentication?',
    controlId: 'DCS-08',
    controlTitle: 'Equipment Identification',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-09.1',
    question: 'Are solely authorized personnel able to access secure areas, with all ingress and egress areas restricted, documented, and monitored by physical access control mechanisms?',
    controlId: 'DCS-09',
    controlTitle: 'Secure Area Authorization',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-09.2',
    question: 'Are access control records retained periodically, as deemed appropriate by the organization?',
    controlId: 'DCS-09',
    controlTitle: 'Secure Area Authorization',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-10.1',
    question: 'Are datacenter surveillance systems at the external perimeter and at all the ingress and egress points, implemented, maintained, and operated to detect unauthorized ingress and egress attempts?',
    controlId: 'DCS-10',
    controlTitle: 'Surveillance System',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-11.1',
    question: 'Are data center personnel trained to safely manage adverse events, including but not limited to unauthorized ingress and egress attempts?',
    controlId: 'DCS-11',
    controlTitle: 'Adverse Event Response Training',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-12.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated to ensure risk-based protection of power and telecommunication cables from interception, interference, or damage threats at all facilities, offices, and rooms?',
    controlId: 'DCS-12',
    controlTitle: 'Cabling Security',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-13.1',
    question: 'Are data center environmental control systems designed to implement and maintain, and test for continual effectiveness of temperature and humidity conditions within accepted industry standards?',
    controlId: 'DCS-13',
    controlTitle: 'Environmental Systems',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-14.1',
    question: 'Are utility services secured, monitored, maintained, and tested at planned intervals for continual effectiveness?',
    controlId: 'DCS-14',
    controlTitle: 'Secure Utilities',
    domain: 'Datacenter Security'
  },
  {
    id: 'DCS-15.1',
    question: 'Is business-critical equipment segregated from locations subject to a high probability of environmental risk events?',
    controlId: 'DCS-15',
    controlTitle: 'Equipment Location',
    domain: 'Datacenter Security'
  },

  // Data Security and Privacy Lifecycle Management (DSP)
  {
    id: 'DSP-01.1',
    question: 'Are Security and Privacy Policies and Procedures established, documented, approved, communicated, applied, evaluated, and maintained for the classification, protection, preparation, and handling of data throughout its lifecycle, and according to all applicable laws and regulations, standards, and risk level?',
    controlId: 'DSP-01',
    controlTitle: 'Security and Privacy Policy and Procedures',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-01.2',
    question: 'Are Security and Privacy Policies and Procedures reviewed and updated at least annually?',
    controlId: 'DSP-01',
    controlTitle: 'Security and Privacy Policy and Procedures',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-02.1',
    question: 'Are industry-accepted methods applied for securely disposing of data from storage media so that it is not recoverable by any forensic means?',
    controlId: 'DSP-02',
    controlTitle: 'Secure Disposal',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-03.1',
    question: 'Are data inventories created and maintained at least for any sensitive, regulated, and personal data?',
    controlId: 'DSP-03',
    controlTitle: 'Data Inventory',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-03.2',
    question: 'Are inventories reviewed and updated at least annually or upon significant changes?',
    controlId: 'DSP-03',
    controlTitle: 'Data Inventory',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-04.1',
    question: 'Are data classified according to its type and sensitivity level?',
    controlId: 'DSP-04',
    controlTitle: 'Data Classification',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-05.1',
    question: 'Are data flow documentation created to identify what data is processed, stored, or transmitted where?',
    controlId: 'DSP-05',
    controlTitle: 'Data Flow Documentation',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-05.2',
    question: 'Are data flow documentation reviewed at defined intervals, at least annually, and after any change?',
    controlId: 'DSP-05',
    controlTitle: 'Data Flow Documentation',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-06.1',
    question: 'Are ownership and stewardship of all relevant personal and sensitive data documented?',
    controlId: 'DSP-06',
    controlTitle: 'Data Ownership and Stewardship',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-06.2',
    question: 'Are reviews performed at least annually for the documented ownership and stewardship of all relevant personal and sensitive data?',
    controlId: 'DSP-06',
    controlTitle: 'Data Ownership and Stewardship',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-07.1',
    question: 'Are systems, products, and business practices developed based upon a principle of security by design and industry best practices?',
    controlId: 'DSP-07',
    controlTitle: 'Data Protection by Design and Default',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-08.1',
    question: 'Are systems, products, and business practices developed based upon a principle of privacy by design and industry best practices?',
    controlId: 'DSP-08',
    controlTitle: 'Data Privacy by Design and Default',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-08.2',
    question: 'Are systems\' privacy settings configured by default, according to all applicable laws and regulations?',
    controlId: 'DSP-08',
    controlTitle: 'Data Privacy by Design and Default',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-09.1',
    question: 'Are Data Protection Impact Assessments (DPIAs) conducted to evaluate the origin, nature, particularity, and severity of the risks upon the processing of personal data, according to any applicable laws, regulations, and industry best practices?',
    controlId: 'DSP-09',
    controlTitle: 'Data Protection Impact Assessment',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-10.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated that ensure any transfer of personal or sensitive data is protected from unauthorized access and only processed within scope as permitted by the respective laws and regulations?',
    controlId: 'DSP-10',
    controlTitle: 'Sensitive Data Transfer',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-11.1',
    question: 'Are processes, procedures, and technical measures defined and implemented to enable data subjects to request access to, modify, or delete their personal data according to applicable laws and regulations?',
    controlId: 'DSP-11',
    controlTitle: 'Personal Data Access, Reversal, Rectification and Deletion',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-12.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated to ensure that personal data is processed according to applicable laws and regulations and for the purposes declared to the data subject?',
    controlId: 'DSP-12',
    controlTitle: 'Limitation of Purpose in Personal Data Processing',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-13.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated for transferring and sub-processing personal data within the service supply chain according to applicable laws and regulations?',
    controlId: 'DSP-13',
    controlTitle: 'Personal Data Sub-processing',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-14.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated to disclose the details of any personal or sensitive data access by sub-processors to the data owner before initiating that processing?',
    controlId: 'DSP-14',
    controlTitle: 'Disclosure of Data Sub-processors',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-15.1',
    question: 'Are authorizations obtained from data owners and associated risks managed before replicating or using production data in non-production environments?',
    controlId: 'DSP-15',
    controlTitle: 'Limitation of Production Data Use',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-16.1',
    question: 'Are data retention, archiving, and deletion managed per business requirements, applicable laws, and regulations?',
    controlId: 'DSP-16',
    controlTitle: 'Data Retention and Deletion',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-17.1',
    question: 'Are processes, procedures, and technical measures defined and implemented to protect sensitive data throughout its lifecycle?',
    controlId: 'DSP-17',
    controlTitle: 'Sensitive Data Protection',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-18.1',
    question: 'Are the procedures to manage and respond to requests for disclosure of Personal Data by Law Enforcement Authorities according to applicable laws and regulations, implemented and described to the customers by the providers?',
    controlId: 'DSP-18',
    controlTitle: 'Disclosure Notification',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-19.1',
    question: 'Are processes, procedures, and technical measures defined and implemented to specify and document the physical locations of data, including any locations where data is processed or backed up?',
    controlId: 'DSP-19',
    controlTitle: 'Data Location',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-20.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated to: 1) Document and trace data sources, and 2) Make the data source available according to legal and regulatory requirements',
    controlId: 'DSP-20',
    controlTitle: 'Data Provenance and Transparency',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-21.1',
    question: 'Are processes, procedures and technical measures to prevent data poisoning in AI models and continuously detect such, defined, implemented and evaluated?',
    controlId: 'DSP-21',
    controlTitle: 'Data Poisoning Prevention & Detection',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-22.1',
    question: 'Are Privacy Enhancing Technologies (PET) used for training data informed by risk and privacy impact analysis and business use cases?',
    controlId: 'DSP-22',
    controlTitle: 'Privacy Enhancing Technologies',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-23.1',
    question: 'Is the consistency and conformity of training, fine-tuning or augmentation data regularly validated?',
    controlId: 'DSP-23',
    controlTitle: 'Data Integrity Check',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-23.2',
    question: 'Is dataset versioning to ensure traceability implemented and are restrictions to prevent unauthorized changes, enforced?',
    controlId: 'DSP-23',
    controlTitle: 'Data Integrity Check',
    domain: 'Data Security and Privacy Lifecycle Management'
  },
  {
    id: 'DSP-24.1',
    question: 'Is training-data differentiation and relevance to the intended use of the AI Model, ensured?',
    controlId: 'DSP-24',
    controlTitle: 'Data Differentiation and Relevance',
    domain: 'Data Security and Privacy Lifecycle Management'
  },

  // Governance, Risk and Compliance (GRC)
  {
    id: 'GRC-01.1',
    question: 'Are policies and procedures established, documented, approved, communicated, applied, evaluated, and maintained for an information governance program that is sponsored by the leadership of the organization and related to AI systems as well?',
    controlId: 'GRC-01',
    controlTitle: 'Governance Program Policy and Procedures',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-01.2',
    question: 'Are policies and procedures for information governance program and related to AI systems reviewed and updated at least annually?',
    controlId: 'GRC-01',
    controlTitle: 'Governance Program Policy and Procedures',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-02.1',
    question: 'Is a formal, documented, and leadership-sponsored AI risk management (AIRM) program that includes policies and procedures for identification, evaluation, ownership, treatment, and acceptance of risks, established and maintained?',
    controlId: 'GRC-02',
    controlTitle: 'Risk Management Program',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-03.1',
    question: 'Are relevant organizational policies and associated procedures reviewed at least annually or when a substantial change within the organization, occurs?',
    controlId: 'GRC-03',
    controlTitle: 'Organizational Policy Reviews',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-04.1',
    question: 'Is an approved exception process mandated by the governance program established and followed whenever a deviation from an established policy occurs?',
    controlId: 'GRC-04',
    controlTitle: 'Policy Exception Process',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-05.1',
    question: 'Is an Information Security Program that includes programs for all the relevant domains of the AICM developed and implemented?',
    controlId: 'GRC-05',
    controlTitle: 'Information Security Program',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-06.1',
    question: 'Are roles and responsibilities defined and documented for planning, implementing, operating, assessing, and improving governance programs?',
    controlId: 'GRC-06',
    controlTitle: 'Governance Responsibility Model',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-07.1',
    question: 'Are all relevant standards, regulations, legal/contractual, and statutory requirements, applicable to your organization, identified and documented?',
    controlId: 'GRC-07',
    controlTitle: 'Information System Regulatory Mapping',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-07.2',
    question: 'Are all relevant standards, regulations, legal/contractual and statutory requirements reviewed and updated at least annually or when a substantial change occurs within the organization?',
    controlId: 'GRC-07',
    controlTitle: 'Information System Regulatory Mapping',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-08.01',
    question: 'Is contact established and maintained with related special interest groups and other relevant entities in line with business context?',
    controlId: 'GRC-08',
    controlTitle: 'Special Interest Groups',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-09.1',
    question: 'Are policies and procedures defined, documented, and enforced for the acceptable use of AI services offered by the organization?',
    controlId: 'GRC-09',
    controlTitle: 'Acceptable Use of the AI Service',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-09.2',
    question: 'Is effectiveness of the acceptable use of AI services policies and procedures evaluated by continuous risk assessments, reviews, and human oversight?',
    controlId: 'GRC-09',
    controlTitle: 'Acceptable Use of the AI Service',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-10.1',
    question: 'Is an AI Impact Assessment process and its criteria to regularly evaluate the ethical, societal, operational, legal, and security impacts of the AI system throughout its lifecycle, established, documented, and communicated to all relevant stakeholders?',
    controlId: 'GRC-10',
    controlTitle: 'AI Impact Assessment',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-11.1',
    question: 'Are AI systems, models, datasets & algorithms regularly evaluated for bias and fairness to ensure compliance with ethical standards?',
    controlId: 'GRC-11',
    controlTitle: 'Bias and Fairness Assessment',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-12.1',
    question: 'Is an ethics committee established to review AI applications, ensuring alignment with ethical standards and organizational values?',
    controlId: 'GRC-12',
    controlTitle: 'Ethics Committee',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-13.1',
    question: 'Is the degree of explainability required for the AI Services established, documented, and communicated?',
    controlId: 'GRC-13',
    controlTitle: 'Explainability Requirement',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-14.1',
    question: 'Is the degree of explainability of the AI Services evaluated, documented, and communicated, including possible limitations and exceptions?',
    controlId: 'GRC-14',
    controlTitle: 'Explainability Evaluation',
    domain: 'Governance, Risk and Compliance'
  },
  {
    id: 'GRC-15.1',
    question: 'Are processes, procedures, and technical measures to ensure human oversight and control of the AI system in compliance with regulatory requirements and organizational risk management, established, executed and assessed?',
    controlId: 'GRC-15',
    controlTitle: 'Human supervision',
    domain: 'Governance, Risk and Compliance'
  },

  // Human Resources (HRS)
  {
    id: 'HRS-01.1',
    question: 'Are new employee background verification policies and procedures (including but not limited to remote employees, contractors, and third parties) established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'HRS-01',
    controlTitle: 'Background Screening Policy and Procedures',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-01.2',
    question: 'Are background verification policies and procedures designed according to local laws, regulations, ethics, and contractual constraints and proportional to the data classification to be accessed, business requirements, and acceptable risk?',
    controlId: 'HRS-01',
    controlTitle: 'Background Screening Policy and Procedures',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-01.3',
    question: 'Are background verification policies and procedures reviewed and updated at least annually?',
    controlId: 'HRS-01',
    controlTitle: 'Background Screening Policy and Procedures',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-02.1',
    question: 'Are policies and procedures for defining allowances and conditions for the acceptable use of organizationally-owned or managed assets established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'HRS-02',
    controlTitle: 'Acceptable Use of Technology Policy and Procedures',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-02.2',
    question: 'Are the policies and procedures for defining allowances and conditions for the acceptable use of organizationally-owned or managed assets reviewed and updated at least annually?',
    controlId: 'HRS-02',
    controlTitle: 'Acceptable Use of Technology Policy and Procedures',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-03.1',
    question: 'Are policies and procedures requiring unattended workspaces to conceal confidential data established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'HRS-03',
    controlTitle: 'Clean Desk Policy and Procedures',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-03.2',
    question: 'Are policies and procedures requiring unattended workspaces to conceal confidential data reviewed and updated at least annually?',
    controlId: 'HRS-03',
    controlTitle: 'Clean Desk Policy and Procedures',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-04.1',
    question: 'Are policies and procedures to protect information accessed, processed, or stored at remote sites and locations established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'HRS-04',
    controlTitle: 'Remote and Home Working Policy and Procedures',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-04.2',
    question: 'Are policies and procedures to protect information accessed, processed, or stored at remote sites and locations reviewed and updated at least annually?',
    controlId: 'HRS-04',
    controlTitle: 'Remote and Home Working Policy and Procedures',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-05.1',
    question: 'Are return procedures of organizationally-owned assets by terminated employees established and documented?',
    controlId: 'HRS-05',
    controlTitle: 'Asset returns',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-06.1',
    question: 'Are procedures outlining the roles and responsibilities concerning changes in employment established, documented, and communicated to all personnel?',
    controlId: 'HRS-06',
    controlTitle: 'Employment Termination',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-07.1',
    question: 'Are employees required to sign an employment agreement before gaining access to organizational information systems, resources, and assets?',
    controlId: 'HRS-07',
    controlTitle: 'Employment Agreement Process',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-08.1',
    question: 'Are provisions and/or terms for adherence to established information governance and security policies included within employment agreements?',
    controlId: 'HRS-08',
    controlTitle: 'Employment Agreement Content',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-09.1',
    question: 'Are employee roles and responsibilities relating to information assets and security documented and communicated?',
    controlId: 'HRS-09',
    controlTitle: 'Personnel Roles and Responsibilities',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-10.1',
    question: 'Are requirements for non-disclosure/confidentiality agreements reflecting organizational data protection needs and operational details identified, documented, and reviewed at planned intervals?',
    controlId: 'HRS-10',
    controlTitle: 'Non-Disclosure Agreements',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-11.1',
    question: 'Is a security awareness training program for all employees of the organization established, documented, approved, communicated, applied, evaluated and maintained?',
    controlId: 'HRS-11',
    controlTitle: 'Security Awareness Training',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-11.2',
    question: 'Are regular security awareness training updates provided?',
    controlId: 'HRS-11',
    controlTitle: 'Security Awareness Training',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-12.1',
    question: 'Are employees with access to sensitive organizational and personal data, provided with appropriate security awareness training and regular updates in organizational procedures, processes, and policies, relating to their professional function relative to the organization?',
    controlId: 'HRS-12',
    controlTitle: 'Personal and Sensitive Data Awareness and Training',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-13.1',
    question: 'Are employees notified of their roles and responsibilities to maintain awareness and compliance with established policies, procedures, and applicable legal, statutory, or regulatory compliance obligations?',
    controlId: 'HRS-13',
    controlTitle: 'Compliance User Responsibility',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-14.1',
    question: 'Are the policies and procedures defining the AI training program for all relevant personnel of the organization established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'HRS-14',
    controlTitle: 'AI Competency Training',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-14.2',
    question: 'Are regular training updates given to personnel based on their roles?',
    controlId: 'HRS-14',
    controlTitle: 'AI Competency Training',
    domain: 'Human Resources'
  },
  {
    id: 'HRS-15.1',
    question: 'Are the policies and procedures on the acceptable use of AI technologies within the organization established, documented, and communicated to all personnel?',
    controlId: 'HRS-15',
    controlTitle: 'AI Acceptable Use',
    domain: 'Human Resources'
  },

  // Identity & Access Management (IAM)
  {
    id: 'IAM-01.1',
    question: 'Are Identity and Access Management policies and procedures established, documented, approved, communicated, implemented, applied, evaluated, and maintained for identity and access management?',
    controlId: 'IAM-01',
    controlTitle: 'Identity and Access Management Policy and Procedures',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-01.2',
    question: 'Are Identity and Access Management Policies and Procedures reviewed and updated at least annually, or upon significant changes?',
    controlId: 'IAM-01',
    controlTitle: 'Identity and Access Management Policy and Procedures',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-02.1',
    question: 'Are strong password policies and procedures established, documented, approved, communicated, implemented, applied, evaluated, and maintained?',
    controlId: 'IAM-02',
    controlTitle: 'Strong Password Policy and Procedures',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-02.2',
    question: 'Are strong password policies and procedures reviewed and updated at least annually?',
    controlId: 'IAM-02',
    controlTitle: 'Strong Password Policy and Procedures',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-03.1',
    question: 'Is the inventory of identities managed, stored and regularly reviewed, and is their level of access monitored?',
    controlId: 'IAM-03',
    controlTitle: 'Identity Inventory',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-04.1',
    question: 'Are separation of duties principles employed when implementing information system access?',
    controlId: 'IAM-04',
    controlTitle: 'Separation of Duties',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-05.1',
    question: 'Are least privilege principles employed when implementing information system access?',
    controlId: 'IAM-05',
    controlTitle: 'Least Privilege',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-06.1',
    question: 'Is an identity access provisioning process which authorizes, records, and communicates access changes to data and assets, defined and implemented?',
    controlId: 'IAM-06',
    controlTitle: 'User Access Provisioning',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-07.1',
    question: 'Is identity access de-provisioned or modified, in a timely manner?',
    controlId: 'IAM-07',
    controlTitle: 'User Access Changes and Revocation',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-08.1',
    question: 'Are user access for least privilege and separation of duties reviewed and revalidated with a frequency commensurated with organizational risk tolerance and at least annually or upon significant changes?',
    controlId: 'IAM-08',
    controlTitle: 'User Access Review',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-09.1',
    question: 'Are processes, procedures, and technical measures for the segregation of privileged access roles, defined, implemented, and evaluated?',
    controlId: 'IAM-09',
    controlTitle: 'Segregation of Privileged Access Roles',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-10.1',
    question: 'Is an access process defined and implemented to ensure privileged access roles and rights are granted for a time-limited period?',
    controlId: 'IAM-10',
    controlTitle: 'Management of Privileged Access Roles',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-10.2',
    question: 'Are procedures implemented to prevent the accumulation of segregated privileged access?',
    controlId: 'IAM-10',
    controlTitle: 'Management of Privileged Access Roles',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-11.1',
    question: 'Are processes and procedures defined, implemented, and evaluated for customers to participate, where applicable, in granting access for agreed high-risk (as defined by the organizational risk assessment) privileged access roles?',
    controlId: 'IAM-11',
    controlTitle: 'Customers\' Approval for Agreed Privileged Access Roles',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-12.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, evaluated to ensure the logging infrastructure is read-only for all with write access, including privileged access roles, and that the ability to disable it, is controlled through a procedure that ensures the segregation of duties and break glass procedures?',
    controlId: 'IAM-12',
    controlTitle: 'Safeguard Logs Integrity',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-13.1',
    question: 'Are processes, procedures, and technical measures, that ensure identities\' activities are identifiable through uniquely associated IDs, defined, implemented, and evaluated?',
    controlId: 'IAM-13',
    controlTitle: 'Uniquely Identifiable Users',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-14.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated for authenticating access to systems, applications, and data assets, including multifactor authentication for at least privileged user and sensitive data access?',
    controlId: 'IAM-14',
    controlTitle: 'Strong Authentication',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-14.2',
    question: 'Are digital certificates or alternatives adopted that achieve an equivalent level of security for system identities?',
    controlId: 'IAM-14',
    controlTitle: 'Strong Authentication',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-15.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated for the secure management of passwords and other secrets?',
    controlId: 'IAM-15',
    controlTitle: 'Passwords and Secrets Management',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-16.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated to verify access to data and system functions are authorized?',
    controlId: 'IAM-16',
    controlTitle: 'Authorization Mechanisms',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-17.1',
    question: 'Are policies and procedures defined for "need to know" access to knowledge, information and data within the organization and in the context of the AI system to be applied when regulating access to resources?',
    controlId: 'IAM-17',
    controlTitle: 'Knowledge Access Control - Need to Know',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-18.1',
    question: 'Are role for access when allowing model output modification of AI-generated output established to ensure changes are made only by authorized identities?',
    controlId: 'IAM-18',
    controlTitle: 'Output Modification and Special Authorization',
    domain: 'Identity & Access Management'
  },
  {
    id: 'IAM-19.1',
    question: 'Are agents\' access to the tools and plugins necessary for the activity or use case at hand, restricted to ensure adherence to the principles of need-to-know and least privilege?',
    controlId: 'IAM-19',
    controlTitle: 'Agent Access Restriction',
    domain: 'Identity & Access Management'
  },

  // Interoperability & Portability (IPY)
  {
    id: 'IPY-01.1',
    question: 'Are interoperability and portability policies and procedures established, documented, approved, communicated, evaluated, and maintained, including requirements for communication between interfaces, portability, and integrity?',
    controlId: 'IPY-01',
    controlTitle: 'Interoperability and Portability Policy and Procedures',
    domain: 'Interoperability & Portability'
  },
  {
    id: 'IPY-01.2',
    question: 'Are interoperability and portability policies and procedures reviewed and updated at least annually or upon significant changes?',
    controlId: 'IPY-01',
    controlTitle: 'Interoperability and Portability Policy and Procedures',
    domain: 'Interoperability & Portability'
  },
  {
    id: 'IPY-02.1',
    question: 'Are application interface(s) to AICs provided so that they programmatically retrieve their data to enable interoperability and portability?',
    controlId: 'IPY-02',
    controlTitle: 'Application Interface Availability',
    domain: 'Interoperability & Portability'
  },
  {
    id: 'IPY-03.1',
    question: 'Are cryptographically secure and standardized network protocols implemented for the management, import, and export of data, according to industry standards?',
    controlId: 'IPY-03',
    controlTitle: 'Secure Interoperability and Portability Management',
    domain: 'Interoperability & Portability'
  },
  {
    id: 'IPY-04.1',
    question: 'Are agreements including provisions specifying AICs access to data upon contract termination (format, time stored, deletion policy)?',
    controlId: 'IPY-04',
    controlTitle: 'Data Portability Contractual Obligations',
    domain: 'Interoperability & Portability'
  },

  // Infrastructure Security (I&S)
  {
    id: 'I&S-01.1',
    question: 'Has the organization established, documented, approved, communicated, applied, evaluated, and maintained policies and procedures for infrastructure and virtualization security?',
    controlId: 'I&S-01',
    controlTitle: 'Infrastructure and Virtualization Security Policy and Procedures',
    domain: 'Infrastructure Security'
  },
  {
    id: 'I&S-01.2',
    question: 'Are these policies and procedures reviewed and updated at least annually, or upon significant changes?',
    controlId: 'I&S-01',
    controlTitle: 'Infrastructure and Virtualization Security Policy and Procedures',
    domain: 'Infrastructure Security'
  },
  {
    id: 'I&S-02.1',
    question: 'Are availability, quality and the adequate capacity of resources, being planned and monitored in order to deliver the required system performance as determined by the business?',
    controlId: 'I&S-02',
    controlTitle: 'Capacity and Resource Planning',
    domain: 'Infrastructure Security'
  },
  {
    id: 'I&S-03.1',
    question: 'Are communications between environments being monitored, encrypted, and restricted to only authenticated and authorized connections, as justified by the business?',
    controlId: 'I&S-03',
    controlTitle: 'Network Security',
    domain: 'Infrastructure Security'
  },
  {
    id: 'I&S-03.2',
    question: 'Are these configurations reviewed at least annually and supported by a documented justification of all allowed services, protocols, ports, and compensating controls?',
    controlId: 'I&S-03',
    controlTitle: 'Network Security',
    domain: 'Infrastructure Security'
  },
  {
    id: 'I&S-04.1',
    question: 'Are the host and guest OS, hypervisor, or infrastructure control plane, being hardened according to their respective best practices and supported by technical controls as part of a security baseline?',
    controlId: 'I&S-04',
    controlTitle: 'OS Hardening and Base Controls',
    domain: 'Infrastructure Security'
  },
  {
    id: 'I&S-05.1',
    question: 'Are production and non-production environments kept separate?',
    controlId: 'I&S-05',
    controlTitle: 'Production and Non-Production Environments',
    domain: 'Infrastructure Security'
  },
  {
    id: 'I&S-06.1',
    question: 'Are applications and infrastructures designed, developed, deployed and configured such that tenant access is appropriately segmented, segregated, monitored, and restricted from other tenants?',
    controlId: 'I&S-06',
    controlTitle: 'Segmentation and Segregation',
    domain: 'Infrastructure Security'
  },
  {
    id: 'I&S-07.1',
    question: 'Are secure and encrypted communication channels used when migrating servers, services, applications or data to hosted environments?',
    controlId: 'I&S-07',
    controlTitle: 'Migration to Hosted Environments',
    domain: 'Infrastructure Security'
  },
  {
    id: 'I&S-07.2',
    question: 'Are such channels including only up-to-date and approved protocols?',
    controlId: 'I&S-07',
    controlTitle: 'Migration to Hosted Environments',
    domain: 'Infrastructure Security'
  },
  {
    id: 'I&S-08.1',
    question: 'Are high-risk environments identified and documented?',
    controlId: 'I&S-08',
    controlTitle: 'Network Architecture Documentation',
    domain: 'Infrastructure Security'
  },
  {
    id: 'I&S-09.1',
    question: 'Are processes, procedures, and defense-in-depth techniques for the protection, detection, and timely response to network-based attacks, defined, implemented and evaluated?',
    controlId: 'I&S-09',
    controlTitle: 'Network Defense',
    domain: 'Infrastructure Security'
  },

  // Logging and Monitoring (LOG)
  {
    id: 'LOG-01.1',
    question: 'Are logging and monitoring policies and procedures established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'LOG-01',
    controlTitle: 'Logging and Monitoring Policy and Procedures',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-01.2',
    question: 'Are policies and procedures reviewed, approved and updated at least annually, or upon significant changes?',
    controlId: 'LOG-01',
    controlTitle: 'Logging and Monitoring Policy and Procedures',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-02.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated to ensure audit log security and retention?',
    controlId: 'LOG-02',
    controlTitle: 'Audit Logs Protection',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-03.1',
    question: 'Are security-related events within applications, the underlying infrastructure, and the supply chain being identified and monitored?',
    controlId: 'LOG-03',
    controlTitle: 'Security Monitoring and Alerting',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-03.2',
    question: 'Is a system to generate alerts, defined and implemented, to responsible stakeholders based on security-related events and corresponding metrics?',
    controlId: 'LOG-03',
    controlTitle: 'Security Monitoring and Alerting',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-04.1',
    question: 'Is access to audit logs restricted and are the records of access logs maintained?',
    controlId: 'LOG-04',
    controlTitle: 'Audit Logs Access and Accountability',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-05.1',
    question: 'Are security audit logs monitored to detect activity outside of typical or expected patterns?',
    controlId: 'LOG-05',
    controlTitle: 'Audit Logs Monitoring and Response',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-05.2',
    question: 'Is a process, on reviewing and taking appropriate and timely actions on detected anomalies, defined, established and followed?',
    controlId: 'LOG-05',
    controlTitle: 'Audit Logs Monitoring and Response',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-06.1',
    question: 'Is a reliable time source being used across all relevant information processing systems?',
    controlId: 'LOG-06',
    controlTitle: 'Clock Synchronization',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-07.1',
    question: 'Are information metadata system events that should be logged, established, documented, and implemented?',
    controlId: 'LOG-07',
    controlTitle: 'Logging Scope',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-07.2',
    question: 'Is the scope reviewed and updated at least annually, or whenever there is a change in the threat environment?',
    controlId: 'LOG-07',
    controlTitle: 'Logging Scope',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-08.1',
    question: 'Are audit records generated, and do they contain relevant security information?',
    controlId: 'LOG-08',
    controlTitle: 'Log Records',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-09.1',
    question: 'Are the audit records protected from unauthorized access, modification, and deletion?',
    controlId: 'LOG-09',
    controlTitle: 'Log Protection',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-10.1',
    question: 'Are monitoring and internal reporting capabilities established to report on cryptographic operations, encryption, and key management?',
    controlId: 'LOG-10',
    controlTitle: 'Encryption Monitoring and Reporting',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-11.1',
    question: 'Are key lifecycle management events logged and monitored to enable auditing and reporting on cryptographic keys\' usage?',
    controlId: 'LOG-11',
    controlTitle: 'Transaction/Activity Logging',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-12.1',
    question: 'Is physical access logged and monitored using an auditable access control system?',
    controlId: 'LOG-12',
    controlTitle: 'Access Control Logs',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-13.1',
    question: 'Are processes and technical measures for reporting monitoring system anomalies and failures defined, implemented, and evaluated?',
    controlId: 'LOG-13',
    controlTitle: 'Failures and Anomalies Reporting',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-13.2',
    question: 'Are accountable parties immediately notified about anomalies and failures?',
    controlId: 'LOG-13',
    controlTitle: 'Failures and Anomalies Reporting',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-14.1',
    question: 'Are all input events (content and metadata) logged and monitored to enable auditing and reporting on the usage of AI models?',
    controlId: 'LOG-14',
    controlTitle: 'Input Monitoring',
    domain: 'Logging and Monitoring'
  },
  {
    id: 'LOG-15.1',
    question: 'Are all output events (content and metadata) logged and monitored to enable auditing and reporting on the usage of AI models?',
    controlId: 'LOG-15',
    controlTitle: 'Output Monitoring',
    domain: 'Logging and Monitoring'
  },

  // Model Security (MDS)
  {
    id: 'MDS-01.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated to ensure the security of the Training Pipeline?',
    controlId: 'MDS-01',
    controlTitle: 'Training Pipeline Security',
    domain: 'Model Security'
  },
  {
    id: 'MDS-01.2',
    question: 'Are policies, procedures and technical measures to address new security threats and best practices regularly reviewed and updated?',
    controlId: 'MDS-01',
    controlTitle: 'Training Pipeline Security',
    domain: 'Model Security'
  },
  {
    id: 'MDS-02.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated for the periodic scanning of model artifacts for vulnerabilities and attacks at each step of the service lifecycle?',
    controlId: 'MDS-02',
    controlTitle: 'Model Artifact Scanning',
    domain: 'Model Security'
  },
  {
    id: 'MDS-02.2',
    question: 'Are policies, procedures and technical measures to address model artifact scanning regularly reviewed and updated?',
    controlId: 'MDS-02',
    controlTitle: 'Model Artifact Scanning',
    domain: 'Model Security'
  },
  {
    id: 'MDS-03.1',
    question: 'Are processes and procedures defined, implemented, enforced, and evaluated for documenting, approving, communicating, evaluating, and maintaining model documentation?',
    controlId: 'MDS-03',
    controlTitle: 'Model Documentation',
    domain: 'Model Security'
  },
  {
    id: 'MDS-03.2',
    question: 'Is the model documentation regularly reviewed and updated?',
    controlId: 'MDS-03',
    controlTitle: 'Model Documentation',
    domain: 'Model Security'
  },
  {
    id: 'MDS-04.1',
    question: 'Are baseline requirements for Model documentation established and implemented?',
    controlId: 'MDS-04',
    controlTitle: 'Model Documentation Requirements',
    domain: 'Model Security'
  },
  {
    id: 'MDS-05.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated for the validation of the model documentation aligned with the current model?',
    controlId: 'MDS-05',
    controlTitle: 'Model Documentation Validation',
    domain: 'Model Security'
  },
  {
    id: 'MDS-06.1',
    question: 'Are processes and technical measures defined, implemented, and evaluated to regularly assess adversarial threats specific to each AI model?',
    controlId: 'MDS-06',
    controlTitle: 'Adversarial Attack Analysis',
    domain: 'Model Security'
  },
  {
    id: 'MDS-07.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated for Model Hardening to mitigate relevant adversarial attacks as identified in the Threat Analysis?',
    controlId: 'MDS-07',
    controlTitle: 'Robustness against Adversarial Attack / Model Hardening',
    domain: 'Model Security'
  },
  {
    id: 'MDS-08.1',
    question: 'Are checksums regularly calculated and compared using cryptographic hashes of model checkpoints to detect unauthorized modifications?',
    controlId: 'MDS-08',
    controlTitle: 'Model Integrity Checks',
    domain: 'Model Security'
  },
  {
    id: 'MDS-08.2',
    question: 'Are these measures applied at least annually based on the level of risk, or after any change of hands?',
    controlId: 'MDS-08',
    controlTitle: 'Model Integrity Checks',
    domain: 'Model Security'
  },
  {
    id: 'MDS-09.1',
    question: 'Are models signed cryptographically and are signatures verified to ensure model provenance and ownership any time the model changes hands or is loaded from storage?',
    controlId: 'MDS-09',
    controlTitle: 'Model Signing/Ownership Verification',
    domain: 'Model Security'
  },
  {
    id: 'MDS-10.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated for continuous monitoring of model performance metrics over time?',
    controlId: 'MDS-10',
    controlTitle: 'Model Continuous Monitoring',
    domain: 'Model Security'
  },
  {
    id: 'MDS-11.1',
    question: 'Are risk-based evaluation of the model and model serving infrastructure for model failure performed?',
    controlId: 'MDS-11',
    controlTitle: 'Model Failure',
    domain: 'Model Security'
  },
  {
    id: 'MDS-11.2',
    question: 'Are measures defined and implemented to mitigate model and model serving infrastructure failures, and are they regularly evaluated throughout the lifecycle?',
    controlId: 'MDS-11',
    controlTitle: 'Model Failure',
    domain: 'Model Security'
  },
  {
    id: 'MDS-12.1',
    question: 'Are processes established to evaluate the risk associated with open models?',
    controlId: 'MDS-12',
    controlTitle: 'Open Model Risk Assessment',
    domain: 'Model Security'
  },
  {
    id: 'MDS-12.2',
    question: 'Are risk factors periodically reviewed, and is a process implemented to monitor and mitigate any determined vulnerabilities?',
    controlId: 'MDS-12',
    controlTitle: 'Open Model Risk Assessment',
    domain: 'Model Security'
  },
  {
    id: 'MDS-13.1',
    question: 'Are secure model formats and processes for AI model serialization adopted where applicable?',
    controlId: 'MDS-13',
    controlTitle: 'Secure Model Format',
    domain: 'Model Security'
  },

  // Security Incident Management, E-Discovery, & Cloud Forensics (SEF)
  {
    id: 'SEF-01.1',
    question: 'Are policies and procedures established, documented, approved, communicated, applied, evaluated, and maintained for Security Incident Management, E-Discovery, and Forensics?',
    controlId: 'SEF-01',
    controlTitle: 'Security Incident Management Policy and Procedures',
    domain: 'Security Incident Management, E-Discovery, & Cloud Forensics'
  },
  {
    id: 'SEF-01.2',
    question: 'Are policies and procedures for Security Incident Management, E-Discovery, and Forensics reviewed and updated at least annually or upon significant changes?',
    controlId: 'SEF-01',
    controlTitle: 'Security Incident Management Policy and Procedures',
    domain: 'Security Incident Management, E-Discovery, & Cloud Forensics'
  },
  {
    id: 'SEF-02.1',
    question: 'Are Service Management Policies and Procedures established, documented, approved, communicated, applied, evaluated, and maintained for the timely management of security incidents?',
    controlId: 'SEF-02',
    controlTitle: 'Service Management Policy and Procedures',
    domain: 'Security Incident Management, E-Discovery, & Cloud Forensics'
  },
  {
    id: 'SEF-02.2',
    question: 'Are Service Management Policies and Procedures reviewed and updated at least annually, or upon significant changes?',
    controlId: 'SEF-02',
    controlTitle: 'Service Management Policy and Procedures',
    domain: 'Security Incident Management, E-Discovery, & Cloud Forensics'
  },
  {
    id: 'SEF-03.1',
    question: 'Is a security incident response plan which includes a communication strategy established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'SEF-03',
    controlTitle: 'Incident Response Plans',
    domain: 'Security Incident Management, E-Discovery, & Cloud Forensics'
  },
  {
    id: 'SEF-04.1',
    question: 'Is a structured approach followed, to evaluate the effectiveness of incident response plans at planned intervals or upon significant changes?',
    controlId: 'SEF-04',
    controlTitle: 'Incident Response Testing',
    domain: 'Security Incident Management, E-Discovery, & Cloud Forensics'
  },
  {
    id: 'SEF-05.1',
    question: 'Are information security incident metrics established, monitored and reported?',
    controlId: 'SEF-05',
    controlTitle: 'Incident Response Metrics',
    domain: 'Security Incident Management, E-Discovery, & Cloud Forensics'
  },
  {
    id: 'SEF-06.1',
    question: 'Are security-related event triage processes, procedures and technical measures supporting business processes, defined, implemented and evaluated?',
    controlId: 'SEF-06',
    controlTitle: 'Event Triage Processes',
    domain: 'Security Incident Management, E-Discovery, & Cloud Forensics'
  },
  {
    id: 'SEF-07.1',
    question: 'Are processes, procedures and technical measures for security breach notifications defined and implemented?',
    controlId: 'SEF-07',
    controlTitle: 'Security Breach Notification',
    domain: 'Security Incident Management, E-Discovery, & Cloud Forensics'
  },
  {
    id: 'SEF-07.2',
    question: 'Are material security breaches and assumed security breaches reported as per applicable SLAs, laws and regulations?',
    controlId: 'SEF-07',
    controlTitle: 'Security Breach Notification',
    domain: 'Security Incident Management, E-Discovery, & Cloud Forensics'
  },
  {
    id: 'SEF-08.1',
    question: 'Are points of contact maintained for applicable regulation authorities, national and local law enforcement, and other legal jurisdictional authorities?',
    controlId: 'SEF-08',
    controlTitle: 'Points of Contact Maintenance',
    domain: 'Security Incident Management, E-Discovery, & Cloud Forensics'
  },
  {
    id: 'SEF-08.2',
    question: 'Are the points of contacts reviewed and updated at least annually?',
    controlId: 'SEF-08',
    controlTitle: 'Points of Contact Maintenance',
    domain: 'Security Incident Management, E-Discovery, & Cloud Forensics'
  },
  {
    id: 'SEF-09.1',
    question: 'Are incident categories and severity levels defined for AI systems, and response procedures determined for each, including automated response where applicable?',
    controlId: 'SEF-09',
    controlTitle: 'Incident Response',
    domain: 'Security Incident Management, E-Discovery, & Cloud Forensics'
  },

  // Supply Chain Management, Transparency, and Accountability (STA)
  {
    id: 'STA-01.1',
    question: 'Are policies and procedures for supply chain risk management established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'STA-01',
    controlTitle: 'Supply Chain Risk Management Policies and Procedures',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-01.2',
    question: 'Are the policies and procedures reviewed and updated at least annually or upon significant changes?',
    controlId: 'STA-01',
    controlTitle: 'Supply Chain Risk Management Policies and Procedures',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-02.1',
    question: 'Are policies and procedures established, documented, approved, communicated, applied, evaluated, and maintained for applying the Shared Security Responsibility Model (SSRM) within the organization?',
    controlId: 'STA-02',
    controlTitle: 'SSRM Policy and Procedures',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-02.2',
    question: 'Are policies and procedures for applying the Shared Security Responsibility Model (SSRM) within the organization reviewed and updated at least annually, or upon significant changes?',
    controlId: 'STA-02',
    controlTitle: 'SSRM Policy and Procedures',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-03.1',
    question: 'Is the SSRM applied, documented, implemented and managed throughout the supply chain?',
    controlId: 'STA-03',
    controlTitle: 'SSRM Supply Chain',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-04.1',
    question: 'Are customers provided with SSRM guidance detailing its applicability throughout the supply chain?',
    controlId: 'STA-04',
    controlTitle: 'SSRM Guidance',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-05.1',
    question: 'Is the shared ownership and applicability of all CSA AICM controls delineated according to the SSRM?',
    controlId: 'STA-05',
    controlTitle: 'SSRM Control Ownership',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-06.1',
    question: 'Are the SSRM documentation reviewed and validated?',
    controlId: 'STA-06',
    controlTitle: 'SSRM Documentation Review',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-07.1',
    question: 'Are the portions of the SSRM the organization is responsible for implemented, operated, audited, or assessed?',
    controlId: 'STA-07',
    controlTitle: 'SSRM Control Implementation',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-08.1',
    question: 'Is an inventory of all supply chain relationships maintained and developed?',
    controlId: 'STA-08',
    controlTitle: 'Supply Chain Inventory',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-09.1',
    question: 'Are risk factors associated with the supply chain relationships periodically reviewed?',
    controlId: 'STA-09',
    controlTitle: 'Supply Chain Risk Management',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-10.1',
    question: 'Are service agreements required to include mutually agreed upon provisions (Scope, security requirements, right to audit, termination, data privacy)?',
    controlId: 'STA-10',
    controlTitle: 'Primary Service and Contractual Agreement',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-11.1',
    question: 'Are supply chain agreements reviewed at least annually or upon significant changes?',
    controlId: 'STA-11',
    controlTitle: 'Supply Chain Agreement Review',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-12.1',
    question: 'Is there a process for conducting internal assessments at least annually to confirm the conformance and effectiveness of standards, policies, procedures, and SLA activities?',
    controlId: 'STA-12',
    controlTitle: 'Supply Chain Compliance Assessment',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-13.1',
    question: 'Are policies implemented requiring all service providers throughout the supply chain to comply with information security, privacy, and service level requirements?',
    controlId: 'STA-13',
    controlTitle: 'Supply Chain Service Agreement Compliance',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-14.1',
    question: 'Are the IT governance policies and procedures for organization\'s supply chain partners periodically reviewed?',
    controlId: 'STA-14',
    controlTitle: 'Supply Chain Governance Review',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-15.1',
    question: 'Is a process for conducting periodic security assessments for all organizations within the supply chain defined and implemented?',
    controlId: 'STA-15',
    controlTitle: 'Supply Chain Data Security Assessment',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },
  {
    id: 'STA-16.1',
    question: 'Are processes defined, implemented, enforced, and evaluated for establishing a Bill of Material (BOM) for the entire AI service supply chain?',
    controlId: 'STA-16',
    controlTitle: 'Service Bill of Material (BOM)',
    domain: 'Supply Chain Management, Transparency, and Accountability'
  },

  // Threat & Vulnerability Management (TVM)
  {
    id: 'TVM-01.1',
    question: 'Are policies and procedures that identify, report, and prioritize the remediation of vulnerabilities and threats established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'TVM-01',
    controlTitle: 'Threat and Vulnerability Management Policy and Procedures',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-01.2',
    question: 'Are threats and vulnerabilities policies and procedures reviewed and updated at least annually or upon significant changes?',
    controlId: 'TVM-01',
    controlTitle: 'Threat and Vulnerability Management Policy and Procedures',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-02.1',
    question: 'Are policies and procedures to protect against malware and malicious instructions established, documented, approved, communicated, applied, evaluated, and maintained?',
    controlId: 'TVM-02',
    controlTitle: 'Malware and Malicious Instructions Protection Policy and Procedures',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-02.2',
    question: 'Are malware and malicious instructions protection policies and procedures reviewed and updated at least annually or upon significant changes?',
    controlId: 'TVM-02',
    controlTitle: 'Malware and Malicious Instructions Protection Policy and Procedures',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-03.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated to enable scheduled and emergency responses to vulnerability identifications based on the identified risk?',
    controlId: 'TVM-03',
    controlTitle: 'Vulnerability Identification',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-04.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated to update detection tools, threat signatures, and indicators of compromise weekly or more frequently?',
    controlId: 'TVM-04',
    controlTitle: 'Detection Updates',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-05.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated to identify updates for applications that use third party or open source libraries?',
    controlId: 'TVM-05',
    controlTitle: 'External Library Vulnerabilities',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-06.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated for the periodic performance of penetration testing by independent third parties?',
    controlId: 'TVM-06',
    controlTitle: 'Penetration Testing',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-07.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated based on identified risks to support scheduled and emergency responses to vulnerability identification?',
    controlId: 'TVM-07',
    controlTitle: 'Vulnerability Remediation Schedule',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-08.1',
    question: 'Are risk-based models utilized to prioritize vulnerability remediation using an industry-recognized framework effectively?',
    controlId: 'TVM-08',
    controlTitle: 'Vulnerability Prioritization',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-09.1',
    question: 'Are processes defined and implemented for tracking and reporting vulnerability identification and remediation activities that include stakeholder notification?',
    controlId: 'TVM-09',
    controlTitle: 'Vulnerability Management Reporting',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-10.1',
    question: 'Are metrics established, monitored, and reported for vulnerability identification and remediation at defined intervals?',
    controlId: 'TVM-10',
    controlTitle: 'Vulnerability Management Metrics',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-11.1',
    question: 'Are processes, procedures, and technical measures to apply guardrails to the AI system defined and implemented?',
    controlId: 'TVM-11',
    controlTitle: 'Guardrails',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-11.2',
    question: 'Are guardrails continuously evaluated for changes in regulatory requirements and risk scenarios?',
    controlId: 'TVM-11',
    controlTitle: 'Guardrails',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-12.1',
    question: 'Are threat analysis processes and procedures defined, implemented, and evaluated to identify, assess, and review the threat landscape for Cloud and AI systems?',
    controlId: 'TVM-12',
    controlTitle: 'Threat Analysis and Modelling',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-12.2',
    question: 'Are threat models built according to industry best practices to inform the risk mitigation strategy?',
    controlId: 'TVM-12',
    controlTitle: 'Threat Analysis and Modelling',
    domain: 'Threat & Vulnerability Management'
  },
  {
    id: 'TVM-13.1',
    question: 'Is a risk-based method for the prioritization and mitigation of threats used, leveraging an industry-recognized framework to guide threat decision-making?',
    controlId: 'TVM-13',
    controlTitle: 'Threat Response',
    domain: 'Threat & Vulnerability Management'
  },

  // Universal Endpoint Management (UEM)
  {
    id: 'UEM-01.1',
    question: 'Are policies and procedures established, documented, approved, communicated, applied, evaluated, and maintained for all endpoints?',
    controlId: 'UEM-01',
    controlTitle: 'Endpoint Devices Policy and Procedures',
    domain: 'Universal Endpoint Management'
  },
  {
    id: 'UEM-01.2',
    question: 'Are the policies and procedures reviewed and updated at least annually or upon significant system changes?',
    controlId: 'UEM-01',
    controlTitle: 'Endpoint Devices Policy and Procedures',
    domain: 'Universal Endpoint Management'
  },
  {
    id: 'UEM-02.1',
    question: 'Is there a defined, documented, applicable and evaluated list containing approved services, applications, and sources acceptable for endpoints?',
    controlId: 'UEM-02',
    controlTitle: 'Application and Service Approval',
    domain: 'Universal Endpoint Management'
  },
  {
    id: 'UEM-03.1',
    question: 'Is a process defined and implemented to validate endpoint device compatibility with operating systems and applications?',
    controlId: 'UEM-03',
    controlTitle: 'Compatibility',
    domain: 'Universal Endpoint Management'
  },
  {
    id: 'UEM-04.1',
    question: 'Is an inventory of all endpoints used to store and process company data maintained?',
    controlId: 'UEM-04',
    controlTitle: 'Endpoint Inventory',
    domain: 'Universal Endpoint Management'
  },
  {
    id: 'UEM-05.1',
    question: 'Are processes, procedures, and technical measures defined, implemented and evaluated to enforce policies and controls for all endpoints permitted to access systems?',
    controlId: 'UEM-05',
    controlTitle: 'Endpoint Management',
    domain: 'Universal Endpoint Management'
  },
  {
    id: 'UEM-06.1',
    question: 'Are all relevant interactive-use endpoints configured to require an automatic lock screen?',
    controlId: 'UEM-06',
    controlTitle: 'Automatic Lock Screen',
    domain: 'Universal Endpoint Management'
  },
  {
    id: 'UEM-07.1',
    question: 'Are changes to endpoint operating systems, patch levels, and/or applications managed through the organizational change management process?',
    controlId: 'UEM-07',
    controlTitle: 'Operating Systems',
    domain: 'Universal Endpoint Management'
  },
  {
    id: 'UEM-08.1',
    question: 'Is information protected from unauthorized disclosure on managed endpoints with storage encryption?',
    controlId: 'UEM-08',
    controlTitle: 'Storage Encryption',
    domain: 'Universal Endpoint Management'
  },
  {
    id: 'UEM-09.1',
    question: 'Are anti-malware detection and prevention technology services configured on managed endpoints?',
    controlId: 'UEM-09',
    controlTitle: 'Anti-Malware Detection and Prevention',
    domain: 'Universal Endpoint Management'
  },
  {
    id: 'UEM-10.1',
    question: 'Are software firewalls properly configured on managed endpoints?',
    controlId: 'UEM-10',
    controlTitle: 'Software Firewall',
    domain: 'Universal Endpoint Management'
  },
  {
    id: 'UEM-11.1',
    question: 'Are managed endpoints configured with data loss prevention (DLP) technologies and rules in accordance with a risk assessment?',
    controlId: 'UEM-11',
    controlTitle: 'Data Loss Prevention',
    domain: 'Universal Endpoint Management'
  },
  {
    id: 'UEM-12.1',
    question: 'Are remote geolocation capabilities enabled for all managed mobile endpoints, according to all applicable laws and regulations?',
    controlId: 'UEM-12',
    controlTitle: 'Remote Locate',
    domain: 'Universal Endpoint Management'
  },
  {
    id: 'UEM-13.1',
    question: 'Are processes, procedures, and technical measures defined, implemented, and evaluated to enable remote company data deletion on managed endpoint devices?',
    controlId: 'UEM-13',
    controlTitle: 'Remote Wipe',
    domain: 'Universal Endpoint Management'
  },
  {
    id: 'UEM-14.1',
    question: 'Are processes, procedures, and technical and/or contractual measures defined, implemented, and evaluated to maintain proper security of third-party endpoints with access to organizational assets?',
    controlId: 'UEM-14',
    controlTitle: 'Third-Party Endpoint Security Posture',
    domain: 'Universal Endpoint Management'
  }
];
