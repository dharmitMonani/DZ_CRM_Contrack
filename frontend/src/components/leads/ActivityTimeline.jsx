import React from 'react';
import { timeAgo, formatDate } from '../../utils/constants';

// ── Action type configuration ─────────────────────────────────────────────────
const ACTION_CONFIG = {
  'Lead Created': {
    dot:   'bg-green-500',
    ring:  'ring-green-100 dark:ring-green-900',
    label: 'text-green-700 dark:text-green-400',
    icon:  '✦'
  },
  'Status Changed': {
    dot:   'bg-blue-500',
    ring:  'ring-blue-100 dark:ring-blue-900',
    label: 'text-blue-700 dark:text-blue-400',
    icon:  '⇄'
  },
  'Priority Changed': {
    dot:   'bg-orange-500',
    ring:  'ring-orange-100 dark:ring-orange-900',
    label: 'text-orange-700 dark:text-orange-400',
    icon:  '↑'
  },
  'Follow-up Rescheduled': {
    dot:   'bg-purple-500',
    ring:  'ring-purple-100 dark:ring-purple-900',
    label: 'text-purple-700 dark:text-purple-400',
    icon:  '⏰'
  },
  'Lead Updated': {
    dot:   'bg-gray-400',
    ring:  'ring-gray-100 dark:ring-slate-700',
    label: 'text-gray-600 dark:text-slate-400',
    icon:  '✎'
  },
  'Source Changed': {
    dot:   'bg-indigo-500',
    ring:  'ring-indigo-100 dark:ring-indigo-900',
    label: 'text-indigo-700 dark:text-indigo-400',
    icon:  '🔗'
  }
};

const DEFAULT_CONFIG = ACTION_CONFIG['Lead Updated'];

// ── Component ─────────────────────────────────────────────────────────────────
const ActivityTimeline = ({ timeline = [] }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <span className="text-3xl">📋</span>
        <p className="text-sm text-gray-400 dark:text-slate-500">No activity recorded yet.</p>
      </div>
    );
  }

  // Newest first
  const sorted = [...timeline].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <ul className="space-y-0">
      {sorted.map((entry, index) => {
        const config = ACTION_CONFIG[entry.action] || DEFAULT_CONFIG;
        const isLast = index === sorted.length - 1;

        return (
          <li key={entry._id || index} className="relative flex gap-4">
            {/* ── Vertical connector line ── */}
            {!isLast && (
              <div
                className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-100 dark:bg-slate-700"
                aria-hidden="true"
              />
            )}

            {/* ── Dot ── */}
            <div className="relative flex-shrink-0 mt-0.5">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${config.dot} ring-4 ${config.ring}
                `}
              >
                <span className="text-white text-[11px] font-bold leading-none select-none">
                  {config.icon}
                </span>
              </div>
            </div>

            {/* ── Content ── */}
            <div className={`flex-1 min-w-0 ${!isLast ? 'pb-6' : 'pb-1'}`}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <p className={`text-sm font-semibold ${config.label}`}>
                  {entry.action}
                </p>
                <span
                  className="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap tabular-nums"
                  title={formatDate(entry.createdAt)}
                >
                  {timeAgo(entry.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                {entry.description}
              </p>
              {entry.performedBy?.name && (
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                  by{' '}
                  <span className="font-medium text-gray-500 dark:text-slate-400">
                    {entry.performedBy.name}
                  </span>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ActivityTimeline;
