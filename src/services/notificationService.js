import { getToken as getFcmToken } from "firebase/messaging";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, getMessagingInstance } from "../lib/firebase/firebase";
import { COLLECTIONS } from "./db";

/**
 * Request notification permission and save the FCM token for the owner
 */
export const requestAndSaveNotificationToken = async (adminId) => {
  try {
    // Check if notifications are supported in browser
    if (!("Notification" in window)) {
      console.warn("This browser does not support web push notifications.");
      return false;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission was denied by user.");
      return false;
    }

    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.warn("Firebase Messaging is not supported in this environment.");
      return false;
    }

    // Get FCM Token using your VAPID Key from environment variables
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    const currentToken = await getFcmToken(messaging, { vapidKey });

    if (currentToken) {
      // Save token under notificationTokens collection using token as doc ID to prevent duplicates
      const tokenRef = doc(db, COLLECTIONS.NOTIFICATION_TOKENS, currentToken);
      await setDoc(
        tokenRef,
        {
          adminId,
          token: currentToken,
          platform: navigator.platform || "web",
          browser: navigator.userAgent || "unknown",
          enabled: true,
          updatedAt: serverTimestamp(),
          lastUsedAt: serverTimestamp(),
        },
        { merge: true },
      );

      console.log("FCM Token successfully stored:", currentToken);
      return true;
    } else {
      console.warn(
        "No registration token available. Request permission to generate one.",
      );
      return false;
    }
  } catch (error) {
    console.error(
      "An error occurred while retrieving or saving FCM token:",
      error,
    );
    return false;
  }
};
