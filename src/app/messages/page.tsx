'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit3, Send, Paperclip, ArrowUp } from 'lucide-react';
import { MessageThread, Message } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function MessagesPage() {
  const { currentUser, userData } = useAuth();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'Messages' | 'Documents' | 'Media'>('Messages');

  // Mock data for demonstration
  const mockThreads: MessageThread[] = [
    {
      id: 'thread-1',
      participants: ['current-user', 'stephanie-lopez'],
      lastMessage: 'Lorem ipsum dolor sit amet consectetur. Nisi ullamcorper lectus malesuada elit...',
      lastMessageTime: new Date(),
      messages: [
        {
          id: 'msg-1',
          senderId: 'stephanie-lopez',
          content: 'Lorem ipsum dolor sit amet consectetur. Nisi ullamcorper lectus malesuada elit...',
          attachments: [],
          timestamp: new Date(),
          type: 'text'
        }
      ]
    },
    {
      id: 'thread-2',
      participants: ['current-user', 'carrie-saunders'],
      lastMessage: 'I want to order 50 shirts per color, so 150 shirts in total. 50 acid wash red, 50 acid wash black and 50 acid wash green.',
      lastMessageTime: new Date(),
      messages: [
        {
          id: 'msg-2',
          senderId: 'current-user',
          content: 'I want to order 50 shirts per color, so 150 shirts in total. 50 acid wash red, 50 acid wash black and 50 acid wash green.',
          attachments: [],
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          type: 'text'
        },
        {
          id: 'msg-3',
          senderId: 'carrie-saunders',
          content: 'Ok. Do you have a tech pack?',
          attachments: [],
          timestamp: new Date(Date.now() - 8 * 60 * 1000),
          type: 'text'
        },
        {
          id: 'msg-4',
          senderId: 'current-user',
          content: 'Also, just checking on order # 000000. How\'s it going?',
          attachments: [],
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          type: 'text'
        },
        {
          id: 'msg-5',
          senderId: 'carrie-saunders',
          content: 'Yes, see tech pack attached.',
          attachments: ['tech-pack.pdf'],
          timestamp: new Date(Date.now() - 3 * 60 * 1000),
          type: 'file'
        },
        {
          id: 'msg-6',
          senderId: 'carrie-saunders',
          content: 'Order # 000000 is being packed.',
          attachments: [],
          timestamp: new Date(Date.now() - 1 * 60 * 1000),
          type: 'text'
        },
        {
          id: 'msg-7',
          senderId: 'carrie-saunders',
          content: 'Thank you for sharing the tech pack. Will send to the team to get started on this.',
          attachments: [],
          timestamp: new Date(),
          type: 'text'
        }
      ]
    },
    // Add more mock threads...
    ...['Jeremy Spader', 'Jennifer Robinson', 'Josh Jacobs', 'Steve Stewart', 'David Mann'].map((name, index) => ({
      id: `thread-${index + 3}`,
      participants: ['current-user', name.toLowerCase().replace(' ', '-')],
      lastMessage: 'Lorem ipsum dolor sit amet consectetur. Nisi ullamcorper lectus malesuada elit...',
      lastMessageTime: new Date(Date.now() - (index + 1) * 60 * 60 * 1000),
      messages: [
        {
          id: `msg-${index + 10}`,
          senderId: name.toLowerCase().replace(' ', '-'),
          content: 'Lorem ipsum dolor sit amet consectetur. Nisi ullamcorper lectus malesuada elit...',
          attachments: [],
          timestamp: new Date(Date.now() - (index + 1) * 60 * 60 * 1000),
          type: 'text' as const
        }
      ]
    }))
  ];

  const mockContacts = [
    { id: 'stephanie-lopez', name: 'Stephanie Lopez', avatar: '/api/placeholder/40/40' },
    { id: 'carrie-saunders', name: 'Carrie Saunders', avatar: '/api/placeholder/40/40' },
    { id: 'jeremy-spader', name: 'Jeremy Spader', avatar: '/api/placeholder/40/40' },
    { id: 'jennifer-robinson', name: 'Jennifer Robinson', avatar: '/api/placeholder/40/40' },
    { id: 'josh-jacobs', name: 'Josh Jacobs', avatar: '/api/placeholder/40/40' },
    { id: 'steve-stewart', name: 'Steve Stewart', avatar: '/api/placeholder/40/40' },
    { id: 'david-mann', name: 'David Mann', avatar: '/api/placeholder/40/40' }
  ];

  useEffect(() => {
    // Load mock data for demo
    setThreads(mockThreads);
    setSelectedThread(mockThreads[1]); // Select Carrie Saunders by default
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      content: newMessage,
      attachments: [],
      timestamp: new Date(),
      type: 'text'
    };

    // Update local state
    setSelectedThread(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: newMessage,
      lastMessageTime: new Date()
    } : null);

    setNewMessage('');
  };

  const getContactName = (contactId: string) => {
    const contact = mockContacts.find(c => c.id === contactId);
    return contact?.name || 'Unknown';
  };

  const getContactAvatar = (contactId: string) => {
    const contact = mockContacts.find(c => c.id === contactId);
    return contact?.avatar;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) {
      return `${minutes} min ago`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="h-[calc(100vh-80px)] flex pt-20">
        {/* Sidebar - Threads List */}
        <div className="w-80 border-r bg-white flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Threads</h2>
              <Button size="sm" variant="ghost">
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="px-4 py-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pinned</h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {threads.slice(0, 1).map((thread) => {
              const otherParticipant = thread.participants.find(p => p !== 'current-user');
              const contactName = getContactName(otherParticipant || '');
              return (
                <div
                  key={thread.id}
                  className="p-4 cursor-pointer hover:bg-gray-50 border-b"
                  onClick={() => setSelectedThread(thread)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage src={getContactAvatar(otherParticipant || '')} />
                      <AvatarFallback>{contactName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm truncate">{contactName}</h4>
                        <span className="text-xs text-gray-500 ml-2">{formatTime(thread.lastMessageTime)}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">{thread.lastMessage}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="px-4 py-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Recents</h3>
            </div>

            {threads.slice(1).map((thread) => {
              const otherParticipant = thread.participants.find(p => p !== 'current-user');
              const contactName = getContactName(otherParticipant || '');
              const isSelected = selectedThread?.id === thread.id;
              return (
                <div
                  key={thread.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${isSelected ? 'bg-pink-50' : ''}`}
                  onClick={() => setSelectedThread(thread)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage src={getContactAvatar(otherParticipant || '')} />
                      <AvatarFallback>{contactName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm truncate">{contactName}</h4>
                        <span className="text-xs text-gray-500 ml-2">{formatTime(thread.lastMessageTime)}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">{thread.lastMessage}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedThread ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={getContactAvatar(selectedThread.participants.find(p => p !== 'current-user') || '')} />
                      <AvatarFallback>
                        {getContactName(selectedThread.participants.find(p => p !== 'current-user') || '').split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium">
                      {getContactName(selectedThread.participants.find(p => p !== 'current-user') || '')}
                    </h3>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('Messages')}
                      className={`rounded-full transition-colors ${
                        activeTab === 'Messages'
                          ? 'bg-white text-pink-600 border-pink-600 hover:bg-pink-600 hover:text-white'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-600 hover:text-white hover:border-pink-600'
                      }`}
                    >
                      Messages
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('Documents')}
                      className={`rounded-full transition-colors ${
                        activeTab === 'Documents'
                          ? 'bg-white text-pink-600 border-pink-600 hover:bg-pink-600 hover:text-white'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-600 hover:text-white hover:border-pink-600'
                      }`}
                    >
                      Documents
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('Media')}
                      className={`rounded-full transition-colors ${
                        activeTab === 'Media'
                          ? 'bg-white text-pink-600 border-pink-600 hover:bg-pink-600 hover:text-white'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-600 hover:text-white hover:border-pink-600'
                      }`}
                    >
                      Media
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedThread.messages.map((message) => {
                  const isOwnMessage = message.senderId === 'current-user';
                  const senderName = isOwnMessage ? userData?.name || 'You' : getContactName(message.senderId);
                  
                  return (
                    <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      {!isOwnMessage && (
                        <Avatar className="mr-2">
                          <AvatarImage src={getContactAvatar(message.senderId)} />
                          <AvatarFallback>{senderName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-md p-3 rounded-lg ${
                        isOwnMessage 
                          ? 'bg-pink-100 text-gray-900' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        {message.attachments.length > 0 && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2 text-xs text-red-600">
                              <div className="w-6 h-6 bg-red-600 text-white flex items-center justify-center rounded text-xs">
                                PDF
                              </div>
                              <span>Tech pack.pdf</span>
                              <span>12 MB</span>
                            </div>
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-end space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1">
                    <Input
                      placeholder="Create a new message"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-pink-600 hover:bg-pink-700 rounded-full w-10 h-10 p-0"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}