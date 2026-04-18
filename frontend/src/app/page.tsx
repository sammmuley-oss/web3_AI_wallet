'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import WalletConnect from '@/components/WalletConnect';
import TransactionPreview from '@/components/TransactionPreview';
import RiskMeter from '@/components/RiskMeter';
import ChatAssistant from '@/components/ChatAssistant';
import SimulatorPanel from '@/components/SimulatorPanel';
import SafetyRecommendations from '@/components/SafetyRecommendations';
import { analyzeTransaction, simulateTransaction } from '@/lib/api';
import type { AnalysisResponse, SimulationResponse } from '@/lib/api';
import { Shield, Zap, MessageSquare, Search, ArrowRight, Lock, Eye, Bot } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (txData: { to: string; from: string; data: string; value: string }) => {
    setIsAnalyzing(true);
    setIsSimulating(true);
    setError(null);

    try {
      const [analysis, simulation] = await Promise.all([
        analyzeTransaction(txData),
        simulateTransaction(txData),
      ]);
      setAnalysisResult(analysis);
      setSimulationResult(simulation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze. Is the backend running on port 3001?');
    } finally {
      setIsAnalyzing(false);
      setIsSimulating(false);
    }
  }, []);

  const transactionContext = analysisResult ? {
    functionName: analysisResult.decoded.functionName,
    to: analysisResult.decoded.args?.to as string,
    contractInfo: analysisResult.decoded.contractInfo,
    valueEth: analysisResult.decoded.valueEth,
    riskLevel: analysisResult.risk.level,
    riskScore: analysisResult.risk.score,
    flags: analysisResult.decoded.flags,
  } : null;

  return (
    <main className="relative min-h-screen" style={{ paddingTop: '72px' }}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Error banner */}
      {error && (
        <div className="max-w-5xl mx-auto px-6 pt-4">
          <div className="p-4 rounded-2xl flex items-center gap-3" style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}>
            <span className="text-lg">⚠️</span>
            <p className="text-sm flex-1" style={{ color: '#fca5a5' }}>{error}</p>
            <button onClick={() => setError(null)} className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ============ DASHBOARD TAB ============ */}
      {activeTab === 'dashboard' && (
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
          {/* Hero */}
          <section className="text-center py-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5" style={{
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.2)',
            }}>
              <Shield className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-cyan)' }}>
                AI-Powered Protection
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight leading-tight" style={{
              background: 'var(--gradient-cyber)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Shield Your Wallet
            </h1>
            <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Understand every transaction before you sign. Our AI analyzes smart contracts,
              detects scams, and gives you actionable safety advice — in plain English.
            </p>
          </section>

          {/* Feature Cards - 2x2 grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: <Search className="w-6 h-6" />,
                title: 'Transaction Explainer',
                desc: 'Decode any transaction into a simple, human-readable explanation. Supports ERC-20, NFTs, DEX swaps, and more.',
                color: '#3b82f6',
                tab: 'analyze',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: '"What If I Sign?" Simulator',
                desc: 'Preview exact balance changes, token approvals, and hidden interactions before you commit.',
                color: '#8b5cf6',
                tab: 'simulate',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Risk Detection Engine',
                desc: 'Automated threat scoring for unlimited approvals, scam contracts, phishing patterns, and more.',
                color: '#10b981',
                tab: 'analyze',
              },
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: 'AI Chat Assistant',
                desc: 'Ask questions about blockchain safety. Get clear, beginner-friendly answers from ShieldAI.',
                color: '#06b6d4',
                tab: 'chat',
              },
            ].map((f, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(f.tab)}
                className="glass-card p-6 text-left group transition-all duration-300 hover:translate-y-[-3px]"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{
                  background: `${f.color}15`,
                  color: f.color,
                  border: `1px solid ${f.color}30`,
                }}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {f.desc}
                </p>
                <div className="flex items-center gap-1.5 mt-4 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: f.color }}>
                  Get Started <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </section>

          {/* Wallet + Chat side-by-side */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-2">
              <WalletConnect />
            </div>
            <div className="lg:col-span-3">
              <ChatAssistant transactionContext={transactionContext} />
            </div>
          </section>

          {/* Trust strip */}
          <section className="flex flex-wrap items-center justify-center gap-8 py-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {[
              { icon: <Lock className="w-4 h-4" />, text: 'No private keys stored' },
              { icon: <Eye className="w-4 h-4" />, text: 'Read-only analysis' },
              { icon: <Shield className="w-4 h-4" />, text: 'Open source' },
              { icon: <Bot className="w-4 h-4" />, text: 'AI-powered insights' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span style={{ color: 'var(--accent-cyan)' }}>{item.icon}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{item.text}</span>
              </div>
            ))}
          </section>
        </div>
      )}

      {/* ============ ANALYZE TAB ============ */}
      {activeTab === 'analyze' && (
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          {/* Section title */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                🔍 Transaction Analyzer
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Select a sample or paste raw transaction data to analyze
              </p>
            </div>
          </div>

          {/* Top row: Wallet + Transaction Input */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-2">
              <WalletConnect />
            </div>
            <div className="lg:col-span-3">
              <div className="glass-card p-6">
                <TransactionPreview
                  onAnalyze={handleAnalyze}
                  isLoading={isAnalyzing}
                  result={null}
                />
              </div>
            </div>
          </div>

          {/* Loading state */}
          {isAnalyzing && (
            <div className="glass-card p-10 text-center">
              <div className="spinner mx-auto mb-4" style={{ width: 40, height: 40 }} />
              <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Analyzing transaction...
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Decoding calldata, scoring risks, generating AI insights
              </p>
            </div>
          )}

          {/* Results - shown after analysis */}
          {analysisResult && !isAnalyzing && (
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex items-center gap-3 pt-2">
                <div className="h-px flex-1" style={{ background: 'var(--border-subtle)' }} />
                <span className="text-xs font-bold uppercase tracking-widest px-4" style={{ color: 'var(--accent-cyan)' }}>
                  Analysis Results
                </span>
                <div className="h-px flex-1" style={{ background: 'var(--border-subtle)' }} />
              </div>

              {/* Row 1: Decoded Summary + Risk Score */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Decoded Transaction - wider */}
                <div className="lg:col-span-3 glass-card p-6">
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    📋 Decoded Transaction
                    <span className="text-xs px-3 py-1 rounded-full font-semibold ml-auto" style={{
                      background: analysisResult.decoded.decodedSuccessfully ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                      color: analysisResult.decoded.decodedSuccessfully ? 'var(--accent-green)' : 'var(--accent-red)',
                    }}>
                      {analysisResult.decoded.decodedSuccessfully ? '✓ Successfully Decoded' : '✗ Unknown Format'}
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <InfoCard label="Function" value={analysisResult.decoded.functionName || 'Unknown'} />
                    <InfoCard label="Category" value={analysisResult.decoded.category} />
                    <InfoCard label="ETH Value" value={`${analysisResult.decoded.valueEth} ETH`} />
                    <InfoCard label="Contract" value={analysisResult.decoded.contractInfo?.name || 'Unknown'} />
                  </div>
                  {/* Flags */}
                  {analysisResult.decoded.flags.length > 0 && (
                    <div className="space-y-2">
                      {analysisResult.decoded.flags.map((flag, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl text-sm" style={{
                          background: flag.type === 'danger' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                          border: `1px solid ${flag.type === 'danger' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}`,
                        }}>
                          <span className="text-lg mt-0.5">{flag.type === 'danger' ? '🚨' : '⚠️'}</span>
                          <span style={{ color: flag.type === 'danger' ? '#fca5a5' : '#fcd34d' }}>
                            {flag.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Risk Meter - compact */}
                <div className="lg:col-span-2">
                  <RiskMeter
                    score={analysisResult.risk.score}
                    level={analysisResult.risk.level}
                    threats={analysisResult.risk.threats}
                  />
                </div>
              </div>

              {/* Row 2: Simulation + AI Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SimulatorPanel result={simulationResult} isLoading={isSimulating} />
                <SafetyRecommendations
                  recommendations={analysisResult.risk.recommendations}
                  aiExplanation={analysisResult.ai.explanation}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============ SIMULATE TAB ============ */}
      {activeTab === 'simulate' && (
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              ⚡ Transaction Simulator
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              See exactly what happens if you sign — preview balance changes, approvals, and hidden interactions
            </p>
          </div>

          <div className="glass-card p-6">
            <TransactionPreview
              onAnalyze={handleAnalyze}
              isLoading={isAnalyzing}
              result={null}
            />
          </div>

          {isAnalyzing && (
            <div className="glass-card p-10 text-center">
              <div className="spinner mx-auto mb-4" style={{ width: 40, height: 40 }} />
              <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Simulating transaction...
              </p>
            </div>
          )}

          {analysisResult && !isAnalyzing && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SimulatorPanel result={simulationResult} isLoading={false} />
                <RiskMeter
                  score={analysisResult.risk.score}
                  level={analysisResult.risk.level}
                  threats={analysisResult.risk.threats}
                />
              </div>
              <SafetyRecommendations
                recommendations={analysisResult.risk.recommendations}
                aiExplanation={analysisResult.ai.explanation}
              />
            </div>
          )}
        </div>
      )}

      {/* ============ CHAT TAB ============ */}
      {activeTab === 'chat' && (
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-5">
              <WalletConnect />
              {analysisResult && (
                <RiskMeter
                  score={analysisResult.risk.score}
                  level={analysisResult.risk.level}
                  threats={analysisResult.risk.threats}
                />
              )}
              <div className="glass-card p-5">
                <h3 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  💡 Suggested Questions
                </h3>
                <div className="space-y-2">
                  {[
                    "What is an unlimited token approval?",
                    "How do I revoke token approvals?",
                    "What makes a smart contract risky?",
                    "What is a rug pull?",
                    "How to use a hardware wallet?",
                  ].map((q) => (
                    <p key={q} className="p-3 rounded-xl text-sm" style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                    }}>
                      &ldquo;{q}&rdquo;
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat panel */}
            <div className="lg:col-span-2">
              <ChatAssistant transactionContext={transactionContext} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 py-6 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          ShieldAI Wallet Guardian • Read-only analysis • No private keys stored •{' '}
          <span style={{ color: 'var(--accent-cyan)' }}>Built for your safety</span>
        </p>
      </footer>
    </main>
  );
}

/* Small helper component for decoded transaction info cards */
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
      <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  );
}
