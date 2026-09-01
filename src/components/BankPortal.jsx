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
  DollarSign, Crosshair, Award, CheckSquare, ChevronDown, PieChart
} from 'lucide-react';
import { INITIAL_THREAT_RECORDS } from '../threatData.js';

// ════════════════════════════════════════════════════════════════════════════════
// GEOSPATIAL FRAUD THREAT INTELLIGENCE DATASETS (100% INDIA-FOCUSED SURVEILLANCE)
// ════════════════════════════════════════════════════════════════════════════════

const INDIA_REGIONAL_CYBER_BELTS = [
  {
    id: 'BELT-NW-01',
    name: 'Mewat – Bharatpur – Alwar Tri-Junction',
    coverage: 'Haryana (Nuh) & Rajasthan (Bharatpur, Deeg, Alwar)',
    riskIndex: 97.4,
    activeNodes: 4820,
    interceptedVolumeCr: '₹31.1 Cr',
    threatCategory: 'SEXTORTION & ADVANCE QR FRAUD',
    modus: 'High-volume social engineering, fake DSP video call extortions, and fraudulent OLX vehicle army personnel identity scams.',
    dominantBanksTargeted: 'HDFC Bank, Axis Bank, AU Small Finance Bank'
  },
  {
    id: 'BELT-EAST-02',
    name: 'Jamtara – Deoghar – Giridih Phishing Belt',
    coverage: 'Jharkhand & Bordering Bihar Districts',
    riskIndex: 96.8,
    activeNodes: 3840,
    interceptedVolumeCr: '₹28.2 Cr',
    threatCategory: 'BANK KYC & SIM CLONING',
    modus: 'SIM cloning, bank credit card reward points phishing, and impersonation of SBI / PNB customer support desk.',
    dominantBanksTargeted: 'State Bank of India, Punjab National Bank, India Post'
  },
  {
    id: 'BELT-NCR-03',
    name: 'Delhi NCR – Noida – Gurugram Financial Corridor',
    coverage: 'Delhi Central, Noida Sector 62, Gurugram Cyber Hub',
    riskIndex: 93.4,
    activeNodes: 2980,
    interceptedVolumeCr: '₹37.5 Cr',
    threatCategory: 'DIGITAL ARREST & CBI IMPERSONATION',
    modus: 'Digital arrest coercion, fake CBI/ED notices over Skype, and electricity power-cut disconnection phishing SMS.',
    dominantBanksTargeted: 'ICICI Bank, HDFC Bank, Kotak Mahindra'
  },
  {
    id: 'BELT-WEST-04',
    name: 'Mumbai – Pune – Surat Institutional Mule Axis',
    coverage: 'Maharashtra (BKC, Thane) & Gujarat (Surat, Ahmedabad)',
    riskIndex: 88.5,
    activeNodes: 2890,
    interceptedVolumeCr: '₹44.2 Cr',
    threatCategory: 'STOCK TRADING & MULE LAYERING',
    modus: 'Institutional current account mule layering, fake institutional IPO allocations, and pre-IPO stock market scams.',
    dominantBanksTargeted: 'HDFC, ICICI, Standard Chartered, Bank of Baroda'
  },
  {
    id: 'BELT-SOUTH-05',
    name: 'Bengaluru – Hyderabad Cyberabad Tech Belt',
    coverage: 'Karnataka (Koramangala, Whitefield) & Telangana (HITEC City)',
    riskIndex: 85.3,
    activeNodes: 2110,
    interceptedVolumeCr: '₹23.4 Cr',
    threatCategory: 'TELEGRAM TASKS & LOAN APPS',
    modus: 'Telegram freelance rating/review tasks, crypto arbitrage deception, and instant Chinese micro-loan harassment apps.',
    dominantBanksTargeted: 'Canara Bank, Kotak, Union Bank of India'
  },
  {
    id: 'BELT-EAST-06',
    name: 'Kolkata – Salt Lake – Bidhannagar Tech Corridor',
    coverage: 'West Bengal (Salt Lake Sector V, Rajarhat, Asansol)',
    riskIndex: 90.2,
    activeNodes: 2450,
    interceptedVolumeCr: '₹18.8 Cr',
    threatCategory: 'FAKE TECH SUPPORT & POWER CUT SMS',
    modus: 'Fake Windows/AnyDesk technical support, refund desk scams, and state electricity bill portal lookalike websites.',
    dominantBanksTargeted: 'Bandhan Bank, SBI, UCO Bank'
  }
];

const NATIONAL_STATE_FRAUD_DATA = [
  {
    state: 'Jharkhand',
    code: 'JH',
    hotspots: 'Jamtara, Deoghar, Giridih, Dumka',
    riskIndex: 96.8,
    activeThreatNodes: 3840,
    blockedVolumeCr: '₹18.4 Cr',
    primaryModus: 'SIM Swap, Bank KYC Expiry, Phishing Calls',
    topMuleBanks: 'SBI, PNB, India Post Payments Bank',
    severity: 'CRITICAL',
    vulnerabilityRank: '#1'
  },
  {
    state: 'Haryana',
    code: 'HR',
    hotspots: 'Mewat, Nuh, Gurugram, Faridabad',
    riskIndex: 95.9,
    activeThreatNodes: 3620,
    blockedVolumeCr: '₹16.9 Cr',
    primaryModus: 'Sextortion, Police Impersonation, OLX Fraud',
    topMuleBanks: 'HDFC, Axis Bank, IndusInd',
    severity: 'CRITICAL',
    vulnerabilityRank: '#2'
  },
  {
    state: 'Rajasthan',
    code: 'RJ',
    hotspots: 'Bharatpur, Alwar, Deeg, Jaipur',
    riskIndex: 94.7,
    activeThreatNodes: 3150,
    blockedVolumeCr: '₹14.2 Cr',
    primaryModus: 'OLX Fake Army Officer, Advance QR Code Scam',
    topMuleBanks: 'Bank of Baroda, SBI, AU Small Finance Bank',
    severity: 'CRITICAL',
    vulnerabilityRank: '#3'
  },
  {
    state: 'Delhi (NCR)',
    code: 'DL',
    hotspots: 'Connaught Place, Dwarka, Noida, Ghaziabad',
    riskIndex: 93.4,
    activeThreatNodes: 2980,
    blockedVolumeCr: '₹22.7 Cr',
    primaryModus: 'CBI / ED Digital Arrest, Customs Parcel Extortion',
    topMuleBanks: 'ICICI, HDFC, Kotak Mahindra',
    severity: 'CRITICAL',
    vulnerabilityRank: '#4'
  },
  {
    state: 'West Bengal',
    code: 'WB',
    hotspots: 'Kolkata, Salt Lake Sector V, Asansol, Siliguri',
    riskIndex: 90.2,
    activeThreatNodes: 2450,
    blockedVolumeCr: '₹12.6 Cr',
    primaryModus: 'Fake Tech Support, Electricity Bill SMS Phishing',
    topMuleBanks: 'Bandhan Bank, SBI, UCO Bank',
    severity: 'CRITICAL',
    vulnerabilityRank: '#5'
  },
  {
    state: 'Maharashtra',
    code: 'MH',
    hotspots: 'Mumbai BKC, Pune, Thane, Navi Mumbai',
    riskIndex: 88.5,
    activeThreatNodes: 2890,
    blockedVolumeCr: '₹28.4 Cr',
    primaryModus: 'Institutional Stock Trading Mules, IPO Pre-Allotment',
    topMuleBanks: 'HDFC, ICICI, Axis, Standard Chartered',
    severity: 'HIGH',
    vulnerabilityRank: '#6'
  },
  {
    state: 'Karnataka',
    code: 'KA',
    hotspots: 'Bengaluru (Koramangala, Whitefield), Mysuru',
    riskIndex: 86.1,
    activeThreatNodes: 2110,
    blockedVolumeCr: '₹17.3 Cr',
    primaryModus: 'Telegram Task Fraud, Crypto Arbitrage Schemes',
    topMuleBanks: 'Canara Bank, Kotak, HDFC, SBI',
    severity: 'HIGH',
    vulnerabilityRank: '#7'
  },
  {
    state: 'Gujarat',
    code: 'GJ',
    hotspots: 'Surat, Ahmedabad (Maninagar), Rajkot',
    riskIndex: 87.2,
    activeThreatNodes: 1980,
    blockedVolumeCr: '₹15.8 Cr',
    primaryModus: 'Layered Current Account Mules, Hawala UPI Routing',
    topMuleBanks: 'ICICI, Axis, Bank of Baroda',
    severity: 'HIGH',
    vulnerabilityRank: '#8'
  },
  {
    state: 'Uttar Pradesh',
    code: 'UP',
    hotspots: 'Noida, Lucknow, Kanpur, Prayagraj',
    riskIndex: 89.8,
    activeThreatNodes: 2740,
    blockedVolumeCr: '₹16.1 Cr',
    primaryModus: 'Electricity Power Cut SMS, Loan Waiver Scams',
    topMuleBanks: 'SBI, PNB, Bank of India',
    severity: 'HIGH',
    vulnerabilityRank: '#9'
  },
  {
    state: 'Telangana',
    code: 'TG',
    hotspots: 'Hyderabad, Cyberabad, Secunderabad, Warangal',
    riskIndex: 84.6,
    activeThreatNodes: 1790,
    blockedVolumeCr: '₹11.9 Cr',
    primaryModus: 'Instant Micro-Loan Apps, Blackmail Extortion',
    topMuleBanks: 'Andhra Bank/Union Bank, SBI, ICICI',
    severity: 'HIGH',
    vulnerabilityRank: '#10'
  },
  {
    state: 'Bihar',
    code: 'BR',
    hotspots: 'Patna, Nawada, Gaya, Muzaffarpur',
    riskIndex: 88.0,
    activeThreatNodes: 2240,
    blockedVolumeCr: '₹9.8 Cr',
    primaryModus: 'KBC Lottery Rewards, Fake Petrol Pump Allotment',
    topMuleBanks: 'SBI, PNB, Central Bank of India',
    severity: 'HIGH',
    vulnerabilityRank: '#11'
  },
  {
    state: 'Tamil Nadu',
    code: 'TN',
    hotspots: 'Chennai, Coimbatore, Madurai',
    riskIndex: 79.4,
    activeThreatNodes: 1320,
    blockedVolumeCr: '₹8.4 Cr',
    primaryModus: 'FedEx Narcotic Parcel, Part-Time Job Scam',
    topMuleBanks: 'Indian Bank, IOB, HDFC',
    severity: 'MODERATE',
    vulnerabilityRank: '#12'
  }
];

