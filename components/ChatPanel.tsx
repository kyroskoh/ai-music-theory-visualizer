
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon, BotIcon, UserIcon } from './icons';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="bg-gray-800/50 ring-1 ring-white/10 rounded-lg shadow-xl flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">Theory Chatbot</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && <BotIcon className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />}
            <div className={`rounded-lg px-4 py-2 max-w-sm whitespace-pre-wrap ${msg.sender === 'bot' ? 'bg-gray-700 text-gray-200' : 'bg-cyan-600 text-white'}`}>
              {msg.text}
              {isLoading && msg.sender === 'bot' && index === messages.length -1 && <span className="inline-block w-1 h-4 bg-gray-300 ml-1 animate-pulse" />}
            </div>
            {msg.sender === 'user' && <UserIcon className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            className="w-full bg-gray-700 border-gray-600 rounded-full pl-4 pr-12 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
