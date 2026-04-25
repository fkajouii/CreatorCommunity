import React, { useState, useEffect } from 'react';
import { MoreVertical, Filter, Download, Eye } from 'lucide-react';
import { CREATOR_STATUS, LOG_TYPES } from '../../types/schema';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import CreatorReviewModal from './CreatorReviewModal';
import { logActivity } from '../../services/loggingService';
import { useAuth } from '../../shared/AuthContext';
import { db } from '../../services/firebase';
import { collection, query, onSnapshot, doc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';

const CreatorList = () => {
  const { user } = useAuth();
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'creators'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const creatorData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCreators(creatorData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleReview = (creator) => {
    setSelectedCreator(creator);
    setIsModalOpen(true);
  };

  const handleAction = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'creators', id), {
        status: newStatus,
        updatedAt: Timestamp.now()
      });

      if (newStatus === CREATOR_STATUS.VALIDATED) {
        // Automatically create a draft agreement
        await addDoc(collection(db, 'agreements'), {
          creatorId: id,
          status: 'draft',
          createdAt: Timestamp.now(),
          content: "Standard Partnership Agreement" // This could be fetched from config/content
        });
      }

      await logActivity(LOG_TYPES.CREATOR_STATUS_CHANGE, user.uid, {
        creatorId: id,
        newStatus: newStatus
      });

      toast.success(`Creator status updated to ${newStatus.replace('_', ' ')}`);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating creator:", error);
      toast.error("Failed to update status.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case CREATOR_STATUS.ACTIVE: return 'bg-green-100 text-green-800';
      case CREATOR_STATUS.LEAD: return 'bg-blue-100 text-blue-800';
      case CREATOR_STATUS.VALIDATED: return 'bg-yellow-100 text-yellow-800';
      case CREATOR_STATUS.SIGNED: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Creators</h2>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="mr-2 h-4 w-4 text-gray-400" />
            Filter
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4 text-gray-400" />
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-lg" />)}
        </div>
      ) : creators.length > 0 ? (
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Views</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {creators.map((creator) => (
              <tr key={creator.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-pok-yellow flex items-center justify-center font-bold text-pok-dark">
                      {creator.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{creator.name}</div>
                      <div className="text-sm text-gray-500">{creator.handle}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider", getStatusColor(creator.status))}>
                    {creator.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {creator.metadata?.avgViews || creator.views || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {creator.createdAt?.toDate().toLocaleDateString() || creator.joined || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => handleReview(creator)}
                      className="p-2 text-pok-blue hover:bg-blue-50 rounded-lg transition-colors"
                      title="Review Profile"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
          <div className="bg-gray-50 p-6 rounded-full mb-6 text-gray-300">
            <Users className="h-12 w-12" />
          </div>
          <h3 className="text-xl font-black text-gray-400">No creators found</h3>
          <p className="text-gray-400 mt-2">Start by discovering leads or adding them manually.</p>
        </div>
      )}

      <CreatorReviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        creator={selectedCreator}
        onAction={handleAction}
      />
    </div>
  );
};

export default CreatorList;
