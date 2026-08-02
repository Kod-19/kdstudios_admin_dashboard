import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Collection Constants
export const COLLECTIONS = {
  ADMINS: 'admins',
  MESSAGES: 'messages',
  NOTIFICATION_TOKENS: 'notificationTokens',
  PROJECTS: 'projects',
  BLOG_POSTS: 'blogPosts',
  PAYMENTS: 'payments',
  CLIENTS: 'clients',
  MEDIA_ASSETS: 'mediaAssets',
  SITE_SETTINGS: 'siteSettings',
  ACTIVITY_LOGS: 'activityLogs',
};

/**
 * Log admin activities for operational tracking
 */
export const logActivity = async (actorId, action, entityType, entityId, summary) => {
  try {
    await addDoc(collection(db, COLLECTIONS.ACTIVITY_LOGS), {
      actorId,
      action,
      entityType,
      entityId,
      summary,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to write activity log:', error);
  }
};

/**
 * Generic Fetch Collection Documents
 */
export const fetchCollectionDocs = async (collectionName, constraints = []) => {
  try {
    const colRef = collection(db, collectionName);
    const q = query(colRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Generic Single Document Fetch
 */
export const fetchDocById = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching document ${id} in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Create Document with standard timestamps
 */
export const createDocument = async (collectionName, data, actorId = null, activitySummary = '') => {
  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    if (actorId && activitySummary) {
      await logActivity(actorId, 'CREATE', collectionName, docRef.id, activitySummary);
    }

    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update Document with timestamp update
 */
export const updateDocument = async (collectionName, id, data, actorId = null, activitySummary = '') => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    if (actorId && activitySummary) {
      await logActivity(actorId, 'UPDATE', collectionName, id, activitySummary);
    }
  } catch (error) {
    console.error(`Error updating document ${id} in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Delete Document
 */
export const removeDocument = async (collectionName, id, actorId = null, activitySummary = '') => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);

    if (actorId && activitySummary) {
      await logActivity(actorId, 'DELETE', collectionName, id, activitySummary);
    }
  } catch (error) {
    console.error(`Error deleting document ${id} in ${collectionName}:`, error);
    throw error;
  }
};