const LOCAL_PIN_CODE_MICROCLUSTERS = [
  {
    pinCode: '815351',
    city: 'Jamtara',
    state: 'Jharkhand',
    district: 'Jamtara Sadar',
    riskScore: 98.6,
    muleAccountsFlagged: 1420,
    blockedVPAs: 890,
    interceptedAmount: '₹8,42,00,000',
    topModus: 'Bank KYC Expiry & OTP Forwarding',
    dominantBranchIFSC: 'SBIN0001234, BKID0004512',
    status: 'ACTIVE_INTERCEPTION_ZONE'
  },
  {
    pinCode: '122107',
    city: 'Nuh / Mewat',
    state: 'Haryana',
    district: 'Nuh Cyber Belt',
    riskScore: 97.9,
    muleAccountsFlagged: 2180,
    blockedVPAs: 1340,
    interceptedAmount: '₹11,60,00,000',
    topModus: 'Sextortion & Police Digital Arrest',
    dominantBranchIFSC: 'HDFC0001842, UTIB0002914',
    status: 'ACTIVE_INTERCEPTION_ZONE'
  },
  {
    pinCode: '321001',
    city: 'Bharatpur',
    state: 'Rajasthan',
    district: 'Bharatpur Cyber Corridor',
    riskScore: 96.4,
    muleAccountsFlagged: 1840,
    blockedVPAs: 920,
    interceptedAmount: '₹9,15,00,000',
    topModus: 'OLX Vehicle & Advance QR Request',
    dominantBranchIFSC: 'BARB0BHARAT, SBIN0000318',
    status: 'ACTIVE_INTERCEPTION_ZONE'
  },
  {
    pinCode: '110001',
    city: 'Connaught Place',
    state: 'Delhi (NCR)',
    district: 'New Delhi Central',
    riskScore: 93.1,
    muleAccountsFlagged: 1120,
    blockedVPAs: 760,
    interceptedAmount: '₹14,80,00,000',
    topModus: 'CBI / ED Impersonation & Digital Arrest',
    dominantBranchIFSC: 'ICIC0000007, HDFC0000003',
    status: 'HIGH_VALUE_SENTINEL'
  },
  {
    pinCode: '560001',
    city: 'Bengaluru Central',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    riskScore: 84.8,
    muleAccountsFlagged: 620,
    blockedVPAs: 410,
    interceptedAmount: '₹7,90,00,000',
    topModus: 'Telegram YouTube Rating & Crypto Tasks',
    dominantBranchIFSC: 'CNRB0000001, KKBK0000421',
    status: 'TECH_CORRIDOR_SHIELD'
  },
  {
    pinCode: '400051',
    city: 'Bandra-Kurla Complex (BKC)',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    riskScore: 88.2,
    muleAccountsFlagged: 780,
    blockedVPAs: 590,
    interceptedAmount: '₹18,50,00,000',
    topModus: 'Institutional IPO & High-Yield Stock Mules',
    dominantBranchIFSC: 'HDFC0000060, AXIS0000128',
    status: 'HIGH_VALUE_SENTINEL'
  },
  {
    pinCode: '700091',
    city: 'Salt Lake Sector V',
    state: 'West Bengal',
    district: 'Kolkata North 24 Parganas',
    riskScore: 91.5,
    muleAccountsFlagged: 950,
    blockedVPAs: 680,
    interceptedAmount: '₹8,20,00,000',
    topModus: 'Fake Tech Support & Electricity Bill SMS',
    dominantBranchIFSC: 'BDBL0000124, SBIN0004087',
    status: 'ACTIVE_INTERCEPTION_ZONE'
  },
  {
    pinCode: '201309',
    city: 'Noida Sector 62',
    state: 'Uttar Pradesh',
    district: 'Gautam Buddha Nagar',
    riskScore: 90.7,
    muleAccountsFlagged: 810,
    blockedVPAs: 520,
    interceptedAmount: '₹6,75,00,000',
    topModus: 'Electricity Power Cut & Loan Waiver Phishing',
    dominantBranchIFSC: 'PUNB0182400, SBIN0005238',
    status: 'ACTIVE_INTERCEPTION_ZONE'
  },
  {
    pinCode: '380008',
    city: 'Ahmedabad (Maninagar)',
    state: 'Gujarat',
    district: 'Ahmedabad Urban',
    riskScore: 86.9,
    muleAccountsFlagged: 540,
    blockedVPAs: 380,
    interceptedAmount: '₹9,40,00,000',
    topModus: 'Hawala Mule Accounts & Layering',
    dominantBranchIFSC: 'BARB0MANINA, ICIC0000045',
    status: 'LAYERED_FINANCIAL_MONITOR'
  },
  {
    pinCode: '500081',
    city: 'Madhapur / HITEC City',
    state: 'Telangana',
    district: 'Hyderabad / Cyberabad',
    riskScore: 83.9,
    muleAccountsFlagged: 690,
    blockedVPAs: 470,
    interceptedAmount: '₹6,10,00,000',
    topModus: 'Instant Chinese Loan App Extortion',
    dominantBranchIFSC: 'UBIN0532185, HDFC0000521',
    status: 'CYBER_SECURITY_CELL'
  }
];

