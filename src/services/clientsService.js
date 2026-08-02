import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';

const COLLECTION_NAME = 'clients';

export const clientsService = {
  /**
   * Fetch all clients ordered by creation date
   */
  async getAllClients() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  /**
   * Fetch a single client by ID
   */
  async getClientById(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) throw new Error('Client not found');
      return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  /**
   * Create a new client record
   */
  async createClient(clientData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        name: clientData.name || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        company: clientData.company || '',
        status: clientData.status || 'lead', // 'lead' | 'active' | 'completed' | 'archived'
        notes: clientData.notes || '',
        totalSpentGhs: Number(clientData.totalSpentGhs || 0),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  /**
   * Update client details
   */
  async updateClient(id, clientData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...clientData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  /**
   * Quick update client status
   */
  async updateClientStatus(id, status) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating client status:', error);
      throw error;
    }
  },

  /**
   * Delete a client record
   */
  async deleteClient(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
};