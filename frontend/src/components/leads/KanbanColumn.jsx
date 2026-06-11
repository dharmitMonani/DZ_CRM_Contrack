import React, { useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ status, leads }) => {
  const leadIds = useMemo(() => leads.map((l) => l._id), [leads]);

  const { setNodeRef } = useDroppable({
    id: status,
    data: {
      type: 'Column',
      status,
    },
  });

  // Determine a color or icon based on status
  const getColumnStyle = (status) => {
    switch (status) {
      case 'New Lead': return 'border-t-4 border-blue-500';
      case 'Interested': return 'border-t-4 border-yellow-500';
      case 'Demo Scheduled': return 'border-t-4 border-purple-500';
      case 'Won': return 'border-t-4 border-green-500';
      case 'Lost': return 'border-t-4 border-red-500';
      default: return 'border-t-4 border-gray-400';
    }
  };

  return (
    <div className={`flex flex-col bg-gray-50 rounded-xl min-w-[280px] w-[280px] max-h-full overflow-hidden shrink-0 ${getColumnStyle(status)}`}>
      <div className="p-3 bg-gray-100 flex justify-between items-center border-b border-gray-200">
        <h3 className="font-semibold text-gray-700 text-sm">{status}</h3>
        <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
          {leads.length}
        </span>
      </div>
      
      <div 
        ref={setNodeRef}
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-[150px]"
      >
        <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <KanbanCard key={lead._id} lead={lead} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
