import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';

/**
 * Service for aggregating dashboard overview analytics and recent activity logs.
 */
export const analyticsService = {
  /**
   * Fetch aggregated metrics across messages, projects, payments, and clients.
   * 
   * @returns {Promise<Object>} Metrics summary object
   */
  async getOverviewMetrics() {
    try {
      const [messagesSnap, projectsSnap, paymentsSnap, clientsSnap] = await Promise.all([
        getDocs(query(collection(db, 'messages'), where('status', '==', 'unread'))),
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'payments')),
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

      // Revenue aggregation (summing 'success' or 'verified' payments in GHS)
      const totalRevenueGhs = paymentsSnap.docs.reduce((sum, doc) => {
        const payment = doc.data();
        if (payment.status === 'success' || payment.status === 'verified') {
          const amount = payment.amountGhs || (payment.amountPesewas ? payment.amountPesewas / 100 : 0);
          return sum + Number(amount || 0);
        }
        return sum;
      }, 0);

      // Total clients count
      const totalClientsCount = clientsSnap.size;

      return {
        unreadMessagesCount,
        publishedProjectsCount,
        draftProjectsCount,
        totalRevenueGhs,
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
      const q = query(
        collection(db, 'activityLogs'),
        orderBy('createdAt', 'desc'),
        limit(activityLimit)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching recent activity logs:', error);
      // Return empty array on failure so UI loads gracefully without crashing
      return [];
    }
  }
};