
import React, { useState, useRef, useEffect } from 'react';
import { User, Send, X, Settings2, Shield, UserCog } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Message = {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  isUser: boolean;
};

// Fake chat partners database (would connect to backend in real app)
const availablePartners = [
  { id: '1', name: 'Jin-Woo', username: 'shadow_monarch', rank: 'S' },
  { id: '2', name: 'Cha Hae-In', username: 'sword_master', rank: 'S' },
  { id: '3', name: 'Go Gun-Hee', username: 'chairman', rank: 'S' },
  { id: '4', name: 'Christopher Reed', username: 'knight_captain', rank: 'A' },
  { id: '5', name: 'Baek Yoonho', username: 'white_tiger', rank: 'A' },
  { id: '6', name: 'Thomas Andre', username: 'goliath', rank: 'S' },
];

// Fake predetermined responses for demo purposes
const botResponses = [
  "Hey there! How's your training going?",
  "Have you encountered any powerful monsters lately?",
  "The Hunter Association has new quests available.",
  "I heard there's a dungeon break in sector 7. Be careful.",
  "Your shadow army is impressive!",
  "What rank are you aiming for next?",
  "I'm heading to a raid later. Want to join?",
  "The S-rank evaluation test is coming up soon.",
  "How many shadows have you extracted so far?",
  "Have you developed any new skills recently?",
];

