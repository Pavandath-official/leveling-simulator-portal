
import React, { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, Target, Zap, Trophy, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Gym = () => {
  const { level, rank, exp, gainExp } = usePlayer();
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [currentReps, setCurrentReps] = useState(0);
  const [isWorking, setIsWorking] = useState(false);

  // Calculate rank-based targets
  const getRankMultiplier = () => {
    const currentRank = rank || 'E';
    const multipliers = { E: 1, D: 1.5, C: 2, B: 2.5, A: 3, S: 4 };
    return multipliers[currentRank as keyof typeof multipliers] || 1;
  };

  const exercises = [
    {
      id: 'pushups',
      name: 'Push-ups',
      icon: <Dumbbell className="h-6 w-6" />,
      baseTarget: 50,
      expReward: 15,
      description: 'Build upper body strength'
    },
    {
      id: 'squats',
      name: 'Squats',
      icon: <Target className="h-6 w-6" />,
      baseTarget: 100,
      expReward: 20,
      description: 'Strengthen your legs'
    },
    {
      id: 'running',
      name: 'Running (5km)',
      icon: <Zap className="h-6 w-6" />,
      baseTarget: 1,
      expReward: 50,
      description: 'Boost your endurance'
    },
    {
      id: 'planks',
      name: 'Plank (seconds)',
      icon: <Clock className="h-6 w-6" />,
      baseTarget: 120,
      expReward: 25,
      description: 'Core strength training'
    }
  ];

  const handleExerciseComplete = (exercise: any) => {
    const multiplier = getRankMultiplier();
    const target = Math.floor(exercise.baseTarget * multiplier);
    const expGained = Math.floor(exercise.expReward * multiplier);
    
    // Update player experience using gainExp
    gainExp(expGained);
    
    toast.success(`${exercise.name} completed! +${expGained} EXP`, {
      description: `Target: ${target} ${exercise.id === 'running' ? 'km' : exercise.id === 'planks' ? 'seconds' : 'reps'}`
    });
    
    setIsWorking(false);
    setSelectedExercise('');
    setCurrentReps(0);
  };

  const startWorkout = (exercise: any) => {
    setSelectedExercise(exercise.id);
    setCurrentReps(0);
    setIsWorking(true);
    toast.info(`Starting ${exercise.name} workout!`);
  };

  const addRep = () => {
    const exercise = exercises.find(e => e.id === selectedExercise);
    if (!exercise) return;
    
    const multiplier = getRankMultiplier();
    const target = Math.floor(exercise.baseTarget * multiplier);
    
    if (currentReps < target) {
      setCurrentReps(prev => prev + 1);
      
      if (currentReps + 1 >= target) {
        handleExerciseComplete(exercise);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sl-darker via-sl-dark to-sl-darker p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 font-orbitron">
            Hunter's Gymnasium
          </h1>
          <p className="text-sl-text-secondary mb-4">
            Train your body to match your hunter rank
          </p>
          <Badge variant="outline" className="bg-sl-blue/20 text-sl-blue border-sl-blue">
            Rank {rank} Multiplier: {getRankMultiplier()}x
          </Badge>
        </div>

        {/* Current Workout Display */}
        {isWorking && selectedExercise && (
          <Card className="mb-8 bg-sl-dark/80 border-sl-blue/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-6 w-6 text-sl-blue" />
                Current Workout
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const exercise = exercises.find(e => e.id === selectedExercise);
                const target = Math.floor((exercise?.baseTarget || 0) * getRankMultiplier());
                const progress = (currentReps / target) * 100;
                
                return (
                  <div className="space-y-4">
                    <div className="flex justify-between text-white">
                      <span>{exercise?.name}</span>
                      <span>{currentReps} / {target}</span>
                    </div>
                    <Progress value={progress} className="h-4" />
                    <div className="flex gap-4">
                      <Button 
                        onClick={addRep}
                        className="flex-1 bg-sl-blue hover:bg-sl-blue-dark"
                        disabled={currentReps >= target}
                      >
                        {exercise?.id === 'running' ? 'Complete 1km' : 
                         exercise?.id === 'planks' ? '+10 seconds' : '+1 Rep'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsWorking(false);
                          setSelectedExercise('');
                          setCurrentReps(0);
                        }}
                      >
                        Stop
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Exercise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {exercises.map((exercise) => {
            const multiplier = getRankMultiplier();
            const target = Math.floor(exercise.baseTarget * multiplier);
            const expReward = Math.floor(exercise.expReward * multiplier);
            
            return (
              <Card 
                key={exercise.id} 
                className="bg-sl-dark/80 border-sl-grey-dark hover:border-sl-blue/50 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    {exercise.icon}
                    {exercise.name}
                  </CardTitle>
                  <CardDescription className="text-sl-text-secondary">
                    {exercise.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-sl-text-muted">Target:</span>
                    <span className="text-white font-semibold">
                      {target} {exercise.id === 'running' ? 'km' : exercise.id === 'planks' ? 'seconds' : 'reps'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-sl-text-muted">EXP Reward:</span>
                    <span className="text-sl-blue font-semibold">+{expReward}</span>
                  </div>
                  <Button 
                    onClick={() => startWorkout(exercise)}
                    disabled={isWorking}
                    className="w-full bg-sl-blue hover:bg-sl-blue-dark"
                  >
                    {isWorking ? 'Workout in Progress...' : 'Start Workout'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Display */}
        <Card className="mt-8 bg-sl-dark/80 border-sl-grey-dark">
          <CardHeader>
            <CardTitle className="text-white">Training Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-sl-blue">{level}</div>
                <div className="text-sl-text-muted text-sm">Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-sl-green">{rank}</div>
                <div className="text-sl-text-muted text-sm">Rank</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-sl-purple">{exp}</div>
                <div className="text-sl-text-muted text-sm">Total EXP</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-sl-yellow">{getRankMultiplier()}x</div>
                <div className="text-sl-text-muted text-sm">Multiplier</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Gym;
