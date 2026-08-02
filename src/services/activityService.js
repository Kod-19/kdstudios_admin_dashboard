import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';

const ACTIVITY_COLLECTION = 'activityLogs';

/**
 * Log an admin action to the activityLogs Firestore collection.
 * 
 * @param {Object} params
 * @param {string} [params.actorId='admin'] - UID or name of the user performing the action
 * @param {string} params.action - Short action code (e.g., 'CLIENT_CREATED')
 * @param {string} params.entityType - Target module (e.g., 'client', 'payment', 'settings')
 * @param {string} [params.entityId] - ID of the record being acted upon
 * @param {string} params.summary - Human-readable description of the activity
 */
export const logActivity = async ({
  actorId = 'admin',
  action,
  entityType,
  entityId = null,
  summary = ''
}) => {
  try {
    await addDoc(collection(db, ACTIVITY_COLLECTION), {
      actorId,
      action,
      entityType,
      entityId,
      summary,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    // Graceful fallback so activity logging errors don't break primary operations
    console.error('Failed to write activity log:', error);
  }
};

/**
 * Retrieve recent activity logs for the dashboard overview.
 * 
 * @param {number} maxLogs - Maximum number of logs to return
 */
export const getActivityLogs = async (maxLogs = 10) => {
  try {
    const q = query(
      collection(db, ACTIVITY_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(maxLogs)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    throw error;
  }
};