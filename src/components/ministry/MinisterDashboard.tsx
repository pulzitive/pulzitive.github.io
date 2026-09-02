import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Video, 
  HeartHandshake, 
  Sparkles, 
  Users, 
  Download, 
  ShieldCheck, 
  Layers, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Clock, 
  Globe, 
  Zap, 
  Crown, 
  MessageSquare, 
  Lock, 
  FolderSync, 
  FileText, 
  ChevronRight,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Calendar
} from 'lucide-react';
import { 
  UserProfile,
  MinisterProfile, 
  MediaRequestTask, 
  PrayerRequestPost, 
  DreamVisionInterpretation, 
  MinistryAssetResource, 
  MinisterDirectMessage,
  MinistrySubscriptionTier,
  MediaDeliverableFile,
  MediaRequestStatus
} from '../../types';
import { 
  getMinisterProfiles, 
  saveMinisterProfile, 
  getMediaRequests, 
  submitMediaRequest, 
  updateMediaRequestStatus, 
  addMediaDeliverableFile, 
  getPrayerRequests, 
  submitPrayerRequest, 
  incrementIntercession, 
  getDreamInterpretations, 
  submitDreamInterpretation, 
  addDreamComment, 
  getMinistryResources, 
  sendMinisterMessage 
} from '../../firebase';
import { MediaRequestModal } from './MediaRequestModal';
import { MediaTaskTracker } from './MediaTaskTracker';
import { PrayerWall } from './PrayerWall';
import { DreamInterpretationBoard } from './DreamInterpretationBoard';
import { MinistersDirectory } from './MinistersDirectory';
import { MinistryResourceLibrary } from './MinistryResourceLibrary';
import { MinistryPricingVerification } from './MinistryPricingVerification';

interface MinisterDashboardProps {
  currentUser: UserProfile;
  onTriggerNotification?: (text: string) => void;
  onNavigate?: (page: string) => void;
  initialTab?: string;
}

