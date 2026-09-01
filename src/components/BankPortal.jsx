import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, 
  XCircle, RefreshCw, Filter, Search, Database, Users, TrendingUp, 
  Sparkles, Lock, ArrowUpRight, Clock, User, Phone, Check, AlertOctagon, 
  Terminal, MapPin, Mail, Key, Landmark, ArrowRight, LogOut, Shield,
  Radio, BellRing, FileAudio, Upload, Mic, Play, Square, FileText, ChevronRight,
  ExternalLink, Eye, PlusCircle, AlertCircle, History, Trash2, Archive, RotateCcw,
  Download, Copy, ChevronLeft, ChevronsLeft, ChevronsRight, X, Layers,
  Globe, BarChart3, Activity, Gauge, Map, Sliders, Cpu, GitBranch, Target, Zap,
  DollarSign, Crosshair, Award, CheckSquare, ChevronDown, PieChart, Volume2
} from 'lucide-react';
import { INITIAL_THREAT_RECORDS } from '../threatData.js';
import { playRegionalVoiceWarning, playThreatSiren } from '../utils/audioAlerts.js';

// ════════════════════════════════════════════════════════════════════════════════
// 100% INDIA GEOSPATIAL FRAUD THREAT DATASET (State-by-State Drilldown & PIN Codes)
// ════════════════════════════════════════════════════════════════════════════════

