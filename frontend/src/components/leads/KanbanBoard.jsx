import React, { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';

const COLUMNS = [
  'New Lead',
  'Interested',
  'Demo Scheduled',
  'Won',
  'Lost'
];

const KanbanBoard = ({ leads, onStatusChange }) => {
  const [activeLead, setActiveLead] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px drag distance before firing
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    if (active.data.current?.type === 'Lead') {
      setActiveLead(active.data.current.lead);
    }
  };

  const handleDragEnd = (event) => {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeLeadData = active.data.current?.lead;
    if (!activeLeadData) return;

    let newStatus = activeLeadData.status;

    // Check if dropping over a column
    if (over.data.current?.type === 'Column') {
      newStatus = over.data.current.status;
    } 
    // Check if dropping over another lead
    else if (over.data.current?.type === 'Lead') {
      newStatus = over.data.current.lead.status;
    }

    if (newStatus && newStatus !== activeLeadData.status) {
      if (COLUMNS.includes(newStatus)) {
        onStatusChange(activeId, newStatus, activeLeadData.status);
      }
    }
  };

  return (
    <div className="flex overflow-x-auto pb-4 h-[calc(100vh-220px)] min-h-[500px]">
      <div className="flex gap-4 h-full px-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {COLUMNS.map((colStatus) => (
            <KanbanColumn
              key={colStatus}
              status={colStatus}
              leads={leads.filter((l) => l.status === colStatus)}
            />
          ))}

          <DragOverlay>
            {activeLead ? <KanbanCard lead={activeLead} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
