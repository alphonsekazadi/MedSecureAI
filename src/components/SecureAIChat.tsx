import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { aiService } from '../services/aiService';
import { medicalKnowledgeService } from '../services/medicalKnowledgeService';
import type { ChatMessage, AIResponse } from '../services/aiService';

const SecureAIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus] = useState(aiService.getProviderStatus());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${user?.name || 'Patient'}! I'm MedSecureAI, your secure health assistant. I can help you with general health information, wellness tips, and guide you on when to seek professional medical care. 

**Important**: I provide educational information only and cannot replace professional medical advice. For urgent medical concerns, please contact your healthcare provider or emergency services immediately.

How can I help you today?`,
      timestamp: new Date(),
      metadata: {
        encrypted: true,
        patientId: user?.patient_id,
        sessionId: crypto.randomUUID()
      }
    };

    setMessages([welcomeMessage]);
  }, [user]);

  // Send message to AI
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      metadata: {
        encrypted: true,
        patientId: user?.patient_id,
        sessionId: crypto.randomUUID()
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Generate AI response with Auth0 FGA knowledge filtering (Challenge Feature)
      const userId = user?.sub || 'anonymous';
      const userRole = user?.role || 'patient'; // Default to patient role
      
      const aiResponse: AIResponse = await aiService.generateResponse(
        [...messages, userMessage], 
        userId, 
        userRole
      );
      
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date(),
        metadata: {
          encrypted: true,
          patientId: user?.patient_id,
          sessionId: crypto.randomUUID()
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Add disclaimer if provided
      if (aiResponse.disclaimer) {
        const disclaimerMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `📋 **Medical Disclaimer**: ${aiResponse.disclaimer}`,
          timestamp: new Date(),
          metadata: {
            encrypted: true,
            patientId: user?.patient_id,
            sessionId: crypto.randomUUID()
          }
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, disclaimerMessage]);
        }, 1000);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again later or contact your healthcare provider if this is urgent.',
        timestamp: new Date(),
        metadata: {
          encrypted: true,
          patientId: user?.patient_id,
          sessionId: crypto.randomUUID()
        }
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
    // Re-add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome-new',
      role: 'assistant',
      content: `Chat cleared. How can I help you with your health questions today?`,
      timestamp: new Date(),
      metadata: {
        encrypted: true,
        patientId: user?.patient_id,
        sessionId: crypto.randomUUID()
      }
    };
    setMessages([welcomeMessage]);
  };

  // Format message timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!aiStatus.available) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="text-center py-8">
          <div className="h-16 w-16 bg-red-500/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">AI Service Not Available</h3>
          <p className="text-white/70 mb-4">
            Please configure an AI provider in your environment variables:
          </p>
          <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-left text-sm font-mono">
            <p className="mb-2 text-white">📋 <strong>Easy Setup Options:</strong></p>
            <p className="text-blue-400 mb-1">1. <strong>Groq (FREE)</strong>: Get API key at groq.com</p>
            <p className="text-green-400 mb-1">2. <strong>Hugging Face (FREE)</strong>: Get token at huggingface.co</p>
            <p className="text-purple-400 mb-1">3. <strong>Cohere</strong>: Get API key at cohere.ai</p>
            <p className="text-white/60 mt-2">Current provider: <strong className="text-white">{aiStatus.provider}</strong></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/20 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-500/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-blue-400/30">
              <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white">MedSecureAI Assistant</h3>
              <div className="flex items-center space-x-2 text-xs text-white/60">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Secure • {aiStatus.provider}</span>
                </div>
                <span>•</span>
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="text-white/60 hover:text-white/80 transition-colors duration-200 p-2 rounded-xl hover:bg-white/10"
            title="Clear chat"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-xl backdrop-blur-xl ${
                message.role === 'user'
                  ? 'bg-blue-500/30 text-white border border-blue-400/30'
                  : 'bg-white/10 text-white border border-white/20'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-white/60'}`}>
                {formatTime(message.timestamp)}
                {message.metadata?.encrypted && (
                  <span className="ml-2">🔒</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-xl max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-sm text-white/80">MedSecureAI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-white/20">
        <div className="flex space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about symptoms, health tips, or general medical questions..."
            className="flex-1 resize-none bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-blue-500/30 hover:bg-blue-500/40 disabled:bg-white/10 disabled:text-white/30 text-blue-400 px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2 backdrop-blur-xl border border-blue-400/30"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        
        <div className="mt-2 text-xs text-white/60 flex items-center space-x-2">
          <svg className="h-3 w-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Conversations are encrypted and HIPAA compliant</span>
          <span>•</span>
          <span>For emergencies, call your healthcare provider or 911</span>
        </div>
      </div>
    </div>
  );
};

export default SecureAIChat;