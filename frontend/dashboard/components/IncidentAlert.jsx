import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function IncidentAlert({ incident, onAcknowledge, onResolve }) {
  const isCritical = incident.type.includes("Panic");
  const alertClass = isCritical ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800" : "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
  const buttonClass = isCritical ? "bg-red-600 hover:bg-red-700" : "bg-yellow-600 hover:bg-yellow-700";

  return (
    <div className={`p-4 rounded-lg border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0 ${alertClass}`}>
      <div className="flex items-center space-x-3 flex-1">
        <AlertTriangle className={isCritical ? "text-red-500" : "text-yellow-500"} />
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
}
