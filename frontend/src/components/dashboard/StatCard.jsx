import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon, color, to }) => {
  const colorMap = {
    blue:   'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    red:    'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
    green:  'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
    yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
    gray:   'bg-gray-50 text-gray-600 dark:bg-slate-700 dark:text-slate-300'
  };
  const iconBg = colorMap[color] || colorMap.gray;

  const content = (
    <div className="card p-4 flex items-center gap-4 hover:shadow-card-hover transition-shadow duration-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${iconBg} shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{value}</p>
        <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  return content;
};

export default StatCard;
