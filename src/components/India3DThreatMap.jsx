import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Rotate3d, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Eye, 
  Layers, 
  Flame, 
  ShieldAlert, 
  Activity,
  Maximize2
} from 'lucide-react';

// Geographic Coordinates for Indian States (Mapped to 3D Plane: X = Longitude, Z = -Latitude)
// Center normalized roughly around Central India (22°N, 78°E)
const INDIA_3D_STATES = [
  {
    id: 'JH',
    state: 'JHARKHAND',
    capital: 'Ranchi',
    hotspots: 'Jamtara, Deoghar, Giridih',
    riskIndex: 96.8,
    activeThreatNodes: 3840,
    blockedVolumeCr: '18.40',
    primaryModus: 'Bank KYC Expiry, SIM Swap & AnyDesk',
    severity: 'CRITICAL',
    vulnerabilityRank: '#1',
    pos: [3.8, 0, -1.8], // [X, Y, Z]
    towerHeight: 5.2,
    color: 0xff3b30
  },
  {
    id: 'HR',
    state: 'HARYANA',
    capital: 'Chandigarh',
    hotspots: 'Nuh, Gurugram, Faridabad',
    riskIndex: 95.9,
    activeThreatNodes: 3620,
    blockedVolumeCr: '16.90',
    primaryModus: 'Sextortion, Police Impersonation & OLX Scams',
    severity: 'CRITICAL',
    vulnerabilityRank: '#2',
    pos: [-1.2, 0, 3.2],
    towerHeight: 5.0,
    color: 0xff3b30
  },
  {
    id: 'RJ',
    state: 'RAJASTHAN',
    capital: 'Jaipur',
    hotspots: 'Bharatpur, Alwar, Deeg',
    riskIndex: 94.7,
    activeThreatNodes: 3150,
    blockedVolumeCr: '14.20',
    primaryModus: 'Fake Army Officer OLX, Advance QR',
    severity: 'CRITICAL',
    vulnerabilityRank: '#3',
    pos: [-3.2, 0, 1.8],
    towerHeight: 4.8,
    color: 0xff3b30
  },
  {
    id: 'DL',
    state: 'DELHI NCR',
    capital: 'New Delhi',
    hotspots: 'Connaught Place, Dwarka, Noida',
    riskIndex: 93.4,
    activeThreatNodes: 2980,
    blockedVolumeCr: '22.70',
    primaryModus: 'CBI / ED Digital Arrest & Customs Narcotic Parcel',
    severity: 'CRITICAL',
    vulnerabilityRank: '#4',
    pos: [-0.6, 0, 2.8],
    towerHeight: 4.6,
    color: 0xff3b30
  },
  {
    id: 'WB',
    state: 'WEST BENGAL',
    capital: 'Kolkata',
    hotspots: 'Salt Lake Sec V, Rajarhat',
    riskIndex: 90.2,
    activeThreatNodes: 2450,
    blockedVolumeCr: '12.60',
    primaryModus: 'Fake Tech Support Call Centers & Electricity SMS',
    severity: 'CRITICAL',
    vulnerabilityRank: '#5',
    pos: [5.2, 0, -1.2],
    towerHeight: 4.3,
    color: 0xff3b30
  },
  {
    id: 'UP',
    state: 'UTTAR PRADESH',
    capital: 'Lucknow',
    hotspots: 'Noida Sec 18, Lucknow, Kanpur',
    riskIndex: 89.1,
    activeThreatNodes: 2780,
    blockedVolumeCr: '21.30',
    primaryModus: 'Fake Job Offers, Electricity Bill Scams',
    severity: 'HIGH',
    vulnerabilityRank: '#10',
    pos: [1.2, 0, 2.0],
    towerHeight: 4.1,
    color: 0xff9500
  },
  {
    id: 'MH',
    state: 'MAHARASHTRA',
    capital: 'Mumbai',
    hotspots: 'Mumbai BKC, Pune, Thane',
    riskIndex: 88.5,
    activeThreatNodes: 2890,
    blockedVolumeCr: '28.40',
    primaryModus: 'Institutional Stock Trading Mules & Pre-IPO Scams',
    severity: 'HIGH',
    vulnerabilityRank: '#6',
    pos: [-2.2, 0, -2.4],
    towerHeight: 4.0,
    color: 0xff9500
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
    severity: 'HIGH',
    vulnerabilityRank: '#8',
    pos: [-4.6, 0, -0.6],
    towerHeight: 3.8,
    color: 0xff9500
  },
  {
    id: 'KA',
    state: 'KARNATAKA',
    capital: 'Bengaluru',
    hotspots: 'Koramangala, Whitefield, Mysuru',
    riskIndex: 86.1,
    activeThreatNodes: 2110,
    blockedVolumeCr: '17.30',
    primaryModus: 'Telegram Review Tasks & Crypto Arbitrage',
    severity: 'HIGH',
    vulnerabilityRank: '#7',
    pos: [-1.4, 0, -5.6],
    towerHeight: 3.7,
    color: 0xff9500
  },
  {
    id: 'TG',
    state: 'TELANGANA',
    capital: 'Hyderabad',
    hotspots: 'Cyberabad, HITEC City',
    riskIndex: 84.6,
    activeThreatNodes: 1890,
    blockedVolumeCr: '13.80',
    primaryModus: 'Instant Chinese Loan App Extortion & Betting Apps',
    severity: 'HIGH',
    vulnerabilityRank: '#9',
    pos: [0.6, 0, -3.8],
    towerHeight: 3.5,
    color: 0xff9500
  },
  {
    id: 'MP',
    state: 'MADHYA PRADESH',
    capital: 'Bhopal',
    hotspots: 'Indore, Bhopal, Jabalpur',
    riskIndex: 82.3,
    activeThreatNodes: 1720,
    blockedVolumeCr: '12.10',
    primaryModus: 'Fake Matrimonial Scams & Micro-Loan Apps',
    severity: 'HIGH',
    vulnerabilityRank: '#14',
    pos: [-0.4, 0, 0.2],
    towerHeight: 3.3,
    color: 0xff9500
  },
  {
    id: 'TN',
    state: 'TAMIL NADU',
    capital: 'Chennai',
    hotspots: 'Chennai OMR, Coimbatore',
    riskIndex: 81.4,
    activeThreatNodes: 1650,
    blockedVolumeCr: '11.20',
    primaryModus: 'Part-Time Work Fraud, FedEx Customs Scam',
    severity: 'HIGH',
    vulnerabilityRank: '#11',
    pos: [0.2, 0, -7.2],
    towerHeight: 3.1,
    color: 0xff9500
  },
  {
    id: 'OD',
    state: 'ODISHA',
    capital: 'Bhubaneswar',
    hotspots: 'Bhubaneswar, Cuttack',
    riskIndex: 79.5,
    activeThreatNodes: 1240,
    blockedVolumeCr: '8.40',
    primaryModus: 'SIM Swap, Lottery Reward & Fake KYC Calls',
    severity: 'MEDIUM',
    vulnerabilityRank: '#12',
    pos: [3.4, 0, -2.8],
    towerHeight: 2.8,
    color: 0x00f0a0
  },
  {
    id: 'KL',
    state: 'KERALA',
    capital: 'Thiruvananthapuram',
    hotspots: 'Kochi, Kozhikode, Trivandrum',
    riskIndex: 78.2,
    activeThreatNodes: 1150,
    blockedVolumeCr: '7.90',
    primaryModus: 'Crypto Arbitrage, Online Trading & NRI Scam',
    severity: 'MEDIUM',
    vulnerabilityRank: '#13',
    pos: [-1.8, 0, -7.8],
    towerHeight: 2.6,
    color: 0x00f0a0
  },
  {
    id: 'AS',
    state: 'ASSAM & NORTHEAST',
    capital: 'Guwahati',
    hotspots: 'Guwahati, Silchar',
    riskIndex: 76.5,
    activeThreatNodes: 980,
    blockedVolumeCr: '5.60',
    primaryModus: 'Teer Betting Apps & Illegal Border SIM Farming',
    severity: 'GUARDED',
    vulnerabilityRank: '#16',
    pos: [7.8, 0, 0.4],
    towerHeight: 2.3,
    color: 0x00f0a0
  },
  {
    id: 'JK',
    state: 'JAMMU & KASHMIR',
    capital: 'Srinagar',
    hotspots: 'Srinagar, Jammu',
    riskIndex: 71.0,
    activeThreatNodes: 640,
    blockedVolumeCr: '3.40',
    primaryModus: 'Telecom Tower Lease & Fake Gov Schemes',
    severity: 'GUARDED',
    vulnerabilityRank: '#15',
    pos: [-1.0, 0, 6.2],
    towerHeight: 2.0,
    color: 0x00d2ff
  }
];

