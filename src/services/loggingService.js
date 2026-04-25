import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

/**
 * Log an administrative or system action to Firestore for audit purposes.
 * @param {string} type - The type of log (from LOG_TYPES)
 * @param {string} adminId - The ID of the admin who performed the action
 * @param {Object} details - Metadata about the action
 */
export const logActivity = async (type, adminId, details = {}) => {
  try {
    await addDoc(collection(db, 'activity_logs'), {
      type,
      adminId,
      details,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
