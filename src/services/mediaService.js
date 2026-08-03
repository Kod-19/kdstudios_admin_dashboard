import { db } from '../lib/firebase/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

const MEDIA_COLLECTION = 'media';

export const mediaService = {
  // Get all media items ordered by newest
  async getAllMedia() {
    try {
      const q = query(collection(db, MEDIA_COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
  },

  // Save media record
  async addMediaRecord(mediaData) {
    try {
      const docRef = await addDoc(collection(db, MEDIA_COLLECTION), {
        name: mediaData.name,
        url: mediaData.url,
        type: mediaData.type || 'image',
        size: mediaData.size || 'N/A',
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding media record:', error);
      throw error;
    }
  },

  // Delete media item
  async deleteMedia(id) {
    try {
      await deleteDoc(doc(db, MEDIA_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  },
};