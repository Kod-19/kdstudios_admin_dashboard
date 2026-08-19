import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { analyticsService } from "../services/analyticsService";

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    unreadMessagesCount: 0,
    publishedProjectsCount: 0,
    draftProjectsCount: 0,
    totalClientsCount: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

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
      console.error("Failed to load dashboard overview data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading overview data...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400 text-sm">
          Welcome back! Here is a summary of KD Studios activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-slate-400">
              Unread Messages
            </span>
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">
            {metrics.unreadMessagesCount}
          </p>
          <Link
            to="/dashboard/inbox"
            className="text-xs text-amber-400 hover:underline mt-2 inline-block"
          >
            View Inbox
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-slate-400">
              Projects
            </span>
            <span className="text-xs text-slate-500">
              {metrics.draftProjectsCount} Drafts
            </span>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">
            {metrics.publishedProjectsCount}
          </p>
          <Link
            to="/dashboard/projects"
            className="text-xs text-slate-400 hover:underline mt-2 inline-block"
          >
            Manage Projects
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-slate-400">
              Clients & Leads
            </span>
            <span className="h-2 w-2 rounded-full bg-sky-400"></span>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">
            {metrics.totalClientsCount}
          </p>
          <Link
            to="/dashboard/clients"
            className="text-xs text-slate-400 hover:underline mt-2 inline-block"
          >
            View Clients
          </Link>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-md font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/dashboard/projects/new"
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs p-3 rounded-lg border border-slate-700 transition"
          >
            + Add Project
          </Link>
          <Link
            to="/dashboard/blog/new"
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs p-3 rounded-lg border border-slate-700 transition"
          >
            + New Blog Post
          </Link>
          <Link
            to="/dashboard/media"
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs p-3 rounded-lg border border-slate-700 transition"
          >
            Upload Media
          </Link>
          <Link
            to="/dashboard/inbox"
            className="flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-medium text-xs p-3 rounded-lg border border-amber-500/30 transition"
          >
            Check Inbox
          </Link>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-md font-bold text-white mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-slate-500">
            No recent actions logged yet.
          </p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0"
              >
                <div>
                  <p className="text-xs text-white font-medium">
                    {activity.summary || activity.action}
                  </p>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">
                    {activity.entityType}
                  </span>
                </div>
                <span className="text-xs text-slate-400 text-right">
                  {activity.createdAt?.toDate
                    ? activity.createdAt.toDate().toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

