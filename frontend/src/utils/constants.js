// Lead status options
export const LEAD_STATUSES = [
  'New Lead',
  'Contacted',
  'Interested',
  'Demo Scheduled',
  'Demo Done',
  'Follow-up',
  'Trial Started',
  'Won',
  'Lost'
];

// Lead priority options
export const LEAD_PRIORITIES = ['Cold', 'Warm', 'Hot'];

// Status badge color map
export const STATUS_COLORS = {
  'New Lead':       'bg-gray-100 text-gray-700',
  'Contacted':      'bg-blue-100 text-blue-700',
  'Interested':     'bg-indigo-100 text-indigo-700',
  'Demo Scheduled': 'bg-purple-100 text-purple-700',
  'Demo Done':      'bg-pink-100 text-pink-700',
  'Follow-up':      'bg-yellow-100 text-yellow-700',
  'Trial Started':  'bg-cyan-100 text-cyan-700',
  'Won':            'bg-green-100 text-green-700',
  'Lost':           'bg-red-100 text-red-700'
};

// Priority badge color map
export const PRIORITY_COLORS = {
  Cold: 'bg-slate-100 text-slate-600',
  Warm: 'bg-orange-100 text-orange-600',
  Hot:  'bg-red-100 text-red-600'
};

// Priority emoji
export const PRIORITY_EMOJI = {
  Cold: '❄️',
  Warm: '🌡️',
  Hot:  '🔥'
};

// Format date to readable
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  } catch {
    return '—';
  }
};

// Format date to input value (YYYY-MM-DD)
export const toInputDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toISOString().split('T')[0];
  } catch {
    return '';
  }
};

// Check if follow-up is overdue
export const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
};

// Check if follow-up is today
export const isToday = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const t = new Date();
  return d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear();
};
