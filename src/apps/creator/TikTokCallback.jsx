import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../shared/AuthContext';
import toast from 'react-hot-toast';

const TikTokCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const savedState = localStorage.getItem('tiktok_state');

      if (code && state === savedState && user) {
        try {
          // In a real app, you would exchange this code for an access token
          // via a backend Cloud Function to keep the client secret secure.
          // For now, we'll simulate the successful link in Firestore.
          
          await updateDoc(doc(db, 'users', user.uid), {
            tiktokConnected: true,
            tiktokLastLinked: new Date(),
            // tiktokAccessToken: ... (stored securely)
          });
          
          navigate('/portal?tiktok=connected');
        } catch (error) {
          console.error("Error linking TikTok:", error);
          navigate('/portal?error=tiktok_link_failed');
        }
      }
    };

    handleCallback();
  }, [searchParams, user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pok-blue mx-auto"></div>
        <p className="font-bold text-gray-500">Connecting your TikTok account...</p>
      </div>
    </div>
  );
};

export default TikTokCallback;