const INDIA_STATES_HEATMAP_DATA = [
  {
    id: 'JH',
    state: 'Jharkhand',
    capital: 'Ranchi',
    hotspots: ['Jamtara', 'Deoghar', 'Giridih', 'Dumka'],
    riskIndex: 96.8,
    activeThreatNodes: 3840,
    blockedVolumeCr: 18.4,
    primaryModus: 'Bank KYC Expiry, SIM Swap & AnyDesk Screen Share',
    topMuleBanks: ['State Bank of India', 'Punjab National Bank', 'India Post Payments Bank'],
    dominantBranchIFSC: 'SBIN0001234, PUNB0182400',
    severity: 'CRITICAL',
    vulnerabilityRank: '#1',
    coordinates: { x: 67, y: 44 }, // Percentage coordinates on India Map canvas
    pinCodes: [
      { pin: '815351', city: 'Jamtara Sadar', risk: 98.6, mules: 1420, blockedVPAs: 890, amount: '₹8.42 Cr', primary: 'Bank KYC & OTP Forwarding' },
      { pin: '814112', city: 'Deoghar Cyber Belt', risk: 95.2, mules: 980, blockedVPAs: 610, amount: '₹5.15 Cr', primary: 'Electricity SMS Scam' },
      { pin: '815301', city: 'Giridih Town', risk: 91.4, mules: 740, blockedVPAs: 420, amount: '₹3.20 Cr', primary: 'Fake Credit Card Reward' }
    ]
  },
  {
    id: 'HR',
    state: 'Haryana',
    capital: 'Chandigarh',
    hotspots: ['Nuh / Mewat', 'Gurugram', 'Faridabad', 'Palwal'],
    riskIndex: 95.9,
    activeThreatNodes: 3620,
    blockedVolumeCr: 16.9,
    primaryModus: 'Sextortion, Police Officer Impersonation & OLX Vehicle Fraud',
    topMuleBanks: ['HDFC Bank', 'Axis Bank', 'IndusInd Bank'],
    dominantBranchIFSC: 'HDFC0001842, UTIB0002914',
    severity: 'CRITICAL',
    vulnerabilityRank: '#2',
    coordinates: { x: 38, y: 28 },
    pinCodes: [
      { pin: '122107', city: 'Nuh / Mewat', risk: 97.9, mules: 2180, blockedVPAs: 1340, amount: '₹11.60 Cr', primary: 'Sextortion & Fake DSP Calls' },
      { pin: '122002', city: 'Gurugram Cyber Hub', risk: 88.4, mules: 890, blockedVPAs: 540, amount: '₹4.10 Cr', primary: 'Stock Trading & IPO Mules' },
      { pin: '121001', city: 'Faridabad Industrial', risk: 85.1, mules: 550, blockedVPAs: 310, amount: '₹1.20 Cr', primary: 'Advance QR Scanner Request' }
    ]
  },
  {
    id: 'RJ',
    state: 'Rajasthan',
    capital: 'Jaipur',
    hotspots: ['Bharatpur', 'Alwar', 'Deeg', 'Jaipur'],
    riskIndex: 94.7,
    activeThreatNodes: 3150,
    blockedVolumeCr: 14.2,
    primaryModus: 'OLX Fake Army Officer, Advance QR Code Scam',
    topMuleBanks: ['Bank of Baroda', 'State Bank of India', 'AU Small Finance Bank'],
    dominantBranchIFSC: 'BARB0BHARAT, SBIN0000318',
    severity: 'CRITICAL',
    vulnerabilityRank: '#3',
    coordinates: { x: 32, y: 35 },
    pinCodes: [
      { pin: '321001', city: 'Bharatpur Cyber Corridor', risk: 96.4, mules: 1840, blockedVPAs: 920, amount: '₹9.15 Cr', primary: 'Army Officer OLX QR' },
      { pin: '301001', city: 'Alwar Border', risk: 92.8, mules: 810, blockedVPAs: 480, amount: '₹3.40 Cr', primary: 'Advance Token Payments' },
      { pin: '302001', city: 'Jaipur Central', risk: 82.3, mules: 500, blockedVPAs: 290, amount: '₹1.65 Cr', primary: 'Lottery & KBC Fraud' }
    ]
  },
  {
    id: 'DL',
    state: 'Delhi (NCR)',
    capital: 'New Delhi',
    hotspots: ['Connaught Place', 'Dwarka', 'Noida Sec 62', 'Ghaziabad'],
    riskIndex: 93.4,
    activeThreatNodes: 2980,
    blockedVolumeCr: 22.7,
    primaryModus: 'CBI / ED Digital Arrest & Customs Narcotic Parcel Extortion',
    topMuleBanks: ['ICICI Bank', 'HDFC Bank', 'Kotak Mahindra Bank'],
    dominantBranchIFSC: 'ICIC0000007, HDFC0000003',
    severity: 'CRITICAL',
    vulnerabilityRank: '#4',
    coordinates: { x: 41, y: 30 },
    pinCodes: [
      { pin: '110001', city: 'Connaught Place', risk: 93.1, mules: 1120, blockedVPAs: 760, amount: '₹14.80 Cr', primary: 'Digital Arrest & CBI Notice' },
      { pin: '201309', city: 'Noida Sector 62', risk: 90.7, mules: 810, blockedVPAs: 520, amount: '₹6.75 Cr', primary: 'Power Cut Disconnection SMS' },
      { pin: '110075', city: 'Dwarka Sector 10', risk: 86.4, mules: 610, blockedVPAs: 380, amount: '₹3.10 Cr', primary: 'Customs Courier Extortion' }
    ]
  },
  {
    id: 'WB',
    state: 'West Bengal',
    capital: 'Kolkata',
    hotspots: ['Kolkata Salt Lake', 'Sector V', 'Asansol', 'Siliguri'],
    riskIndex: 90.2,
    activeThreatNodes: 2450,
    blockedVolumeCr: 12.6,
    primaryModus: 'Fake Tech Support Call Centers & State Electricity Bill SMS',
    topMuleBanks: ['Bandhan Bank', 'State Bank of India', 'UCO Bank'],
    dominantBranchIFSC: 'BDBL0000124, SBIN0004087',
    severity: 'CRITICAL',
    vulnerabilityRank: '#5',
    coordinates: { x: 74, y: 48 },
    pinCodes: [
      { pin: '700091', city: 'Salt Lake Sector V', risk: 91.5, mules: 950, blockedVPAs: 680, amount: '₹8.20 Cr', primary: 'Fake Microsoft Tech Support' },
      { pin: '700001', city: 'Kolkata Central GPO', risk: 87.2, mules: 720, blockedVPAs: 440, amount: '₹3.10 Cr', primary: 'Electricity SMS Phishing' },
      { pin: '713301', city: 'Asansol Industrial', risk: 84.0, mules: 490, blockedVPAs: 290, amount: '₹1.30 Cr', primary: 'Loan Waiver Scams' }
    ]
  },
  {
    id: 'MH',
    state: 'Maharashtra',
    capital: 'Mumbai',
    hotspots: ['Mumbai BKC', 'Pune', 'Thane', 'Navi Mumbai'],
    riskIndex: 88.5,
    activeThreatNodes: 2890,
    blockedVolumeCr: 28.4,
    primaryModus: 'Institutional Stock Trading Mules & Pre-IPO Allotment Fraud',
    topMuleBanks: ['HDFC Bank', 'ICICI Bank', 'Standard Chartered', 'Axis Bank'],
    dominantBranchIFSC: 'HDFC0000060, AXIS0000128',
    severity: 'HIGH',
    vulnerabilityRank: '#6',
    coordinates: { x: 33, y: 56 },
    pinCodes: [
      { pin: '400051', city: 'Bandra-Kurla Complex (BKC)', risk: 88.2, mules: 780, blockedVPAs: 590, amount: '₹18.50 Cr', primary: 'High-Yield Stock Mules' },
      { pin: '411001', city: 'Pune Cantonment', risk: 84.6, mules: 620, blockedVPAs: 410, amount: '₹6.20 Cr', primary: 'Pre-IPO Allocation Schemes' },
      { pin: '400601', city: 'Thane West', risk: 81.9, mules: 490, blockedVPAs: 310, amount: '₹3.70 Cr', primary: 'Task Fraud UPI Layering' }
    ]
  },
  {
    id: 'KA',
    state: 'Karnataka',
    capital: 'Bengaluru',
    hotspots: ['Bengaluru Koramangala', 'Whitefield', 'Mysuru', 'Hubballi'],
    riskIndex: 86.1,
    activeThreatNodes: 2110,
    blockedVolumeCr: 17.3,
    primaryModus: 'Telegram Review/Rating Tasks & Crypto Arbitrage Scams',
    topMuleBanks: ['Canara Bank', 'Kotak Mahindra Bank', 'State Bank of India'],
    dominantBranchIFSC: 'CNRB0000001, KKBK0000421',
    severity: 'HIGH',
    vulnerabilityRank: '#7',
    coordinates: { x: 42, y: 72 },
    pinCodes: [
      { pin: '560001', city: 'Bengaluru Central GPO', risk: 84.8, mules: 620, blockedVPAs: 410, amount: '₹7.90 Cr', primary: 'Telegram YouTube Task Scam' },
      { pin: '560034', city: 'Koramangala Tech Zone', risk: 82.5, mules: 510, blockedVPAs: 340, amount: '₹5.60 Cr', primary: 'Crypto Arbitrage Desks' },
      { pin: '570001', city: 'Mysuru Urban', risk: 78.1, mules: 380, blockedVPAs: 220, amount: '₹3.80 Cr', primary: 'Hotel Booking Task Scam' }
    ]
  },
  {
    id: 'GJ',
    state: 'Gujarat',
    capital: 'Gandhinagar',
    hotspots: ['Surat Diamond City', 'Ahmedabad Maninagar', 'Rajkot', 'Vadodara'],
    riskIndex: 87.2,
    activeThreatNodes: 1980,
    blockedVolumeCr: 15.8,
    primaryModus: 'Layered Current Account Mules & Hawala UPI Integration',
    topMuleBanks: ['ICICI Bank', 'Axis Bank', 'Bank of Baroda'],
    dominantBranchIFSC: 'BARB0MANINA, ICIC0000045',
    severity: 'HIGH',
    vulnerabilityRank: '#8',
    coordinates: { x: 23, y: 47 },
    pinCodes: [
      { pin: '380008', city: 'Ahmedabad (Maninagar)', risk: 86.9, mules: 540, blockedVPAs: 380, amount: '₹9.40 Cr', primary: 'Hawala Mule Accounts' },
      { pin: '395003', city: 'Surat Varachha', risk: 84.1, mules: 490, blockedVPAs: 320, amount: '₹4.30 Cr', primary: 'Layered Current Account' },
      { pin: '360001', city: 'Rajkot Junction', risk: 79.8, mules: 360, blockedVPAs: 210, amount: '₹2.10 Cr', primary: 'Diamond Merchant Fake QR' }
    ]
  },
  {
    id: 'UP',
    state: 'Uttar Pradesh',
    capital: 'Lucknow',
    hotspots: ['Noida', 'Lucknow', 'Kanpur', 'Prayagraj'],
    riskIndex: 89.8,
    activeThreatNodes: 2740,
    blockedVolumeCr: 16.1,
    primaryModus: 'Electricity Power Cut SMS, Loan Waiver Scams',
    topMuleBanks: ['State Bank of India', 'Punjab National Bank', 'Bank of India'],
    dominantBranchIFSC: 'PUNB0182400, SBIN0005238',
    severity: 'HIGH',
    vulnerabilityRank: '#9',
    coordinates: { x: 52, y: 35 },
    pinCodes: [
      { pin: '201301', city: 'Noida Sector 18', risk: 89.4, mules: 710, blockedVPAs: 490, amount: '₹7.20 Cr', primary: 'Electricity Bill Cut Phishing' },
      { pin: '226001', city: 'Lucknow Hazratganj', risk: 84.2, mules: 580, blockedVPAs: 360, amount: '₹5.10 Cr', primary: 'Government Scheme Fraud' },
      { pin: '208001', city: 'Kanpur Mall Road', risk: 81.0, mules: 460, blockedVPAs: 280, amount: '₹3.80 Cr', primary: 'Kisan Loan Waiver Scams' }
    ]
  },
  {
    id: 'TG',
    state: 'Telangana',
    capital: 'Hyderabad',
    hotspots: ['Cyberabad', 'HITEC City', 'Secunderabad', 'Warangal'],
    riskIndex: 84.6,
    activeThreatNodes: 1790,
    blockedVolumeCr: 11.9,
    primaryModus: 'Instant Micro-Loan Apps & Photo Morphed Blackmail',
    topMuleBanks: ['Union Bank of India', 'State Bank of India', 'ICICI Bank'],
    dominantBranchIFSC: 'UBIN0532185, HDFC0000521',
    severity: 'HIGH',
    vulnerabilityRank: '#10',
    coordinates: { x: 46, y: 59 },
    pinCodes: [
      { pin: '500081', city: 'Madhapur / HITEC City', risk: 83.9, mules: 690, blockedVPAs: 470, amount: '₹6.10 Cr', primary: 'Chinese Loan App Harassment' },
      { pin: '500003', city: 'Secunderabad Station', risk: 80.5, mules: 450, blockedVPAs: 290, amount: '₹3.40 Cr', primary: 'Job Recruitment Scam' },
      { pin: '506001', city: 'Warangal Urban', risk: 76.2, mules: 310, blockedVPAs: 180, amount: '₹2.40 Cr', primary: 'Fake Education Scholarship' }
    ]
  },
  {
    id: 'BR',
    state: 'Bihar',
    capital: 'Patna',
    hotspots: ['Patna', 'Nawada', 'Gaya', 'Muzaffarpur'],
    riskIndex: 88.0,
    activeThreatNodes: 2240,
    blockedVolumeCr: 9.8,
    primaryModus: 'KBC Lottery Rewards & Fake Petrol Pump Allotment',
    topMuleBanks: ['State Bank of India', 'Central Bank of India', 'Punjab National Bank'],
    dominantBranchIFSC: 'CBIN0280001, SBIN0000152',
    severity: 'HIGH',
    vulnerabilityRank: '#11',
    coordinates: { x: 69, y: 37 },
    pinCodes: [
      { pin: '800001', city: 'Patna GPO', risk: 87.5, mules: 620, blockedVPAs: 410, amount: '₹4.90 Cr', primary: 'KBC Lottery WhatsApp Scam' },
      { pin: '805110', city: 'Nawada Sadar', risk: 85.0, mules: 540, blockedVPAs: 360, amount: '₹3.10 Cr', primary: 'Fake Petrol Pump Allotment' }
    ]
  },
  {
    id: 'TN',
    state: 'Tamil Nadu',
    capital: 'Chennai',
    hotspots: ['Chennai Anna Nagar', 'Coimbatore', 'Madurai'],
    riskIndex: 79.4,
    activeThreatNodes: 1320,
    blockedVolumeCr: 8.4,
    primaryModus: 'FedEx Narcotic Parcel Extortion & Work-from-Home Tasks',
    topMuleBanks: ['Indian Bank', 'Indian Overseas Bank', 'HDFC Bank'],
    dominantBranchIFSC: 'IDIB000C001, IOBA0000001',
    severity: 'MODERATE',
    vulnerabilityRank: '#12',
    coordinates: { x: 48, y: 84 },
    pinCodes: [
      { pin: '600040', city: 'Chennai Anna Nagar', risk: 79.2, mules: 440, blockedVPAs: 290, amount: '₹4.80 Cr', primary: 'FedEx Parcel Customs Call' },
      { pin: '641001', city: 'Coimbatore Town', risk: 74.8, mules: 310, blockedVPAs: 190, amount: '₹2.10 Cr', primary: 'Part-Time Amazon Task Scam' }
    ]
  }
];

