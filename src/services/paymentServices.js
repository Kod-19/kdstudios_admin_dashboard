import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';

const COLLECTION_NAME = 'payments';

export const paymentService = {
  /**
   * Fetch all recorded transactions ordered by creation date
   */
  async getAllPayments() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  /**
   * Update transaction status manually (e.g., mark as 'verified' or 'refunded')
   */
  async updatePaymentStatus(id, newStatus) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }
};