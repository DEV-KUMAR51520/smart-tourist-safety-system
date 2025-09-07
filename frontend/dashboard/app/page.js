"use client";

import React, { useState, useEffect, useRef } from "react";

// Icons (SVG inline)
const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
    <path d="M2 12h20"></path>
  </svg>
);
const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-red-500">
    <path d="m21.73 18-9-16a2 2 0 0 0-3.46 0l-9 16a2 2 0 0 0 1.73 3H20a2 2 0 0 0 1.73-3Z"></path>
    <path d="M12 9v4"></path>
    <path d="M12 17h.01"></path>
  </svg>
);
const UserCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-500">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="m16 11 2 2 4-4"></path>
  </svg>
);
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-yellow-500">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2"></path>
    <path d="M12 20v2"></path>
    <path d="M4.93 4.93l1.42 1.42"></path>
    <path d="M17.65 17.65l1.42 1.42"></path>
    <path d="M2 12h2"></path>
    <path d="M20 12h2"></path>
    <path d="M4.93 19.07l1.42-1.42"></path>
    <path d="M17.65 6.35l1.42-1.42"></path>
  </svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-500">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
  </svg>
);

// Mocked Data
const mockTouristData = [
  { id: 'tourist-001', name: 'Joe Bloggs', lat: 28.6139, lng: 77.2090, status: 'safe' },
  { id: 'tourist-002', name: 'Jane Doe', lat: 28.5833, lng: 77.1990, status: 'safe' },
  { id: 'tourist-003', name: 'John Smith', lat: 28.6089, lng: 77.2130, status: 'warning' },
  { id: 'tourist-004', name: 'Alice Williams', lat: 28.625, lng: 77.185, status: 'safe' },
  { id: 'tourist-005', name: 'Bob Johnson', lat: 28.59, lng: 77.25, status: 'critical' },
];

const mockIncidentData = [
  { id: 'inc-001', touristId: 'tourist-003', type: 'High-risk location detected', timestamp: '2025-09-07T10:00:00Z', status: 'pending' },
  { id: 'inc-002', touristId: 'tourist-005', type: 'Panic button activated', timestamp: '2025-09-07T11:45:00Z', status: 'unassigned' },
  { id: 'inc-003', touristId: 'tourist-001', type: 'Band sensor anomaly', timestamp: '2025-09-07T11:48:00Z', status: 'resolved' },
];

const mockStats = {
  totalTourists: 5,
  activeIncidents: 2,
  incidentsResolvedToday: 1,
};


function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    
    setDark(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return [dark, setDark];
}

// Map Component
const MapComponent = ({ tourists = [], onTouristClick = () => {} }) => {
  const mapRef = useRef(null);
  const clusterRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

    const loadCSS = (href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };

    let cleanupFunction = () => {};

    (async () => {
      try {
        await loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");
        await loadScript("https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js");

        loadCSS("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
        loadCSS("https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css");
        loadCSS("https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css");

        if (mapRef.current) {
          mapRef.current.remove();
        }

        const map = window.L.map(mapContainerRef.current, { preferCanvas: true }).setView([28.6139, 77.2090], 13);
        mapRef.current = map;

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        clusterRef.current = window.L.markerClusterGroup();
        map.addLayer(clusterRef.current);

        cleanupFunction = () => {
          mapRef.current?.remove();
          mapRef.current = null;
          clusterRef.current = null;
        };
      } catch (error) {
        console.error("Failed to load map resources:", error);
      }
    })();

    return cleanupFunction;
  }, []);

  useEffect(() => {
    if (!window.L || !mapRef.current || !clusterRef.current) return;

    const map = mapRef.current;
    const cluster = clusterRef.current;
    cluster.clearLayers();

    tourists.forEach(t => {
      const markerClass = t.status === "critical" ? "bg-red-500" : t.status === "warning" ? "bg-yellow-500" : "bg-green-500";
      const iconHtml = `<div class="p-2 rounded-full shadow-lg border-2 border-white text-white ${markerClass} flex items-center justify-center font-bold text-sm h-10 w-10 ${t.status === 'critical' ? 'animate-pulse' : ''}">${t.name[0]}</div>`;
      const markerIcon = window.L.divIcon({ html: iconHtml, className: "bg-transparent", iconSize: [40, 40], iconAnchor: [20, 40] });

      const marker = window.L.marker([t.lat, t.lng], { icon: markerIcon })
        .bindPopup(`<b>${t.name}</b><br>Status: <span class="font-semibold text-${markerClass.substring(3, 8)}">${t.status}</span>`);

      marker.on("click", () => onTouristClick(t));
      cluster.addLayer(marker);
    });
    
    if (tourists.length) {
      const latLngs = tourists.map(t => window.L.latLng(t.lat, t.lng));
      map.fitBounds(window.L.latLngBounds(latLngs), { padding: [32, 32] });
    }

  }, [tourists, onTouristClick]);

  return <div id="map" ref={mapContainerRef} className="w-full h-96 rounded-lg shadow-xl" />;
};


