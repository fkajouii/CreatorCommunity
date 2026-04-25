import React, { useState, useEffect } from 'react';
import { useAuth } from '../shared/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { loginWithGoogle, sendMagicLink, completeMagicLinkSignIn, isAdmin, user } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMagicLink = async () => {
      try {
        const result = await completeMagicLinkSignIn();
        if (result) {
          toast.success("Signed in successfully!");
        }
      } catch (error) {
        console.error("Magic link error:", error);
      }
    };
    handleMagicLink();
  }, []);

  // Handle Redirection when auth state is resolved
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    }
  }, [user, isAdmin, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await sendMagicLink(email);
      setSent(true);
      toast.success("Magic link sent! Check your email.");
    } catch (error) {
      console.error("Magic link failed:", error);
      toast.error("Failed to send link. Check your email format.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pok-yellow p-6">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-pok-blue italic">Pok Pok</h1>
          <p className="text-gray-500 font-bold">Community Portal</p>
        </div>
        
        <div className="py-8">
          <div className="w-24 h-24 bg-blue-50 rounded-full mx-auto flex items-center justify-center mb-6">
            <span className="text-4xl">👋</span>
          </div>
          <h2 className="text-2xl font-black">Welcome Back!</h2>
          <p className="text-gray-500 mt-2">Sign in to manage your creator journey or organization.</p>
        </div>

        <form onSubmit={handleMagicLink} className="space-y-3">
          <input 
            type="email" 
            placeholder="Enter your email"
            className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-pok-blue focus:bg-white focus:outline-none font-bold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sent}
          />
          <button 
            type="submit"
            disabled={sent}
            className="w-full bg-pok-blue text-white py-4 rounded-2xl font-bold text-lg hover:bg-pok-light-blue transition-all active:scale-95 disabled:bg-gray-300"
          >
            {sent ? 'Link Sent!' : 'Send Magic Link'}
          </button>
        </form>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white border-2 border-gray-100 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all active:scale-95"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>
        
        <p className="text-xs text-gray-400">
          By signing in, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
