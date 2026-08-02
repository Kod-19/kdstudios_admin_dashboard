import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  orderBy, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { logActivity } from './activityService';

const CLIENTS_COLLECTION = 'clients';

export const clientsService = {
  /**
   * Fetch all clients ordered by newest first.
   */
  async getClients() {
    try {
      const q = query(collection(db, CLIENTS_COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  /**
   * Create a new client record.
   */
  async createClient(clientData, actorId = 'admin') {
    try {
      const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), {
        name: clientData.name || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        businessName: clientData.businessName || '',
        status: clientData.status || 'new_lead',
        notes: clientData.notes || '',
        sourceMessageId: clientData.sourceMessageId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      await logActivity({
        actorId,
        action: 'CLIENT_CREATED',
        entityType: 'client',
        entityId: docRef.id,
        summary: `Created client: ${clientData.name || clientData.email}`
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  /**
   * Update an existing client.
   */
  async updateClient(clientId, clientData, actorId = 'admin') {
    try {
      const docRef = doc(db, CLIENTS_COLLECTION, clientId);
      await updateDoc(docRef, {
        ...clientData,
        updatedAt: serverTimestamp()
      });

      await logActivity({
        actorId,
        action: 'CLIENT_UPDATED',
        entityType: 'client',
        entityId: clientId,
        summary: `Updated client: ${clientData.name || clientId}`
      });
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }
};