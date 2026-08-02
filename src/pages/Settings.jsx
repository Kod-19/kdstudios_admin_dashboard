import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestAndSaveNotificationToken } from '../services/notificationService';
import { Bell, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleEnableNotifications = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const success = await requestAndSaveNotificationToken(currentUser.uid);
      if (success) {
        setStatusMessage({ type: 'success', text: 'Push notifications enabled successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed or permission was denied for notifications.' });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage admin notifications and preferences</p>
      </div>

      {/* Notifications Section */}
      <div className="p-6 bg-brand-card border border-brand-border rounded-xl space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-brand-accent/10 border border-brand-accent/20 rounded-lg text-brand-accent shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Browser Push Notifications</h2>
              <p className="text-slate-400 text-sm mt-0.5">
                Receive immediate push alerts on your desktop or mobile browser whenever a new contact message or project brief is submitted.
              </p>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className={`p-3.5 rounded-lg border text-sm flex items-center gap-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={handleEnableNotifications}
            disabled={loading}
            className="px-4 py-2 bg-brand-accent hover:bg-sky-400 text-slate-950 text-sm font-semibold rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Requesting Permission...' : 'Enable Browser Notifications'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;