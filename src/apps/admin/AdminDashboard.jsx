import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  CheckCircle, 
  TrendingUp 
} from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, query, onSnapshot, orderBy, limit, where } from 'firebase/firestore';
import { CREATOR_STATUS, PAYOUT_STATUS } from '../../types/schema';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    creators: 0,
    campaigns: 0,
    views: '0',
    agreements: 0
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [upcomingPayouts, setUpcomingPayouts] = useState([]);

  useEffect(() => {
    // Real-time Creators count
    const unsubscribeCreators = onSnapshot(collection(db, 'creators'), (snapshot) => {
      const creators = snapshot.docs.map(doc => doc.data());
      const signed = creators.filter(c => c.status !== CREATOR_STATUS.LEAD).length;
      const totalViews = creators.reduce((acc, c) => acc + (c.totalViews || 0), 0);
      
      setStats(prev => ({
        ...prev,
        creators: snapshot.size,
        agreements: signed,
        views: totalViews > 1000000 ? `${(totalViews/1000000).toFixed(1)}M` : totalViews.toLocaleString()
      }));
    });

    // Real-time Campaigns count
    const unsubscribeCampaigns = onSnapshot(query(collection(db, 'campaigns'), where('status', '==', 'active')), (snapshot) => {
      setStats(prev => ({ ...prev, campaigns: snapshot.size }));
    });

    // Recent Leads
    const unsubscribeLeads = onSnapshot(
      query(collection(db, 'creators'), where('status', '==', CREATOR_STATUS.LEAD), orderBy('createdAt', 'desc'), limit(5)),
      (snapshot) => {
        setRecentLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    );

    // Upcoming Payouts
    const unsubscribePayouts = onSnapshot(
      query(collection(db, 'payouts'), where('status', '==', PAYOUT_STATUS.APPROVED), limit(5)),
      (snapshot) => {
        setUpcomingPayouts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    );

    return () => {
      unsubscribeCreators();
      unsubscribeCampaigns();
      unsubscribeLeads();
      unsubscribePayouts();
    };
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Performance Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Creators" 
          value={stats.creators} 
          icon={Users} 
          color="bg-pok-blue" 
        />
        <StatCard 
          label="Active Campaigns" 
          value={stats.campaigns} 
          icon={TrendingUp} 
          color="bg-pok-green" 
        />
        <StatCard 
          label="Total Views" 
          value={stats.views} 
          icon={Eye} 
          color="bg-pok-yellow" 
        />
        <StatCard 
          label="Signed Agreements" 
          value={stats.agreements} 
          icon={CheckCircle} 
          color="bg-pok-red" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Recent Leads</h3>
          <div className="space-y-4">
            {recentLeads.length > 0 ? recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-pok-blue/10 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-pok-blue" />
                  </div>
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-gray-500">@{lead.tiktokHandle}</p>
                  </div>
                </div>
                <button className="text-sm text-pok-blue font-medium hover:underline">Review</button>
              </div>
            )) : (
              <p className="text-sm text-gray-400 py-4 text-center">No new leads to review</p>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Upcoming Payouts</h3>
          <div className="space-y-4">
            {upcomingPayouts.length > 0 ? upcomingPayouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium">{payout.creatorName}</p>
                  <p className="text-xs text-gray-500">Approved • Ready for processing</p>
                </div>
                <p className="font-bold text-pok-green">${payout.amount?.toFixed(2)}</p>
              </div>
            )) : (
              <p className="text-sm text-gray-400 py-4 text-center">No payouts pending processing</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
