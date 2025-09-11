import React from 'react';

export default function IncidentBarChart({ data }) {
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
}
