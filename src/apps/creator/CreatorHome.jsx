import React from 'react';
import { Sparkles, ArrowRight, Video, FileText, Share2, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { connectTikTokAccount } from '../../services/videoService';
import { createStripeAccount } from '../../services/payoutService';
import { useAuth } from '../../shared/AuthContext';

const CreatorHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStripeOnboarding = async () => {
    if (user) {
      const url = await createStripeAccount(user.uid, user.email);
      window.location.href = url;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <section className="bg-pok-blue rounded-[2.5rem] p-8 lg:p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-4xl lg:text-5xl font-black mb-4">Welcome to the family, Alex! 🎨</h2>
          <p className="text-blue-100 text-lg mb-8">
            We're so excited to have you creating magic for Pok Pok. Your journey to sparking curiosity starts here.
          </p>
          <button 
            onClick={() => navigate('/portal/instructions')}
            className="bg-pok-yellow text-pok-dark px-8 py-4 rounded-2xl font-black text-xl flex items-center hover:scale-105 transition-transform"
          >
            Start Creating
            <ArrowRight className="ml-3 h-6 w-6" />
          </button>
        </div>
        
        {/* Decorative Blobs */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-pok-yellow rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[10%] w-48 h-48 bg-pok-red rounded-full opacity-20 blur-3xl" />
      </section>

      {/* TikTok Connection Prompt (Optional/Conditional) */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="bg-black p-4 rounded-2xl">
            <Share2 className="text-white h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-black">Link your TikTok</h3>
            <p className="text-gray-500">Connect to automatically track your video views.</p>
          </div>
        </div>
        <button 
          onClick={connectTikTokAccount}
          className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          Connect Now
        </button>
      </section>

      {/* Stripe Connection Prompt */}
      <section className="bg-pok-green/5 p-8 rounded-[2rem] shadow-sm border border-pok-green/20 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="bg-pok-green p-4 rounded-2xl">
            <DollarSign className="text-white h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-black">Get Paid</h3>
            <p className="text-gray-500">Setup your Stripe account to receive payouts.</p>
          </div>
        </div>
        <button 
          onClick={handleStripeOnboarding}
          className="bg-pok-green text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
        >
          Setup Payments
        </button>
      </section>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <FileText className="text-pok-green h-8 w-8" />
          </div>
          <h3 className="text-2xl font-black mb-2">Sign Agreement</h3>
          <p className="text-gray-500 mb-6">Review and accept the creator partnership terms to get started.</p>
          <button 
            onClick={() => navigate('/portal/agreement')}
            className="w-full py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50"
          >
            Review Terms
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <Video className="text-purple-600 h-8 w-8" />
          </div>
          <h3 className="text-2xl font-black mb-2">Submit Content</h3>
          <p className="text-gray-500 mb-6">Posted your TikTok? Share the link with us to track your views.</p>
          <button 
            onClick={() => navigate('/portal/videos')}
            className="w-full py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50"
          >
            Submit Link
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black">Your Impact</h3>
          <Sparkles className="text-pok-yellow h-8 w-8" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-black text-pok-blue">12.5k</p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Views</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-3xl font-black text-pok-blue">3</p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Videos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-pok-green">$150</p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Earned</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreatorHome;
