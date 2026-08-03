import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'Developer Portfolio',
    tagline: 'Full Stack Engineer & Digital Creator',
    bio: 'Building high-performance web applications and digital systems.',
    email: 'admin@example.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://x.com',
    paystackPublicKey: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const docRef = doc(db, 'settings', 'global');
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setSettings((prev) => ({ ...prev, ...snapshot.data() }));
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await setDoc(doc(db, 'settings', 'global'), {
        ...settings,
        updatedAt: serverTimestamp(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading configurations...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-slate-400 text-sm">Configure personal branding, social handles, and integration keys.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">General Profile Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">Site Title / Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">Hero Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">Bio / About Snippet</label>
            <textarea
              rows={3}
              value={settings.bio}
              onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Social Profiles & Links</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">GitHub URL</label>
              <input
                type="url"
                value={settings.github}
                onChange={(e) => setSettings({ ...settings, github: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={settings.linkedin}
                onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">Twitter / X URL</label>
              <input
                type="url"
                value={settings.twitter}
                onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Payment Integration Keys */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Payment Gateway Integration</h2>

          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">Paystack Public Key</label>
            <input
              type="text"
              placeholder="pk_test_xxxxxxxxxxxxxxxxxxxxxxxx"
              value={settings.paystackPublicKey}
              onChange={(e) => setSettings({ ...settings, paystackPublicKey: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="text-xs font-bold text-emerald-400">✓ Settings saved successfully!</span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs transition disabled:opacity-50"
          >
            {saving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}