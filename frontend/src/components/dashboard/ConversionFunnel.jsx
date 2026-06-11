import React from 'react';

const ConversionFunnel = ({ stats }) => {
  const newLeads = stats?.newLeads || 0;
  const interested = stats?.interestedLeads || 0;
  const demoScheduled = stats?.demoScheduled || 0;
  const won = stats?.wonDeals || 0;

  const maxVal = Math.max(newLeads, interested, demoScheduled, won, 1); // Avoid division by zero

  const steps = [
    { label: 'New Lead', value: newLeads, color: 'bg-blue-500' },
    { label: 'Interested', value: interested, color: 'bg-purple-500' },
    { label: 'Demo Scheduled', value: demoScheduled, color: 'bg-yellow-500' },
    { label: 'Won', value: won, color: 'bg-green-500' }
  ];

  return (
    <div className="w-full py-4">
      <div className="flex flex-col items-center space-y-2">
        {steps.map((step, index) => {
          // Calculate width relative to the maximum value, but ensure a minimum width so it looks like a funnel
          const minWidth = 100 - (index * 20); // 100%, 80%, 60%, 40%
          const actualWidth = Math.max((step.value / maxVal) * 100, minWidth);

          return (
            <div 
              key={step.label} 
              className={`relative flex items-center justify-center text-white font-medium text-sm rounded-md shadow-sm transition-all duration-500 ${step.color}`}
              style={{ width: `${actualWidth}%`, height: '40px' }}
            >
              <div className="flex items-center justify-between w-full px-4">
                <span className="truncate">{step.label}</span>
                <span className="font-bold">{step.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversionFunnel;
