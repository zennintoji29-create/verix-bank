import React, { useState, useEffect } from 'react';
import { 
  Building2, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, 
  XCircle, RefreshCw, Filter, Search, Database, Users, TrendingUp, 
  Sparkles, Lock, ArrowUpRight, Clock, User, Phone, Check, AlertOctagon, 
  Terminal, MapPin, Mail, Key, Landmark, ArrowRight, LogOut, Shield,
  Radio, BellRing, FileAudio, Upload, Mic, Play, Square, FileText, ChevronRight,
  ExternalLink, Eye, PlusCircle, AlertCircle, History, Trash2, Archive, RotateCcw,
  Download, Copy, ChevronLeft, ChevronsLeft, ChevronsRight, X, Layers,
  Globe, BarChart3, Activity, Gauge, Map, Sliders, Cpu, GitBranch, Target, Zap,
  DollarSign, Crosshair, Award, CheckSquare, ChevronDown, PieChart, Volume2, Satellite
} from 'lucide-react';
import { INITIAL_THREAT_RECORDS } from '../threatData.js';
import { playRegionalVoiceWarning, playThreatSiren } from '../utils/audioAlerts.js';

// ════════════════════════════════════════════════════════════════════════════════
// 100% INDIA GEOSPATIAL FRAUD THREAT DATASET (State-by-State Drilldown & PIN Codes)
// ════════════════════════════════════════════════════════════════════════════════

const INDIA_STATES_HEATMAP_DATA = [
  {
    id: 'JH',
    state: 'JHARKHAND',
    capital: 'Ranchi',
    hotspots: 'Jamtara, Deoghar, Giridih, Dumka',
    riskIndex: 96.8,
    activeThreatNodes: 3840,
    blockedVolumeCr: '18.40',
    primaryModus: 'Bank KYC Expiry, SIM Swap & AnyDesk Screen Share',
    topMuleBanks: ['State Bank of India', 'Punjab National Bank', 'India Post'],
    dominantBranchIFSC: ['SBIN0001234', 'PUNB0182400', 'IPOS0000001'],
    severity: 'CRITICAL',
    vulnerabilityRank: '#1',
    coordinates: { x: 67, y: 44 },
    pinCodes: [
      { pin: '815351', district: 'Jamtara', mules: 1420, blocked: '₹8.42 Cr', type: 'KYC' },
      { pin: '814112', district: 'Deoghar', mules: 980, blocked: '₹5.15 Cr', type: 'POWER_CUT' },
      { pin: '815301', district: 'Giridih', mules: 740, blocked: '₹3.20 Cr', type: 'REWARD' },
      { pin: '814101', district: 'Dumka', mules: 700, blocked: '₹1.63 Cr', type: 'SIM_SWAP' }
    ]
  },
  {
    id: 'HR',
    state: 'HARYANA',
    capital: 'Chandigarh',
    hotspots: 'Nuh, Gurugram, Faridabad, Palwal',
    riskIndex: 95.9,
    activeThreatNodes: 3620,
    blockedVolumeCr: '16.90',
    primaryModus: 'Sextortion, Police Impersonation & OLX Vehicle Scams',
    topMuleBanks: ['HDFC Bank', 'Axis Bank', 'IndusInd Bank'],
    dominantBranchIFSC: ['HDFC0001842', 'UTIB0002914', 'INDB0000412'],
    severity: 'CRITICAL',
    vulnerabilityRank: '#2',
    coordinates: { x: 38, y: 28 },
    pinCodes: [
      { pin: '122107', district: 'Nuh/Mewat', mules: 2180, blocked: '₹11.60 Cr', type: 'SEXTO' },
      { pin: '122002', district: 'Gurugram', mules: 890, blocked: '₹4.10 Cr', type: 'STOCK' },
      { pin: '121001', district: 'Faridabad', mules: 550, blocked: '₹1.20 Cr', type: 'OLX' }
    ]
  },
  {
    id: 'RJ',
    state: 'RAJASTHAN',
    capital: 'Jaipur',
    hotspots: 'Bharatpur, Alwar, Deeg, Jaipur',
    riskIndex: 94.7,
    activeThreatNodes: 3150,
    blockedVolumeCr: '14.20',
    primaryModus: 'Fake Army Officer OLX, Advance QR Code Requests',
    topMuleBanks: ['Bank of Baroda', 'State Bank of India', 'AU Small Finance'],
    dominantBranchIFSC: ['BARB0BHARAT', 'SBIN0000318', 'AUBL0002011'],
    severity: 'CRITICAL',
    vulnerabilityRank: '#3',
    coordinates: { x: 32, y: 35 },
    pinCodes: [
      { pin: '321001', district: 'Bharatpur', mules: 1840, blocked: '₹9.15 Cr', type: 'OLX_ARMY' },
      { pin: '301001', district: 'Alwar', mules: 810, blocked: '₹3.40 Cr', type: 'ADVANCE_QR' },
      { pin: '302001', district: 'Jaipur', mules: 500, blocked: '₹1.65 Cr', type: 'LOTTERY' }
    ]
  },
  {
    id: 'DL',
    state: 'DELHI NCR',
    capital: 'New Delhi',
    hotspots: 'Connaught Place, Dwarka, Noida Sec 62',
    riskIndex: 93.4,
    activeThreatNodes: 2980,
    blockedVolumeCr: '22.70',
    primaryModus: 'CBI / ED Digital Arrest & Customs Narcotic Parcel Extortion',
    topMuleBanks: ['ICICI Bank', 'HDFC Bank', 'Kotak Mahindra'],
    dominantBranchIFSC: ['ICIC0000007', 'HDFC0000003', 'KKBK0000195'],
    severity: 'CRITICAL',
    vulnerabilityRank: '#4',
    coordinates: { x: 41, y: 30 },
    pinCodes: [
      { pin: '110001', district: 'Connaught Pl', mules: 1120, blocked: '₹14.80 Cr', type: 'DIGITAL_ARREST' },
      { pin: '201309', district: 'Noida Sec 62', mules: 810, blocked: '₹6.75 Cr', type: 'POWER_CUT' },
      { pin: '110075', district: 'Dwarka', mules: 610, blocked: '₹3.10 Cr', type: 'CUSTOMS' }
    ]
  },
  {
    id: 'WB',
    state: 'WEST BENGAL',
    capital: 'Kolkata',
    hotspots: 'Salt Lake Sec V, Rajarhat, Asansol',
    riskIndex: 90.2,
    activeThreatNodes: 2450,
    blockedVolumeCr: '12.60',
    primaryModus: 'Fake Tech Support Call Centers & State Electricity Bill SMS',
    topMuleBanks: ['Bandhan Bank', 'State Bank of India', 'UCO Bank'],
    dominantBranchIFSC: ['BDBL0000124', 'SBIN0004087', 'UCBA0000014'],
    severity: 'CRITICAL',
    vulnerabilityRank: '#5',
    coordinates: { x: 74, y: 48 },
    pinCodes: [
      { pin: '700091', district: 'Salt Lake V', mules: 950, blocked: '₹8.20 Cr', type: 'TECH_SUPPORT' },
      { pin: '700001', district: 'Kolkata GPO', mules: 720, blocked: '₹3.10 Cr', type: 'POWER_CUT' },
      { pin: '713301', district: 'Asansol', mules: 490, blocked: '₹1.30 Cr', type: 'LOAN_WAIVER' }
    ]
  },
  {
    id: 'MH',
    state: 'MAHARASHTRA',
    capital: 'Mumbai',
    hotspots: 'Mumbai BKC, Pune, Thane, Navi Mumbai',
    riskIndex: 88.5,
    activeThreatNodes: 2890,
    blockedVolumeCr: '28.40',
    primaryModus: 'Institutional Stock Trading Mules & Pre-IPO Allotment Fraud',
    topMuleBanks: ['HDFC Bank', 'ICICI Bank', 'Standard Chartered'],
    dominantBranchIFSC: ['HDFC0000060', 'ICIC0000004', 'SCBL0036001'],
    severity: 'HIGH',
    vulnerabilityRank: '#6',
    coordinates: { x: 33, y: 56 },
    pinCodes: [
      { pin: '400051', district: 'Mumbai BKC', mules: 780, blocked: '₹18.50 Cr', type: 'STOCK_IPO' },
      { pin: '411001', district: 'Pune Cantt', mules: 620, blocked: '₹6.20 Cr', type: 'PRE_IPO' },
      { pin: '400601', district: 'Thane West', mules: 490, blocked: '₹3.70 Cr', type: 'TASK_FRAUD' }
    ]
  },
  {
    id: 'KA',
    state: 'KARNATAKA',
    capital: 'Bengaluru',
    hotspots: 'Koramangala, Whitefield, Mysuru, Hubballi',
    riskIndex: 86.1,
    activeThreatNodes: 2110,
    blockedVolumeCr: '17.30',
    primaryModus: 'Telegram Review/Rating Tasks & Crypto Arbitrage Scams',
    topMuleBanks: ['Canara Bank', 'Kotak Mahindra', 'State Bank of India'],
    dominantBranchIFSC: ['CNRB0000001', 'KKBK0000421', 'SBIN0000813'],
    severity: 'HIGH',
    vulnerabilityRank: '#7',
    coordinates: { x: 42, y: 72 },
    pinCodes: [
      { pin: '560001', district: 'Bengaluru GPO', mules: 620, blocked: '₹7.90 Cr', type: 'TELEGRAM_TASK' },
      { pin: '560034', district: 'Koramangala', mules: 510, blocked: '₹5.60 Cr', type: 'CRYPTO_OTC' },
      { pin: '570001', district: 'Mysuru Urban', mules: 380, blocked: '₹3.80 Cr', type: 'HOTEL_TASK' }
    ]
  },
  {
    id: 'GJ',
    state: 'GUJARAT',
    capital: 'Gandhinagar',
    hotspots: 'Surat, Ahmedabad Maninagar, Rajkot',
    riskIndex: 87.2,
    activeThreatNodes: 1980,
    blockedVolumeCr: '15.80',
    primaryModus: 'Layered Current Account Mules & Hawala UPI Integration',
    topMuleBanks: ['ICICI Bank', 'Axis Bank', 'Bank of Baroda'],
    dominantBranchIFSC: ['BARB0MANINA', 'ICIC0000045', 'UTIB0000112'],
    severity: 'HIGH',
    vulnerabilityRank: '#8',
    coordinates: { x: 23, y: 47 },
    pinCodes: [
      { pin: '380008', district: 'Maninagar', mules: 540, blocked: '₹9.40 Cr', type: 'HAWALA' },
      { pin: '395003', district: 'Surat Varachha', mules: 490, blocked: '₹4.30 Cr', type: 'CURRENT_MULE' },
      { pin: '360001', district: 'Rajkot Jn', mules: 360, blocked: '₹2.10 Cr', type: 'DIAMOND_QR' }
    ]
  },
  {
    id: 'TG',
    state: 'TELANGANA',
    capital: 'Hyderabad',
    hotspots: 'Cyberabad, HITEC City, Secunderabad',
    riskIndex: 84.6,
    activeThreatNodes: 1790,
    blockedVolumeCr: '11.90',
    primaryModus: 'Instant Micro-Loan Apps & Photo Morphed Blackmail',
    topMuleBanks: ['Union Bank of India', 'State Bank of India', 'ICICI Bank'],
    dominantBranchIFSC: ['UBIN0532185', 'HDFC0000521', 'SBIN0000851'],
    severity: 'HIGH',
    vulnerabilityRank: '#9',
    coordinates: { x: 46, y: 59 },
    pinCodes: [
      { pin: '500081', district: 'Madhapur', mules: 690, blocked: '₹6.10 Cr', type: 'LOAN_HARASS' },
      { pin: '500003', district: 'Secunderabad', mules: 450, blocked: '₹3.40 Cr', type: 'JOB_SCAM' }
    ]
  }
];

