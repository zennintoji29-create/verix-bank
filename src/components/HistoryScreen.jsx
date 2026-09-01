import React, { useState, useEffect } from 'react';
import { 
  Shield, Search, Phone, ArrowLeft, CheckCircle2, 
  AlertTriangle, PhoneCall, Radio, Ban, Flag, Ticket
} from 'lucide-react';
import { translations } from '../translations';

export default function HistoryScreen({ onBack, backendUrl, user, currentLang = 'en', onNavigate }) {
  const t = translations[currentLang] || translations.en;
  const [activeTab, setActiveTab] = useState('prechecks'); // 'prechecks' | 'calls' | 'warnings' | 'tickets'
  const [searchQuery, setSearchQuery] = useState('');
  const [blockedItems, setBlockedItems] = useState([]);
  const [reportedItems, setReportedItems] = useState([]);

  // 1. UPI Pre-Checks History
  const [preCheckHistory, setPreCheckHistory] = useState([
    {
      id: 'pre-1',
      vpa: 'scammer.cybercell@oksbi',
      payee: 'Fake Cyber Police Desk',
      amount: '₹25,000.00',
      riskScore: 98,
      riskLevel: 'HIGH_RISK',
      timestamp: 'Today, 10:45 AM',
      note: 'Digital Arrest Bail demand',
      reason: 'Flagged in I4C National Cybercrime Registry for extortion.'
    },
    {
      id: 'pre-2',
      vpa: 'customs.courier.fine@icici',
      payee: 'Customs Clearance IVR',
      amount: '₹14,500.00',
      riskScore: 92,
      riskLevel: 'HIGH_RISK',
      timestamp: 'Yesterday, 3:15 PM',
      note: 'Illegal FedEx parcel fee',
      reason: 'Multiple victim reports received for fake narcotics customs scam.'
    },
    {
      id: 'pre-3',
      vpa: 'mom@okhdfcbank',
      payee: 'Mother Personal',
      amount: '₹2,000.00',
      riskScore: 2,
      riskLevel: 'SAFE',
      timestamp: '2 days ago, 7:30 PM',
      note: 'Grocery & Medicine',
      reason: 'Verified clean recipient VPA with high trust score.'
    },
    {
      id: 'pre-4',
      vpa: 'quick.electricity.bill@axis',
      payee: 'Electricity Officer Disconnect',
      amount: '₹3,400.00',
      riskScore: 89,
      riskLevel: 'HIGH_RISK',
      timestamp: '3 days ago, 11:20 AM',
      note: 'Power cut bill update',
      reason: 'SMS Phishing APK dropper vector associated with this VPA.'
    }
  ]);

  // 2. Call Logs
  const callAlerts = [
    {
      id: 'call-1',
      identifier: '+91 94775 30475',
      timestamp: 'Today, 10:42 AM • Cellular Call Flagged',
      badge: 'Digital Arrest Scam',
      summary: 'Caller impersonated CBI Officer demanding ₹25,000 security clearance for fake arrest warrant.'
    },
    {
      id: 'call-2',
      identifier: '+91 88776 65544',
      timestamp: 'Yesterday, 4:20 PM • Robocall Intercepted',
      badge: 'Courier KYC Extortion',
      summary: 'Automated IVR claimed an illegal parcel was intercepted requiring immediate verification payment.'
    }
  ];

  return (
    <div className="w-full flex-1 flex flex-col font-sans select-none overflow-y-auto pb-28">
      {/* ── 1. TopAppBar ── */}
      <header className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-md border-b border-[#2A2A2E] flex justify-between items-center w-full px-5 py-3.5">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8A8F9E] hover:text-[#F2F2F3] active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Back
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-white" />
          <h1 className="font-bold text-sm text-[#F2F2F3]">Security History</h1>
        </div>
        <div className="w-7 h-7 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center font-bold text-xs text-white">
          {user?.name ? user.name[0].toUpperCase() : 'U'}
        </div>
      </header>

      {/* ── 2. Main Content Canvas ── */}
      <main className="flex-1 px-4 py-4 flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#8A8F9E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search threats, VPAs, numbers..."
            className="w-full bg-[#0A0A0B] border border-[#2A2A2E] rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-[#F2F2F3] placeholder-[#4A4A4F] focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Tier-5 Filter Chips Bar */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-0.5">
          {[
            { id: 'prechecks', label: 'All Activity' },
            { id: 'calls', label: 'Blocked Scams', count: '18' },
            { id: 'warnings', label: 'Warnings', count: '14' },
            { id: 'tickets', label: 'Safe Payees', count: '4' },
          ].map((chip) => {
            const isActive = activeTab === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveTab(chip.id)}
                className={`${isActive ? 'tier-5-chip-active' : 'tier-5-chip-inactive'} flex items-center gap-1.5 whitespace-nowrap`}
              >
                <span>{chip.label}</span>
                {chip.count && (
                  <span className="text-[9px] opacity-70 font-mono">({chip.count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── TIMELINE: TODAY ── */}
        <section className="flex flex-col gap-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A8F9E] px-1 font-mono">
            TODAY
          </div>

          {activeTab === 'calls' ? (
            callAlerts
              .filter(item => item.identifier.toLowerCase().includes(searchQuery.toLowerCase()) || item.summary.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <div 
                  key={item.id} 
                  className="bg-[#131315] border border-[#2A2A2E] rounded-[18px] p-4 flex flex-col gap-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center">
                        <Phone className="w-4 h-4 text-[#FF4B4B]" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#F2F2F3] font-mono">{item.identifier}</h3>
                        <p className="text-[11px] text-[#8A8F9E]">{item.timestamp}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded border bg-[#FF4B4B]/10 border-[#FF4B4B]/30 text-[#FF4B4B]">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-[11.5px] text-[#8A8F9E] leading-snug">
                    {item.summary}
                  </p>
                </div>
              ))
          ) : (
            preCheckHistory
              .filter(item => item.vpa.toLowerCase().includes(searchQuery.toLowerCase()) || item.payee.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <div 
                  key={item.id} 
                  className="bg-[#131315] border border-[#2A2A2E] rounded-[18px] p-4 flex flex-col gap-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1D1D20] border border-[#2A2A2E] flex items-center justify-center">
                        {item.riskScore > 50 ? (
                          <AlertTriangle className="w-4 h-4 text-[#FF4B4B]" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-[#3ECF7A]" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#F2F2F3] font-mono">{item.vpa}</h3>
                        <p className="text-[11px] text-[#8A8F9E]">{item.payee} • {item.timestamp}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded border ${
                      item.riskScore > 50 
                        ? 'bg-[#FF4B4B]/10 border-[#FF4B4B]/30 text-[#FF4B4B]' 
                        : 'bg-[#3ECF7A]/10 border-[#3ECF7A]/30 text-[#3ECF7A]'
                    }`}>
                      {item.riskScore > 50 ? 'BLOCKED' : 'SAFE'}
                    </span>
                  </div>

                  <div className="bg-[#0A0A0B] border border-[#2A2A2E] rounded-lg p-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-[#8A8F9E]">{item.note}</span>
                    <span className="font-mono font-semibold text-[#F2F2F3]">{item.amount}</span>
                  </div>
                </div>
              ))
          )}
        </section>
      </main>
    </div>
  );
}
