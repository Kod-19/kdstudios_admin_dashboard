import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    unreadMessagesCount: 0,
    publishedProjectsCount: 0,
    draftProjectsCount: 0,
    totalRevenueGhs: 0,
    totalClientsCount: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [overviewData, activityData] = await Promise.all([
        analyticsService.getOverviewMetrics(),
        analyticsService.getRecentActivity(6),
      ]);
      setMetrics(overviewData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Failed to load dashboard overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading overview data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400 text-sm">Welcome back! Here is a summary of KD Studios activity.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Unread Messages */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-slate-400">Unread Messages</span>
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{metrics.unreadMessagesCount}</p>
          <Link to="/messages" className="text-xs text-amber-400 hover:underline mt-2 inline-block">
            View Inbox →
          </Link>
        </div>

        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Revenue</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 mt-3">
            GHS {metrics.totalRevenueGhs.toLocaleString()}
          </p>
          <Link to="/payments" className="text-xs text-slate-400 hover:underline mt-2 inline-block">
            View Payments →
          </Link>
        </div>

        {/* Portfolio Projects */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-slate-400">Projects</span>
            <span className="text-xs text-slate-500">{metrics.draftProjectsCount} Drafts</span>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{metrics.publishedProjectsCount}</p>
          <Link to="/projects" className="text-xs text-slate-400 hover:underline mt-2 inline-block">
            Manage Projects →
          </Link>
        </div>

        {/* Total Clients */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-slate-400">Clients & Leads</span>
            <span className="h-2 w-2 rounded-full bg-sky-400"></span>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{metrics.totalClientsCount}</p>
          <Link to="/clients" className="text-xs text-slate-400 hover:underline mt-2 inline-block">
            View Clients →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-md font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/projects/new"
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs p-3 rounded-lg border border-slate-700 transition"
          >
            + Add Project
          </Link>
          <Link
            to="/blog/new"
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs p-3 rounded-lg border border-slate-700 transition"
          >
            + New Blog Post
          </Link>
          <Link
            to="/media"
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs p-3 rounded-lg border border-slate-700 transition"
          >
            Upload Media
          </Link>
          <Link
            to="/messages"
            className="flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-medium text-xs p-3 rounded-lg border border-amber-500/30 transition"
          >
            Check Inbox
          </Link>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-md font-bold text-white mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-slate-500">No recent actions logged yet.</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0"
              >
                <div>
                  <p className="text-xs text-white font-medium">{activity.summary || activity.action}</p>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">{activity.entityType}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {activity.createdAt?.toDate ? activity.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}