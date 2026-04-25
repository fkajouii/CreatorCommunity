import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { TrendingUp, Users, Eye, DollarSign } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, query, onSnapshot, orderBy, limit, where } from 'firebase/firestore';
import { PAYOUT_STATUS, CREATOR_STATUS } from '../../types/schema';

const NetworkStats = () => {
  const [trendData, setTrendData] = useState([
    { name: 'Mon', views: 0, payouts: 0 },
    { name: 'Tue', views: 0, payouts: 0 },
    { name: 'Wed', views: 0, payouts: 0 },
    { name: 'Thu', views: 0, payouts: 0 },
    { name: 'Fri', views: 0, payouts: 0 },
    { name: 'Sat', views: 0, payouts: 0 },
    { name: 'Sun', views: 0, payouts: 0 },
  ]);

  const [creatorData, setCreatorData] = useState([]);
  const [stats, setStats] = useState({
    avgCpv: 0,
    engagement: 4.5,
    newLeads: 0,
    totalPaid: 0
  });

  useEffect(() => {
    // Top Creators
    const unsubscribeCreators = onSnapshot(
      query(collection(db, 'creators'), orderBy('totalViews', 'desc'), limit(5)),
      (snapshot) => {
        const topCreators = snapshot.docs.map(doc => ({
          name: doc.data().name || 'Unknown',
          views: doc.data().totalViews || 0
        }));
        setCreatorData(topCreators);

        const allCreators = snapshot.docs.map(doc => doc.data());
        const leadCount = allCreators.filter(c => c.status === CREATOR_STATUS.LEAD).length;
        setStats(prev => ({ ...prev, newLeads: leadCount }));
      }
    );

    // Total Paid
    const unsubscribePayouts = onSnapshot(
      query(collection(db, 'payouts'), where('status', '==', PAYOUT_STATUS.PAID)),
      (snapshot) => {
        const total = snapshot.docs.reduce((acc, doc) => acc + (doc.data().amount || 0), 0);
        setStats(prev => ({ ...prev, totalPaid: total }));
      }
    );

    return () => {
      unsubscribeCreators();
      unsubscribePayouts();
    };
  }, []);

  const COLORS = ['#FFCB05', '#3C5AA6', '#4DAD5B', '#E3350D'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Network Analytics</h2>
        <p className="text-gray-500">Track the overall health and growth of the Pok Pok community.</p>
      </div>

      {/* Primary Trend Chart */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black">View Count Trends</h3>
          <div className="flex items-center text-pok-green font-bold">
            <TrendingUp className="mr-2 h-5 w-5" />
            +12.5% vs last week
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3C5AA6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3C5AA6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#3C5AA6" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorViews)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Creators Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black mb-8">Top Performers (Total Views)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={creatorData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#313131', fontWeight: 'bold'}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="views" radius={[0, 8, 8, 0]} barSize={24}>
                  {creatorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Stats */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Avg CPV', value: `$${(stats.avgCpv || 0).toFixed(2)}`, icon: DollarSign, color: 'bg-green-100 text-pok-green' },
            { label: 'Engagement', value: `${(stats.engagement || 0)}%`, icon: TrendingUp, color: 'bg-blue-100 text-pok-blue' },
            { label: 'New Leads', value: (stats.newLeads || 0).toString(), icon: Users, color: 'bg-yellow-100 text-pok-yellow' },
            { label: 'Total Paid', value: `$${((stats.totalPaid || 0)/1000).toFixed(1)}k`, icon: Eye, color: 'bg-red-100 text-pok-red' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkStats;
