import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  MessageSquare, 
  Search, 
  MapPin, 
  ExternalLink, 
  Mic, 
  Paperclip, 
  Send, 
  CheckCheck, 
  Volume2, 
  FileText,
  X,
  Sparkles,
  Award
} from 'lucide-react';
import { MinisterProfile, MinisterDirectMessage } from '../../types';

interface MinistersDirectoryProps {
  ministers: MinisterProfile[];
  currentUserId?: string;
  currentUserName?: string;
  currentUserChurch?: string;
  onSendMessage: (msg: Omit<MinisterDirectMessage, 'id' | 'timestamp'>) => Promise<MinisterDirectMessage>;
}

export const MinistersDirectory: React.FC<MinistersDirectoryProps> = ({
  ministers,
  currentUserId = 'usr_9981237',
  currentUserName = 'Pastor John Doe',
  currentUserChurch = 'Grace City Chapel',
  onSendMessage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFocus, setSelectedFocus] = useState<string>('ALL');
  const [activeRecipient, setActiveRecipient] = useState<MinisterProfile | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hasVoiceNoteAttached, setHasVoiceNoteAttached] = useState(false);
  const [chatHistory, setChatHistory] = useState<MinisterDirectMessage[]>([
    {
      id: 'msg_001',
      senderId: 'usr_8829104',
      senderName: 'Apostle Emmanuel Eze',
      senderChurch: 'Kingdom Dominion Embassy',
      recipientId: currentUserId,
      recipientName: currentUserName,
      text: 'Greetings Pastor John! Loved your sermon hook on Overcoming Storms. We are holding our ministers round table in Abuja next month; would love to have you share with the pastors on church media leverage.',
      timestamp: '2026-08-31T09:30:00Z'
    },
    {
      id: 'msg_002',
      senderId: currentUserId,
      senderName: currentUserName,
      senderChurch: currentUserChurch,
      recipientId: 'usr_8829104',
      recipientName: 'Apostle Emmanuel Eze',
      text: 'Apostle Emmanuel! Honored by the invitation. KingdomMedia has been saving our media team 25+ hours every week on sermon shorts. I will send over the teaching outline.',
      hasVoiceNote: true,
      voiceDurationSec: 45,
      attachedDocName: 'Church_Media_Systems_SOP.pdf',
      attachedDocUrl: 'https://drive.google.com/file/d/1ChurchMediaSOP/view',
      timestamp: '2026-08-31T09:45:00Z'
    }
  ]);

  const focusOptions = ['ALL', 'Pastoral', 'Worship', 'Youth', 'Evangelism', 'Prophetic', 'Church Planting'];

  const filteredMinisters = ministers.filter(m => {
    const matchesSearch = 
      m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.churchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.city && m.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.country && m.country.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFocus = selectedFocus === 'ALL' || m.ministryFocus === selectedFocus;
    return matchesSearch && matchesFocus;
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRecipient || (!messageText.trim() && !hasVoiceNoteAttached)) return;

    setIsSending(true);
    try {
      const payload: Omit<MinisterDirectMessage, 'id' | 'timestamp'> = {
        senderId: currentUserId,
        senderName: currentUserName,
        senderChurch: currentUserChurch,
        recipientId: activeRecipient.uid,
        recipientName: activeRecipient.displayName,
        text: messageText || (hasVoiceNoteAttached ? '🎙️ [Voice Prayer Note Sent]' : ''),
        hasVoiceNote: hasVoiceNoteAttached,
        voiceDurationSec: hasVoiceNoteAttached ? 38 : undefined
      };

      const res = await onSendMessage(payload);
      setChatHistory([...chatHistory, res]);
      setMessageText('');
      setHasVoiceNoteAttached(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Vetted & Ordained Ministers Network
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Global Gospel Ministers Fellowship & Directory
          </h2>
          <p className="text-sm text-slate-600">
            Connect directly with verified pastors, apostolic overseers, and ministry leaders for cross-pollination, conference invitations, pastoral counsel, and joint evangelistic mission trips.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by minister name, church name, city or country..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {focusOptions.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFocus(f)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                selectedFocus === f
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Ministers Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredMinisters.map((minister) => (
          <div
            key={minister.uid}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all hover:shadow-md"
          >
            <div className="space-y-4">
              {/* Header with Title & Verification */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                    {minister.displayName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      {minister.displayName}
                      <ShieldCheck className="w-4 h-4 text-emerald-600" title="Verified Ordained Minister" />
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{minister.churchName}</p>
                  </div>
                </div>

                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                  {minister.subscriptionTier.replace('_', ' ')}
                </span>
              </div>

              {/* Location & Focus */}
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{minister.city}, {minister.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-800 font-bold">{minister.ministryFocus}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {minister.bio || 'Faithfully serving the body of Christ in teaching, prayer, and discipleship.'}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-2">
              {minister.websiteUrl ? (
                <a
                  href={minister.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ministry Website
                </a>
              ) : (
                <span className="text-xs text-slate-500 font-medium">{minister.denomination || 'Gospel Church'}</span>
              )}

              <button
                id={`message-minister-${minister.uid}`}
                onClick={() => setActiveRecipient(minister)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Direct Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 1-on-1 Direct Messaging Dialog */}
      {activeRecipient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col h-[520px] overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  {activeRecipient.displayName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {activeRecipient.displayName}
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-[11px] text-slate-500">{activeRecipient.churchName}</div>
                </div>
              </div>
              <button
                onClick={() => setActiveRecipient(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {chatHistory.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-2 shadow-sm ${
                        isMe
                          ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                          : 'bg-white text-slate-900 rounded-tl-none border border-slate-200'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>

                      {msg.hasVoiceNote && (
                        <div className={`flex items-center gap-2 p-2 rounded-xl text-xs ${isMe ? 'bg-emerald-700' : 'bg-slate-100'}`}>
                          <Volume2 className={`w-4 h-4 ${isMe ? 'text-white' : 'text-blue-600'}`} />
                          <div className="h-1.5 flex-1 bg-slate-300 rounded-full overflow-hidden">
                            <div className={`w-2/3 h-full rounded-full ${isMe ? 'bg-white' : 'bg-emerald-600'}`} />
                          </div>
                          <span className="text-[10px] font-mono">{msg.voiceDurationSec || 45}s</span>
                        </div>
                      )}

                      {msg.attachedDocName && (
                        <a
                          href={msg.attachedDocUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-[11px] font-bold underline"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {msg.attachedDocName}
                        </a>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 space-y-2">
              {hasVoiceNoteAttached && (
                <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    <span>Voice Note Attached (0:38)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasVoiceNoteAttached(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHasVoiceNoteAttached(!hasVoiceNoteAttached)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    hasVoiceNoteAttached
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Attach Voice Note"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Message ${activeRecipient.displayName}...`}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />

                <button
                  type="submit"
                  disabled={isSending || (!messageText.trim() && !hasVoiceNoteAttached)}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
