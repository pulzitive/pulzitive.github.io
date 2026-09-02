import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Flame, 
  Plus, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Check, 
  Users, 
  Calendar,
  Filter,
  X
} from 'lucide-react';
import { PrayerRequestPost, PrayerCategory } from '../../types';

interface PrayerWallProps {
  posts: PrayerRequestPost[];
  onSubmitPrayer: (post: Omit<PrayerRequestPost, 'postId' | 'createdAt' | 'intercessionCount'>) => Promise<void>;
  onIncrementIntercession: (postId: string) => Promise<void>;
  currentUserId?: string;
  currentUserName?: string;
  currentUserChurch?: string;
}

export const PrayerWall: React.FC<PrayerWallProps> = ({
  posts,
  onSubmitPrayer,
  onIncrementIntercession,
  currentUserId = 'usr_9981237',
  currentUserName = 'Pastor John Doe',
  currentUserChurch = 'Grace City Chapel'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PrayerCategory>('CHURCH_GROWTH');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prayedPostIds, setPrayedPostIds] = useState<string[]>([]);

  const categories = [
    { key: 'ALL', label: 'All Petitions' },
    { key: 'REGIONAL_REVIVAL', label: 'Regional Revival' },
    { key: 'CHURCH_GROWTH', label: 'Church Growth' },
    { key: 'HEALING_DELIVERANCE', label: 'Healing & Deliverance' },
    { key: 'PERSONAL_PROPHETIC', label: 'Personal Prophetic' },
    { key: 'FINANCIAL_BREAKTHROUGH', label: 'Kingdom Provision' },
  ];

  const filteredPosts = posts.filter(p => {
    if (selectedCategory === 'ALL') return true;
    return p.category === selectedCategory;
  });

  const handlePrayClick = async (postId: string) => {
    if (!prayedPostIds.includes(postId)) {
      setPrayedPostIds([...prayedPostIds, postId]);
    }
    await onIncrementIntercession(postId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitPrayer({
        authorId: currentUserId,
        authorName: currentUserName,
        authorTitle: 'Pastor',
        authorChurch: currentUserChurch,
        title,
        content,
        category,
        isPrivate
      });
      setShowSubmitModal(false);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            24/7 Global Intercessory Fire
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Gospel Ministers Prayer & Intercession Wall
          </h2>
          <p className="text-sm text-slate-600">
            Stand in the gap with verified pastors, apostolic leaders, and evangelists across nations. Intercede for regional revivals, church breakthroughs, and missionary protection.
          </p>
        </div>

        <button
          id="open-prayer-modal-btn"
          onClick={() => setShowSubmitModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Submit Prayer Petition
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Prayer Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredPosts.map((post) => {
          const hasPrayed = prayedPostIds.includes(post.postId) || (post.prayingMinisterIds || []).includes(currentUserId);

          return (
            <div
              key={post.postId}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all hover:shadow-md"
            >
              <div className="space-y-4">
                {/* Author Info & Badges */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {post.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        {post.authorName}
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-[11px] text-slate-500">{post.authorChurch || 'Verified Ministry'}</div>
                    </div>
                  </div>

                  {post.isPrivate ? (
                    <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200" title="Private Inner Circle">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                      {post.category.replace('_', ' ')}
                    </span>
                  )}
                </div>

                {/* Title & Body */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{post.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{post.content}</p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Flame className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  <span><strong className="text-slate-900">{post.intercessionCount}</strong> Ministers Praying</span>
                </div>

                <button
                  id={`pray-btn-${post.postId}`}
                  onClick={() => handlePrayClick(post.postId)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    hasPrayed
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                  }`}
                >
                  {hasPrayed ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Prayed Amen
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="w-3.5 h-3.5" />
                      Stand in Faith
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Petition Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                Submit Ministerial Prayer Petition
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Petition Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Prayer for 5-Campus Youth Conference Awakening"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PrayerCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="CHURCH_GROWTH">Church Growth & Building Projects</option>
                  <option value="REGIONAL_REVIVAL">Regional Revival & Youth Awakening</option>
                  <option value="HEALING_DELIVERANCE">Healing, Deliverance & Missions Safety</option>
                  <option value="PERSONAL_PROPHETIC">Personal Prophetic Direction & Wisdom</option>
                  <option value="FAMILY_MINISTRY">Pastoral Family & Marriage Strength</option>
                  <option value="FINANCIAL_BREAKTHROUGH">Kingdom Financial Release</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Prayer Details & Scriptures *</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe your burden and scriptures you are standing on..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="privacy-check"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="privacy-check" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Private Circle only (visible only to verified apostles & bishops)
                </label>
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
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? 'Posting Petition...' : 'Post to Intercession Wall'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
