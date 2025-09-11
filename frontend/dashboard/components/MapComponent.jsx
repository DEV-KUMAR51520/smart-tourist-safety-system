"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Dynamic imports for client-side only libraries
let L;
let markerClusterGroup;
let heatLayer;

// Initialize Leaflet only on client-side
if (typeof window !== 'undefined') {
  L = require('leaflet');
  require('leaflet.markercluster');
  require('leaflet.heat');
  // Fix icon paths for Leaflet
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

export default function MapComponent({ tourists = [], onTouristClick = () => {}, showHeatmap = false }) {
  const mapRef = useRef(null);
  const clusterRef = useRef(null);
  const heatmapLayerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [mapMode, setMapMode] = useState("markers"); // "markers" or "heatmap"

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
        await loadScript("https://unpkg.com/leaflet.heat/dist/leaflet-heat.js");
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
        
        // Initialize heatmap layer (empty at first)
        heatmapLayerRef.current = window.L.heatLayer([], {
          radius: 25,
          blur: 15,
          maxZoom: 17,
          gradient: {
            0.0: 'green',
            0.5: 'yellow',
            0.8: 'orange',
            1.0: 'red'
          }
        });
        
        // Add map controls for switching between marker and heatmap views
        const mapModeControl = window.L.control({ position: 'topright' });
        mapModeControl.onAdd = function() {
          const div = window.L.DomUtil.create('div', 'leaflet-bar leaflet-control');
          div.innerHTML = `
            <div class="flex bg-white rounded-md shadow-md overflow-hidden">
              <button id="marker-mode-btn" class="px-3 py-2 text-xs font-medium ${mapMode === 'markers' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}">Markers</button>
              <button id="heatmap-mode-btn" class="px-3 py-2 text-xs font-medium ${mapMode === 'heatmap' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}">Heatmap</button>
            </div>
          `;
          
          // Prevent map click events from propagating through the control
          window.L.DomEvent.disableClickPropagation(div);
          
          // Add event listeners after the div is added to the DOM
          setTimeout(() => {
            const markerBtn = document.getElementById('marker-mode-btn');
            const heatmapBtn = document.getElementById('heatmap-mode-btn');
            
            if (markerBtn && heatmapBtn) {
              markerBtn.addEventListener('click', () => {
                setMapMode('markers');
                markerBtn.classList.add('bg-blue-500', 'text-white');
                markerBtn.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-100');
                heatmapBtn.classList.remove('bg-blue-500', 'text-white');
                heatmapBtn.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-100');
              });
              
              heatmapBtn.addEventListener('click', () => {
                setMapMode('heatmap');
                heatmapBtn.classList.add('bg-blue-500', 'text-white');
                heatmapBtn.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-100');
                markerBtn.classList.remove('bg-blue-500', 'text-white');
                markerBtn.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-100');
              });
            }
          }, 0);
          
          return div;
        };
        mapModeControl.addTo(map);

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
    if (!window.L || !mapRef.current || !clusterRef.current || !heatmapLayerRef.current) return;

    const map = mapRef.current;
    const cluster = clusterRef.current;
    const heatmapLayer = heatmapLayerRef.current;
    
    // Clear previous layers
    cluster.clearLayers();
    if (map.hasLayer(heatmapLayer)) {
      map.removeLayer(heatmapLayer);
    }
    
    // Add markers to cluster
    tourists.forEach(t => {
      const markerClass = t.status === "critical" ? "bg-red-500" : t.status === "warning" ? "bg-yellow-500" : "bg-green-500";
      const iconHtml = `<div class="p-2 rounded-full shadow-lg border-2 border-white text-white ${markerClass} flex items-center justify-center font-bold text-sm h-10 w-10 ${t.status === 'critical' ? 'animate-pulse' : ''}">${t.name[0]}</div>`;
      const markerIcon = window.L.divIcon({ html: iconHtml, className: "bg-transparent", iconSize: [40, 40], iconAnchor: [20, 40] });

      const marker = window.L.marker([t.lat, t.lng], { icon: markerIcon })
        .bindPopup(`<b>${t.name}</b><br>Status: <span class="font-semibold text-${markerClass.substring(3, 8)}">${t.status}</span>`);

      marker.on("click", () => onTouristClick(t));
      cluster.addLayer(marker);
    });
    
    // Prepare heatmap data
    const heatmapData = tourists.map(t => {
      // Intensity based on status: critical = 1.0, warning = 0.7, safe = 0.3
      const intensity = t.status === "critical" ? 1.0 : t.status === "warning" ? 0.7 : 0.3;
      return [t.lat, t.lng, intensity];
    });
    
    // Update heatmap layer with new data
    heatmapLayerRef.current = window.L.heatLayer(heatmapData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.0: 'green',
        0.5: 'yellow',
        0.8: 'orange',
        1.0: 'red'
      }
    });
    
    // Show appropriate layer based on map mode
    if (mapMode === 'markers') {
      map.addLayer(cluster);
      if (map.hasLayer(heatmapLayerRef.current)) {
        map.removeLayer(heatmapLayerRef.current);
      }
    } else {
      map.addLayer(heatmapLayerRef.current);
      if (map.hasLayer(cluster)) {
        map.removeLayer(cluster);
      }
    }
    
    if (tourists.length) {
      const latLngs = tourists.map(t => window.L.latLng(t.lat, t.lng));
      map.fitBounds(window.L.latLngBounds(latLngs), { padding: [32, 32] });
    }

  }, [tourists, onTouristClick, mapMode]);

  return (
    <div className="flex flex-col w-full h-full">
      <div id="map" ref={mapContainerRef} className="w-full h-96 rounded-lg shadow-xl" />
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {mapMode === 'heatmap' ? 
          'Heat map shows tourist density and risk levels. Red areas indicate higher risk or concentration.' : 
          'Markers show individual tourist locations. Red = Critical, Yellow = Warning, Green = Safe.'}
      </div>
    </div>
  );
}
