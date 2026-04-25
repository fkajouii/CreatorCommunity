import React, { useState } from 'react';
import { Search, UserPlus, Star, ShieldCheck, Globe, TrendingUp } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { CREATOR_STATUS, LOG_TYPES } from '../../types/schema';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { logActivity } from '../../services/loggingService';
import { useAuth } from '../../shared/AuthContext';

const CreatorDiscovery = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    
    setSearching(true);
    // Simulate discovery API results
    setTimeout(() => {
      const mockResults = [
        { id: 'd1', name: 'Emily Art', handle: '@emily_art_play', followers: '1.2M', avgViews: '250k', category: 'Kids & Family', score: 98 },
        { id: 'd2', name: 'Creative Dad', handle: '@creativedad_official', followers: '850k', avgViews: '120k', category: 'Parenting', score: 92 },
        { id: 'd3', name: 'Playful Learning', handle: '@playlearn_tok', followers: '450k', avgViews: '85k', category: 'Education', score: 85 },
        { id: 'd4', name: 'Montessori Mom', handle: '@montessorimom', followers: '2.1M', avgViews: '500k', category: 'Kids & Family', score: 99 },
      ];
      setResults(mockResults);
      setSearching(false);
    }, 1200);
  };

  const saveAsLead = async (creator) => {
    try {
      const docRef = await addDoc(collection(db, 'creators'), {
        name: creator.name,
        handle: creator.handle,
        status: CREATOR_STATUS.LEAD,
        discoverySource: 'TikTok Search',
        createdAt: Timestamp.now(),
        metadata: {
          followers: creator.followers,
          avgViews: creator.avgViews,
          category: creator.category,
          score: creator.score
        }
      });

      await logActivity(LOG_TYPES.LEAD_SAVED, user.uid, {
        creatorId: docRef.id,
        handle: creator.handle
      });

      toast.success(`${creator.handle} saved as a lead!`);
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error("Failed to save lead.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Creator Discovery</h2>
        <p className="text-gray-500">Find and source potential partners for Pok Pok.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-2xl flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search keywords, categories, or handles (e.g., 'Montessori', 'Parenting')..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent bg-white shadow-sm focus:border-pok-blue focus:outline-none font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button 
          type="submit"
          disabled={searching}
          className="bg-pok-blue text-white px-8 py-4 rounded-2xl font-bold hover:bg-pok-light-blue transition-all active:scale-95 disabled:bg-gray-300"
        >
          {searching ? 'Searching...' : 'Discover'}
        </button>
      </form>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((creator) => (
          <div key={creator.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-start justify-between group hover:border-pok-blue transition-colors">
            <div className="flex space-x-6">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-400">
                {creator.name.charAt(0)}
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-black">{creator.name}</h3>
                    {creator.score > 95 && <ShieldCheck className="h-4 w-4 text-pok-green" />}
                  </div>
                  <p className="text-gray-500 font-bold">{creator.handle}</p>
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex items-center text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                    <Globe className="mr-1 h-3 w-3" />
                    {creator.followers}
                  </div>
                  <div className="flex items-center text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {creator.avgViews} views
                  </div>
                </div>
                <div className="inline-block bg-yellow-50 text-pok-yellow text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
                  {creator.category}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-4">
              <div className="flex items-center text-pok-green">
                <Star className="fill-current h-4 w-4 mr-1" />
                <span className="font-black">{creator.score}</span>
              </div>
              <button 
                onClick={() => saveAsLead(creator)}
                className="bg-gray-50 text-gray-600 p-3 rounded-xl hover:bg-pok-blue hover:text-white transition-all group-hover:scale-110"
                title="Save as Lead"
              >
                <UserPlus className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {!searching && results.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-bold">Enter keywords to start finding creators for Pok Pok.</p>
        </div>
      )}
    </div>
  );
};

export default CreatorDiscovery;