export const MinisterDashboard: React.FC<MinisterDashboardProps> = ({
  currentUser,
  onTriggerNotification = (_text: string) => {},
  onNavigate = (_page: string) => {},
  initialTab = 'media'
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [ministers, setMinisters] = useState<MinisterProfile[]>([]);
  const [mediaTasks, setMediaTasks] = useState<MediaRequestTask[]>([]);
  const [prayerPosts, setPrayerPosts] = useState<PrayerRequestPost[]>([]);
  const [dreams, setDreams] = useState<DreamVisionInterpretation[]>([]);
  const [resources, setResources] = useState<MinistryAssetResource[]>([]);
  const [currentTier, setCurrentTier] = useState<MinistrySubscriptionTier>('GROWTH_MINISTRY');

  // Derive current minister profile
  const currentMinister: MinisterProfile = {
    uid: currentUser.uid,
    email: currentUser.email || 'pastor@gracechurch.org',
    displayName: currentUser.displayName || 'Pastor John Doe',
    title: (currentUser as any).ministerTitle || 'Pastor',
    churchName: (currentUser as any).companyName || (currentUser as any).churchName || 'Grace City Chapel',
    denomination: (currentUser as any).denomination || 'Evangelical / Charismatic',
    country: (currentUser as any).country || 'Nigeria',
    city: (currentUser as any).city || 'Lagos',
    ministryFocus: (currentUser as any).ministryFocus || 'Pastoral',
    verificationStatus: (currentUser as any).verificationStatus || 'VERIFIED',
    role: 'MINISTER',
    subscriptionTier: currentTier,
    googleDriveFolderName: `${(currentUser.displayName || 'Pastor').replace(/\s+/g, '_')}_Media_Vault`,
    createdAt: '2026-08-31T00:00:00Z'
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [profList, taskList, prayList, dreamList, resList] = await Promise.all([
        getMinisterProfiles(),
        getMediaRequests(),
        getPrayerRequests(),
        getDreamInterpretations(),
        getMinistryResources()
      ]);

      setMinisters(profList);
      setMediaTasks(taskList);
      setPrayerPosts(prayList);
      setDreams(dreamList);
      setResources(resList);
    } catch (err) {
      console.error('Error loading minister dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Media task submission
  const handleMediaSubmit = async (taskData: Omit<MediaRequestTask, 'requestId' | 'createdAt' | 'status'>) => {
    try {
      const created = await submitMediaRequest(taskData);
      setMediaTasks([created, ...mediaTasks]);
      onTriggerNotification(`Sunday sermon editing ticket "${created.title}" submitted to video team!`);
      setActiveTab('media');
    } catch (err) {
      console.error(err);
      onTriggerNotification('Failed to submit sermon task. Please try again.');
    }
  };

  // Prayer post submission
  const handlePrayerSubmit = async (post: Omit<PrayerRequestPost, 'postId' | 'createdAt' | 'intercessionCount'>) => {
    try {
      const created = await submitPrayerRequest(post);
      setPrayerPosts([created, ...prayerPosts]);
      onTriggerNotification('Intercession petition broadcasted to global pastors.');
    } catch (err) {
      console.error(err);
      onTriggerNotification('Failed to post prayer request.');
    }
  };

  // Stand in agreement
  const handleIncrementIntercession = async (postId: string) => {
    try {
      await incrementIntercession(postId, currentMinister.uid);
      const updated = await getPrayerRequests();
      setPrayerPosts(updated);
      onTriggerNotification('You stood in faith for this ministry petition!');
    } catch (err) {
      console.error(err);
    }
  };

  // Dream submission
  const handleDreamSubmit = async (data: Omit<DreamVisionInterpretation, 'postId' | 'createdAt' | 'commentsCount' | 'comments'>) => {
    try {
      const created = await submitDreamInterpretation(data);
      setDreams([created, ...dreams]);
      onTriggerNotification('Prophetic dream submitted for Scriptural review.');
    } catch (err) {
      console.error(err);
      onTriggerNotification('Failed to submit dream.');
    }
  };

  // Add dream comment
  const handleAddDreamComment = async (
    postId: string, 
    commentData: { authorId: string; authorName: string; authorTitle?: string; authorChurch?: string; comment: string; scripturesCited?: string[] }
  ) => {
    try {
      await addDreamComment(postId, commentData);
      const updated = await getDreamInterpretations();
      setDreams(updated);
      onTriggerNotification('Biblical interpretation / comment added.');
    } catch (err) {
      console.error(err);
    }
  };

  // Send minister direct message
  const handleSendMessage = async (msg: Omit<MinisterDirectMessage, 'id' | 'timestamp'>) => {
    const res = await sendMinisterMessage(msg);
    onTriggerNotification(`Message sent to ${msg.recipientName}!`);
    return res;
  };

  // Upgrade or change subscription tier
  const handleSelectTier = (tier: MinistrySubscriptionTier) => {
    setCurrentTier(tier);
    onTriggerNotification(`Ministry plan updated to ${tier.replace('_', ' ')}.`);
  };

  // Submit ordination credentials for verification
  const handleVerificationSubmit = async (profileData: Partial<MinisterProfile>) => {
    try {
      await saveMinisterProfile({
        ...currentMinister,
        ...profileData
      } as MinisterProfile);
      setMinisters(await getMinisterProfiles());
      onTriggerNotification('Ordination credentials submitted for Super Admin verification.');
    } catch (err) {
      console.error(err);
      onTriggerNotification('Failed to save ordination verification.');
    }
  };

  const navTabs = [
    { id: 'media', label: 'Done-For-You Media Engine', icon: Video, badge: `${mediaTasks.length} Tasks` },
    { id: 'prayer', label: 'Global Intercession Wall', icon: HeartHandshake, badge: `${prayerPosts.length} Live` },
    { id: 'dreams', label: 'Dreams & Visions Sanctuary', icon: Sparkles, badge: 'Joel 2:28' },
    { id: 'directory', label: 'Ministers Network Directory', icon: Users, badge: `${ministers.length} Ministers` },
    { id: 'resources', label: 'Sermon Graphics & Slides', icon: Download, badge: 'Vault' },
    { id: 'pricing', label: 'Media Plans & Verification', icon: ShieldCheck, badge: currentTier === 'GROWTH_MINISTRY' ? 'Growth Plan' : undefined },
  ];

  return (
    <div className="space-y-8 w-full text-slate-900">
      
      {/* Dashboard Top Header & Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Glow orb background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              Pastors & Ministers Dashboard • EcclesiaHub
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Welcome, {currentMinister.displayName}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {currentMinister.churchName} ({currentMinister.city}, {currentMinister.country}) • Active Tier: <strong className="text-emerald-400">{currentTier.replace('_', ' ')}</strong>
            </p>
          </div>

          {/* Quick Action in Header */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsMediaModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02]"
            >
              <Video className="w-4 h-4" />
              <span>Submit Sermon for Editing</span>
            </button>

            <button
              onClick={loadAllData}
              disabled={isLoading}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-xl border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Sync Vault</span>
            </button>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Active Sermon Tasks</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{mediaTasks.length} Tickets</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Global Intercession</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block">{prayerPosts.length} Active Prayers</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Cloud Drive Vault</span>
            <span className="text-xl font-bold text-teal-400 mt-0.5 block">Connected</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Ordination Status</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block">Verified Minister</span>
          </div>
        </div>
      </div>

      {/* Feature Navigation Tabs Bar */}
      <div className="flex items-center justify-start gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 bg-white p-2 rounded-2xl shadow-xs border border-slate-200">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`minister-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    isActive
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Workspace Dynamic Tab View */}
      <div className="w-full">
        {activeTab === 'media' && (
          <MediaTaskTracker
            tasks={mediaTasks}
            onOpenNewTaskModal={() => setIsMediaModalOpen(true)}
            churchName={currentMinister.churchName}
          />
        )}

        {activeTab === 'prayer' && (
          <PrayerWall
            posts={prayerPosts}
            onSubmitPrayer={handlePrayerSubmit}
            onIncrementIntercession={handleIncrementIntercession}
            currentUserId={currentMinister.uid}
            currentUserName={currentMinister.displayName}
            currentUserChurch={currentMinister.churchName}
          />
        )}

        {activeTab === 'dreams' && (
          <DreamInterpretationBoard
            dreams={dreams}
            onSubmitDream={handleDreamSubmit}
            onAddComment={handleAddDreamComment}
            currentUserId={currentMinister.uid}
            currentUserName={currentMinister.displayName}
            currentUserChurch={currentMinister.churchName}
          />
        )}

        {activeTab === 'directory' && (
          <MinistersDirectory
            ministers={ministers}
            currentUserId={currentMinister.uid}
            currentUserName={currentMinister.displayName}
            currentUserChurch={currentMinister.churchName}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'resources' && (
          <MinistryResourceLibrary
            resources={resources}
            isPremiumUser={currentTier !== 'FREE'}
          />
        )}

        {activeTab === 'pricing' && (
          <MinistryPricingVerification
            currentTier={currentTier}
            onSelectTier={handleSelectTier}
            onSubmitVerification={handleVerificationSubmit}
            defaultMinisterName={currentMinister.displayName}
            defaultChurchName={currentMinister.churchName}
            defaultEmail={currentMinister.email}
          />
        )}
      </div>

      {/* Global Media Request Modal */}
      <MediaRequestModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSubmit={handleMediaSubmit}
        defaultMinisterName={currentMinister.displayName}
        defaultChurchName={currentMinister.churchName}
        userId={currentMinister.uid}
      />
    </div>
  );
};
