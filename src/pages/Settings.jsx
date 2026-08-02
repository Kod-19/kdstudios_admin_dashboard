import React, { useState, useEffect } from 'react';
import { settingsService } from '../services/settingsService';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    studioName: 'KD Studios',
    contactEmail: 'contact@kdstudios.com',
    whatsappNumber: '+233000000000',
    seoTitle: 'KD Studios | Digital Solutions',
    seoDescription: 'High quality web apps and software development.'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      if (data.public) {
        setSettings((prev) => ({ ...prev, ...data.public }));
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.updatePublicSettings(settings);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Site Settings</h1>
        <p className="text-slate-400 text-sm">Configure shared public metadata and studio contact details.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-md font-semibold text-amber-400 border-b border-slate-800 pb-2">
            General & Contact Info
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Studio Name</label>
            <input
              type="text"
              value={settings.studioName}
              onChange={(e) => setSettings({ ...settings, studioName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-md font-semibold text-amber-400 border-b border-slate-800 pb-2">
            Default SEO Configurations
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">SEO Title</label>
            <input
              type="text"
              value={settings.seoTitle}
              onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">SEO Description</label>
            <textarea
              rows={3}
              value={settings.seoDescription}
              onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2 rounded text-sm transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}