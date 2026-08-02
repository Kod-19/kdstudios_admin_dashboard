import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadToCloudinary, saveMediaAsset } from '../services/mediaService';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const ImageUploader = ({ onUploadComplete, currentUrl = '', folder = 'projects' }) => {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(currentUrl);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      // 1. Upload file to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(file, `kd-studios/${folder}`);
      
      // 2. Save asset metadata in Firestore
      await saveMediaAsset(cloudinaryResult, currentUser.uid, file.name);

      setPreview(cloudinaryResult.secureUrl);
      
      // 3. Callback with the new secure URL & public ID
      if (onUploadComplete) {
        onUploadComplete(cloudinaryResult.secureUrl, cloudinaryResult.publicId);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Image upload failed. Check Cloudinary settings.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        {/* Preview image */}
        {preview ? (
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-900 border border-brand-border shrink-0 relative group">
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-lg bg-brand-dark border border-dashed border-brand-border flex items-center justify-center text-slate-600 shrink-0">
            <UploadCloud className="w-6 h-6" />
          </div>
        )}

        {/* Upload Button Input */}
        <div className="flex-1">
          <label className="inline-flex items-center gap-2 px-3 py-2 bg-brand-border/40 hover:bg-brand-border border border-brand-border rounded-lg text-xs font-semibold text-slate-200 cursor-pointer transition">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-accent" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-brand-accent" />
                <span>{preview ? 'Change Image' : 'Upload Image'}</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, WebP up to 10MB</p>
        </div>
      </div>

      {error && (
        <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;