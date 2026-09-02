import React, { useState } from 'react';
import { 
  FolderSync, 
  Video, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Download, 
  Play, 
  FileText, 
  Image as ImageIcon, 
  Layers, 
  Plus, 
  Folder, 
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { MediaRequestTask, MediaDeliverableFile } from '../../types';

interface MediaTaskTrackerProps {
  tasks: MediaRequestTask[];
  onOpenNewTaskModal: () => void;
  churchName?: string;
}

export const MediaTaskTracker: React.FC<MediaTaskTrackerProps> = ({
  tasks,
  onOpenNewTaskModal,
  churchName = 'Grace City Chapel'
}) => {
  const [selectedTask, setSelectedTask] = useState<MediaRequestTask | null>(tasks[0] || null);
  const [activeFolderTab, setActiveFolderTab] = useState<'deliverables' | 'raw' | 'wip' | 'brandkit'>('deliverables');
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  const getStatusBadge = (status: MediaRequestTask['status']) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" /> Queued for Review
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" /> In Active Production
          </span>
        );
      case 'REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Layers className="w-3.5 h-3.5" /> Quality Assurance
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ready in Google Drive
          </span>
        );
    }
  };

  const folderNameFormatted = churchName.replace(/\s+/g, '_');

  return (
    <div className="space-y-8 w-full">
      {/* Top Banner with Google Drive Auto-Sync Pipeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <FolderSync className="w-4 h-4 text-emerald-600" />
              Automated Google Drive Cloud Sync
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Church Media Production Vault & Workspace
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Cloud Path: <span className="text-slate-800 font-bold">/KingdomMedia_Storage/Churches/{folderNameFormatted}/</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="request-new-media-task-btn"
              onClick={onOpenNewTaskModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Sermon Media Task
            </button>
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-sm transition-colors cursor-pointer"
            >
              <FolderOpen className="w-4 h-4 text-blue-600" />
              Open Drive Folder
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Structured Folder Hierarchy Simulation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={() => setActiveFolderTab('deliverables')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeFolderTab === 'deliverables'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Folder className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">03_Deliverables</span>
            </div>
            <p className="text-[11px] text-slate-500">Ready-to-post vertical shorts, slide decks & banners</p>
          </button>

          <button
            onClick={() => setActiveFolderTab('raw')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeFolderTab === 'raw'
                ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Folder className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">01_Raw_Uploads</span>
            </div>
            <p className="text-[11px] text-slate-500">Full 4K Sunday service recordings & audio stems</p>
          </button>

          <button
            onClick={() => setActiveFolderTab('wip')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeFolderTab === 'wip'
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Folder className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900">02_In_Progress</span>
            </div>
            <p className="text-[11px] text-slate-500">Editor timeline cuts & draft reviews</p>
          </button>

          <button
            onClick={() => setActiveFolderTab('brandkit')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeFolderTab === 'brandkit'
                ? 'bg-teal-50 border-teal-300 text-teal-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Folder className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-slate-900">04_Brand_Kit</span>
            </div>
            <p className="text-[11px] text-slate-500">Church logos, font files, and color codes</p>
          </button>
        </div>
      </div>

      {/* Task Queue & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Left Column: Task List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Active Production Tickets ({tasks.length})
            </h3>
            <span className="text-xs text-slate-500 font-medium">Auto-synced</span>
          </div>

          <div className="space-y-3">
            {tasks.map((t) => (
              <div
                key={t.requestId}
                onClick={() => setSelectedTask(t)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedTask?.requestId === t.requestId
                    ? 'bg-emerald-50/50 border-emerald-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{t.title}</h4>
                  {getStatusBadge(t.status)}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="text-blue-700 font-bold">{t.requestType.replace('_', ' ')}</span>
                </div>

                {t.assignedEditorName && (
                  <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Specialist: <strong className="text-slate-900">{t.assignedEditorName}</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Task Inspector & Deliverables (7 cols) */}
        <div className="lg:col-span-7">
          {selectedTask ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusBadge(selectedTask.status)}
                    <span className="text-xs text-slate-400 font-mono">ID: {selectedTask.requestId}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedTask.title}</h3>
                </div>
                <a
                  href={selectedTask.rawVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Raw Footage
                </a>
              </div>

              {/* Task Metadata Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Minister / Church</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{selectedTask.ministerName}</div>
                  <div className="text-[11px] text-slate-600">{selectedTask.churchName}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Visual Style</div>
                  <div className="text-xs font-bold text-emerald-800 mt-0.5 line-clamp-1">
                    {selectedTask.graphicStyleChoice || 'High-Contrast Kinetic'}
                  </div>
                  <div className="text-[11px] text-slate-600">9:16 + 16:9 Ratios</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Assigned Editor</div>
                  <div className="text-xs font-bold text-teal-700 mt-0.5">
                    {selectedTask.assignedEditorName || 'Queued for Assignment'}
                  </div>
                  <div className="text-[11px] text-slate-600">KingdomMedia Staff</div>
                </div>
              </div>

              {/* Timestamp Notes */}
              {selectedTask.timestampNotes && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-xs font-bold text-slate-800">Pastor's Timestamp Directives:</div>
                  <p className="text-xs text-slate-600 font-mono">{selectedTask.timestampNotes}</p>
                </div>
              )}

              {/* Deliverables Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Rendered Deliverables in Google Drive ({(selectedTask.completedFiles || []).length})
                  </h4>
                </div>

                {(selectedTask.completedFiles && selectedTask.completedFiles.length > 0) ? (
                  <div className="space-y-2.5">
                    {selectedTask.completedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-4 hover:border-emerald-300 shadow-sm transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                            {file.fileName.endsWith('.mp4') ? (
                              <Video className="w-4 h-4" />
                            ) : file.fileName.endsWith('.zip') ? (
                              <ImageIcon className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">{file.fileName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                              <span>{file.fileSize || '25 MB'}</span>
                              {file.duration && (
                                <>
                                  <span>•</span>
                                  <span>{file.duration}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {file.fileName.endsWith('.mp4') && (
                            <button
                              onClick={() => setPreviewVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4')}
                              className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Play Video Preview"
                            >
                              <Play className="w-3.5 h-3.5" />
                              Preview
                            </button>
                          )}
                          <a
                            href={file.webContentLink || file.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
                    <Clock className="w-8 h-8 text-slate-400 mx-auto animate-pulse" />
                    <div className="text-xs font-bold text-slate-800">Deliverables Being Rendered</div>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      Our video editors are currently adding kinetic subtitles, color correction, and audio mastering. Files will automatically appear here once exported.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500">
              Select a media task from the left queue to inspect details and download deliverables.
            </div>
          )}
        </div>
      </div>

      {/* Video Preview Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <span className="text-xs font-bold text-emerald-700">9:16 Vertical Reel Preview</span>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="text-slate-500 hover:text-slate-900 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
            <video
              src={previewVideoUrl}
              controls
              autoPlay
              className="w-full h-auto rounded-xl aspect-[9/16] object-cover bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
};
