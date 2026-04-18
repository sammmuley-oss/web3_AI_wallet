/**
 * API Client - communicates with the backend Express server
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface TransactionData {
  to?: string;
  from?: string;
  data?: string;
  value?: string;
  gasLimit?: string;
  gasPrice?: string;
  chainId?: number;
}

interface AnalysisResponse {
  success: boolean;
  decoded: {
    functionName: string;
    functionSignature: string;
    category: string;
    args: Record<string, unknown>;
    valueEth: string;
    contractInfo: {
      name: string;
      type: string;
      verified: boolean;
      trust: string;
    } | null;
    flags: Array<{ type: string; message: string }>;
    decodedSuccessfully: boolean;
  };
  risk: {
    score: number;
    level: 'low' | 'medium' | 'high';
    summary: string;
    threats: Array<{
      id: string;
      severity: string;
      title: string;
      description: string;
    }>;
    recommendations: Array<{
      icon: string;
      action: string;
      detail: string;
    }>;
  };
  ai: {
    explanation: string;
    riskAnalysis: string;
  };
  summary: string;
  chainId: number;
  timestamp: string;
}

interface SimulationResponse {
  success: boolean;
  simulation: {
    effects: Array<{
      type: string;
      description: string;
      icon: string;
    }>;
    balanceChanges: Array<{
      token: string;
      change: string;
      direction: 'in' | 'out';
      type: string;
    }>;
    approvalChanges: Array<{
      type: string;
      token?: string;
      spender: string;
      amount?: string;
      scope?: string;
      action: string;
    }>;
    nftTransfers: Array<{
      collection: string;
      tokenId: string;
      direction: string;
    }>;
    gasCost: {
      gasLimit: number;
      gasPriceGwei: string;
      estimatedCostEth: string;
    };
    warnings: Array<{ type: string; message: string }>;
    summary: string;
  };
  risk: {
    score: number;
    level: 'low' | 'medium' | 'high';
    threats: Array<{
      id: string;
      severity: string;
      title: string;
      description: string;
    }>;
    recommendations: Array<{
      icon: string;
      action: string;
      detail: string;
    }>;
  };
  ai: {
    explanation: string;
  };
}

interface ChatResponse {
  success: boolean;
  response: string;
  timestamp: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Analyze a transaction (full analysis with AI)
 */
export async function analyzeTransaction(txData: TransactionData): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(txData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(err.message || 'Analysis failed');
  }
  return res.json();
}

/**
 * Quick decode (no AI, faster)
 */
export async function quickDecode(txData: TransactionData) {
  const res = await fetch(`${API_BASE}/analyze/decode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(txData),
  });
  if (!res.ok) throw new Error('Decode failed');
  return res.json();
}

/**
 * Simulate transaction outcomes
 */
export async function simulateTransaction(txData: TransactionData): Promise<SimulationResponse> {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(txData),
  });
  if (!res.ok) throw new Error('Simulation failed');
  return res.json();
}

/**
 * Chat with AI assistant
 */
export async function chatWithAssistant(
  message: string,
  history: ChatMessage[] = [],
  transactionContext: Record<string, unknown> | null = null
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, transactionContext }),
  });
  if (!res.ok) throw new Error('Chat failed');
  return res.json();
}

/**
 * Health check
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export type { TransactionData, AnalysisResponse, SimulationResponse, ChatResponse, ChatMessage };
