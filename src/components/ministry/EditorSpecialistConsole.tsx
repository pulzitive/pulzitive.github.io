import React, { useState } from 'react';
import { 
  Tv, 
  Clock, 
  CheckCircle2, 
  Layers, 
  ExternalLink, 
  UploadCloud, 
  UserCheck, 
  Sparkles, 
  Video, 
  Plus,
  X
} from 'lucide-react';
import { MediaRequestTask, MediaDeliverableFile, MediaRequestStatus } from '../../types';

interface EditorSpecialistConsoleProps {
  tasks: MediaRequestTask[];
  onUpdateStatus: (requestId: string, status: MediaRequestStatus, assignedEditorId?: string, assignedEditorName?: string) => Promise<void>;
  onAddDeliverable: (requestId: string, deliverable: MediaDeliverableFile) => Promise<void>;
}

export const EditorSpecialistConsole: React.FC<EditorSpecialistConsoleProps> = ({
  tasks,
  onUpdateStatus,
  onAddDeliverable
}) => {
  const [selectedTask, setSelectedTask] = useState<MediaRequestTask | null>(tasks[0] || null);
  const [showDeliverableModal, setShowDeliverableModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const [webViewLink, setWebViewLink] = useState('');
  const [fileSize, setFileSize] = useState('24.5 MB');
  const [duration, setDuration] = useState('0:58');
  const [isSubmittingFile, setIsSubmittingFile] = useState(false);

  const editors = [
    { id: 'staff_004', name: 'David K. (Senior Video Specialist)' },
    { id: 'staff_002', name: 'Grace T. (Brand Design Lead)' },
    { id: 'staff_001', name: 'Samuel O. (Audio & Motion Editor)' },
  ];

  const handleStatusChange = async (status: MediaRequestStatus) => {
    if (!selectedTask) return;
    await onUpdateStatus(selectedTask.requestId, status);
  };

  const handleAssignEditor = async (editorId: string, editorName: string) => {
    if (!selectedTask) return;
    await onUpdateStatus(selectedTask.requestId, 'IN_PROGRESS', editorId, editorName);
  };

  const handleDeliverableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !fileName.trim() || !webViewLink.trim()) return;

    setIsSubmittingFile(true);
    try {
      const driveFileId = `file_${Date.now()}`;
      await onAddDeliverable(selectedTask.requestId, {
        fileName,
        driveFileId,
        webViewLink,
        webContentLink: webViewLink,
        fileSize,
        duration
      });
      setShowDeliverableModal(false);
      setFileName('');
      setWebViewLink('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingFile(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Tv className="w-3.5 h-3.5 text-blue-600" />
            Specialist Production Hub & Ticket Queue
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            KingdomMedia Human Editor Queue
          </h2>
          <p className="text-sm text-slate-600">
            Fulfill church sermon editing tickets, generate kinetic captions, create sermon graphics packs, and upload finished deliverables to church Google Drive vaults.
          </p>
        </div>
      </div>

      {/* Grid: Tickets List & Active Editor Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Left: Tickets (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Production Queue ({tasks.length} tasks)
          </h3>

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
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{t.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold border border-slate-200 text-slate-800">
                    {t.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 mb-2">
                  <span>{t.ministerName} • {t.churchName}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>{t.requestType.replace('_', ' ')}</span>
                  <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Task Workspace (7 cols) */}
        <div className="lg:col-span-7">
          {selectedTask ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">Ticket: {selectedTask.requestId}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{selectedTask.title}</h3>
                  <p className="text-xs text-slate-500">{selectedTask.ministerName} • {selectedTask.churchName}</p>
                </div>

                <a
                  href={selectedTask.rawVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Raw Video
                </a>
              </div>

              {/* Pastor Directives */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800 uppercase">Pastor Instructions & Timestamps:</div>
                <p className="text-xs text-slate-700 font-mono leading-relaxed">
                  {selectedTask.timestampNotes || 'No custom timestamps provided. Extract the strongest viral hook & scripture application.'}
                </p>
                <div className="text-xs text-slate-600 font-semibold pt-1">
                  Graphic Style: <span className="text-emerald-800 font-bold">{selectedTask.graphicStyleChoice}</span>
                </div>
              </div>

              {/* Editor Assignment & Status Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Assign Production Specialist</label>
                  <select
                    value={selectedTask.assignedEditorId || ''}
                    onChange={(e) => {
                      const found = editors.find(ed => ed.id === e.target.value);
                      if (found) handleAssignEditor(found.id, found.name);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">-- Select Specialist --</option>
                    {editors.map(ed => (
                      <option key={ed.id} value={ed.id}>{ed.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Update Ticket Workflow Status</label>
                  <div className="flex gap-2">
                    {(['SUBMITTED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'] as MediaRequestStatus[]).map(st => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        className={`flex-1 py-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                          selectedTask.status === st
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {st === 'IN_PROGRESS' ? 'WIP' : st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upload Deliverable Link */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Synced Deliverables ({(selectedTask.completedFiles || []).length})
                  </h4>

                  <button
                    onClick={() => setShowDeliverableModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Attach Finished Render
                  </button>
                </div>

                <div className="space-y-2">
                  {(selectedTask.completedFiles || []).map((f, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{f.fileName}</div>
                        <div className="text-[10px] text-slate-500">{f.fileSize} • {f.duration || 'Presentation Deck'}</div>
                      </div>
                      <a
                        href={f.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-blue-700 hover:underline"
                      >
                        View in Drive
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl text-slate-500">
              Select a task to manage workflow.
            </div>
          )}
        </div>
      </div>

      {/* Attach Render Modal */}
      {showDeliverableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                Upload Deliverable Link
              </div>
              <button
                onClick={() => setShowDeliverableModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeliverableSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">File Name *</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. Sunday_Sermon_Short_Clip_1.mp4"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Google Drive Web View Link *</label>
                <input
                  type="url"
                  value={webViewLink}
                  onChange={(e) => setWebViewLink(e.target.value)}
                  placeholder="https://drive.google.com/file/d/.../view"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">File Size</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="24.8 MB"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="0:58"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDeliverableModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFile}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSubmittingFile ? 'Syncing...' : 'Sync Deliverable to Church'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
