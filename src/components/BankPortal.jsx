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
    topMuleBanks: ['Canara Bank', 'Axis Bank', 'State Bank of India'],
    dominantBranchIFSC: ['CNRB0000214', 'UTIB0000122', 'SBIN0040012'],
    severity: 'HIGH',
    vulnerabilityRank: '#7',
    coordinates: { x: 42, y: 72 },
    pinCodes: [
      { pin: '560034', district: 'Koramangala', mules: 540, blocked: '₹9.40 Cr', type: 'TELEGRAM_TASK' },
      { pin: '560066', district: 'Whitefield', mules: 410, blocked: '₹5.10 Cr', type: 'CRYPTO_BOT' },
      { pin: '570001', district: 'Mysuru City', mules: 290, blocked: '₹2.80 Cr', type: 'WORK_FROM_HOME' }
    ]
  },
  {
    id: 'GJ',
    state: 'GUJARAT',
    capital: 'Gandhinagar',
    hotspots: 'Surat, Ahmedabad, Rajkot',
    riskIndex: 87.2,
    activeThreatNodes: 2240,
    blockedVolumeCr: '15.10',
    primaryModus: 'Dabba Trading, Commodity Forex & Fake IPO Schemes',
    topMuleBanks: ['Bank of Baroda', 'ICICI Bank', 'Kotak Mahindra'],
    dominantBranchIFSC: ['BARB0SURATX', 'ICIC0000188', 'KKBK0000841'],
    severity: 'HIGH',
    vulnerabilityRank: '#8',
    coordinates: { x: 26, y: 46 },
    pinCodes: [
      { pin: '395003', district: 'Surat Ring Rd', mules: 620, blocked: '₹8.90 Cr', type: 'DABBA_TRADE' },
      { pin: '380001', district: 'Ahmedabad GPO', mules: 510, blocked: '₹4.30 Cr', type: 'IPO_ALLOT' }
    ]
  },
  {
    id: 'TG',
    state: 'TELANGANA',
    capital: 'Hyderabad',
    hotspots: 'Cyberabad, HITEC City, Secunderabad',
    riskIndex: 84.6,
    activeThreatNodes: 1890,
    blockedVolumeCr: '13.80',
    primaryModus: 'Instant Chinese Loan App Extortion & Betting Apps',
    topMuleBanks: ['Union Bank of India', 'HDFC Bank', 'State Bank of India'],
    dominantBranchIFSC: ['UBIN0800015', 'HDFC0000547', 'SBIN0011662'],
    severity: 'HIGH',
    vulnerabilityRank: '#9',
    coordinates: { x: 48, y: 62 },
    pinCodes: [
      { pin: '500081', district: 'HITEC City', mules: 480, blocked: '₹7.60 Cr', type: 'LOAN_APP' },
      { pin: '500003', district: 'Secunderabad', mules: 360, blocked: '₹4.10 Cr', type: 'BETTING' }
    ]
  }
];

