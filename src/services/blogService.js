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

const COLLECTION_NAME = 'blogPosts';

export const blogService = {
  /**
   * Fetch all blog posts ordered by creation date
   */
  async getAllPosts() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  /**
   * Fetch a single post by document ID
   */
  async getPostById(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) throw new Error('Blog post not found');
      return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  /**
   * Create a new blog post
   */
  async createPost(postData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        title: postData.title || '',
        slug: postData.slug || '',
        excerpt: postData.excerpt || '',
        content: postData.content || '',
        coverImage: postData.coverImage || '',
        tags: postData.tags || [],
        readTime: postData.readTime || '3 min read',
        publishStatus: postData.publishStatus || 'draft',
        publishedAt: postData.publishStatus === 'published' ? new Date().toISOString() : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  /**
   * Update an existing blog post
   */
  async updatePost(id, postData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const updateData = {
        ...postData,
        updatedAt: serverTimestamp(),
      };

      // If transitioning to published for the first time, record timestamp
      if (postData.publishStatus === 'published' && !postData.publishedAt) {
        updateData.publishedAt = new Date().toISOString();
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  /**
   * Delete a blog post
   */
  async deletePost(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting blog post:', error);
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
      
      const payload = {
        publishStatus: newStatus,
        updatedAt: serverTimestamp(),
      };

      if (newStatus === 'published') {
        payload.publishedAt = new Date().toISOString();
      }

      await updateDoc(docRef, payload);
      return newStatus;
    } catch (error) {
      console.error('Error toggling post status:', error);
      throw error;
    }
  }
};