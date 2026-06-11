import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PriorityBadge } from '../ui/Badge';
import { formatDate } from '../../utils/constants';

const KanbanCard = ({ lead }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead._id,
    data: {
      type: 'Lead',
      lead,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 border-2 border-dashed border-brand-400 bg-brand-50 dark:bg-brand-950 rounded-lg p-4 min-h-[120px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg p-3 shadow-sm hover:shadow-md dark:shadow-slate-900/50 dark:hover:shadow-slate-900 transition-shadow cursor-grab active:cursor-grabbing mb-3"
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-sm truncate">
          {lead.companyName}
        </h4>
        <div className="shrink-0">
          <PriorityBadge priority={lead.priority} />
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-slate-300 truncate mb-1">
        {lead.contactPerson}
      </p>

      {lead.city && (
        <p className="text-xs text-gray-500 dark:text-slate-400 truncate mb-2">
          📍 {lead.city}
        </p>
      )}

      {lead.nextFollowupDate && (
        <div className={`text-xs mt-2 pt-2 border-t border-gray-100 dark:border-slate-700 ${
          new Date(lead.nextFollowupDate) < new Date() ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-slate-400'
        }`}>
          📅 {formatDate(lead.nextFollowupDate)}
        </div>
      )}
    </div>
  );
};

export default KanbanCard;
