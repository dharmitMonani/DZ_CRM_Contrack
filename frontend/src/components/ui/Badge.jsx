import React from 'react';
import { STATUS_COLORS, PRIORITY_COLORS, PRIORITY_EMOJI } from '../../utils/constants';

export const StatusBadge = ({ status }) => {
  const color = STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const color = PRIORITY_COLORS[priority] || 'bg-gray-100 text-gray-600';
  const emoji = PRIORITY_EMOJI[priority] || '';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <span>{emoji}</span>
      {priority}
    </span>
  );
};