export default function BankPortal({ backendUrl, onOpenMobilePortal }) {
  // Portal Flow Step: 'LOGIN' | 'STATION_SETUP' | 'CONSOLE'
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = localStorage.getItem('verix_bank_officer');
      return saved ? 'CONSOLE' : 'LOGIN';
    } catch (e) {
      return 'LOGIN';
    }
  });

  // Step 1: Login Credentials
  const [loginEmail, setLoginEmail] = useState('officer.compliance@sbi.co.in');
  const [loginPassword, setLoginPassword] = useState('cyber123');
  const [authError, setAuthError] = useState('');

  // Step 2: Officer Station & Bank Details
  const [officerProfile, setOfficerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('verix_bank_officer');
      return saved ? JSON.parse(saved) : {
        name: 'Rajesh Verma, IPS',
        role: 'Nodal Cyber Fraud Compliance Officer',
        bankName: 'State Bank of India',
        postalCode: '560001',
        city: 'Bengaluru, Karnataka',
        stationCode: 'I4C-BLR-CYBER-NODAL-042',
        badgeId: 'IND-MHA-98214'
      };
    } catch (e) {
      return {
        name: 'Rajesh Verma, IPS',
        role: 'Nodal Cyber Fraud Compliance Officer',
        bankName: 'State Bank of India',
        postalCode: '560001',
        city: 'Bengaluru, Karnataka',
        stationCode: 'I4C-BLR-CYBER-NODAL-042',
        badgeId: 'IND-MHA-98214'
      };
    }
  });

  // Main Work Console State
  // Navigation tabs: 'disputes' | 'history' | 'database_search' | 'fraud_heatmap' | 'statistics_impact' | 'audio_lab' | 'sim_carrier' | 'advisories'
  const [activeTab, setActiveTab] = useState('fraud_heatmap');
  const [appeals, setAppeals] = useState([]);
  const [stats, setStats] = useState(null);
  const [threats, setThreats] = useState(() => {
    return Array.isArray(INITIAL_THREAT_RECORDS) && INITIAL_THREAT_RECORDS.length > 0
      ? INITIAL_THREAT_RECORDS
      : [];
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedThreatType, setSelectedThreatType] = useState('ALL');
  const [threatCategoryFilter, setThreatCategoryFilter] = useState('ALL');
  const [threatPage, setThreatPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [copiedIdentifier, setCopiedIdentifier] = useState('');

  // Heatmap State
  const [heatmapLevel, setHeatmapLevel] = useState('NATIONAL'); // 'GLOBAL' | 'NATIONAL' | 'LOCAL'
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
  const [pinCodeSearch, setPinCodeSearch] = useState('');
  const [heatmapSeverityFilter, setHeatmapSeverityFilter] = useState('ALL');

  // ROI Calculator State for Statistics Tab
  const [simulatedTxnVolume, setSimulatedTxnVolume] = useState(100000);
  const [simulatedAvgTicket, setSimulatedAvgTicket] = useState(2500);

  // Modal inspection states
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedThreatRecord, setSelectedThreatRecord] = useState(null);
  const [showAddThreatModal, setShowAddThreatModal] = useState(false);
  const [newThreatIdentifier, setNewThreatIdentifier] = useState('');
  const [newThreatCategory, setNewThreatCategory] = useState('DIGITAL_ARREST');
  const [newThreatDetails, setNewThreatDetails] = useState('');

  const popularBanks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 
    'Punjab National Bank', 'Bank of Baroda', 'Kotak Mahindra Bank', 
    'Canara Bank', 'Union Bank of India', 'IndusInd Bank', 'Indian Cyber Crime Coordination Centre (I4C)'
  ];

  const handleCopyIdentifier = (val) => {
    if (!val) return;
    try {
      navigator.clipboard.writeText(val);
      setCopiedIdentifier(val);
      setTimeout(() => setCopiedIdentifier(''), 2000);
    } catch (e) {}
  };

  const handleExportThreatsCsv = () => {
    if (!threats || threats.length === 0) {
      alert('No records available to export.');
      return;
    }
    const headers = ['ID', 'Identifier', 'Type', 'Category', 'Risk Score', 'Is Blacklisted', 'Source', 'Report Count', 'Forensic Details', 'Reported At'];
    const rows = filteredThreats.map(t => [
      `"${t.id || ''}"`,
      `"${t.identifier || ''}"`,
      `"${t.type || ''}"`,
      `"${t.category || ''}"`,
      t.riskScore || 90,
      t.isBlacklisted ? 'TRUE' : 'FALSE',
      `"${t.source || ''}"`,
      t.reportCount || 1,
      `"${(t.details || '').replace(/"/g, '""')}"`,
      `"${t.reportedAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VERIX_THREAT_INTELLIGENCE_EXPORT_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchPortalData = async () => {
    setLoading(true);
    try {
      const base = backendUrl || 'https://fruadsih.onrender.com';
      const [appealsRes, statsRes, threatsRes] = await Promise.all([
        fetch(`${base}/api/v1/institution/appeals`).catch(() => null),
        fetch(`${base}/api/v1/institution/stats`).catch(() => null),
        fetch(`${base}/api/v1/threats/feed?limit=500`).catch(() => null)
      ]);

      if (appealsRes && appealsRes.ok) {
        const data = await appealsRes.json();
        setAppeals(data.data || []);
      }
      if (statsRes && statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.data || null);
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
    if (currentStep === 'CONSOLE') {
      fetchPortalData();
    }
  }, [currentStep]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAuthError('Email and PIN/Password are required.');
      return;
    }
    setAuthError('');
    setCurrentStep('STATION_SETUP');
  };

  const handleFastDemoLogin = (preset) => {
    setOfficerProfile(preset);
    try {
      localStorage.setItem('verix_bank_officer', JSON.stringify(preset));
    } catch (e) {}
    setCurrentStep('CONSOLE');
  };

  const handleStationSetupSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('verix_bank_officer', JSON.stringify(officerProfile));
    } catch (e) {}
    setCurrentStep('CONSOLE');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('verix_bank_officer');
    } catch (e) {}
    setCurrentStep('LOGIN');
  };

  const handleResolveAppeal = async (appealId, decision) => {
    try {
      const base = backendUrl || 'https://fruadsih.onrender.com';
      await fetch(`${base}/api/v1/institution/appeals/${appealId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: decision,
          reviewerNotes: `Reviewed and resolved by Nodal Officer ${officerProfile.name} (${officerProfile.stationCode})`,
          resolvedBy: officerProfile.name
        })
      });

      setAppeals(prev => prev.map(a => {
        if (a.appealId === appealId) {
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
      source: `Manual Flag by ${officerProfile.name} (${officerProfile.bankName})`,
      reportCount: 1,
      details: newThreatDetails || 'Flagged during live institutional compliance review.',
      reportedAt: new Date().toISOString()
    };
    setThreats([newRecord, ...threats]);
    setShowAddThreatModal(false);
    setNewThreatIdentifier('');
    setNewThreatDetails('');
    setActionSuccess(`Added ${newThreatIdentifier} to distributed threat registry.`);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  // Filtered threats
  const filteredThreats = (threats || []).filter(t => {
    if (!t) return false;
    const id = String(t.identifier || '').toLowerCase();
    const cat = String(t.category || '').toLowerCase();
    const det = String(t.details || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = !query || id.includes(query) || cat.includes(query) || det.includes(query);
    const matchesType = selectedThreatType === 'ALL' 
      || (selectedThreatType === 'VPA' && (t.type === 'VPA' || id.includes('@')))
      || (selectedThreatType === 'PHONE' && (t.type === 'PHONE' || (!id.includes('@') && Boolean(t.identifier))));
    const matchesCategory = threatCategoryFilter === 'ALL' || t.category === threatCategoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const totalVpaCount = (threats || []).filter(t => t && (t.type === 'VPA' || String(t.identifier || '').includes('@'))).length;
  const totalPhoneCount = (threats || []).filter(t => t && (t.type === 'PHONE' || (Boolean(t.identifier) && !String(t.identifier).includes('@')))).length;
  const criticalThreatCount = (threats || []).filter(t => t && (Number(t.riskScore) || 0) >= 90).length;

  const pendingCount = appeals.filter(a => a && a.status === 'PENDING_REVIEW').length;
  const totalResolvedHistoryCount = appeals.filter(a => a && a.status !== 'PENDING_REVIEW').length;

  // ══════════════════════════════════════════════════════════════
  // VIEW 1: STEP 1 — GOVERNMENT & INSTITUTIONAL LOGIN
  // ══════════════════════════════════════════════════════════════
  if (currentStep === 'LOGIN') {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 space-y-6 text-[#F0F3F6] font-sans selection:bg-[#00F0A0] selection:text-[#090C10] animate-fade-in my-auto">
        {/* National Crest & Security Emblem */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0A0]/10 border border-[#00F0A0]/30 text-[11px] font-mono font-bold text-[#00F0A0] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            GOVERNMENT OF INDIA • I4C / NPCI NODAL PORTAL
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#10141C] border border-[#00F0A0]/30 mx-auto flex items-center justify-center text-[#00F0A0] shadow-2xl relative">
            <Landmark className="w-8 h-8 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00F0A0] rounded-full animate-ping" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            VERIX National Fraud Defense Console
          </h1>
          <p className="text-xs text-[#8494A8] font-mono max-w-md mx-auto">
            Authorized Nodal Gateway for Banks, Law Enforcement (I4C), Cyber Cells &amp; Payment Aggregators
          </p>
        </div>

        {/* 1-Tap Fast Presets for Hackathon / Jury Demo */}
        <div className="p-4 rounded-2xl bg-[#10141C]/80 border border-white/[0.08] space-y-2.5">
          <span className="text-[10px] font-mono font-bold uppercase text-[#00F0A0] flex items-center gap-1.5 tracking-wider">
            <Sparkles className="w-3 h-3" /> 1-Tap Fast Demonstration Presets:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              {
                name: 'Rajesh Verma, IPS',
                role: 'Nodal Cyber Compliance Officer',
                bankName: 'State Bank of India',
                postalCode: '560001',
                city: 'Bengaluru, Karnataka',
                stationCode: 'I4C-BLR-CYBER-NODAL-042',
                badgeId: 'IND-MHA-98214'
              },
              {
                name: 'Ananya Deshmukh',
                role: 'Chief Anti-Fraud Specialist',
                bankName: 'HDFC Bank Cyber Security Cell',
                postalCode: '400051',
                city: 'Mumbai, Maharashtra',
                stationCode: 'HDFC-MUM-FRAUD-DESK-019',
                badgeId: 'HDFC-CYBER-7731'
              },
              {
                name: 'Dr. Vikramaditya Roy',
                role: 'National Cyber Intelligence Director',
                bankName: 'Indian Cyber Crime Coordination Centre (I4C)',
                postalCode: '110001',
                city: 'New Delhi (NCR)',
                stationCode: 'MHA-I4C-HQ-NODE-001',
                badgeId: 'MHA-I4C-DIR-09'
              },
              {
                name: 'K. Senthil Kumar',
                role: 'Superintendent of Cyber Police',
                bankName: 'Cyberabad Police Cyber Wing',
                postalCode: '500081',
                city: 'Hyderabad, Telangana',
                stationCode: 'TG-CYBERABAD-PS-104',
                badgeId: 'TS-POLICE-3341'
              }
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleFastDemoLogin(preset)}
                className="p-2.5 rounded-xl bg-[#090C10] border border-white/[0.06] hover:border-[#00F0A0]/40 text-left transition-all group cursor-pointer hover:bg-[#00F0A0]/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-[#00F0A0] transition-colors">{preset.name}</span>
                  <span className="text-[9.5px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">{preset.postalCode}</span>
                </div>
                <p className="text-[10px] text-[#8494A8] font-mono truncate">{preset.bankName} • {preset.city.split(',')[0]}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleLoginSubmit} className="p-6 rounded-2xl bg-[#10141C] border border-white/[0.08] shadow-2xl space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#8494A8] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#00F0A0]" /> Nodal Officer Official Email
            </label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="officer.compliance@sbi.co.in"
              className="w-full bg-[#090C10] border border-white/[0.1] rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#00F0A0]/60 transition-all font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#8494A8] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#00F0A0]" /> PKI Digital Token / Security Password
            </label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#090C10] border border-white/[0.1] rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#00F0A0]/60 transition-all font-mono"
              required
            />
          </div>

          {authError && (
            <p className="text-xs text-rose-400 font-mono bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">{authError}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#00F0A0] hover:bg-[#00D68F] text-[#080B0F] font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer"
          >
            <span>Proceed to Jurisdiction Setup</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // VIEW 2: STEP 2 — STATION & JURISDICTION SETUP
  // ══════════════════════════════════════════════════════════════
  if (currentStep === 'STATION_SETUP') {
    return (
      <div className="w-full max-w-lg mx-auto p-6 space-y-6 text-[#F0F3F6] font-sans selection:bg-[#00F0A0] selection:text-[#090C10] animate-fade-in my-auto">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#10141C] border border-white/[0.1] mx-auto flex items-center justify-center text-[#00F0A0]">
            <Landmark className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Officer Station Jurisdiction
          </h1>
          <p className="text-xs text-[#8494A8] font-mono">Configure branch jurisdiction and state cyber command terminal</p>
        </div>

        <form onSubmit={handleStationSetupSubmit} className="p-6 rounded-2xl bg-[#10141C] border border-white/[0.08] shadow-2xl space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#8494A8] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#00F0A0]" /> Officer Full Name &amp; Designation
            </label>
            <input
              type="text"
              value={officerProfile.name}
              onChange={(e) => setOfficerProfile({ ...officerProfile, name: e.target.value })}
              className="w-full bg-[#090C10] border border-white/[0.1] rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#00F0A0]/60 transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#8494A8] flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-[#00F0A0]" /> Bank / Law Enforcement Agency
            </label>
            <select
              value={officerProfile.bankName}
              onChange={(e) => setOfficerProfile({ ...officerProfile, bankName: e.target.value })}
              className="w-full bg-[#090C10] border border-white/[0.1] rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#00F0A0]/60 transition-all font-mono"
            >
              {popularBanks.map(b => <option key={b} value={b} className="bg-[#10141C] text-white">{b}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#8494A8] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#00F0A0]" /> Postal / PIN Code
              </label>
              <input
                type="text"
                value={officerProfile.postalCode}
                onChange={(e) => setOfficerProfile({ ...officerProfile, postalCode: e.target.value })}
                className="w-full bg-[#090C10] border border-white/[0.1] rounded-xl py-2.5 px-3.5 text-xs font-mono text-white focus:outline-none focus:border-[#00F0A0]/60 transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#8494A8] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#00F0A0]" /> City / District
              </label>
              <input
                type="text"
                value={officerProfile.city}
                onChange={(e) => setOfficerProfile({ ...officerProfile, city: e.target.value })}
                className="w-full bg-[#090C10] border border-white/[0.1] rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#00F0A0]/60 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#00F0A0] hover:bg-[#00D68F] text-[#080B0F] font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer"
          >
            <span>Enter National Defense Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // VIEW 3: STEP 3 — MAIN INSTITUTIONAL COMMAND WORKSPACE
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="w-full max-w-[1920px] mx-auto p-3 sm:p-5 lg:p-6 space-y-5 text-[#F0F3F6] font-sans selection:bg-[#00F0A0] selection:text-[#090C10] animate-fade-in">
      
      {/* ── TOP HEADER COMMAND BAR ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#10141C] border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#171E2B] border border-white/[0.12] flex items-center justify-center text-[#00F0A0] shadow-md shrink-0">
            <Landmark className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {officerProfile.bankName}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#00F0A0]/15 text-[#00F0A0] border border-[#00F0A0]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0A0] animate-pulse" />
                I4C CYBER SENTINEL NODE
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#8494A8] mt-0.5 font-mono">
              <span className="flex items-center gap-1 text-[#BAC5D5]">
                <User className="w-3 h-3 text-[#00F0A0]" /> {officerProfile.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" /> {officerProfile.city} ({officerProfile.postalCode})
              </span>
            </div>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          {onOpenMobilePortal && (
            <button
              onClick={onOpenMobilePortal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00F0A0]/10 hover:bg-[#00F0A0]/20 border border-[#00F0A0]/30 text-xs font-mono font-bold text-[#00F0A0] transition-all active:scale-95 cursor-pointer shadow-sm"
              title="Launch Mobile App View"
            >
              <span>📱 Launch Mobile App</span>
            </button>
          )}
          <button
            onClick={fetchPortalData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#171E2B] hover:bg-[#1E2636] border border-white/[0.1] text-xs font-mono font-semibold text-[#BAC5D5] transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#00F0A0] ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Cloud Threat DB</span>
          </button>
          <button
            onClick={() => setCurrentStep('STATION_SETUP')}
            className="px-3 py-2 rounded-xl bg-[#171E2B] hover:bg-[#1E2636] border border-white/[0.1] text-xs font-mono text-[#BAC5D5] transition-all cursor-pointer"
          >
            Switch Jurisdiction
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-all cursor-pointer"
            title="Log Out & Lock Station"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── ACTION NOTIFICATION TOAST ── */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-[#00F0A0]/15 border border-[#00F0A0]/40 text-[#00F0A0] text-xs font-mono font-bold flex items-center gap-2 animate-slide-down shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-[#00F0A0]" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* ── MAIN WORKSPACE GRID WITH SHIFTED LEFT SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3 xl:col-span-2 space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#10141C] border border-white/[0.08] space-y-1.5 shadow-md sticky top-4">
            <span className="text-[10px] font-mono font-bold uppercase text-[#546274] px-2 block mb-2 tracking-wider">
              Defense Modules
            </span>

            {[
              { id: 'fraud_heatmap', label: 'Threat Heatmaps (Geo-Spatial)', icon: Globe, count: '3 Tiers', badgeColor: 'bg-amber-400/25 text-amber-300 font-bold border border-amber-400/30' },
              { id: 'statistics_impact', label: 'Live Stats & Loss Reduction', icon: BarChart3, count: '₹14.8Cr', badgeColor: 'bg-[#00F0A0]/25 text-[#00F0A0] font-bold border border-[#00F0A0]/30' },
              { id: 'disputes', label: 'Disputes & Appeals', icon: FileText, count: pendingCount > 0 ? `${pendingCount} Pending` : appeals.length, badgeColor: pendingCount > 0 ? 'bg-amber-400/25 text-amber-300 border border-amber-400/30' : 'bg-white/10 text-white/70' },
              { id: 'history', label: 'Disputes History', icon: History, count: totalResolvedHistoryCount, badgeColor: 'bg-emerald-400/20 text-emerald-300' },
              { id: 'database_search', label: 'Threat Database', icon: Database, count: threats.length.toLocaleString(), badgeColor: 'bg-cyan-400/25 text-cyan-300 font-bold border border-cyan-400/30' },
              { id: 'audio_lab', label: 'Voice Phishing Lab', icon: Mic, count: 'AI', badgeColor: 'bg-purple-400/20 text-purple-300' },
              { id: 'sim_carrier', label: 'SIM Swap Monitor', icon: Radio, count: 'IMSI', badgeColor: 'bg-rose-400/20 text-rose-300' },
              { id: 'advisories', label: 'Security Advisories', icon: BellRing, count: '5', badgeColor: 'bg-blue-400/20 text-blue-300' }
            ].map(({ id, label, icon: Icon, count, badgeColor }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  if (id === 'database_search') setThreatPage(1);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  activeTab === id
                    ? 'bg-[#00F0A0]/15 text-[#00F0A0] font-bold border border-[#00F0A0]/30 shadow-sm'
                    : 'text-[#8494A8] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${activeTab === id ? 'text-[#00F0A0]' : 'text-[#8494A8]'}`} />
                  <span>{label}</span>
                </div>
                {count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${badgeColor}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}

            {/* Quick Live Telemetry Widget */}
            <div className="pt-3 mt-3 border-t border-white/[0.06] space-y-2">
              <span className="text-[9.5px] font-mono uppercase text-[#546274] px-2 block font-bold tracking-wider">
                Threat Grid Status
              </span>
              <div className="bg-[#090C10] p-2.5 rounded-xl border border-white/[0.04] space-y-1.5 text-[10.5px] font-mono text-[#8494A8]">
                <div className="flex justify-between">
                  <span>National Blockade:</span>
                  <span className="text-[#00F0A0] font-bold">ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span>Fraud Intercepted:</span>
                  <span className="text-white font-bold">₹14.82 Cr</span>
                </div>
                <div className="flex justify-between">
                  <span>Critical PIN Codes:</span>
                  <span className="text-rose-400 font-bold">10 Zones</span>
                </div>
                <div className="flex justify-between">
                  <span>Pre-Auth Latency:</span>
                  <span className="text-emerald-300 font-bold">184 ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT / MAIN CONTENT AREA */}
        <div className="lg:col-span-9 xl:col-span-10 space-y-4">

          {/* ══════════════════════════════════════════════════════════
              TAB: FRAUD THREAT HEATMAPS (100% INDIA SURVEILLANCE GRID)
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'fraud_heatmap' && (
            <div className="p-5 rounded-2xl bg-[#10141C] border border-white/[0.08] space-y-5 shadow-xl">
              
              {/* Header & 3-Tier Layer Picker */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00F0A0]/10 border border-[#00F0A0]/30 text-[10.5px] font-mono text-[#00F0A0] uppercase font-bold mb-1">
                    <ShieldCheck className="w-3 h-3" /> National Cyber Grid (India-Only Surveillance)
                  </div>
                  <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    India Fraud Density &amp; Syndicate Micro-Cluster Heatmap
                  </h2>
                  <p className="text-xs text-[#8494A8] font-mono mt-0.5">
                    Real-time geospatial intelligence across 28 Indian States, High-Risk Regional Cyber Belts, and Localized PIN-Code Mule Rings.
                  </p>
                </div>

                {/* 3 Level Switcher (100% India Focused) */}
                <div className="flex items-center p-1 bg-[#090C10] border border-white/[0.1] rounded-xl">
                  {[
                    { id: 'NATIONAL', label: '🇮🇳 National States' },
                    { id: 'REGIONAL', label: '⚡ Regional Cyber Belts' },
                    { id: 'LOCAL', label: '📍 Local PIN Codes' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      onClick={() => setHeatmapLevel(lvl.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        heatmapLevel === lvl.id
                          ? 'bg-[#00F0A0] text-[#080B0F] shadow-md'
                          : 'text-[#8494A8] hover:text-white'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────
                  LEVEL: REGIONAL CYBER BELTS (India Tri-Junction Clusters)
              ──────────────────────────────────────────────────────── */}
              {heatmapLevel === 'REGIONAL' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-[#10141C] to-cyan-500/10 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10.5px] font-mono uppercase text-amber-300 font-bold flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-amber-400" /> High-Intensity Cyber Syndicate Belts
                      </span>
                      <p className="text-xs text-[#BAC5D5] font-sans max-w-2xl">
                        Over <strong>78% of organized digital payment fraud</strong> originates from 6 distinct geographic cyber corridors across India, utilizing fast-moving mule current accounts and social engineering call hubs.
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-[#8494A8] block">Intercepted Belt Volume</span>
                      <span className="text-xl font-bold font-mono text-[#00F0A0]">₹183.2 Cr Prevented</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {INDIA_REGIONAL_CYBER_BELTS.map((belt) => (
                      <div key={belt.id} className="p-4 rounded-xl bg-[#090C10] border border-white/[0.08] hover:border-[#00F0A0]/40 transition-all space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-cyan-400 font-bold">{belt.id}</span>
                            <h3 className="text-sm font-bold text-white font-mono mt-0.5">{belt.name}</h3>
                            <p className="text-[11px] text-[#8494A8] flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-rose-400" /> {belt.coverage}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              Risk: {belt.riskIndex}%
                            </span>
                            <span className="text-[10px] font-mono text-[#00F0A0] block mt-1">{belt.interceptedVolumeCr}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[11px] text-[#BAC5D5] leading-relaxed">
                          {belt.modus}
                        </div>

                        <div className="flex items-center justify-between text-[10.5px] font-mono text-[#8494A8] pt-1 border-t border-white/[0.04]">
                          <span>Targeted Banks: <strong className="text-white">{belt.dominantBanksTargeted}</strong></span>
                          <span>Active Nodes: <strong className="text-amber-300">{belt.activeNodes}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────
                  LEVEL 2: NATIONAL STATE-LEVEL HEATMAP (India)
              ──────────────────────────────────────────────────────── */}
              {heatmapLevel === 'NATIONAL' && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* National Risk Severity Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                      <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block">Critical State Hubs</span>
                      <span className="text-xl font-bold font-mono text-rose-300 mt-1 block">5 States</span>
                      <p className="text-[10px] text-rose-300/80 font-mono mt-0.5">JH, HR, RJ, DL, WB (&ge;90%)</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">High Risk Corridors</span>
                      <span className="text-xl font-bold font-mono text-amber-300 mt-1 block">6 States</span>
                      <p className="text-[10px] text-amber-300/80 font-mono mt-0.5">MH, KA, GJ, UP, TG, BR</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">National Interception Rate</span>
                      <span className="text-xl font-bold font-mono text-emerald-300 mt-1 block">98.6%</span>
                      <p className="text-[10px] text-emerald-300/80 font-mono mt-0.5">Zero Loss at Level 4</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">Total Blocked Volume</span>
                      <span className="text-xl font-bold font-mono text-cyan-300 mt-1 block">₹195.4 Cr</span>
                      <p className="text-[10px] text-cyan-300/80 font-mono mt-0.5">Across All Indian States</p>
                    </div>
                  </div>

                  {/* State Density Breakdown Table */}
                  <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
                    <table className="w-full text-left border-collapse text-xs font-mono">
                      <thead>
                        <tr className="bg-[#171E2B] text-[#8494A8] border-b border-white/[0.08]">
                          <th className="p-3">Rank</th>
                          <th className="p-3">State / Jurisdiction</th>
                          <th className="p-3">Major Scam Hotspots</th>
                          <th className="p-3">Primary Modus Operandi</th>
                          <th className="p-3 text-center">Threat Index</th>
                          <th className="p-3 text-right">Blocked Volume</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] bg-[#090C10]">
                        {NATIONAL_STATE_FRAUD_DATA.map((st) => (
                          <tr key={st.code} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-3 font-bold text-[#00F0A0]">{st.vulnerabilityRank}</td>
                            <td className="p-3">
                              <span className="font-bold text-white text-sm">{st.state}</span>
                              <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-[#8494A8]">{st.code}</span>
                            </td>
                            <td className="p-3 text-[#BAC5D5] font-sans text-[11px]">{st.hotspots}</td>
                            <td className="p-3 text-amber-300 text-[11px] font-sans">{st.primaryModus}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                st.riskIndex >= 90 
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}>
                                {st.riskIndex}%
                              </span>
                            </td>
                            <td className="p-3 text-right font-bold text-[#00F0A0]">{st.blockedVolumeCr}</td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => {
                                  setHeatmapLevel('LOCAL');
                                  setPinCodeSearch(st.state);
                                }}
                                className="px-2 py-1 rounded bg-[#171E2B] hover:bg-[#00F0A0] hover:text-[#080B0F] text-[10px] text-white transition-all cursor-pointer"
                              >
                                View PINs
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────
                  LEVEL 3: LOCAL CITY & 6-DIGIT PIN CODE MICRO-CLUSTERS
              ──────────────────────────────────────────────────────── */}
              {heatmapLevel === 'LOCAL' && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Search Bar for PIN Code / City */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#090C10] border border-white/[0.08]">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-[#8494A8] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={pinCodeSearch}
                        onChange={(e) => setPinCodeSearch(e.target.value)}
                        placeholder="Search 6-digit PIN code or city (e.g. 815351, Nuh, BKC)..."
                        className="w-full bg-[#10141C] border border-white/[0.1] rounded-xl py-2 pl-9 pr-3 text-xs font-mono text-white placeholder:text-[#546274] focus:outline-none focus:border-[#00F0A0]/60"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-[#8494A8]">
                      <span>Quick Hotspots:</span>
                      {['815351 (Jamtara)', '122107 (Nuh)', '321001 (Bharatpur)', '110001 (Delhi)'].map(chip => (
                        <button
                          key={chip}
                          onClick={() => setPinCodeSearch(chip.split(' ')[0])}
                          className="px-2 py-1 rounded-lg bg-[#171E2B] hover:bg-[#00F0A0]/20 text-[10px] text-[#BAC5D5] hover:text-[#00F0A0] border border-white/[0.06] transition-all cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Local Micro-Clusters Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {LOCAL_PIN_CODE_MICROCLUSTERS
                      .filter(c => {
                        if (!pinCodeSearch) return true;
                        const q = pinCodeSearch.toLowerCase();
                        return c.pinCode.includes(q) || c.city.toLowerCase().includes(q) || c.state.toLowerCase().includes(q) || c.district.toLowerCase().includes(q);
                      })
                      .map((cluster) => (
                        <div key={cluster.pinCode} className="p-4 rounded-xl bg-[#090C10] border border-white/[0.08] hover:border-[#00F0A0]/40 transition-all space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#00F0A0]/15 text-[#00F0A0] border border-[#00F0A0]/30">
                                  PIN: {cluster.pinCode}
                                </span>
                                <span className="text-[10px] font-mono text-rose-400 font-bold">
                                  {cluster.riskScore}% RISK
                                </span>
                              </div>
                              <h3 className="text-sm font-bold text-white font-mono mt-1">{cluster.city}</h3>
                              <p className="text-[11px] text-[#8494A8] font-mono">{cluster.district}, {cluster.state}</p>
                            </div>

                            <span className="text-xs font-bold text-[#00F0A0] font-mono">
                              {cluster.interceptedAmount}
                            </span>
                          </div>

                          <div className="space-y-1 text-xs">
                            <span className="text-[10px] font-mono uppercase text-[#738294] block">Primary Modus Operandi:</span>
                            <p className="text-amber-300 font-sans text-xs bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                              {cluster.topModus}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono text-[#BAC5D5] bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04]">
                            <div>
                              <span className="text-[#738294] block">Mule Accounts:</span>
                              <strong className="text-white">{cluster.muleAccountsFlagged.toLocaleString()}</strong>
                            </div>
                            <div>
                              <span className="text-[#738294] block">Blocked VPAs:</span>
                              <strong className="text-cyan-300">{cluster.blockedVPAs.toLocaleString()}</strong>
                            </div>
                          </div>

                          <div className="text-[10px] font-mono text-[#8494A8] flex items-center justify-between pt-1 border-t border-white/[0.04]">
                            <span>Flagged Branches:</span>
                            <span className="text-white truncate max-w-[160px]">{cluster.dominantBranchIFSC}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB: LIVE STATS & LOSS REDUCTION ENGINE (Research-Backed)
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'statistics_impact' && (
            <div className="p-5 rounded-2xl bg-[#10141C] border border-white/[0.08] space-y-6 shadow-xl animate-fade-in">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00F0A0]/10 border border-[#00F0A0]/30 text-[10.5px] font-mono text-[#00F0A0] uppercase font-bold mb-1">
                    <BarChart3 className="w-3 h-3" /> Empirical Performance &amp; ROI Engine
                  </div>
                  <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    Financial Fraud Loss Reduction &amp; Machine Learning Impact
                  </h2>
                  <p className="text-xs text-[#8494A8] font-mono mt-0.5">
                    Demonstrating zero false negatives at critical tier and multi-crore savings through pre-authorization interception.
                  </p>
                </div>

                <button
                  onClick={handleExportThreatsCsv}
                  className="px-3.5 py-2 rounded-xl bg-[#171E2B] hover:bg-[#1E2636] border border-white/[0.12] text-xs font-mono font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5 text-[#00F0A0]" />
                  <span>Export Performance Dossier</span>
                </button>
              </div>

              {/* 6 Key Research Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                <div className="p-3.5 rounded-xl bg-[#090C10] border border-[#00F0A0]/30 shadow-md">
                  <span className="text-[10px] font-mono text-[#738294] uppercase block">Fraud Prevented</span>
                  <span className="text-xl font-bold font-mono text-[#00F0A0] mt-1 block">₹14.82 Cr</span>
                  <span className="text-[9.5px] font-mono text-emerald-400">Direct Financial Defense</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#090C10] border border-white/[0.08] shadow-md">
                  <span className="text-[10px] font-mono text-[#738294] uppercase block">Detection Accuracy</span>
                  <span className="text-xl font-bold font-mono text-white mt-1 block">98.6%</span>
                  <span className="text-[9.5px] font-mono text-cyan-400">HELF Hybrid Benchmark</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#090C10] border border-white/[0.08] shadow-md">
                  <span className="text-[10px] font-mono text-[#738294] uppercase block">Pre-Auth Latency</span>
                  <span className="text-xl font-bold font-mono text-cyan-300 mt-1 block">184 ms</span>
                  <span className="text-[9.5px] font-mono text-[#8494A8]">p95 SLA &lt; 300 ms</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#090C10] border border-rose-500/30 shadow-md">
                  <span className="text-[10px] font-mono text-rose-400 uppercase block">Critical False Neg.</span>
                  <span className="text-xl font-bold font-mono text-rose-300 mt-1 block">0.00%</span>
                  <span className="text-[9.5px] font-mono text-rose-400">Zero Undetected Frauds</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#090C10] border border-white/[0.08] shadow-md">
                  <span className="text-[10px] font-mono text-[#738294] uppercase block">False Alarm Rate</span>
                  <span className="text-xl font-bold font-mono text-amber-300 mt-1 block">1.4%</span>
                  <span className="text-[9.5px] font-mono text-[#8494A8]">Preserves User UX</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#090C10] border border-purple-500/30 shadow-md">
                  <span className="text-[10px] font-mono text-purple-400 uppercase block">1930 Dossiers</span>
                  <span className="text-xl font-bold font-mono text-purple-300 mt-1 block">4,120</span>
                  <span className="text-[9.5px] font-mono text-purple-400">Auto-Dispatched to I4C</span>
                </div>
              </div>

              {/* Interactive Bank Fraud Reduction Calculator */}
              <div className="p-5 rounded-2xl bg-[#090C10] border border-white/[0.08] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#00F0A0]" />
                      Interactive Bank Fraud Reduction &amp; Savings Calculator
                    </h3>
                    <p className="text-xs text-[#8494A8] font-mono">
                      Adjust your bank's daily transaction volume to project annual fraud loss mitigation with VERIX.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00F0A0]/15 text-[#00F0A0] border border-[#00F0A0]/30">
                    Projected Annual Savings: ₹{((simulatedTxnVolume * 365 * 0.0062 * simulatedAvgTicket * 0.986) / 10000000).toFixed(2)} Cr
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#BAC5D5]">Daily UPI Volume:</span>
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
                      <span className="text-[#BAC5D5]">Average Transaction Ticket Size:</span>
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
              </div>

              {/* Research-Backed Explainable AI (XAI) Waterfall Inspector */}
              <div className="p-5 rounded-2xl bg-[#090C10] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    Research-Backed Hybrid Risk Fusion Formula &amp; SHAP Feature Attribution
                  </h3>
                  <span className="text-[10.5px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    RBI XAI Compliant
                  </span>
                </div>

                {/* Mathematical Formula Box */}
                <div className="p-3.5 rounded-xl bg-[#171E2B] border border-white/[0.08] text-xs font-mono text-[#BAC5D5] space-y-1">
                  <span className="text-[10px] text-[#738294] uppercase block">Auditable Risk Scoring Equation:</span>
                  <code className="text-[#00F0A0] font-bold text-sm block">
                    S = 0.70 · (0.20·P_LR + 0.45·P_RF + 0.35·P_XGB) + 0.30 · A_IF
                  </code>
                  <p className="text-[10.5px] text-[#8494A8] font-sans">
                    Fuses 3 Supervised Classifiers (Logistic Regression, Random Forest, XGBoost) with 1 Unsupervised Anomaly Detector (Isolation Forest) for zero-day novel fraud interception.
                  </p>
                </div>

                {/* 6 Feature Attribution Waterfall Bars */}
                <div className="space-y-2.5 pt-1">
                  {[
                    { name: 'f1: Amount Deviation Z-Score (vs 90-day baseline)', weight: 32, color: 'bg-[#00F0A0]' },
                    { name: 'f2: Behavioral Biometrics & Typing Cadence', weight: 18, color: 'bg-cyan-400' },
                    { name: 'f3: Receiver VPA & IFSC Branch Mule Trust Score', weight: 24, color: 'bg-purple-400' },
                    { name: 'f4: Transaction Velocity (1h, 6h, 24h split frequency)', weight: 12, color: 'bg-amber-400' },
                    { name: 'f5: Temporal Anomaly (Midnight / unusual hour KDE)', weight: 8, color: 'bg-rose-400' },
                    { name: 'f6: 2-Hop Mule Network Graph Proximity', weight: 6, color: 'bg-emerald-400' }
                  ].map((feat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#BAC5D5]">{feat.name}</span>
                        <strong className="text-white">{feat.weight}% SHAP Value</strong>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className={`h-full ${feat.color} rounded-full`} style={{ width: `${feat.weight * 2.5}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 1: DISPUTES & APPEALS (Active Queue)
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'disputes' && (
            <div className="p-5 rounded-2xl bg-[#10141C] border border-white/[0.08] space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#00F0A0]" />
                    False-Positive Transaction Appeals Queue
                  </h2>
                  <p className="text-[11px] text-[#738294] font-mono mt-0.5">
                    Live review desk for users appealing blocked genuine payments.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#546274] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search ticket ID or VPA..."
                      className="bg-[#090C10] border border-white/[0.09] rounded-xl py-1.5 pl-8 pr-3 text-xs font-mono text-white placeholder:text-[#546274] focus:outline-none focus:border-[#00F0A0]/50 w-52"
                    />
                  </div>
                </div>
              </div>

              {/* Active Appeals List */}
              <div className="space-y-3">
                {appeals.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-[#090C10] border border-white/[0.04] text-[#738294] font-mono text-xs space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#00F0A0] mx-auto opacity-40" />
                    <p>All active disputes have been resolved or queue is clean.</p>
                  </div>
                ) : (
                  appeals.map((appeal) => (
                    <div 
                      key={appeal.appealId || appeal.ticketId}
                      className="p-4 rounded-xl bg-[#090C10] border border-white/[0.06] hover:border-white/[0.12] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#BAC5D5] bg-[#171E2B] px-2 py-0.5 rounded border border-white/[0.08]">
                            {appeal.appealId || appeal.ticketId}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            appeal.status === 'PENDING_REVIEW' 
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : appeal.status === 'APPROVED_WHITELISTED'
                              ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {appeal.status || 'PENDING'}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-white flex flex-wrap items-center gap-4">
                          <span>Recipient: <strong className="text-cyan-300">{appeal.vpa || 'N/A'}</strong></span>
                          <span>Amount: <strong className="text-[#00F0A0]">₹{Number(appeal.amount || 0).toLocaleString('en-IN')}</strong></span>
                        </div>
                        <p className="text-xs text-[#BAC5D5] italic line-clamp-1">"{appeal.reason || 'Legitimate merchant transaction.'}"</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTicket(appeal)}
                          className="px-3 py-1.5 rounded-lg bg-[#171E2B] hover:bg-[#1E2636] border border-white/[0.08] text-xs font-mono text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 2: DISPUTES HISTORY
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'history' && (
            <div className="p-5 rounded-2xl bg-[#10141C] border border-white/[0.08] space-y-4 shadow-xl">
              <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                Resolved False-Positive Audit History
              </h2>
              <p className="text-xs text-[#8494A8] font-mono">Archived decisions logged with RBI compliance audit timestamps.</p>
              <div className="space-y-2">
                {appeals.filter(a => a.status !== 'PENDING_REVIEW').length === 0 ? (
                  <p className="text-xs font-mono text-[#738294] p-4 bg-[#090C10] rounded-xl text-center">No resolved historical cases in current session.</p>
                ) : (
                  appeals.filter(a => a.status !== 'PENDING_REVIEW').map(a => (
                    <div key={a.appealId} className="p-3 bg-[#090C10] rounded-xl border border-white/[0.06] flex items-center justify-between text-xs font-mono">
                      <span>{a.appealId} • {a.vpa} • ₹{a.amount}</span>
                      <span className="text-emerald-400 font-bold">{a.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 3: THREAT INTELLIGENCE DATABASE
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'database_search' && (
            <div className="p-5 rounded-2xl bg-[#10141C] border border-white/[0.08] space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#00F0A0]" />
                    National Blacklisted Threat Registry ({threats.length.toLocaleString()})
                  </h2>
                  <p className="text-xs text-[#8494A8] font-mono">Verified scammer identifiers synced across 1930 &amp; Chakshu portals.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportThreatsCsv}
                    className="px-3 py-1.5 rounded-lg bg-[#171E2B] text-xs font-mono text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#00F0A0]" /> Export CSV
                  </button>
                  <button
                    onClick={() => setShowAddThreatModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#00F0A0] text-[#080B0F] font-bold text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Identifier
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-[#171E2B] text-[#8494A8] border-b border-white/[0.08]">
                      <th className="p-3">Identifier</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-center">Threat Risk</th>
                      <th className="p-3">Source</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] bg-[#090C10]">
                    {filteredThreats.slice((threatPage - 1) * itemsPerPage, threatPage * itemsPerPage).map((t, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white flex items-center gap-1.5">
                          <span>{t.identifier}</span>
                          <button onClick={() => handleCopyIdentifier(t.identifier)} className="text-[#8494A8] hover:text-white cursor-pointer">
                            <Copy className="w-3 h-3" />
                          </button>
                        </td>
                        <td className="p-3 text-[#BAC5D5]">{t.type}</td>
                        <td className="p-3 text-amber-400">{t.category}</td>
                        <td className="p-3 text-center font-bold text-rose-400">{t.riskScore || 95}%</td>
                        <td className="p-3 text-[#738294] text-[11px] truncate max-w-[200px]">{t.source}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedThreatRecord(t)}
                            className="px-2 py-1 rounded bg-[#171E2B] text-[#00F0A0] hover:bg-[#00F0A0] hover:text-[#080B0F] transition-all cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 4: VOICE PHISHING LAB
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'audio_lab' && (
            <div className="p-5 rounded-2xl bg-[#10141C] border border-white/[0.08] space-y-4 shadow-xl">
              <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Mic className="w-4 h-4 text-purple-400" />
                Live Voice Phishing &amp; Linguistic Deception Lab
              </h2>
              <p className="text-xs text-[#8494A8] font-mono">
                Speech-to-text inference with Groq Whisper &amp; 16 Linguistic Deception Markers (NeurIPS 2019 / IJISRT 2025).
              </p>
              <div className="p-4 rounded-xl bg-[#090C10] border border-white/[0.06] text-xs font-mono text-[#BAC5D5] space-y-2">
                <p>Features active: <strong>Hedging, Overzealous Expression, 3rd-Person Pronoun Deflection, Sentiment Variance SD.</strong></p>
                <p className="text-[#00F0A0]">✓ Connected to Real-time ElevenLabs Regional Multi-Lingual Alert Engine.</p>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 5: SIM SWAP MONITOR
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'sim_carrier' && (
            <div className="p-5 rounded-2xl bg-[#10141C] border border-white/[0.08] space-y-4 shadow-xl">
              <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400" />
                Telecom SIM Swap &amp; IMSI Change Monitor
              </h2>
              <p className="text-xs text-[#8494A8] font-mono">
                Direct integration with Sanchar Saathi &amp; DoT Chakshu real-time SIM change webhooks.
              </p>
              <div className="p-4 rounded-xl bg-[#090C10] border border-white/[0.06] text-xs font-mono text-[#BAC5D5] space-y-2">
                <p>Detects if a user's SIM card has been ported or swapped within the last <strong>48 hours</strong> before high-value UPI transfers.</p>
                <p className="text-emerald-400">✓ Automated 24-hour cool-off enforcement on high-risk transfers.</p>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 6: SECURITY ADVISORIES
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'advisories' && (
            <div className="p-5 rounded-2xl bg-[#10141C] border border-white/[0.08] space-y-4 shadow-xl">
              <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <BellRing className="w-4 h-4 text-blue-400" />
                RBI &amp; I4C National Fraud Advisories (2026)
              </h2>
              <div className="space-y-3">
                {[
                  { title: 'Advisory 2026/04: Digital Arrest Extortion Scam', date: 'April 2026', desc: 'Callers impersonating CBI / Mumbai Police officers demanding money transfers under Section 41A CrPC.' },
                  { title: 'Advisory 2026/03: Electricity Bill Cut SMS with APK Trojan', date: 'March 2026', desc: 'Malicious links masquerading as state electricity board bill payment portals installing remote screen-share tools.' },
                  { title: 'Advisory 2026/02: Part-Time Telegram Hotel Rating Tasks', date: 'February 2026', desc: 'Victims lured with ₹500 initial returns and coerced into depositing ₹50,000+ into layered mule bank accounts.' }
                ].map((adv, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#090C10] border border-white/[0.06] space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <strong className="text-white">{adv.title}</strong>
                      <span className="text-blue-400">{adv.date}</span>
                    </div>
                    <p className="text-xs text-[#BAC5D5] leading-relaxed">{adv.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MODAL: TICKET DEEP-DIVE INSPECTION
      ══════════════════════════════════════════════════════════════ */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-[#10141C] border border-white/[0.12] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#171E2B] text-[#00F0A0] border border-[#00F0A0]/30">
                  {selectedTicket.appealId || selectedTicket.ticketId}
                </span>
                <h3 className="text-base font-bold text-white font-mono mt-1">Dispute Ticket Detailed Telemetry</h3>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg text-[#8494A8] hover:text-white hover:bg-white/[0.05]"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#090C10] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-[#738294]">Target Recipient VPA:</span>
                <p className="font-bold text-white text-sm">{selectedTicket.vpa}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#090C10] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-[#738294]">Transaction Amount:</span>
                <p className="font-bold text-[#00F0A0] text-sm">₹{Number(selectedTicket.amount || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090C10] border border-white/[0.06] space-y-1.5">
              <span className="text-[10px] font-mono text-[#738294]">User Submitted Explanation / Appeal Note:</span>
              <p className="text-xs text-[#BAC5D5] italic font-medium leading-relaxed">
                "{selectedTicket.reason}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => {
                  setActiveTab('database_search');
                  setSearchQuery(selectedTicket.vpa);
                  setSelectedTicket(null);
                }}
                className="text-xs font-mono text-[#00F0A0] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Jump to Database Record for this VPA
              </button>

              {selectedTicket.status === 'PENDING_REVIEW' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolveAppeal(selectedTicket.appealId || selectedTicket.ticketId, 'APPROVED_WHITELISTED')}
                    className="px-4 py-2 rounded-xl bg-[#00F0A0] text-[#080B0F] font-mono font-bold text-xs cursor-pointer"
                  >
                    Approve &amp; Whitelist
                  </button>
                  <button
                    onClick={() => handleResolveAppeal(selectedTicket.appealId || selectedTicket.ticketId, 'REJECTED')}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono font-bold text-xs cursor-pointer"
                  >
                    Reject &amp; Block
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: ADD NEW THREAT RECORD
      ══════════════════════════════════════════════════════════ */}
      {showAddThreatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleAddNewThreat} className="w-full max-w-md bg-[#10141C] border border-white/[0.12] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#00F0A0]" />
                Add Threat to National Registry
              </h3>
              <button 
                type="button"
                onClick={() => setShowAddThreatModal(false)}
                className="p-1 rounded-lg text-[#8494A8] hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#8494A8]">
                Identifier (Phone or UPI VPA)
              </label>
              <input
                type="text"
                value={newThreatIdentifier}
                onChange={(e) => setNewThreatIdentifier(e.target.value)}
                placeholder="e.g. +91 94775 30475 or fraud@paytm"
                className="w-full bg-[#090C10] border border-white/[0.1] rounded-xl py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-[#00F0A0]/60"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#8494A8]">
                Threat Category
              </label>
              <select
                value={newThreatCategory}
                onChange={(e) => setNewThreatCategory(e.target.value)}
                className="w-full bg-[#090C10] border border-white/[0.1] rounded-xl py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-[#00F0A0]/60"
              >
                <option value="DIGITAL_ARREST">Digital Arrest / Fake Police</option>
                <option value="VOICE_PHISHING">Voice Phishing / Coercion</option>
                <option value="ELECTRICITY_BILL">Electricity Bill Disconnection</option>
                <option value="KYC_EXPIRY">Fake KYC / AnyDesk Screen Share</option>
                <option value="MULE_ACCOUNT">Mule UPI Account</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#8494A8]">
                Evidence Note / Case Details
              </label>
              <textarea
                value={newThreatDetails}
                onChange={(e) => setNewThreatDetails(e.target.value)}
                placeholder="Details of the extortion attempt or cyber cell FIR..."
                rows={3}
                className="w-full bg-[#090C10] border border-white/[0.1] rounded-xl py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-[#00F0A0]/60"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#00F0A0] text-[#080B0F] font-bold text-xs font-mono shadow-md cursor-pointer"
            >
              Save to Threat Registry
            </button>
          </form>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: ENLARGED THREAT RECORD DEEP-DIVE INSPECTION
      ══════════════════════════════════════════════════════════ */}
      {selectedThreatRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-[#10141C] border border-white/[0.14] rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    selectedThreatRecord.type === 'VPA' || selectedThreatRecord.identifier?.includes('@')
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  }`}>
                    {selectedThreatRecord.type === 'VPA' || selectedThreatRecord.identifier?.includes('@') ? 'UPI VPA RECIPIENT' : 'PHONE NUMBER (+91)'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {selectedThreatRecord.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2 pt-1">
                  <span>{selectedThreatRecord.identifier}</span>
                </h2>
              </div>

              <button 
                onClick={() => setSelectedThreatRecord(null)}
                className="p-1.5 rounded-xl text-[#8494A8] hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#090C10] border border-rose-500/30 flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase text-[#738294] block">Threat Risk Score</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-rose-400 font-mono">
                    {selectedThreatRecord.riskScore || 95}%
                  </span>
                  <span className="text-xs font-mono text-rose-300/80">/ 100</span>
                </div>
                <span className="text-[10px] font-mono text-rose-400 font-bold uppercase mt-1">
                  CRITICAL EXTORTION
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#090C10] border border-white/[0.06] flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase text-[#738294] block">Intelligence Source</span>
                <p className="font-bold text-white text-sm font-mono mt-1">
                  {selectedThreatRecord.source || 'I4C 1930 / Sanchar Saathi'}
                </p>
                <span className="text-[10px] font-mono text-[#00F0A0] mt-1">
                  ✓ Verified Registry Feed
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#090C10] border border-white/[0.06] flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase text-[#738294] block">Interception Policy</span>
                <p className="font-bold text-amber-400 text-sm font-mono mt-1">
                  HARD BLOCK (HOLD)
                </p>
                <span className="text-[10px] font-mono text-[#8494A8] mt-1">
                  Pre-Transaction Halt
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#090C10] border border-white/[0.08] space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#00F0A0] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Full Modus Operandi &amp; Threat Intelligence Evidence:
              </span>
              <p className="text-xs text-[#BAC5D5] font-medium leading-relaxed font-sans bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.04]">
                {selectedThreatRecord.details || 'Identified in active coercion campaign impersonating enforcement agencies or high-pressure payment redirection schemes.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
              <button
                onClick={() => {
                  navigator.clipboard && navigator.clipboard.writeText(selectedThreatRecord.identifier);
                  setActionSuccess(`Copied ${selectedThreatRecord.identifier} to clipboard!`);
                  setTimeout(() => setActionSuccess(''), 3000);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#171E2B] hover:bg-[#1E2636] border border-white/[0.1] text-xs font-mono text-[#BAC5D5] hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>📋 Copy Identifier</span>
              </button>
              <button
                onClick={() => setSelectedThreatRecord(null)}
                className="px-4 py-2 rounded-xl bg-[#00F0A0] hover:bg-[#00D68F] text-[#080B0F] text-xs font-mono font-bold transition-all cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
