import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { logActivity } from './activityService';

const SETTINGS_COLLECTION = 'siteSettings';
const PUBLIC_DOC = 'publicSettings';
const PRIVATE_DOC = 'privateSettings';

export const settingsService = {
  async getSettings() {
    try {
      const publicSnap = await getDoc(doc(db, SETTINGS_COLLECTION, PUBLIC_DOC));
      const privateSnap = await getDoc(doc(db, SETTINGS_COLLECTION, PRIVATE_DOC));

      return {
        public: publicSnap.exists() ? publicSnap.data() : {},
        private: privateSnap.exists() ? privateSnap.data() : {}
      };
    } catch (error) {
      console.error('Error reading settings:', error);
      throw error;
    }
  },

  async updatePublicSettings(data, actorId = 'admin') {
    try {
      await setDoc(doc(db, SETTINGS_COLLECTION, PUBLIC_DOC), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });

      await logActivity({
        actorId,
        action: 'PUBLIC_SETTINGS_UPDATED',
        entityType: 'settings',
        entityId: PUBLIC_DOC,
        summary: 'Updated public website settings'
      });
    } catch (error) {
      console.error('Error updating public settings:', error);
      throw error;
    }
  }
};