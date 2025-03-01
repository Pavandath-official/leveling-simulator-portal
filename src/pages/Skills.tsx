
import React, { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { 
  Zap, Clock, Lock, ChevronDown, ChevronUp, Activity, Shield, 
  Target, Sword, Move, Eye, CloudLightning
} from 'lucide-react';

const IconMap: Record<string, React.ReactNode> = {
  sword: <Sword className="w-5 h-5" />,
  move: <Move className="w-5 h-5" />,
  eye: <Eye className="w-5 h-5" />,
  'cloud-lightning': <CloudLightning className="w-5 h-5" />,
};

const Skills = () => {
  const { skills, level } = usePlayer();
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const toggleSkill = (id: string) => {
    if (expandedSkill === id) {
      setExpandedSkill(null);
    } else {
      setExpandedSkill(id);
    }
  };

  const activeSkills = skills.filter(skill => skill.type === 'active');
  const passiveSkills = skills.filter(skill => skill.type === 'passive');

  return (
    <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
      <div className="mt-8 mb-12 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-sl-dark border border-sl-blue/30 text-sl-blue text-sm mb-3">
          Hunter Skills
        </div>
        <h1 className="sl-heading mb-2">[Skill Management]</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Manage your acquired abilities and skills. Complete quests and level up to unlock more powerful skills.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="sl-card animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <Activity className="text-sl-blue mr-2 w-5 h-5" />
              Skill Overview
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              Skills are special abilities that can be used in combat or exploration. 
              Each skill has a type and may have additional effects.
            </p>

            <div className="space-y-4">
              <div className="bg-sl-grey-dark/30 p-4 rounded-md border border-sl-grey-dark/50">
                <div className="flex items-center mb-2">
                  <Zap className="text-sl-blue w-5 h-5 mr-2" />
                  <h4 className="text-white font-medium">Active Skills</h4>
                </div>
                <p className="text-sm text-slate-400">
                  Skills that need to be manually activated. May have cooldowns.
                </p>
                <div className="mt-2 text-white font-medium">
                  {activeSkills.filter(s => s.unlocked).length} / {activeSkills.length} Unlocked
                </div>
              </div>

              <div className="bg-sl-grey-dark/30 p-4 rounded-md border border-sl-grey-dark/50">
                <div className="flex items-center mb-2">
                  <Shield className="text-sl-purple w-5 h-5 mr-2" />
                  <h4 className="text-white font-medium">Passive Skills</h4>
                </div>
                <p className="text-sm text-slate-400">
                  Skills that are always active and provide constant benefits.
                </p>
                <div className="mt-2 text-white font-medium">
                  {passiveSkills.filter(s => s.unlocked).length} / {passiveSkills.length} Unlocked
                </div>
              </div>

              <div className="bg-sl-grey-dark/30 p-4 rounded-md border border-sl-grey-dark/50">
                <div className="flex items-center mb-2">
                  <Target className="text-yellow-400 w-5 h-5 mr-2" />
                  <h4 className="text-white font-medium">Skill Points</h4>
                </div>
                <p className="text-sm text-slate-400">
                  Used to upgrade skills. Earned through leveling up.
                </p>
                <div className="mt-2 text-white font-medium">
                  0 Available
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="sl-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-bold text-white mb-5 flex items-center">
              <Zap className="text-sl-blue mr-2 w-5 h-5" />
              Active Skills
            </h3>

            <div className="space-y-4">
              {activeSkills.map((skill) => (
                <div 
                  key={skill.id}
                  className={`border rounded-md transition-all duration-300 ${
                    expandedSkill === skill.id 
                      ? 'border-sl-blue sl-border-glow' 
                      : 'border-sl-grey-dark hover:border-sl-blue/50'
                  } ${!skill.unlocked ? 'opacity-50' : ''}`}
                >
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleSkill(skill.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 ${
                        skill.unlocked ? 'bg-sl-blue/20 text-sl-blue' : 'bg-sl-grey-dark text-slate-400'
                      }`}>
                        {skill.unlocked ? (
                          IconMap[skill.icon] || <Zap className="w-5 h-5" />
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{skill.name}</h4>
                        <div className="flex items-center mt-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-sl-grey-dark text-sl-blue mr-2">
                            Lv. {skill.level}
                          </span>
                          {skill.cooldown !== undefined && (
                            <span className="text-xs flex items-center text-slate-400">
                              <Clock className="w-3 h-3 mr-1" />
                              {skill.cooldown}s
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      {expandedSkill === skill.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                  
                  {expandedSkill === skill.id && (
                    <div className="p-4 border-t border-sl-grey-dark bg-sl-dark/30 animate-fade-in">
                      <p className="text-slate-300 mb-3">
                        {skill.description}
                      </p>
                      
                      {!skill.unlocked && (
                        <div className="bg-sl-grey-dark/50 p-3 rounded text-sm text-slate-300 flex items-center">
                          <Lock className="w-4 h-4 mr-2 text-slate-400" />
                          Unlocks at Hunter Level {skill.level * 5}
                          {level >= skill.level * 5 && (
                            <button className="ml-auto px-3 py-1 bg-sl-blue text-sl-dark rounded-md text-xs font-medium">
                              Unlock Now
                            </button>
                          )}
                        </div>
                      )}
                      
                      {skill.unlocked && (
                        <div className="flex justify-between items-center mt-3">
                          <div className="text-sm text-slate-400">
                            Level {skill.level} / 10
                          </div>
                          <button 
                            className="px-3 py-1 bg-sl-dark border border-sl-blue text-sl-blue rounded-md text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={true}
                          >
                            Upgrade
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="sl-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-bold text-white mb-5 flex items-center">
              <Shield className="text-sl-purple mr-2 w-5 h-5" />
              Passive Skills
            </h3>

            <div className="space-y-4">
              {passiveSkills.map((skill) => (
                <div 
                  key={skill.id}
                  className={`border rounded-md transition-all duration-300 ${
                    expandedSkill === skill.id 
                      ? 'border-sl-purple sl-border-glow' 
                      : 'border-sl-grey-dark hover:border-sl-purple/50'
                  } ${!skill.unlocked ? 'opacity-50' : ''}`}
                >
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleSkill(skill.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 ${
                        skill.unlocked ? 'bg-sl-purple/20 text-sl-purple' : 'bg-sl-grey-dark text-slate-400'
                      }`}>
                        {skill.unlocked ? (
                          IconMap[skill.icon] || <Shield className="w-5 h-5" />
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{skill.name}</h4>
                        <div className="flex items-center mt-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-sl-grey-dark text-sl-purple mr-2">
                            Lv. {skill.level}
                          </span>
                          <span className="text-xs bg-sl-grey-dark/50 px-2 py-0.5 rounded text-slate-300">
                            Passive
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {expandedSkill === skill.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                  
                  {expandedSkill === skill.id && (
                    <div className="p-4 border-t border-sl-grey-dark bg-sl-dark/30 animate-fade-in">
                      <p className="text-slate-300 mb-3">
                        {skill.description}
                      </p>
                      
                      {!skill.unlocked && (
                        <div className="bg-sl-grey-dark/50 p-3 rounded text-sm text-slate-300 flex items-center">
                          <Lock className="w-4 h-4 mr-2 text-slate-400" />
                          Unlocks at Hunter Level {skill.level * 5}
                          {level >= skill.level * 5 && (
                            <button className="ml-auto px-3 py-1 bg-sl-purple text-white rounded-md text-xs font-medium">
                              Unlock Now
                            </button>
                          )}
                        </div>
                      )}
                      
                      {skill.unlocked && (
                        <div className="flex justify-between items-center mt-3">
                          <div className="text-sm text-slate-400">
                            Level {skill.level} / 10
                          </div>
                          <button 
                            className="px-3 py-1 bg-sl-dark border border-sl-purple text-sl-purple rounded-md text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={true}
                          >
                            Upgrade
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
