
import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

type EditQuestFormProps = {
  questId: string;
  initialTitle: string;
  initialDescription: string;
  onClose: () => void;
};

const EditQuestForm: React.FC<EditQuestFormProps> = ({ 
  questId, 
  initialTitle, 
  initialDescription, 
  onClose 
}) => {
  const { updateQuestDetails } = usePlayer();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuestDetails(questId, title, description);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in">
      <div className="max-w-md w-full bg-sl-dark border border-sl-grey-dark rounded-lg shadow-xl overflow-hidden animate-scale-in">
        <div className="p-5 border-b border-sl-grey-dark flex justify-between items-center">
          <h3 className="text-white text-lg font-medium">Customize Quest</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
              Quest Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-sl-grey-dark/50 border border-sl-grey-dark focus:ring-sl-blue focus:border-sl-blue block w-full px-3 py-2 rounded-md text-white"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="bg-sl-grey-dark/50 border border-sl-grey-dark focus:ring-sl-blue focus:border-sl-blue block w-full px-3 py-2 rounded-md text-white"
            />
          </div>
          
          <div className="pt-3">
            <button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-sl-darker bg-sl-blue hover:bg-sl-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sl-blue transition-all duration-200"
            >
              <Save className="mr-2 h-5 w-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestForm;
