import React from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

const COLORS = {
  status: ['#3b82f6', '#eab308', '#a855f7', '#22c55e', '#ef4444', '#f97316', '#64748b', '#0ea5e9', '#ec4899'],
  priority: {
    Hot: '#ef4444',
    Warm: '#f59e0b',
    Cold: '#3b82f6'
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg text-sm">
        <p className="font-semibold text-gray-800 mb-1">{label || payload[0].name}</p>
        <p className="text-brand-600 font-medium">
          Count: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const LeadsByStatusChart = ({ data }) => {
  console.log('LeadsByStatusChart received data:', data);
  if (!data || data.length === 0) return <div className="text-sm text-gray-400 text-center py-10">No data available</div>;
  
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
          <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600">
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
  console.log('LeadsByPriorityChart received data:', data);
  if (!data || data.length === 0) return <div className="text-sm text-gray-400 text-center py-10">No data available</div>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
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
  console.log('MonthlyTrendChart received data:', data);
  if (!data || data.length === 0) return <div className="text-sm text-gray-400 text-center py-10">No data available</div>;

  // Format month labels (e.g., "2023-10" to "Oct")
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
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="displayMonth" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <RechartsTooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LeadsByCityChart = ({ data }) => {
  console.log('LeadsByCityChart received data:', data);
  if (!data || data.length === 0) return <div className="text-sm text-gray-400 text-center py-10">No data available</div>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} />
          <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
