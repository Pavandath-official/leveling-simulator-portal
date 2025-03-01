
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, ArrowRight } from 'lucide-react';
import StatBar from '@/components/StatBar';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Fake login - accept any credentials
    setTimeout(() => {
      setIsLoading(false);
      // Store username in localStorage to use it as player name
      localStorage.setItem('playerName', username);
      setShowAnimation(true);
    }, 1500);
  };

  useEffect(() => {
    if (showAnimation) {
      // Redirect after animation completes
      const timer = setTimeout(() => {
        // Force a reload of the app to ensure the login state is recognized
        window.location.href = "/";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  if (showAnimation) {
    return (
      <div className="fixed inset-0 bg-sl-darker flex flex-col items-center justify-center z-50">
        <div className="text-center">
          <div className="mb-8 animate-pulse-glow">
            <Shield className="h-20 w-20 text-sl-blue mx-auto" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in">
            Welcome, <span className="text-sl-blue">{username}</span>
          </h1>
          <p className="text-xl text-slate-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Initializing Hunter System...
          </p>
          <div className="mt-8 max-w-md mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <StatBar 
              name="System Loading" 
              value={100} 
              max={100} 
              color="bg-sl-blue" 
              className="animate-pulse" 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sl-darker flex flex-col justify-center animate-fade-in">
      <div className="sl-container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-sl-blue mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Hunter System</h1>
            <p className="text-slate-400 mt-2">Enter your credentials to access the system</p>
          </div>

          <div className="sl-card">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">
                    Hunter ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-sl-grey-dark/50 border border-sl-grey-dark focus:ring-sl-blue focus:border-sl-blue block w-full pl-10 pr-3 py-2 rounded-md text-white"
                      placeholder="Enter your hunter name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                    Access Code
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
                      className="bg-sl-grey-dark/50 border border-sl-grey-dark focus:ring-sl-blue focus:border-sl-blue block w-full pl-10 pr-3 py-2 rounded-md text-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-sl-darker bg-sl-blue hover:bg-sl-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sl-blue transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>Access System</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-slate-400">
            <p>This is a demonstration system. Enter any credentials to log in.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