export default function BankPortal({ backendUrl, onOpenMobilePortal }) {
  // Navigation tabs: 'fraud_heatmap' | 'statistics_impact' | 'disputes' | 'history' | 'database_search' | 'audio_lab' | 'sim_carrier' | 'advisories'
  const [activeTab, setActiveTab] = useState('fraud_heatmap');
  const [appeals, setAppeals] = useState([]);
  const [threats, setThreats] = useState(() => Array.isArray(INITIAL_THREAT_RECORDS) ? INITIAL_THREAT_RECORDS : []);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  
  // State Drilldown & Heatmap State
  const [selectedStateId, setSelectedStateId] = useState('JH'); // Default to #1 hotspot Jharkhand
  const [heatmapViewMode, setHeatmapViewMode] = useState('NATIONAL'); // 'NATIONAL' | 'PIN_EXPLORER'
  const [pinSearch, setPinSearch] = useState('');
  const [inspectorMode, setInspectorMode] = useState('UPI'); // 'UPI' | 'BANK'
  const [inspectorVpa, setInspectorVpa] = useState('scammer.cybercell@oksbi');
  const [inspectorAcc, setInspectorAcc] = useState('50100432918231');
  const [inspectorIfsc, setInspectorIfsc] = useState('SBIN0001234');
  
  // Officer Profile
  const [officerProfile, setOfficerProfile] = useState({
    name: 'Rajesh Verma, IPS',
    role: 'Nodal Cyber Fraud Compliance Officer',
    bankName: 'State Bank of India',
    postalCode: '560001',
    city: 'Bengaluru, Karnataka',
    stationCode: 'I4C-BLR-CYBER-042',
    badgeId: 'IND-MHA-98214'
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedThreatRecord, setSelectedThreatRecord] = useState(null);
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
          reviewerNotes: `Reviewed and resolved by Nodal Officer ${officerProfile.name}`,
          resolvedBy: officerProfile.name
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
      source: `Manual Flag by ${officerProfile.name}`,
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

  return (
    <div className="min-h-screen bg-[#090C10] text-[#DBE5DC] font-sans flex flex-col selection:bg-[#00F0A0] selection:text-[#090C10]">
      
      {/* ══════════════════════════════════════════════════════════════
          TOP COMMAND APPBAR (Material / Institutional Clean Header)
      ══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 w-full z-50 bg-[#0D1510]/95 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between px-4 sm:px-6 h-16 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        
        {/* Left: Branding & Govt Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#10141C] border border-[#00F0A0]/30 text-[#00F0A0] shadow-[0_0_15px_rgba(0,240,160,0.15)] shrink-0">
            <Landmark className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-white tracking-tight font-mono flex items-center gap-1.5">
                VERIX <span className="text-[#00F0A0]">COMMAND</span>
              </span>
              <span className="text-[10px] text-[#00D2FF] bg-[#00D2FF]/10 px-2 py-0.5 rounded font-mono border border-[#00D2FF]/20 hidden md:inline-block">
                I4C &amp; NPCI NATIONAL CYBER DEFENSE NODE
              </span>
            </div>
          </div>
        </div>

        {/* Center: Glowing Ticker Ribbon */}
        <div className="hidden lg:flex flex-1 mx-6 overflow-hidden bg-[#10141C] border border-white/[0.08] rounded-full h-8 relative items-center px-4">
          <div className="flex items-center justify-between w-full font-mono text-xs gap-6">
            <span className="flex items-center gap-1.5 text-[#00F0A0]">
              <span className="w-2 h-2 rounded-full bg-[#00F0A0] animate-pulse" />
              Pre-Auth Shield: ACTIVE
            </span>
            <span className="flex items-center gap-1.5 text-[#00D2FF]">
              <Shield className="w-3.5 h-3.5" />
              Fraud Prevented: <strong className="text-white">₹14.82 Cr</strong>
            </span>
            <span className="flex items-center gap-1.5 text-[#BAC5D5]">
              <Clock className="w-3.5 h-3.5 text-[#00F0A0]" />
              Sub-200ms Latency: <strong className="text-[#00F0A0]">184 ms</strong>
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Target className="w-3.5 h-3.5" />
              Accuracy: <strong className="text-white">98.6%</strong>
            </span>
          </div>
        </div>

        {/* Right: Actions & Profile Section */}
        <div className="flex items-center gap-3">
          {onOpenMobilePortal && (
            <button
              onClick={onOpenMobilePortal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00F0A0]/10 hover:bg-[#00F0A0]/20 border border-[#00F0A0]/30 text-xs font-mono font-bold text-[#00F0A0] transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span>📱 Mobile View</span>
            </button>
          )}

          {/* Profile Card Trigger */}
          <button 
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#10141C] hover:bg-[#171E2B] border border-white/[0.08] transition-all cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-[#171E2B] border border-[#00F0A0]/30 flex items-center justify-center text-[#00F0A0] shrink-0 font-mono text-xs font-bold">
              RV
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs text-white font-semibold leading-tight">{officerProfile.bankName}</span>
              <span className="text-[10px] text-[#8494A8] font-mono leading-tight">{officerProfile.name}</span>
            </div>
          </button>

          {/* Emergency Containment Action */}
          <button 
            onClick={() => {
              playThreatSiren();
              setActionSuccess('EMERGENCY LOCKDOWN: Pre-Auth Threat Shield Armed at 100% Interception');
              setTimeout(() => setActionSuccess(''), 4000);
            }}
            className="px-3 py-1.5 bg-[#FF4B4B]/10 hover:bg-[#FF4B4B]/20 border border-[#FF4B4B]/40 text-[#FF4B4B] rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,75,75,0.2)] active:scale-95"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EMERGENCY CONTAINMENT</span>
          </button>
        </div>
      </header>

      {/* ── ACTION NOTIFICATION TOAST ── */}
      {actionSuccess && (
        <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl bg-[#00F0A0]/15 border border-[#00F0A0]/40 text-[#00F0A0] text-xs font-mono font-bold flex items-center gap-2 animate-slide-down shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-[#00F0A0]" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MAIN WORKSPACE LAYOUT (Side Rail + Central Canvas + Right Inspector)
      ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col md:flex-row p-3 sm:p-5 gap-4 overflow-hidden">
        
        {/* LEFT COMPACT NAVIGATION RAIL */}
        <aside className="w-full md:w-56 shrink-0 flex flex-col gap-1.5 bg-[#10141C] border border-white/[0.08] rounded-2xl p-3 shadow-xl">
          <span className="text-[10px] font-mono font-bold uppercase text-[#546274] px-2 mb-1 tracking-wider">
            Surveillance Grid
          </span>

          {[
            { id: 'fraud_heatmap', label: 'India Threat Maps', icon: Globe, count: 'Live', badgeColor: 'bg-[#00F0A0]/20 text-[#00F0A0]' },
            { id: 'statistics_impact', label: 'ROI & Loss Reduction', icon: BarChart3, count: '₹14.8Cr', badgeColor: 'bg-cyan-400/20 text-cyan-300' },
            { id: 'disputes', label: 'Appeals Queue', icon: FileText, count: pendingCount > 0 ? `${pendingCount} New` : appeals.length, badgeColor: pendingCount > 0 ? 'bg-amber-400/25 text-amber-300' : 'bg-white/10 text-white/70' },
            { id: 'history', label: 'Disputes History', icon: History, count: 'Audit', badgeColor: 'bg-emerald-400/20 text-emerald-300' },
            { id: 'database_search', label: 'Threat Registry', icon: Database, count: threats.length.toLocaleString(), badgeColor: 'bg-purple-400/20 text-purple-300' },
            { id: 'audio_lab', label: 'Voice Phishing Lab', icon: Mic, count: 'AI', badgeColor: 'bg-rose-400/20 text-rose-300' },
            { id: 'sim_carrier', label: 'SIM Swap Monitor', icon: Radio, count: 'IMSI', badgeColor: 'bg-blue-400/20 text-blue-300' },
            { id: 'advisories', label: 'I4C Advisories', icon: BellRing, count: '3', badgeColor: 'bg-white/10 text-white/70' }
          ].map(({ id, label, icon: Icon, count, badgeColor }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === id
                  ? 'bg-[#00F0A0]/15 text-[#00F0A0] font-bold border border-[#00F0A0]/30 shadow-sm'
                  : 'text-[#8494A8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${activeTab === id ? 'text-[#00F0A0]' : 'text-[#8494A8]'}`} />
                <span className="truncate">{label}</span>
              </div>
              {count && <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${badgeColor}`}>{count}</span>}
            </button>
          ))}

          {/* Quick Telemetry Footnote */}
          <div className="mt-auto pt-3 border-t border-white/[0.06] space-y-1 text-[10px] font-mono text-[#738294] p-1">
            <div className="flex justify-between">
              <span>Station:</span>
              <span className="text-white truncate max-w-[90px]">{officerProfile.stationCode}</span>
            </div>
            <div className="flex justify-between">
              <span>Jurisdiction:</span>
              <span className="text-[#00D2FF]">{selectedState.state}</span>
            </div>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════════
            CENTER SURVEILLANCE STAGE (HEATMAP / DRILLDOWN)
        ══════════════════════════════════════════════════════════════ */}
        <main className="flex-1 flex flex-col gap-4 overflow-y-auto">
          
          {/* ────────────────────────────────────────────────────────
              VIEW 1: 100% INDIA THREAT HEATMAP & STATE DRILLDOWN
          ──────────────────────────────────────────────────────── */}
          {activeTab === 'fraud_heatmap' && (
            <div className="flex-1 flex flex-col gap-4">
              
              {/* Top View Mode & State Selector Bar */}
              <div className="p-3.5 rounded-2xl bg-[#10141C] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#00F0A0] flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#00F0A0]" /> National Threat Radar:
                  </span>
                  <div className="flex items-center p-0.5 bg-[#090C10] border border-white/[0.08] rounded-xl text-xs font-mono">
                    <button
                      onClick={() => setHeatmapViewMode('NATIONAL')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        heatmapViewMode === 'NATIONAL' ? 'bg-[#00F0A0] text-[#080B0F] font-bold shadow' : 'text-[#8494A8] hover:text-white'
                      }`}
                    >
                      🇮🇳 State Heatmap
                    </button>
                    <button
                      onClick={() => setHeatmapViewMode('PIN_EXPLORER')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        heatmapViewMode === 'PIN_EXPLORER' ? 'bg-[#00F0A0] text-[#080B0F] font-bold shadow' : 'text-[#8494A8] hover:text-white'
                      }`}
                    >
                      📍 PIN Explorer
                    </button>
                  </div>
                </div>

                {/* State Dropdown Selector */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-mono text-[#8494A8] shrink-0">Focus State:</span>
                  <select
                    value={selectedStateId}
                    onChange={(e) => setSelectedStateId(e.target.value)}
                    className="w-full sm:w-56 bg-[#090C10] border border-[#00F0A0]/40 rounded-xl py-1.5 px-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#00F0A0] transition-all cursor-pointer"
                  >
                    {INDIA_STATES_HEATMAP_DATA.map((st) => (
                      <option key={st.id} value={st.id} className="bg-[#10141C] text-white">
                        {st.vulnerabilityRank} {st.state} ({st.riskIndex}% Risk)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2-Column Responsive Surveillance Stage */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1">
                
                {/* Visual SVG Map Canvas (7 Cols) */}
                <div className="xl:col-span-7 p-4 rounded-2xl bg-[#10141C] border border-white/[0.08] relative min-h-[360px] flex flex-col justify-between overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between z-10">
                    <span className="text-xs font-mono uppercase text-[#8494A8] flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#00F0A0]" />
                      Interactive National Surveillance Grid (Click State to Drill Down)
                    </span>
                    <span className="text-[10px] font-mono text-[#00D2FF] bg-[#00D2FF]/10 px-2 py-0.5 rounded border border-[#00D2FF]/20">
                      Live GPS Sync
                    </span>
                  </div>

                  {/* Interactive SVG India Grid Map */}
                  <div className="relative w-full h-72 sm:h-80 my-2 flex items-center justify-center">
                    {/* SVG Base Silhouette */}
                    <svg viewBox="0 0 100 100" className="w-full h-full max-h-72 opacity-90 filter drop-shadow-[0_0_15px_rgba(0,240,160,0.1)]">
                      {/* Stylized India Geometric Landmass */}
                      <path
                        d="M 38 12 L 48 8 L 54 14 L 46 22 L 56 26 L 68 28 L 74 36 L 86 38 L 82 46 L 72 48 L 68 56 L 62 66 L 52 86 L 46 88 L 44 76 L 36 64 L 28 54 L 20 48 L 22 36 L 30 26 Z"
                        fill="#171E2B"
                        stroke="#00F0A0"
                        strokeWidth="0.8"
                        strokeDasharray="2 1"
                        className="transition-all"
                      />
                      {/* Radar sweep circle */}
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#00D2FF" strokeWidth="0.3" strokeOpacity="0.3" />
                      <circle cx="50" cy="50" r="28" fill="none" stroke="#00F0A0" strokeWidth="0.3" strokeOpacity="0.3" />
                    </svg>

                    {/* Interactive State Nodal Pins */}
                    {INDIA_STATES_HEATMAP_DATA.map((st) => {
                      const isSelected = st.id === selectedStateId;
                      return (
                        <button
                          key={st.id}
                          onClick={() => setSelectedStateId(st.id)}
                          style={{ left: `${st.coordinates.x}%`, top: `${st.coordinates.y}%` }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-full transition-all cursor-pointer group z-20 ${
                            isSelected 
                              ? 'scale-125 ring-4 ring-[#00F0A0] shadow-[0_0_20px_#00F0A0]' 
                              : 'hover:scale-110'
                          }`}
                          title={`${st.state}: ${st.riskIndex}% Threat Index`}
                        >
                          <span className={`w-3 h-3 rounded-full block ${
                            st.riskIndex >= 90 ? 'bg-[#FF4B4B] animate-pulse' : 'bg-[#00D2FF]'
                          }`} />
                          
                          {/* Hover Tooltip Card */}
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#090C10] border border-white/[0.12] rounded-lg px-2 py-1 text-[10px] font-mono text-white whitespace-nowrap shadow-2xl z-30">
                            <strong>{st.state}</strong>: {st.riskIndex}% ({st.blockedVolumeCr} Cr)
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Map Legend */}
                  <div className="flex items-center justify-between text-[10.5px] font-mono text-[#8494A8] border-t border-white/[0.06] pt-2 z-10">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#FF4B4B]" /> Critical Zone (&ge;90%)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#00D2FF]" /> High Activity (75-89%)
                      </span>
                    </div>
                    <span className="text-[#00F0A0] font-bold">Selected: {selectedState.state} ({selectedState.id})</span>
                  </div>
                </div>

                {/* State Detailed Drilldown Card (5 Cols) */}
                <div className="xl:col-span-5 p-5 rounded-2xl bg-[#10141C] border border-white/[0.08] flex flex-col justify-between shadow-xl space-y-4">
                  
                  {/* Selected State Header */}
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00F0A0]/15 text-[#00F0A0] border border-[#00F0A0]/30">
                            STATE DOSSIER #{selectedState.vulnerabilityRank}
                          </span>
                          <span className="text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                            {selectedState.riskIndex}% THREAT INDEX
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-white font-mono mt-1 flex items-center gap-2">
                          {selectedState.state} <span className="text-sm text-[#8494A8]">({selectedState.capital})</span>
                        </h2>
                      </div>

                      <span className="text-right">
                        <span className="text-[10px] font-mono text-[#738294] block">Blocked Volume</span>
                        <strong className="text-base font-mono text-[#00F0A0]">₹{selectedState.blockedVolumeCr} Cr</strong>
                      </span>
                    </div>

                    {/* Modus Operandi Banner */}
                    <div className="mt-3 p-3 rounded-xl bg-[#090C10] border border-white/[0.06] space-y-1">
                      <span className="text-[10px] font-mono uppercase text-[#738294] block">Primary Modus Operandi in {selectedState.state}:</span>
                      <p className="text-xs text-amber-300 font-sans font-medium">
                        {selectedState.primaryModus}
                      </p>
                    </div>
                  </div>

                  {/* Hotspot Districts & Targeted Banks */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-[#090C10] border border-white/[0.06] space-y-1">
                      <span className="text-[10px] text-[#738294]">Hotspot Districts:</span>
                      <p className="text-white font-bold truncate">{selectedState.hotspots.join(', ')}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#090C10] border border-white/[0.06] space-y-1">
                      <span className="text-[10px] text-[#738294]">Active Threat Nodes:</span>
                      <p className="text-[#00D2FF] font-bold">{selectedState.activeThreatNodes.toLocaleString()} Nodes</p>
                    </div>
                  </div>

                  {/* Local PIN Code Micro-Clusters for this Selected State */}
                  <div className="space-y-2">
                    <span className="text-[10.5px] font-mono uppercase text-[#8494A8] font-bold block">
                      Local 6-Digit PIN Code Clusters in {selectedState.state}:
                    </span>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {selectedState.pinCodes.map((p) => (
                        <div key={p.pin} className="p-2.5 rounded-xl bg-[#090C10] border border-white/[0.06] hover:border-[#00F0A0]/40 transition-all flex items-center justify-between text-xs font-mono">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#00F0A0]">{p.pin}</span>
                              <span className="text-white font-sans text-xs">({p.city})</span>
                            </div>
                            <span className="text-[10px] text-[#738294] block truncate max-w-[200px]">{p.primary}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-white block">{p.amount}</span>
                            <span className="text-[10px] text-rose-400 font-bold">{p.mules} Mules</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Targeted Branch IFSC Registry */}
                  <div className="text-[10.5px] font-mono text-[#8494A8] pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span>Flagged IFSC Branches:</span>
                    <span className="text-white font-bold truncate max-w-[220px]">{selectedState.dominantBranchIFSC}</span>
                  </div>
                </div>

              </div>

              {/* Bottom Telemetry & PIN Code Explorer */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* 6-Digit PIN Code Explorer (6 Cols) */}
                <div className="md:col-span-6 p-4 rounded-2xl bg-[#10141C] border border-white/[0.08] shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#00F0A0]" />
                      National PIN Code Micro-Cluster Search
                    </span>
                    <span className="text-[10px] font-mono text-[#738294]">Instant Lookup</span>
                  </div>

                  <div className="relative">
                    <Search className="w-4 h-4 text-[#738294] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={pinSearch}
                      onChange={(e) => setPinSearch(e.target.value)}
                      placeholder="Search 6-digit PIN code (e.g. 815351, 122107, 110001)..."
                      className="w-full bg-[#090C10] border border-white/[0.1] rounded-xl py-2 pl-9 pr-3 text-xs font-mono text-white placeholder:text-[#546274] focus:outline-none focus:border-[#00F0A0]"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { pin: '815351', city: 'Jamtara', mules: 1420, risk: 98.6 },
                      { pin: '122107', city: 'Nuh/Mewat', mules: 2180, risk: 97.9 },
                      { pin: '321001', city: 'Bharatpur', mules: 1840, risk: 96.4 }
                    ].map(card => (
                      <div key={card.pin} className="p-2.5 rounded-xl bg-[#090C10] border border-white/[0.06] space-y-1">
                        <div className="flex justify-between items-center font-mono text-xs">
                          <strong className="text-white">{card.pin}</strong>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B4B]" />
                        </div>
                        <span className="text-[10px] text-[#738294] block truncate">{card.city}</span>
                        <span className="text-xs font-bold text-rose-400 font-mono block">{card.mules} Mules</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Research-Backed Explainable AI & Mathematical Risk Formula (6 Cols) */}
                <div className="md:col-span-6 p-4 rounded-2xl bg-[#10141C] border border-white/[0.08] shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[#00D2FF]" />
                      Auditable Risk Score Fusion (HELF Hybrid Equation)
                    </span>
                    <span className="text-[10px] font-mono text-[#00F0A0] bg-[#00F0A0]/10 px-2 py-0.5 rounded">
                      RBI XAI Aligned
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#090C10] border border-white/[0.06] text-center font-mono text-xs text-[#00D2FF]">
                    <code>S = 0.70·(0.20·P_LR + 0.45·P_RF + 0.35·P_XGB) + 0.30·A_IF</code>
                  </div>

                  {/* SHAP Feature Contribution Bars */}
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-[#8494A8]">
                      <span>f1: Amount Deviation Z-Score</span>
                      <strong className="text-rose-400">+0.42 SHAP (32%)</strong>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="bg-[#FF4B4B] h-full rounded-full" style={{ width: '78%' }} />
                    </div>

                    <div className="flex justify-between text-[#8494A8]">
                      <span>f3: Receiver VPA &amp; IFSC Trust</span>
                      <strong className="text-[#00F0A0]">-0.18 SHAP (24%)</strong>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="bg-[#00F0A0] h-full rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              VIEW 2: LIVE ROI & FINANCIAL LOSS REDUCTION
          ──────────────────────────────────────────────────────── */}
          {activeTab === 'statistics_impact' && (
            <div className="p-5 rounded-2xl bg-[#10141C] border border-white/[0.08] space-y-5 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#00F0A0]" />
                    Financial Fraud Loss Reduction &amp; Bank ROI Calculator
                  </h2>
                  <p className="text-xs text-[#8494A8] font-mono mt-0.5">
                    Empirical validation of pre-authorization interception vs post-authorization chargeback losses.
                  </p>
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#090C10] border border-white/[0.06]">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#8494A8]">Daily Bank UPI Transaction Volume:</span>
                    <strong className="text-[#00F0A0]">{simulatedTxnVolume.toLocaleString()} txns/day</strong>
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

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#8494A8]">Average Ticket Size:</span>
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

              <div className="p-4 rounded-xl bg-[#00F0A0]/10 border border-[#00F0A0]/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-[#8494A8] block">Projected Annual Savings with VERIX:</span>
                  <strong className="text-2xl font-bold font-mono text-[#00F0A0]">
                    ₹{((simulatedTxnVolume * 365 * 0.0062 * simulatedAvgTicket * 0.986) / 10000000).toFixed(2)} Cr
                  </strong>
                </div>
                <span className="text-xs font-mono text-[#00F0A0] bg-[#00F0A0]/15 px-3 py-1.5 rounded-xl border border-[#00F0A0]/30 font-bold">
                  98.6% Fraud Mitigated
                </span>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              VIEW 3: APPEALS QUEUE
          ──────────────────────────────────────────────────────── */}
          {activeTab === 'disputes' && (
            <div className="p-5 rounded-2xl bg-[#10141C] border border-white/[0.08] space-y-4 shadow-xl">
              <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00F0A0]" />
                False-Positive Appeals Review Desk
              </h2>
              <div className="space-y-2">
                {appeals.length === 0 ? (
                  <p className="text-xs font-mono text-[#738294] p-4 bg-[#090C10] rounded-xl text-center">Queue is clean. No pending appeals.</p>
                ) : (
                  appeals.map(a => (
                    <div key={a.appealId || a.ticketId} className="p-3 bg-[#090C10] rounded-xl border border-white/[0.06] flex items-center justify-between text-xs font-mono">
                      <span>{a.appealId || a.ticketId} • {a.vpa} • ₹{a.amount}</span>
                      <button onClick={() => setSelectedTicket(a)} className="px-3 py-1 bg-[#171E2B] text-[#00F0A0] rounded-lg">Inspect</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              VIEW 4: THREAT REGISTRY DATABASE
          ──────────────────────────────────────────────────────── */}
          {activeTab === 'database_search' && (
            <div className="p-5 rounded-2xl bg-[#10141C] border border-white/[0.08] space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#00F0A0]" />
                  National Blacklisted Threats ({threats.length.toLocaleString()} Records)
                </h2>
                <button onClick={() => setShowAddThreatModal(true)} className="px-3 py-1 bg-[#00F0A0] text-[#080B0F] font-bold text-xs rounded-lg">+ Add</button>
              </div>
              <div className="space-y-1.5 max-h-[480px] overflow-y-auto">
                {threats.slice(0, 30).map((t, idx) => (
                  <div key={idx} className="p-2.5 bg-[#090C10] rounded-xl border border-white/[0.06] flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-bold">{t.identifier} ({t.type})</span>
                    <span className="text-rose-400 font-bold">{t.riskScore || 95}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

        {/* ══════════════════════════════════════════════════════════════
            RIGHT INSPECTOR PANEL (Sentinel Engine, Threat HUD & Audio)
        ══════════════════════════════════════════════════════════════ */}
        <aside className="w-full xl:w-80 shrink-0 flex flex-col gap-4">
          
          {/* Transfer Mode Selector */}
          <div className="p-1 bg-[#10141C] border border-white/[0.08] rounded-2xl flex shadow-md">
            <button
              onClick={() => setInspectorMode('UPI')}
              className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                inspectorMode === 'UPI' ? 'bg-[#00F0A0] text-[#080B0F] shadow-[0_0_10px_rgba(0,240,160,0.3)]' : 'text-[#8494A8] hover:text-white'
              }`}
            >
              ⚡ UPI ID / QR
            </button>
            <button
              onClick={() => setInspectorMode('BANK')}
              className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                inspectorMode === 'BANK' ? 'bg-[#00F0A0] text-[#080B0F] shadow-[0_0_10px_rgba(0,240,160,0.3)]' : 'text-[#8494A8] hover:text-white'
              }`}
            >
              🏦 Bank A/C + IFSC
            </button>
          </div>

          {/* High-Voltage 95% Threat Interception HUD */}
          <div className="p-4 rounded-2xl bg-[#10141C] border border-[#FF4B4B]/40 shadow-[0_0_20px_rgba(255,75,75,0.15)] relative overflow-hidden space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF4B4B]/10 border border-[#FF4B4B]/30 flex items-center justify-center text-[#FF4B4B] shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#FF4B4B] uppercase font-bold tracking-wider">High-Voltage Intercept</span>
                <h3 className="text-sm font-bold text-white font-mono">95% CRITICAL THREAT</h3>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#090C10] border border-[#FF4B4B]/20 space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#738294] block">Modus Operandi:</span>
              <span className="text-xs font-mono font-bold text-[#FF4B4B] block">
                &gt; DIGITAL ARREST (POLICE COERCION)
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActionSuccess(`VPA ${inspectorVpa} hard-blocked across National Registry.`);
                  setTimeout(() => setActionSuccess(''), 3000);
                }}
                className="flex-1 py-2 rounded-xl bg-[#FF4B4B] hover:bg-rose-600 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                BLOCK VPA
              </button>
              <button
                onClick={() => {
                  setActionSuccess(`1930 Cybercrime Dossier dispatched to I4C portal.`);
                  setTimeout(() => setActionSuccess(''), 3000);
                }}
                className="flex-1 py-2 rounded-xl bg-[#171E2B] hover:bg-[#1E2636] border border-white/[0.1] text-xs font-mono text-white transition-all cursor-pointer"
              >
                1930 DOSSIER
              </button>
            </div>
          </div>

          {/* Voice Phishing Equalizer Wave & Regional Audio Controls */}
          <div className="p-4 rounded-2xl bg-[#10141C] border border-white/[0.08] shadow-xl space-y-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                Regional Audio Sentinel
              </span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                ElevenLabs LPU
              </span>
            </div>

            {/* Audio Wave Visualizer Simulation */}
            <div className="h-12 flex items-end justify-between gap-1 px-2 py-1 bg-[#090C10] rounded-xl border border-white/[0.04]">
              <div className="w-1.5 bg-[#00F0A0] rounded-t-sm h-[40%] animate-pulse" />
              <div className="w-1.5 bg-[#00D2FF] rounded-t-sm h-[75%] animate-pulse" />
              <div className="w-1.5 bg-[#00F0A0] rounded-t-sm h-[50%] animate-pulse" />
              <div className="w-1.5 bg-purple-400 rounded-t-sm h-[90%] animate-pulse" />
              <div className="w-1.5 bg-[#FF4B4B] rounded-t-sm h-[65%] animate-pulse" />
              <div className="w-1.5 bg-[#00D2FF] rounded-t-sm h-[80%] animate-pulse" />
              <div className="w-1.5 bg-[#00F0A0] rounded-t-sm h-[45%] animate-pulse" />
              <div className="w-1.5 bg-purple-400 rounded-t-sm h-[70%] animate-pulse" />
            </div>

            {/* 6 Regional Language Pill Triggers */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#738294] block">Play Regional Warning Voice:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { lang: 'hi', label: 'Hindi (HI)' },
                  { lang: 'bn', label: 'Bengali (BN)' },
                  { lang: 'or', label: 'Odia (OR)' },
                  { lang: 'te', label: 'Telugu (TE)' },
                  { lang: 'ta', label: 'Tamil (TA)' },
                  { lang: 'en', label: 'English (EN)' }
                ].map(item => (
                  <button
                    key={item.lang}
                    onClick={() => playRegionalVoiceWarning('upi', item.lang)}
                    className="py-1 px-1.5 rounded-lg bg-[#090C10] hover:bg-[#00F0A0]/20 border border-white/[0.08] hover:border-[#00F0A0]/40 text-[10px] font-mono text-white transition-all cursor-pointer text-center"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </aside>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          MODAL: OFFICER PROFILE & JURISDICTION SETUP
      ══════════════════════════════════════════════════════════════ */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#10141C] border border-white/[0.12] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00F0A0]" />
                <h3 className="text-sm font-bold text-white font-mono">Officer Profile &amp; Station Jurisdiction</h3>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="p-1 rounded-lg text-[#8494A8] hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-[#090C10] rounded-xl border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-[#738294]">Officer Name &amp; Rank:</span>
                <p className="text-white font-bold">{officerProfile.name}</p>
              </div>

              <div className="p-3 bg-[#090C10] rounded-xl border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-[#738294]">Banking / Law Enforcement Entity:</span>
                <p className="text-[#00D2FF] font-bold">{officerProfile.bankName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#090C10] rounded-xl border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-[#738294]">PIN Code:</span>
                  <p className="text-[#00F0A0] font-bold">{officerProfile.postalCode}</p>
                </div>
                <div className="p-3 bg-[#090C10] rounded-xl border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-[#738294]">Station Node:</span>
                  <p className="text-white font-bold">{officerProfile.stationCode}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#00F0A0] text-[#080B0F] font-bold font-mono text-xs cursor-pointer shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: ADD NEW THREAT RECORD
      ══════════════════════════════════════════════════════════════ */}
      {showAddThreatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleAddNewThreat} className="w-full max-w-md bg-[#10141C] border border-white/[0.12] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#00F0A0]" /> Add Threat to Registry
              </h3>
              <button type="button" onClick={() => setShowAddThreatModal(false)} className="text-[#8494A8] hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              value={newThreatIdentifier}
              onChange={(e) => setNewThreatIdentifier(e.target.value)}
              placeholder="UPI VPA or Phone (+91)..."
              className="w-full bg-[#090C10] border border-white/[0.1] rounded-xl py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-[#00F0A0]"
              required
            />
            <button type="submit" className="w-full py-2.5 bg-[#00F0A0] text-[#080B0F] font-bold font-mono text-xs rounded-xl">Save</button>
          </form>
        </div>
      )}

    </div>
  );
}
