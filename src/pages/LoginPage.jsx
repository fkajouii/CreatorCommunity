import React from 'react';
import { useAuth } from '../shared/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
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

        <button 
          onClick={handleLogin}
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
