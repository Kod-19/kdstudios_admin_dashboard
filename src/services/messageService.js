import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS, logActivity } from './db';

/**
 * Real-time listener for messages
 */
export const subscribeToMessages = (callback) => {
  const q = query(
    collection(db, COLLECTIONS.MESSAGES), 
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(messages);
  });
};

/**
 * Update message status (unread, read, replied, archived)
 */
export const updateMessageStatus = async (messageId, status, actorId) => {
  const docRef = doc(db, COLLECTIONS.MESSAGES, messageId);
  const updates = { 
    status, 
    updatedAt: serverTimestamp() 
  };

  if (status === 'read') {
    updates.readAt = serverTimestamp();
  } else if (status === 'archived') {
    updates.archivedAt = serverTimestamp();
  }

  await updateDoc(docRef, updates);
  await logActivity(actorId, 'UPDATE_STATUS', COLLECTIONS.MESSAGES, messageId, `Updated message status to ${status}`);
};

/**
 * Convert an inquiry message into a Client record
 */
export const convertMessageToClient = async (message, actorId) => {
  // 1. Create client record
  const clientRef = await addDoc(collection(db, COLLECTIONS.CLIENTS), {
    name: message.name || 'Unknown Client',
    email: message.email || '',
    phone: message.phone || '',
    businessName: message.businessName || '',
    status: 'New lead',
    notes: message.message || message.extraNotes || '',
    sourceMessageId: message.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 2. Link message to client and set status to converted
  const messageRef = doc(db, COLLECTIONS.MESSAGES, message.id);
  await updateDoc(messageRef, {
    status: 'converted',
    clientId: clientRef.id,
    updatedAt: serverTimestamp(),
  });

  await logActivity(
    actorId, 
    'CONVERT', 
    COLLECTIONS.MESSAGES, 
    message.id, 
    `Converted message from ${message.name} to Client record (${clientRef.id})`
  );

  return clientRef.id;
};