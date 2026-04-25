import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  Timestamp,
  increment
} from 'firebase/firestore';

/**
 * Fetches video metadata using TikTok's Native Display API.
 * Requires an access token from the authenticated creator.
 * 
 * Documentation: https://developers.tiktok.com/doc/display-api-get-video-list/
 */
export const fetchTikTokVideoData = async (accessToken, videoId) => {
  const endpoint = "https://open.tiktokapis.com/v2/video/query/";
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filters: {
          video_ids: [videoId]
        },
        fields: ["id", "view_count", "like_count", "comment_count", "share_count", "video_description"]
      })
    });

    if (!response.ok) throw new Error('Failed to fetch TikTok data');
    
    const data = await response.json();
    return data.data.videos[0];
  } catch (error) {
    console.error("TikTok API Error:", error);
    // Fallback to simulation for dev if no real token provided
    if (accessToken === 'dummy-token') {
      return {
        view_count: Math.floor(Math.random() * 5000) + 1000,
        like_count: Math.floor(Math.random() * 100)
      };
    }
    throw error;
  }
};

/**
 * Initiates TikTok OAuth flow.
 */
export const connectTikTokAccount = () => {
  const clientKey = import.meta.env.VITE_TIKTOK_CLIENT_KEY || 'dummy-key';
  const redirectUri = encodeURIComponent(window.location.origin + '/portal/tiktok-callback');
  const scope = 'video.list,user.info.basic,video.stats';
  const state = Math.random().toString(36).substring(7);
  
  localStorage.setItem('tiktok_state', state);
  
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/` +
    `?client_key=${clientKey}` +
    `&scope=${scope}` +
    `&response_type=code` +
    `&redirect_uri=${redirectUri}` +
    `&state=${state}`;
    
  window.location.href = authUrl;
};

/**
 * Helper to simulate fetching views for a URL if no API token is available.
 */
const fetchTikTokViewsFallback = async (url) => {
  // Extract ID or just return random for demo
  return Math.floor(Math.random() * 5000) + 1000;
};

/**
 * Adds a new video for a creator and initializes monitoring.
 */
export const submitVideoLink = async (creatorId, url) => {
  try {
    const videoData = {
      creatorId,
      url,
      views: 0,
      status: 'processing',
      postedAt: Timestamp.now(),
      lastUpdated: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, 'videos'), videoData);
    
    // Trigger initial view fetch
    const initialViews = await fetchTikTokViewsFallback(url);
    await updateDoc(docRef, {
      views: initialViews,
      status: 'active',
      lastUpdated: Timestamp.now()
    });
    
    return { id: docRef.id, ...videoData, views: initialViews };
  } catch (error) {
    console.error("Error submitting video link:", error);
    throw error;
  }
};

/**
 * Updates views for all active videos.
 * This would typically run in a Cloud Function on a schedule.
 */
export const updateAllVideoViews = async () => {
  const q = query(collection(db, 'videos'), where('status', '==', 'active'));
  const querySnapshot = await getDocs(q);
  
  const updates = querySnapshot.docs.map(async (videoDoc) => {
    // In production, we would use the TikTok API with the creator's token
    const growth = Math.floor(Math.random() * 200); 
    return updateDoc(doc(db, 'videos', videoDoc.id), {
      views: increment(growth),
      lastUpdated: Timestamp.now()
    });
  });
  
  return Promise.all(updates);
};
