import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  addDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { COLLECTIONS, logActivity } from './db';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload an image file directly to Cloudinary
 */
export const uploadToCloudinary = async (file, folder = 'kd-studios') => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary cloud name or upload preset is missing in .env.local');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
  }

  const data = await response.json();
  return {
    publicId: data.public_id,
    secureUrl: data.secure_url,
    format: data.format,
    width: data.width,
    height: data.height,
  };
};

/**
 * Save asset metadata into Firestore mediaAssets collection
 */
export const saveMediaAsset = async (assetData, actorId, altText = '') => {
  const docRef = await addDoc(collection(db, COLLECTIONS.MEDIA_ASSETS), {
    publicId: assetData.publicId,
    secureUrl: assetData.secureUrl,
    format: assetData.format,
    width: assetData.width,
    height: assetData.height,
    altText,
    uploadedBy: actorId,
    createdAt: serverTimestamp(),
  });

  await logActivity(
    actorId, 
    'UPLOAD_MEDIA', 
    COLLECTIONS.MEDIA_ASSETS, 
    docRef.id, 
    `Uploaded media asset: ${assetData.publicId}`
  );

  return docRef.id;
};

/**
 * Subscribe to Media Assets in real time
 */
export const subscribeToMediaAssets = (callback) => {
  const q = query(
    collection(db, COLLECTIONS.MEDIA_ASSETS), 
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const assets = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(assets);
  });
};

/**
 * Delete media record from Firestore
 */
export const deleteMediaAsset = async (assetId, publicId, actorId) => {
  const docRef = doc(db, COLLECTIONS.MEDIA_ASSETS, assetId);
  await deleteDoc(docRef);
  await logActivity(actorId, 'DELETE_MEDIA', COLLECTIONS.MEDIA_ASSETS, assetId, `Deleted media metadata for ${publicId}`);
};