import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Plus, ExternalLink, Eye, Clock, Lock } from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { useAuth } from '../../shared/AuthContext';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { CREATOR_STATUS } from '../../types/schema';
import { Link } from 'react-router-dom';

const VideoSubmission = () => {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([
    { id: 1, url: 'https://tiktok.com/@alex/video/123', views: '12,450', date: '2 days ago', status: 'Approved' },
    { id: 2, url: 'https://tiktok.com/@alex/video/456', views: '3,200', date: '5 days ago', status: 'Pending' },
  ]);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) return;
      const creatorDoc = await getDoc(doc(db, 'creators', user.uid));
      if (creatorDoc.exists() && creatorDoc.data().status === CREATOR_STATUS.ACTIVE) {
        setIsLocked(false);
      }
      setLoading(false);
    };
    checkStatus();
  }, [user]);

  const validateTikTokUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(tiktok\.com\/(@[\w.-]+\/video\/\d+|v\/\d+))/;
    return regex.test(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url) return;
    
    if (!validateTikTokUrl(url)) {
      toast.error("Please enter a valid TikTok video URL (e.g., https://www.tiktok.com/@user/video/123)");
      return;
    }
    
    const newVideo = {
      id: Date.now(),
      url: url,
      views: '0',
      date: 'Just now',
      status: 'Processing'
    };
    
    setVideos([newVideo, ...videos]);
    setUrl('');
    toast.success("Video submitted for processing!");
  };

  if (loading) return <div className="animate-pulse h-64 bg-white rounded-[2rem]" />;

  return (
    <div className="space-y-8">
      {isLocked && (
        <div className="bg-pok-blue p-8 rounded-[2rem] text-white flex items-center space-x-6">
          <div className="bg-white/20 p-4 rounded-2xl">
            <Lock className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black">Submissions Locked</h3>
            <p className="text-blue-100">You must sign the partnership agreement before you can submit videos.</p>
          </div>
          <Link 
            to="/portal/agreement"
            className="bg-pok-yellow text-pok-dark px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Sign Now
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-black">My Videos</h2>
        <form onSubmit={handleSubmit} className="flex-1 max-w-xl flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              disabled={isLocked}
              placeholder={isLocked ? "Complete agreement to unlock" : "Paste TikTok video link..."}
              className={cn(
                "w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent bg-white shadow-sm focus:border-pok-blue focus:outline-none font-medium",
                isLocked && "opacity-50 cursor-not-allowed"
              )}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={isLocked}
            className={cn(
              "bg-pok-blue text-white px-8 py-4 rounded-2xl font-bold flex items-center transition-colors",
              isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-pok-light-blue"
            )}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add
          </button>
        </form>
      </div>

      {videos.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group">
            <div className="aspect-[9/16] bg-gray-100 relative flex items-center justify-center overflow-hidden">
              <Video className="h-12 w-12 text-gray-300" />
              <div className="absolute top-4 right-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase",
                  video.status === 'Approved' ? "bg-green-100 text-pok-green" : "bg-yellow-100 text-yellow-700"
                )}>
                  {video.status}
                </span>
              </div>
              <a 
                href={video.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ExternalLink className="text-white h-8 w-8" />
              </a>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-500 text-sm font-bold">
                  <Clock className="mr-2 h-4 w-4" />
                  {video.date}
                </div>
                <div className="flex items-center text-pok-blue font-black">
                  <Eye className="mr-2 h-5 w-5" />
                  {video.views}
                </div>
              </div>
              <div className="text-xs text-gray-400 truncate">
                {video.url}
              </div>
            </div>
          </div>
        ))}
      </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
          <div className="bg-gray-50 p-6 rounded-full mb-6">
            <Video className="h-12 w-12 text-gray-300" />
          </div>
          <h3 className="text-xl font-black text-gray-400">No videos yet</h3>
          <p className="text-gray-400 mt-2">Paste a link above to start tracking your views!</p>
        </div>
      )}
    </div>
  );
};

// Import Video for placeholder
import { Video } from 'lucide-react';

export default VideoSubmission;
