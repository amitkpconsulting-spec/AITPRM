/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Stage 2 & 3: Local Embedding Engine & Embedded Portable Vector Database
 * Powered by client-side Transformers.js (Xenova/bge-small-en-v1.5, 384 dimensions)
 * and SQLite-vec / LanceDB style portable in-memory vector store with 384-dim KNN.
 */

import { pipeline } from '@xenova/transformers';

export interface VendorEvidenceChunk {
  id: string;
  vendorId: string;
  controlId: string;
  controlCode?: string;
  documentName: string;
  pageNumber?: number;
  title: string;
  chunkIndex: number;
  chunkText: string;
  metadata: Record<string, any>;
  vector: number[]; // 384-dimensional Float32 array
  createdAt: string;
}

export interface HybridSearchParams {
  query: string;
  vendorId?: string;
  controlId?: string;
  controlCode?: string;
  topK?: number;
  minSimilarity?: number;
}

export interface SearchResult {
  chunk: VendorEvidenceChunk;
  denseSimilarity: number;
  bm25Score: number;
  score: number;
}

// Cosine Similarity between two 384-dim numeric vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// L2 Distance between two vectors
export function l2Distance(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return Infinity;
  let sumSquare = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sumSquare += diff * diff;
  }
  return Math.sqrt(sumSquare);
}

// Fallback L2-normalized 384-dimensional term vector generator when offline or initializing
function generateFallbackTermVector(text: string, dim: number = 384): number[] {
  const vec = new Array(dim).fill(0);
  const words = text.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean);
  if (words.length === 0) return vec;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = (hash << 5) - hash + word.charCodeAt(j);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dim;
    vec[idx] += 1;
  }

  // L2 Normalize
  let norm = 0;
  for (let i = 0; i < dim; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dim; i++) vec[i] /= norm;
  }
  return vec;
}

// BM25 Full-Text Search (FTS) score calculation
function calculateBM25Score(query: string, documentText: string): number {
  const queryTokens = query.toLowerCase().split(/[^a-z0-9_-]+/).filter(Boolean);
  const docTokens = documentText.toLowerCase().split(/[^a-z0-9_-]+/).filter(Boolean);

  if (queryTokens.length === 0 || docTokens.length === 0) return 0;

  const k1 = 1.2;
  const b = 0.75;
  const avgdl = 100;
  const docLen = docTokens.length;

  let score = 0;
  const docFreqMap: Record<string, number> = {};
  docTokens.forEach(t => {
    docFreqMap[t] = (docFreqMap[t] || 0) + 1;
  });

  queryTokens.forEach(token => {
    const tf = docFreqMap[token] || 0;
    if (tf > 0) {
      // Exact code match boost (e.g. CC6.1, m2-owasp, NIST-MAP-1)
      const codeBoost = /^[a-z0-9]+[-_][a-z0-9_-]+$/i.test(token) ? 2.5 : 1.0;
      const idf = 1.5; // Fixed IDF scaling factor for single doc evaluation
      const numerator = tf * (k1 + 1);
      const denominator = tf + k1 * (1 - b + b * (docLen / avgdl));
      score += idf * (numerator / denominator) * codeBoost;
    }
  });

  return score;
}

export class LocalVectorStore {
  private chunks: VendorEvidenceChunk[] = [];
  private extractor: any = null;
  private isExtractorInitializing: boolean = false;
  private storageKey: string = 'tprm_vector_store_v1';

  constructor() {
    this.loadFromStorage();
  }

  // Stage 2: Initialize Xenova/bge-small-en-v1.5 ONNX model (384 dimensions)
  public async initEmbedder(): Promise<boolean> {
    if (this.extractor) return true;
    if (this.isExtractorInitializing) return false;

    this.isExtractorInitializing = true;
    try {
      this.extractor = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');
      this.isExtractorInitializing = false;
      return true;
    } catch (err) {
      console.warn('Transformers.js model initialization notice (using local term feature vectors):', err);
      this.isExtractorInitializing = false;
      return false;
    }
  }

  // Generate 384-dimensional dense vector embedding
  public async embedText(text: string): Promise<number[]> {
    if (this.extractor) {
      try {
        const output = await this.extractor(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data as Float32Array);
      } catch (err) {
        console.warn('Transformer extraction failed, using fallback vector:', err);
      }
    }
    return generateFallbackTermVector(text, 384);
  }

