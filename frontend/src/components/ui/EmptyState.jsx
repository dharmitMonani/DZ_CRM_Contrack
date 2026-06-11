import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ icon, title, description, actionLabel, actionTo }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="text-5xl mb-4">{icon || '📋'}</div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs mb-6">{description}</p>
    {actionLabel && actionTo && (
      <Link to={actionTo} className="btn-primary text-sm">
        {actionLabel}
      </Link>
    )}
  </div>
);

export default EmptyState;
