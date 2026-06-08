import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import LeadForm from '../components/leads/LeadForm';
import toast from 'react-hot-toast';

const AddLeadPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await leadsAPI.create(formData);
      toast.success('Lead added successfully!');
      navigate(`/leads/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add lead');
    } finally {
      setLoading(false);
    }
  };

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
          <span className="text-gray-700 font-medium">Add New Lead</span>
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Lead</h1>
            <p className="text-sm text-gray-500 mt-0.5">Fill in the contractor details below</p>
          </div>
          <Link
            to="/leads"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Leads
          </Link>
        </div>
      </div>

      <LeadForm onSubmit={handleSubmit} loading={loading} submitLabel="Add Lead" />
    </div>
  );
};

export default AddLeadPage;