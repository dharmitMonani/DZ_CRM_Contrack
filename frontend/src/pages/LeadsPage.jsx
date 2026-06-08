import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { SectionLoader } from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { LEAD_STATUSES, LEAD_PRIORITIES, formatDate } from '../utils/constants';
import toast from 'react-hot-toast';

const LIMIT = 20;

const LeadsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [priority, setPriority] = useState(searchParams.get('priority') || 'all');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const searchTimer = useRef(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, sortBy, sortOrder };
      if (search) params.search = search;
      if (status !== 'all') params.status = status;
      if (priority !== 'all') params.priority = priority;

      const res = await leadsAPI.getAll(params);
      setLeads(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, priority, sortBy, sortOrder]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Sync URL params
  useEffect(() => {
    const p = {};
    if (search) p.search = search;
    if (status !== 'all') p.status = status;
    if (priority !== 'all') p.priority = priority;
    if (page > 1) p.page = page;
    setSearchParams(p, { replace: true });
  }, [search, status, priority, page]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 350);
  };

  const handleDelete = async () => {
    try {
      await leadsAPI.delete(deleteId);
      toast.success('Lead deleted');
      setDeleteId(null);
      fetchLeads();
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }) => (
    <span className="text-xs opacity-50 ml-1">
      {sortBy === field ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total leads</p>
        </div>
        <Link to="/leads/add" className="btn-primary text-sm">
          + Add Lead
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          defaultValue={search}
          onChange={handleSearchChange}
          className="input-field sm:max-w-xs"
          placeholder="🔍 Search company, contact, city..."
        />
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="input-field sm:max-w-[180px]"
        >
          <option value="all">All Statuses</option>
          {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={priority}
          onChange={e => { setPriority(e.target.value); setPage(1); }}
          className="input-field sm:max-w-[160px]"
        >
          <option value="all">All Priorities</option>
          {LEAD_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {(status !== 'all' || priority !== 'all' || search) && (
          <button
            onClick={() => { setStatus('all'); setPriority('all'); setSearch(''); setPage(1); }}
            className="btn-secondary text-sm shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table / Cards */}
      {loading ? (
        <SectionLoader />
      ) : leads.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No leads found"
          description="Try adjusting your filters or add a new lead."
          actionLabel="Add Lead"
          actionTo="/leads/add"
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="card overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th
                      className="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:text-gray-900 whitespace-nowrap"
                      onClick={() => handleSort('companyName')}
                    >
                      Company <SortIcon field="companyName" />
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Contact</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Mobile</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">City</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Priority</th>
                    <th
                      className="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:text-gray-900 whitespace-nowrap"
                      onClick={() => handleSort('nextFollowupDate')}
                    >
                      Follow-up <SortIcon field="nextFollowupDate" />
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map(lead => (
                    <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">
                        {lead.companyName}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{lead.contactPerson}</td>
                      <td className="px-4 py-3">
                        <a href={`tel:${lead.mobileNumber}`} className="text-brand-600 hover:underline">
                          {lead.mobileNumber}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{lead.city || '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                      <td className="px-4 py-3"><PriorityBadge priority={lead.priority} /></td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {lead.nextFollowupDate ? (
                          <span className={new Date(lead.nextFollowupDate) < new Date() ? 'text-red-600 font-medium' : ''}>
                            {formatDate(lead.nextFollowupDate)}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/leads/${lead._id}`}
                            className="text-xs text-brand-600 font-medium hover:underline"
                          >
                            View
                          </Link>
                          <Link
                            to={`/leads/${lead._id}/edit`}
                            className="text-xs text-gray-600 font-medium hover:underline"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setDeleteId(lead._id)}
                            className="text-xs text-red-500 font-medium hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {leads.map(lead => (
              <div key={lead._id} className="card p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{lead.companyName}</h3>
                    <p className="text-sm text-gray-500 truncate">{lead.contactPerson} · {lead.city || 'No city'}</p>
                    <a href={`tel:${lead.mobileNumber}`} className="text-sm text-brand-600 font-medium">
                      {lead.mobileNumber}
                    </a>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <StatusBadge status={lead.status} />
                    <PriorityBadge priority={lead.priority} />
                  </div>
                </div>
                {lead.nextFollowupDate && (
                  <p className={`text-xs mb-3 ${new Date(lead.nextFollowupDate) < new Date() ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    📅 Follow-up: {formatDate(lead.nextFollowupDate)}
                  </p>
                )}
                <div className="flex gap-2 pt-2 border-t border-gray-50">
                  <Link to={`/leads/${lead._id}`} className="flex-1 text-center py-1.5 text-xs font-medium rounded-lg bg-brand-50 text-brand-700 border border-brand-100">
                    View
                  </Link>
                  <Link to={`/leads/${lead._id}/edit`} className="flex-1 text-center py-1.5 text-xs font-medium rounded-lg bg-gray-50 text-gray-700 border border-gray-100">
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteId(lead._id)}
                    className="flex-1 text-center py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 border border-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmText="Delete"
        confirmClass="btn-danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default LeadsPage;