  // Stage 1: Document Text Chunking (512 tokens / max length with 50-token overlap)
  public chunkText(text: string, maxChunkLength: number = 512, overlap: number = 50): string[] {
    if (!text || text.trim().length === 0) return [];
    
    // Normalize line breaks
    const cleanText = text.replace(/\r\n/g, '\n').trim();
    const words = cleanText.split(/\s+/);
    if (words.length === 0) return [];

    const chunks: string[] = [];
    const targetChunkWords = Math.floor(maxChunkLength / 4); // Approx 512 tokens = ~120 words
    const overlapWords = Math.floor(overlap / 4); // ~12 words overlap

    let i = 0;
    while (i < words.length) {
      const chunkWords = words.slice(i, i + targetChunkWords);
      if (chunkWords.length > 0) {
        chunks.push(chunkWords.join(' '));
      }
      i += (targetChunkWords - overlapWords);
      if (targetChunkWords <= overlapWords) i += 1; // Prevent infinite loop
    }

    return chunks.length > 0 ? chunks : [text];
  }

  // Stage 1 & 3: Document Ingestion into Portable Vector Store
  public async ingestVendorDocument(doc: {
    id: string;
    vendorId: string;
    controlId: string;
    controlCode?: string;
    documentName: string;
    pageNumber?: number;
    title?: string;
    content: string;
    metadata?: Record<string, any>;
  }): Promise<number> {
    const textChunks = this.chunkText(doc.content, 512, 50);
    let ingestedCount = 0;

    for (let i = 0; i < textChunks.length; i++) {
      const chunkText = textChunks[i];
      const vector = await this.embedText(chunkText);

      const record: VendorEvidenceChunk = {
        id: `${doc.id}-chk-${i}`,
        vendorId: doc.vendorId,
        controlId: doc.controlId,
        controlCode: doc.controlCode || doc.controlId,
        documentName: doc.documentName || 'audit_document.pdf',
        pageNumber: doc.pageNumber || i + 1,
        title: doc.title || 'Vendor Evidence Document',
        chunkIndex: i,
        chunkText,
        metadata: {
          ...(doc.metadata || {}),
          vendorId: doc.vendorId,
          controlId: doc.controlId,
          documentName: doc.documentName,
          pageNumber: doc.pageNumber || i + 1
        },
        vector,
        createdAt: new Date().toISOString()
      };

      // Upsert record in virtual vector table
      const existingIdx = this.chunks.findIndex(c => c.id === record.id);
      if (existingIdx >= 0) {
        this.chunks[existingIdx] = record;
      } else {
        this.chunks.push(record);
      }
      ingestedCount++;
    }

    this.saveToStorage();
    return ingestedCount;
  }

  // Stage 4: Hybrid Search Engine (Dense Vector Cosine KNN + Sparse BM25 FTS)
  public async hybridSearch(params: HybridSearchParams): Promise<SearchResult[]> {
    const { query, vendorId, controlId, controlCode, topK = 5, minSimilarity = 0.05 } = params;
    const queryVector = await this.embedText(query);

    // Context filter candidates strictly by vendorId, controlId, or controlCode
    let candidates = this.chunks;
    if (vendorId) {
      candidates = candidates.filter(c => c.vendorId === vendorId);
    }
    if (controlId) {
      candidates = candidates.filter(c => c.controlId === controlId);
    }
    if (controlCode) {
      candidates = candidates.filter(c => c.controlCode === controlCode || c.controlId === controlCode);
    }

    const results: SearchResult[] = candidates.map(chunk => {
      // 1. Dense Cosine Distance Vector Search (384 dimensions)
      const denseSimilarity = cosineSimilarity(queryVector, chunk.vector);

      // 2. Sparse BM25 Full-Text Search
      const bm25Score = calculateBM25Score(query, chunk.chunkText);

      // Hybrid combined score: 60% Dense Vector + 40% Sparse BM25
      const normalizedBm25 = Math.min(1.0, bm25Score / 3.0);
      const combinedScore = (denseSimilarity * 0.6) + (normalizedBm25 * 0.4);

      return {
        chunk,
        denseSimilarity,
        bm25Score,
        score: combinedScore
      };
    });

    return results
      .filter(r => r.score >= minSimilarity || r.denseSimilarity >= minSimilarity)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  public getVendorChunks(vendorId: string): VendorEvidenceChunk[] {
    return this.chunks.filter(c => c.vendorId === vendorId);
  }

  public getAllChunks(): VendorEvidenceChunk[] {
    return this.chunks;
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(this.chunks));
      }
    } catch (e) {
      console.warn('Failed to persist vector store to localStorage:', e);
    }
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.chunks = JSON.parse(stored);
        }
      }
    } catch (e) {
      console.warn('Failed to load vector store from localStorage:', e);
    }
  }

  public exportDatabase(): string {
    return JSON.stringify({
      version: '1.0-384dim',
      exportedAt: new Date().toISOString(),
      chunksCount: this.chunks.length,
      chunks: this.chunks
    }, null, 2);
  }

  public importDatabase(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.chunks)) {
        this.chunks = parsed.chunks;
        this.saveToStorage();
        return true;
      }
    } catch (e) {
      console.error('Invalid vector DB import JSON:', e);
    }
    return false;
  }

  public clearStore(): void {
    this.chunks = [];
    this.saveToStorage();
  }
}

export const globalVectorStore = new LocalVectorStore();

