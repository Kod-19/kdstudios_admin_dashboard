import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';

/**
 * Service for aggregating dashboard overview analytics and recent activity logs.
 */
export const analyticsService = {
  /**
   * Fetch aggregated metrics across messages, projects, and clients.
   * 
   * @returns {Promise<Object>} Metrics summary object
   */
  async getOverviewMetrics() {
    try {
      const [messagesSnap, projectsSnap, clientsSnap] = await Promise.all([
        getDocs(query(collection(db, 'messages'), where('status', '==', 'unread'))),
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'clients'))
      ]);

      // Unread messages count
      const unreadMessagesCount = messagesSnap.size;

      // Projects breakdown (published vs draft)
      let publishedProjectsCount = 0;
      let draftProjectsCount = 0;
      projectsSnap.docs.forEach((doc) => {
        const data = doc.data();
        if (data.publishStatus === 'published') {
          publishedProjectsCount++;
        } else if (data.publishStatus === 'draft') {
          draftProjectsCount++;
        }
      });

      // Total clients count
      const totalClientsCount = clientsSnap.size;

      return {
        unreadMessagesCount,
        publishedProjectsCount,
        draftProjectsCount,
        totalClientsCount
      };
    } catch (error) {
      console.error('Error fetching overview metrics:', error);
      throw error;
    }
  },

  /**
   * Fetch recent activity log items for the dashboard overview feed.
   * 
   * @param {number} activityLimit - Number of recent logs to fetch (default: 6)
   * @returns {Promise<Array>} Array of activity log documents
   */
  async getRecentActivity(activityLimit = 6) {
    try {
      const activityQuery = query(
        collection(db, 'activityLogs'),
        orderBy('createdAt', 'desc'),
        limit(activityLimit)
      );
      const [activityResult] = await Promise.allSettled([
        getDocs(activityQuery)
      ]);

      const activityItems =
        activityResult.status === 'fulfilled'
          ? activityResult.value.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
          : [];

      return activityItems
        .sort((a, b) => {
          const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, activityLimit);
    } catch (error) {
      console.error('Error fetching recent activity logs:', error);
      // Return empty array on failure so UI loads gracefully without crashing
      return [];
    }
  }
};
