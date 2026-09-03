/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, Filter, Clock, Award, Star, ChevronDown, ChevronUp, CreditCard, Sparkles, Zap } from 'lucide-react';
import { Course } from '../types';
import { getCourses } from '../firebase';
import { AnimatedHeroTitle } from '../components/AnimatedHeroTitle';

interface CoursesPageProps {
  onEnroll: (course: Course) => void;
}

export default function CoursesPage({ onEnroll }: CoursesPageProps) {
  const courses = getCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="bg-white text-slate-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Page Header */}
      <div className="max-w-5xl mx-auto text-center space-y-4 mb-12 relative z-10">
        <AnimatedHeroTitle 
          primaryText="Pulzitive Digital Academy"
          highlightText="Course Catalog & Certifications."
          dark={false}
          className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
        />
        <p className="text-xs text-slate-600 max-w-xl mx-auto font-medium">
          Learn cutting-edge skills in digital media, paid ads conversion, SEO auditing, and CRM email automation. Enroll today to start earning gamified XP.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="max-w-5xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 shadow-xs">
        
        {/* Search */}
        <div className="relative w-full md:max-w-sm flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                selectedLevel === lvl 
                  ? 'bg-emerald-600 text-white font-black shadow-sm' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

      </div>

      {/* Courses Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            No courses found matching your query.
          </div>
        ) : (
          filteredCourses.map(course => {
            const isExpanded = expandedCourseId === course.id;
            return (
              <div 
                key={course.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="space-y-4">
                  
                  {/* Badge Row */}
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase font-semibold">
                      {course.level}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1 font-sans">
                      <Clock className="w-3.5 h-3.5" /> {course.duration}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{course.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{course.description}</p>
                  </div>

                  {/* Syllabus Toggle */}
                  <div className="border-t border-slate-200 pt-3">
                    <button
                      onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                      className="w-full text-left text-[11px] font-medium text-slate-600 hover:text-slate-900 flex items-center justify-between cursor-pointer"
                    >
                      <span>Syllabus Breakdown</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <ul className="mt-2.5 pl-3.5 list-disc text-[10px] text-slate-600 space-y-1.5 leading-relaxed">
                        {course.syllabus.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] font-mono uppercase text-slate-400">Online Rate</span>
                    <span className="text-sm font-black text-slate-900">
                      ₦9,000 <span className="text-[10px] text-slate-500 font-normal">Individual</span>
                    </span>
                    <span className="block text-[9px] font-mono uppercase text-slate-400 mt-1">Physical Rate</span>
                    <span className="text-sm font-black text-slate-900">
                      ₦30,000 <span className="text-[10px] text-slate-500 font-normal">Individual</span>
                    </span>
                  </div>
                  <button
                    onClick={() => onEnroll(course)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-1 self-end shadow-sm"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-white" />
                    <span className="text-white font-extrabold">Enroll Now</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
