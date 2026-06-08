import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import LeadForm from '../components/leads/LeadForm';
import { SectionLoader } from '../components/ui/Loader';
import toast from 'react-hot-toast';

const EditLeadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    leadsAPI.getOne(id)
      .then(res => setLead(res.data.data))
      .catch(() => toast.error('Lead not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      await leadsAPI.update(id, formData);
      toast.success('Lead updated!');
      navigate(`/leads/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update lead');
    } finally {
      setSaving(false);
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
          <Link to="/leads" className="hover:text-brand-600 transition-colors">
            All Leads
          </Link>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to={`/leads/${id}`} className="hover:text-brand-600 transition-colors truncate max-w-[160px]">
            {lead.companyName}
          </Link>
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-700 font-medium">Edit</span>
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Lead</h1>
            <p className="text-sm text-gray-500 mt-0.5 truncate max-w-xs">{lead.companyName}</p>
          </div>
          <Link
            to={`/leads/${id}`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Lead
          </Link>
        </div>
      </div>

      <LeadForm
        initialData={lead}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditLeadPage;