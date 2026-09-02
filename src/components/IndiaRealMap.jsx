import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Satellite, 
  Map as MapIcon, 
  Mountain, 
  Maximize2, 
  Compass, 
  ShieldAlert, 
  Flame, 
  Radio, 
  Crosshair, 
  Layers,
  RotateCcw
} from 'lucide-react';

// Real GPS Coordinates for Indian States and Threat Hubs
export const REAL_INDIA_STATES = [
  {
    id: 'JH',
    state: 'JHARKHAND',
    capital: 'Ranchi',
    lat: 23.6102,
    lng: 85.2799,
    zoom: 8,
    hotspots: 'Jamtara, Deoghar, Giridih, Dumka',
    riskIndex: 96.8,
    activeThreatNodes: 3840,
    blockedVolumeCr: '18.40',
    primaryModus: 'Bank KYC Expiry, SIM Swap & AnyDesk Screen Share',
    severity: 'CRITICAL',
    vulnerabilityRank: '#1',
    color: '#FF3B30',
    subHotspots: [
      { name: 'Jamtara (Cyber Hub #1)', lat: 23.9634, lng: 86.8041, mules: 1420, type: 'KYC Expiry' },
      { name: 'Deoghar Hub', lat: 24.4826, lng: 86.6974, mules: 980, type: 'Power Cut SMS' },
      { name: 'Giridih Cell', lat: 24.1856, lng: 86.3075, mules: 740, type: 'Lottery Reward' }
    ]
  },
  {
    id: 'HR',
    state: 'HARYANA',
    capital: 'Chandigarh',
    lat: 28.5000,
    lng: 76.9000,
    zoom: 8,
    hotspots: 'Nuh, Gurugram, Faridabad, Palwal',
    riskIndex: 95.9,
    activeThreatNodes: 3620,
    blockedVolumeCr: '16.90',
    primaryModus: 'Sextortion, Police Impersonation & OLX Vehicle Scams',
    severity: 'CRITICAL',
    vulnerabilityRank: '#2',
    color: '#FF3B30',
    subHotspots: [
      { name: 'Nuh / Mewat Hub', lat: 28.1130, lng: 77.0050, mules: 2180, type: 'Sextortion / Police' },
      { name: 'Gurugram Cyber Cell', lat: 28.4595, lng: 77.0266, mules: 890, type: 'Stock Scam' },
      { name: 'Faridabad Node', lat: 28.4089, lng: 77.3178, mules: 550, type: 'OLX Fraud' }
    ]
  },
  {
    id: 'RJ',
    state: 'RAJASTHAN',
    capital: 'Jaipur',
    lat: 26.9124,
    lng: 75.7873,
    zoom: 7,
    hotspots: 'Bharatpur, Alwar, Deeg, Jaipur',
    riskIndex: 94.7,
    activeThreatNodes: 3150,
    blockedVolumeCr: '14.20',
    primaryModus: 'Fake Army Officer OLX, Advance QR Code Requests',
    severity: 'CRITICAL',
    vulnerabilityRank: '#3',
    color: '#FF3B30',
    subHotspots: [
      { name: 'Bharatpur Cyber Triad', lat: 27.2152, lng: 77.4930, mules: 1840, type: 'Army OLX' },
      { name: 'Alwar Cell', lat: 27.5530, lng: 76.6346, mules: 810, type: 'Advance QR' },
      { name: 'Jaipur Central', lat: 26.9124, lng: 75.7873, mules: 500, type: 'Lottery' }
    ]
  },
  {
    id: 'DL',
    state: 'DELHI NCR',
    capital: 'New Delhi',
    lat: 28.6139,
    lng: 77.2090,
    zoom: 10,
    hotspots: 'Connaught Place, Dwarka, Noida Sec 62',
    riskIndex: 93.4,
    activeThreatNodes: 2980,
    blockedVolumeCr: '22.70',
    primaryModus: 'CBI / ED Digital Arrest & Customs Narcotic Parcel Extortion',
    severity: 'CRITICAL',
    vulnerabilityRank: '#4',
    color: '#FF3B30',
    subHotspots: [
      { name: 'Connaught Place HQ', lat: 28.6315, lng: 77.2167, mules: 1120, type: 'Digital Arrest' },
      { name: 'Noida Sec 62 Cluster', lat: 28.6280, lng: 77.3649, mules: 810, type: 'Electricity SMS' },
      { name: 'Dwarka Mules', lat: 28.5921, lng: 77.0460, mules: 610, type: 'Customs Parcel' }
    ]
  },
  {
    id: 'WB',
    state: 'WEST BENGAL',
    capital: 'Kolkata',
    lat: 22.9868,
    lng: 87.8550,
    zoom: 8,
    hotspots: 'Salt Lake Sec V, Rajarhat, Asansol',
    riskIndex: 90.2,
    activeThreatNodes: 2450,
    blockedVolumeCr: '12.60',
    primaryModus: 'Fake Tech Support Call Centers & State Electricity Bill SMS',
    severity: 'CRITICAL',
    vulnerabilityRank: '#5',
    color: '#FF3B30',
    subHotspots: [
      { name: 'Salt Lake Sec V Tech Call Centers', lat: 22.5804, lng: 88.4378, mules: 950, type: 'Fake Tech Support' },
      { name: 'Kolkata GPO', lat: 22.5726, lng: 88.3639, mules: 720, type: 'Power Cut SMS' },
      { name: 'Asansol Cluster', lat: 23.6739, lng: 86.9524, mules: 490, type: 'Loan Waiver' }
    ]
  },
  {
    id: 'MH',
    state: 'MAHARASHTRA',
    capital: 'Mumbai',
    lat: 19.7515,
    lng: 75.7139,
    zoom: 7,
    hotspots: 'Mumbai BKC, Pune, Thane, Navi Mumbai',
    riskIndex: 88.5,
    activeThreatNodes: 2890,
    blockedVolumeCr: '28.40',
    primaryModus: 'Institutional Stock Trading Mules & Pre-IPO Allotment Fraud',
    severity: 'HIGH',
    vulnerabilityRank: '#6',
    color: '#FF9500',
    subHotspots: [
      { name: 'Mumbai BKC Financial Mules', lat: 19.0657, lng: 72.8643, mules: 780, type: 'Pre-IPO Stock' },
      { name: 'Pune Cantt Node', lat: 18.5204, lng: 73.8567, mules: 620, type: 'Trading App' },
      { name: 'Thane West Ring', lat: 19.2183, lng: 72.9781, mules: 490, type: 'Task Scam' }
    ]
  },
  {
    id: 'KA',
    state: 'KARNATAKA',
    capital: 'Bengaluru',
    lat: 15.3173,
    lng: 75.7139,
    zoom: 7,
    hotspots: 'Koramangala, Whitefield, Mysuru, Hubballi',
    riskIndex: 86.1,
    activeThreatNodes: 2110,
    blockedVolumeCr: '17.30',
    primaryModus: 'Telegram Review/Rating Tasks & Crypto Arbitrage Scams',
    severity: 'HIGH',
    vulnerabilityRank: '#7',
    color: '#FF9500',
    subHotspots: [
      { name: 'Koramangala Crypto Ring', lat: 12.9352, lng: 77.6245, mules: 540, type: 'Telegram Task' },
      { name: 'Whitefield Bot Cell', lat: 12.9698, lng: 77.7500, mules: 410, type: 'Crypto Arbitrage' },
      { name: 'Mysuru City', lat: 12.2958, lng: 76.6394, mules: 290, type: 'Work From Home' }
    ]
  },
  {
    id: 'GJ',
    state: 'GUJARAT',
    capital: 'Gandhinagar',
    lat: 22.2587,
    lng: 71.1924,
    zoom: 7,
    hotspots: 'Surat, Ahmedabad, Rajkot',
    riskIndex: 87.2,
    activeThreatNodes: 2240,
    blockedVolumeCr: '15.10',
    primaryModus: 'Dabba Trading, Commodity Forex & Fake IPO Schemes',
    severity: 'HIGH',
    vulnerabilityRank: '#8',
    color: '#FF9500',
    subHotspots: [
      { name: 'Surat Dabba Trading Ring', lat: 21.1702, lng: 72.8311, mules: 620, type: 'Dabba Trading' },
      { name: 'Ahmedabad IPO Mules', lat: 23.0225, lng: 72.5714, mules: 510, type: 'Fake IPO' }
    ]
  },
  {
    id: 'TG',
    state: 'TELANGANA',
    capital: 'Hyderabad',
    lat: 18.1124,
    lng: 79.0193,
    zoom: 8,
    hotspots: 'Cyberabad, HITEC City, Secunderabad',
    riskIndex: 84.6,
    activeThreatNodes: 1890,
    blockedVolumeCr: '13.80',
    primaryModus: 'Instant Chinese Loan App Extortion & Betting Apps',
    severity: 'HIGH',
    vulnerabilityRank: '#9',
    color: '#FF9500',
    subHotspots: [
      { name: 'HITEC City Loan Harassment Cells', lat: 17.4474, lng: 78.3762, mules: 480, type: 'Loan App' },
      { name: 'Secunderabad Betting Ring', lat: 17.4399, lng: 78.4983, mules: 360, type: 'Betting App' }
    ]
  },
  {
    id: 'UP',
    state: 'UTTAR PRADESH',
    capital: 'Lucknow',
    lat: 26.8467,
    lng: 80.9462,
    zoom: 7,
    hotspots: 'Noida, Greater Noida, Lucknow, Kanpur',
    riskIndex: 89.1,
    activeThreatNodes: 2780,
    blockedVolumeCr: '21.30',
    primaryModus: 'Fake Job Offers, Electricity Bill Scam & Loan Apps',
    severity: 'HIGH',
    vulnerabilityRank: '#10',
    color: '#FF9500',
    subHotspots: [
      { name: 'Noida Sec 18 Fake Jobs', lat: 28.5708, lng: 77.3271, mules: 920, type: 'Job Offer' },
      { name: 'Lucknow GPO', lat: 26.8467, lng: 80.9462, mules: 680, type: 'Electricity SMS' }
    ]
  },
  {
    id: 'TN',
    state: 'TAMIL NADU',
    capital: 'Chennai',
    lat: 11.1271,
    lng: 78.6569,
    zoom: 7,
    hotspots: 'Chennai OMR, Coimbatore, Madurai',
    riskIndex: 81.4,
    activeThreatNodes: 1650,
    blockedVolumeCr: '11.20',
    primaryModus: 'Part-Time Work Fraud, FedEx Customs Scam',
    severity: 'HIGH',
    vulnerabilityRank: '#11',
    color: '#FF9500',
    subHotspots: [
      { name: 'Chennai OMR Task Fraud', lat: 12.9249, lng: 80.2272, mules: 510, type: 'Part-Time Work' },
      { name: 'Coimbatore Hub', lat: 11.0168, lng: 76.9558, mules: 380, type: 'Customs' }
    ]
  },
  {
    id: 'OD',
    state: 'ODISHA',
    capital: 'Bhubaneswar',
    lat: 20.9517,
    lng: 85.0985,
    zoom: 7,
    hotspots: 'Bhubaneswar, Cuttack, Rourkela',
    riskIndex: 79.5,
    activeThreatNodes: 1240,
    blockedVolumeCr: '8.40',
    primaryModus: 'SIM Swap, Lottery Reward & Fake KYC Calls',
    severity: 'MEDIUM',
    vulnerabilityRank: '#12',
    color: '#00F0A0',
    subHotspots: [
      { name: 'Bhubaneswar Cyber Desk', lat: 20.2961, lng: 85.8245, mules: 420, type: 'SIM Swap' },
      { name: 'Cuttack Cell', lat: 20.4625, lng: 85.8828, mules: 310, type: 'Lottery' }
    ]
  },
  {
    id: 'KL',
    state: 'KERALA',
    capital: 'Thiruvananthapuram',
    lat: 10.8505,
    lng: 76.2711,
    zoom: 8,
    hotspots: 'Kochi, Kozhikode, Thiruvananthapuram',
    riskIndex: 78.2,
    activeThreatNodes: 1150,
    blockedVolumeCr: '7.90',
    primaryModus: 'Crypto Arbitrage, Online Trading & NRI Impersonation',
    severity: 'MEDIUM',
    vulnerabilityRank: '#13',
    color: '#00F0A0',
    subHotspots: [
      { name: 'Kochi Crypto Desks', lat: 9.9312, lng: 76.2673, mules: 390, type: 'Crypto Arbitrage' },
      { name: 'Trivandrum NRI Ring', lat: 8.5241, lng: 76.9366, mules: 280, type: 'NRI Fraud' }
    ]
  },
  {
    id: 'MP',
    state: 'MADHYA PRADESH',
    capital: 'Bhopal',
    lat: 22.9734,
    lng: 78.6569,
    zoom: 7,
    hotspots: 'Indore, Bhopal, Jabalpur',
    riskIndex: 82.3,
    activeThreatNodes: 1720,
    blockedVolumeCr: '12.10',
    primaryModus: 'Fake Matrimonial Scams & Instant Micro-Loan Apps',
    severity: 'HIGH',
    vulnerabilityRank: '#14',
    color: '#FF9500',
    subHotspots: [
      { name: 'Indore Micro-Loan Ring', lat: 22.7196, lng: 75.8577, mules: 490, type: 'Loan App' },
      { name: 'Bhopal Matrimonial Scams', lat: 23.2599, lng: 77.4126, mules: 410, type: 'Matrimony' }
    ]
  },
  {
    id: 'JK',
    state: 'JAMMU & KASHMIR / LADAKH',
    capital: 'Srinagar / Jammu',
    lat: 33.7782,
    lng: 76.5762,
    zoom: 7,
    hotspots: 'Srinagar, Jammu, Leh',
    riskIndex: 71.0,
    activeThreatNodes: 640,
    blockedVolumeCr: '3.40',
    primaryModus: 'Telecom Tower Lease & Fake Government Schemes',
    severity: 'GUARDED',
    vulnerabilityRank: '#15',
    color: '#00D2FF',
    subHotspots: [
      { name: 'Srinagar Scheme Desk', lat: 34.0837, lng: 74.7973, mules: 210, type: 'Gov Scheme' }
    ]
  },
  {
    id: 'AS',
    state: 'ASSAM & NORTH-EAST',
    capital: 'Guwahati',
    lat: 26.2006,
    lng: 92.9376,
    zoom: 7,
    hotspots: 'Guwahati, Silchar, Dibrugarh',
    riskIndex: 76.5,
    activeThreatNodes: 980,
    blockedVolumeCr: '5.60',
    primaryModus: 'Teer Betting Apps & Illegal Border SIM Farming',
    severity: 'GUARDED',
    vulnerabilityRank: '#16',
    color: '#00D2FF',
    subHotspots: [
      { name: 'Guwahati Teer Betting', lat: 26.1445, lng: 91.7362, mules: 340, type: 'Betting App' },
      { name: 'Silchar SIM Farm', lat: 24.8170, lng: 92.7993, mules: 210, type: 'Border SIM' }
    ]
  }
];

