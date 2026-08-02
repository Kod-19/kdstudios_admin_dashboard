import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToMediaAssets, deleteMediaAsset } from '../services/mediaService';
import ImageUploader from '../components/ImageUploader';
import { Image as ImageIcon, Copy, Check, Trash2 } from 'lucide-react';

const MediaLibrary = () => {
  const { currentUser } = useAuth();
  const [assets, setAssets] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToMediaAssets((data) => {
      setAssets(data);
    });
    return () => unsubscribe();
  }, []);

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (asset) => {
    if (window.confirm('Delete this media record from your dashboard?')) {
      await deleteMediaAsset(asset.id, asset.publicId, currentUser.uid);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-brand-accent" /> Media Library
        </h1>
        <p className="text-slate-400 text-sm mt-1">Upload and manage Cloudinary media assets across projects and blog posts</p>
      </div>

      {/* Upload Banner */}
      <div className="p-6 bg-brand-card border border-brand-border rounded-xl">
        <h2 className="text-sm font-semibold text-white mb-3">Quick Upload Asset</h2>
        <ImageUploader folder="general" />
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {assets.length === 0 ? (
          <div className="col-span-full bg-brand-card border border-brand-border rounded-xl p-8 text-center text-slate-500">
            No media assets uploaded yet. Use the quick uploader above to add images.
          </div>
        ) : (
          assets.map((asset) => (
            <div key={asset.id} className="bg-brand-card border border-brand-border rounded-xl overflow-hidden group flex flex-col justify-between">
              <div className="h-32 bg-slate-900 relative overflow-hidden flex items-center justify-center border-b border-brand-border">
                <img src={asset.secureUrl} alt={asset.altText || 'Media Asset'} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex items-center justify-between bg-brand-dark/40">
                <button
                  onClick={() => handleCopyUrl(asset.secureUrl, asset.id)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-brand-accent font-mono transition"
                  title="Copy URL"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(asset)}
                  className="p-1 text-slate-500 hover:text-red-400 transition"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;