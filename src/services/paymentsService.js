import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  query, 
  orderBy, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { logActivity } from './activityService';

const PAYMENTS_COLLECTION = 'payments';

export const paymentsService = {
  /**
   * Fetch all payment records ordered by creation date (newest first).
   */
  async getPayments() {
    try {
      const q = query(collection(db, PAYMENTS_COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  /**
   * Fetch a single payment record by ID.
   */
  async getPaymentById(paymentId) {
    try {
      const docRef = doc(db, PAYMENTS_COLLECTION, paymentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error('Payment record not found');
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  },

  /**
   * Connect a payment record to a client ID.
   */
  async linkClient(paymentId, clientId, actorId = 'admin') {
    try {
      const docRef = doc(db, PAYMENTS_COLLECTION, paymentId);
      await updateDoc(docRef, {
        clientId: clientId,
        updatedAt: serverTimestamp()
      });

      await logActivity({
        actorId,
        action: 'PAYMENT_LINKED_TO_CLIENT',
        entityType: 'payment',
        entityId: paymentId,
        summary: `Linked payment ${paymentId} to client ${clientId}`
      });
    } catch (error) {
      console.error('Error linking client to payment:', error);
      throw error;
    }
  },

  /**
   * Manually verify or update payment status.
   */
  async updateStatus(paymentId, status, actorId = 'admin') {
    try {
      const docRef = doc(db, PAYMENTS_COLLECTION, paymentId);
      const updates = {
        status,
        updatedAt: serverTimestamp()
      };

      if (status === 'verified') {
        updates.verifiedAt = serverTimestamp();
      }

      await updateDoc(docRef, updates);

      await logActivity({
        actorId,
        action: 'PAYMENT_STATUS_UPDATED',
        entityType: 'payment',
        entityId: paymentId,
        summary: `Updated payment ${paymentId} status to ${status}`
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }
};