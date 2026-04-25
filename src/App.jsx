import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './shared/AuthContext';
import AdminLayout from './apps/admin/AdminLayout';
import AdminDashboard from './apps/admin/AdminDashboard';
import CreatorList from './apps/admin/CreatorList';
import PayoutManagement from './apps/admin/PayoutManagement';
import ContentManagement from './apps/admin/ContentManagement';
import CreatorDiscovery from './apps/admin/CreatorDiscovery';
import NetworkStats from './apps/admin/NetworkStats';
import CampaignManagement from './apps/admin/CampaignManagement';
import LoginPage from './pages/LoginPage';

// Creator App Imports
import CreatorLayout from './apps/creator/CreatorLayout';
import CreatorHome from './apps/creator/CreatorHome';
import AgreementPage from './apps/creator/AgreementPage';
import VideoSubmission from './apps/creator/VideoSubmission';
import TikTokCallback from './apps/creator/TikTokCallback';
import CampaignInstructions from './apps/creator/CampaignInstructions';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/portal" replace />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '20px',
            background: '#313131',
            color: '#fff',
            fontWeight: 'bold',
            padding: '16px 24px',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute requireAdmin>
              <AdminLayout>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="creators" element={<CreatorList />} />
              <Route path="discover" element={<CreatorDiscovery />} />
              <Route path="analytics" element={<NetworkStats />} />
              <Route path="campaigns" element={<CampaignManagement />} />
                  <Route path="agreements" element={<div className="p-8 font-bold text-gray-400 text-center py-20">Agreements Management (Coming Soon)</div>} />
                  <Route path="payouts" element={<PayoutManagement />} />
              <Route path="content" element={<ContentManagement />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* Creator Routes */}
          <Route path="/portal/*" element={
            <ProtectedRoute>
              <CreatorLayout>
                <Routes>
                  <Route index element={<CreatorHome />} />
                  <Route path="agreement" element={<AgreementPage />} />
                  <Route path="videos" element={<VideoSubmission />} />
              <Route path="tiktok-callback" element={<TikTokCallback />} />
              <Route path="instructions" element={<CampaignInstructions />} />
                </Routes>
              </CreatorLayout>
            </ProtectedRoute>
          } />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
