import { db } from "../lib/firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const MEDIA_COLLECTION = "media";

export const mediaService = {
  // Get all media items ordered by newest
  async getAllMedia() {
    try {
      const q = query(
        collection(db, MEDIA_COLLECTION),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error("Error fetching media:", error);
      throw error;
    }
  },

  // Save media record
  async addMediaRecord(mediaData) {
    try {
      const docRef = await addDoc(collection(db, MEDIA_COLLECTION), {
        name: mediaData.name,
        url: mediaData.url,
        type: mediaData.type || "image",
        size: mediaData.size || "N/A",
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding media record:", error);
      throw error;
    }
  },

  // Delete media item
  async deleteMedia(id) {
    try {
      await deleteDoc(doc(db, MEDIA_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting media:", error);
      throw error;
    }
  },
};

// --- Additional named helpers used by UI components ---

export async function uploadToCloudinary(file, folder = "projects") {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured (check VITE_CLOUDINARY_* env vars)",
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", uploadPreset);
  fd.append("folder", folder);

  const res = await fetch(url, { method: "POST", body: fd });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }

  const data = await res.json();
  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
    bytes: data.bytes,
    width: data.width,
    height: data.height,
    format: data.format,
    raw: data,
  };
}

export async function saveMediaAsset(cloudinaryResult, ownerId, originalName) {
  const mediaData = {
    name: originalName || cloudinaryResult.publicId,
    url: cloudinaryResult.secureUrl,
    secureUrl: cloudinaryResult.secureUrl,
    publicId: cloudinaryResult.publicId,
    size: cloudinaryResult.bytes || null,
    type: "image",
    ownerId: ownerId || null,
    createdAt: serverTimestamp(),
  };

  return await mediaService.addMediaRecord(mediaData);
}

export function subscribeToMediaAssets(onUpdate) {
  const q = query(
    collection(db, MEDIA_COLLECTION),
    orderBy("createdAt", "desc"),
  );
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onUpdate(items);
    },
    (err) => {
      console.error("Media subscription error:", err);
    },
  );

  return unsubscribe;
}

export async function deleteMediaAsset(id /*, publicId, userId */) {
  // Note: Cloudinary asset deletion requires server-side credentials.
  // Here we remove the Firestore record. If you have a server endpoint
  // to remove Cloudinary resources, call it here with publicId and userId.
  return await mediaService.deleteMedia(id);
}
