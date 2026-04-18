'use client';

import { useState } from 'react';
import { Shield, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'analyze', label: 'Analyze' },
  { id: 'simulate', label: 'Simulate' },
  { id: 'chat', label: 'AI Chat' },
];

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{
      background: 'rgba(10, 14, 26, 0.9)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                ShieldAI
              </h1>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-cyan)' }}>
                Wallet Guardian
              </p>
            </div>
          </button>

          {/* Desktop Tabs */}
          <div className="hidden md:flex items-center gap-2 px-2 py-1.5 rounded-2xl" style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{
                  background: activeTab === tab.id ? 'var(--gradient-primary)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                  boxShadow: activeTab === tab.id ? '0 4px 15px rgba(59,130,246,0.25)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl" style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.15)',
          }}>
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-green)', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
            <span className="text-xs font-bold" style={{ color: 'var(--accent-green)' }}>Protected</span>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)' }}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 space-y-1" style={{
          background: 'rgba(10, 14, 26, 0.98)',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { onTabChange(tab.id); setMobileOpen(false); }}
              className="w-full text-left px-4 py-3.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: activeTab === tab.id ? 'var(--gradient-primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
