import React, { useState, useEffect } from 'react';
import { Save, FileText, HelpCircle } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { logActivity } from '../../services/loggingService';
import { LOG_TYPES } from '../../types/schema';
import { useAuth } from '../../shared/AuthContext';

const ContentManagement = () => {
  const { user } = useAuth();
  const [agreement, setAgreement] = useState('');
  const [instructions, setInstructions] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const docRef = doc(db, 'config', 'content');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAgreement(docSnap.data().agreement);
        setInstructions(docSnap.data().instructions);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const loadingToast = toast.loading('Saving content changes...');
    try {
      await setDoc(doc(db, 'config', 'content'), {
        agreement,
        instructions,
        updatedAt: new Date()
      });
      
      await logActivity('content_updated', user.uid, {
        hasAgreement: !!agreement,
        hasInstructions: !!instructions
      });

      toast.success('Content updated successfully!', { id: loadingToast });
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error('Failed to save content.', { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold">Content Management</h2>
        <p className="text-gray-500">Edit the agreement and instructions shown to creators.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-bold text-gray-700">
            <FileText className="mr-2 h-4 w-4 text-pok-blue" />
            Partnership Agreement (Markdown supported)
          </label>
          <textarea 
            className="w-full h-64 p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:border-pok-blue focus:bg-white focus:outline-none font-mono text-sm transition-all"
            value={agreement}
            onChange={(e) => setAgreement(e.target.value)}
            placeholder="Enter the partnership terms..."
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-bold text-gray-700">
            <HelpCircle className="mr-2 h-4 w-4 text-pok-yellow" />
            Creator Instructions
          </label>
          <textarea 
            className="w-full h-48 p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:border-pok-blue focus:bg-white focus:outline-none font-sans text-sm transition-all"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter instructions for creators..."
          />
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-pok-blue text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-pok-light-blue transition-all disabled:bg-gray-300"
          >
            <Save className="mr-2 h-5 w-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
