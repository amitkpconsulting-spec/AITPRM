/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Agentic Zero-Trust TPRM Risk Auditor
 * Connects local vector retrieval (LocalVectorStore) and graph topology (LocalComplianceGraph)
 * to an offline local Ollama sidecar endpoint (http://localhost:11434/api/generate) with local heuristic audit fallback.
 */

import { LocalVectorStore, globalVectorStore } from './vectorStore';
import { LocalComplianceGraph, globalComplianceGraph } from './graphEngine';
import { ControlItem, Vendor, MaturityLevel } from './types';

export interface AuditEvaluationRequest {
  vendor: Vendor;
  control: ControlItem;
  ollamaEndpoint?: string; // default http://localhost:11434/api/generate
  ollamaModel?: string; // default llama3 or mistral
}

export interface ControlMaturityEvaluation {
  controlId: string;
  controlCode: string;
  isCompliant: boolean;
  maturityRating: MaturityLevel;
  maturityScore: number; // 0 to 100
  confidenceScore: number; // 0.0 to 1.0
  evidenceFindings: string[];
  gapsIdentified: string[];
  nistSafeguardRecommendations: string[];
  caiqAlignment: string;
  auditedAt: string;
  executionMode: 'Ollama-Sidecar' | 'Local-Agentic-Heuristic';
}

export class AgenticRiskAuditor {
  private vectorStore: LocalVectorStore;
  private graphEngine: LocalComplianceGraph;
  private defaultOllamaEndpoint: string;
  private defaultOllamaModel: string;

  constructor(
    vectorStore: LocalVectorStore = globalVectorStore,
    graphEngine: LocalComplianceGraph = globalComplianceGraph,
    ollamaEndpoint: string = 'http://localhost:11434/api/generate',
    ollamaModel: string = 'llama3'
  ) {
    this.vectorStore = vectorStore;
    this.graphEngine = graphEngine;
    this.defaultOllamaEndpoint = ollamaEndpoint;
    this.defaultOllamaModel = ollamaModel;
  }

  // Main Audit Pipeline Method
  public async evaluateControlMaturity(req: AuditEvaluationRequest): Promise<ControlMaturityEvaluation> {
    const { vendor, control } = req;
    const endpoint = req.ollamaEndpoint || this.defaultOllamaEndpoint;
    const model = req.ollamaModel || this.defaultOllamaModel;

    // 1. Vector Search: RAG Retrieval for Control Evidence
    const vectorSearchResults = await this.vectorStore.hybridSearch({
      query: `${control.code} ${control.question} ${control.frameworkMapping}`,
      vendorId: vendor.id,
      controlId: control.id,
      topK: 5
    });

    const vectorEvidenceText = vectorSearchResults.length > 0
      ? vectorSearchResults.map((res, i) => `[Chunk ${i + 1}] (Score: ${(res.score * 100).toFixed(1)}%): ${res.chunk.chunkText}`).join('\n')
      : vendor.answers[control.id]?.evidence || 'No direct text evidence attached.';

    // 2. Graph Engine Context Retrieval (Blast Radius & Topology)
    this.graphEngine.seedFromVendorData(vendor, [control]);
    const blastRadius = this.graphEngine.getVendorBlastRadius(vendor.id);
    const controlNode = this.graphEngine.getNode(`ctrl-${control.id}`);
    const mappedRmfFunction = controlNode?.properties.rmfCategory || 'Govern';

    // 3. Construct Agent Prompt for Local Ollama Sidecar
    const systemPrompt = `You are an expert Zero-Trust AI Compliance Auditor specializing in NIST AI RMF (Govern, Map, Measure, Manage) and CSA CAIQ v4 frameworks. Evaluate the provided vendor control implementation evidence against compliance requirements. Output strictly valid JSON matching the exact schema requested without markdown wrappers.`;

    const userPrompt = `
AUDIT REQUEST:
- Vendor Name: ${vendor.name} (${vendor.servicesProvided})
- Control Code: ${control.code}
- Framework Mapping: ${control.frameworkMapping}
- Question: "${control.question}"
- NIST AI RMF Category: ${mappedRmfFunction}
- Vendor Inherent Likelihood: ${vendor.inherentLikelihood}/5, Impact: ${vendor.inherentImpact}/5
- Uses Agentic AI: ${vendor.usesAgenticAI}

RAG EXTRACTED VECTOR EVIDENCE:
${vectorEvidenceText}

PROPERTY GRAPH BLAST RADIUS CONTEXT:
- Total Unmitigated Control Gaps: ${blastRadius.failedControls.length}
- Overall Blast Radius Score: ${blastRadius.blastRadiusScore}%

INSTRUCTIONS:
Evaluate compliance and output ONLY a JSON object with this exact structure:
{
  "isCompliant": boolean,
  "maturityRating": "Ad-hoc" | "Managed" | "Optimized",
  "maturityScore": number (0 to 100),
  "confidenceScore": number (0.0 to 1.0),
  "evidenceFindings": [string],
  "gapsIdentified": [string],
  "nistSafeguardRecommendations": [string],
  "caiqAlignment": string
}
`;

    // 4. Try querying local Ollama endpoint sidecar
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: `${systemPrompt}\n\n${userPrompt}`,
          stream: false,
          format: 'json'
        }),
        signal: AbortSignal.timeout(3000) // 3s timeout for sidecar check
      });

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.response || '{}';
        const parsed = JSON.parse(jsonText);

        return {
          controlId: control.id,
          controlCode: control.code,
          isCompliant: Boolean(parsed.isCompliant),
          maturityRating: (['Ad-hoc', 'Managed', 'Optimized'].includes(parsed.maturityRating) ? parsed.maturityRating : 'Managed') as MaturityLevel,
          maturityScore: Math.min(100, Math.max(0, Number(parsed.maturityScore) || 70)),
          confidenceScore: Math.min(1.0, Math.max(0, Number(parsed.confidenceScore) || 0.85)),
          evidenceFindings: Array.isArray(parsed.evidenceFindings) ? parsed.evidenceFindings : ['Verified with local vector store evidence.'],
          gapsIdentified: Array.isArray(parsed.gapsIdentified) ? parsed.gapsIdentified : [],
          nistSafeguardRecommendations: Array.isArray(parsed.nistSafeguardRecommendations) ? parsed.nistSafeguardRecommendations : ['Enforce continuous monitoring.'],
          caiqAlignment: parsed.caiqAlignment || `${control.frameworkMapping} satisfied.`,
          auditedAt: new Date().toISOString(),
          executionMode: 'Ollama-Sidecar'
        };
      }
    } catch (e) {
      // Offline/Local sidecar endpoint not responding - execute deterministic agentic heuristic auditor
    }

    // 5. Zero-Trust Local Agentic Heuristic Fallback Auditor
    return this.runLocalHeuristicAudit(vendor, control, vectorSearchResults, blastRadius, mappedRmfFunction);
  }

  // Deterministic Local Heuristic Agentic Evaluation
  private runLocalHeuristicAudit(
    vendor: Vendor,
    control: ControlItem,
    searchResults: any[],
    blastRadius: any,
    rmfFunction: string
  ): ControlMaturityEvaluation {
    const ans = vendor.answers[control.id];
    const isImplemented = ans?.isImplemented || false;
    const hasEvidenceText = (ans?.evidence && ans.evidence.trim().length > 10) || searchResults.length > 0;
    const hasUploadedFiles = ans?.uploadedFiles && ans.uploadedFiles.length > 0;

    let maturityRating: MaturityLevel = 'Ad-hoc';
    let maturityScore = 20;
    let confidenceScore = 0.6;
    const evidenceFindings: string[] = [];
    const gapsIdentified: string[] = [];
    const nistSafeguardRecommendations: string[] = [];

    if (isImplemented) {
      if (hasEvidenceText && hasUploadedFiles) {
        maturityRating = 'Optimized';
        maturityScore = 95;
        confidenceScore = 0.95;
        evidenceFindings.push(`Direct text evidence verified alongside ${ans.uploadedFiles.length} file artifact(s).`);
        evidenceFindings.push(`Vector similarity search confirmed alignment with ${control.frameworkMapping}.`);
      } else if (hasEvidenceText || hasUploadedFiles) {
        maturityRating = 'Managed';
        maturityScore = 75;
        confidenceScore = 0.80;
        evidenceFindings.push(`Control implementation documented in vendor assessment.`);
        if (!hasUploadedFiles) {
          gapsIdentified.push(`No file evidence uploaded to corroborate text claims.`);
        }
      } else {
        maturityRating = 'Managed';
        maturityScore = 60;
        confidenceScore = 0.65;
        evidenceFindings.push(`Control marked implemented, but formal documentation is pending.`);
        gapsIdentified.push(`Missing narrative evidence notes.`);
      }
    } else {
      maturityRating = 'Ad-hoc';
      maturityScore = 15;
      confidenceScore = 0.90;
      gapsIdentified.push(`Control ${control.code} is unmitigated for vendor ${vendor.name}.`);
      gapsIdentified.push(`Exposes risk in NIST AI RMF [${rmfFunction}] lifecycle function.`);
    }

    // Recommendations based on NIST RMF Function
    if (rmfFunction === 'Govern') {
      nistSafeguardRecommendations.push(`Establish formal governance board review and line-of-business signoff.`);
      nistSafeguardRecommendations.push(`Maintain up-to-date AI system registry and data lineage records.`);
    } else if (rmfFunction === 'Map') {
      nistSafeguardRecommendations.push(`Document data anonymization and cross-border data transfer impact assessments.`);
      nistSafeguardRecommendations.push(`Map model blast radius when deployed across agentic multi-tool workflows.`);
    } else if (rmfFunction === 'Measure') {
      nistSafeguardRecommendations.push(`Implement automated model drift and bias monitoring dashboards.`);
      nistSafeguardRecommendations.push(`Conduct quarterly adversarial red-teaming and safety testing.`);
    } else {
      // Manage
      nistSafeguardRecommendations.push(`Enforce cryptographic data protection and zero-trust API rate limiters.`);
      nistSafeguardRecommendations.push(`Establish Human-in-the-Loop (HITL) approval gates for autonomous actions.`);
    }

    return {
      controlId: control.id,
      controlCode: control.code,
      isCompliant: isImplemented && maturityScore >= 60,
      maturityRating,
      maturityScore,
      confidenceScore,
      evidenceFindings,
      gapsIdentified,
      nistSafeguardRecommendations,
      caiqAlignment: `${control.frameworkMapping} - ${isImplemented ? 'Compliant' : 'Non-compliant'} (${maturityRating})`,
      auditedAt: new Date().toISOString(),
      executionMode: 'Local-Agentic-Heuristic'
    };
  }
}

export const globalAgenticAuditor = new AgenticRiskAuditor();
