import React, { useState } from 'react';
import { X, Video, Sparkles, FolderSync, Clock, Layers, UploadCloud, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MediaRequestType, MediaRequestTask } from '../../types';

interface MediaRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<MediaRequestTask, 'requestId' | 'createdAt' | 'status'>) => Promise<void>;
  defaultMinisterName?: string;
  defaultChurchName?: string;
  userId?: string;
}

export const MediaRequestModal: React.FC<MediaRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultMinisterName = 'Pastor John Doe',
  defaultChurchName = 'Grace City Chapel',
  userId = 'usr_9981237'
}) => {
  const [title, setTitle] = useState('');
  const [ministerName, setMinisterName] = useState(defaultMinisterName);
  const [churchName, setChurchName] = useState(defaultChurchName);
  const [rawVideoUrl, setRawVideoUrl] = useState('');
  const [requestType, setRequestType] = useState<MediaRequestType>('SERMON_SHORTS');
  const [timestampNotes, setTimestampNotes] = useState('');
  const [primaryTopic, setPrimaryTopic] = useState('');
  const [graphicStyleChoice, setGraphicStyleChoice] = useState('Bold High-Contrast Minimalist + Kinetic Captions');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram Reels', 'TikTok', 'YouTube Shorts']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const platforms = ['Instagram Reels', 'TikTok', 'YouTube Shorts', 'Facebook', 'LinkedIn', 'Church LED Screens'];

  const togglePlatform = (p: string) => {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(selectedPlatforms.filter(item => item !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawVideoUrl.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        userId,
        ministerName,
        churchName,
        title,
        rawVideoUrl,
        requestType,
        timestampNotes,
        primaryTopic,
        targetPlatforms: selectedPlatforms,
        graphicStyleChoice
      });
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
        setTitle('');
        setRawVideoUrl('');
        setTimestampNotes('');
        setPrimaryTopic('');
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Submit Media Production Task</h2>
              <p className="text-xs text-slate-500">Done-For-You editing by human gospel media specialists</p>
            </div>
          </div>
          <button
            id="close-media-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {successMessage ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Media Task Dispatched!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your sermon raw footage has been queued in the production engine. Our specialist will ingest, trim, add kinetic captions, and sync deliverables to your Church Google Drive folder within 24-48 hours.
              </p>
            </div>
          ) : (
            <form id="media-request-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Church & Minister Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Minister Name</label>
                  <input
                    type="text"
                    value={ministerName}
                    onChange={(e) => setMinisterName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="e.g. Pastor John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Church / Ministry Name</label>
                  <input
                    type="text"
                    value={churchName}
                    onChange={(e) => setChurchName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="e.g. Grace City Chapel"
                    required
                  />
                </div>
              </div>

              {/* Title & Raw Video Link */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Sermon / Event Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. Sunday Message: Walking in Divine Acceleration (Part 1)"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Raw Footage Link (Google Drive / YouTube / Vimeo / Dropbox) *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={rawVideoUrl}
                    onChange={(e) => setRawVideoUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="https://drive.google.com/file/d/... or https://youtube.com/watch?v=..."
                    required
                  />
                  <FolderSync className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Tip: Ensure sharing permission is set to "Anyone with link can view"
                </p>
              </div>

              {/* Deliverable Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Primary Deliverable</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { type: 'SERMON_SHORTS', label: '3x Sermon Shorts (9:16)', desc: 'Kinetic subtitles + hook' },
                    { type: 'GRAPHIC_SERIES', label: 'Sermon Series Pack', desc: 'Instagram carousel + flyers' },
                    { type: 'SERMON_SLIDES', label: '16:9 Presentation Deck', desc: 'Scriptures & key points' },
                    { type: 'BANNER', label: 'LED & Stream Banners', desc: 'Lower-thirds & overlays' },
                    { type: 'EVENT_PROMO', label: 'Conference Video Teaser', desc: 'High-energy 45s trailer' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => setRequestType(item.type as MediaRequestType)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        requestType === item.type
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timestamp Notes & Topics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Timestamp Suggestions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={timestampNotes}
                    onChange={(e) => setTimestampNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="e.g. 14:15 - 15:30 (Key faith hook), 42:00 (Prophetic prayer)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Core Scriptures / Theme
                  </label>
                  <textarea
                    rows={2}
                    value={primaryTopic}
                    onChange={(e) => setPrimaryTopic(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="e.g. Isaiah 43:18-19, Stepping into new spiritual seasons"
                  />
                </div>
              </div>

              {/* Target Platforms */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Distribution Channels</label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map(p => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        selectedPlatforms.includes(p)
                          ? 'bg-emerald-600 text-white font-bold border-emerald-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Graphic Style */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Graphic & Subtitle Style</label>
                <select
                  value={graphicStyleChoice}
                  onChange={(e) => setGraphicStyleChoice(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Bold High-Contrast Minimalist + Kinetic Captions">Bold High-Contrast Minimalist + Kinetic Captions (Recommended)</option>
                  <option value="Royal Blue & Emerald Contemporary Series Theme">Royal Blue & Emerald Contemporary Series Theme</option>
                  <option value="Modern Emerald Ambient Clean Style">Modern Emerald Ambient Clean Style</option>
                  <option value="Vibrant Youth Contemporary Blue Accents">Vibrant Youth Contemporary Blue Accents</option>
                  <option value="Clean Academic Scriptural Slides">Clean Academic Scriptural Slides</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-media-task-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  {isSubmitting ? 'Dispatching Task...' : 'Dispatch to Media Specialist'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
