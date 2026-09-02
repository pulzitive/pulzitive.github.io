import React, { useState } from 'react';
import { 
  Download, 
  Search, 
  Sparkles, 
  Layers, 
  Video, 
  FileText, 
  Image as ImageIcon, 
  ExternalLink, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import { MinistryAssetResource } from '../../types';

interface MinistryResourceLibraryProps {
  resources: MinistryAssetResource[];
  isPremiumUser?: boolean;
}

export const MinistryResourceLibrary: React.FC<MinistryResourceLibraryProps> = ({
  resources,
  isPremiumUser = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Sermon Graphic Kits',
    'Lower Thirds & Overlays',
    'Slide Deck Templates',
    'Motion Backgrounds',
    'Social Banner Vectors'
  ];

  const filteredResources = resources.filter(res => {
    const matchesSearch = 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'ALL' || res.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 w-full">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Curated Sunday Media & Graphics Vault
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sermon Prep & Media Asset Resource Library
          </h2>
          <p className="text-sm text-slate-600">
            Download high-resolution PSDs, Canva template links, 4K ProPresenter motion loops, 16:9 presentation slide decks, and social media flyers ready for your church services.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sermon graphic kits, motion loops, PowerPoint decks..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                selectedCategory === c
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredResources.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-emerald-300 transition-all hover:shadow-md"
          >
            {/* Visual Thumbnail */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img
                src={item.previewUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

              {/* Format Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white text-[10px] font-bold font-mono">
                {item.format}
              </div>

              {item.isPremiumOnly && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold uppercase shadow-sm">
                  Growth Pro
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">{item.title}</h3>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Download Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">{item.fileSize} • {item.downloadsCount} downloads</span>

                <a
                  href={item.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Get Asset
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
