import React from 'react';

const Overview = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Overview Dashboard</h1>
      </div>

      <div className="p-6 bg-brand-card border border-brand-border rounded-xl">
        <p className="text-slate-400 text-sm">
          Welcome to the KD Studios Admin Dashboard. Protected route structure and authentication shell are now fully operational!
        </p>
      </div>
    </div>
  );
};

export default Overview;