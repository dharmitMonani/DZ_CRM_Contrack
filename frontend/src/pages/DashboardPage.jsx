import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import FollowUpCard from '../components/dashboard/FollowUpCard';
import { SectionLoader } from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await dashboardAPI.get();
      setData(res.data.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">{today}</p>
      </div>

      {loading ? (
        <SectionLoader />
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              label="Total Leads"
              value={data?.stats?.totalLeads ?? 0}
              icon="👥"
              color="blue"
              to="/leads"
            />
            <StatCard
              label="Today's Follow-ups"
              value={data?.stats?.todayFollowupsCount ?? 0}
              icon="📅"
              color="red"
            />
            <StatCard
              label="New Leads"
              value={data?.stats?.newLeads ?? 0}
              icon="🌱"
              color="green"
              to="/leads?status=New Lead"
            />
            <StatCard
              label="Interested"
              value={data?.stats?.interestedLeads ?? 0}
              icon="🤝"
              color="purple"
              to="/leads?status=Interested"
            />
            <StatCard
              label="Demo Scheduled"
              value={data?.stats?.demoScheduled ?? 0}
              icon="🎯"
              color="yellow"
              to="/leads?status=Demo Scheduled"
            />
            <StatCard
              label="Won Deals"
              value={data?.stats?.wonDeals ?? 0}
              icon="🏆"
              color="green"
              to="/leads?status=Won"
            />
          </div>

          {/* Today's Follow-ups Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Today's Follow-ups</h2>
                {data?.todayFollowups?.length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {data.todayFollowups.length}
                  </span>
                )}
              </div>
            </div>

            {data?.todayFollowups?.length === 0 ? (
              <EmptyState
                icon="✅"
                title="All clear!"
                description="No follow-ups due today. Keep adding leads and scheduling follow-ups."
                actionLabel="Add New Lead"
                actionTo="/leads/add"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.todayFollowups.map(lead => (
                  <FollowUpCard key={lead._id} lead={lead} onRefresh={fetchDashboard} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