export default function BankPortal({ backendUrl, onOpenMobilePortal }) {
  // Session / Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loginForm, setLoginForm] = useState({
    fullName: 'Rajesh Verma, IPS',
    password: '••••••••••••',
    organization: 'State Bank of India',
    state: 'Karnataka',
    city: 'Bengaluru',
    pinCode: '560001',
    mobile: '9845012345'
  });

  // Navigation tabs: 'threat_heatmap' | 'database_search' | 'disputes' | 'statistics_impact' | 'audio_lab' | 'sim_carrier' | 'advisories'
  const [activeTab, setActiveTab] = useState('threat_heatmap');
  const [appeals, setAppeals] = useState([]);
  const [threats, setThreats] = useState(() => Array.isArray(INITIAL_THREAT_RECORDS) ? INITIAL_THREAT_RECORDS : []);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  
  // State Drilldown & Heatmap State
  const [selectedStateId, setSelectedStateId] = useState('JH');
  const [pinSearch, setPinSearch] = useState('');
  const [inspectorMode, setInspectorMode] = useState('UPI'); // 'UPI' | 'BANK'
  const [inspectorVpa, setInspectorVpa] = useState('cbi.arrest99@ybl');
  const [inspectorAcc, setInspectorAcc] = useState('50100432918231');
  const [inspectorIfsc, setInspectorIfsc] = useState('SBIN0001234');
  
  // Modals & Details
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAddThreatModal, setShowAddThreatModal] = useState(false);
  const [newThreatIdentifier, setNewThreatIdentifier] = useState('');
  const [newThreatCategory, setNewThreatCategory] = useState('DIGITAL_ARREST');
  const [newThreatDetails, setNewThreatDetails] = useState('');

  // ROI Slider
  const [simulatedTxnVolume, setSimulatedTxnVolume] = useState(100000);
  const [simulatedAvgTicket, setSimulatedAvgTicket] = useState(2500);

  // Selected state object
  const selectedState = INDIA_STATES_HEATMAP_DATA.find(s => s.id === selectedStateId) || INDIA_STATES_HEATMAP_DATA[0];

  const fetchPortalData = async () => {
    setLoading(true);
    try {
      const base = backendUrl || 'https://fruadsih.onrender.com';
      const [appealsRes, threatsRes] = await Promise.all([
        fetch(`${base}/api/v1/institution/appeals`).catch(() => null),
        fetch(`${base}/api/v1/threats/feed?limit=500`).catch(() => null)
      ]);

      if (appealsRes && appealsRes.ok) {
        const data = await appealsRes.json();
        setAppeals(data.data || []);
      }
      if (threatsRes && threatsRes.ok) {
        const data = await threatsRes.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          setThreats(data.data);
        }
      }
    } catch (e) {
      console.warn('Backend sync failed, using cached intelligence data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, []);

  const handleResolveAppeal = async (appealId, decision) => {
    try {
      const base = backendUrl || 'https://fruadsih.onrender.com';
      await fetch(`${base}/api/v1/institution/appeals/${appealId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: decision,
          reviewerNotes: `Reviewed and resolved by Nodal Officer ${loginForm.fullName}`,
          resolvedBy: loginForm.fullName
        })
      });

      setAppeals(prev => prev.map(a => {
        if ((a.appealId || a.ticketId) === appealId) {
          return { ...a, status: decision, resolvedAt: new Date().toISOString() };
        }
        return a;
      }));

      setActionSuccess(`Appeal ${appealId} marked as ${decision}`);
      setTimeout(() => setActionSuccess(''), 3000);
      setSelectedTicket(null);
    } catch (e) {
      alert('Error updating appeal: ' + e.message);
    }
  };

  const handleAddNewThreat = (e) => {
    e.preventDefault();
    if (!newThreatIdentifier) return;
    const isVpa = newThreatIdentifier.includes('@');
    const newRecord = {
      id: `VRX-THREAT-${Date.now()}`,
      identifier: newThreatIdentifier.trim(),
      type: isVpa ? 'VPA' : 'PHONE',
      category: newThreatCategory,
      riskScore: 95,
      isBlacklisted: true,
      source: `Manual Flag by ${loginForm.fullName}`,
      reportCount: 1,
      details: newThreatDetails || 'Flagged during live compliance review.',
      reportedAt: new Date().toISOString()
    };
    setThreats([newRecord, ...threats]);
    setShowAddThreatModal(false);
    setNewThreatIdentifier('');
    setNewThreatDetails('');
    setActionSuccess(`Added ${newThreatIdentifier} to distributed threat registry.`);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const pendingCount = appeals.filter(a => a && a.status === 'PENDING_REVIEW').length;

  // ════════════════════════════════════════════════════════════════════════════════
  // 1. SECURE ACCESS TERMINAL (LOGIN SCREEN)
  // ════════════════════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#fadcd9] flex flex-col font-mono selection:bg-[#00F0A0] selection:text-[#000000]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      >
        {/* Top Minimal Bar */}
        <header className="bg-[#000000] border-b border-white/[0.08] flex justify-between items-center px-6 h-16 fixed top-0 left-0 w-full z-50">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white font-sans">VERIX COMMAND</span>
          </div>
          <div className="flex items-center gap-4 text-[#e4bdba] text-xs">
            <span>SECURE TERMINAL ACCESS</span>
          </div>
        </header>

        {/* Login Form Container */}
        <main className="flex-1 flex items-center justify-center p-4 mt-16 pb-12 z-10">
          <div className="w-full max-w-2xl bg-[#10141C] border border-white/[0.08] p-8 flex flex-col gap-5 shadow-2xl">
            
            {/* Card Header */}
            <div className="flex flex-col items-center justify-center text-center pb-5 border-b border-white/[0.08]">
              <div className="w-14 h-14 rounded-full border-2 border-[#00F0A0] flex items-center justify-center mb-3 bg-black">
                <Landmark className="w-7 h-7 text-[#00F0A0]" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wide font-sans">VERIX COMMAND</h1>
              <p className="text-[11px] text-[#00F0A0] tracking-widest uppercase mt-1">
                NATIONAL CYBER DEFENSE AUTHORITY — SECURE ACCESS TERMINAL
              </p>
            </div>

            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="flex flex-col gap-4">
              
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-[#e4bdba]">Full Name</label>
                <input
                  type="text"
                  required
                  value={loginForm.fullName}
                  onChange={(e) => setLoginForm({ ...loginForm, fullName: e.target.value })}
                  placeholder="ENTER AUTHORIZED NAME"
                  className="bg-[#171E2B] border border-white/[0.08] p-3 text-xs text-[#fadcd9] focus:outline-none focus:border-[#00F0A0]"
                />
              </div>

              {/* Admin Password */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-[#e4bdba]">Admin Password</label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="bg-[#171E2B] border border-white/[0.08] p-3 text-xs text-[#fadcd9] tracking-widest focus:outline-none focus:border-[#00F0A0]"
                />
              </div>

              {/* Organization & State Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#e4bdba]">Bank / Government Body</label>
                  <select
                    value={loginForm.organization}
                    onChange={(e) => setLoginForm({ ...loginForm, organization: e.target.value })}
                    className="bg-[#171E2B] border border-white/[0.08] p-3 text-xs text-[#fadcd9] focus:outline-none focus:border-[#00F0A0]"
                  >
                    <option value="State Bank of India">STATE BANK OF INDIA (SBI)</option>
                    <option value="Reserve Bank of India">RESERVE BANK OF INDIA (RBI)</option>
                    <option value="Ministry of Home Affairs">I4C / MINISTRY OF HOME AFFAIRS</option>
                    <option value="HDFC Bank">HDFC BANK CYBER CELL</option>
                    <option value="ICICI Bank">ICICI FRAUD CONTROL DESK</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#e4bdba]">State Jurisdiction</label>
                  <select
                    value={loginForm.state}
                    onChange={(e) => setLoginForm({ ...loginForm, state: e.target.value })}
                    className="bg-[#171E2B] border border-white/[0.08] p-3 text-xs text-[#fadcd9] focus:outline-none focus:border-[#00F0A0]"
                  >
                    <option value="Karnataka">KARNATAKA (BLR-01)</option>
                    <option value="Maharashtra">MAHARASHTRA (MUM-BKC)</option>
                    <option value="Delhi NCT">DELHI NCR (DL-01-NX)</option>
                    <option value="Jharkhand">JHARKHAND (JAM-01)</option>
                    <option value="Haryana">HARYANA (NUH-MEW)</option>
                    <option value="West Bengal">WEST BENGAL (KOL-SALT)</option>
                  </select>
                </div>
              </div>

              {/* City, PIN & Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#e4bdba]">City</label>
                  <input
                    type="text"
                    value={loginForm.city}
                    onChange={(e) => setLoginForm({ ...loginForm, city: e.target.value })}
                    className="bg-[#171E2B] border border-white/[0.08] p-3 text-xs text-[#fadcd9] focus:outline-none focus:border-[#00F0A0]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#e4bdba]">PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={loginForm.pinCode}
                    onChange={(e) => setLoginForm({ ...loginForm, pinCode: e.target.value })}
                    className="bg-[#171E2B] border border-white/[0.08] p-3 text-xs text-[#fadcd9] focus:outline-none focus:border-[#00F0A0]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#e4bdba]">Mobile Number</label>
                  <div className="flex">
                    <span className="bg-[#10141C] border border-r-0 border-white/[0.08] p-3 text-xs text-[#e4bdba]">+91</span>
                    <input
                      type="tel"
                      value={loginForm.mobile}
                      onChange={(e) => setLoginForm({ ...loginForm, mobile: e.target.value })}
                      className="bg-[#171E2B] border border-white/[0.08] p-3 text-xs text-[#fadcd9] w-full focus:outline-none focus:border-[#00F0A0]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Submit */}
              <button
                type="submit"
                className="w-full py-4 mt-2 bg-[#00F0A0] hover:bg-[#00e296] text-black font-bold text-sm tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Terminal className="w-4 h-4" />
                INITIALIZE TERMINAL
              </button>
            </form>

            <div className="pt-3 border-t border-white/[0.08] text-center">
              <p className="text-[11px] text-[#e4bdba] opacity-70 tracking-wider">
                UNAUTHORIZED ACCESS IS PROHIBITED BY I4C PROTOCOLS. ALL SESSIONS MONITORED.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════════
  // 2. FULL-BLOWN MISSION CONTROL DASHBOARD
  // ════════════════════════════════════════════════════════════════════════════════
  return (
    <div className="h-screen bg-[#000000] text-[#fadcd9] flex flex-col font-mono overflow-hidden selection:bg-[#00F0A0] selection:text-[#000000]">
      
      {/* ── TOP NAV BAR ── */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 border-b border-white/[0.08] bg-[#000000] h-16">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Landmark className="w-6 h-6 text-[#FF4B4B]" />
            <h1 className="text-lg font-bold text-[#FF4B4B] tracking-tight uppercase whitespace-nowrap font-sans">
              VERIX COMMAND
            </h1>
          </div>
          <div className="h-6 w-px bg-white/[0.08] mx-2 hidden sm:block" />
          <span className="hidden lg:inline-block px-2 py-1 bg-[#171E2B] border border-white/[0.08] text-[#fadcd9] text-[10.5px] uppercase">
            I4C &amp; NPCI NATIONAL CYBER DEFENSE NODE
          </span>
        </div>

        {/* Center Telemetry Ribbon */}
        <div className="hidden xl:flex flex-1 justify-center px-4">
          <div className="flex items-center gap-4 px-4 py-1.5 bg-[#171E2B] border border-white/[0.08] text-xs whitespace-nowrap">
            <span className="text-[#00EF9F] flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00EF9F] animate-pulse" />
              Pre-Auth Shield: ACTIVE
            </span>
            <span className="text-white/[0.2]">|</span>
            <span className="text-[#fadcd9]">Fraud Prevented: <strong className="text-white">₹14.82 Cr</strong></span>
            <span className="text-white/[0.2]">|</span>
            <span className="text-[#fadcd9]">Latency: <span className="text-[#00EF9F]">184ms</span></span>
            <span className="text-white/[0.2]">|</span>
            <span className="text-[#fadcd9]">ML Accuracy: <strong className="text-white">98.6%</strong></span>
            <span className="text-white/[0.2]">|</span>
            <span className="text-[#fadcd9]">False Negatives: <strong className="text-[#00EF9F]">0.00%</strong></span>
          </div>
        </div>

        {/* Right Officer Profile & Containment */}
        <div className="flex items-center gap-3">
          {onOpenMobilePortal && (
            <button
              onClick={onOpenMobilePortal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#10141C] hover:bg-[#171E2B] border border-[#00F0A0]/30 text-[#00F0A0] text-xs font-bold transition-all cursor-pointer"
            >
              <span>📱 Mobile View</span>
            </button>
          )}

          <div className="flex items-center gap-2 border border-white/[0.08] bg-[#171E2B] px-2.5 py-1">
            <div className="w-6 h-6 bg-black border border-white/[0.1] flex items-center justify-center text-[10px] text-[#00F0A0] font-bold">
              RV
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs text-[#fadcd9] leading-tight font-bold">{loginForm.fullName}</span>
              <span className="text-[9px] text-[#e4bdba] leading-tight">{loginForm.organization}</span>
            </div>
          </div>

          <button
            onClick={() => {
              playThreatSiren();
              setActionSuccess('EMERGENCY CONTAINMENT ACTIVATED: 100% PRE-AUTH HARD LOCK ENGAGED');
              setTimeout(() => setActionSuccess(''), 4000);
            }}
            className="bg-[#FF4B4B] hover:bg-rose-600 text-black font-bold text-xs px-3.5 py-2 transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
          >
            <AlertOctagon className="w-4 h-4" />
            <span className="hidden sm:inline">EMERGENCY CONTAINMENT</span>
          </button>
        </div>
      </header>

      {/* ── ACTION NOTIFICATION TOAST ── */}
      {actionSuccess && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#00F0A0] text-black text-xs font-bold flex items-center gap-2 shadow-2xl">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* ── MAIN WORKSPACE BODY ── */}
      <div className="flex flex-1 pt-16 h-full overflow-hidden">
        
        {/* ── LEFT NAVIGATION RAIL (W-60 COMPACT) ── */}
        <nav className="w-60 border-r border-white/[0.08] bg-[#10141C] flex flex-col shrink-0">
          
          <div className="p-4 border-b border-white/[0.08] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-white/[0.1] bg-black flex items-center justify-center text-[#00F0A0]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">NATIONAL DEFENSE</div>
              <div className="text-[10px] text-[#e4bdba]">V-01 COMMAND</div>
            </div>
          </div>

          {/* Nav Items (7-Module Exact Order) */}
          <div className="flex-1 py-3 overflow-y-auto flex flex-col gap-1 px-2">
            {[
              { id: 'threat_heatmap', label: 'Threat Heatmaps', icon: Globe, count: null },
              { id: 'database_search', label: 'Threat Registry', icon: Database, count: threats.length.toLocaleString() },
              { id: 'disputes', label: 'Appeals Review', icon: FileText, count: pendingCount > 0 ? `${pendingCount} PENDING` : null, alert: pendingCount > 0 },
              { id: 'statistics_impact', label: 'ROI Analytics', icon: BarChart3, count: '₹14.8Cr' },
              { id: 'audio_lab', label: 'Voice Phishing Lab', icon: Mic, count: 'AI' },
              { id: 'sim_carrier', label: 'SIM Swap Monitor', icon: Radio, count: 'IMSI' },
              { id: 'advisories', label: 'I4C Advisories', icon: BellRing, count: '3' }
            ].map(({ id, label, icon: Icon, count, alert }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs transition-all cursor-pointer text-left ${
                  activeTab === id
                    ? 'bg-[#171E2B] text-[#00F0A0] border-l-4 border-[#00F0A0] font-bold'
                    : 'text-[#e4bdba] hover:bg-[#171E2B] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span className="uppercase text-[11px]">{label}</span>
                </div>
                {count && (
                  <span className={`text-[9px] px-1.5 py-0.5 border ${
                    alert ? 'border-amber-400 bg-amber-400/20 text-amber-300 animate-pulse' : 'border-white/[0.08] bg-[#10141C] text-white'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Footer Telemetry */}
          <div className="p-3 border-t border-white/[0.08] space-y-2">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="w-full py-1.5 border border-white/[0.08] bg-transparent text-[#fadcd9] hover:bg-[#171E2B] text-[11px] uppercase transition-colors"
            >
              LOGOUT TERMINAL
            </button>
            <div className="flex items-center justify-between text-[10px] text-[#e4bdba]">
              <span>STATION: {loginForm.state.substring(0, 3).toUpperCase()}-01-NX</span>
              <span className="flex items-center gap-1 text-[#00EF9F]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00EF9F] animate-pulse" />
                DB_SYNC_OK
              </span>
            </div>
          </div>
        </nav>

        {/* ── CENTER WORKSPACE ── */}
        <main className="flex-1 flex flex-col p-2 gap-2 mr-80 overflow-hidden bg-[#000000]">
          
          {/* ══════════════════════════════════════════════════════════════
              TAB 1: THREAT HEATMAPS (100% INDIA DRILLDOWN)
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'threat_heatmap' && (
            <div className="flex-1 flex flex-col gap-2 min-h-0">
              
              {/* 60/40 Split Canvas */}
              <div className="flex-1 flex gap-2 min-h-0">
                
                {/* Left 60%: India Geospatial Telemetry */}
                <div className="w-3/5 bg-[#10141C] border border-white/[0.08] flex flex-col relative overflow-hidden">
                  
                  {/* Top Header of Map */}
                  <div className="p-2.5 bg-[#171E2B] border-b border-white/[0.08] flex justify-between items-center z-10">
                    <div className="flex items-center gap-2">
                      <Satellite className="w-4 h-4 text-[#00F0A0]" />
                      <span className="text-[11px] uppercase tracking-wider text-white font-bold">
                        India Geospatial Telemetry
                      </span>
                    </div>

                    {/* State Selector Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#e4bdba]">Focus:</span>
                      <select
                        value={selectedStateId}
                        onChange={(e) => setSelectedStateId(e.target.value)}
                        className="bg-[#000000] border border-white/[0.1] text-xs text-[#00F0A0] py-0.5 px-2 focus:outline-none"
                      >
                        {INDIA_STATES_HEATMAP_DATA.map(st => (
                          <option key={st.id} value={st.id}>{st.vulnerabilityRank} {st.state} ({st.riskIndex}%)</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Interactive Vector Grid Map Canvas */}
                  <div className="flex-1 relative flex items-center justify-center p-4"
                    style={{
                      backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
                      backgroundSize: '32px 32px'
                    }}
                  >
                    {/* SVG Base India Geometric Wireframe */}
                    <svg viewBox="0 0 100 100" className="w-full h-full max-h-72 opacity-80 filter drop-shadow-[0_0_15px_rgba(0,240,160,0.15)]">
                      <path
                        d="M 38 12 L 48 8 L 54 14 L 46 22 L 56 26 L 68 28 L 74 36 L 86 38 L 82 46 L 72 48 L 68 56 L 62 66 L 52 86 L 46 88 L 44 76 L 36 64 L 28 54 L 20 48 L 22 36 L 30 26 Z"
                        fill="#171E2B"
                        stroke="#00F0A0"
                        strokeWidth="0.8"
                        strokeDasharray="2 1"
                      />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#00D2FF" strokeWidth="0.2" strokeOpacity="0.4" />
                      <circle cx="50" cy="50" r="25" fill="none" stroke="#FF4B4B" strokeWidth="0.2" strokeOpacity="0.4" />
                    </svg>

                    {/* Interactive State Pins */}
                    {INDIA_STATES_HEATMAP_DATA.map(st => {
                      const isSelected = st.id === selectedStateId;
                      return (
                        <button
                          key={st.id}
                          onClick={() => setSelectedStateId(st.id)}
                          style={{ left: `${st.coordinates.x}%`, top: `${st.coordinates.y}%` }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 cursor-pointer transition-all z-20 ${
                            isSelected ? 'scale-150 ring-2 ring-[#00F0A0]' : 'hover:scale-125'
                          }`}
                          title={`${st.state}: ${st.riskIndex}% Risk`}
                        >
                          <span className={`w-2.5 h-2.5 block rounded-full ${
                            st.riskIndex >= 90 ? 'bg-[#FF4B4B] animate-pulse shadow-[0_0_10px_#FF4B4B]' : 'bg-[#00D2FF]'
                          }`} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Map Status */}
                  <div className="p-2 border-t border-white/[0.08] bg-[#171E2B] flex justify-between items-center text-[10px] text-[#e4bdba]">
                    <span>CURRENT JURISDICTION: <strong className="text-white">{selectedState.state}</strong></span>
                    <span className="text-[#00F0A0]">NODES: {selectedState.activeThreatNodes.toLocaleString()}</span>
                  </div>
                </div>

                {/* Right 40%: State Dossier Panel */}
                <div className="w-2/5 bg-[#10141C] border border-white/[0.08] flex flex-col">
                  
                  <div className="p-3 border-b border-white/[0.08] bg-[#171E2B] flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h2 className="text-base font-bold text-white font-sans">{selectedState.state}</h2>
                      <div className="text-right">
                        <div className="text-[9px] text-[#e4bdba] uppercase">Threat Index</div>
                        <div className="text-2xl text-[#FF4B4B] font-bold leading-none">{selectedState.riskIndex}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1 border-t border-white/[0.08] pt-1 text-xs">
                      <div>
                        <div className="text-[9px] text-[#e4bdba]">Blocked (24H)</div>
                        <div className="text-white font-bold">₹{selectedState.blockedVolumeCr} Cr</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#e4bdba]">Hotspots</div>
                        <div className="text-amber-300 text-[10px] truncate">{selectedState.hotspots}</div>
                      </div>
                    </div>
                  </div>

                  {/* Dense Data Table for PIN Codes */}
                  <div className="flex-1 overflow-auto flex flex-col">
                    <div className="px-2.5 py-1.5 bg-[#171E2B] border-b border-white/[0.08] text-[10px] text-[#e4bdba] flex justify-between">
                      <span>HOT PIN CODES ({selectedState.state})</span>
                      <span>MULES</span>
                    </div>

                    <div className="w-full text-[11px]">
                      <div className="flex w-full bg-[#10141C] border-b border-white/[0.08] text-[#e4bdba] px-2 py-1 text-[10px]">
                        <div className="w-1/4">PIN</div>
                        <div className="w-2/4">DISTRICT</div>
                        <div className="w-1/4 text-right">MULES</div>
                      </div>

                      {selectedState.pinCodes.map(p => (
                        <div key={p.pin} className="flex w-full px-2 py-1.5 border-b border-white/[0.04] hover:bg-[#171E2B] text-white cursor-pointer">
                          <div className="w-1/4 text-[#00F0A0]">{p.pin}</div>
                          <div className="w-2/4 truncate text-[#e4bdba]">{p.district}</div>
                          <div className="w-1/4 text-right text-[#FF4B4B] font-bold">{p.mules}</div>
                        </div>
                      ))}
                    </div>

                    <div className="p-2 border-t border-white/[0.08] mt-auto">
                      <div className="text-[9px] text-[#e4bdba] mb-1">FLAGGED IFSC BRANCHES</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedState.dominantBranchIFSC.map(ifsc => (
                          <span key={ifsc} className="px-1.5 py-0.5 bg-[#171E2B] border border-white/[0.08] text-[10px] text-[#00F0A0]">
                            {ifsc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Row (3 Columns) */}
              <div className="h-36 flex gap-2 shrink-0">
                
                {/* 5a: Target Locator */}
                <div className="w-1/4 bg-[#10141C] border border-white/[0.08] p-3 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-white flex items-center gap-1.5 font-bold uppercase mb-1">
                      <Search className="w-3.5 h-3.5 text-[#00F0A0]" />
                      Target Locator
                    </div>
                    <p className="text-[10px] text-[#e4bdba]">Enter 6-digit PIN or IFSC for rapid dossier extraction.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-[#e4bdba] text-xs">&gt;</span>
                    <input
                      type="text"
                      value={pinSearch}
                      onChange={(e) => setPinSearch(e.target.value)}
                      placeholder="PIN / IFSC..."
                      className="w-full bg-[#171E2B] border border-white/[0.08] text-white text-xs py-1.5 pl-6 pr-2 focus:outline-none focus:border-[#00F0A0]"
                    />
                  </div>
                </div>

                {/* 5b: Explainable AI (XAI) Vector */}
                <div className="flex-1 bg-[#10141C] border border-white/[0.08] p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-white flex items-center gap-1.5 font-bold uppercase">
                      <Cpu className="w-3.5 h-3.5 text-[#00D2FF]" />
                      XAI Risk Vector (HELF Equation)
                    </span>
                    <div className="text-[10px] text-white bg-[#171E2B] px-2 py-0.5 border border-white/[0.08]">
                      S = 0.70·(0.20·P_LR + 0.45·P_RF + 0.35·P_XGB) + 0.30·A_IF
                    </div>
                  </div>

                  <div className="space-y-1.5 px-2">
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="w-16 text-right text-[#e4bdba]">VELOCITY</span>
                      <div className="flex-1 h-2.5 bg-[#171E2B] border border-white/[0.08] relative">
                        <div className="bg-[#FF4B4B] h-full" style={{ width: '75%' }} />
                      </div>
                      <span className="w-10 text-[#FF4B4B] font-bold">+0.42</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="w-16 text-right text-[#e4bdba]">VPA_TRUST</span>
                      <div className="flex-1 h-2.5 bg-[#171E2B] border border-white/[0.08] relative">
                        <div className="bg-[#00F0A0] h-full" style={{ width: '45%' }} />
                      </div>
                      <span className="w-10 text-[#00F0A0] font-bold">-0.18</span>
                    </div>
                  </div>
                </div>

                {/* 5c: Real-time Yield ROI */}
                <div className="w-72 bg-[#10141C] border border-white/[0.08] p-3 flex flex-col justify-between">
                  <div className="text-[11px] text-[#e4bdba] uppercase font-bold">Real-Time Yield</div>
                  <div>
                    <div className="flex justify-between text-[10px] text-[#e4bdba] mb-1">
                      <span>Interdiction Rate:</span>
                      <span className="text-white font-bold">98.6%</span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="1000000"
                      step="10000"
                      value={simulatedTxnVolume}
                      onChange={(e) => setSimulatedTxnVolume(Number(e.target.value))}
                      className="w-full accent-[#00F0A0] cursor-pointer h-1 bg-[#171E2B]"
                    />
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-[#e4bdba] uppercase">Est. Citizen Capital Saved</div>
                    <div className="text-xl font-bold text-[#00EF9F]">
                      ₹{((simulatedTxnVolume * 365 * 0.0062 * simulatedAvgTicket * 0.986) / 10000000).toFixed(2)} Cr
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 2: THREAT REGISTRY DATABASE (FULL SEARCH TABLE)
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'database_search' && (
            <div className="flex-1 bg-[#10141C] border border-white/[0.08] p-4 flex flex-col gap-3 overflow-hidden">
              <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#00F0A0]" />
                  <h2 className="text-sm font-bold text-white uppercase">National Threat Registry Database ({threats.length.toLocaleString()} Records)</h2>
                </div>
                <button
                  onClick={() => setShowAddThreatModal(true)}
                  className="px-3 py-1.5 bg-[#00F0A0] text-black font-bold text-xs uppercase cursor-pointer"
                >
                  + Add Record
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-[#e4bdba] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by VPA, Phone, or IFSC..."
                  className="w-full bg-[#171E2B] border border-white/[0.08] py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#00F0A0]"
                />
              </div>

              <div className="flex-1 overflow-y-auto border border-white/[0.08]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#171E2B] text-[#e4bdba] uppercase text-[10px] sticky top-0">
                    <tr>
                      <th className="p-2.5">Identifier</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Risk</th>
                      <th className="p-2.5">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {threats
                      .filter(t => !searchQuery || t.identifier?.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 50)
                      .map((t, idx) => (
                        <tr key={idx} className="border-b border-white/[0.04] hover:bg-[#171E2B] text-white">
                          <td className="p-2.5 font-bold text-[#00F0A0]">{t.identifier}</td>
                          <td className="p-2.5">{t.type}</td>
                          <td className="p-2.5 text-[#e4bdba]">{t.category}</td>
                          <td className="p-2.5 text-[#FF4B4B] font-bold">{t.riskScore || 95}%</td>
                          <td className="p-2.5 text-[10px] text-[#e4bdba] truncate max-w-xs">{t.source || 'I4C Distributed Feed'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 3: APPEALS REVIEW QUEUE
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'disputes' && (
            <div className="flex-1 bg-[#10141C] border border-white/[0.08] p-4 flex flex-col gap-3 overflow-hidden">
              <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
                <h2 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  False-Positive Appeals Review Desk ({appeals.length} Tickets)
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2">
                {appeals.length === 0 ? (
                  <div className="p-8 text-center text-[#e4bdba] bg-[#171E2B] border border-white/[0.08]">
                    No pending appeals in queue. All false-positive reviews are clear.
                  </div>
                ) : (
                  appeals.map(a => (
                    <div key={a.appealId || a.ticketId} className="p-3 bg-[#171E2B] border border-white/[0.08] flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[#00F0A0] font-bold">{a.appealId || a.ticketId}</div>
                        <div className="text-white">VPA: {a.vpa} • ₹{a.amount}</div>
                        <div className="text-[10px] text-[#e4bdba]">{a.reason || 'Merchant account incorrectly flagged'}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolveAppeal(a.appealId || a.ticketId, 'APPROVED')}
                          className="px-3 py-1 bg-[#00F0A0] text-black font-bold uppercase text-[11px] cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleResolveAppeal(a.appealId || a.ticketId, 'REJECTED')}
                          className="px-3 py-1 bg-[#FF4B4B] text-white font-bold uppercase text-[11px] cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 4: ROI & LOSS REDUCTION TELEMETRY
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'statistics_impact' && (
            <div className="flex-1 bg-[#10141C] border border-white/[0.08] p-5 flex flex-col gap-4 overflow-y-auto">
              <h2 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/[0.08] pb-3">
                <BarChart3 className="w-4 h-4 text-[#00F0A0]" />
                Financial Loss Reduction &amp; Bank ROI Analytics
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#171E2B] border border-white/[0.08] space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#e4bdba]">Daily UPI Txn Volume:</span>
                    <strong className="text-[#00F0A0]">{simulatedTxnVolume.toLocaleString()}</strong>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={simulatedTxnVolume}
                    onChange={(e) => setSimulatedTxnVolume(Number(e.target.value))}
                    className="w-full accent-[#00F0A0] cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-[#171E2B] border border-white/[0.08] space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#e4bdba]">Avg Ticket Size:</span>
                    <strong className="text-[#00F0A0]">₹{simulatedAvgTicket.toLocaleString()}</strong>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="25000"
                    step="500"
                    value={simulatedAvgTicket}
                    onChange={(e) => setSimulatedAvgTicket(Number(e.target.value))}
                    className="w-full accent-[#00F0A0] cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#00F0A0]/10 border border-[#00F0A0] flex justify-between items-center">
                <div>
                  <span className="text-xs text-[#e4bdba] block">Projected Annual Savings with VERIX:</span>
                  <strong className="text-3xl font-bold text-[#00F0A0]">
                    ₹{((simulatedTxnVolume * 365 * 0.0062 * simulatedAvgTicket * 0.986) / 10000000).toFixed(2)} Cr
                  </strong>
                </div>
                <span className="text-xs bg-[#00F0A0] text-black px-3 py-1 font-bold">
                  98.6% MITIGATION RATE
                </span>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 5: VOICE PHISHING LAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'audio_lab' && (
            <div className="flex-1 bg-[#10141C] border border-white/[0.08] p-5 flex flex-col gap-4 overflow-y-auto">
              <h2 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/[0.08] pb-3">
                <Mic className="w-4 h-4 text-purple-400" />
                Live Voice Phishing &amp; Linguistic Deception Teleprompter
              </h2>

              <div className="p-4 bg-[#171E2B] border border-white/[0.08] space-y-2">
                <span className="text-xs text-purple-300 font-bold uppercase">Groq Whisper Large v3 Transcription Stream:</span>
                <p className="text-xs text-white leading-relaxed p-3 bg-black border border-white/[0.08]">
                  "This is <span className="text-[#FF4B4B] font-bold">[Mumbai Police Cyber Crime Cell]</span>. An arrest warrant has been issued under <span className="text-[#FF4B4B] font-bold">[Section 41A CrPC]</span>. Transfer <span className="text-[#FF4B4B] font-bold">[₹25,000 security bail deposit]</span> immediately."
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 bg-[#171E2B] border border-white/[0.08]">
                  <span className="text-[10px] text-[#e4bdba]">COERCION PROBABILITY</span>
                  <div className="text-xl font-bold text-[#FF4B4B]">95.4%</div>
                </div>
                <div className="p-3 bg-[#171E2B] border border-white/[0.08]">
                  <span className="text-[10px] text-[#e4bdba]">DETECTED DIALECT</span>
                  <div className="text-xl font-bold text-[#00F0A0]">BHOJPURI-HINDI</div>
                </div>
                <div className="p-3 bg-[#171E2B] border border-white/[0.08]">
                  <span className="text-[10px] text-[#e4bdba]">VOIP HOP COUNT</span>
                  <div className="text-xl font-bold text-cyan-300">4 PROXIES</div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 6: SIM SWAP & IMSI MONITOR
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'sim_carrier' && (
            <div className="flex-1 bg-[#10141C] border border-white/[0.08] p-5 flex flex-col gap-4 overflow-y-auto">
              <h2 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/[0.08] pb-3">
                <Radio className="w-4 h-4 text-blue-400" />
                Telecom SIM Swap &amp; IMSI Anomaly Tracker
              </h2>

              <div className="p-4 bg-[#171E2B] border border-white/[0.08] space-y-2">
                <span className="text-xs text-[#00F0A0] font-bold uppercase">Active Carrier Feed: Airtel, Jio, Vi</span>
                <p className="text-xs text-[#e4bdba]">
                  Monitors real-time SIM card replacements and IMSI resets within the last 48 hours to block SMS OTP hijacking.
                </p>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 7: I4C NATIONAL ADVISORIES
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'advisories' && (
            <div className="flex-1 bg-[#10141C] border border-white/[0.08] p-5 flex flex-col gap-4 overflow-y-auto">
              <h2 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/[0.08] pb-3">
                <BellRing className="w-4 h-4 text-amber-400" />
                I4C &amp; RBI National Security Advisories (2026)
              </h2>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#171E2B] border border-white/[0.08]">
                  <strong className="text-white">ADV-2026-08:</strong> Coercive Digital Arrest Video Calls impersonating CBI &amp; Mumbai Police.
                </div>
                <div className="p-3 bg-[#171E2B] border border-white/[0.08]">
                  <strong className="text-white">ADV-2026-04:</strong> Fake Electricity Bill Power-Cut APKs sent via WhatsApp.
                </div>
              </div>
            </div>
          )}

        </main>

        {/* ── RIGHT INSPECTOR PANEL (W-80 DOCKED) ── */}
        <aside className="fixed right-0 top-16 h-[calc(100vh-64px)] w-80 bg-[#10141C] border-l border-white/[0.08] flex flex-col z-40">
          
          {/* Dual Tabs */}
          <div className="flex w-full border-b border-white/[0.08] bg-[#171E2B]">
            <button
              onClick={() => setInspectorMode('UPI')}
              className={`flex-1 py-2 text-[11px] uppercase text-center font-bold transition-all cursor-pointer ${
                inspectorMode === 'UPI' ? 'bg-[#10141C] text-[#FF4B4B] border-b-2 border-[#FF4B4B]' : 'text-[#e4bdba] hover:bg-[#10141C]'
              }`}
            >
              ⚡ UPI Stream
            </button>
            <button
              onClick={() => setInspectorMode('BANK')}
              className={`flex-1 py-2 text-[11px] uppercase text-center font-bold transition-all cursor-pointer ${
                inspectorMode === 'BANK' ? 'bg-[#10141C] text-[#00F0A0] border-b-2 border-[#00F0A0]' : 'text-[#e4bdba] hover:bg-[#10141C]'
              }`}
            >
              🏦 Bank A/C + IFSC
            </button>
          </div>

          <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-4">
            
            {/* Interception Card */}
            <div className="bg-[#10141C] border border-[#FF4B4B] relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FF4B4B]" />
              <div className="p-3 pl-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="px-1.5 py-0.5 bg-[#FF4B4B]/20 text-[#FF4B4B] text-[10px] border border-[#FF4B4B]/50 uppercase font-bold">
                    95% CRITICAL
                  </span>
                  <span className="text-[10px] text-[#e4bdba]">T-MINUS 12s</span>
                </div>

                <div className="text-[12px] text-white break-all space-y-0.5 font-mono">
                  {inspectorMode === 'UPI' ? (
                    <>
                      <div>vpa: <span className="text-[#FF4B4B] font-bold">{inspectorVpa}</span></div>
                      <div>amt: ₹ 4,50,000</div>
                      <div>dev: REDMI_NOTE_12_MULE</div>
                    </>
                  ) : (
                    <>
                      <div>acc: <span className="text-[#00F0A0] font-bold">{inspectorAcc}</span></div>
                      <div>ifsc: <span className="text-[#00F0A0] font-bold">{inspectorIfsc}</span></div>
                      <div>branch: SBI Jamtara Sadar</div>
                    </>
                  )}
                </div>

                <div className="mt-1">
                  <span className="inline-block px-2 py-0.5 bg-[#171E2B] border border-white/[0.08] text-white text-[10px] uppercase font-bold">
                    TAG: DIGITAL ARREST
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setActionSuccess(`VPA ${inspectorVpa} permanently blacklisted across all Indian UPI gateways.`);
                  setTimeout(() => setActionSuccess(''), 3000);
                }}
                className="w-full py-2 bg-transparent border border-[#FF4B4B] text-[#FF4B4B] text-xs uppercase hover:bg-[#FF4B4B] hover:text-black font-bold transition-all cursor-pointer"
              >
                BLOCK VPA INSTANTLY
              </button>

              <button
                onClick={() => {
                  setActionSuccess('1930 National Cybercrime Dossier dispatched to I4C Incident Portal.');
                  setTimeout(() => setActionSuccess(''), 3000);
                }}
                className="w-full py-2 bg-[#171E2B] border border-white/[0.08] text-white text-xs uppercase hover:bg-white/[0.08] font-bold transition-all cursor-pointer"
              >
                COMPILE 1930 DOSSIER
              </button>
            </div>

            <div className="h-px w-full bg-white/[0.08]" />

            {/* Audio Forensics Module */}
            <div className="flex flex-col gap-2 mt-auto pb-2">
              <div className="text-[11px] text-[#e4bdba] flex items-center gap-1.5 uppercase font-bold">
                <Volume2 className="w-4 h-4 text-purple-400" />
                Audio Forensics Sync
              </div>

              {/* Simulated Waveform */}
              <div className="h-14 w-full bg-[#171E2B] border border-white/[0.08] flex items-center justify-center p-2">
                <div className="flex items-end gap-[3px] h-full w-full opacity-80">
                  <div className="w-1.5 bg-[#e4bdba] h-[20%]" />
                  <div className="w-1.5 bg-[#e4bdba] h-[40%]" />
                  <div className="w-1.5 bg-[#00F0A0] h-[80%] animate-pulse" />
                  <div className="w-1.5 bg-[#e4bdba] h-[30%]" />
                  <div className="w-1.5 bg-[#FF4B4B] h-[90%] animate-pulse" />
                  <div className="w-1.5 bg-[#00D2FF] h-[100%] animate-pulse" />
                  <div className="w-1.5 bg-[#e4bdba] h-[50%]" />
                  <div className="w-1.5 bg-[#00F0A0] h-[70%]" />
                  <div className="w-1.5 bg-[#FF4B4B] h-[60%]" />
                </div>
              </div>

              {/* 6 Regional Language Audio Triggers */}
              <div className="space-y-1 mt-1">
                <span className="text-[10px] text-[#e4bdba]">Play Regional Audio Warning:</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { lang: 'hi', label: 'HI (Hindi)' },
                    { lang: 'bn', label: 'BN (Bengali)' },
                    { lang: 'or', label: 'OR (Odia)' },
                    { lang: 'te', label: 'TE (Telugu)' },
                    { lang: 'ta', label: 'TA (Tamil)' },
                    { lang: 'en', label: 'EN (English)' }
                  ].map(item => (
                    <button
                      key={item.lang}
                      onClick={() => playRegionalVoiceWarning('upi', item.lang)}
                      className="py-1 px-1 bg-[#171E2B] hover:bg-[#00F0A0] hover:text-black border border-white/[0.08] text-[10px] text-white transition-all cursor-pointer text-center font-bold"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </aside>

      </div>

      {/* ── MODAL: ADD RECORD ── */}
      {showAddThreatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in">
          <form onSubmit={handleAddNewThreat} className="w-full max-w-md bg-[#10141C] border border-white/[0.12] p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#00F0A0]" /> Add Blacklist Record
              </h3>
              <button type="button" onClick={() => setShowAddThreatModal(false)} className="text-[#e4bdba] hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              required
              value={newThreatIdentifier}
              onChange={(e) => setNewThreatIdentifier(e.target.value)}
              placeholder="UPI ID, Phone (+91), or Bank A/C..."
              className="w-full bg-[#171E2B] border border-white/[0.08] p-2.5 text-xs text-white focus:outline-none focus:border-[#00F0A0]"
            />
            <button type="submit" className="w-full py-2.5 bg-[#00F0A0] text-black font-bold text-xs uppercase cursor-pointer">
              Save to Registry
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