const SEED_APPEALS = [
  {
    id: 'APP-8924-X',
    ticketId: 'APP-8924-X',
    identifier: 'Acct: 4892-***-229',
    vpa: 'merchant.kirana@paytm',
    amount: '₹12,450.00',
    reason: 'Velocity Spike',
    details: 'Legitimate grocery store QR mistakenly reported by rival merchant.',
    status: 'PENDING',
    timestamp: '10 mins ago',
    resolvedBy: null,
    resolvedAt: null
  },
  {
    id: 'APP-8925-Y',
    ticketId: 'APP-8925-Y',
    identifier: 'IP: 192.168.1.104',
    vpa: 'student.hostel@oksbi',
    amount: '₹3,200.50',
    reason: 'Geo Mismatch',
    details: 'Student transacting from college campus hostel Wi-Fi proxy.',
    status: 'PENDING',
    timestamp: '25 mins ago',
    resolvedBy: null,
    resolvedAt: null
  },
  {
    id: 'APP-8926-Z',
    ticketId: 'APP-8926-Z',
    identifier: 'Dev: MAC-99A1',
    vpa: 'freelance.designer@icici',
    amount: '₹850.00',
    reason: 'New Device Login',
    details: 'Designer upgraded to new laptop for client project delivery.',
    status: 'PENDING',
    timestamp: '1 hour ago',
    resolvedBy: null,
    resolvedAt: null
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
  
  // Initialize appeals with localStorage persistence
  const [appeals, setAppeals] = useState(() => {
    try {
      const saved = localStorage.getItem('verix_bank_appeals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return SEED_APPEALS;
  });

  const [threats, setThreats] = useState(() => Array.isArray(INITIAL_THREAT_RECORDS) ? INITIAL_THREAT_RECORDS : []);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  
  // Appeals Review Desk State & Sub-tabs
  const [appealsSubTab, setAppealsSubTab] = useState('PENDING'); // 'PENDING' | 'HISTORY'
  const [showAppealsFilter, setShowAppealsFilter] = useState(false);
  const [appealsSearch, setAppealsSearch] = useState('');
  const [appealsReasonFilter, setAppealsReasonFilter] = useState('ALL');
  const [showSubmitAppealModal, setShowSubmitAppealModal] = useState(false);
  const [newAppealVpa, setNewAppealVpa] = useState('');
  const [newAppealAmount, setNewAppealAmount] = useState('');
  const [newAppealReason, setNewAppealReason] = useState('Velocity Spike');
  const [newAppealDetails, setNewAppealDetails] = useState('');

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

  // Database Filter & Pagination States
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // ROI Slider
  const [simulatedTxnVolume, setSimulatedTxnVolume] = useState(100000);
  const [simulatedAvgTicket, setSimulatedAvgTicket] = useState(2500);

  // Selected state object
  const selectedState = INDIA_STATES_HEATMAP_DATA.find(s => s.id === selectedStateId) || INDIA_STATES_HEATMAP_DATA[0];

  const fetchPortalData = async () => {
    try {
      const base = backendUrl || 'https://fruadsih.onrender.com';
      const [appealsRes, threatsRes] = await Promise.all([
        fetch(`${base}/api/v1/institution/appeals`).catch(() => null),
        fetch(`${base}/api/v1/threats/feed?limit=500`).catch(() => null)
      ]);

      if (appealsRes && appealsRes.ok) {
        const data = await appealsRes.json();
        const incomingAppeals = Array.isArray(data.appeals) ? data.appeals : (Array.isArray(data.data) ? data.data : []);
        
        if (incomingAppeals.length > 0) {
          setAppeals(prev => {
            const map = new Map();
            // Seed with existing local items (preserving local resolutions)
            prev.forEach(item => {
              const key = item.ticketId || item.appealId || item.id;
              if (key) map.set(key, item);
            });

            // Merge incoming from backend
            incomingAppeals.forEach(inc => {
              const id = inc.appealId || inc.ticketId || inc.id;
              if (!id) return;
              const existing = map.get(id);
              
              // If already locally resolved, preserve local status unless backend confirms
              if (existing && existing.status !== 'PENDING' && inc.status === 'PENDING_REVIEW') {
                return;
              }

              const statusNormalized = (inc.status === 'APPROVED_WHITELISTED' || inc.status === 'APPROVED')
                ? 'APPROVED'
                : (inc.status === 'REJECTED' ? 'REJECTED' : 'PENDING');

              map.set(id, {
                id,
                ticketId: id,
                identifier: inc.vpa ? `VPA: ${inc.vpa}` : (inc.identifier || 'Flagged Identifier'),
                vpa: inc.vpa || inc.identifier || 'Unknown VPA',
                amount: inc.amount ? (inc.amount.toString().startsWith('₹') ? inc.amount : `₹${Number(inc.amount).toLocaleString('en-IN')}`) : '₹12,450.00',
                reason: inc.reason || 'Velocity Spike',
                details: inc.evidenceDescription || inc.details || 'Dispute submitted by citizen via mobile app.',
                status: statusNormalized,
                timestamp: inc.submittedAt ? new Date(inc.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (existing?.timestamp || 'Recent'),
                resolvedBy: inc.resolvedBy || (statusNormalized !== 'PENDING' ? (existing?.resolvedBy || 'Compliance Officer') : null),
                resolvedAt: inc.resolvedAt ? new Date(inc.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (existing?.resolvedAt || null)
              });
            });

            const merged = Array.from(map.values());
            try {
              localStorage.setItem('verix_bank_appeals', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      }

      if (threatsRes && threatsRes.ok) {
        const data = await threatsRes.json();
        const incomingThreats = Array.isArray(data.data) ? data.data : (Array.isArray(data.threats) ? data.threats : []);
        if (incomingThreats.length > 0) {
          setThreats(incomingThreats);
        }
      }
    } catch (e) {
      console.warn('Backend sync warning:', e);
    }
  };

  // Run on mount and poll every 5 seconds for live real-time trigger from mobile app
  useEffect(() => {
    fetchPortalData();
    const interval = setInterval(fetchPortalData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleResolveAppeal = async (appealId, decision) => {
    const resolutionBackend = decision === 'APPROVED' ? 'APPROVED_WHITELISTED' : 'REJECTED';
    const resolutionTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // 1. Instantly update React state & persist in localStorage
    const updated = appeals.map(a => {
      if ((a.appealId || a.ticketId || a.id) === appealId) {
        return { 
          ...a, 
          status: decision, 
          resolvedAt: resolutionTime,
          resolvedBy: loginForm.fullName
        };
      }
      return a;
    });

    setAppeals(updated);
    try {
      localStorage.setItem('verix_bank_appeals', JSON.stringify(updated));
    } catch (e) {}

    setActionSuccess(`Appeal ${appealId} marked as ${decision} & moved to Resolution History!`);
    setTimeout(() => setActionSuccess(''), 3500);
    setSelectedTicket(null);

    // 2. Broadcast resolution to backend API so Mobile App unblocks immediately
    try {
      const base = backendUrl || 'https://fruadsih.onrender.com';
      await fetch(`${base}/api/v1/institution/appeals/${appealId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolution: resolutionBackend,
          status: decision,
          reviewerNotes: `Reviewed and resolved by Nodal Officer ${loginForm.fullName}`,
          officerId: loginForm.fullName,
          resolvedBy: loginForm.fullName
        })
      });
    } catch (e) {
      console.warn('Backend resolution sync completed locally.');
    }
  };

  const handleReopenAppeal = (appealId) => {
    const updated = appeals.map(a => {
      if ((a.appealId || a.ticketId || a.id) === appealId) {
        return {
          ...a,
          status: 'PENDING',
          resolvedAt: null,
          resolvedBy: null
        };
      }
      return a;
    });

    setAppeals(updated);
    try {
      localStorage.setItem('verix_bank_appeals', JSON.stringify(updated));
    } catch (e) {}

    setActionSuccess(`Appeal ${appealId} restored to Pending Queue!`);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleCreateNewAppeal = (e) => {
    e.preventDefault();
    if (!newAppealVpa) return;
    const ticketId = `APP-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const newAppeal = {
      id: ticketId,
      ticketId: ticketId,
      identifier: newAppealVpa.includes('@') ? `VPA: ${newAppealVpa}` : `Acct: ${newAppealVpa}`,
      vpa: newAppealVpa,
      amount: newAppealAmount ? (newAppealAmount.startsWith('₹') ? newAppealAmount : `₹${newAppealAmount}`) : '₹5,000.00',
      reason: newAppealReason,
      details: newAppealDetails || 'Submitted via dispute arbitration desk.',
      status: 'PENDING',
      timestamp: 'Just now',
      resolvedBy: null,
      resolvedAt: null
    };

    const updated = [newAppeal, ...appeals];
    setAppeals(updated);
    try {
      localStorage.setItem('verix_bank_appeals', JSON.stringify(updated));
    } catch (e) {}

    setShowSubmitAppealModal(false);
    setNewAppealVpa('');
    setNewAppealAmount('');
    setNewAppealDetails('');
    setAppealsSubTab('PENDING');
    setActionSuccess(`Appeal ticket ${ticketId} created and added to Pending Queue!`);
    setTimeout(() => setActionSuccess(''), 3500);

    // Also send to backend
    try {
      const base = backendUrl || 'https://fruadsih.onrender.com';
      fetch(`${base}/api/v1/institution/appeals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          vpa: newAppealVpa,
          amount: Number(newAppealAmount.replace(/[^0-9.]/g, '')) || 5000,
          reason: newAppealReason,
          evidenceDescription: newAppealDetails
        })
      }).catch(() => null);
    } catch (e) {}
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

  // Split Appeals into Pending and Resolution History
  const pendingAppeals = appeals.filter(a => a && (a.status === 'PENDING' || a.status === 'PENDING_REVIEW' || !a.status));
  const resolvedAppeals = appeals.filter(a => a && (a.status === 'APPROVED' || a.status === 'REJECTED'));
  const pendingCount = pendingAppeals.length;

  const currentAppealsList = (appealsSubTab === 'PENDING' ? pendingAppeals : resolvedAppeals).filter(a => {
    const matchesSearch = !appealsSearch ||
      a.id?.toLowerCase().includes(appealsSearch.toLowerCase()) ||
      a.ticketId?.toLowerCase().includes(appealsSearch.toLowerCase()) ||
      a.identifier?.toLowerCase().includes(appealsSearch.toLowerCase()) ||
      a.vpa?.toLowerCase().includes(appealsSearch.toLowerCase()) ||
      a.reason?.toLowerCase().includes(appealsSearch.toLowerCase());
    const matchesReason = appealsReasonFilter === 'ALL' || a.reason?.toLowerCase() === appealsReasonFilter.toLowerCase();
    return matchesSearch && matchesReason;
  });

  // Filtered threats for Database Table
  const filteredThreats = threats.filter(t => {
    const matchesQuery = !searchQuery || 
      t.identifier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.source?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || t.type?.toUpperCase() === selectedType;
    const matchesCategory = selectedCategory === 'ALL' || t.category?.toUpperCase() === selectedCategory;
    return matchesQuery && matchesType && matchesCategory;
  });

  const totalPages = Math.ceil(filteredThreats.length / pageSize) || 1;
  const paginatedThreats = filteredThreats.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedThreats.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedThreats.map((_, i) => i)));
    }
  };

  const toggleSelectRow = (idx) => {
    const next = new Set(selectedRows);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelectedRows(next);
  };

  const exportData = (format) => {
    const dataStr = format === 'json'
      ? "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredThreats, null, 2))
      : "data:text/csv;charset=utf-8," + encodeURIComponent(
          ["Identifier,Type,Category,RiskScore,Source", ...filteredThreats.map(t => `"${t.identifier}","${t.type}","${t.category}",${t.riskScore || 95},"${t.source || 'I4C'}"`)].join("\n")
        );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `verix_threat_registry_${Date.now()}.${format}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setActionSuccess(`Exported ${filteredThreats.length} records to ${format.toUpperCase()}`);
    setTimeout(() => setActionSuccess(''), 3000);
  };

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
              <div className="text-xs font-bold text-white">STRATEGIC OPS</div>
              <div className="text-[10px] text-[#e4bdba]">V.4.2.0</div>
            </div>
          </div>

          {/* Nav Items */}
          <div className="flex-1 py-3 overflow-y-auto flex flex-col gap-1 px-2">
            {[
              { id: 'threat_heatmap', label: 'Threat Heatmaps', icon: Globe, count: null },
              { id: 'database_search', label: 'Threat Registry', icon: Database, count: threats.length.toLocaleString() },
              { id: 'disputes', label: 'Appeals Review', icon: FileText, count: `${pendingCount} PENDING`, alert: pendingCount > 0 },
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
                    ? 'bg-white/10 text-white border-r-2 border-white font-bold'
                    : 'text-[#e4bdba] hover:bg-[#171E2B] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${activeTab === id ? 'text-[#00F0A0]' : 'text-[#e4bdba]'}`} />
                  <span>{label}</span>
                </div>
                {count && (
                  <span className={`text-[10px] px-1.5 py-0.2 font-mono ${
                    alert 
                      ? 'bg-[#FF4B4B]/20 text-[#FF4B4B] border border-[#FF4B4B]/40' 
                      : 'bg-white/[0.06] text-[#e4bdba]'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Left Rail Footer */}
          <div className="p-3 border-t border-white/[0.08] bg-[#0A0D14] flex flex-col gap-2">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="w-full py-1.5 text-center text-xs text-[#FF4B4B] hover:bg-[#FF4B4B]/10 border border-[#FF4B4B]/30 transition-all cursor-pointer"
            >
              LOGOUT TERMINAL
            </button>
            <div className="flex justify-between text-[10px] text-[#e4bdba] opacity-60">
              <span>STATION: BLR-01-NX</span>
              <span>DB_SYNC_OK</span>
            </div>
          </div>
        </nav>

        {/* ── CENTER WORKSPACE CANVAS ── */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#0A0D14] p-3 gap-3">
          
          {/* ══════════════════════════════════════════════════════════════
              TAB 1: THREAT HEATMAPS (100% INDIA GEOSPATIAL RADAR)
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'threat_heatmap' && (
            <div className="flex-1 flex flex-col gap-3 overflow-hidden">
              
              {/* Top Split (60% Map Canvas | 40% Selected State Dossier) */}
              <div className="flex flex-1 gap-3 overflow-hidden min-h-0">
                
                {/* Left 60%: Interactive SVG India Radar Map */}
                <div className="w-[60%] bg-[#10141C] border border-white/[0.08] flex flex-col overflow-hidden relative">
                  
                  {/* Map Header */}
                  <div className="p-3 border-b border-white/[0.08] flex justify-between items-center bg-[#171E2B]/50">
                    <div className="flex items-center gap-2">
                      <Satellite className="w-4 h-4 text-[#00F0A0]" />
                      <span className="text-xs font-bold text-white tracking-wider uppercase">
                        Satellite India Geospatial Telemetry
                      </span>
                    </div>

                    {/* State Selector Dropdown */}
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-[#e4bdba] uppercase">Select State:</label>
                      <select
                        value={selectedStateId}
                        onChange={(e) => setSelectedStateId(e.target.value)}
                        className="bg-[#10141C] border border-white/[0.08] text-xs text-[#00F0A0] px-2 py-1 focus:outline-none cursor-pointer"
                      >
                        {INDIA_STATES_HEATMAP_DATA.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.vulnerabilityRank} {s.state} ({s.riskIndex}%)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Vector Map Canvas */}
                  <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden bg-[#05080E]">
                    {/* Radar Scanning Line */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(0,240,160,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,160,0.1)_1px,transparent_1px)] bg-[size:32px_32px]" />

                    {/* India Map Geometric Representation */}
                    <svg viewBox="0 0 100 100" className="w-full h-full max-h-[380px] filter drop-shadow-[0_0_15px_rgba(0,240,160,0.15)]">
                      {/* Outline Polygon */}
                      <polygon
                        points="35,10 45,8 55,14 62,22 68,26 80,30 85,38 78,45 82,55 72,60 60,65 52,78 45,92 38,82 32,68 25,58 20,45 22,32 30,22"
                        fill="#101726"
                        stroke="#00F0A0"
                        strokeWidth="0.8"
                        strokeDasharray="2,1"
                      />

                      {/* State Nodes */}
                      {INDIA_STATES_HEATMAP_DATA.map((state) => {
                        const isSelected = state.id === selectedStateId;
                        const isCritical = state.riskIndex >= 90;
                        return (
                          <g
                            key={state.id}
                            className="cursor-pointer transition-all hover:scale-125"
                            onClick={() => setSelectedStateId(state.id)}
                          >
                            <circle
                              cx={state.coordinates.x}
                              cy={state.coordinates.y}
                              r={isSelected ? 3.5 : 2}
                              fill={isCritical ? '#FF4B4B' : '#00D2FF'}
                              className={isCritical ? 'animate-pulse' : ''}
                            />
                            {isSelected && (
                              <circle
                                cx={state.coordinates.x}
                                cy={state.coordinates.y}
                                r={6}
                                fill="none"
                                stroke="#00F0A0"
                                strokeWidth="0.8"
                                className="animate-ping"
                              />
                            )}
                            <text
                              x={state.coordinates.x + 3}
                              y={state.coordinates.y + 1}
                              fontSize="3.2"
                              fill={isSelected ? '#00F0A0' : '#fadcd9'}
                              fontWeight={isSelected ? 'bold' : 'normal'}
                              className="font-mono select-none"
                            >
                              {state.id} ({state.riskIndex}%)
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Bottom Status Overlay */}
                    <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] text-[#e4bdba] bg-[#10141C]/80 p-2 border border-white/[0.08]">
                      <span>CURRENT JURISDICTION: <strong className="text-[#00F0A0]">{selectedState.state}</strong></span>
                      <span>ACTIVE THREAT NODES: <strong className="text-white">{selectedState.activeThreatNodes.toLocaleString()}</strong></span>
                      <span>24H BLOCKED: <strong className="text-[#FF4B4B]">₹{selectedState.blockedVolumeCr} Cr</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right 40%: Selected State Deep-Dive Dossier */}
                <div className="w-[40%] bg-[#10141C] border border-white/[0.08] flex flex-col overflow-hidden">
                  
                  <div className="p-3 border-b border-white/[0.08] flex justify-between items-center bg-[#171E2B]/50">
                    <span className="text-xs font-bold text-white tracking-wider uppercase">
                      Selected State Dossier
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 font-bold ${
                      selectedState.severity === 'CRITICAL' ? 'bg-[#FF4B4B]/20 text-[#FF4B4B] border border-[#FF4B4B]' : 'bg-[#00F0A0]/20 text-[#00F0A0]'
                    }`}>
                      {selectedState.severity}
                    </span>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto space-y-3">
                    
                    {/* Header Details */}
                    <div className="flex justify-between items-start border-b border-white/[0.08] pb-2">
                      <div>
                        <h3 className="text-base font-bold text-white">{selectedState.state}</h3>
                        <p className="text-[10.5px] text-[#e4bdba]">Capital: {selectedState.capital} • Hotspots: {selectedState.hotspots}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-[#e4bdba]">Threat Index</div>
                        <div className="text-xl font-bold text-[#FF4B4B]">{selectedState.riskIndex}</div>
                      </div>
                    </div>

                    {/* Primary Scam Type */}
                    <div className="p-2 bg-[#171E2B] border border-white/[0.08] text-xs">
                      <span className="text-[10px] text-[#e4bdba] block uppercase">Primary Modus Operandi:</span>
                      <p className="text-white text-[11px] mt-0.5">{selectedState.primaryModus}</p>
                    </div>

                    {/* Critical Clusters: Hot PIN Codes */}
                    <div>
                      <span className="text-[10.5px] text-white font-bold uppercase block mb-1.5">
                        Critical Clusters (Hot PIN Codes)
                      </span>
                      <div className="border border-white/[0.08] overflow-hidden">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-[#171E2B] text-[#e4bdba] text-[9.5px] uppercase">
                            <tr>
                              <th className="p-1.5">PIN</th>
                              <th className="p-1.5">District</th>
                              <th className="p-1.5 text-right">Mules</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedState.pinCodes.map((p, i) => (
                              <tr key={i} className="border-t border-white/[0.04] text-white hover:bg-[#171E2B]">
                                <td className="p-1.5 font-bold text-[#FF4B4B]">{p.pin}</td>
                                <td className="p-1.5">{p.district}</td>
                                <td className="p-1.5 text-right text-[#00F0A0]">{p.mules.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Compromised Routing Nodes: IFSC */}
                    <div>
                      <span className="text-[10.5px] text-white font-bold uppercase block mb-1.5">
                        Compromised Routing Nodes (IFSC)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedState.dominantBranchIFSC.map((ifsc, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#171E2B] border border-white/[0.08] text-[10px] text-[#00F0A0] font-mono">
                            {ifsc}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Bottom 3-Column Telemetry Row (H-28) */}
              <div className="h-28 flex gap-3 shrink-0">
                
                {/* 5a: Target Locator */}
                <div className="w-64 bg-[#10141C] border border-white/[0.08] p-3 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-[#e4bdba] uppercase font-bold flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-[#00F0A0]" />
                      Target Locator
                    </div>
                    <p className="text-[10px] text-[#e4bdba] opacity-70 mt-0.5">Instant PIN / IFSC Vector lookup</p>
                  </div>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#e4bdba] absolute left-2 top-2" />
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
              TAB 2: THREAT REGISTRY DATABASE (FULL SEARCH TABLE & EXPORT)
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'database_search' && (
            <div className="flex-1 bg-[#141313] flex flex-col overflow-hidden text-[#e5e2e1]">
              
              {/* Page Header & Actions */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 border-b border-white/10 bg-[#141313]">
                <div>
                  <h1 className="text-xl font-bold text-white font-sans tracking-tight">National Threat Registry Database</h1>
                  <p className="text-xs text-[#8e9193] mt-0.5 font-mono">{filteredThreats.length.toLocaleString()} Records Found</p>
                </div>
                <button
                  onClick={() => setShowAddThreatModal(true)}
                  className="bg-white text-black font-bold text-xs uppercase px-4 py-2 hover:bg-white/90 transition-colors flex items-center gap-2 border border-white cursor-pointer active:scale-95"
                >
                  <span className="text-base leading-none font-black">+</span>
                  <span>ADD RECORD</span>
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="px-6 py-3 shrink-0 bg-[#0e0e0e] border-b border-white/10 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8e9193] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search VPA, Phone, IFSC, or Identifier..."
                    className="w-full bg-[#141313] border border-white/10 text-white pl-9 pr-4 py-2 text-xs font-mono focus:border-white/40 focus:outline-none placeholder:text-[#8e9193]/50 transition-colors"
                  />
                </div>

                {/* Filter by Type */}
                <select
                  value={selectedType}
                  onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
                  className="bg-[#141313] border border-white/10 text-xs text-[#e5e2e1] px-3 py-2 focus:border-white/40 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">TYPE: ALL</option>
                  <option value="VPA">VPA (UPI)</option>
                  <option value="PHONE">PHONE</option>
                  <option value="BANK_ACC">BANK ACC</option>
                </select>

                {/* Filter by Category */}
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="bg-[#141313] border border-white/10 text-xs text-[#e5e2e1] px-3 py-2 focus:border-white/40 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">CATEGORY: ALL</option>
                  <option value="DIGITAL_ARREST">DIGITAL ARREST</option>
                  <option value="MULE_ACCOUNT">MULE ACCOUNT</option>
                  <option value="ELECTRICITY_BILL">POWER CUT SMS</option>
                  <option value="PART_TIME_JOB">JOB SCAM</option>
                  <option value="CUSTOMS_PARCEL">CUSTOMS PARCEL</option>
                  <option value="SEXTO">SEXTORTION</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => exportData('csv')}
                    className="bg-[#141313] border border-white/10 text-xs text-[#e5e2e1] px-3 py-2 hover:border-white/40 transition-colors flex items-center gap-1.5 cursor-pointer font-mono"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={() => exportData('json')}
                    className="bg-[#141313] border border-white/10 text-xs text-[#e5e2e1] px-3 py-2 hover:border-white/40 transition-colors flex items-center gap-1.5 cursor-pointer font-mono"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>JSON</span>
                  </button>
                </div>
              </div>

              {/* Data Table Canvas */}
              <div className="flex-1 overflow-auto px-6 py-4 bg-[#141313]">
                <div className="w-full min-w-[900px] border border-white/10 bg-[#0e0e0e] overflow-hidden">
                  <table className="w-full text-left border-collapse font-mono">
                    <thead className="bg-[#201f1f] border-b border-white/10 text-[10.5px] uppercase tracking-wider text-[#8e9193]">
                      <tr>
                        <th className="px-4 py-3 w-12 text-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.size > 0 && selectedRows.size === paginatedThreats.length}
                            onChange={toggleSelectAll}
                            className="cursor-pointer accent-[#00F0A0]"
                          />
                        </th>
                        <th className="px-4 py-3">IDENTIFIER (VPA/ACC)</th>
                        <th className="px-4 py-3">TYPE</th>
                        <th className="px-4 py-3">CATEGORY</th>
                        <th className="px-4 py-3 text-right">RISK SCORE</th>
                        <th className="px-4 py-3">SOURCE FEED</th>
                        <th className="px-4 py-3 w-16 text-center">ACT</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-[#e5e2e1]">
                      {paginatedThreats.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-[#8e9193]">
                            No threat records match your current search and filter criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedThreats.map((t, idx) => {
                          const isEven = idx % 2 === 0;
                          const isSelected = selectedRows.has(idx);
                          const risk = t.riskScore || 95;
                          const isCritical = risk >= 90;
                          const isHigh = risk >= 70 && risk < 90;

                          return (
                            <tr
                              key={t.id || idx}
                              className={`border-b border-white/[0.06] transition-colors cursor-pointer group ${
                                isSelected ? 'bg-white/10' : (isEven ? 'bg-[#10141C]' : 'bg-[#171E2B]')
                              } hover:bg-white/[0.08]`}
                            >
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectRow(idx)}
                                  className="cursor-pointer accent-[#00F0A0]"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2 font-bold text-white">
                                  <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${isCritical ? 'text-[#FF4B4B]' : 'text-amber-400'}`} />
                                  <span className="truncate max-w-xs">{t.identifier}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-[#8e9193] font-bold">
                                <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-[10px]">
                                  {t.type || (t.identifier?.includes('@') ? 'VPA' : 'PHONE')}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-[#e5e2e1] capitalize">
                                {t.category ? t.category.replace(/_/g, ' ').toLowerCase() : 'Mule Account'}
                              </td>
                              <td className="px-4 py-3 text-right font-bold">
                                <span className={isCritical ? 'text-[#FF4B4B]' : (isHigh ? 'text-amber-400' : 'text-[#8e9193]')}>
                                  {risk}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-[#8e9193] text-[11px] truncate max-w-[200px]">
                                {t.source || 'I4C National FIR #8921'}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => {
                                    navigator.clipboard?.writeText(t.identifier);
                                    setActionSuccess(`Copied ${t.identifier}`);
                                    setTimeout(() => setActionSuccess(''), 2000);
                                  }}
                                  title="Copy Identifier"
                                  className="text-[#8e9193] hover:text-white transition-colors cursor-pointer p-1"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>

                  {/* Pagination / Footer */}
                  <div className="bg-[#201f1f] px-4 py-3 border-t border-white/10 flex justify-between items-center text-[#8e9193] text-[11px] font-mono">
                    <div>
                      SHOWING {paginatedThreats.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
                      {Math.min(currentPage * pageSize, filteredThreats.length)} OF {filteredThreats.length.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-2 py-1 bg-white/5 border border-white/10 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      >
                        &lt;
                      </button>
                      <span>PAGE {currentPage} OF {totalPages}</span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 bg-white/5 border border-white/10 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      >
                        &gt;
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 3: APPEALS REVIEW QUEUE & RESOLUTION HISTORY
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'disputes' && (
            <div className="flex-1 bg-[#141313] flex flex-col p-6 overflow-y-auto text-[#e5e2e1] font-mono">
              
              {/* Header & Sub-Tabs */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4 border-b border-white/10 pb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white font-sans tracking-tight">False-Positive Appeals Review Desk</h1>
                  <p className="text-xs text-[#8e9193] mt-1">
                    {pendingCount} Pending Review • {resolvedAppeals.length} Resolved in History
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Sub-tab Navigation */}
                  <div className="flex bg-[#201f1f] border border-white/10 p-0.5 rounded">
                    <button
                      onClick={() => setAppealsSubTab('PENDING')}
                      className={`px-3 py-1.5 text-xs font-bold uppercase transition-all cursor-pointer ${
                        appealsSubTab === 'PENDING'
                          ? 'bg-white text-black font-black'
                          : 'text-[#8e9193] hover:text-white'
                      }`}
                    >
                      📋 Pending ({pendingCount})
                    </button>
                    <button
                      onClick={() => setAppealsSubTab('HISTORY')}
                      className={`px-3 py-1.5 text-xs font-bold uppercase transition-all cursor-pointer ${
                        appealsSubTab === 'HISTORY'
                          ? 'bg-white text-black font-black'
                          : 'text-[#8e9193] hover:text-white'
                      }`}
                    >
                      📜 History ({resolvedAppeals.length})
                    </button>
                  </div>

                  {/* Filter Toggle Button */}
                  <button 
                    onClick={() => setShowAppealsFilter(!showAppealsFilter)}
                    className={`border px-3.5 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
                      showAppealsFilter 
                        ? 'bg-[#00F0A0] text-black border-[#00F0A0]' 
                        : 'bg-[#2a2a2a] border-white/10 hover:border-white text-white'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter</span>
                    {showAppealsFilter && <span className="text-[10px]">●</span>}
                  </button>

                  {/* Create New Appeal Button */}
                  <button
                    onClick={() => setShowSubmitAppealModal(true)}
                    className="bg-[#00F0A0] hover:bg-[#00e296] text-black font-bold text-xs uppercase px-3.5 py-1.5 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span className="text-base leading-none font-black">+</span>
                    <span>New Appeal</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Filter Toolbar */}
              {showAppealsFilter && (
                <div className="bg-[#171E2B] border border-white/10 p-3 mb-4 flex flex-col md:flex-row gap-3 items-center">
                  <div className="relative flex-1 w-full">
                    <Search className="w-3.5 h-3.5 text-[#8e9193] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={appealsSearch}
                      onChange={(e) => setAppealsSearch(e.target.value)}
                      placeholder="Search ticket ID, VPA, identifier, or reason..."
                      className="w-full bg-[#10141C] border border-white/10 text-white pl-8 pr-3 py-1.5 text-xs font-mono focus:border-[#00F0A0] focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <select
                      value={appealsReasonFilter}
                      onChange={(e) => setAppealsReasonFilter(e.target.value)}
                      className="bg-[#10141C] border border-white/10 text-xs text-white px-3 py-1.5 focus:border-[#00F0A0] focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">REASON: ALL</option>
                      <option value="Velocity Spike">Velocity Spike</option>
                      <option value="Geo Mismatch">Geo Mismatch</option>
                      <option value="New Device Login">New Device Login</option>
                      <option value="Merchant False-Positive">Merchant False-Positive</option>
                    </select>

                    <button
                      onClick={() => { setAppealsSearch(''); setAppealsReasonFilter('ALL'); }}
                      className="px-3 py-1.5 bg-[#201f1f] hover:bg-white/10 border border-white/10 text-xs text-[#8e9193] hover:text-white transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {/* Appeals Cards Grid / List */}
              <div className="flex flex-col gap-4">
                {currentAppealsList.length === 0 ? (
                  <div className="bg-[#201f1f] p-12 border border-white/10 rounded-lg text-center">
                    <CheckCircle2 className="w-10 h-10 text-[#00F0A0] mx-auto mb-3 opacity-60" />
                    <h3 className="text-base font-bold text-white mb-1">
                      {appealsSubTab === 'PENDING' ? 'No Pending Appeals in Queue' : 'No Resolved Appeals in History'}
                    </h3>
                    <p className="text-xs text-[#8e9193] max-w-md mx-auto">
                      {appealsSubTab === 'PENDING'
                        ? 'All citizen dispute tickets have been reviewed and resolved. Use "+ New Appeal" to submit a test dispute.'
                        : 'Resolved tickets will automatically appear here once approved or rejected.'}
                    </p>
                  </div>
                ) : (
                  currentAppealsList.map((a, idx) => {
                    const isPending = a.status === 'PENDING' || a.status === 'PENDING_REVIEW' || !a.status;
                    const isApproved = a.status === 'APPROVED';
                    const isRejected = a.status === 'REJECTED';

                    return (
                      <div
                        key={a.id || a.ticketId || idx}
                        className={`p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                          isPending 
                            ? 'bg-[#201f1f] border-white/10 hover:border-white/20' 
                            : (isApproved ? 'bg-[#00F0A0]/5 border-[#00F0A0]/30' : 'bg-[#FF4B4B]/5 border-[#FF4B4B]/30')
                        }`}
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-3/4 text-xs">
                          <div>
                            <div className="text-[10.5px] uppercase tracking-wider text-[#8e9193] mb-1 font-bold">Ticket ID</div>
                            <div className="text-sm font-bold text-white flex items-center gap-1.5">
                              <span>{a.id || a.ticketId || `APP-${8924 + idx}-X`}</span>
                            </div>
                            <span className="text-[10px] text-[#8e9193] block mt-0.5">{a.timestamp || 'Recent'}</span>
                          </div>
                          <div>
                            <div className="text-[10.5px] uppercase tracking-wider text-[#8e9193] mb-1 font-bold">Flagged Identifier</div>
                            <div className="text-xs text-white font-bold truncate max-w-[180px]">{a.identifier || a.vpa || 'merchant.kirana@paytm'}</div>
                            <span className="text-[10px] text-[#8e9193] block mt-0.5">{a.vpa || 'UPI Gateway'}</span>
                          </div>
                          <div>
                            <div className="text-[10.5px] uppercase tracking-wider text-[#8e9193] mb-1 font-bold">Amount</div>
                            <div className="text-sm font-bold text-[#00F0A0]">
                              {a.amount?.toString().startsWith('₹') || a.amount?.toString().startsWith('$') ? a.amount : `₹${a.amount || '12,450'}`}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10.5px] uppercase tracking-wider text-[#8e9193] mb-1 font-bold">Reason Code</div>
                            <div className="text-xs text-white bg-white/5 px-2 py-1 inline-block border border-white/10 rounded-sm">
                              {a.reason || 'Velocity Spike'}
                            </div>
                          </div>
                        </div>

                        {/* Case Details Snippet if any */}
                        {a.details && (
                          <div className="w-full md:hidden text-[11px] text-[#8e9193] border-t border-white/5 pt-2">
                            {a.details}
                          </div>
                        )}

                        {/* Action Buttons or Resolution Status */}
                        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                          {isPending ? (
                            <>
                              <button
                                onClick={() => handleResolveAppeal(a.id || a.ticketId, 'REJECTED')}
                                className="flex-1 md:flex-none border border-[#FF4B4B] text-[#FF4B4B] hover:bg-[#FF4B4B]/10 px-4 py-2 text-xs font-bold uppercase transition-colors cursor-pointer active:scale-95"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleResolveAppeal(a.id || a.ticketId, 'APPROVED')}
                                className="flex-1 md:flex-none border border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10 px-4 py-2 text-xs font-bold uppercase transition-colors cursor-pointer active:scale-95"
                              >
                                Approve
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className={`inline-block px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ${
                                  isApproved 
                                    ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]' 
                                    : 'bg-[#FF4B4B]/20 text-[#FF4B4B] border border-[#FF4B4B]'
                                }`}>
                                  {isApproved ? '✓ APPROVED (UNBLOCKED)' : '✕ REJECTED (CONFIRMED)'}
                                </span>
                                <span className="text-[10px] text-[#8e9193] block mt-1">
                                  {a.resolvedBy || loginForm.fullName} {a.resolvedAt ? `at ${a.resolvedAt}` : ''}
                                </span>
                              </div>

                              <button
                                onClick={() => handleReopenAppeal(a.id || a.ticketId)}
                                title="Restore back to Pending Queue"
                                className="p-2 bg-[#201f1f] hover:bg-white/10 border border-white/10 text-[#8e9193] hover:text-white transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
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

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#171E2B] border border-white/[0.08] text-center">
                  <div className="text-[10px] text-[#e4bdba]">COERCION PROBABILITY</div>
                  <div className="text-lg font-bold text-[#FF4B4B]">95.4%</div>
                </div>
                <div className="p-3 bg-[#171E2B] border border-white/[0.08] text-center">
                  <div className="text-[10px] text-[#e4bdba]">DETECTED DIALECT</div>
                  <div className="text-lg font-bold text-[#00F0A0]">BHOJPURI-HINDI</div>
                </div>
                <div className="p-3 bg-[#171E2B] border border-white/[0.08] text-center">
                  <div className="text-[10px] text-[#e4bdba]">VOIP PROXY HOPS</div>
                  <div className="text-lg font-bold text-amber-400">4 PROXIES</div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 6: SIM SWAP MONITOR
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'sim_carrier' && (
            <div className="flex-1 bg-[#10141C] border border-white/[0.08] p-5 flex flex-col gap-4 overflow-y-auto">
              <h2 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/[0.08] pb-3">
                <Radio className="w-4 h-4 text-[#00D2FF]" />
                Telecom Carrier SIM Swap &amp; IMSI Telemetry Monitor
              </h2>

              <div className="space-y-2">
                {[
                  { phone: '+91 94775 30475', carrier: 'Airtel India', time: '14 mins ago', swap: 'DETECTED', risk: 'HIGH' },
                  { phone: '+91 88001 12233', carrier: 'Reliance Jio', time: '1 hour ago', swap: 'DETECTED', risk: 'HIGH' },
                  { phone: '+91 99112 23344', carrier: 'Vodafone Idea (Vi)', time: '3 hours ago', swap: 'CLEAR', risk: 'LOW' }
                ].map((s, i) => (
                  <div key={i} className="p-3 bg-[#171E2B] border border-white/[0.08] flex justify-between items-center text-xs">
                    <div>
                      <span className="text-white font-bold block">{s.phone}</span>
                      <span className="text-[10px] text-[#e4bdba]">{s.carrier} • Last IMSI update: {s.time}</span>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold ${
                      s.swap === 'DETECTED' ? 'bg-[#FF4B4B]/20 text-[#FF4B4B] border border-[#FF4B4B]' : 'bg-[#00F0A0]/20 text-[#00F0A0]'
                    }`}>
                      {s.swap === 'DETECTED' ? '⚠️ RECENT SIM SWAP' : '✓ IMSI VERIFIED'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 7: I4C ADVISORIES
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'advisories' && (
            <div className="flex-1 bg-[#10141C] border border-white/[0.08] p-5 flex flex-col gap-4 overflow-y-auto">
              <h2 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-white/[0.08] pb-3">
                <BellRing className="w-4 h-4 text-amber-400" />
                I4C National Cybersecurity Advisories (2026)
              </h2>

              <div className="space-y-3">
                {[
                  { title: 'Advisory #2026-08: Wave of Fake Supreme Court Digital Arrest Calls', date: 'Aug 2026', severity: 'CRITICAL' },
                  { title: 'Advisory #2026-07: Malicious WhatsApp APKs Impersonating State Electricity Boards', date: 'Aug 2026', severity: 'HIGH' },
                  { title: 'Advisory #2026-06: Mule Bank Accounts Rented via Telegram Freelancing Channels', date: 'Jul 2026', severity: 'HIGH' }
                ].map((adv, i) => (
                  <div key={i} className="p-3 bg-[#171E2B] border border-white/[0.08] text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white font-bold">{adv.title}</span>
                      <span className="text-[#FF4B4B] font-bold text-[10px]">{adv.severity}</span>
                    </div>
                    <p className="text-[11px] text-[#e4bdba]">Circular published by Ministry of Home Affairs, Cyber &amp; Information Security Division.</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

        {/* ── RIGHT DOCKED INSPECTOR PANEL (W-80) ── */}
        <aside className="w-80 border-l border-white/[0.08] bg-[#10141C] flex flex-col shrink-0">
          
          {/* Tabs */}
          <div className="flex border-b border-white/[0.08] bg-[#0A0D14]">
            <button
              onClick={() => setInspectorMode('UPI')}
              className={`flex-1 py-2.5 text-center text-xs font-bold cursor-pointer transition-all ${
                inspectorMode === 'UPI' ? 'bg-[#10141C] text-[#00F0A0] border-b-2 border-[#00F0A0]' : 'text-[#e4bdba] hover:text-white'
              }`}
            >
              ⚡ UPI Stream
            </button>
            <button
              onClick={() => setInspectorMode('BANK')}
              className={`flex-1 py-2.5 text-center text-xs font-bold cursor-pointer transition-all ${
                inspectorMode === 'BANK' ? 'bg-[#10141C] text-[#00F0A0] border-b-2 border-[#00F0A0]' : 'text-[#e4bdba] hover:text-white'
              }`}
            >
              🏦 Bank A/C + IFSC
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            
            {/* 95% Threat Card */}
            <div className="p-3 bg-[#FF4B4B]/10 border border-[#FF4B4B] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#FF4B4B] flex items-center gap-1">
                  <AlertOctagon className="w-4 h-4" />
                  95% CRITICAL
                </span>
                <span className="text-[10px] text-white bg-[#FF4B4B] px-1.5 py-0.2 font-bold text-black">
                  T-MINUS 12s
                </span>
              </div>

              {inspectorMode === 'UPI' ? (
                <div className="space-y-1 text-xs">
                  <div className="text-white font-mono font-bold">{inspectorVpa}</div>
                  <div className="text-[#00F0A0] font-bold">amt: ₹ 4,50,000</div>
                  <div className="text-[10px] text-[#e4bdba]">dev: REDMI_NOTE_12_MULE</div>
                </div>
              ) : (
                <div className="space-y-1 text-xs">
                  <div className="text-white font-mono font-bold">acc: {inspectorAcc}</div>
                  <div className="text-[#00F0A0] font-bold">ifsc: {inspectorIfsc}</div>
                  <div className="text-[10px] text-[#e4bdba]">branch: SBI Jamtara Sadar</div>
                </div>
              )}

              <div className="text-[10px] bg-black p-1.5 border border-white/[0.08] text-[#e4bdba]">
                TAG: DIGITAL ARREST (POLICE COERCION)
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    setActionSuccess(`IDENTIFIER ${inspectorMode === 'UPI' ? inspectorVpa : inspectorAcc} PERMANENTLY BLOCKED ACROSS UPI GATEWAYS`);
                    setTimeout(() => setActionSuccess(''), 4000);
                  }}
                  className="flex-1 py-1.5 bg-[#FF4B4B] hover:bg-rose-600 text-black font-bold text-[11px] uppercase cursor-pointer"
                >
                  BLOCK VPA INSTANTLY
                </button>
              </div>
            </div>

            {/* Audio Forensics Module */}
            <div className="p-3 bg-[#171E2B] border border-white/[0.08] space-y-2.5">
              <div className="flex justify-between items-center border-b border-white/[0.08] pb-1.5">
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  Audio Forensics Engine
                </span>
                <span className="text-[9px] bg-purple-900/40 text-purple-300 px-1.5 py-0.5 border border-purple-500/30">
                  LIVE WAVEFORM
                </span>
              </div>

              {/* Animated Acoustic Waveform */}
              <div className="h-12 bg-black border border-white/[0.08] flex items-center justify-center gap-1 px-2">
                {[30, 60, 90, 45, 80, 100, 65, 40, 85, 95, 55, 30, 75, 50, 90, 40].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#00F0A0] rounded-full animate-pulse"
                    style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                  />
                ))}
              </div>

              <div className="text-[10px] space-y-1 text-[#e4bdba]">
                <div className="flex justify-between">
                  <span>LANG: <strong className="text-white">HIN (84%)</strong></span>
                  <span>DIALECT: <strong className="text-[#00F0A0]">BHOJPURI</strong></span>
                </div>
                <div className="flex justify-between">
                  <span>SPEAKER MATCH:</span>
                  <span className="text-[#FF4B4B] font-bold">KNOWN MULE (JMT-04)</span>
                </div>
              </div>

              {/* Regional Voice Warning Triggers */}
              <div className="pt-2 border-t border-white/[0.08]">
                <span className="text-[10px] text-[#e4bdba] block uppercase mb-1.5">
                  Play ElevenLabs Regional Warning:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { code: 'hi', label: 'HI (Hindi)' },
                    { code: 'bn', label: 'BN (Bengali)' },
                    { code: 'or', label: 'OR (Odia)' },
                    { code: 'te', label: 'TE (Telugu)' },
                    { code: 'ta', label: 'TA (Tamil)' },
                    { code: 'en', label: 'EN (English)' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        playRegionalVoiceWarning('upi', lang.code);
                        setActionSuccess(`Broadcasting ${lang.label} AI Voice Warning`);
                        setTimeout(() => setActionSuccess(''), 3000);
                      }}
                      className="py-1 bg-black hover:bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[10px] font-bold cursor-pointer transition-all active:scale-95"
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </aside>

      </div>

      {/* ── MODAL: SUBMIT NEW CITIZEN APPEAL TICKET ── */}
      {showSubmitAppealModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#10141C] border border-white/[0.1] p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00F0A0]" />
                Submit Citizen False-Positive Appeal
              </h3>
              <button onClick={() => setShowSubmitAppealModal(false)} className="text-[#e4bdba] hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewAppeal} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase text-[#e4bdba] block mb-1">Flagged VPA / Account / Phone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. merchant.bakery@oksbi or 9845012345"
                  value={newAppealVpa}
                  onChange={(e) => setNewAppealVpa(e.target.value)}
                  className="w-full bg-[#171E2B] border border-white/[0.08] p-2.5 text-xs text-white focus:outline-none focus:border-[#00F0A0]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#e4bdba] block mb-1">Transaction Amount (₹)</label>
                <input
                  type="text"
                  placeholder="e.g. ₹15,000.00"
                  value={newAppealAmount}
                  onChange={(e) => setNewAppealAmount(e.target.value)}
                  className="w-full bg-[#171E2B] border border-white/[0.08] p-2.5 text-xs text-white focus:outline-none focus:border-[#00F0A0]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#e4bdba] block mb-1">Reason Code</label>
                <select
                  value={newAppealReason}
                  onChange={(e) => setNewAppealReason(e.target.value)}
                  className="w-full bg-[#171E2B] border border-white/[0.08] p-2.5 text-xs text-white focus:outline-none focus:border-[#00F0A0]"
                >
                  <option value="Velocity Spike">Velocity Spike (Legitimate Sale Rush)</option>
                  <option value="Geo Mismatch">Geo Mismatch (VPN / Campus Hostel Proxy)</option>
                  <option value="New Device Login">New Device Login (Upgraded Phone)</option>
                  <option value="Merchant False-Positive">Merchant False-Positive (Rival Grievance)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#e4bdba] block mb-1">Dispute Explanation</label>
                <textarea
                  rows={3}
                  placeholder="Citizen / Merchant statement..."
                  value={newAppealDetails}
                  onChange={(e) => setNewAppealDetails(e.target.value)}
                  className="w-full bg-[#171E2B] border border-white/[0.08] p-2.5 text-xs text-white focus:outline-none focus:border-[#00F0A0]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitAppealModal(false)}
                  className="px-4 py-2 border border-white/[0.08] text-xs text-[#e4bdba] hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00F0A0] text-black font-bold text-xs uppercase cursor-pointer hover:bg-[#00e296]"
                >
                  Submit Appeal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD THREAT RECORD ── */}
      {showAddThreatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#10141C] border border-white/[0.1] p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#00F0A0]" />
                Add Record to Threat Registry
              </h3>
              <button onClick={() => setShowAddThreatModal(false)} className="text-[#e4bdba] hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewThreat} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase text-[#e4bdba] block mb-1">Identifier (VPA, Phone, or Bank A/C)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. scammer.officer@oksbi or +919477530475"
                  value={newThreatIdentifier}
                  onChange={(e) => setNewThreatIdentifier(e.target.value)}
                  className="w-full bg-[#171E2B] border border-white/[0.08] p-2.5 text-xs text-white focus:outline-none focus:border-[#00F0A0]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#e4bdba] block mb-1">Threat Category</label>
                <select
                  value={newThreatCategory}
                  onChange={(e) => setNewThreatCategory(e.target.value)}
                  className="w-full bg-[#171E2B] border border-white/[0.08] p-2.5 text-xs text-white focus:outline-none focus:border-[#00F0A0]"
                >
                  <option value="DIGITAL_ARREST">Digital Arrest / Fake Police Coercion</option>
                  <option value="MULE_ACCOUNT">Compromised Mule Account</option>
                  <option value="ELECTRICITY_BILL">State Discom Power Cut SMS</option>
                  <option value="PART_TIME_JOB">Telegram Rating / Part-Time Job Scam</option>
                  <option value="CUSTOMS_PARCEL">Customs Airport Parcel Extortion</option>
                  <option value="SEXTO">Sextortion / Video Call Blackmail</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#e4bdba] block mb-1">Investigative Case Details</label>
                <textarea
                  rows={3}
                  placeholder="FIR # / Modus operandi notes..."
                  value={newThreatDetails}
                  onChange={(e) => setNewThreatDetails(e.target.value)}
                  className="w-full bg-[#171E2B] border border-white/[0.08] p-2.5 text-xs text-white focus:outline-none focus:border-[#00F0A0]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddThreatModal(false)}
                  className="px-4 py-2 border border-white/[0.08] text-xs text-[#e4bdba] hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00F0A0] text-black font-bold text-xs uppercase cursor-pointer hover:bg-[#00e296]"
                >
                  Confirm &amp; Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
