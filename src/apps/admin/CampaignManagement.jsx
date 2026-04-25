import React, { useState, useEffect } from 'react';
import { Plus, Target, Users, Calendar, ArrowRight, Tag } from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import CampaignEditorModal from './CampaignEditorModal';
import { logActivity } from '../../services/loggingService';
import { LOG_TYPES } from '../../types/schema';
import { useAuth } from '../../shared/AuthContext';
import { db } from '../../services/firebase';
import { collection, onSnapshot, query, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore';
import { CardSkeleton } from '../../components/LoadingSkeleton';

const CampaignManagement = () => {
  const { user } = useAuth();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'campaigns'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const campaignData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCampaigns(campaignData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedCampaign?.id) {
        await setDoc(doc(db, 'campaigns', selectedCampaign.id), {
          ...data,
          updatedAt: Timestamp.now()
        }, { merge: true });

        await logActivity(LOG_TYPES.CAMPAIGN_UPDATED, user.uid, {
          campaignId: selectedCampaign.id,
          title: data.title
        });

        toast.success("Campaign updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, 'campaigns'), {
          ...data,
          status: 'draft',
          creators: 0,
          views: 0,
          createdAt: Timestamp.now()
        });

        await logActivity(LOG_TYPES.CAMPAIGN_CREATED, user.uid, {
          campaignId: docRef.id,
          title: data.title
        });

        toast.success("New campaign created!");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast.error("Failed to save campaign.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Campaigns</h2>
          <p className="text-gray-500">Organize creator partnerships into focused campaigns.</p>
        </div>
        <button 
          onClick={() => { setSelectedCampaign(null); setIsModalOpen(true); }}
          className="bg-pok-blue text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-pok-light-blue transition-all"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <CardSkeleton key={i} />)
        ) : campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 group hover:border-pok-blue transition-all">
            <div className="flex justify-between items-start">
              <div className="bg-blue-50 p-4 rounded-2xl group-hover:bg-pok-blue group-hover:text-white transition-colors">
                <Target className="h-6 w-6" />
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                campaign.status === 'active' ? "bg-green-100 text-pok-green" : 
                campaign.status === 'draft' ? "bg-yellow-100 text-pok-yellow" : "bg-gray-100 text-gray-500"
              )}>
                {campaign.status}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black">{campaign.title}</h3>
              <div className="flex items-center text-gray-400 text-sm mt-2 font-bold">
                <Calendar className="mr-2 h-4 w-4" />
                Ends {campaign.deadline}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Creators</p>
                <div className="flex items-center font-black mt-1">
                  <Users className="mr-2 h-4 w-4 text-gray-300" />
                  {campaign.creators}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Budget</p>
                <div className="flex items-center font-black mt-1">
                  <Tag className="mr-2 h-4 w-4 text-gray-300" />
                  {campaign.budget}
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleEdit(campaign)}
              className="w-full py-4 bg-gray-50 rounded-2xl font-bold text-gray-600 group-hover:bg-pok-blue group-hover:text-white flex items-center justify-center transition-all"
            >
              Manage Campaign
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <CampaignEditorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaign={selectedCampaign}
        onSave={handleSave}
      />
    </div>
  );
};

export default CampaignManagement;
