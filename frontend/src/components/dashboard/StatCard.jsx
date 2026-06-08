import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon, color, to }) => {
  const colorMap = {
    blue:   'bg-blue-50 text-blue-600',
    red:    'bg-red-50 text-red-600',
    green:  'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    gray:   'bg-gray-50 text-gray-600'
  };
  const iconBg = colorMap[color] || colorMap.gray;

  const content = (
    <div className="card p-4 flex items-center gap-4 hover:shadow-card-hover transition-shadow duration-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${iconBg} shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  return content;
};

export default StatCard;
