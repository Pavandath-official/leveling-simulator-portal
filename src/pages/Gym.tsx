
import React, { useState, useEffect } from 'react';
import { Dumbbell, Clock, Target, Flame, Trophy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { usePlayer } from '@/context/PlayerContext';
import { useToast } from '@/hooks/use-toast';
import { Particles } from '@/components/VisualEffects';

interface WorkoutType {
  id: string;
  name: string;
  icon: React.ReactNode;
  baseTarget: number;
  unit: string;
  xpReward: number;
  description: string;
}

interface WorkoutSession {
  workoutId: string;
  target: number;
  current: number;
  completed: boolean;
  timeStarted?: Date;
}

const Gym = () => {
  const { player, gainExperience } = usePlayer();
  const { toast } = useToast();
  
  const [activeWorkouts, setActiveWorkouts] = useState<WorkoutSession[]>([]);
  const [completedToday, setCompletedToday] = useState<string[]>([]);

  const workoutTypes: WorkoutType[] = [
    {
      id: 'running',
      name: 'Running',
      icon: <Flame className="h-6 w-6" />,
      baseTarget: 5,
      unit: 'km',
      xpReward: 50,
      description: 'Cardio endurance training'
    },
    {
      id: 'squats',
      name: 'Squats',
      icon: <Target className="h-6 w-6" />,
      baseTarget: 50,
      unit: 'reps',
      xpReward: 30,
      description: 'Lower body strength'
    },
    {
      id: 'pushups',
      name: 'Push-ups',
      icon: <Dumbbell className="h-6 w-6" />,
      baseTarget: 30,
      unit: 'reps',
      xpReward: 25,
      description: 'Upper body strength'
    },
    {
      id: 'planks',
      name: 'Planks',
      icon: <Clock className="h-6 w-6" />,
      baseTarget: 60,
      unit: 'seconds',
      xpReward: 35,
      description: 'Core stability'
    }
  ];

  const getRankMultiplier = () => {
    const rankMultipliers: { [key: string]: number } = {
      'E': 0.5,
      'D': 0.7,
      'C': 1.0,
      'B': 1.3,
      'A': 1.6,
      'S': 2.0,
      'National': 2.5,
      'Shadow Monarch': 3.0
    };
    return rankMultipliers[player.rank] || 1.0;
  };

  const getAdjustedTarget = (baseTarget: number) => {
    const multiplier = getRankMultiplier();
    return Math.round(baseTarget * multiplier);
  };

  const startWorkout = (workoutType: WorkoutType, customTarget?: number) => {
    const target = customTarget || getAdjustedTarget(workoutType.baseTarget);
    const newWorkout: WorkoutSession = {
      workoutId: workoutType.id,
      target,
      current: 0,
      completed: false,
      timeStarted: new Date()
    };

    setActiveWorkouts(prev => [...prev.filter(w => w.workoutId !== workoutType.id), newWorkout]);
    
    toast({
      title: "Workout Started!",
      description: `Target: ${target} ${workoutType.unit}`,
    });
  };

  const updateProgress = (workoutId: string, progress: number) => {
    setActiveWorkouts(prev => 
      prev.map(workout => 
        workout.workoutId === workoutId 
          ? { ...workout, current: progress }
          : workout
      )
    );
  };

  const completeWorkout = (workoutId: string) => {
    const workout = activeWorkouts.find(w => w.workoutId === workoutId);
    const workoutType = workoutTypes.find(w => w.id === workoutId);
    
    if (workout && workoutType && workout.current >= workout.target) {
      const bonusMultiplier = Math.floor(workout.current / workout.target);
      const totalXP = workoutType.xpReward * bonusMultiplier;
      
      gainExperience(totalXP);
      
      setActiveWorkouts(prev => 
        prev.map(w => 
          w.workoutId === workoutId 
            ? { ...w, completed: true }
            : w
        )
      );
      
      setCompletedToday(prev => [...prev, workoutId]);
      
      toast({
        title: "Workout Completed!",
        description: `+${totalXP} XP gained! ${bonusMultiplier > 1 ? `Bonus x${bonusMultiplier}!` : ''}`,
      });
    }
  };

  const CustomTargetWorkout = ({ workoutType }: { workoutType: WorkoutType }) => {
    const [customTarget, setCustomTarget] = useState([getAdjustedTarget(workoutType.baseTarget)]);
    const maxTarget = getAdjustedTarget(workoutType.baseTarget) * 3;

    return (
      <Card className="p-4 bg-sl-dark/80 border-sl-grey-dark">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-sl-blue/20 rounded-lg text-sl-blue">
            {workoutType.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white">{workoutType.name}</h3>
            <p className="text-sm text-slate-300">{workoutType.description}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-slate-300 mb-2">
              <span>Target: {customTarget[0]} {workoutType.unit}</span>
              <span>Rank: {player.rank} (x{getRankMultiplier()})</span>
            </div>
            <Slider
              value={customTarget}
              onValueChange={setCustomTarget}
              max={maxTarget}
              min={Math.floor(workoutType.baseTarget * 0.3)}
              step={workoutType.unit === 'km' ? 0.5 : 1}
              className="w-full"
            />
          </div>
          
          <Button
            onClick={() => startWorkout(workoutType, customTarget[0])}
            className="w-full bg-sl-blue hover:bg-sl-blue-dark text-white"
            disabled={activeWorkouts.some(w => w.workoutId === workoutType.id && !w.completed)}
          >
            Start Workout
          </Button>
        </div>
      </Card>
    );
  };

  const ActiveWorkoutCard = ({ workout }: { workout: WorkoutSession }) => {
    const workoutType = workoutTypes.find(w => w.id === workout.workoutId);
    if (!workoutType) return null;

    const progressPercent = (workout.current / workout.target) * 100;
    const isCompleted = workout.current >= workout.target;

    return (
      <Card className="p-4 bg-sl-dark/80 border-sl-grey-dark relative overflow-hidden">
        {isCompleted && <Particles className="absolute inset-0" quantity={10} color="bg-sl-blue" />}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isCompleted ? 'bg-sl-green/20 text-sl-green' : 'bg-sl-blue/20 text-sl-blue'}`}>
              {isCompleted ? <CheckCircle className="h-6 w-6" /> : workoutType.icon}
            </div>
            <div>
              <h3 className="font-semibold text-white">{workoutType.name}</h3>
              <p className="text-sm text-slate-300">
                {workout.current} / {workout.target} {workoutType.unit}
              </p>
            </div>
          </div>
          
          {isCompleted && !workout.completed && (
            <Button
              onClick={() => completeWorkout(workout.workoutId)}
              className="bg-sl-green hover:bg-sl-green/80 text-white"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Claim XP
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="w-full bg-sl-grey-dark rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isCompleted ? 'bg-sl-green' : 'bg-sl-blue'
              }`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          
          {!workout.completed && (
            <div className="flex gap-2">
              <Slider
                value={[workout.current]}
                onValueChange={(value) => updateProgress(workout.workoutId, value[0])}
                max={workout.target * 2}
                min={0}
                step={workoutType.unit === 'km' ? 0.1 : 1}
                className="flex-1"
              />
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="sl-container mx-auto px-4 py-8 sl-page-transition">
      <div className="flex items-center gap-3 mb-8">
        <Dumbbell className="h-8 w-8 text-sl-blue" />
        <h1 className="sl-heading text-white">Hunter's Gym</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="sl-card bg-sl-dark/80 border-sl-grey-dark">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-sl-blue" />
              Training Programs
            </h2>
            <p className="text-slate-300 mb-6">
              Your rank ({player.rank}) determines your training intensity. Higher ranks face greater challenges!
            </p>
            
            <div className="grid gap-4">
              {workoutTypes.map((workoutType) => (
                <CustomTargetWorkout key={workoutType.id} workoutType={workoutType} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="sl-card bg-sl-dark/80 border-sl-grey-dark">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-sl-blue" />
              Active Workouts
            </h2>
            
            {activeWorkouts.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Dumbbell className="mx-auto h-12 w-12 mb-3 text-sl-grey" />
                <p className="text-slate-200">No active workouts</p>
                <p className="text-sm mt-2">Start a training session to begin!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeWorkouts.map((workout, index) => (
                  <ActiveWorkoutCard key={`${workout.workoutId}-${index}`} workout={workout} />
                ))}
              </div>
            )}
          </div>
          
          <div className="sl-card bg-sl-dark/80 border-sl-grey-dark">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-sl-blue" />
              Today's Progress
            </h2>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-sl-blue mb-2">
                {completedToday.length}
              </div>
              <p className="text-slate-300">Workouts Completed</p>
              
              {completedToday.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {completedToday.map((workoutId) => {
                    const type = workoutTypes.find(w => w.id === workoutId);
                    return type ? (
                      <div key={workoutId} className="flex items-center gap-1 px-2 py-1 bg-sl-green/20 text-sl-green rounded text-sm">
                        {type.icon}
                        <span>{type.name}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gym;