const Chat = () => {
  const { name, rank } = usePlayer();
  const [currentPartner, setCurrentPartner] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState(name);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [preferredGender, setPreferredGender] = useState<string>('any');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleConnect = (partnerId: string) => {
    const partner = availablePartners.find(p => p.id === partnerId);
    setCurrentPartner(partnerId);
    
    if (partner) {
      // Clear previous messages
      setMessages([
        {
          id: 'system-1',
          sender: 'System',
          content: `You are now connected with ${partner.name} (${partner.rank}-rank)`,
          timestamp: Date.now(),
          isUser: false
        }
      ]);
      
      // Simulate a welcome message
      setTimeout(() => {
        const welcomeMessage = {
          id: `bot-${Date.now()}`,
          sender: partner.name,
          content: `Hello, ${username}! I'm ${partner.name}. Nice to meet you.`,
          timestamp: Date.now(),
          isUser: false
        };
        setMessages(prev => [...prev, welcomeMessage]);
      }, 1000);
    }
  };

  const handleDisconnect = () => {
    setMessages(prev => [
      ...prev,
      {
        id: 'system-disconnect',
        sender: 'System',
        content: 'Chat disconnected.',
        timestamp: Date.now(),
        isUser: false
      }
    ]);
    setCurrentPartner(null);
  };

  const handleRandomConnect = () => {
    // Simple random connection simulation
    const randomIndex = Math.floor(Math.random() * availablePartners.length);
    const randomPartner = availablePartners[randomIndex];
    handleConnect(randomPartner.id);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !currentPartner) return;
    
    // Add user message
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      sender: username,
      content: inputMessage,
      timestamp: Date.now(),
      isUser: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const partner = availablePartners.find(p => p.id === currentPartner);
      
      if (partner) {
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          sender: partner.name,
          content: randomResponse,
          timestamp: Date.now(),
          isUser: false
        };
        setMessages(prev => [...prev, botMessage]);
      }
    }, 1000 + Math.random() * 2000);
  };
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredPartners = availablePartners.filter(partner => 
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    partner.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
      <div className="mt-8 mb-12 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-sl-dark border border-sl-purple/30 text-sl-purple text-sm mb-3">
          Hunter Communication
        </div>
        <h1 className="sl-heading mb-2">[Shadow Chat]</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Connect with other hunters and exchange information about dungeons, monsters, and shadow extraction techniques.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sl-card animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white flex items-center">
                <User className="text-sl-purple mr-2 w-5 h-5" />
                Your Profile
              </h3>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 border-sl-grey-dark text-slate-400 hover:text-white hover:border-sl-grey"
                onClick={() => setShowSettings(!showSettings)}
              >
                <UserCog className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>

            {showSettings ? (
              <div className="animate-fade-in">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Display Name</label>
                    <Input 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-sl-dark border-sl-grey-dark text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Preferred Match Gender</label>
                    <Select 
                      value={preferredGender} 
                      onValueChange={setPreferredGender}
                    >
                      <SelectTrigger className="bg-sl-dark border-sl-grey-dark text-white">
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      className="w-full bg-sl-dark border border-sl-grey-dark text-sl-grey hover:border-sl-grey-dark/80"
                      onClick={() => setShowSettings(false)}
                    >
                      Save Settings
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sl-dark border border-sl-purple text-sl-purple font-bold text-xl mr-4">
                    {rank}
                  </div>
                  <div>
                    <p className="text-white font-medium">{username}</p>
                    <p className="text-sm text-slate-400">Online</p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3 mt-6">
                  <Button 
                    className="w-full bg-sl-purple hover:bg-sl-purple-dark text-white"
                    onClick={handleRandomConnect}
                    disabled={!!currentPartner}
                  >
                    Random Connection
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-sl-dark border border-sl-purple text-sl-purple hover:bg-sl-purple/10"
                        disabled={!!currentPartner}
                      >
                        Find Hunter
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-sl-dark border border-sl-grey-dark text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white flex items-center">
                          <Shield className="text-sl-purple mr-2" />
                          Find Hunter
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="my-4">
                        <Input 
                          placeholder="Search by name or username" 
                          className="bg-sl-grey-dark/30 border-sl-grey-dark text-white"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto pr-1">
                        {filteredPartners.length > 0 ? (
                          <div className="space-y-2">
                            {filteredPartners.map(partner => (
                              <div 
                                key={partner.id}
                                className="flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-sl-grey-dark/30 border border-transparent hover:border-sl-grey-dark"
                                onClick={() => {
                                  handleConnect(partner.id);
                                  document.body.click(); // Close dialog
                                }}
                              >
                                <div className="flex items-center">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sl-grey-dark border border-sl-blue text-sl-blue font-bold mr-3">
                                    {partner.rank}
                                  </div>
                                  <div>
                                    <p className="text-white">{partner.name}</p>
                                    <p className="text-xs text-slate-400">@{partner.username}</p>
                                  </div>
                                </div>
                                <Button 
                                  size="sm" 
                                  className="h-8 bg-sl-purple hover:bg-sl-purple-dark text-white"
                                >
                                  Connect
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-400">
                            No hunters found matching "{searchTerm}"
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </div>
          
          <div className="sl-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Settings2 className="text-sl-purple mr-2 w-5 h-5" />
              Chat Information
            </h3>
            
            <div className="prose prose-sm prose-invert max-w-none">
              <p>
                Connect with other hunters to share information about dungeons, monsters, and hunting techniques.
              </p>
              
              <p className="text-sm text-slate-400 mt-4">
                Remember to follow the Hunter Association's communication guidelines:
              </p>
              
              <ul className="text-sm text-slate-400 mt-2 space-y-1">
                <li>• Be respectful to other hunters</li>
                <li>• Do not share confidential guild information</li>
                <li>• Report suspicious activity</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="sl-card animate-fade-in relative" style={{ animationDelay: '0.2s' }}>
            {currentPartner ? (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between border-b border-sl-grey-dark pb-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sl-grey-dark border border-sl-blue text-sl-blue font-bold mr-3">
                      {availablePartners.find(p => p.id === currentPartner)?.rank || 'E'}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {availablePartners.find(p => p.id === currentPartner)?.name || 'Hunter'}
                      </p>
                      <p className="text-xs text-slate-400">
                        @{availablePartners.find(p => p.id === currentPartner)?.username || 'username'}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 border-sl-grey-dark text-slate-400 hover:text-red-400 hover:border-red-400"
                    onClick={handleDisconnect}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Disconnect</span>
                  </Button>
                </div>
                
                {/* Messages container */}
                <div className="h-[50vh] overflow-y-auto mb-4 pr-2 custom-scrollbar">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender === 'System' ? (
                          <div className="w-full text-center my-2">
                            <span className="px-3 py-1 text-xs rounded-full bg-sl-grey-dark/30 text-slate-400">
                              {message.content}
                            </span>
                          </div>
                        ) : (
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-3 ${
                              message.isUser 
                                ? 'bg-sl-purple/20 border border-sl-purple/30 text-white' 
                                : 'bg-sl-grey-dark/30 border border-sl-grey-dark text-slate-200'
                            }`}
                          >
                            <div className="flex items-center mb-1">
                              <span className={`font-medium text-sm ${message.isUser ? 'text-sl-purple-light' : 'text-sl-blue'}`}>
                                {message.sender}
                              </span>
                              <span className="text-xs text-slate-500 ml-2">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p>{message.content}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Message input */}
                <div className="flex space-x-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="min-h-[50px] max-h-32 bg-sl-grey-dark/30 border-sl-grey-dark resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    className="bg-sl-purple hover:bg-sl-purple-dark h-auto"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <User className="w-16 h-16 mx-auto text-sl-grey-dark mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Active Chat</h3>
                <p className="text-slate-400 max-w-lg mx-auto mb-8">
                  Connect with another hunter to start chatting. You can find a specific hunter or get matched randomly.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button 
                    className="bg-sl-purple hover:bg-sl-purple-dark text-white"
                    onClick={handleRandomConnect}
                  >
                    Random Connection
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-sl-dark border border-sl-purple text-sl-purple hover:bg-sl-purple/10"
                      >
                        Find Hunter
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-sl-dark border border-sl-grey-dark">
                      {/* Same search dialog as above */}
                      <DialogHeader>
                        <DialogTitle className="text-white flex items-center">
                          <Shield className="text-sl-purple mr-2" />
                          Find Hunter
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="my-4">
                        <Input 
                          placeholder="Search by name or username" 
                          className="bg-sl-grey-dark/30 border-sl-grey-dark text-white"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto pr-1">
                        {filteredPartners.length > 0 ? (
                          <div className="space-y-2">
                            {filteredPartners.map(partner => (
                              <div 
                                key={partner.id}
                                className="flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-sl-grey-dark/30 border border-transparent hover:border-sl-grey-dark"
                                onClick={() => {
                                  handleConnect(partner.id);
                                  document.body.click(); // Close dialog
                                }}
                              >
                                <div className="flex items-center">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sl-grey-dark border border-sl-blue text-sl-blue font-bold mr-3">
                                    {partner.rank}
                                  </div>
                                  <div>
                                    <p className="text-white">{partner.name}</p>
                                    <p className="text-xs text-slate-400">@{partner.username}</p>
                                  </div>
                                </div>
                                <Button 
                                  size="sm" 
                                  className="h-8 bg-sl-purple hover:bg-sl-purple-dark text-white"
                                >
                                  Connect
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-400">
                            No hunters found matching "{searchTerm}"
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
