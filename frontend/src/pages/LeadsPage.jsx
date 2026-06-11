import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { SectionLoader } from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { LEAD_STATUSES, LEAD_PRIORITIES, LEAD_SOURCES, formatDate } from '../utils/constants';
import toast from 'react-hot-toast';
import KanbanBoard from '../components/leads/KanbanBoard';
import * as XLSX from 'xlsx';

const LIMIT = 20;

const LeadsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [priority, setPriority] = useState(searchParams.get('priority') || 'all');
  const [source, setSource] = useState(searchParams.get('source') || 'all');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState(searchParams.get('view') || 'list');

  const searchTimer = useRef(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: viewMode === 'kanban' ? 1000 : LIMIT, sortBy, sortOrder };
      if (search) params.search = search;
      if (status !== 'all') params.status = status;
      if (priority !== 'all') params.priority = priority;
      if (source !== 'all') params.source = source;

      const res = await leadsAPI.getAll(params);
      setLeads(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, priority, source, sortBy, sortOrder, viewMode]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Sync URL params
  useEffect(() => {
    const p = {};
    if (search) p.search = search;
    if (status !== 'all') p.status = status;
    if (priority !== 'all') p.priority = priority;
    if (source !== 'all') p.source = source;
    if (page > 1) p.page = page;
    if (viewMode === 'kanban') p.view = 'kanban';
    setSearchParams(p, { replace: true });
  }, [search, status, priority, source, page, viewMode]);

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

  const handleStatusChange = async (leadId, newStatus, oldStatus) => {
    // Optimistic update
    setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
    try {
      await leadsAPI.update(leadId, { status: newStatus });
      toast.success('Status updated');
    } catch {
      // Rollback
      setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: oldStatus } : l));
      toast.error('Failed to update status');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    const toastId = toast.loading('Exporting...');
    try {
      let exportData = leads;
      
      // If there are more leads than currently loaded, fetch them all for export
      if (pagination.total > leads.length) {
        const params = { page: 1, limit: 10000, sortBy, sortOrder };
        if (search) params.search = search;
        if (status !== 'all') params.status = status;
        if (priority !== 'all') params.priority = priority;
        if (source !== 'all') params.source = source;
        const res = await leadsAPI.getAll(params);
        exportData = res.data.data;
      }

      const worksheetData = exportData.map(lead => ({
        'Company Name': lead.companyName || '-',
        'Contact Person': lead.contactPerson || '-',
        'Mobile Number': lead.mobileNumber || '-',
        'City': lead.city || '-',
        'Approx Turnover': lead.approxTurnover || '-',
        'Status': lead.status || '-',
        'Priority': lead.priority || '-',
        'Source': lead.source || 'Other',
        'Last Contact Date': lead.lastContactDate ? formatDate(lead.lastContactDate) : '-',
        'Next Follow-up Date': lead.nextFollowupDate ? formatDate(lead.nextFollowupDate) : '-',
        'Assigned To': lead.assignedTo ? lead.assignedTo.name || lead.assignedTo : '-',
        'Created Date': lead.createdAt ? formatDate(lead.createdAt) : '-'
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `Leads_${dateStr}.xlsx`);

      toast.success('Excel exported successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to export leads', { id: toastId });
    } finally {
      setExporting(false);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">All Leads</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{pagination.total} total leads</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-slate-700">
            <button
              onClick={() => { setViewMode('list'); setPage(1); }}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-slate-100' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}
            >
              List
            </button>
            <button
              onClick={() => { setViewMode('kanban'); setPage(1); }}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-slate-100' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}
            >
              Board
            </button>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Export Excel
          </button>
          <Link to="/leads/add" className="btn-primary text-sm">
            + Add Lead
          </Link>
        </div>
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
        <select
          value={source}
          onChange={e => { setSource(e.target.value); setPage(1); }}
          className="input-field sm:max-w-[160px]"
        >
          <option value="all">All Sources</option>
          {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(status !== 'all' || priority !== 'all' || source !== 'all' || search) && (
          <button
            onClick={() => { setStatus('all'); setPriority('all'); setSource('all'); setSearch(''); setPage(1); }}
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
      ) : viewMode === 'kanban' ? (
        <KanbanBoard leads={leads} onStatusChange={handleStatusChange} />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="card overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
                  <tr>
                    <th
                      className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-slate-400 cursor-pointer hover:text-gray-900 dark:hover:text-slate-200 whitespace-nowrap"
                      onClick={() => handleSort('companyName')}
                    >
                      Company <SortIcon field="companyName" />
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-slate-400 whitespace-nowrap">Contact</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-slate-400 whitespace-nowrap">Mobile</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-slate-400 whitespace-nowrap">City</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-slate-400 whitespace-nowrap">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-slate-400 whitespace-nowrap">Priority</th>
                    <th
                      className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-slate-400 cursor-pointer hover:text-gray-900 dark:hover:text-slate-200 whitespace-nowrap"
                      onClick={() => handleSort('nextFollowupDate')}
                    >
                      Follow-up <SortIcon field="nextFollowupDate" />
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-slate-400 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                  {leads.map(lead => (
                    <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-slate-100 max-w-[180px] truncate">
                        {lead.companyName}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-slate-300 max-w-[140px] truncate">{lead.contactPerson}</td>
                      <td className="px-4 py-3">
                        <a href={`tel:${lead.mobileNumber}`} className="text-brand-600 dark:text-brand-400 hover:underline">
                          {lead.mobileNumber}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{lead.city || '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                      <td className="px-4 py-3"><PriorityBadge priority={lead.priority} /></td>
                      <td className="px-4 py-3 text-gray-600 dark:text-slate-300 whitespace-nowrap">
                        {lead.nextFollowupDate ? (
                          <span className={new Date(lead.nextFollowupDate) < new Date() ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                            {formatDate(lead.nextFollowupDate)}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link to={`/leads/${lead._id}`} className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">
                            View
                          </Link>
                          <Link to={`/leads/${lead._id}/edit`} className="text-xs text-gray-600 dark:text-slate-300 font-medium hover:underline">
                            Edit
                          </Link>
                          <button onClick={() => setDeleteId(lead._id)} className="text-xs text-red-500 dark:text-red-400 font-medium hover:underline">
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
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100 truncate">{lead.companyName}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{lead.contactPerson} · {lead.city || 'No city'}</p>
                    <a href={`tel:${lead.mobileNumber}`} className="text-sm text-brand-600 dark:text-brand-400 font-medium">
                      {lead.mobileNumber}
                    </a>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <StatusBadge status={lead.status} />
                    <PriorityBadge priority={lead.priority} />
                  </div>
                </div>
                {lead.nextFollowupDate && (
                  <p className={`text-xs mb-3 ${new Date(lead.nextFollowupDate) < new Date() ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-slate-400'}`}>
                    📅 Follow-up: {formatDate(lead.nextFollowupDate)}
                  </p>
                )}
                <div className="flex gap-2 pt-2 border-t border-gray-50 dark:border-slate-700">
                  <Link to={`/leads/${lead._id}`} className="flex-1 text-center py-1.5 text-xs font-medium rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800">
                    View
                  </Link>
                  <Link to={`/leads/${lead._id}/edit`} className="flex-1 text-center py-1.5 text-xs font-medium rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-100 dark:border-slate-600">
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteId(lead._id)}
                    className="flex-1 text-center py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {viewMode === 'list' && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-600 dark:text-slate-300">
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
