import React, { useState, useEffect } from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../shared/AuthContext';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { CREATOR_STATUS } from '../../types/schema';
import toast from 'react-hot-toast';

const AgreementPage = () => {
  const { user } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({ agreement: '', instructions: '' });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      // 1. Check sign status
      const creatorDoc = await getDoc(doc(db, 'creators', user.uid));
      if (creatorDoc.exists() && creatorDoc.data().status === CREATOR_STATUS.ACTIVE) {
        setIsSigned(true);
      }

      // 2. Fetch live agreement content
      const configDoc = await getDoc(doc(db, 'config', 'content'));
      if (configDoc.exists()) {
        setContent(configDoc.data());
      }
      
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleSign = async () => {
    if (!user) return;
    try {
      // 1. Update creator status to active
      await updateDoc(doc(db, 'creators', user.uid), {
        status: CREATOR_STATUS.ACTIVE,
        signedAt: Timestamp.now()
      });

      // 2. Mark latest agreement as accepted
      const q = query(collection(db, 'agreements'), where('creatorId', '==', user.uid), where('status', '==', 'draft'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (agreementDoc) => {
        await updateDoc(doc(db, 'agreements', agreementDoc.id), {
          status: 'signed',
          accepted: true,
          acceptedAt: Timestamp.now()
        });
      });

      setIsSigned(true);
      toast.success("Agreement signed successfully!");
    } catch (error) {
      console.error("Error signing agreement:", error);
      toast.error("Failed to sign agreement. Please try again.");
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-white rounded-[2rem]" />;

  if (isSigned) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="bg-green-100 p-8 rounded-full">
          <ShieldCheck className="h-24 w-24 text-pok-green" />
        </div>
        <h2 className="text-4xl font-black text-pok-dark">You're all set!</h2>
        <p className="text-xl text-gray-600 max-w-md">
          Thank you for signing the agreement. You can now start creating content and submitting your links.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">Creator Partnership Agreement</h2>
        <span className="bg-pok-yellow px-4 py-1 rounded-full text-sm font-bold">DRAFT</span>
      </div>

      <div className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-sm border border-gray-100 prose prose-slate">
        <div className="whitespace-pre-wrap text-gray-600 leading-relaxed">
          {content.agreement || "Standard Partnership Agreement Content..."}
        </div>

        <div className="h-px bg-gray-100 my-8" />

        <div className="space-y-6">
          <label className="flex items-start space-x-4 cursor-pointer group">
            <div className="relative mt-1">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={accepted} 
                onChange={() => setAccepted(!accepted)} 
              />
              <div className={cn(
                "w-6 h-6 border-2 rounded-md transition-colors",
                accepted ? "bg-pok-blue border-pok-blue" : "border-gray-300 group-hover:border-pok-blue"
              )}>
                {accepted && <CheckCircle className="h-5 w-5 text-white absolute inset-0 m-auto" />}
              </div>
            </div>
            <span className="text-gray-600 font-medium">
              I have read and agree to the terms and conditions of the Pok Pok Creator Partnership Agreement.
            </span>
          </label>

          <button 
            disabled={!accepted}
            onClick={handleSign}
            className={cn(
              "w-full py-5 rounded-2xl font-black text-xl transition-all shadow-lg shadow-blue-100",
              accepted 
                ? "bg-pok-blue text-white hover:bg-pok-light-blue active:scale-[0.98]" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            Sign Agreement
          </button>
        </div>
      </div>
    </div>
  );
};

// Import cn to avoid error
import { cn } from '../../utils/cn';

export default AgreementPage;
