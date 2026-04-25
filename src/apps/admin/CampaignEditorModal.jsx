import React, { useState } from 'react';
import { X, Save, HelpCircle, FileText, Target } from 'lucide-react';

const CampaignEditorModal = ({ campaign, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: campaign?.title || '',
    instructions: campaign?.instructions || '',
    agreementText: campaign?.agreementText || '',
    deadline: campaign?.deadline || '',
    budget: campaign?.budget || ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-pok-bg">
          <div className="flex items-center space-x-4">
            <div className="bg-pok-blue p-3 rounded-2xl text-white">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black">{campaign ? 'Edit Campaign' : 'New Campaign'}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Campaign Title</label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-pok-blue focus:bg-white focus:outline-none font-bold"
                placeholder="e.g. Back to School 2024"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Deadline</label>
              <input 
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-pok-blue focus:bg-white focus:outline-none font-bold"
                placeholder="e.g. Aug 30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-black text-gray-400 uppercase tracking-widest">
              <HelpCircle className="mr-2 h-4 w-4 text-pok-yellow" />
              Campaign Instructions
            </label>
            <textarea 
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              className="w-full h-40 p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-pok-blue focus:bg-white focus:outline-none font-medium leading-relaxed"
              placeholder="What should creators do for this campaign?"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-black text-gray-400 uppercase tracking-widest">
              <FileText className="mr-2 h-4 w-4 text-pok-blue" />
              Agreement Override (Optional)
            </label>
            <textarea 
              name="agreementText"
              value={formData.agreementText}
              onChange={handleChange}
              className="w-full h-40 p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-pok-blue focus:bg-white focus:outline-none font-mono text-xs"
              placeholder="Leave empty to use global standard agreement..."
            />
          </div>
        </div>

        <div className="p-8 border-t border-gray-50 flex justify-end bg-pok-bg">
          <button 
            onClick={() => onSave(formData)}
            className="bg-pok-blue text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center hover:scale-105 transition-transform"
          >
            <Save className="mr-3 h-6 w-6" />
            Save Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignEditorModal;
