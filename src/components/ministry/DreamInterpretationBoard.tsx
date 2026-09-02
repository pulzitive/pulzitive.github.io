import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  BookOpen, 
  Plus, 
  ShieldCheck, 
  Send, 
  Tag, 
  Calendar,
  X,
  Compass
} from 'lucide-react';
import { DreamVisionInterpretation, DreamTag } from '../../types';

interface DreamInterpretationBoardProps {
  dreams: DreamVisionInterpretation[];
  onSubmitDream: (data: Omit<DreamVisionInterpretation, 'postId' | 'createdAt' | 'commentsCount' | 'comments'>) => Promise<void>;
  onAddComment: (postId: string, commentData: { authorId: string; authorName: string; authorTitle?: string; authorChurch?: string; comment: string; scripturesCited?: string[] }) => Promise<void>;
  currentUserId?: string;
  currentUserName?: string;
  currentUserChurch?: string;
}

export const DreamInterpretationBoard: React.FC<DreamInterpretationBoardProps> = ({
  dreams,
  onSubmitDream,
  onAddComment,
  currentUserId = 'usr_9981237',
  currentUserName = 'Pastor John Doe',
  currentUserChurch = 'Grace City Chapel'
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [selectedDream, setSelectedDream] = useState<DreamVisionInterpretation | null>(dreams[0] || null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentScriptures, setNewCommentScriptures] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // New dream state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<DreamTag[]>(['Harvest', 'End-Times']);
  const [isSubmittingDream, setIsSubmittingDream] = useState(false);

  const availableTags: DreamTag[] = [
    'End-Times',
    'Church Guidance',
    'Personal Prophetic',
    'Ministry Direction',
    'Harvest',
    'Evangelism',
    'Spiritual Warfare'
  ];

  const filteredDreams = dreams.filter(d => {
    if (selectedTag === 'ALL') return true;
    return d.tags.includes(selectedTag as DreamTag);
  });

  const toggleTag = (t: DreamTag) => {
    if (tags.includes(t)) {
      setTags(tags.filter(item => item !== t));
    } else {
      setTags([...tags, t]);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDream || !newCommentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const scriptures = newCommentScriptures
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      await onAddComment(selectedDream.postId, {
        authorId: currentUserId,
        authorName: currentUserName,
        authorTitle: 'Pastor',
        authorChurch: currentUserChurch,
        comment: newCommentText,
        scripturesCited: scriptures
      });

      setNewCommentText('');
      setNewCommentScriptures('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDreamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmittingDream(true);
    try {
      await onSubmitDream({
        authorId: currentUserId,
        authorName: currentUserName,
        authorChurch: currentUserChurch,
        title,
        description,
        tags
      });
      setShowSubmitModal(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingDream(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Joel 2:28 • Prophetic Guidance & Discernment
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dreams & Visions Interpretation Sanctuary
          </h2>
          <p className="text-sm text-slate-600">
            A scripturally anchored forum where verified ministers and seasoned elders test, weigh, and provide biblical interpretations for spiritual dreams, night visions, and prophetic burdens.
          </p>
        </div>

        <button
          id="open-dream-modal-btn"
          onClick={() => setShowSubmitModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Submit Vision / Dream
        </button>
      </div>

      {/* Tag Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedTag('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
            selectedTag === 'ALL'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Prophetic Tags
        </button>
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              selectedTag === tag
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Main Grid: Dream List + Interactive Discussion Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Left Column: Dreams List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredDreams.map((d) => (
            <div
              key={d.postId}
              onClick={() => setSelectedDream(d)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedDream?.postId === d.postId
                  ? 'bg-emerald-50/50 border-emerald-500 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-800">{d.authorName}</span>
                <span className="text-[11px] text-slate-400">{new Date(d.createdAt).toLocaleDateString()}</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2">{d.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed">{d.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {d.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-blue-700 border border-slate-200 font-bold">
                      #{t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>{(d.comments || []).length} Interpretations</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Selected Dream Thread (7 cols) */}
        <div className="lg:col-span-7">
          {selectedDream ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
              {/* Post Header */}
              <div className="space-y-3 pb-5 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center font-bold text-xs">
                      {selectedDream.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        {selectedDream.authorName}
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-[11px] text-slate-500">{selectedDream.authorChurch || 'Grace City Chapel'}</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {selectedDream.tags.map(t => (
                      <span key={t} className="text-[10px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{selectedDream.title}</h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                  "{selectedDream.description}"
                </div>
              </div>

              {/* Ministerial Commentaries & Scriptures */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Biblical Interpretations & Cross-References ({(selectedDream.comments || []).length})
                </h4>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {(selectedDream.comments || []).map((comm) => (
                    <div
                      key={comm.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                          {comm.authorName} ({comm.authorTitle || 'Elder'})
                          <span className="text-[11px] font-normal text-slate-500">• {comm.authorChurch}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{new Date(comm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">{comm.comment}</p>

                      {comm.scripturesCited && comm.scripturesCited.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold text-slate-500">Scriptural Anchor:</span>
                          {comm.scripturesCited.map((sc, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-900 text-[10px] font-mono font-bold">
                              {sc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Interpretation Input Form */}
                <form onSubmit={handleCommentSubmit} className="pt-3 border-t border-slate-200 space-y-3">
                  <textarea
                    rows={2}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Provide spiritual discernment, symbolic meaning, or prophetic confirmation..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      value={newCommentScriptures}
                      onChange={(e) => setNewCommentScriptures(e.target.value)}
                      placeholder="Scriptures cited (e.g. Joel 2:28, Amos 3:7)"
                      className="w-full sm:flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingComment}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Post Interpretation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500">
              Select a dream or vision from the list to explore biblical cross-references and commentaries.
            </div>
          )}
        </div>
      </div>

      {/* Submit Vision Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Submit Prophetic Dream or Vision
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDreamSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Vision Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dream of Golden Sickle and Great Urban Harvest"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Narrative *</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe colors, numbers, symbols, spiritual atmosphere, and exact events in sequence..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Prophetic Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map(t => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        tags.includes(t)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDream}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSubmittingDream ? 'Submitting...' : 'Post for Interpretation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
