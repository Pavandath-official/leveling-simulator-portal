
import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

type CustomQuestFormProps = {
  onClose: () => void;
};

const CustomQuestForm: React.FC<CustomQuestFormProps> = ({ onClose }) => {
  const { addCustomQuest } = usePlayer();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'E' | 'D' | 'C' | 'B' | 'A' | 'S'>('E');
  const [expReward, setExpReward] = useState(50);
  const [goldReward, setGoldReward] = useState(50);
  const [exerciseType, setExerciseType] = useState<'strength' | 'cardio' | 'flexibility' | 'endurance'>('strength');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addCustomQuest({
      title,
      description,
      difficulty,
      rewards: {
        exp: expReward,
        gold: goldReward
      },
      isDaily: true,
      exerciseType,
      customizable: true
    });
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in">
      <div className="max-w-md w-full bg-sl-dark border border-sl-grey-dark rounded-lg shadow-xl overflow-hidden animate-scale-in">
        <div className="p-5 border-b border-sl-grey-dark flex justify-between items-center">
          <h3 className="text-white text-lg font-medium">Create Custom Quest</h3>
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
              placeholder="e.g., 30-Day Plank Challenge"
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
              placeholder="Describe your exercise challenge..."
              rows={3}
              className="bg-sl-grey-dark/50 border border-sl-grey-dark focus:ring-sl-blue focus:border-sl-blue block w-full px-3 py-2 rounded-md text-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="bg-sl-grey-dark/50 border border-sl-grey-dark focus:ring-sl-blue focus:border-sl-blue block w-full px-3 py-2 rounded-md text-white"
              >
                <option value="E">E Rank</option>
                <option value="D">D Rank</option>
                <option value="C">C Rank</option>
                <option value="B">B Rank</option>
                <option value="A">A Rank</option>
                <option value="S">S Rank</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="exerciseType" className="block text-sm font-medium text-slate-300 mb-1">
                Exercise Type
              </label>
              <select
                id="exerciseType"
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value as any)}
                className="bg-sl-grey-dark/50 border border-sl-grey-dark focus:ring-sl-blue focus:border-sl-blue block w-full px-3 py-2 rounded-md text-white"
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="endurance">Endurance</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expReward" className="block text-sm font-medium text-slate-300 mb-1">
                EXP Reward
              </label>
              <input
                id="expReward"
                type="number"
                min="1"
                max="1000"
                value={expReward}
                onChange={(e) => setExpReward(Number(e.target.value))}
                className="bg-sl-grey-dark/50 border border-sl-grey-dark focus:ring-sl-blue focus:border-sl-blue block w-full px-3 py-2 rounded-md text-white"
              />
            </div>
            
            <div>
              <label htmlFor="goldReward" className="block text-sm font-medium text-slate-300 mb-1">
                Gold Reward
              </label>
              <input
                id="goldReward"
                type="number"
                min="0"
                max="1000"
                value={goldReward}
                onChange={(e) => setGoldReward(Number(e.target.value))}
                className="bg-sl-grey-dark/50 border border-sl-grey-dark focus:ring-sl-blue focus:border-sl-blue block w-full px-3 py-2 rounded-md text-white"
              />
            </div>
          </div>
          
          <div className="pt-3">
            <button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-sl-darker bg-sl-blue hover:bg-sl-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sl-blue transition-all duration-200"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              <span>Create Quest</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomQuestForm;
