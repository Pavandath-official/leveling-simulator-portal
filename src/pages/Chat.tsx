
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Users, Bot, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system' | 'hunter';
  timestamp: Date;
  hunterName?: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to the Hunter Communication Network. Stay connected with fellow hunters worldwide.',
      sender: 'system',
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: '2',
      text: 'Just cleared a B-rank gate! The rewards were incredible.',
      sender: 'hunter',
      hunterName: 'ShadowHunter92',
      timestamp: new Date(Date.now() - 30000)
    },
    {
      id: '3',
      text: 'Anyone know good training spots for strength builds?',
      sender: 'hunter',
      hunterName: 'IronFist',
      timestamp: new Date(Date.now() - 15000)
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [onlineHunters] = useState(['ShadowHunter92', 'IronFist', 'MageKnight', 'StealthBlade', 'TankMaster']);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate responses
    setTimeout(() => {
      const responses = [
        "Great question! I'd recommend the training grounds near Seoul Station.",
        "Nice work on that gate clear! What artifacts did you get?",
        "The Hunter Association just announced new A-rank gates opening tomorrow.",
        "Anyone interested in forming a party for the Red Gate event?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const hunterNames = ['MageKnight', 'StealthBlade', 'TankMaster', 'ShadowHunter92'];
      const randomHunter = hunterNames[Math.floor(Math.random() * hunterNames.length)];

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'hunter',
        hunterName: randomHunter,
        timestamp: new Date()
      }]);
    }, 1000 + Math.random() * 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="sl-container pb-16 mx-auto px-4 md:px-8 sl-page-transition">
      <div className="mt-8 mb-12 text-center">
        <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-sl-blue/20 to-sl-purple/20 border border-sl-blue/30 text-sl-blue text-sm mb-4">
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Hunter Network
        </div>
        <h1 className="sl-heading mb-4">Global Hunter Chat</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Connect with hunters worldwide. Share strategies, form parties, and stay updated on gate activities.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Online Hunters */}
        <Card className="sl-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-500" />
              Online Hunters
            </CardTitle>
            <CardDescription>
              {onlineHunters.length} hunters online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {onlineHunters.map((hunter, index) => (
                <div key={hunter} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-sl-grey-dark/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-300 text-sm">{hunter}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {['E', 'D', 'C', 'B', 'A'][Math.floor(Math.random() * 5)]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="sl-card lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-sl-blue" />
              Hunter Communications
            </CardTitle>
            <CardDescription>
              Real-time chat with the global hunter community
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 border-b border-sl-grey-dark">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-sl-blue text-white'
                      : message.sender === 'system'
                      ? 'bg-sl-purple/20 text-sl-purple border border-sl-purple/30'
                      : 'bg-sl-grey-dark text-white'
                  }`}>
                    {message.sender === 'hunter' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="w-3 h-3" />
                        <span className="text-xs font-medium text-sl-blue">
                          {message.hunterName}
                        </span>
                      </div>
                    )}
                    {message.sender === 'system' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Bot className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          System
                        </span>
                      </div>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="bg-sl-dark border-sl-grey-dark text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-sl-blue hover:bg-sl-blue-dark text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
