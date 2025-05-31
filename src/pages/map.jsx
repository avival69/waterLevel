import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { damLevels, damCoordinates } from '../DamData';
import axios from 'axios';

function getColor(level) {
  const hue = (1 - level / 100) * 120;
  return `hsl(${hue}, 100%, 50%)`;
}

function createLevelIcon(level, zoom = 8) {
  const scale = Math.min(Math.max((zoom - 5) / 5, 0.7), 1);
  const size = 44 * scale;
  const strokeWidth = 5 * scale;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - level / 100);
  const padding = 3 * scale;
  const containerSize = size + padding * 2;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size/2}" cy="${size/2}" r="${radius}" stroke="#e5e7eb" stroke-width="${strokeWidth}" fill="none" />
      <circle cx="${size/2}" cy="${size/2}" r="${radius}" stroke="${getColor(level)}" stroke-width="${strokeWidth}" fill="none"
        stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="${11 * scale}" font-weight="bold" fill="#374151">
        ${level}%
      </text>
    </svg>
  `;

  const html = `
    <div style="
      width: ${containerSize}px;
      height: ${containerSize}px;
      background: white;
      border-radius: 50%;
      padding: ${padding}px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      ${svg}
    </div>
  `;

  return L.divIcon({
    className: '',
    html,
    iconSize: [containerSize, containerSize],
    iconAnchor: [containerSize / 2, containerSize / 2],
    popupAnchor: [0, -containerSize / 2 - 5],
  });
}

function MapMarkers({ zoom }) {
  return (
    <>
      {Object.entries(damCoordinates).map(([name, coords]) => {
        const level = damLevels[name] || 0;
        return (
          <Marker
            key={name}
            position={[coords.latitude, coords.longitude]}
            icon={createLevelIcon(level, zoom)}
          >
            <Popup className="text-sm">
              <h3 className="text-base font-semibold mb-1">{name}</h3>
              <p>Water Level: <strong>{level}%</strong></p>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

function ZoomAwareMarkers() {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const handleZoom = () => setZoom(map.getZoom());
    map.on('zoomend', handleZoom);
    return () => map.off('zoomend', handleZoom);
  }, [map]);

  return <MapMarkers zoom={zoom} />;
}

export default function MapView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCurrent, setIsCurrent] = useState(true);
  const [latestDate, setLatestDate] = useState('');

  // Build “today” as DD.MM.YYYY (with leading zero)
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const today = `${dd}.${mm}.${yyyy}`;

  useEffect(() => {
    axios.get('http://localhost:3000/api').then((res) => {
      const apidata = res.data;
      setData(apidata);
      setLoading(false);

      if (apidata.length > 0) {
        const mostRecentDate = apidata[0].date; // e.g. "31.05.2025"
        setLatestDate(mostRecentDate);
        setIsCurrent(mostRecentDate === today);
      }
    });
  }, [today]);

  // if (loading) {
  //   return (
  //     <div className="flex h-screen w-full items-center justify-center">
  //       <p className="text-gray-700">Loading map data…</p>
  //     </div>
  //   );
  // }

  return (
    <div className="relative h-screen w-full">
      <div className="absolute top-4 right-4 z-[1000] flex items-center whitespace-nowrap rounded-lg bg-white border border-gray-300 px-4 py-2 shadow-sm">
        <span className={`inline-block h-2 w-2 rounded-full mr-2 ${isCurrent ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm font-medium text-gray-800">
          Last Updated {latestDate}
        </span>
      </div>

      <MapContainer center={[10.5, 76.5]} zoom={8} className="h-full w-full">
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomAwareMarkers />
      </MapContainer>
    </div>
  );
}
