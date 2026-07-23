/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CcmControl {
  id: string; // e.g. A&A-01
  domain: string;
  title: string;
  specification: string;
}

export const CCM_CONTROLS: CcmControl[] = [
  // Audit & Assurance (A&A)
  {
    id: "A&A-01",
    domain: "Audit & Assurance",
    title: "Audit and Assurance Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain audit and assurance policies and procedures and standards. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "A&A-02",
    domain: "Audit & Assurance",
    title: "Independent Assessments",
    specification: "Conduct independent audit and assurance assessments according to relevant standards at least annually."
  },
  {
    id: "A&A-03",
    domain: "Audit & Assurance",
    title: "Risk Based Planning Assessment",
    specification: "Perform independent audit and assurance assessments according to risk-based plans and policies, and in response to significant changes or emerging risks."
  },
  {
    id: "A&A-04",
    domain: "Audit & Assurance",
    title: "Requirements Compliance",
    specification: "Verify compliance with all relevant standards, regulations, legal/contractual, and statutory requirements applicable to the audit."
  },
  {
    id: "A&A-05",
    domain: "Audit & Assurance",
    title: "Audit Management Process",
    specification: "Define and implement an Audit Management process aligned with relevant auditing standards to support audit planning, risk analysis, security control assessment, conclusion, remediation schedules, report generation, and review of past reports and supporting evidence."
  },
  {
    id: "A&A-06",
    domain: "Audit & Assurance",
    title: "Remediation",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain a risk-based corrective action plan to remediate audit findings, regularly review and report remediation status to relevant stakeholders."
  },

  // Application & Interface Security (AIS)
  {
    id: "AIS-01",
    domain: "Application & Interface Security",
    title: "Application and Interface Security Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for application security. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "AIS-02",
    domain: "Application & Interface Security",
    title: "Application Security Baseline Requirements",
    specification: "Establish, document and maintain baseline requirements for securing applications."
  },
  {
    id: "AIS-03",
    domain: "Application & Interface Security",
    title: "Application Security Metrics",
    specification: "Define and implement technical and operational metrics in alignment with business objectives, security requirements, and compliance obligations."
  },
  {
    id: "AIS-04",
    domain: "Application & Interface Security",
    title: "Secure Application Development Lifecycle",
    specification: "Define and implement a secure SDLC process for application requirements analysis, planning, design, development, testing, deployment, and operation in accordance with security requirements."
  },
  {
    id: "AIS-05",
    domain: "Application & Interface Security",
    title: "Application Security Testing",
    specification: "Implement a testing strategy, including criteria for acceptance of new information systems, upgrades and new versions, which provides application security assurance and maintains compliance while meeting organizational delivery goals. Automate when applicable and possible."
  },
  {
    id: "AIS-06",
    domain: "Application & Interface Security",
    title: "Secure Application Deployment",
    specification: "Establish and implement strategies and capabilities for secure, standardized, and compliant application deployment. Automate where possible."
  },
  {
    id: "AIS-07",
    domain: "Application & Interface Security",
    title: "Application Vulnerability Remediation",
    specification: "Define and implement a process to remediate application security vulnerabilities, automating remediation when possible."
  },
  {
    id: "AIS-08",
    domain: "Application & Interface Security",
    title: "API Security",
    specification: "Define and implement processes, procedures, and technical measures to secure APIs. Review and update for any improvements at least annually or upon significant changes."
  },

  // Business Continuity Management and Operational Resilience (BCR)
  {
    id: "BCR-01",
    domain: "Business Continuity Management and Operational Resilience",
    title: "Business Continuity Management Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain business continuity management and operational resilience policies and procedures. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "BCR-02",
    domain: "Business Continuity Management and Operational Resilience",
    title: "Risk Assessment and Impact Analysis",
    specification: "Determine the impact of business disruptions and risks to establish criteria for developing business continuity and operational resilience strategies and capabilities. Review and update the risk assessment and impact analysis at least annually or upon significant changes."
  },
  {
    id: "BCR-03",
    domain: "Business Continuity Management and Operational Resilience",
    title: "Business Continuity Strategy",
    specification: "Establish strategies to reduce the impact of business disruptions, and improve resiliency and recovery from business disruptions."
  },
  {
    id: "BCR-04",
    domain: "Business Continuity Management and Operational Resilience",
    title: "Business Continuity Planning",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain a business continuity plan based on the results of the operational resilience strategies and capabilities."
  },
  {
    id: "BCR-05",
    domain: "Business Continuity Management and Operational Resilience",
    title: "Documentation",
    specification: "Develop, identify, and acquire documentation, both internally and from external parties, that is relevant to support the business continuity and operational resilience plans. Make the documentation available to authorized stakeholders and review at least annually or upon significant changes."
  },
  {
    id: "BCR-06",
    domain: "Business Continuity Management and Operational Resilience",
    title: "Business Continuity Exercises",
    specification: "Exercise and test business continuity and operational resilience plans at least annually or upon significant changes."
  },
  {
    id: "BCR-07",
    domain: "Business Continuity Management and Operational Resilience",
    title: "Communication",
    specification: "Establish and maintain communication channels with all relevant stakeholders in the course of business continuity and resilience procedures."
  },
  {
    id: "BCR-08",
    domain: "Business Continuity Management and Operational Resilience",
    title: "Backup",
    specification: "Periodically perform backups. Ensure the confidentiality, integrity and availability of the backup, and verify restoration from backup for resiliency."
  },
  {
    id: "BCR-09",
    domain: "Business Continuity Management and Operational Resilience",
    title: "Disaster Response Plan",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain a disaster response plan to recover from natural and man-made disasters. Update the plan at least annually or upon significant changes."
  },
  {
    id: "BCR-10",
    domain: "Business Continuity Management and Operational Resilience",
    title: "Response Plan Exercise",
    specification: "Exercise the disaster response plan annually or upon significant changes, including if possible, the participation of local emergency authorities."
  },
  {
    id: "BCR-11",
    domain: "Business Continuity Management and Operational Resilience",
    title: "Equipment Redundancy",
    specification: "Supplement business-critical equipment with both locally redundant and geographically dispersed equipment located at a reasonable minimum distance in accordance with applicable industry standards."
  },

  // Change Control and Configuration Management (CCC)
  {
    id: "CCC-01",
    domain: "Change Control and Configuration Management",
    title: "Change Management Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for managing the risks associated with applying changes to assets owned, controlled or used by the organization. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "CCC-02",
    domain: "Change Control and Configuration Management",
    title: "Quality Testing",
    specification: "Establish, maintain and implement a defined quality change control, approval and testing process incorporating baselines, testing, and release standards."
  },
  {
    id: "CCC-03",
    domain: "Change Control and Configuration Management",
    title: "Change Management Technology",
    specification: "Implement a change management procedure to manage the risks associated with applying changes to assets, owned, controlled or used by the organization."
  },
  {
    id: "CCC-04",
    domain: "Change Control and Configuration Management",
    title: "Unauthorized Change Protection",
    specification: "Implement and enforce a procedure to authorize the addition, removal, update, and management of assets that are owned, controlled or used by the organization."
  },
  {
    id: "CCC-05",
    domain: "Change Control and Configuration Management",
    title: "Change Agreements",
    specification: "Include provisions limiting changes directly impacting service customers owned environments (tenants) to explicitly authorized requests within service level agreements."
  },
  {
    id: "CCC-06",
    domain: "Change Control and Configuration Management",
    title: "Change Management Baseline",
    specification: "Establish, document and implement change management and configuration baselines for all relevant authorized changes on organization assets. Review and update the baselines at least annually or upon significant changes."
  },
  {
    id: "CCC-07",
    domain: "Change Control and Configuration Management",
    title: "Detection of Baseline Deviation",
    specification: "Implement detection measures with proactive notification in case of changes deviating from the established baseline."
  },
  {
    id: "CCC-08",
    domain: "Change Control and Configuration Management",
    title: "Exception Management",
    specification: "Implement a procedure for the management of exceptions, including emergencies, in the change and configuration process. Align the procedure with the requirements of GRC-04: Policy Exception Process."
  },
  {
    id: "CCC-09",
    domain: "Change Control and Configuration Management",
    title: "Change Restoration",
    specification: "Define and implement a process to proactively roll back changes to a previous known good state in case of errors or security concerns."
  },

  // Cryptography, Encryption & Key Management (CEK)
  {
    id: "CEK-01",
    domain: "Cryptography, Encryption & Key Management",
    title: "Encryption and Key Management Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for Cryptography, Encryption and Key Management. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "CEK-02",
    domain: "Cryptography, Encryption & Key Management",
    title: "CEK Roles and Responsibilities",
    specification: "Define and implement cryptographic, encryption and key management roles and responsibilities."
  },
  {
    id: "CEK-03",
    domain: "Cryptography, Encryption & Key Management",
    title: "Data Protection",
    specification: "Provide data protection at-rest, in-transit, and where applicable, in-use by using cryptographic libraries certified to approved standards."
  },
  {
    id: "CEK-04",
    domain: "Cryptography, Encryption & Key Management",
    title: "Encryption Algorithm",
    specification: "Utilize encryption algorithms following industry standards for protecting data, based on the data classification and associated risks."
  },
  {
    id: "CEK-05",
    domain: "Cryptography, Encryption & Key Management",
    title: "Encryption Change Management",
    specification: "Establish a standard change management procedure, to accommodate changes from internal and external sources, for review, approval, implementation and communication of cryptographic, encryption and key management technology changes."
  },
  {
    id: "CEK-06",
    domain: "Cryptography, Encryption & Key Management",
    title: "Encryption Change Cost Benefit Analysis",
    specification: "Manage and adopt changes to cryptography-, encryption-, and key management-related systems (including policies and procedures) that fully account for downstream effects of proposed changes, including residual risk, cost, and benefits analysis."
  },
  {
    id: "CEK-07",
    domain: "Cryptography, Encryption & Key Management",
    title: "Encryption Risk Management",
    specification: "Establish and maintain an encryption and key management risk program that includes provisions for risk assessment, risk treatment, risk context, monitoring, and feedback."
  },
  {
    id: "CEK-08",
    domain: "Cryptography, Encryption & Key Management",
    title: "Service Customer Key Management Capability",
    specification: "Service providers must provide the capability for service customers to manage their own data encryption keys."
  },
  {
    id: "CEK-09",
    domain: "Cryptography, Encryption & Key Management",
    title: "Encryption and Key Management Audit",
    specification: "Audit encryption and key management systems, policies, and processes with a frequency that is proportional to the risk exposure of the system with audit occurring preferably continuously but at least annually and upon any security event(s)."
  },
  {
    id: "CEK-10",
    domain: "Cryptography, Encryption & Key Management",
    title: "Key Generation",
    specification: "Generate Cryptographic keys using industry accepted cryptographic libraries specifying the algorithm strength and the random number generator used."
  },
  {
    id: "CEK-11",
    domain: "Cryptography, Encryption & Key Management",
    title: "Key Purpose",
    specification: "Manage cryptographic secret and private keys that are provisioned for a unique purpose."
  },
  {
    id: "CEK-12",
    domain: "Cryptography, Encryption & Key Management",
    title: "Key Rotation",
    specification: "Rotate cryptographic keys in accordance with the calculated cryptoperiod, which includes provisions for considering the risk of information disclosure and legal and regulatory requirements."
  },
  {
    id: "CEK-13",
    domain: "Cryptography, Encryption & Key Management",
    title: "Key Revocation",
    specification: "Define, implement and evaluate processes, procedures and technical measures to revoke and remove cryptographic keys prior to the end of its established cryptoperiod, when a key is compromised, or an entity is no longer part of the organization, which include provisions for legal and regulatory requirements."
  },
  {
    id: "CEK-14",
    domain: "Cryptography, Encryption & Key Management",
    title: "Key Destruction",
    specification: "Define, implement, and evaluate processes, procedures, and technical measures to securely destroy cryptographic keys when they are no longer needed, which include provisions for legal and regulatory requirements."
  },
  {
    id: "CEK-15",
    domain: "Cryptography, Encryption & Key Management",
    title: "Key Activation",
    specification: "Define, implement and evaluate processes, procedures and technical measures to create keys in a pre-activated state when they have been generated but not authorized for use, which include provisions for legal and regulatory requirements."
  },
  {
    id: "CEK-16",
    domain: "Cryptography, Encryption & Key Management",
    title: "Key Suspension",
    specification: "Define, implement and evaluate processes, procedures and technical measures to monitor, review and approve key transitions from any state to/from suspension, which include provisions for legal and regulatory requirements."
  },
  {
    id: "CEK-17",
    domain: "Cryptography, Encryption & Key Management",
    title: "Key Deactivation",
    specification: "Define, implement and evaluate processes, procedures and technical measures to deactivate keys at the time of their expiration date, which include provisions for legal and regulatory requirements."
  },
  {
    id: "CEK-18",
    domain: "Cryptography, Encryption & Key Management",
    title: "Key Archival",
    specification: "Define, implement and evaluate processes, procedures and technical measures to manage archived keys in a secure repository requiring least privilege access, which include provisions for legal and regulatory requirements."
  },
  {
    id: "CEK-19",
    domain: "Cryptography, Encryption & Key Management",
    title: "Key Compromise",
    specification: "Define, implement and evaluate processes, procedures and technical measures to use compromised keys to encrypt information only in controlled circumstance, and thereafter exclusively for decrypting data and never for encrypting data, which include provisions for legal and regulatory requirements."
  },
  {
    id: "CEK-20",
    domain: "Cryptography, Encryption & Key Management",
    title: "Key Recovery",
    specification: "Define, implement and evaluate processes, procedures and technical measures to assess the risk to operational continuity versus the risk of the keying material and the information it protects being exposed if control of the keying material is lost, which include provisions for legal and regulatory requirements."
  },
  {
    id: "CEK-21",
    domain: "Cryptography, Encryption & Key Management",
    title: "Key Inventory Management",
    specification: "Define, implement and evaluate processes, procedures and technical measures in order for the key management system to track and report all cryptographic materials and changes in status, which include provisions for legal and regulatory requirements."
  },

  // Datacenter Security (DCS)
  {
    id: "DCS-01",
    domain: "Datacenter Security",
    title: "Physical and Environmental Security Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for physical and environmental security. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "DCS-02",
    domain: "Datacenter Security",
    title: "Off-Site Equipment Disposal Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for the secure disposal of equipment used outside the organization's premises. If the equipment is not physically destroyed a data destruction procedure that renders recovery of information impossible must be applied. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "DCS-03",
    domain: "Datacenter Security",
    title: "Off-Site Transfer Authorization Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for the relocation or transfer of hardware, software, or data/information to an offsite or alternate location. The relocation or transfer request requires the written or cryptographically verifiable authorization. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "DCS-04",
    domain: "Datacenter Security",
    title: "Secure Area Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for maintaining a safe and secure working environment in offices, rooms, and facilities. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "DCS-05",
    domain: "Datacenter Security",
    title: "Secure Media Transportation Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for the secure transportation of physical media. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "DCS-06",
    domain: "Datacenter Security",
    title: "Assets Classification",
    specification: "Classify and document the physical, and logical assets (e.g., applications) based on the organizational business risk. Review and update the assets' classification at least annually, or upon significant changes."
  },
  {
    id: "DCS-07",
    domain: "Datacenter Security",
    title: "Assets Cataloguing and Tracking",
    specification: "Catalogue and track all relevant physical and logical assets located at all of the service provider's sites within a secured system. Review and update the catalogue at least annually or upon significant changes."
  },
  {
    id: "DCS-08",
    domain: "Datacenter Security",
    title: "Controlled Physical Access Points",
    specification: "Design and implement physical security perimeters to safeguard personnel, data, and information systems."
  },
  {
    id: "DCS-09",
    domain: "Datacenter Security",
    title: "Equipment Identification",
    specification: "Use equipment identification as a method for connection authentication."
  },
  {
    id: "DCS-10",
    domain: "Datacenter Security",
    title: "Secure Area Authorization",
    specification: "Allow only authorized personnel access to secure areas, with all ingress and egress points restricted, documented, and monitored by physical access control mechanisms. Retain access control records on a periodic basis as deemed appropriate by the organization."
  },
  {
    id: "DCS-11",
    domain: "Datacenter Security",
    title: "Surveillance System",
    specification: "Implement, maintain, and operate datacenter surveillance systems at the external perimeter and at all the ingress and egress points to detect unauthorized ingress and egress attempts."
  },
  {
    id: "DCS-12",
    domain: "Datacenter Security",
    title: "Adverse Event Response Training",
    specification: "Train datacenter personnel to safely manage adverse events, including but not limited to unauthorized ingress and egress attempts."
  },
  {
    id: "DCS-13",
    domain: "Datacenter Security",
    title: "Cabling Security",
    specification: "Define, implement and evaluate processes, procedures and technical measures that ensure a risk-based protection of power and telecommunication cables from a threat of interception, interference or damage at all facilities, offices and rooms."
  },
  {
    id: "DCS-14",
    domain: "Datacenter Security",
    title: "Environmental Systems",
    specification: "Implement and maintain data center environmental control systems that monitor, maintain and test for continual effectiveness the temperature and humidity conditions within accepted industry standards."
  },
  {
    id: "DCS-15",
    domain: "Datacenter Security",
    title: "Secure Utilities",
    specification: "Secure, monitor, maintain, and test utilities services for continual effectiveness at planned intervals."
  },
  {
    id: "DCS-16",
    domain: "Datacenter Security",
    title: "Equipment Location",
    specification: "Keep business-critical equipment away from locations subject to high probability for environmental risk events."
  },
  {
    id: "DCS-17",
    domain: "Datacenter Security",
    title: "Datacenter Metrics",
    specification: "Establish, monitor and report datacenter security metrics to secure data center assets and services."
  },
  {
    id: "DCS-18",
    domain: "Datacenter Security",
    title: "Datacenter Operations Resilience",
    specification: "Define, implement and evaluate processes, procedures and technical measures to ensure continuous operations."
  },

  // Data Security and Privacy Lifecycle Management (DSP)
  {
    id: "DSP-01",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Security and Privacy Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for the preparation, classification, protection and handling of data throughout its lifecycle, and according to all applicable laws and regulations, standards, and risk level. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "DSP-02",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Secure Disposal",
    specification: "Apply industry accepted methods for the secure disposal of data from storage media such that data is not recoverable by any forensic means."
  },
  {
    id: "DSP-03",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Data Inventory",
    specification: "Create and maintain a data inventory, at least for any sensitive, regulated and personal data. Review and update the inventory at least annually or upon significant changes."
  },
  {
    id: "DSP-04",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Data Classification",
    specification: "Classify data according to its type, criticality and sensitivity level."
  },
  {
    id: "DSP-05",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Data Flow Documentation",
    specification: "Create data flow documentation to identify what data is processed, stored or transmitted where. Review data flow documentation at defined intervals, at least annually, or upon significant changes."
  },
  {
    id: "DSP-06",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Data Ownership and Stewardship",
    specification: "Document ownership and stewardship of all relevant documented personal and sensitive data. Perform review at least annually."
  },
  {
    id: "DSP-07",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Data Protection by Design and Default",
    specification: "Develop systems, products, and business practices based upon a principle of security by design and industry best practices."
  },
  {
    id: "DSP-08",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Data Privacy by Design and Default",
    specification: "Develop systems, products, and business practices based upon a principle of privacy by design and industry best practices. Ensure that systems' privacy settings are configured by default, according to all applicable laws and regulations."
  },
  {
    id: "DSP-09",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Data Protection Impact Assessment",
    specification: "Conduct a Data Protection Impact Assessment (DPIA) to evaluate the origin, nature, particularity and severity of the risks upon the processing of personal data, according to any applicable laws, regulations and industry best practices."
  },
  {
    id: "DSP-10",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Sensitive Data Transfer",
    specification: "Define, implement and evaluate processes, procedures and technical measures that ensure any transfer of personal or sensitive data is protected from unauthorized access and only processed within scope as permitted by the respective laws and regulations."
  },
  {
    id: "DSP-11",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Personal Data Access, Reversal, Rectification and Deletion",
    specification: "Define and implement, processes, procedures and technical measures to enable data subjects to request access to, modification, or deletion of their personal data, according to any applicable laws and regulations."
  },
  {
    id: "DSP-12",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Limitation of Purpose in Personal Data Processing",
    specification: "Define, implement and evaluate processes, procedures and technical measures to ensure that personal data is processed according to any applicable laws and regulations and for the purposes declared to the data subject."
  },
  {
    id: "DSP-13",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Personal Data Sub-processing",
    specification: "Define, implement and evaluate processes, procedures and technical measures for the transfer and sub-processing of personal data within the service supply chain, according to any applicable laws and regulations."
  },
  {
    id: "DSP-14",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Disclosure of Data Sub-processors",
    specification: "Define, implement and evaluate processes, procedures and technical measures to disclose the details of any personal or sensitive data access by sub-processors to the data owner prior to initiation of that processing."
  },
  {
    id: "DSP-15",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Limitation of Production Data Use",
    specification: "Obtain authorization from data owners, and manage associated risk before replicating or using production data in non-production environments."
  },
  {
    id: "DSP-16",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Data Retention and Deletion",
    specification: "Data retention, archiving and deletion is managed in accordance with business requirements, applicable laws and regulations."
  },
  {
    id: "DSP-17",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Sensitive Data Protection",
    specification: "Define and implement, processes, procedures and technical measures to protect sensitive data throughout it's lifecycle."
  },
  {
    id: "DSP-18",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Disclosure Notification",
    specification: "The service provider must implement and describe to service customers the procedure to manage and respond to requests for disclosure of Personal Data by Law Enforcement Authorities according to applicable laws and regulations."
  },
  {
    id: "DSP-19",
    domain: "Data Security and Privacy Lifecycle Management",
    title: "Data Location",
    specification: "Define and implement, processes, procedures and technical measures to specify and document the physical locations of data, including any locations in which data is processed or backed up."
  },

  // Governance, Risk and Compliance (GRC)
  {
    id: "GRC-01",
    domain: "Governance, Risk and Compliance",
    title: "Governance Program Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for an information governance program, which is sponsored by the leadership of the organization. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "GRC-02",
    domain: "Governance, Risk and Compliance",
    title: "Risk Management Program",
    specification: "Establish and maintain a formal, documented, and leadership-sponsored Enterprise Risk Management (ERM) program that includes policies and procedures for identification, evaluation, ownership, treatment, and acceptance of risks."
  },
  {
    id: "GRC-03",
    domain: "Governance, Risk and Compliance",
    title: "Organizational Policy Reviews",
    specification: "Review all relevant organizational policies and associated procedures at least annually or when a substantial change occurs within the organization."
  },
  {
    id: "GRC-04",
    domain: "Governance, Risk and Compliance",
    title: "Policy Exception Process",
    specification: "Establish and follow an approved exception process as mandated by the governance program whenever a deviation from an established policy occurs."
  },
  {
    id: "GRC-05",
    domain: "Governance, Risk and Compliance",
    title: "Information Security Program",
    specification: "Develop and implement an Information Security Program, which includes programs for all the relevant domains of the CCM."
  },
  {
    id: "GRC-06",
    domain: "Governance, Risk and Compliance",
    title: "Governance Responsibility Model",
    specification: "Define and document roles and responsibilities for planning, implementing, operating, assessing, and improving governance programs."
  },
  {
    id: "GRC-07",
    domain: "Governance, Risk and Compliance",
    title: "Information System Regulatory Mapping",
    specification: "Identify and document all relevant standards, regulations, legal/contractual, and statutory requirements, which are applicable to your organization. Review at least annually or upon significant changes."
  },
  {
    id: "GRC-08",
    domain: "Governance, Risk and Compliance",
    title: "Special Interest Groups",
    specification: "Establish and maintain contact with cloud-related special interest groups and other relevant entities in line with business context."
  },

  // Human Resources (HRS)
  {
    id: "HRS-01",
    domain: "Human Resources",
    title: "Background Screening Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for background verification of all new employees (including but not limited to remote employees, contractors, and third parties) according to local laws, regulations, ethics, and contractual constraints and proportional to the data classification to be accessed, the business requirements, and acceptable risk. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "HRS-02",
    domain: "Human Resources",
    title: "Acceptable Use of Technology Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for defining allowances and conditions for the acceptable use of organizationally-owned or managed assets. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "HRS-03",
    domain: "Human Resources",
    title: "Clean Desk Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures that require unattended workspaces to not have openly visible confidential data. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "HRS-04",
    domain: "Human Resources",
    title: "Remote and Home Working Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures to protect information accessed, processed or stored at remote sites and locations. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "HRS-05",
    domain: "Human Resources",
    title: "Asset returns",
    specification: "Establish and document procedures for the return of organization-owned assets by terminated employees, contractors and third parties."
  },
  {
    id: "HRS-06",
    domain: "Human Resources",
    title: "Employment Termination",
    specification: "Establish, document, and communicate to all relevant personnel the procedures outlining the roles and responsibilities concerning changes in employment."
  },
  {
    id: "HRS-07",
    domain: "Human Resources",
    title: "Employment Agreement Process",
    specification: "Employees sign the employee agreement prior to being granted access to organizational information systems, resources and assets."
  },
  {
    id: "HRS-08",
    domain: "Human Resources",
    title: "Employment Agreement Content",
    specification: "The organization includes within the employment agreements provisions and/or terms for adherence to established information governance and security policies."
  },
  {
    id: "HRS-09",
    domain: "Human Resources",
    title: "Personnel Roles and Responsibilities",
    specification: "Establish, document and communicate roles and responsibilities of employees, as they relate to information assets' security and privacy."
  },
  {
    id: "HRS-10",
    domain: "Human Resources",
    title: "Non-Disclosure Agreements",
    specification: "Identify, document, and review, at planned intervals, requirements for non-disclosure/confidentiality agreements reflecting the organization's needs for the protection of data and operational details."
  },
  {
    id: "HRS-11",
    domain: "Human Resources",
    title: "Security Awareness Training",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain a security awareness training program for all employees of the organization and provide regular training updates."
  },
  {
    id: "HRS-12",
    domain: "Human Resources",
    title: "Personal and Sensitive Data Awareness and Training",
    specification: "Provide employees with access to sensitive organizational and personal data with appropriate security awareness training and regular updates in organizational procedures, processes, and policies relating to their professional function relative to the organization."
  },
  {
    id: "HRS-13",
    domain: "Human Resources",
    title: "Compliance User Responsibility",
    specification: "Make employees aware of their roles and responsibilities for maintaining awareness and compliance with established policies and procedures and applicable legal, statutory, or regulatory compliance obligations."
  },

  // Identity & Access Management (IAM)
  {
    id: "IAM-01",
    domain: "Identity & Access Management",
    title: "Identity and Access Management Policy and Procedures",
    specification: "Establish, document, approve, communicate, implement, apply, evaluate, and maintain policies and procedures for identity and access management. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "IAM-02",
    domain: "Identity & Access Management",
    title: "Credentials Management Policy and Procedures",
    specification: "Establish, document, approve, communicate, implement, apply, evaluate, and maintain policies and procedures for the management of authentication credentials, including passwords. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "IAM-03",
    domain: "Identity & Access Management",
    title: "Identity Inventory",
    specification: "Manage, store, and regularly review the inventory of identities, and monitor their level of access."
  },
  {
    id: "IAM-04",
    domain: "Identity & Access Management",
    title: "Separation of Duties",
    specification: "Employ the separation of duties principle when implementing information system access."
  },
  {
    id: "IAM-05",
    domain: "Identity & Access Management",
    title: "Least Privilege",
    specification: "Employ the least privilege principle when implementing information system access."
  },
  {
    id: "IAM-06",
    domain: "Identity & Access Management",
    title: "Access Provisioning",
    specification: "Define and implement an identity access provisioning process which authorizes, records, and communicates access changes to data and assets."
  },
  {
    id: "IAM-07",
    domain: "Identity & Access Management",
    title: "Access Changes and Revocation",
    specification: "De-provision or modify identity access in a timely manner."
  },
  {
    id: "IAM-08",
    domain: "Identity & Access Management",
    title: "Access Review",
    specification: "Review and revalidate identity access for least privilege and separation of duties with a frequency that is commensurate with organizational risk tolerance, and at least annually or upon significant changes."
  },
  {
    id: "IAM-09",
    domain: "Identity & Access Management",
    title: "Segregation of Privileged Access Roles",
    specification: "Define, implement and evaluate processes, procedures and technical measures for the segregation of privileged access roles."
  },
  {
    id: "IAM-10",
    domain: "Identity & Access Management",
    title: "Management of Privileged Access Roles",
    specification: "Define and implement an access process to ensure privileged access roles and rights are granted for a time limited period, and implement procedures to prevent the accumulation of segregated privileged access."
  },
  {
    id: "IAM-11",
    domain: "Identity & Access Management",
    title: "Service Customers Approval for Agreed Privileged Access Roles",
    specification: "Define, implement and evaluate processes and procedures for service customers to participate, where applicable, in the granting of access for agreed, high risk (as defined by the organizational risk assessment) privileged access roles."
  },
  {
    id: "IAM-12",
    domain: "Identity & Access Management",
    title: "Unique Identities",
    specification: "Define, implement and evaluate processes, procedures and technical measures that ensure identities' activities are identifiable through uniquely associated IDs."
  },
  {
    id: "IAM-13",
    domain: "Identity & Access Management",
    title: "Strong Authentication",
    specification: "Define, implement and evaluate processes, procedures and technical measures for authenticating access to systems, application and data assets, including multifactor authentication for at least privileged user and sensitive data access. Adopt digital certificates or alternatives which achieve an equivalent level of security for system identities."
  },
  {
    id: "IAM-14",
    domain: "Identity & Access Management",
    title: "Credentials Management",
    specification: "Define, implement and evaluate processes, procedures and technical measures for the secure management of authentication credentials, including passwords."
  },
  {
    id: "IAM-15",
    domain: "Identity & Access Management",
    title: "Authorization Mechanisms",
    specification: "Define, implement and evaluate processes, procedures and technical measures to verify access to data and system functions is authorized."
  },

  // Interoperability & Portability (IPY)
  {
    id: "IPY-01",
    domain: "Interoperability & Portability",
    title: "Interoperability and Portability Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for interoperability and portability including requirements for: a. Communications between application interfaces b. Information processing interoperability c. Application development portability d. Information/Data exchange, usage, portability, integrity, and persistence Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "IPY-02",
    domain: "Interoperability & Portability",
    title: "Application Interface Availability",
    specification: "Provide application interface(s) to service customers so that they programmatically retrieve their data to enable interoperability and portability."
  },
  {
    id: "IPY-03",
    domain: "Interoperability & Portability",
    title: "Secure Interoperability and Portability Management",
    specification: "Implement cryptographically secure network protocols for the management, import and export of data, according to industry standards."
  },
  {
    id: "IPY-04",
    domain: "Interoperability & Portability",
    title: "Data Portability Contractual Obligations",
    specification: "Agreements must include provisions specifying service customers' access to data upon contract termination and will include: a. Data format b. Length of time the data will be stored c. Scope of the data retained and made available to the service customers d. Data deletion policy"
  },

  // Infrastructure Security (I&S)
  {
    id: "I&S-01",
    domain: "Infrastructure Security",
    title: "Infrastructure and Virtualization Security Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for infrastructure and virtualization security. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "I&S-02",
    domain: "Infrastructure Security",
    title: "Capacity and Resource Planning",
    specification: "Plan and monitor the availability, quality, and adequate capacity of resources in order to deliver the required system performance as determined by the business."
  },
  {
    id: "I&S-03",
    domain: "Infrastructure Security",
    title: "Network Security",
    specification: "Monitor, encrypt and restrict communications between environments, services, and applications to only authenticated and authorized connections, as justified by the business. Review these configurations at least annually, and support them by a documented justification of all allowed services, protocols, ports, and compensating controls."
  },
  {
    id: "I&S-04",
    domain: "Infrastructure Security",
    title: "OS Hardening and Base Controls",
    specification: "Harden host and guest OS, hypervisor or infrastructure control plane according to their respective best practices, and supported by technical controls, as part of a security baseline."
  },
  {
    id: "I&S-05",
    domain: "Infrastructure Security",
    title: "Production and Non-Production Environments",
    specification: "Separate production and non-production environments to reduce the risk of sensitive production data being used in non-production environments. Production data is sanitized or protected before any authorized non-production use."
  },
  {
    id: "I&S-06",
    domain: "Infrastructure Security",
    title: "Segmentation and Segregation",
    specification: "Design, develop, deploy and configure applications and infrastructures such that service customer (tenant) access is appropriately segmented and segregated, monitored and restricted."
  },
  {
    id: "I&S-07",
    domain: "Infrastructure Security",
    title: "Migration to Cloud Environments",
    specification: "Use secure and encrypted communication channels when migrating servers, services, applications, or data to cloud environments. Such channels must include only up-to-date and approved protocols."
  },
  {
    id: "I&S-08",
    domain: "Infrastructure Security",
    title: "Network Architecture Documentation",
    specification: "Identify and document high-risk environments based on data sensitivity, threat exposure, and business impact."
  },
  {
    id: "I&S-09",
    domain: "Infrastructure Security",
    title: "Network Defense",
    specification: "Define, implement and evaluate processes, procedures and defense-in-depth techniques for protection, detection, and timely response to network-based attacks."
  },

  // Logging and Monitoring (LOG)
  {
    id: "LOG-01",
    domain: "Logging and Monitoring",
    title: "Logging and Monitoring Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for logging and monitoring. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "LOG-02",
    domain: "Logging and Monitoring",
    title: "Audit Logs Protection",
    specification: "Define, implement and evaluate processes, procedures and technical measures to ensure the security and retention of audit logs."
  },
  {
    id: "LOG-03",
    domain: "Logging and Monitoring",
    title: "Security Monitoring and Alerting",
    specification: "Identify and monitor security-related events within applications and the underlying infrastructure. Define and implement a system to generate alerts to responsible stakeholders based on such events and corresponding metrics."
  },
  {
    id: "LOG-04",
    domain: "Logging and Monitoring",
    title: "Audit Logs Access and Accountability",
    specification: "Restrict audit log access to authorized identities and maintain records of that access."
  },
  {
    id: "LOG-05",
    domain: "Logging and Monitoring",
    title: "Audit Logs Monitoring and Response",
    specification: "Implement and maintain capabilities to correlate and monitor security audit logs for the detection of suspicious or anomalous activity that deviates from typical or expected patterns. Establish and follow a defined process to review and take appropriate and timely actions on detected anomalies."
  },
  {
    id: "LOG-06",
    domain: "Logging and Monitoring",
    title: "Clock Synchronization",
    specification: "Use a reliable time source across all relevant information processing systems."
  },
  {
    id: "LOG-07",
    domain: "Logging and Monitoring",
    title: "Logging Scope",
    specification: "Establish, document and implement which information meta/data system events should be logged. Review and update the scope at least annually or whenever there is a change in the threat environment, and as per relevant regulatory requirements."
  },
  {
    id: "LOG-08",
    domain: "Logging and Monitoring",
    title: "Audit Logs Sanitization",
    specification: "Define, implement and evaluate technical measures for service customers to detect and scrub or tokenize sensitive data from logs to prevent unauthorized exposure, as per applicable laws and regulations."
  },
  {
    id: "LOG-09",
    domain: "Logging and Monitoring",
    title: "Log Records",
    specification: "Generate audit records containing relevant security information."
  },
  {
    id: "LOG-10",
    domain: "Logging and Monitoring",
    title: "Audit Records Protection",
    specification: "Protect audit records from unauthorized access, modification, and deletion."
  },
  {
    id: "LOG-11",
    domain: "Logging and Monitoring",
    title: "Encryption Monitoring and Reporting",
    specification: "Establish and maintain a monitoring and internal reporting capability over the operations of cryptographic, encryption and key management policies, processes, procedures, and controls."
  },
  {
    id: "LOG-12",
    domain: "Logging and Monitoring",
    title: "Transaction/Activity Logging",
    specification: "Log and monitor key lifecycle management events to enable auditing and reporting on usage of cryptographic keys."
  },
  {
    id: "LOG-13",
    domain: "Logging and Monitoring",
    title: "Access Control Logs",
    specification: "Monitor and log physical access using an auditable access control system."
  },
  {
    id: "LOG-14",
    domain: "Logging and Monitoring",
    title: "Failures and Anomalies Reporting",
    specification: "Define, implement and evaluate processes, procedures and technical measures for the reporting of anomalies and failures of the monitoring system and provide immediate notification to the accountable party."
  },

  // Security Incident Management, E-Discovery, & Cloud Forensics (SEF)
  {
    id: "SEF-01",
    domain: "Security Incident Management, E-Discovery, & Cloud Forensics",
    title: "Security Incident Management Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for Security Incident Management, E-Discovery, and Cloud Forensics. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "SEF-02",
    domain: "Security Incident Management, E-Discovery, & Cloud Forensics",
    title: "Service Management Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for the timely management of security incidents. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "SEF-03",
    domain: "Security Incident Management, E-Discovery, & Cloud Forensics",
    title: "Incident Response Plans",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain a security incident response plan, which includes but is not limited to: a communication strategy for notifying relevant internal departments, impacted service customers, and other business critical relationships (such as supply-chain) that may be impacted."
  },
  {
    id: "SEF-04",
    domain: "Security Incident Management, E-Discovery, & Cloud Forensics",
    title: "Incident Response Testing",
    specification: "Exercise the incident response plans at planned intervals or upon significant changes."
  },
  {
    id: "SEF-05",
    domain: "Security Incident Management, E-Discovery, & Cloud Forensics",
    title: "Incident Response Metrics",
    specification: "Establish, monitor and report information security incident metrics."
  },
  {
    id: "SEF-06",
    domain: "Security Incident Management, E-Discovery, & Cloud Forensics",
    title: "Event Triage Processes",
    specification: "Define, implement and evaluate processes, procedures and technical measures supporting business processes to triage security-related events."
  },
  {
    id: "SEF-07",
    domain: "Security Incident Management, E-Discovery, & Cloud Forensics",
    title: "Incident Management and Response",
    specification: "Define, implement and evaluate processes, procedures and technical measures for timely and effective response to security incidents in accordance with incident categories and severity levels. Review, update, and test processes and procedures at least annually."
  },
  {
    id: "SEF-08",
    domain: "Security Incident Management, E-Discovery, & Cloud Forensics",
    title: "Security Breach Notification",
    specification: "Define and implement processes, procedures and technical measures for security breach notifications. Report material security breaches including any relevant supply chain breaches, as per applicable SLAs, laws and regulations."
  },
  {
    id: "SEF-09",
    domain: "Security Incident Management, E-Discovery, & Cloud Forensics",
    title: "Incident Records Management",
    specification: "Establish and maintain a secure repository of security incident records. Regularly review the incident records to identify patterns, root causes, and systemic vulnerabilities, and implement relevant corrective measures."
  },
  {
    id: "SEF-10",
    domain: "Security Incident Management, E-Discovery, & Cloud Forensics",
    title: "Points of Contact Maintenance",
    specification: "Maintain points of contact for applicable regulation authorities, national and local law enforcement, and other legal jurisdictional authorities. Review and update the points of contact at least annually."
  },

  // Supply Chain Management, Transparency, and Accountability (STA)
  {
    id: "STA-01",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "Supply Chain Risk Management Policies and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate, and maintain policies and procedures for supply chain risk management. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "STA-02",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "SSRM Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for the application of the Shared Security Responsibility Model (SSRM) within the organization. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "STA-03",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "SSRM Supply Chain",
    specification: "Apply, document, implement and manage the SSRM throughout the supply chain."
  },
  {
    id: "STA-04",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "SSRM Guidance",
    specification: "Provide SSRM Guidance to the service customers detailing information about the SSRM applicability throughout the supply chain."
  },
  {
    id: "STA-05",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "SSRM Control Ownership",
    specification: "Delineate the shared ownership and applicability of all CSA CCM controls according to the SSRM."
  },
  {
    id: "STA-06",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "SSRM Documentation Review",
    specification: "Review and validate the SSRM documentation."
  },
  {
    id: "STA-07",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "SSRM Control Implementation",
    specification: "Implement, operate, and audit or assess the portions of the SSRM which the organization is responsible for."
  },
  {
    id: "STA-08",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "Supply Chain Inventory",
    specification: "Develop and maintain an inventory of all supply chain relationships."
  },
  {
    id: "STA-09",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "Service Bill of Material (BOM)",
    specification: "Define, implement, and enforce a process for establishing a Bill of Material for the service supply chain. Review and update the Bill of Material at least annually or upon significant changes."
  },
  {
    id: "STA-10",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "Supply Chain Risk Management",
    specification: "Periodically review risk factors associated with supply chain relationships."
  },
  {
    id: "STA-11",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "Primary Service and Contractual Agreement",
    specification: "Service agreements must incorporate at least the following mutually-agreed upon provisions and/or terms: Scope, characteristics and location of business relationship and services offered, Information security requirements (including SSRM), Change management process, Logging and monitoring capability, Incident management and communication procedures, Right to audit and third party assessment, Service termination, Interoperability and portability requirements, Data privacy, Operational Resilience"
  },
  {
    id: "STA-12",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "Supply Chain Agreement Review",
    specification: "Review supply chain agreements at least annually or upon significant changes."
  },
  {
    id: "STA-13",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "Supply Chain Compliance Assessment",
    specification: "Define and implement a process for conducting internal assessments to confirm conformance and effectiveness of standards, policies, procedures, and service level agreement activities at least annually."
  },
  {
    id: "STA-14",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "Supply Chain Service Agreement Compliance",
    specification: "Implement policies requiring all service providers throughout the supply chain to comply with information security, confidentiality, access control, privacy, audit, personnel policy and service level requirements and standards."
  },
  {
    id: "STA-15",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "Supply Chain Governance Review",
    specification: "Review the organization's service providers' IT governance policies and procedures at least annually or upon significant changes."
  },
  {
    id: "STA-16",
    domain: "Supply Chain Management, Transparency, and Accountability",
    title: "Supply Chain Data Security Assessment",
    specification: "Define and implement a process for conducting risk-based security assessments of the supply chain."
  },

  // Threat & Vulnerability Management (TVM)
  {
    id: "TVM-01",
    domain: "Threat & Vulnerability Management",
    title: "Threat and Vulnerability Management Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures to identify, report and prioritize the remediation of vulnerabilities and threats, in order to protect systems against vulnerability exploitation. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "TVM-02",
    domain: "Threat & Vulnerability Management",
    title: "Malware and Malicious Instructions Protection Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures to protect against malware and malicious instructions. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "TVM-03",
    domain: "Threat & Vulnerability Management",
    title: "Vulnerability Identification",
    specification: "Define, implement and evaluate processes, procedures and technical measures for the detection of vulnerabilities on organizationally managed assets at least monthly."
  },
  {
    id: "TVM-04",
    domain: "Threat & Vulnerability Management",
    title: "Threat Analysis and Modelling",
    specification: "Define, implement, and evaluate a threat analysis process and procedures to identify, assess and review the threat landscape for cloud systems. Build threat models according to industry best practices to inform the risk mitigation strategy."
  },
  {
    id: "TVM-05",
    domain: "Threat & Vulnerability Management",
    title: "Detection Updates",
    specification: "Define, implement and evaluate processes, procedures and technical measures to update detection tools, threat signatures, and indicators of compromise on a weekly, or more frequent basis."
  },
  {
    id: "TVM-06",
    domain: "Threat & Vulnerability Management",
    title: "External Library Vulnerabilities",
    specification: "Define, implement and evaluate processes, procedures and technical measures to identify updates for applications which use third party or open source libraries according to the organization's vulnerability management policy."
  },
  {
    id: "TVM-07",
    domain: "Threat & Vulnerability Management",
    title: "Penetration Testing",
    specification: "Define, implement and evaluate processes, procedures and technical measures for the periodic performance of penetration testing by independent third parties."
  },
  {
    id: "TVM-08",
    domain: "Threat & Vulnerability Management",
    title: "Vulnerability Remediation Schedule",
    specification: "Define, implement and evaluate processes, procedures and technical measures based on identified risks to support scheduled and emergency responses to vulnerability identification."
  },
  {
    id: "TVM-09",
    domain: "Threat & Vulnerability Management",
    title: "Vulnerability Prioritization",
    specification: "Use a risk-based method for effective prioritization of vulnerability remediation using an industry recognized framework."
  },
  {
    id: "TVM-10",
    domain: "Threat & Vulnerability Management",
    title: "Threat Response",
    specification: "Use a risk-based method for the prioritization and mitigation of threats, leveraging an industry-recognized framework to guide threat decision-making and protection measures."
  },
  {
    id: "TVM-11",
    domain: "Threat & Vulnerability Management",
    title: "Vulnerability Management Reporting",
    specification: "Define and implement a process for tracking and reporting vulnerability identification and remediation activities that includes stakeholder notification."
  },
  {
    id: "TVM-12",
    domain: "Threat & Vulnerability Management",
    title: "Vulnerability Management Metrics",
    specification: "Establish, monitor and report metrics for vulnerability identification and remediation at defined intervals."
  },

  // Universal Endpoint Management (UEM)
  {
    id: "UEM-01",
    domain: "Universal Endpoint Management",
    title: "Endpoint Devices Policy and Procedures",
    specification: "Establish, document, approve, communicate, apply, evaluate and maintain policies and procedures for all endpoints. Review and update the policies and procedures at least annually, or upon significant changes."
  },
  {
    id: "UEM-02",
    domain: "Universal Endpoint Management",
    title: "Application and Service Approval",
    specification: "Define, document, apply and evaluate a list of approved services, applications and sources of applications (stores) acceptable for use by endpoints when accessing or storing organization-managed data."
  },
  {
    id: "UEM-03",
    domain: "Universal Endpoint Management",
    title: "Compatibility",
    specification: "Define and implement a process for the validation of the endpoint device's compatibility with operating systems and applications."
  },
  {
    id: "UEM-04",
    domain: "Universal Endpoint Management",
    title: "Endpoint Inventory",
    specification: "Maintain an inventory of all endpoints used to store, access and process company data."
  },
  {
    id: "UEM-05",
    domain: "Universal Endpoint Management",
    title: "Endpoint Management",
    specification: "Define, implement and evaluate processes, procedures and technical measures to enforce policies and controls for all endpoints permitted to access systems and/or store, transmit, or process organizational data."
  },
  {
    id: "UEM-06",
    domain: "Universal Endpoint Management",
    title: "Automatic Lock Screen",
    specification: "Configure all relevant interactive-use endpoints to require an automatic lock screen."
  },
  {
    id: "UEM-07",
    domain: "Universal Endpoint Management",
    title: "Operating Systems",
    specification: "Manage changes to endpoint operating systems, patch levels, and/or applications through the company's change management processes."
  },
  {
    id: "UEM-08",
    domain: "Universal Endpoint Management",
    title: "Storage Encryption",
    specification: "Protect information from unauthorized disclosure on managed endpoint devices with storage encryption."
  },
  {
    id: "UEM-09",
    domain: "Universal Endpoint Management",
    title: "Anti-Malware Detection and Prevention",
    specification: "Configure managed endpoints with anti-malware detection and prevention technology and services."
  },
  {
    id: "UEM-10",
    domain: "Universal Endpoint Management",
    title: "Software Firewall",
    specification: "Configure managed endpoints with properly configured software firewalls."
  },
  {
    id: "UEM-11",
    domain: "Universal Endpoint Management",
    title: "Data Loss Prevention",
    specification: "Configure managed endpoints with Data Loss Prevention (DLP) technologies and rules in accordance with a risk assessment."
  },
  {
    id: "UEM-12",
    domain: "Universal Endpoint Management",
    title: "Remote Locate",
    specification: "Enable remote geo-location capabilities for all managed mobile endpoints, according to all applicable laws and regulations."
  },
  {
    id: "UEM-13",
    domain: "Universal Endpoint Management",
    title: "Remote Wipe",
    specification: "Define, implement and evaluate processes, procedures and technical measures to enable the deletion of company data remotely on managed endpoint devices."
  },
  {
    id: "UEM-14",
    domain: "Universal Endpoint Management",
    title: "Third-Party Endpoint Security Posture",
    specification: "Define, implement and evaluate processes, procedures and technical and/or contractual measures to maintain proper security of third-party endpoints with access to organizational assets."
  }
];
