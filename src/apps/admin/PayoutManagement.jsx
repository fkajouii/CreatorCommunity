import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { PAYOUT_STATUS, LOG_TYPES } from '../../types/schema';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { issuePayout } from '../../services/payoutService';
import { logActivity } from '../../services/loggingService';
import { useAuth } from '../../shared/AuthContext';
import { db } from '../../services/firebase';
import { collection, query, onSnapshot, orderBy, where, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { ListSkeleton } from '../../components/LoadingSkeleton';

const PayoutManagement = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, 'payouts'), orderBy('createdAt', 'desc'));
    if (filter !== 'all') {
      q = query(collection(db, 'payouts'), where('status', '==', filter), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const payoutData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPayouts(payoutData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter]);

  const handleProcessPayout = async (payout) => {
    if (window.confirm(`Are you sure you want to payout $${payout.amount} to ${payout.creatorName}?`)) {
      const loadingToast = toast.loading(`Processing payout for ${payout.creatorName}...`);
      try {
        await issuePayout(payout.creatorId, payout.amount, payout.id);
        await updateDoc(doc(db, 'payouts', payout.id), {
          status: PAYOUT_STATUS.PAID,
          paidAt: Timestamp.now()
        });
        
        await logActivity(LOG_TYPES.PAYOUT_ISSUED, user.uid, {
          payoutId: payout.id,
          creatorName: payout.creatorName,
          amount: payout.amount
        });

        toast.success(`Successfully paid $${payout.amount} to ${payout.creatorName}!`, { id: loadingToast });
      } catch (error) {
        console.error(error);
        toast.error("Payout failed. Check console for details.", { id: loadingToast });
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case PAYOUT_STATUS.PAID: return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case PAYOUT_STATUS.APPROVED: return <Clock className="h-5 w-5 text-blue-500" />;
      case PAYOUT_STATUS.PENDING: return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payout Management</h2>
          <p className="text-gray-500">Track and approve creator earnings.</p>
        </div>
        <button className="bg-pok-green text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-green-600 transition-colors">
          <DollarSign className="mr-2 h-5 w-5" />
          Process Batch
        </button>
      </div>

      {/* Summary Mini-Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Pending Approval</p>
          <p className="text-3xl font-bold text-pok-dark mt-2">
            ${payouts.filter(p => p.status === PAYOUT_STATUS.PENDING).reduce((acc, p) => acc + (p.amount || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Approved (Ready to Pay)</p>
          <p className="text-3xl font-bold text-pok-blue mt-2">
            ${payouts.filter(p => p.status === PAYOUT_STATUS.APPROVED).reduce((acc, p) => acc + (p.amount || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Paid</p>
          <p className="text-3xl font-bold text-pok-green mt-2">
            ${payouts.filter(p => p.status === PAYOUT_STATUS.PAID).reduce((acc, p) => acc + (p.amount || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payout List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex gap-4">
          {['all', 'pending', 'approved', 'paid'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors",
                filter === f ? "bg-gray-100 text-pok-dark" : "text-gray-400 hover:text-gray-600"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <ListSkeleton />
          ) : payouts.length > 0 ? payouts.map((payout) => (
            <div key={payout.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <ArrowUpRight className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{payout.creatorName || 'Creator'}</p>
                  <p className="text-sm text-gray-500">{payout.id} • {payout.method || 'Stripe'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-12">
                <div className="text-right">
                  <p className="text-lg font-black">${payout.amount?.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">
                    {payout.createdAt?.toDate().toLocaleDateString() || payout.date}
                  </p>
                </div>
                
                <div className="flex items-center w-32">
                  {getStatusIcon(payout.status)}
                  <span className={cn(
                    "ml-2 text-sm font-bold capitalize",
                    payout.status === PAYOUT_STATUS.PAID ? "text-green-600" : 
                    payout.status === PAYOUT_STATUS.APPROVED ? "text-blue-600" : "text-yellow-600"
                  )}>
                    {payout.status}
                  </span>
                </div>

                {payout.status === PAYOUT_STATUS.APPROVED ? (
                  <button 
                    onClick={() => handleProcessPayout(payout)}
                    className="bg-pok-blue text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-pok-light-blue transition-colors"
                  >
                    Pay Now
                  </button>
                ) : (
                  <button className="text-gray-300 hover:text-pok-blue">
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
          )) : (
            <div className="p-12 text-center">
              <p className="text-gray-400 font-bold">No payouts found matching your filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayoutManagement;
