'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Search, Send } from 'lucide-react';
import { BiLeftArrow } from 'react-icons/bi';
import { useRouter } from 'next/navigation';

interface Contact {
  id: number;
  name: string;
  role: string;
}

interface Message {
  text: string;
  sender: string;
  timestamp: string;
}

interface Conversation {
  id: number;
  name: string;
  role: string;
  messages: Message[];
}

const mockContacts: Contact[] = [
  { id: 1, name: 'John&apos;s Agro Store', role: 'Supplier' },
  { id: 2, name: 'Fresh Market Ltd', role: 'Buyer' },
  { id: 3, name: 'Organic Co-op', role: 'Buyer' },
  { id: 4, name: 'Farm Tools & More', role: 'Supplier' },
];

export default function FarmerMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('farmerConversations');
    if (stored) setConversations(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('farmerConversations', JSON.stringify(conversations));
  }, [conversations]);

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;
    const updated = conversations.map(conv =>
      conv.id === activeChat.id
        ? {
            ...conv,
            messages: [
              ...conv.messages,
              {
                sender: 'Farmer',
                text: message,
                timestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              },
            ],
          }
        : conv
    );
    setConversations(updated);
    setMessage('');
  };

  const startConversation = (contact: Contact) => {
    const existing = conversations.find(c => c.name === contact.name);
    if (existing) {
      setActiveChat(existing);
    } else {
      const newConv = {
        id: Date.now(),
        name: contact.name,
        role: contact.role,
        messages: [],
      };
      setConversations([...conversations, newConv]);
      setActiveChat(newConv);
    }
    setIsModalOpen(false);
    setSearch('');
  };

  const router = useRouter();

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-green-600 text-white">
          <div className="flex gap-2 items-center">
            <BiLeftArrow
              className="size-5 text-white cursor-pointer"
              onClick={() => router.back()}
            />
            <h2 className="text-lg font-semibold">Messages</h2>
          </div>
          <button
            className="bg-white text-green-600 p-2 rounded-full hover:bg-gray-200 transition"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center bg-gray-100 rounded px-2">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 p-2 bg-transparent outline-none text-sm text-gray-800"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-200 ${
                activeChat?.id === conv.id ? 'bg-green-50' : ''
              }`}
              onClick={() => setActiveChat(conv)}
            >
              <div className="font-medium">{conv.name}</div>
              <div className="text-xs text-gray-500">{conv.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white flex items-center shadow-sm">
              <div>
                <div className="font-medium">{activeChat.name}</div>
                <div className="text-xs text-gray-500">{activeChat.role}</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {activeChat.messages.map((msg: Message, i: number) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'Farmer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs text-sm shadow-sm ${
                      msg.sender === 'Farmer'
                        ? 'bg-green-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                    <div className="text-[10px] mt-1 opacity-70">{msg.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white flex">
              <input
                type="text"
                className="flex-1 border border-gray-200 rounded-l-lg p-2 text-sm outline-none text-gray-800"
                placeholder="Type your message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <button
                className="bg-green-600 text-white px-4 rounded-r-lg hover:bg-green-700 transition"
                onClick={sendMessage}
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-5 shadow-lg text-gray-800 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Start New Conversation</h3>
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border border-gray-200 rounded mb-4 text-sm text-gray-800"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto space-y-2">
              {mockContacts
                .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
                .map(contact => (
                  <div
                    key={contact.id}
                    className="p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => startConversation(contact)}
                  >
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-xs text-gray-500">{contact.role}</div>
                  </div>
                ))}
            </div>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
