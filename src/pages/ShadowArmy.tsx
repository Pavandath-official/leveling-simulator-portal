
import React, { useState, useEffect } from 'react';
import { Ghost, Shield, Sword, Wand2, User, ArrowRight, Sparkles, Plus, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MultiAriseAnimation from '@/components/MultiAriseAnimation';
import ShadowExtractionAnimation from '@/components/ShadowExtractionAnimation';

// Famous Solo Leveling shadows
const FAMOUS_SHADOWS = [
  { name: 'Igris', type: 'knight', power: 150, level: 15 },
  { name: 'Beru', type: 'beast', power: 180, level: 18 },
  { name: 'Iron', type: 'soldier', power: 120, level: 12 },
  { name: 'Tank', type: 'soldier', power: 110, level: 11 },
  { name: 'Tusk', type: 'beast', power: 140, level: 14 },
  { name: 'Kaisel', type: 'beast', power: 200, level: 20 },
  { name: 'Greed', type: 'mage', power: 160, level: 16 },
  { name: 'Jima', type: 'soldier', power: 100, level: 10 }
];

const ShadowArmy = () => {
  const { toast } = useToast();
  const [shadows, setShadows] = useState([
    { id: '1', name: 'Igris', type: 'knight', level: 15, power: 150, arisen: true },
    { id: '2', name: 'Beru', type: 'beast', level: 18, power: 180, arisen: true },
    { id: '3', name: 'Iron', type: 'soldier', level: 12, power: 120, arisen: true },
    { id: '4', name: 'Tank', type: 'soldier', level: 11, power: 110, arisen: false },
    { id: '5', name: 'Tusk', type: 'beast', level: 14, power: 140, arisen: false },
    { id: '6', name: 'Greed', type: 'mage', level: 16, power: 160, arisen: false }
  ]);
  
  const [selectedShadow, setSelectedShadow] = useState<string | null>(null);
  const [selectedForArise, setSelectedForArise] = useState<string[]>([]);
  const [showMultiAriseAnimation, setShowMultiAriseAnimation] = useState(false);
  const [showExtractionDialog, setShowExtractionDialog] = useState(false);
  const [availableExtractions, setAvailableExtractions] = useState<any[]>([]);
  const [showExtractionAnimation, setShowExtractionAnimation] = useState(false);
  const [extractingShadowType, setExtractingShadowType] = useState('');

  const arisenShadows = shadows.filter(shadow => shadow.arisen);
  const unarisenShadows = shadows.filter(shadow => !shadow.arisen);
  const loading = false;

  // Generate available shadows for extraction
  useEffect(() => {
    const generateExtractions = () => {
      const extractions = [];
      for (let i = 0; i < 3; i++) {
        const randomShadow = FAMOUS_SHADOWS[Math.floor(Math.random() * FAMOUS_SHADOWS.length)];
        const powerVariation = Math.floor(Math.random() * 30) - 15;
        extractions.push({
          id: `extract-${i}`,
          name: randomShadow.name,
          type: randomShadow.type,
          level: randomShadow.level + Math.floor(Math.random() * 3) - 1,
          power: randomShadow.power + powerVariation,
          arisen: false
        });
      }
      setAvailableExtractions(extractions);
    };

    generateExtractions();
  }, []);

  const extractShadow = (shadowData: any) => {
    setExtractingShadowType(shadowData.type);
    setShowExtractionAnimation(true);
    setShowExtractionDialog(false);
    
    // Add to shadows after animation
    setTimeout(() => {
      const newShadow = {
        ...shadowData,
        id: `shadow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      setShadows(prev => [...prev, newShadow]);
      
      // Remove from available extractions
      setAvailableExtractions(prev => prev.filter(s => s.id !== shadowData.id));
      
      toast({
        title: "Shadow Extracted!",
        description: `You have extracted ${newShadow.name} from a defeated enemy.`,
        variant: "default",
      });
      
      setShowExtractionAnimation(false);
    }, 5000);
  };

  const handleShadowSelection = (shadowId: string) => {
    setSelectedForArise(prev => 
      prev.includes(shadowId) 
        ? prev.filter(id => id !== shadowId)
        : [...prev, shadowId]
    );
  };

  const ariseSelectedShadows = () => {
    if (selectedForArise.length === 0) {
      toast({
        title: "No Shadows Selected",
        description: "Please select at least one shadow to arise.",
        variant: "destructive",
      });
      return;
    }

    setShowMultiAriseAnimation(true);
  };

  const completeMultiArise = async () => {
    // Update all selected shadows to arisen status
    setShadows(prev => prev.map(shadow => 
      selectedForArise.includes(shadow.id) 
        ? { ...shadow, arisen: true, power: shadow.power + 10 }
        : shadow
    ));

    toast({
      title: "🔥 ARISE COMPLETE!",
      description: `${selectedForArise.length} shadows have joined your army!`,
      variant: "default",
    });

    setSelectedForArise([]);
    setShowMultiAriseAnimation(false);
  };

  const getShadowIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'knight':
        return <Shield className="w-6 h-6" />;
      case 'beast':
        return <Sword className="w-6 h-6" />;
      case 'mage':
        return <Wand2 className="w-6 h-6" />;
      case 'soldier':
        return <User className="w-6 h-6" />;
      default:
        return <Ghost className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
        <div className="text-center py-16">
          <Ghost className="w-12 h-12 text-sl-purple mx-auto mb-4 animate-pulse" />
          <p className="text-slate-400">Loading your shadow army...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
      <MultiAriseAnimation 
        isVisible={showMultiAriseAnimation}
        shadowCount={selectedForArise.length}
        onComplete={completeMultiArise}
      />

      {showExtractionAnimation && (
        <ShadowExtractionAnimation
          shadowType={extractingShadowType}
          onComplete={() => setShowExtractionAnimation(false)}
        />
      )}

      <div className="mt-8 mb-12 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-sl-dark border border-sl-purple/30 text-sl-purple text-sm mb-3">
          Shadow Management
        </div>
        <h1 className="sl-heading mb-2">[Shadow Army]</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Manage your shadow army. Extract shadows from defeated enemies and command them with the power of necromancy.
        </p>
        
        <div className="mt-4 flex justify-center gap-4">
          <Dialog open={showExtractionDialog} onOpenChange={setShowExtractionDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="border-sl-purple/50 text-sl-purple hover:bg-sl-purple/10 hover:text-sl-purple-light"
              >
                <Plus className="w-4 h-4 mr-2" />
                Extract Shadow
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-sl-dark border-sl-purple/30 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white text-xl">Shadow Extraction</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Select a shadow to extract from defeated enemies
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 gap-4 mt-4">
                {availableExtractions.map((shadow) => (
                  <motion.div 
                    key={shadow.id}
                    className="border border-sl-grey-dark rounded-md p-4 hover:border-sl-purple/50 cursor-pointer transition-all"
                    onClick={() => extractShadow(shadow)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-md flex items-center justify-center mr-3 bg-sl-grey-dark/50">
                        {getShadowIcon(shadow.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{shadow.name}</h4>
                        <div className="flex items-center mt-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-sl-grey-dark text-sl-blue mr-2">
                            Lv. {shadow.level}
                          </span>
                          <span className="text-xs text-slate-400 mr-2">
                            Power: {shadow.power}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-sl-purple/20 text-sl-purple">
                            {shadow.type}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-sl-purple hover:bg-sl-purple-dark">
                        Extract
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {selectedForArise.length > 0 && (
            <Button
              onClick={ariseSelectedShadows}
              className="bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 text-white"
            >
              <Flame className="w-4 h-4 mr-2" />
              ARISE ({selectedForArise.length})
            </Button>
          )}
        </div>
      </div>

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
              Select multiple shadows and use the "Arise" command to add them to your legion.
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
          {unarisenShadows.length > 0 && (
            <div className="sl-card animate-fade-in">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center">
                <Ghost className="text-sl-grey mr-2 w-5 h-5" />
                Extracted Shadows
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {unarisenShadows.map((shadow) => (
                  <motion.div 
                    key={shadow.id}
                    className={`border rounded-md transition-all duration-300 cursor-pointer relative ${
                      selectedForArise.includes(shadow.id)
                        ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20' 
                        : selectedShadow === shadow.id 
                        ? 'border-sl-purple sl-border-glow' 
                        : 'border-sl-grey-dark hover:border-sl-purple/50'
                    }`}
                    onClick={() => {
                      setSelectedShadow(selectedShadow === shadow.id ? null : shadow.id);
                      handleShadowSelection(shadow.id);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-4 flex items-center">
                      <div className={`w-12 h-12 rounded-md flex items-center justify-center mr-3 ${
                        selectedForArise.includes(shadow.id) ? 'bg-purple-500/30' : 'bg-sl-grey-dark/50'
                      }`}>
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
                    
                    {selectedForArise.includes(shadow.id) && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
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
                  Extract shadows, then use the "Arise" command.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {arisenShadows.map((shadow) => (
                  <motion.div 
                    key={shadow.id}
                    className="border border-sl-purple/30 rounded-md bg-sl-grey-dark/20 p-4 relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
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
                  </motion.div>
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
