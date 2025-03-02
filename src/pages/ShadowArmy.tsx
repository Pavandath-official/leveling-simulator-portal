import React, { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Ghost, Shield, Sword, Wand2, User, ArrowRight, Sparkles, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";

const ShadowArmy = () => {
  const { shadows, ariseShadow, extractShadow } = usePlayer();
  const [selectedShadow, setSelectedShadow] = useState<string | null>(null);
  const [showAriseAnimation, setShowAriseAnimation] = useState(false);
  const [shadowToArise, setShadowToArise] = useState<string | null>(null);
  const [showExtractDialog, setShowExtractDialog] = useState(false);

  const ariseCommand = (id: string) => {
    setShadowToArise(id);
    setShowAriseAnimation(true);
    
    // Complete the arise animation after 3 seconds
    setTimeout(() => {
      setShowAriseAnimation(false);
      ariseShadow(id);
      setSelectedShadow(null);
    }, 3000);
  };

  const getShadowIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'soldier':
        return <User className="w-6 h-6" />;
      case 'knight':
        return <Shield className="w-6 h-6" />;
      case 'mage':
        return <Wand2 className="w-6 h-6" />;
      case 'assassin':
        return <Sword className="w-6 h-6" />;
      default:
        return <Ghost className="w-6 h-6" />;
    }
  };

  const handleManualExtraction = (type: string) => {
    extractShadow(type);
    setShowExtractDialog(false);
  };

  // Group shadows by arisen status
  const arisenShadows = shadows.filter(shadow => shadow.arisen);
  const unarisen = shadows.filter(shadow => !shadow.arisen);

  return (
    <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
      <div className="mt-8 mb-12 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-sl-dark border border-sl-purple/30 text-sl-purple text-sm mb-3">
          Shadow Management
        </div>
        <h1 className="sl-heading mb-2">[Shadow Army]</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Manage your shadow army. Extract shadows from defeated enemies and command them with the power of necromancy.
        </p>
        
        {/* Manual Extraction Button */}
        <Button 
          variant="outline" 
          onClick={() => setShowExtractDialog(true)} 
          className="mt-4 border-sl-purple/50 text-sl-purple hover:bg-sl-purple/10 hover:text-sl-purple-light"
        >
          <Plus className="w-4 h-4 mr-2" />
          Extract Shadow (Test)
        </Button>
      </div>

      {/* Manual Extract Dialog */}
      <AnimatePresence>
        {showExtractDialog && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExtractDialog(false)}
          >
            <motion.div 
              className="bg-sl-dark border border-sl-grey-dark/50 rounded-lg p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Ghost className="text-sl-purple mr-2" />
                Extract Shadow
              </h3>
              <p className="text-slate-300 mb-6">
                Select a shadow type to extract. In the real game, shadows would be extracted automatically when leveling up.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {["soldier", "knight", "mage", "beast", "assassin"].map(type => (
                  <Button 
                    key={type}
                    variant="outline"
                    className="flex items-center justify-start border-sl-grey-dark/50 hover:border-sl-purple/50 hover:bg-sl-purple/10"
                    onClick={() => handleManualExtraction(type)}
                  >
                    {getShadowIcon(type)}
                    <span className="ml-2 capitalize">{type}</span>
                  </Button>
                ))}
              </div>
              
              <Button 
                className="w-full mt-4 bg-sl-dark border border-sl-grey-dark text-sl-grey hover:border-sl-grey-dark/80"
                onClick={() => setShowExtractDialog(false)}
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arise Animation */}
      <AnimatePresence>
        {showAriseAnimation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <motion.h2
                className="text-7xl font-orbitron text-sl-purple mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  textShadow: [
                    "0 0 7px #9b87f5",
                    "0 0 10px #9b87f5",
                    "0 0 21px #9b87f5",
                    "0 0 42px #9b87f5",
                    "0 0 82px #9b87f5",
                    "0 0 92px #9b87f5",
                    "0 0 102px #9b87f5",
                    "0 0 151px #9b87f5"
                  ]
                }}
                transition={{ 
                  delay: 0.5, 
                  duration: 0.8,
                  textShadow: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
              >
                ARISE
              </motion.h2>
              
              <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <motion.div 
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "radial-gradient(circle, rgba(155,135,245,0) 0%, rgba(155,135,245,0) 100%)",
                      "radial-gradient(circle, rgba(155,135,245,0.3) 0%, rgba(155,135,245,0) 70%)",
                      "radial-gradient(circle, rgba(155,135,245,0) 0%, rgba(155,135,245,0) 100%)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
                <Ghost className="w-24 h-24 mx-auto text-sl-purple opacity-80" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shadow Army Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sl-card animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <Ghost className="text-sl-purple mr-2 w-5 h-5" />
              Shadow Army Overview
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              Your shadow army consists of defeated enemies that you have extracted.
              Use the "Arise" command to permanently add them to your shadow legion.
            </p>

            <div className="space-y-4">
              <div className="bg-sl-grey-dark/30 p-4 rounded-md border border-sl-grey-dark/50">
                <div className="flex items-center mb-2">
                  <Ghost className="text-sl-purple w-5 h-5 mr-2" />
                  <h4 className="text-white font-medium">Total Shadows</h4>
                </div>
                <div className="mt-2 text-white font-medium">
                  {shadows.length} Shadows Collected
                </div>
              </div>

              <div className="bg-sl-grey-dark/30 p-4 rounded-md border border-sl-grey-dark/50">
                <div className="flex items-center mb-2">
                  <Sparkles className="text-sl-blue w-5 h-5 mr-2" />
                  <h4 className="text-white font-medium">Arisen Shadows</h4>
                </div>
                <div className="mt-2 text-white font-medium">
                  {arisenShadows.length} / {shadows.length} Shadows Arisen
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shadow Collection */}
        <div className="lg:col-span-2 space-y-6">
          {unarisen.length > 0 && (
            <div className="sl-card animate-fade-in">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center">
                <Ghost className="text-sl-grey mr-2 w-5 h-5" />
                Extracted Shadows
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {unarisen.map((shadow) => (
                  <div 
                    key={shadow.id}
                    className={`border rounded-md transition-all duration-300 ${
                      selectedShadow === shadow.id 
                        ? 'border-sl-purple sl-border-glow' 
                        : 'border-sl-grey-dark hover:border-sl-purple/50'
                    } cursor-pointer relative`}
                    onClick={() => setSelectedShadow(
                      selectedShadow === shadow.id ? null : shadow.id
                    )}
                  >
                    <div className="p-4 flex items-center">
                      <div className={`w-12 h-12 rounded-md flex items-center justify-center mr-3 bg-sl-grey-dark/50`}>
                        {getShadowIcon(shadow.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{shadow.name}</h4>
                        <div className="flex items-center mt-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-sl-grey-dark text-sl-blue mr-2">
                            Lv. {shadow.level}
                          </span>
                          <span className="text-xs flex items-center text-slate-400">
                            Power: {shadow.power}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedShadow === shadow.id && (
                      <div className="p-4 border-t border-sl-grey-dark bg-sl-dark/30 animate-fade-in">
                        <p className="text-slate-300 mb-3 text-sm">
                          A {shadow.type} shadow with power level {shadow.power}. 
                          Use the "Arise" command to add it to your shadow army permanently.
                        </p>
                        
                        <button 
                          className="w-full mt-2 py-2 bg-sl-purple/20 border border-sl-purple text-sl-purple-light rounded-md text-sm font-medium hover:bg-sl-purple/30 transition-colors flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            ariseCommand(shadow.id);
                          }}
                        >
                          <span className="mr-2">ARISE</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="sl-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-bold text-white mb-5 flex items-center">
              <Ghost className="text-sl-purple mr-2 w-5 h-5" />
              Shadow Army
            </h3>

            {arisenShadows.length === 0 ? (
              <div className="text-center py-8 bg-sl-grey-dark/20 rounded-md border border-sl-grey-dark/30">
                <Ghost className="w-12 h-12 text-sl-grey-dark mx-auto mb-2" />
                <p className="text-slate-400">Your shadow army is empty.</p>
                <p className="text-sm text-slate-500 mt-1">
                  Level up to extract shadows, then use the "Arise" command.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {arisenShadows.map((shadow) => (
                  <div 
                    key={shadow.id}
                    className="border border-sl-purple/30 rounded-md bg-sl-grey-dark/20 p-4 relative overflow-hidden"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-md flex items-center justify-center mr-3 bg-sl-purple/20 text-sl-purple">
                        {getShadowIcon(shadow.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{shadow.name}</h4>
                        <div className="flex items-center mt-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-sl-grey-dark text-sl-purple mr-2">
                            Lv. {shadow.level}
                          </span>
                          <span className="text-xs flex items-center text-slate-300">
                            Power: {shadow.power}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute top-1 right-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-sl-purple/20 text-sl-purple-light">
                        Arisen
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShadowArmy;
