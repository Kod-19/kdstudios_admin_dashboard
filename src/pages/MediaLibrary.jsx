import React, { useState, useEffect } from 'react';
import { mediaService } from '../services/mediaService';

export default function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  // New Media Form
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMedia, setNewMedia] = useState({ name: '', url: '', type: 'image' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await mediaService.getAllMedia();
      setMediaItems(data);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMedia = async (e) => {
    e.preventDefault();
    if (!newMedia.name || !newMedia.url) return;
    setSubmitting(true);

    try {
      await mediaService.addMediaRecord(newMedia);
      setNewMedia({ name: '', url: '', type: 'image' });
      setIsAddOpen(false);
      loadMedia();
    } catch (err) {
      alert('Failed to save media URL.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete media item "${name}"?`)) return;
    try {
      await mediaService.deleteMedia(id);
      setMediaItems((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert('Failed to delete media item.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Assets</h1>
          <p className="text-slate-400 text-sm">Centralized cloud media library for project screenshots, logos, and post assets.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(!isAddOpen)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition self-start sm:self-auto"
        >
          {isAddOpen ? 'Close Form' : '+ Add Asset Link'}
        </button>
      </div>

      {/* Add Asset Form Card */}
      {isAddOpen && (
        <form onSubmit={handleAddMedia} className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Register Cloud Asset URL</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Asset Label / Title"
              value={newMedia.name}
              onChange={(e) => setNewMedia({ ...newMedia, name: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500"
            />
            <input
              type="url"
              required
              placeholder="https://res.cloudinary.com/..."
              value={newMedia.url}
              onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500"
            />
            <select
              value={newMedia.type}
              onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500"
            >
              <option value="image">Image</option>
              <option value="document">Document / PDF</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div className="flex justify-stretch sm:justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Media Link'}
            </button>
          </div>
        </form>
      )}

      {/* Grid Display */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading assets...</div>
      ) : mediaItems.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-slate-400 text-sm">No media assets saved yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mediaItems.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between group">
              <div className="h-32 bg-slate-950 relative border-b border-slate-800/80 flex items-center justify-center overflow-hidden">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                ) : (
                  <div className="text-slate-500 font-mono text-xs uppercase">{item.type}</div>
                )}
              </div>
              <div className="p-3 space-y-2">
                <p className="text-white text-xs font-semibold truncate">{item.name}</p>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                  <button
                    onClick={() => handleCopy(item.url, item.id)}
                    className="text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 transition"
                  >
                    {copiedId === item.id ? '✓ Copied' : 'Copy URL'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="text-[10px] text-slate-500 hover:text-red-400 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
