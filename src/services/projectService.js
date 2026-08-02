import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { COLLECTIONS, logActivity } from './db';

/**
 * Real-time listener for projects
 */
export const subscribeToProjects = (callback) => {
  const q = query(
    collection(db, COLLECTIONS.PROJECTS), 
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(projects);
  });
};

/**
 * Create a new project card
 */
export const createProject = async (projectData, actorId) => {
  const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
    ...projectData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: projectData.publishStatus === 'published' ? serverTimestamp() : null,
  });

  await logActivity(
    actorId, 
    'CREATE', 
    COLLECTIONS.PROJECTS, 
    docRef.id, 
    `Created project "${projectData.title}" (${projectData.publishStatus})`
  );

  return docRef.id;
};

/**
 * Update an existing project card
 */
export const updateProject = async (projectId, projectData, actorId) => {
  const docRef = doc(db, COLLECTIONS.PROJECTS, projectId);
  
  const updates = {
    ...projectData,
    updatedAt: serverTimestamp(),
  };

  if (projectData.publishStatus === 'published' && !projectData.publishedAt) {
    updates.publishedAt = serverTimestamp();
  }

  await updateDoc(docRef, updates);

  await logActivity(
    actorId, 
    'UPDATE', 
    COLLECTIONS.PROJECTS, 
    projectId, 
    `Updated project "${projectData.title}"`
  );
};

/**
 * Toggle Project Publish Status (draft / published / archived)
 */
export const setProjectPublishStatus = async (projectId, publishStatus, actorId) => {
  const docRef = doc(db, COLLECTIONS.PROJECTS, projectId);
  const updates = { 
    publishStatus, 
    updatedAt: serverTimestamp() 
  };

  if (publishStatus === 'published') {
    updates.publishedAt = serverTimestamp();
  }

  await updateDoc(docRef, updates);
  await logActivity(actorId, 'TOGGLE_PUBLISH', COLLECTIONS.PROJECTS, projectId, `Set publish status to ${publishStatus}`);
};

/**
 * Delete a project
 */
export const deleteProject = async (projectId, title, actorId) => {
  const docRef = doc(db, COLLECTIONS.PROJECTS, projectId);
  await deleteDoc(docRef);
  await logActivity(actorId, 'DELETE', COLLECTIONS.PROJECTS, projectId, `Deleted project "${title}"`);
};