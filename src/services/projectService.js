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

const COLLECTION_NAME = 'projects';

export const projectService = {
  /**
   * Fetch all projects ordered by sort index
   */
  async getAllProjects() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('sortOrder', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  /**
   * Fetch a single project document by ID
   */
  async getProjectById(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) throw new Error('Project not found');
      return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  /**
   * Create a new project document
   */
  async createProject(projectData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        title: projectData.title || '',
        subtitle: projectData.subtitle || '',
        category: projectData.category || 'Web App',
        description: projectData.description || '',
        coverImage: projectData.coverImage || '',
        galleryImages: projectData.galleryImages || [],
        liveUrl: projectData.liveUrl || '',
        githubUrl: projectData.githubUrl || '',
        techStack: projectData.techStack || [],
        publishStatus: projectData.publishStatus || 'draft',
        sortOrder: Number(projectData.sortOrder ?? 0),
        featured: Boolean(projectData.featured),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  /**
   * Update an existing project document
   */
  async updateProject(id, projectData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...projectData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  /**
   * Delete a project document
   */
  async deleteProject(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  /**
   * Quick toggle publish status (draft <-> published)
   */
  async togglePublishStatus(id, currentStatus) {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        publishStatus: newStatus,
        updatedAt: serverTimestamp(),
      });
      return newStatus;
    } catch (error) {
      console.error('Error toggling status:', error);
      throw error;
    }
  }
};