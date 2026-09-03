/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Brain, AlertCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export default function AITutorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I am your **Pulzitive AI Tutor**, powered by **Gemini 3.5 Flash**. I can help you understand kids coding (Scratch, Mobile App development), graphics design, video editing, React, SEO, and artificial intelligence! How can I help you excel today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const academyFAQs = [
    {
      q: "Who can enroll in tech/coding classes?",
      a: "Children from age 5 to 16, as well as young adults and professionals! Pulzitive offers tailored learning pathways: Scratch coding for kids aged 5-11, and advanced modules like Frontend Web Design, Python, Roblox 3D Game Design, and Robotics & IoT for teenagers."
    },
    {
      q: "Are hardware kits needed for Robotics?",
      a: "No! For our interactive online courses, we use advanced 3D virtual microcontroller modeling environments (such as Tinkercad and virtual Micro:bit) so students can program smart circuits completely software-side. For physical training sessions, all hardware microcontrollers are supplied by Pulzitive."
    },
    {
      q: "Are certificates/diplomas awarded?",
      a: "Yes! Every student who completes 100% of their course modules, capstone projects, and milestones receives an accredited Pulzitive Digital Literacy & Tech Competency Certificate or Diploma."
    },
    {
      q: "Can I speak to a real human?",
      a: "Yes, absolutely! You can click 'Chat Live' on the WhatsApp banner at the top, or text/call Pulzitive directly on WhatsApp at +234 815 422 4426, or email us at pulzitive@gmail.com."
    }
  ];

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleFAQClick = (faq: { q: string, a: string }) => {
    // Add user question
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: faq.q,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Simulate typing delay for response
    setTimeout(() => {
      const botMsg: Message = {
        id: `tutor-faq-${Date.now()}`,
        role: 'model',
        text: faq.a,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsLoading(false);
    }, 600);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageText = input.trim();
    setInput('');
    setError(null);

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: userMessageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Map message history to schema expected by server endpoint
      const formattedHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessageText,
          history: formattedHistory
        })
      });

      if (!response.ok) {
        throw new Error('Could not connect to tutor service.');
      }

      const data = await response.json();
      
      const tutorMsg: Message = {
        id: `tutor-${Date.now()}`,
        role: 'model',
        text: data.text || "I was unable to compile an answer. Let's try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, tutorMsg]);
    } catch (err: any) {
      console.error(err);
      setError('Technical connection failure. Running tutor with offline instructions.');
      
      // Fallback response for complete client offline robustness
      setTimeout(() => {
        const mockMsg: Message = {
          id: `tutor-offline-${Date.now()}`,
          role: 'model',
          text: `Offline Tutor: You queried about **"${userMessageText}"**.\n\nHere are some strategic suggestions:\n\n1. **React State Flow**: Ensure state is centralized and modifications trigger top-down property flows.\n2. **Digital Ad Funnel**: Set specific lead constraints before allocating your Paystack marketing budget.\n3. **SEO Grounding**: Optimize keywords inside HTML titles and headers for optimal organic tracking index.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, mockMsg]);
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm tracking-wide">Pulzitive AI Tutor</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] text-gray-300 font-mono">Gemini 3.5 Flash Active</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* WhatsApp Live Banner */}
            <div className="bg-[#25d366]/10 p-2.5 px-4 border-b border-[#25d366]/20 flex items-center justify-between text-[11px] shrink-0">
              <span className="text-[#075e54] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] animate-pulse"></span>
                Need to chat with a real human?
              </span>
              <a
                href="https://wa.me/2348154224426"
                target="_blank"
                rel="noreferrer"
                className="bg-[#25d366] hover:bg-[#128c7e] text-white font-black px-2.5 py-1 rounded-lg transition-colors text-[9.5px] flex items-center gap-1 shadow-sm uppercase tracking-wider"
              >
                Chat Live
              </a>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'model' && (
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                      AI
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-br-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-sm'
                  }`}>
                    {/* Render Simple Markdown-like formatting (bolding and bullet points) */}
                    {msg.text.split('\n').map((paragraph, pIdx) => {
                      const trimmed = paragraph.trim();
                      if (trimmed.startsWith('-') || trimmed.startsWith('* ')) {
                        const content = trimmed.substring(2);
                        return (
                          <ul key={pIdx} className="list-disc pl-4 my-1">
                            <li>{parseBoldText(content)}</li>
                          </ul>
                        );
                      }
                      return (
                        <p key={pIdx} className={pIdx > 0 ? 'mt-2' : ''}>
                          {parseBoldText(paragraph)}
                        </p>
                      );
                    })}
                    <span className="block text-[8px] text-gray-400 mt-1 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                    AI
                  </div>
                  <div className="bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl text-[10px] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Instant FAQs Options Chips (adapted for Pulzitive AI Tutor) */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60 shrink-0">
                <p className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 font-bold" /> Frequently Asked Academy Questions:
                </p>
                <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {academyFAQs.map((faq, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleFAQClick(faq)}
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] px-3 py-2 rounded-xl cursor-pointer transition-all shadow-sm font-medium text-left leading-snug hover:border-slate-300"
                    >
                      {faq.q}
                    </button>
                  ))}
                </div>
              </div>

              <div ref={chatEndRef} />
            </div>

            {/* Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask coding or marketing questions..."
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 p-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center disabled:bg-slate-50 disabled:text-gray-300 disabled:cursor-not-allowed shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:bg-blue-500 border border-blue-500"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-[9px] text-slate-900 font-bold px-1.5 py-0.5 rounded-full uppercase">
            Tutor
          </span>
        )}
      </motion.button>
    </div>
  );
}

// Simple bolding formatter helper for React text render
function parseBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
