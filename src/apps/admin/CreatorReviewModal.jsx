import React from 'react';
import { 
  X, 
  CheckCircle, 
  User, 
  ShieldCheck, 
  TrendingUp, 
  MessageCircle, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { CREATOR_STATUS } from '../../types/schema';
import { cn } from '../../utils/cn';

const CreatorReviewModal = ({ creator, isOpen, onClose, onAction }) => {
  if (!isOpen || !creator) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-pok-blue text-white flex items-center justify-center text-2xl font-black">
              {creator.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-black">{creator.name}</h3>
              <p className="text-gray-500 font-bold">{creator.handle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <p className="text-2xl font-black text-pok-blue">{creator.metadata?.followers || '0'}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Followers</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <p className="text-2xl font-black text-pok-blue">{creator.metadata?.avgViews || '0'}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Views</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <p className="text-2xl font-black text-pok-green">{creator.metadata?.score || '0'}%</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Match Score</p>
              </div>
            </div>

            {/* Analysis */}
            <div className="space-y-4">
              <h4 className="text-lg font-black flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5 text-pok-blue" />
                Brand Fit Analysis
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Creator consistently posts high-quality family-friendly content. Their aesthetic aligns well with the "Pok Pok" organic playroom style. High engagement in the "Creative Play" niche.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Education', 'Kids', 'Creative', 'Parenting'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-50 text-pok-blue text-xs font-bold rounded-lg">#{tag}</span>
                ))}
              </div>
            </div>
            
            {/* Recent Posts (Placeholders) */}
            <div className="space-y-4">
              <h4 className="text-lg font-black flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-pok-red" />
                Recent Activity
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-[9/16] bg-gray-100 rounded-xl flex items-center justify-center text-gray-300">
                    Video {i}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8 bg-gray-50 p-6 rounded-[2rem]">
            <div className="space-y-2">
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Lead Info</h4>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <User className="mr-3 h-4 w-4 text-gray-400" />
                  <span className="font-bold">Source:</span>
                  <span className="ml-auto text-gray-500">{creator.discoverySource || 'Direct'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FileText className="mr-3 h-4 w-4 text-gray-400" />
                  <span className="font-bold">Status:</span>
                  <span className="ml-auto bg-yellow-100 text-pok-yellow px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                    {creator.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Internal Notes</h4>
              <textarea 
                className="w-full h-32 p-4 rounded-xl border-none bg-white text-sm focus:ring-2 focus:ring-pok-blue focus:outline-none"
                placeholder="Add notes for the team..."
              />
            </div>

            <div className="pt-4 space-y-3">
              <button 
                onClick={() => onAction(creator.id, CREATOR_STATUS.VALIDATED)}
                className="w-full bg-pok-blue text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center hover:bg-pok-light-blue transition-all"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Validate & Onboard
              </button>
              <button 
                onClick={() => onAction(creator.id, CREATOR_STATUS.ARCHIVED)}
                className="w-full bg-white text-pok-red border-2 border-pok-red/10 py-4 rounded-2xl font-black text-lg flex items-center justify-center hover:bg-pok-red hover:text-white transition-all"
              >
                <AlertTriangle className="mr-2 h-5 w-5" />
                Reject Lead
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorReviewModal;
