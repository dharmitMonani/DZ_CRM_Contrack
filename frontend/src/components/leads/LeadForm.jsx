import React, { useState } from 'react';
import { LEAD_STATUSES, LEAD_PRIORITIES, toInputDate } from '../../utils/constants';
import { Spinner } from '../ui/Loader';

const DEFAULT_FORM = {
  companyName: '',
  contactPerson: '',
  mobileNumber: '',
  city: '',
  approxTurnover: '',
  status: 'New Lead',
  priority: 'Cold',
  promoVideoSent: false,
  brochureSent: false,
  proposalSent: false,
  lastContactDate: '',
  nextFollowupDate: '',
  notes: ''
};

const LeadForm = ({ initialData = {}, onSubmit, loading, submitLabel = 'Save Lead' }) => {
  const [form, setForm] = useState({
    ...DEFAULT_FORM,
    ...initialData,
    lastContactDate: toInputDate(initialData.lastContactDate),
    nextFollowupDate: toInputDate(initialData.nextFollowupDate)
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. ABC Contractors Pvt Ltd"
              required
            />
          </div>
          <div>
            <label className="label">Contact Person *</label>
            <input
              type="text"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Rahul Sharma"
              required
            />
          </div>
          <div>
            <label className="label">Mobile Number *</label>
            <input
              type="tel"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. 9876543210"
              required
            />
          </div>
          <div>
            <label className="label">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Ahmedabad"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Approx. Annual Turnover</label>
            <input
              type="text"
              name="approxTurnover"
              value={form.approxTurnover}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. 2-5 Crore"
            />
          </div>
        </div>
      </div>

      {/* Status & Priority */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Lead Classification</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input-field">
              {LEAD_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
              {LEAD_PRIORITIES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Communication Tracking */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Communication</h3>
        <div className="space-y-3">
          {[
            { name: 'promoVideoSent', label: '🎬 Promo Video Sent' },
            { name: 'brochureSent', label: '📄 Brochure Sent' },
            { name: 'proposalSent', label: '📋 Proposal Sent' }
          ].map(item => (
            <label key={item.name} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name={item.name}
                checked={form[item.name]}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Follow-up Dates */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Follow-up Schedule</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Last Contact Date</label>
            <input
              type="date"
              name="lastContactDate"
              value={form.lastContactDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Next Follow-up Date</label>
            <input
              type="date"
              name="nextFollowupDate"
              value={form.nextFollowupDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Notes</h3>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
          className="input-field resize-none"
          placeholder="e.g. Uses WhatsApp, interested in DPR module, wants demo next week..."
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button type="submit" className="btn-primary flex items-center gap-2 px-6 py-2.5" disabled={loading}>
          {loading && <Spinner size="sm" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
