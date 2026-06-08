import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { formatDate, isOverdue } from '../../utils/constants';
import { leadsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const FollowUpCard = ({ lead, onRefresh }) => {
  const navigate = useNavigate();
  const overdue = isOverdue(lead.nextFollowupDate) && lead.nextFollowupDate;

  const markContacted = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await leadsAPI.update(lead._id, {
        status: 'Contacted',
        lastContactDate: today
      });
      toast.success('Marked as contacted');
      onRefresh();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className={`card p-4 border-l-4 ${overdue ? 'border-l-red-400' : 'border-l-brand-400'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{lead.companyName}</h4>
          <p className="text-sm text-gray-600 truncate">{lead.contactPerson}</p>
          <a
            href={`tel:${lead.mobileNumber}`}
            className="text-sm text-brand-600 font-medium hover:underline"
          >
            📞 {lead.mobileNumber}
          </a>
        </div>
        <div className="flex flex-col gap-1 items-end shrink-0">
          <StatusBadge status={lead.status} />
          <PriorityBadge priority={lead.priority} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className={`text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
          {overdue ? '⚠️ Overdue: ' : '📅 '}
          {formatDate(lead.nextFollowupDate)}
        </span>
      </div>

      {lead.notes && (
        <p className="mt-2 text-xs text-gray-500 italic truncate">"{lead.notes}"</p>
      )}

      <div className="mt-3 flex gap-2">
        <a
          href={`tel:${lead.mobileNumber}`}
          className="flex-1 text-center py-1.5 text-xs font-medium rounded-lg bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-colors"
        >
          📞 Call
        </a>
        <button
          onClick={() => navigate(`/leads/${lead._id}/edit`)}
          className="flex-1 text-center py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
        >
          ✏️ Edit
        </button>
        <button
          onClick={markContacted}
          className="flex-1 text-center py-1.5 text-xs font-medium rounded-lg bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100 transition-colors"
        >
          ✅ Done
        </button>
      </div>
    </div>
  );
};

export default FollowUpCard;