const DashboardCard = ({ title, value, icon, className = "" }) => (
  <div className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 transition hover:scale-105 ${className}`}>
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  </div>
);

const IncidentAlert = ({ incident, onAcknowledge, onResolve }) => {
  const isCritical = incident.type.includes("Panic");
  const alertClass = isCritical ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800" : "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
  const buttonClass = isCritical ? "bg-red-600 hover:bg-red-700" : "bg-yellow-600 hover:bg-yellow-700";

  return (
    <div className={`p-4 rounded-lg border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0 ${alertClass}`}>
      <div className="flex items-center space-x-3 flex-1">
        <AlertTriangleIcon className={isCritical ? "text-red-500" : "text-yellow-500"} />
        <div>
          <p className={`font-semibold ${isCritical ? "text-red-800 dark:text-red-200" : "text-yellow-800 dark:text-yellow-200"}`}>{incident.type}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Tourist ID: {incident.touristId}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-2 md:mt-0">
        {incident.status === "unassigned" && (
          <button onClick={() => onAcknowledge(incident.id)} className={`px-3 py-1 text-sm font-medium text-white rounded-lg transition-colors ${buttonClass}`}>
            Acknowledge
          </button>
        )}
        {incident.status === "pending" && (
          <button onClick={() => onResolve(incident.id)} className="px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
            Resolve
          </button>
        )}
        {incident.status === "resolved" && (
          <span className="text-sm text-gray-500 dark:text-gray-400">Resolved</span>
        )}
      </div>
    </div>
  );
};

const IncidentBarChart = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Incidents by Type</h3>
      <div className="flex flex-col space-y-4">
        {data.map((d, index) => (
          <div key={index} className="flex items-center space-x-4">
            <span className="w-24 text-sm text-gray-500 dark:text-gray-400 truncate">{d.name}</span>
            <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(d.value / maxVal) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Modal = ({ show, title, children, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-xl mx-4 transform transition-all scale-100 duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default function App() {
  const [tourists, setTourists] = useState(mockTouristData);
  const [incidents, setIncidents] = useState(mockIncidentData);
  const [stats, setStats] = useState(mockStats);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [darkTheme, setDarkTheme] = useTheme();

  const incidentTypesData = [
    { name: 'Panic Button', value: incidents.filter(i => i.type.includes('Panic')).length },
    { name: 'Location Risk', value: incidents.filter(i => i.type.includes('location')).length },
    { name: 'Band Anomaly', value: incidents.filter(i => i.type.includes('Band')).length },
    { name: 'Geofence Breach', value: 0 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newIncident = {
        id: `inc-${Math.random().toString(36).substring(2, 9)}`,
        touristId: mockTouristData[Math.floor(Math.random() * mockTouristData.length)].id,
        type: Math.random() > 0.5 ? 'High-risk location detected' : 'Band sensor anomaly',
        timestamp: new Date().toISOString(),
        status: 'unassigned'
      };
      setIncidents(prev => [newIncident, ...prev].slice(0, 5));
      setStats(prev => ({
        ...prev,
        activeIncidents: prev.activeIncidents + 1,
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = (id) => {
    setIncidents(incidents.map(inc => inc.id === id ? { ...inc, status: 'pending' } : inc));
  };

  const handleResolve = (id) => {
    setIncidents(incidents.filter(inc => inc.id !== id));
    setStats(prev => ({
      ...prev,
      activeIncidents: prev.activeIncidents - 1,
      incidentsResolvedToday: prev.incidentsResolvedToday + 1
    }));
  };

  const handleMapClick = (tourist) => {
    const incident = incidents.find(inc => inc.touristId === tourist.id);
    if (incident) {
      setSelectedIncident(incident);
      setShowIncidentModal(true);
    } else {
      setSelectedIncident({
        id: 'n/a',
        touristId: tourist.id,
        type: 'No active incidents',
        timestamp: new Date().toISOString(),
        status: 'safe'
      });
      setShowIncidentModal(true);
    }
  };

  return (
    <>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 p-6 font-sans antialiased text-gray-900 dark:text-white transition-colors`}>
        <header className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <GlobeIcon />
            <h1 className="text-3xl font-extrabold tracking-tight">Tourist Safety Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {new Date().toLocaleString()}
            </span>
            <button onClick={() => setDarkTheme(!darkTheme)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              {darkTheme ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </header>

        <main className="grid grid-cols-12 gap-6">
          <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard title="Total Tourists" value={stats.totalTourists} icon={<GlobeIcon />} />
              <DashboardCard title="Active Incidents" value={stats.activeIncidents} icon={<AlertTriangleIcon />} className="bg-red-50 dark:bg-red-950" />
              <DashboardCard title="Incidents Resolved" value={stats.incidentsResolvedToday} icon={<UserCheckIcon />} className="bg-green-50 dark:bg-green-950" />
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
              <MapComponent tourists={tourists} onTouristClick={handleMapClick} />
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Live Alerts ({incidents.length})</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {incidents.length > 0 ? incidents.map(incident => (
                  <IncidentAlert
                    key={incident.id}
                    incident={incident}
                    onAcknowledge={handleAcknowledge}
                    onResolve={handleResolve}
                  />
                )) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No active incidents.</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">System Health & Analytics</h2>
              <IncidentBarChart data={incidentTypesData} />
            </div>
          </aside>
        </main>
      </div>

      <Modal
        show={showIncidentModal}
        title="Incident Details"
        onClose={() => setShowIncidentModal(false)}
      >
        {selectedIncident && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Incident ID: <span className="font-mono">{selectedIncident.id}</span></p>
            <p className="text-lg font-semibold">Type: {selectedIncident.type}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tourist ID: <span className="font-mono">{selectedIncident.touristId}</span></p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Timestamp: {new Date(selectedIncident.timestamp).toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status: <span className={`font-semibold ${selectedIncident.status === 'unassigned' ? 'text-red-500' : selectedIncident.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>{selectedIncident.status}</span></p>
          </div>
        )}
      </Modal>
    </>
  );
}
