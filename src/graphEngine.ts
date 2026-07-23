/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * In-Memory Property Graph Module for TPRM Compliance & AI Governance
 * Models multi-hop relationships between Vendors, AI Systems, Risks, Controls, RMF Functions, and Evidence.
 */

import { Vendor, ControlItem } from './types';

export type NodeType = 'Vendor' | 'AISystem' | 'Risk' | 'Control' | 'RMFFunction' | 'Evidence';

export type EdgeType = 'DEPLOYS' | 'EXPOSES' | 'MITIGATED_BY' | 'MAPS_TO' | 'PROVES';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  properties: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string; // source node id
  target: string; // target node id
  type: EdgeType;
  properties?: Record<string, any>;
}

export interface BlastRadiusResult {
  vendorId: string;
  vendorName: string;
  aiSystems: { id: string; name: string; isAgentic: boolean }[];
  exposedRisks: { id: string; title: string; category: string; rating: string }[];
  failedControls: { id: string; code: string; question: string; rmfCategory: string }[];
  mitigatedControls: { id: string; code: string; question: string }[];
  impactedFunctions: string[]; // NIST AI RMF functions impacted (Govern, Map, Measure, Manage)
  blastRadiusScore: number; // 0 to 100 risk impact score
  summary: string;
}

export class LocalComplianceGraph {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: GraphEdge[] = [];

  constructor() {}

