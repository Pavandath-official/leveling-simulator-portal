
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, ArrowRight, Zap, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import StatBar from '@/components/StatBar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username: email.split('@')[0] // Use email prefix as username
            }
          }
        });

        if (error) throw error;

        if (data.user && !data.session) {
          toast({
            title: "Check your email",
            description: "We sent you a confirmation link to complete registration.",
          });
        } else {
          setShowAnimation(true);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setShowAnimation(true);
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAnimation, navigate]);

  if (showAnimation) {
    return (
      <div className="fixed inset-0 bg-sl-darker flex flex-col items-center justify-center z-50 sl-grid-bg">
        <div className="absolute inset-0 overflow-hidden sl-scan-line"></div>
        <div className="text-center px-4 max-w-md w-full">
          <div className="mb-8 animate-pulse-glow relative">
            <div className="absolute inset-0 bg-sl-blue opacity-10 blur-2xl rounded-full"></div>
            <Shield className="h-20 w-20 text-sl-blue mx-auto" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in font-orbitron">
            Welcome, <span className="text-sl-blue">Hunter</span>
          </h1>
          <p className="text-xl text-slate-300 animate-fade-in font-rajdhani" style={{ animationDelay: '0.3s' }}>
            Initializing Hunter System...
          </p>
          
          <div className="mt-8 max-w-md mx-auto space-y-6">
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <StatBar 
                name="System Loading" 
                value={100} 
                max={100} 
                color="bg-sl-blue" 
                className="animate-pulse" 
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              {['Calibrating', 'Synchronizing', 'Verifying'].map((status, index) => (
                <div key={status} className="sl-data-section">
                  <p className="sl-stat-name">{status}</p>
                  <div className="flex items-center justify-center h-6">
                    <div className="animate-pulse h-1 w-full bg-sl-blue/30 rounded-full overflow-hidden">
                      <div className="h-full bg-sl-blue rounded-full" 
                        style={{ 
                          width: '100%', 
                          animationDelay: `${index * 0.3}s` 
                        }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="animate-fade-in text-center text-sm text-slate-400 pt-4" style={{ animationDelay: '1.2s' }}>
              <p>Establishing secure connection to the Hunter Association Network</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sl-darker flex flex-col justify-center animate-fade-in sl-grid-bg">
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <svg className="absolute -bottom-20 -right-20 w-96 h-96 text-sl-blue/5" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M47.5,-51.2C59.1,-35.6,64.5,-17.8,64.1,-0.4C63.6,17,57.4,34,45.3,48.4C33.2,62.8,16.6,74.5,-1.9,76.4C-20.3,78.4,-40.7,70.6,-53.5,56.2C-66.3,41.8,-71.7,20.9,-70.8,0.9C-69.9,-19.1,-62.8,-38.2,-49.6,-53.8C-36.3,-69.4,-18.2,-81.5,0,-81.5C18.1,-81.5,36.3,-66.8,47.5,-51.2Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute -top-20 -left-20 w-96 h-96 text-sl-purple/5" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M39.5,-48.4C51.9,-35.2,63.2,-22.4,67.1,-7.1C71.1,8.2,67.7,25.9,57.9,38.4C48.1,51,31.8,58.3,15.4,61.7C-1.1,65.1,-17.7,64.5,-31.9,58C-46.1,51.5,-58,39,-64.4,23.7C-70.9,8.5,-72,-9.4,-65.4,-24C-58.9,-38.5,-44.7,-49.6,-30.3,-62.1C-15.8,-74.6,-0.9,-88.3,12.4,-100.6C25.6,-112.9,51.3,-123.7,60.9,-114.6C70.5,-105.4,65,-76.3,55.9,-56.8C46.8,-37.3,34,-27.4,39.5,-48.4Z" transform="translate(100 100)" />
        </svg>
      </div>
    
      <div className="sl-container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="relative mx-auto w-16 h-16 mb-4">
              <div className="absolute inset-0 bg-sl-blue opacity-20 blur-md rounded-full animate-pulse"></div>
              <Shield className="h-16 w-16 text-sl-blue mx-auto relative z-10" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white font-orbitron">Hunter System</h1>
            <p className="text-slate-400 mt-2 font-rajdhani">
              {isSignUp ? 'Register for Hunter Association' : 'Enter your credentials to access the system'}
            </p>
          </div>

          <div className="sl-card bg-sl-dark/80 backdrop-blur-sm">
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-sl-dark border border-sl-grey-dark focus:ring-sl-blue focus:border-sl-blue block w-full pl-10 pr-3 py-2 rounded-md text-white"
                      placeholder="hunter@association.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-sl-dark border border-sl-grey-dark focus:ring-sl-blue focus:border-sl-blue block w-full pl-10 pr-3 py-2 rounded-md text-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-sl-darker bg-sl-blue hover:bg-sl-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sl-blue transition-all duration-200 relative overflow-hidden"
                >
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>{isSignUp ? 'Register Hunter' : 'Access System'}</span>
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sl-blue hover:text-sl-blue-light text-sm"
                >
                  {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
