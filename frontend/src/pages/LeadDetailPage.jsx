import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { SectionLoader } from '../components/ui/Loader';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { formatDate } from '../utils/constants';
import toast from 'react-hot-toast';

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-500 sm:w-40 shrink-0">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value || '—'}</span>
  </div>
);

const Check = ({ checked, label }) => (
  <div className="flex items-center gap-2 py-1.5">
    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${checked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
      {checked ? '✓' : '○'}
    </span>
    <span className={`text-sm ${checked ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
  </div>
);

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    leadsAPI.getOne(id)
      .then(res => setLead(res.data.data))
      .catch(() => toast.error('Lead not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(false);
    try {
      await leadsAPI.delete(id);
      toast.success('Lead deleted');
      navigate('/leads');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <SectionLoader />;
  if (!lead) return (
    <div className="text-center py-16">
      <p className="text-gray-500">Lead not found.</p>
      <Link to="/leads" className="text-brand-600 text-sm mt-2 inline-block">← Back to Leads</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
<div className="space-y-4">
  {/* Breadcrumb */}
  <div className="flex items-center gap-2 text-sm text-gray-500">
    <Link
      to="/leads"
      className="hover:text-brand-600 transition-colors"
    >
      All Leads
    </Link>

    <span>›</span>

    <span className="text-gray-700 font-medium">
      {lead.companyName}
    </span>
  </div>

  {/* Title Row */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        {lead.companyName}
      </h1>

      <p className="text-gray-500 mt-1">
        {lead.contactPerson}
      </p>
    </div>

    <div className="flex items-center gap-2">
      <Link
        to="/leads"
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        ← Back to Leads
      </Link>

      <Link
        to={`/leads/${id}/edit`}
        className="btn-secondary text-sm"
      >
        ✏️ Edit
      </Link>

      <button
        onClick={() => setDeleting(true)}
        className="btn-danger text-sm"
      >
        Delete
      </button>
    </div>
  </div>
</div>

      {/* Status & Priority */}
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <StatusBadge status={lead.status} />
        <PriorityBadge priority={lead.priority} />
        <div className="ml-auto">
          <a
            href={`tel:${lead.mobileNumber}`}
            className="btn-primary text-sm flex items-center gap-1"
          >
            📞 Call Now
          </a>
        </div>
      </div>

      {/* Contact Info */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Contact Details</h3>
        <InfoRow label="Company" value={lead.companyName} />
        <InfoRow label="Contact Person" value={lead.contactPerson} />
        <InfoRow label="Mobile" value={
          <a href={`tel:${lead.mobileNumber}`} className="text-brand-600 hover:underline">
            {lead.mobileNumber}
          </a>
        } />
        <InfoRow label="City" value={lead.city} />
        <InfoRow label="Approx. Turnover" value={lead.approxTurnover} />
      </div>

      {/* Communication */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Communication</h3>
        <Check checked={lead.promoVideoSent} label="Promo Video Sent" />
        <Check checked={lead.brochureSent} label="Brochure Sent" />
        <Check checked={lead.proposalSent} label="Proposal Sent" />
      </div>

      {/* Follow-up */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Follow-up Schedule</h3>
        <InfoRow label="Last Contact" value={formatDate(lead.lastContactDate)} />
        <InfoRow
          label="Next Follow-up"
          value={
            lead.nextFollowupDate ? (
              <span className={new Date(lead.nextFollowupDate) < new Date() ? 'text-red-600' : ''}>
                {formatDate(lead.nextFollowupDate)}
                {new Date(lead.nextFollowupDate) < new Date() && ' ⚠️ Overdue'}
              </span>
            ) : '—'
          }
        />
      </div>

      {/* Notes */}
      {lead.notes && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Notes</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{lead.notes}</p>
        </div>
      )}

      {/* Meta */}
      <div className="card p-4">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Created: {formatDate(lead.createdAt)}</span>
          <span>Updated: {formatDate(lead.updatedAt)}</span>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleting}
        title="Delete Lead"
        message={`Delete "${lead.companyName}"? This cannot be undone.`}
        confirmText="Delete"
        confirmClass="btn-danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(false)}
      />
    </div>
  );
};

export default LeadDetailPage;