// Attack Money Mule Flight Routes (Connecting Real Lat/Lngs)
const ATTACK_ROUTES = [
  { from: [23.9634, 86.8041], to: [28.6139, 77.2090], name: 'Jamtara ➔ Delhi NCR (KYC Vector)' },
  { from: [23.9634, 86.8041], to: [19.0760, 72.8777], name: 'Jamtara ➔ Mumbai BKC (Mule Transfer)' },
  { from: [28.1130, 77.0050], to: [12.9716, 77.5946], name: 'Nuh/Mewat ➔ Bengaluru (Extortion Drain)' },
  { from: [27.2152, 77.4930], to: [28.6139, 77.2090], name: 'Bharatpur ➔ Delhi (Army QR)' },
  { from: [22.5804, 88.4378], to: [19.0760, 72.8777], name: 'Kolkata Salt Lake ➔ Mumbai (Tech Scam)' },
  { from: [19.0760, 72.8777], to: [17.3850, 78.4867], name: 'Mumbai ➔ Hyderabad (Crypto Layering)' }
];

export default function IndiaRealMap({ selectedStateId, onSelectState }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersGroupRef = useRef(null);
  const routesGroupRef = useRef(null);

  const [mapStyle, setMapStyle] = useState('SATELLITE'); // 'SATELLITE' | 'DARK' | 'TOPO'
  const [hoveredCoords, setHoveredCoords] = useState({ lat: 22.59, lng: 78.96 });
  const [showRoutes, setShowRoutes] = useState(true);

  // Initialize Real Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Centered on Real India (Lat 22.59, Lng 78.96)
    const map = L.map(mapContainerRef.current, {
      center: [22.5937, 78.9629],
      zoom: 5,
      minZoom: 4,
      maxZoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Custom Top-Right Zoom Control
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Default: High-Resolution Real Satellite Tile Layer (Esri World Imagery)
    const satelliteTile = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18, crossOrigin: true }
    );

    satelliteTile.addTo(map);
    tileLayerRef.current = satelliteTile;

    // Feature Groups
    const markersGroup = L.featureGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    const routesGroup = L.featureGroup().addTo(map);
    routesGroupRef.current = routesGroup;

    // Mousemove coordinate HUD
    map.on('mousemove', (e) => {
      setHoveredCoords({
        lat: e.latlng.lat.toFixed(4),
        lng: e.latlng.lng.toFixed(4)
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Layer Switcher (Satellite vs Dark vs Topo)
  const changeTileLayer = (style) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    setMapStyle(style);

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let newTile;
    if (style === 'SATELLITE') {
      newTile = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, crossOrigin: true }
      );
    } else if (style === 'DARK') {
      newTile = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', maxZoom: 19, crossOrigin: true }
      );
    } else if (style === 'TOPO') {
      newTile = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, crossOrigin: true }
      );
    }

    newTile.addTo(map);
    tileLayerRef.current = newTile;
  };

  // Render Real State Pins, Heat Circles, and Hotspots
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    REAL_INDIA_STATES.forEach((state) => {
      const isSelected = state.id === selectedStateId;
      const isCritical = state.riskIndex >= 90;

      // 1. Glowing Threat Heat Radius
      const heatRadius = isCritical ? 65000 : 45000;
      const heatCircle = L.circle([state.lat, state.lng], {
        radius: heatRadius,
        color: state.color,
        fillColor: state.color,
        fillOpacity: isSelected ? 0.35 : (isCritical ? 0.22 : 0.12),
        weight: isSelected ? 2.5 : 1.2,
        dashArray: isSelected ? null : '4, 4'
      });
      heatCircle.addTo(markersGroup);

      // 2. Custom Real Radar Pin Icon
      const pinHtml = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          ${isCritical ? `
            <div style="
              position: absolute;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: ${state.color};
              opacity: 0.4;
              animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          ` : ''}
          <div style="
            width: ${isSelected ? '22px' : '16px'};
            height: ${isSelected ? '22px' : '16px'};
            border-radius: 50%;
            background: ${state.color};
            border: 2px solid #ffffff;
            box-shadow: 0 0 12px ${state.color}, 0 2px 6px rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            ${isSelected ? '<div style="width: 6px; height: 6px; border-radius: 50%; background: #000;"></div>' : ''}
          </div>
          <div style="
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(10, 16, 29, 0.92);
            color: #ffffff;
            font-family: monospace;
            font-size: 10px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid ${isSelected ? '#00F0A0' : 'rgba(255,255,255,0.2)'};
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.8);
            pointer-events: none;
          ">
            ${state.id} ${state.riskIndex}%
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-real-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([state.lat, state.lng], { icon: customIcon });

      // Click Event
      marker.on('click', () => {
        if (onSelectState) onSelectState(state.id);
        map.flyTo([state.lat, state.lng], Math.max(state.zoom, 7), {
          duration: 1.2,
          easeLinearity: 0.25
        });
      });

      // Hover Tooltip
      const popupHtml = `
        <div style="font-family: sans-serif; color: #fff; background: #0F172A; padding: 8px; border-radius: 6px; min-width: 180px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; margin-bottom: 6px;">
            <strong style="font-size: 12px; color: #00F0A0;">${state.vulnerabilityRank} ${state.state}</strong>
            <span style="font-size: 10px; font-weight: bold; color: ${state.color};">${state.riskIndex}% RISK</span>
          </div>
          <div style="font-size: 10.5px; line-height: 1.4; color: #E2E8F0;">
            <div>Capital: <strong>${state.capital}</strong></div>
            <div>Active Mules: <strong style="color: #FF4B4B;">${state.activeThreatNodes} nodes</strong></div>
            <div>24H Blocked: <strong style="color: #00F0A0;">₹${state.blockedVolumeCr} Cr</strong></div>
            <div style="margin-top: 4px; color: #94A3B8; font-size: 9.5px;">Hotspots: ${state.hotspots}</div>
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml, { className: 'custom-leaflet-popup' });

      marker.addTo(markersGroup);

      // Render Sub-district Hotspot Nodes if State is Selected
      if (isSelected && state.subHotspots) {
        state.subHotspots.forEach((sub) => {
          const subIcon = L.divIcon({
            html: `
              <div style="
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #FF4B4B;
                border: 1.5px solid #fff;
                box-shadow: 0 0 8px #FF4B4B;
              "></div>
            `,
            className: 'sub-hotspot-pin',
            iconSize: [10, 10],
            iconAnchor: [5, 5]
          });

          const subMarker = L.marker([sub.lat, sub.lng], { icon: subIcon });
          subMarker.bindPopup(`
            <div style="font-family: monospace; font-size: 11px; color: #fff; background: #000; padding: 4px 8px; border-radius: 4px;">
              <strong style="color: #FF4B4B;">📍 ${sub.name}</strong><br/>
              Mules: ${sub.mules} | Modus: ${sub.type}
            </div>
          `);
          subMarker.addTo(markersGroup);
        });
      }
    });
  }, [selectedStateId, onSelectState]);

  // Render Real Money Mule & Attack Flight Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routesGroup = routesGroupRef.current;
    if (!map || !routesGroup) return;

    routesGroup.clearLayers();

    if (!showRoutes) return;

    ATTACK_ROUTES.forEach((route) => {
      // Real Great Circle / Curved Polyline
      const polyline = L.polyline([route.from, route.to], {
        color: '#FF3B30',
        weight: 2,
        opacity: 0.65,
        dashArray: '6, 8',
        lineCap: 'round'
      });

      polyline.bindPopup(`
        <div style="font-family: monospace; font-size: 11px; color: #FF4B4B; background: #111; padding: 4px 8px; border-radius: 4px;">
          ⚡ ATTACK VECTOR: <strong>${route.name}</strong>
        </div>
      `);

      polyline.addTo(routesGroup);
    });
  }, [showRoutes]);

  // Smooth Fly-to when selected state changes from outside dropdown
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const state = REAL_INDIA_STATES.find(s => s.id === selectedStateId);
    if (state) {
      map.flyTo([state.lat, state.lng], Math.max(state.zoom, 7), {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [selectedStateId]);

  // Reset to All-India View
  const resetIndiaView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([22.5937, 78.9629], 5, { duration: 1.2 });
  };

  const selectedStateObj = REAL_INDIA_STATES.find(s => s.id === selectedStateId) || REAL_INDIA_STATES[0];

  return (
    <div className="flex-1 relative flex flex-col w-full h-full bg-[#05080E] select-none overflow-hidden">
      
      {/* ── Real Map Style Switcher & Action Toolbar ── */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex justify-between items-center pointer-events-none">
        
        {/* Left: Satellite Live HUD */}
        <div className="flex items-center gap-2 bg-[#10141C]/90 px-3 py-1.5 border border-white/[0.12] rounded shadow-xl backdrop-blur-md">
          <Satellite className="w-4 h-4 text-[#00F0A0] animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-white tracking-wider uppercase">
            Real Geospatial Defense Radar • Live Satellite Feed
          </span>
        </div>

        {/* Right: Map Layer Switcher Buttons */}
        <div className="flex items-center gap-1 pointer-events-auto bg-[#10141C]/90 p-1 border border-white/[0.12] rounded shadow-xl backdrop-blur-md">
          <button
            onClick={() => changeTileLayer('SATELLITE')}
            className={`px-2.5 py-1 text-[10.5px] font-mono font-bold transition-all rounded flex items-center gap-1.5 ${
              mapStyle === 'SATELLITE' ? 'bg-[#00F0A0] text-black shadow-md' : 'text-[#e4bdba] hover:text-white'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            REAL SATELLITE
          </button>
          
          <button
            onClick={() => changeTileLayer('DARK')}
            className={`px-2.5 py-1 text-[10.5px] font-mono font-bold transition-all rounded flex items-center gap-1.5 ${
              mapStyle === 'DARK' ? 'bg-[#00F0A0] text-black shadow-md' : 'text-[#e4bdba] hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            DARK DEFENSE
          </button>

          <button
            onClick={() => changeTileLayer('TOPO')}
            className={`px-2.5 py-1 text-[10.5px] font-mono font-bold transition-all rounded flex items-center gap-1.5 ${
              mapStyle === 'TOPO' ? 'bg-[#00F0A0] text-black shadow-md' : 'text-[#e4bdba] hover:text-white'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            3D TOPOGRAPHY
          </button>

          <div className="w-[1px] h-4 bg-white/20 mx-1" />

          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2 py-1 text-[10.5px] font-mono font-bold transition-all rounded ${
              showRoutes ? 'bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]' : 'text-[#e4bdba]'
            }`}
            title="Toggle Money Mule Transfer Vectors"
          >
            ⚡ MULE TRAILS
          </button>

          <button
            onClick={resetIndiaView}
            className="p-1.5 text-[#00F0A0] hover:bg-white/10 rounded transition-all"
            title="Reset to Full India View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Leaflet Real Map Container ── */}
      <div 
        ref={mapContainerRef} 
        className="flex-1 w-full h-full z-0" 
        style={{ minHeight: '440px' }}
      />

      {/* ── Bottom Right Real Telemetry Coordinates HUD ── */}
      <div className="absolute bottom-12 right-3 z-[1000] pointer-events-none flex items-center gap-2 bg-[#10141C]/85 px-2.5 py-1 border border-white/[0.1] rounded text-[9.5px] font-mono text-[#00F0A0]">
        <Crosshair className="w-3 h-3" />
        <span>LAT: {hoveredCoords.lat}° N</span>
        <span>|</span>
        <span>LON: {hoveredCoords.lng}° E</span>
        <span>|</span>
        <span>ALT: SATELLITE TACTICAL</span>
      </div>

      {/* ── Bottom Live Jurisdiction Telemetry Bar ── */}
      <div className="absolute bottom-2 left-3 right-3 z-[1000] flex justify-between items-center text-[10.5px] font-mono text-[#e4bdba] bg-[#10141C]/92 px-3 py-2 border border-white/[0.12] shadow-2xl rounded backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00F0A0] animate-pulse" />
          <span>FOCUSED JURISDICTION: <strong className="text-[#00F0A0]">{selectedStateObj.vulnerabilityRank} {selectedStateObj.state} ({selectedStateObj.capital})</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <span>ACTIVE THREAT NODES: <strong className="text-white">{selectedStateObj.activeThreatNodes.toLocaleString()}</strong></span>
          <span>24H BLOCKED: <strong className="text-[#FF4B4B]">₹{selectedStateObj.blockedVolumeCr} Cr</strong></span>
        </div>
      </div>
    </div>
  );
}