  // Add or update node
  public addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
  }

  public getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  public getNodesByType(type: NodeType): GraphNode[] {
    return Array.from(this.nodes.values()).filter(n => n.type === type);
  }

  // Add edge with duplicate prevention
  public addEdge(edge: GraphEdge): void {
    const exists = this.edges.some(
      e => e.source === edge.source && e.target === edge.target && e.type === edge.type
    );
    if (!exists) {
      this.edges.push(edge);
    }
  }

  // Get outgoing / incoming edges
  public getOutgoingEdges(nodeId: string): GraphEdge[] {
    return this.edges.filter(e => e.source === nodeId);
  }

  public getIncomingEdges(nodeId: string): GraphEdge[] {
    return this.edges.filter(e => e.target === nodeId);
  }

  public getNeighbors(nodeId: string): GraphNode[] {
    const neighborIds = new Set<string>();
    this.edges.forEach(e => {
      if (e.source === nodeId) neighborIds.add(e.target);
      if (e.target === nodeId) neighborIds.add(e.source);
    });
    return Array.from(neighborIds)
      .map(id => this.nodes.get(id))
      .filter((n): n is GraphNode => n !== undefined);
  }

  // Automatically construct graph topology from vendor assessment state & master controls
  public seedFromVendorData(vendor: Vendor, masterControls: ControlItem[]): void {
    // 1. Add Vendor Node
    const vendorNodeId = `vendor-${vendor.id}`;
    this.addNode({
      id: vendorNodeId,
      type: 'Vendor',
      label: vendor.name,
      properties: {
        vendorId: vendor.id,
        services: vendor.servicesProvided,
        usesAgenticAI: vendor.usesAgenticAI,
        status: vendor.status
      }
    });

    // 2. Add AI System Node
    const aiSystemNodeId = `aisystem-${vendor.id}`;
    this.addNode({
      id: aiSystemNodeId,
      type: 'AISystem',
      label: `${vendor.name} AI Pipeline`,
      properties: {
        isAgentic: vendor.usesAgenticAI,
        inherentLikelihood: vendor.inherentLikelihood,
        inherentImpact: vendor.inherentImpact
      }
    });

    // Edge: Vendor DEPLOYS AISystem
    this.addEdge({
      id: `${vendorNodeId}-DEPLOYS-${aiSystemNodeId}`,
      source: vendorNodeId,
      target: aiSystemNodeId,
      type: 'DEPLOYS'
    });

    // 3. RMF Functions Nodes
    const rmfCategories = ['Govern', 'Map', 'Measure', 'Manage'];
    rmfCategories.forEach(cat => {
      const rmfNodeId = `rmf-${cat.toLowerCase()}`;
      this.addNode({
        id: rmfNodeId,
        type: 'RMFFunction',
        label: `NIST AI RMF: ${cat}`,
        properties: { function: cat }
      });
    });

    // Control to RMF mapping helper
    const rmfMapping: Record<string, string> = {
      'm1-residency': 'Govern',
      'm2-lineage': 'Govern',
      'm3-autonomy': 'Govern',
      'm1-pseudonym': 'Map',
      'm1-crossborder': 'Map',
      'm3-tools': 'Map',
      'm2-bias': 'Measure',
      'm2-drift': 'Measure',
      'm2-redteam': 'Measure',
      'm1-encryption': 'Manage',
      'm2-owasp': 'Manage',
      'm3-hitl': 'Manage',
      'm3-blast': 'Manage'
    };

    // 4. Scoped Controls, Risks, & Evidence
    const scopedControls = masterControls.filter(
      c => c.module !== 'agentic-ai' || vendor.usesAgenticAI
    );

    scopedControls.forEach(ctrl => {
      const ctrlNodeId = `ctrl-${ctrl.id}`;
      const ans = vendor.answers[ctrl.id];
      const isImplemented = ans?.isImplemented || false;
      const rmfCat = rmfMapping[ctrl.id] || 'Govern';

      // Control Node
      this.addNode({
        id: ctrlNodeId,
        type: 'Control',
        label: `${ctrl.code}: ${ctrl.question}`,
        properties: {
          code: ctrl.code,
          weight: ctrl.weight,
          framework: ctrl.frameworkMapping,
          isImplemented,
          maturity: ans?.maturity || 'Ad-hoc',
          rmfCategory: rmfCat
        }
      });

      // Edge: Control MAPS_TO RMF Function
      const rmfNodeId = `rmf-${rmfCat.toLowerCase()}`;
      this.addEdge({
        id: `${ctrlNodeId}-MAPS_TO-${rmfNodeId}`,
        source: ctrlNodeId,
        target: rmfNodeId,
        type: 'MAPS_TO'
      });

      // Risk Node associated with Control
      const riskNodeId = `risk-${ctrl.id}`;
      this.addNode({
        id: riskNodeId,
        type: 'Risk',
        label: `Risk of Uncontrolled ${ctrl.code}`,
        properties: {
          rating: ans?.riskRating || 'High',
          impact: ans?.riskImpact || 'Medium',
          probability: ans?.riskProbability || 'Medium'
        }
      });

      // Edge: AI System EXPOSES Risk
      this.addEdge({
        id: `${aiSystemNodeId}-EXPOSES-${riskNodeId}`,
        source: aiSystemNodeId,
        target: riskNodeId,
        type: 'EXPOSES'
      });

      // Edge: Risk MITIGATED_BY Control (if control implemented)
      if (isImplemented) {
        this.addEdge({
          id: `${riskNodeId}-MITIGATED_BY-${ctrlNodeId}`,
          source: riskNodeId,
          target: ctrlNodeId,
          type: 'MITIGATED_BY'
        });
      }

      // Evidence Node (if evidence provided)
      if (ans?.evidence || (ans?.uploadedFiles && ans.uploadedFiles.length > 0)) {
        const evidenceNodeId = `ev-${vendor.id}-${ctrl.id}`;
        this.addNode({
          id: evidenceNodeId,
          type: 'Evidence',
          label: `Evidence for ${ctrl.code}`,
          properties: {
            text: ans.evidence || '',
            fileCount: ans.uploadedFiles?.length || 0
          }
        });

        // Edge: Evidence PROVES Control
        this.addEdge({
          id: `${evidenceNodeId}-PROVES-${ctrlNodeId}`,
          source: evidenceNodeId,
          target: ctrlNodeId,
          type: 'PROVES'
        });
      }
    });
  }

  // Blast Radius Query Method: Computes total risk exposure when controls fail
  public getVendorBlastRadius(vendorId: string): BlastRadiusResult {
    const vendorNodeId = `vendor-${vendorId}`;
    const vendorNode = this.nodes.get(vendorNodeId);

    if (!vendorNode) {
      return {
        vendorId,
        vendorName: 'Unknown Vendor',
        aiSystems: [],
        exposedRisks: [],
        failedControls: [],
        mitigatedControls: [],
        impactedFunctions: [],
        blastRadiusScore: 0,
        summary: 'Vendor not found in property graph.'
      };
    }

    const vendorName = vendorNode.label;
    const aiSystems: { id: string; name: string; isAgentic: boolean }[] = [];
    const exposedRisks: { id: string; title: string; category: string; rating: string }[] = [];
    const failedControls: { id: string; code: string; question: string; rmfCategory: string }[] = [];
    const mitigatedControls: { id: string; code: string; question: string }[] = [];
    const impactedFunctionsSet = new Set<string>();

    // 1. Find deployed AI Systems
    const deployEdges = this.edges.filter(e => e.source === vendorNodeId && e.type === 'DEPLOYS');
    deployEdges.forEach(e => {
      const sysNode = this.nodes.get(e.target);
      if (sysNode) {
        aiSystems.push({
          id: sysNode.id,
          name: sysNode.label,
          isAgentic: sysNode.properties.isAgentic || false
        });
      }
    });

    // 2. Traversal: AI System -> Exposed Risks -> Controls
    let totalUnmitigatedScore = 0;
    let totalMaxScore = 0;

    this.getNodesByType('Control').forEach(ctrlNode => {
      const isImplemented = ctrlNode.properties.isImplemented;
      const weight = ctrlNode.properties.weight || 1;
      const rmfCat = ctrlNode.properties.rmfCategory || 'Govern';

      totalMaxScore += weight * 20;

      if (!isImplemented) {
        failedControls.push({
          id: ctrlNode.id,
          code: ctrlNode.properties.code,
          question: ctrlNode.label,
          rmfCategory: rmfCat
        });
        impactedFunctionsSet.add(rmfCat);
        totalUnmitigatedScore += weight * 20;

        // Find associated exposed risk
        const riskNodeId = `risk-${ctrlNode.properties.code.toLowerCase()}`;
        const riskNode = this.nodes.get(riskNodeId);
        if (riskNode) {
          exposedRisks.push({
            id: riskNode.id,
            title: riskNode.label,
            category: rmfCat,
            rating: riskNode.properties.rating || 'High'
          });
        }
      } else {
        mitigatedControls.push({
          id: ctrlNode.id,
          code: ctrlNode.properties.code,
          question: ctrlNode.label
        });
      }
    });

    const blastRadiusScore = totalMaxScore > 0 ? Math.round((totalUnmitigatedScore / totalMaxScore) * 100) : 0;

    return {
      vendorId,
      vendorName,
      aiSystems,
      exposedRisks,
      failedControls,
      mitigatedControls,
      impactedFunctions: Array.from(impactedFunctionsSet),
      blastRadiusScore,
      summary: `Blast radius analysis for ${vendorName}: ${failedControls.length} unmitigated control gaps exposing ${exposedRisks.length} AI lifecycle risks across NIST RMF functions [${Array.from(impactedFunctionsSet).join(', ')}].`
    };
  }

  // Export full property graph to JSON
  public exportGraphJSON(): string {
    return JSON.stringify({
      nodes: Array.from(this.nodes.values()),
      edges: this.edges
    }, null, 2);
  }
}

export const globalComplianceGraph = new LocalComplianceGraph();
