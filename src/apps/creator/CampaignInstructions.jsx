import React, { useState, useEffect } from 'react';
import { HelpCircle, Target, Sparkles } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../shared/AuthContext';

const CampaignInstructions = () => {
  const { user } = useAuth();
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructions = async () => {
      if (!user) return;
      
      try {
        // 1. Get creator's campaigns
        const creatorDoc = await getDoc(doc(db, 'creators', user.uid));
        const campaignIds = creatorDoc.data()?.campaignIds || [];
        
        // 2. Fetch global instructions from config
        const configDoc = await getDoc(doc(db, 'config', 'content'));
        const globalInstructions = configDoc.data()?.instructions;

        // 3. Fetch specific campaign instructions
        const campaignInstructions = [];
        for (const id of campaignIds) {
          const campDoc = await getDoc(doc(db, 'campaigns', id));
          if (campDoc.exists() && campDoc.data().instructions) {
            campaignInstructions.push({
              title: campDoc.data().title,
              text: campDoc.data().instructions
            });
          }
        }

        setInstructions([
          { title: 'Global Guidelines', text: globalInstructions, isGlobal: true },
          ...campaignInstructions
        ]);
      } catch (error) {
        console.error("Error fetching instructions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, [user]);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-40 bg-white rounded-[2rem]" /></div>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black">Instructions</h2>
      
      {instructions.map((item, i) => (
        <div key={i} className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-sm space-y-6">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "p-3 rounded-2xl",
              item.isGlobal ? "bg-pok-yellow/10 text-pok-yellow" : "bg-pok-blue/10 text-pok-blue"
            )}>
              {item.isGlobal ? <Sparkles className="h-6 w-6" /> : <Target className="h-6 w-6" />}
            </div>
            <h3 className="text-xl font-black">{item.title}</h3>
          </div>
          
          <div className="prose prose-slate max-w-none text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
            {item.text || 'No specific instructions provided.'}
          </div>
        </div>
      ))}
    </div>
  );
};

import { cn } from '../../utils/cn';

export default CampaignInstructions;
