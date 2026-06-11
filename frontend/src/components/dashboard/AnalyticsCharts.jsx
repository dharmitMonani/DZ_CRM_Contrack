import React from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

const COLORS = {
  status: ['#3b82f6', '#eab308', '#a855f7', '#22c55e', '#ef4444', '#f97316', '#64748b', '#0ea5e9', '#ec4899'],
  priority: {
    Hot: '#ef4444',
    Warm: '#f59e0b',
    Cold: '#3b82f6'
  }
};

// Theme-aware chart defaults
const useChartColors = () => {
  const { isDark } = useTheme();
  return {
    axisColor: isDark ? '#64748b' : '#94a3b8',
    gridColor: isDark ? '#1e293b' : '#f1f5f9',
    tooltipBg: isDark ? '#1e293b' : '#ffffff',
    tooltipBorder: isDark ? '#334155' : '#e2e8f0',
    tooltipText: isDark ? '#f1f5f9' : '#1e293b',
    labelColor: isDark ? '#94a3b8' : '#64748b',
    legendColor: isDark ? '#cbd5e1' : '#475569',
  };
};

const CustomTooltip = ({ active, payload, label }) => {
  const { isDark } = useTheme();
  if (active && payload && payload.length) {
    return (
      <div
        className="p-3 border rounded-lg text-sm shadow-lg"
        style={{
          background: isDark ? '#1e293b' : '#ffffff',
          borderColor: isDark ? '#334155' : '#e2e8f0',
          color: isDark ? '#f1f5f9' : '#1e293b',
        }}
      >
        <p className="font-semibold mb-1">{label || payload[0].name}</p>
        <p style={{ color: isDark ? '#60a5fa' : '#2563eb' }} className="font-medium">
          Count: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const LeadsByStatusChart = ({ data }) => {
  const c = useChartColors();
  if (!data || data.length === 0) return <div className="text-sm text-gray-400 dark:text-slate-500 text-center py-10">No data available</div>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS.status[index % COLORS.status.length]} />
            ))}
          </Pie>
          <RechartsTooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.status[index % COLORS.status.length] }}
            />
            {entry.name} ({entry.value})
          </div>
        ))}
      </div>
    </div>
  );
};

export const LeadsByPriorityChart = ({ data }) => {
  const c = useChartColors();
  if (!data || data.length === 0) return <div className="text-sm text-gray-400 dark:text-slate-500 text-center py-10">No data available</div>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={c.gridColor} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: c.labelColor }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: c.labelColor }} />
          <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: c.gridColor }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS.priority[entry.name] || '#94a3b8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MonthlyTrendChart = ({ data }) => {
  const c = useChartColors();
  if (!data || data.length === 0) return <div className="text-sm text-gray-400 dark:text-slate-500 text-center py-10">No data available</div>;

  const formattedData = data.map(item => {
    const [year, month] = item.month.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return {
      ...item,
      displayMonth: date.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={c.gridColor} />
          <XAxis dataKey="displayMonth" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: c.labelColor }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: c.labelColor }} />
          <RechartsTooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LeadsByCityChart = ({ data }) => {
  const c = useChartColors();
  if (!data || data.length === 0) return <div className="text-sm text-gray-400 dark:text-slate-500 text-center py-10">No data available</div>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={c.gridColor} />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: c.labelColor }} />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: c.legendColor }} />
          <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: c.gridColor }} />
          <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LeadsBySourceChart = ({ data }) => {
  const c = useChartColors();
  if (!data || data.length === 0) return <div className="text-sm text-gray-400 dark:text-slate-500 text-center py-10">No data available</div>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS.status[(index + 3) % COLORS.status.length]} />
            ))}
          </Pie>
          <RechartsTooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS.status[(index + 3) % COLORS.status.length] }}
            />
            {entry.name} ({entry.value})
          </div>
        ))}
      </div>
    </div>
  );
};