// Attack Vector Connections between hubs (Jamtara -> Metros)
const ATTACK_ARCS = [
  { from: 'JH', to: 'DL', color: 0xff3b30 },
  { from: 'JH', to: 'MH', color: 0xff3b30 },
  { from: 'JH', to: 'WB', color: 0xff9500 },
  { from: 'HR', to: 'MH', color: 0xff3b30 },
  { from: 'HR', to: 'KA', color: 0xff9500 },
  { from: 'RJ', to: 'DL', color: 0xff9500 },
  { from: 'MH', to: 'TG', color: 0x00f0a0 },
  { from: 'MH', to: 'KA', color: 0x00f0a0 }
];

export default function India3DThreatMap({ selectedStateId, onSelectState }) {
  const containerRef = useRef(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewMode, setViewMode] = useState('3D'); // '3D' | 'TOP' | 'NORTH' | 'SOUTH'
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'ARCS'
  
  // Three.js instances ref
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef({
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    targetRotationX: 0.65,
    targetRotationY: 0.2,
    rotationX: 0.65,
    rotationY: 0.2,
    distance: 22,
    targetDistance: 22
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05080e, 0.025);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 16, 20);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0a2540, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f0a0, 2.2);
    dirLight.position.set(10, 25, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLightRed = new THREE.PointLight(0xff3b30, 3, 25);
    pointLightRed.position.set(4, 8, -2);
    scene.add(pointLightRed);

    // 5. High-Tech Cyber Terrain Grid Floor
    const gridHelper = new THREE.GridHelper(36, 36, 0x00f0a0, 0x0f263e);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Radar Scanning Plane
    const radarGeo = new THREE.RingGeometry(0.5, 16, 64);
    const radarMat = new THREE.MeshBasicMaterial({
      color: 0x00f0a0,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const radarMesh = new THREE.Mesh(radarGeo, radarMat);
    radarMesh.rotation.x = -Math.PI / 2;
    radarMesh.position.y = -0.45;
    scene.add(radarMesh);

    // Radar Beam Line
    const radarBeamGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -0.4, 0),
      new THREE.Vector3(16, -0.4, 0)
    ]);
    const radarBeamMat = new THREE.LineBasicMaterial({ color: 0x00f0a0, linewidth: 2 });
    const radarBeam = new THREE.Line(radarBeamGeo, radarBeamMat);
    scene.add(radarBeam);

    // 6. Extruded 3D Landmass of India
    const indiaShape = new THREE.Shape();
    // Simplified 3D India Continental Contour centered at (0,0)
    indiaShape.moveTo(-1.0, 7.5);    // Kashmir
    indiaShape.lineTo(0.5, 7.0);     // Ladakh
    indiaShape.lineTo(1.8, 5.0);     // Uttarakhand / Tibet border
    indiaShape.lineTo(3.2, 3.8);     // Nepal border
    indiaShape.lineTo(5.5, 3.5);     // Sikkim / Bhutan
    indiaShape.lineTo(8.5, 3.8);     // Arunachal
    indiaShape.lineTo(9.2, 1.8);     // Nagaland / Manipur
    indiaShape.lineTo(7.5, 0.0);     // Assam / Meghalaya
    indiaShape.lineTo(5.8, -1.0);    // Bengal / Sundarbans
    indiaShape.lineTo(4.5, -3.2);    // Odisha Coast
    indiaShape.lineTo(2.2, -5.5);    // Andhra Coast
    indiaShape.lineTo(0.8, -7.5);    // Tamil Nadu Coast
    indiaShape.lineTo(0.0, -9.0);    // Kanyakumari Tip
    indiaShape.lineTo(-1.8, -8.0);   // Kerala Malabar
    indiaShape.lineTo(-2.2, -5.2);   // Karnataka / Goa
    indiaShape.lineTo(-3.2, -2.8);   // Maharashtra Konkan
    indiaShape.lineTo(-5.5, -1.0);   // Gujarat Kathiawar
    indiaShape.lineTo(-5.8, 1.2);    // Gujarat Kutch
    indiaShape.lineTo(-4.5, 2.5);    // Rajasthan Desert
    indiaShape.lineTo(-2.8, 4.8);    // Punjab
    indiaShape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.6,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.15,
      bevelSegments: 3
    };

    const landGeo = new THREE.ExtrudeGeometry(indiaShape, extrudeSettings);
    landGeo.rotateX(Math.PI / 2); // Lay flat on X-Z plane

    const landMat = new THREE.MeshStandardMaterial({
      color: 0x0d1829,
      roughness: 0.4,
      metalness: 0.8,
      wireframe: false
    });
    const landMesh = new THREE.Mesh(landGeo, landMat);
    landMesh.position.y = -0.4;
    scene.add(landMesh);

    // Glowing Neon Edge Line around India
    const edgeGeo = new THREE.EdgesGeometry(landGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x00f0a0, linewidth: 2 });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    edgeLines.position.y = -0.4;
    scene.add(edgeLines);

    // 7. Interactive 3D Threat Towers & State Meshes
    const stateGroup = new THREE.Group();
    scene.add(stateGroup);

    const raycastObjects = [];

    INDIA_3D_STATES.forEach((state) => {
      const isSelected = state.id === selectedStateId;
      const isCritical = state.riskIndex >= 90;

      // Vertical 3D Threat Cylinder
      const towerGeo = new THREE.CylinderGeometry(0.28, 0.45, state.towerHeight, 16);
      const towerMat = new THREE.MeshStandardMaterial({
        color: state.color,
        emissive: state.color,
        emissiveIntensity: isSelected ? 0.9 : (isCritical ? 0.6 : 0.3),
        roughness: 0.2,
        metalness: 0.9,
        transparent: true,
        opacity: 0.85
      });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.set(state.pos[0], state.towerHeight / 2 - 0.4, state.pos[2]);
      tower.userData = { stateData: state };
      stateGroup.add(tower);
      raycastObjects.push(tower);

      // Glowing Beacon Sphere on top of Tower
      const sphereGeo = new THREE.SphereGeometry(isCritical ? 0.35 : 0.25, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0x00f0a0 : state.color
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(state.pos[0], state.towerHeight - 0.3, state.pos[2]);
      stateGroup.add(sphere);

      // Base Pulsing Radar Ring on Ground
      const ringGeo = new THREE.RingGeometry(0.3, 0.8, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: state.color,
        transparent: true,
        opacity: isSelected ? 0.8 : 0.35,
        side: THREE.DoubleSide
      });
      const baseRing = new THREE.Mesh(ringGeo, ringMat);
      baseRing.rotation.x = -Math.PI / 2;
      baseRing.position.set(state.pos[0], -0.35, state.pos[2]);
      stateGroup.add(baseRing);
    });

    // 8. 3D Attack Vector Laser Arcs
    const arcGroup = new THREE.Group();
    scene.add(arcGroup);

    ATTACK_ARCS.forEach((arc) => {
      const fromState = INDIA_3D_STATES.find(s => s.id === arc.from);
      const toState = INDIA_3D_STATES.find(s => s.id === arc.to);
      if (!fromState || !toState) return;

      const p1 = new THREE.Vector3(fromState.pos[0], fromState.towerHeight - 0.4, fromState.pos[2]);
      const p2 = new THREE.Vector3(toState.pos[0], toState.towerHeight - 0.4, toState.pos[2]);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += 3.5; // Arc height

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(32);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
      const curveMat = new THREE.LineBasicMaterial({
        color: arc.color,
        transparent: true,
        opacity: 0.6,
        linewidth: 2
      });
      const curveLine = new THREE.Line(curveGeo, curveMat);
      arcGroup.add(curveLine);
    });

    // 9. Particle Starfield
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 600;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 80;
      starPositions[i + 1] = Math.random() * 30 + 5;
      starPositions[i + 2] = (Math.random() - 0.5) * 80;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0x00f0a0, size: 0.15, transparent: true, opacity: 0.5 });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // 10. Mouse Interaction & Orbit Controls
    const controls = controlsRef.current;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e) => {
      controls.isDragging = true;
      controls.prevMouseX = e.clientX;
      controls.prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      if (controls.isDragging) {
        const deltaX = e.clientX - controls.prevMouseX;
        const deltaY = e.clientY - controls.prevMouseY;

        controls.targetRotationY += deltaX * 0.008;
        controls.targetRotationX = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, controls.targetRotationX + deltaY * 0.008));

        controls.prevMouseX = e.clientX;
        controls.prevMouseY = e.clientY;
      } else {
        // Raycasting for hover tooltip
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(raycastObjects);
        if (intersects.length > 0) {
          const stateData = intersects[0].object.userData.stateData;
          setHoveredState(stateData);
          container.style.cursor = 'pointer';
        } else {
          setHoveredState(null);
          container.style.cursor = 'grab';
        }
      }
    };

    const onMouseUp = () => {
      controls.isDragging = false;
    };

    const onClick = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastObjects);
      if (intersects.length > 0) {
        const stateData = intersects[0].object.userData.stateData;
        if (onSelectState) {
          onSelectState(stateData.id);
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      controls.targetDistance = Math.max(10, Math.min(36, controls.targetDistance + e.deltaY * 0.02));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 11. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotate radar scanner beam
      radarBeam.rotation.y = -elapsed * 1.5;

      // Subtle pulse on critical towers
      stateGroup.children.forEach((child) => {
        if (child.isMesh && child.geometry.type === 'CylinderGeometry') {
          const stateData = child.userData.stateData;
          if (stateData && stateData.riskIndex >= 90) {
            const scaleY = 1 + Math.sin(elapsed * 4 + stateData.towerHeight) * 0.04;
            child.scale.set(1, scaleY, 1);
          }
        }
      });

      // Auto-rotation when idle
      if (autoRotate && !controls.isDragging) {
        controls.targetRotationY += 0.002;
      }

      // Smooth camera interpolation
      controls.rotationX += (controls.targetRotationX - controls.rotationX) * 0.1;
      controls.rotationY += (controls.targetRotationY - controls.rotationY) * 0.1;
      controls.distance += (controls.targetDistance - controls.distance) * 0.1;

      // Convert spherical coordinates to Cartesian
      const d = controls.distance;
      const rx = controls.rotationX;
      const ry = controls.rotationY;

      camera.position.x = d * Math.sin(ry) * Math.cos(rx);
      camera.position.y = d * Math.sin(rx);
      camera.position.z = d * Math.cos(ry) * Math.cos(rx);
      camera.lookAt(0, 1.5, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 12. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('click', onClick);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [autoRotate, onSelectState, selectedStateId]);

  // Handle Preset Camera Views
  const setCameraPreset = (preset) => {
    const controls = controlsRef.current;
    if (!controls) return;
    setViewMode(preset);

    if (preset === '3D') {
      controls.targetRotationX = 0.65;
      controls.targetRotationY = 0.2;
      controls.targetDistance = 22;
    } else if (preset === 'TOP') {
      controls.targetRotationX = 1.45;
      controls.targetRotationY = 0.0;
      controls.targetDistance = 24;
    } else if (preset === 'NORTH') {
      controls.targetRotationX = 0.55;
      controls.targetRotationY = 0.1;
      controls.targetDistance = 14;
    } else if (preset === 'SOUTH') {
      controls.targetRotationX = 0.55;
      controls.targetRotationY = 3.14;
      controls.targetDistance = 15;
    }
  };

  const selectedStateObj = INDIA_3D_STATES.find(s => s.id === selectedStateId) || INDIA_3D_STATES[0];

  return (
    <div className="flex-1 relative flex flex-col w-full h-full bg-[#05080E] select-none overflow-hidden">
      
      {/* ── 3D Top Telemetry Header ── */}
      <div className="absolute top-2 left-3 right-3 z-10 flex justify-between items-center pointer-events-none">
        
        {/* Left: Satellite Info */}
        <div className="flex items-center gap-2 bg-[#10141C]/85 px-3 py-1.5 border border-white/[0.1] rounded backdrop-blur-md">
          <Activity className="w-3.5 h-3.5 text-[#00F0A0] animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-white tracking-wider uppercase">
            3D Geospatial Defense Radar • Holographic Threat Grid
          </span>
        </div>

        {/* Right: Camera Presets & Interactive Buttons */}
        <div className="flex items-center gap-1 pointer-events-auto bg-[#10141C]/85 p-1 border border-white/[0.1] rounded backdrop-blur-md">
          <button
            onClick={() => setCameraPreset('3D')}
            className={`px-2 py-1 text-[10px] font-mono font-bold transition-all rounded ${
              viewMode === '3D' ? 'bg-[#00F0A0] text-black' : 'text-[#e4bdba] hover:text-white'
            }`}
          >
            3D ISOMETRIC
          </button>
          <button
            onClick={() => setCameraPreset('TOP')}
            className={`px-2 py-1 text-[10px] font-mono font-bold transition-all rounded ${
              viewMode === 'TOP' ? 'bg-[#00F0A0] text-black' : 'text-[#e4bdba] hover:text-white'
            }`}
          >
            TOP-DOWN (2D)
          </button>
          <button
            onClick={() => setCameraPreset('NORTH')}
            className={`px-2 py-1 text-[10px] font-mono font-bold transition-all rounded ${
              viewMode === 'NORTH' ? 'bg-[#FF4B4B] text-white' : 'text-[#e4bdba] hover:text-white'
            }`}
          >
            NORTH HOTSPOTS
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2 py-1 text-[10px] font-mono font-bold transition-all rounded flex items-center gap-1 ${
              autoRotate ? 'bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]' : 'text-[#e4bdba]'
            }`}
          >
            <Rotate3d className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
            {autoRotate ? 'ORBIT ON' : 'ORBIT OFF'}
          </button>
        </div>
      </div>

      {/* ── Three.js 3D Canvas Mount Point ── */}
      <div ref={containerRef} className="flex-1 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* ── Hovered State 3D Holographic Tooltip ── */}
      {hoveredState && (
        <div className="absolute top-14 left-4 z-20 pointer-events-none bg-[#101726]/95 border border-[#00F0A0]/60 p-3 rounded shadow-2xl backdrop-blur-md animate-in fade-in max-w-[260px]">
          <div className="flex justify-between items-center border-b border-white/[0.1] pb-1.5 mb-1.5">
            <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">{hoveredState.state}</span>
            <span className={`text-[9.5px] px-1.5 py-0.5 font-bold rounded ${
              hoveredState.riskIndex >= 90 ? 'bg-[#FF4B4B]/20 text-[#FF4B4B] border border-[#FF4B4B]' : 'bg-[#FFB800]/20 text-[#FFB800]'
            }`}>
              {hoveredState.riskIndex}% RISK
            </span>
          </div>
          <div className="text-[10px] text-[#e4bdba] space-y-1 font-mono">
            <div>HOTSPOTS: <strong className="text-white">{hoveredState.hotspots}</strong></div>
            <div>ACTIVE MULES: <strong className="text-[#FF4B4B]">{hoveredState.activeThreatNodes} nodes</strong></div>
            <div>24H BLOCKED: <strong className="text-[#00F0A0]">₹{hoveredState.blockedVolumeCr} Cr</strong></div>
            <div className="text-[9px] text-[#00F0A0] pt-1">👉 Click 3D cylinder to lock target</div>
          </div>
        </div>
      )}

      {/* ── Interactive 3D Legend & Controls Hint ── */}
      <div className="absolute bottom-12 right-3 z-10 pointer-events-none flex flex-col gap-1.5 bg-[#10141C]/85 p-2.5 border border-white/[0.1] rounded backdrop-blur-md text-[9.5px] font-mono">
        <div className="text-[#00F0A0] font-bold mb-0.5 uppercase tracking-wider">3D Threat Altitude Scale:</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#FF4B4B] animate-pulse" />
          <span className="text-[#FF4B4B] font-bold">&gt;90% Critical Spike (Jamtara/Mewat)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#FF9500]" />
          <span className="text-[#FF9500]">80-89% High Exposure (Metros)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#00F0A0]" />
          <span className="text-[#00F0A0]">&lt;80% Guarded Regional Grid</span>
        </div>
        <div className="text-[8.5px] text-[#e4bdba]/70 pt-1 border-t border-white/[0.08]">
          🖱️ Drag to Rotate in 3D • Scroll to Zoom
        </div>
      </div>

      {/* ── Bottom Live Jurisdiction Telemetry Bar ── */}
      <div className="absolute bottom-2 left-3 right-3 z-10 flex justify-between items-center text-[10.5px] font-mono text-[#e4bdba] bg-[#10141C]/90 px-3 py-2 border border-white/[0.12] shadow-lg rounded backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00F0A0] animate-pulse" />
          <span>LOCKED 3D TARGET: <strong className="text-[#00F0A0]">{selectedStateObj.vulnerabilityRank} {selectedStateObj.state} ({selectedStateObj.capital})</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <span>THREAT NODES: <strong className="text-white">{selectedStateObj.activeThreatNodes.toLocaleString()}</strong></span>
          <span>24H BLOCKED: <strong className="text-[#FF4B4B]">₹{selectedStateObj.blockedVolumeCr} Cr</strong></span>
        </div>
      </div>
    </div>
  );
}
