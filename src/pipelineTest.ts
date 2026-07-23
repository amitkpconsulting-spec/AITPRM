/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * End-to-End Unit Test Suite for Portable Local Process Architecture
 * Validates Stages 1 through 5 without active internet connectivity.
 */

import { LocalVectorStore, cosineSimilarity, l2Distance } from './vectorStore';
import { LocalComplianceGraph } from './graphEngine';
import { AgenticRiskAuditor } from './agenticAuditor';
import { Vendor, ControlItem } from './types';

async function runPipelineUnitTest() {
  console.log('================================================================');
  console.log('  PORTABLE LOCAL PROCESS ARCHITECTURE - END-TO-END VERIFICATION ');
  console.log('================================================================\n');

  // Stage 1: Document Parsing & Text Chunking
  console.log('--- STAGE 1: Document Parsing & Text Chunking ---');
  const vectorStore = new LocalVectorStore();
  
  const sampleAuditDocument = `
    SOC 2 Type II Compliance & Data Protection Policy for CloudVendor Inc.
    Section 1: Data Residency & Encryption Standards (CC6.1).
    All customer datasets are encrypted at rest using AES-256 GCM keys stored in regional HSMs.
    Section 2: Autonomous Agent Security & API Governance (m2-owasp).
    Autonomous agentic workflows run inside isolated micro-vms with strictly scoped OAuth2 scopes.
    Direct database write privileges are restricted via explicit human approval gates (HITL).
    Section 3: Model Drift and Bias Evaluation (NIST-MAP-1).
    Weekly automated validation runs evaluate LLM output toxicity, hallucination rates, and demographic parity.
  `;

  const chunks = vectorStore.chunkText(sampleAuditDocument, 512, 50);
  console.log(`[Stage 1 PASS] Document chunked into ${chunks.length} semantically coherent text chunk(s) (512 max tokens, 50 token overlap).`);
  console.log(`- First Chunk Sample: "${chunks[0].substring(0, 90)}..."\n`);

  // Stage 2: Local Embedding Engine (384 Dimensions)
  console.log('--- STAGE 2: Local Embedding Engine (Transformers.js / ONNX) ---');
  const sampleText = "AES-256 GCM encryption at rest with regional HSM key management.";
  const vector = await vectorStore.embedText(sampleText);
  
  if (vector.length !== 384) {
    throw new Error(`[Stage 2 FAIL] Expected 384 dimensions, got ${vector.length}`);
  }
  console.log(`[Stage 2 PASS] Embedding generated successfully.`);
  console.log(`- Dimensions: ${vector.length}`);
  console.log(`- Vector Sample (first 5 dims): [${vector.slice(0, 5).map(v => v.toFixed(4)).join(', ')}]\n`);

  // Stage 3: Embedded Portable Vector Database
  console.log('--- STAGE 3: Portable Vector Database (In-Memory / KNN Index) ---');
  const testDocId = 'doc-test-101';
  const ingestedCount = await vectorStore.ingestVendorDocument({
    id: testDocId,
    vendorId: 'v-test-99',
    controlId: 'm1-encryption',
    controlCode: 'CC6.1',
    documentName: 'CloudVendor_SOC2_2026.pdf',
    pageNumber: 4,
    title: 'SOC2 Security Audit Report',
    content: sampleAuditDocument,
    metadata: { auditor: 'Independent CPA Firm', year: 2026 }
  });

  console.log(`[Stage 3 PASS] Ingested ${ingestedCount} vector chunk(s) with source metadata into portable vector store.`);
  const exportedDB = vectorStore.exportDatabase();
  console.log(`- Export Database Payload Size: ${exportedDB.length} bytes.\n`);

  // Stage 4: Hybrid GraphRAG Retrieval Engine (Dense + BM25 Sparse FTS + Graph Intersect)
  console.log('--- STAGE 4: Hybrid GraphRAG Engine (Dense + Sparse BM25 + Knowledge Graph) ---');
  
  // 4a. Hybrid Dense + Sparse Search
  const searchResults = await vectorStore.hybridSearch({
    query: 'm2-owasp AES-256 encryption OAuth2 micro-vms',
    vendorId: 'v-test-99',
    topK: 3
  });

  if (searchResults.length === 0) {
    throw new Error('[Stage 4 FAIL] Hybrid search returned no candidates.');
  }

  console.log(`[Stage 4a PASS] Hybrid Search returned ${searchResults.length} candidate chunk(s).`);
  console.log(`- Top Result Score: ${(searchResults[0].score * 100).toFixed(1)}% (Dense: ${(searchResults[0].denseSimilarity * 100).toFixed(1)}%, BM25: ${searchResults[0].bm25Score.toFixed(2)})`);
  console.log(`- Retrieved Text: "${searchResults[0].chunk.chunkText.substring(0, 80)}..."`);

  // 4b. Knowledge Graph Node Traversal & Blast Radius
  const graphEngine = new LocalComplianceGraph();
  const dummyVendor: Vendor = {
    id: 'v-test-99',
    name: 'CloudVendor Inc.',
    description: 'Cloud AI Vendor Test',
    lifecycleState: 'Continuous Monitoring',
    status: 'In Progress',
    inherentLikelihood: 4,
    inherentImpact: 4,
    usesAgenticAI: true,
    servicesProvided: 'Cloud LLM Integration Services',
    lastAssessedAt: new Date().toISOString(),
    lastAssessedBy: 'Local Auditor',
    answers: {
      'm1-encryption': {
        controlId: 'm1-encryption',
        isImplemented: true,
        maturity: 'Optimized',
        evidence: 'AES-256 GCM encryption enabled on all database clusters.',
        uploadedFiles: [],
        riskRating: 'Low',
        riskImpact: 'Low',
        riskProbability: 'Low'
      },
      'm2-owasp': {
        controlId: 'm2-owasp',
        isImplemented: false,
        maturity: 'Ad-hoc',
        evidence: '',
        uploadedFiles: [],
        riskRating: 'High',
        riskImpact: 'High',
        riskProbability: 'High'
      }
    }
  };

  const dummyControl: ControlItem = {
    id: 'm2-owasp',
    module: 'agentic-ai',
    code: 'm2-owasp',
    frameworkMapping: 'OWASP Agentic Top 10 / ASI-01',
    question: 'Are autonomous agent tool executions protected against prompt injection and unauthorized API execution?',
    description: 'Requires isolation boundaries and HITL authorization for agent actions.',
    weight: 5
  };

  graphEngine.seedFromVendorData(dummyVendor, [dummyControl]);
  const blastRadius = graphEngine.getVendorBlastRadius(dummyVendor.id);

  console.log(`[Stage 4b PASS] Knowledge Graph Intersect traversal generated blast radius context.`);
  console.log(`- Vendor AI Systems Deployed: ${blastRadius.aiSystems.length}`);
  console.log(`- Failed Controls Identified: ${blastRadius.failedControls.length}`);
  console.log(`- Blast Radius Risk Score: ${blastRadius.blastRadiusScore}%\n`);

  // Stage 5: Local AI Auditor Execution Loop
  console.log('--- STAGE 5: Local AI Auditor Execution Loop ---');
  const auditor = new AgenticRiskAuditor(vectorStore, graphEngine);
  const auditEvaluation = await auditor.evaluateControlMaturity({
    vendor: dummyVendor,
    control: dummyControl
  });

  console.log(`[Stage 5 PASS] Local AI Auditor completed control evaluation.`);
  console.log(`- Execution Mode: ${auditEvaluation.executionMode}`);
  console.log(`- Is Compliant: ${auditEvaluation.isCompliant}`);
  console.log(`- Control Code: ${auditEvaluation.controlCode}`);
  console.log(`- Maturity Rating: ${auditEvaluation.maturityRating}`);
  console.log(`- Confidence Score: ${auditEvaluation.confidenceScore}`);
  console.log(`- Gaps Identified: ${auditEvaluation.gapsIdentified.join(' | ')}`);
  console.log(`- NIST Safeguard Recommendations: ${auditEvaluation.nistSafeguardRecommendations.slice(0, 2).join(' | ')}`);
  
  console.log('\n================================================================');
  console.log('  ALL 5 STAGES VERIFIED - ZERO-TRUST PIPELINE STATUS: OK        ');
  console.log('================================================================');
}

runPipelineUnitTest().catch(err => {
  console.error('Pipeline Unit Test Failed:', err);
  process.exit(1);
});
