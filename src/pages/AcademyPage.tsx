/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, BookOpen, GraduationCap, ArrowRight, MessageSquare, 
  HelpCircle, CheckCircle, Code, Star, Compass, Play, Pause, Download, ExternalLink, Globe2, Award,
  Search, Filter, Clock, ChevronDown, ChevronUp, CreditCard, Calendar,
  Check, Shield, ShieldCheck, Users, ShieldAlert, LogIn, UserPlus, X, ChevronRight, ChevronLeft, Zap,
  CloudSun, Brain, TrendingUp, Volume2, RefreshCw, Lock, Unlock, Laptop
} from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedHeroTitle } from '../components/AnimatedHeroTitle';
import { getCourses, loginWithGoogleSimulated, enrollInCourse, isRealFirebase, signInWithGoogleReal, sendNotification } from '../firebase';
import { Course, UserProfile, UserRole } from '../types';

// Workspaces definition moved outside of the component for clean static reference
const workspacesList = [
  {
    role: 'Student' as UserRole,
    title: 'Student Workspace',
    desc: 'Track XP, Badges & Learn',
    features: ['Gamified learning & XP leaderboards', 'AITutor widget interactive assistance', 'Certificate generation & course enrolling'],
    icon: Award,
    color: 'from-emerald-500/10 to-indigo-500/5',
    borderColor: 'hover:border-emerald-400/50',
    textColor: 'text-emerald-600',
    badgeColor: 'bg-emerald-50 text-emerald-600',
    btnBg: 'bg-emerald-500 hover:bg-emerald-600 text-white'
  }
];

const techAdsList = [
  {
    courseId: 'dm-seo-mastery',
    badge: 'SEO & ORGANIC',
    title: 'SEO Mastery & Technical Auditing',
    desc: 'Master keyword strategy, content clusters, local SEO, technical crawling indexation fixes, page architecture setups, and schema configurations to command Page 1 organic visibility.',
    icon: Search,
    color: 'from-emerald-500/10 to-teal-500/5',
    btnLabel: 'Enroll in SEO Mastery',
    features: [
      'Crawl Audits & Schema Markup',
      'Montserrat & Web Font Geometries',
      'Semantic Optimization Workflows'
    ],
    stats: {
      duration: '4 Hours',
      xp: '+1200 XP',
      level: 'Intermediate'
    }
  },
  {
    courseId: 'dm-social-ads',
    badge: 'PAID SOCIAL ADS',
    title: 'Paid Social Ads & Conversion Funnels',
    desc: 'Build high-converting Meta and TikTok campaigns. Setup custom pixels, implement Conversions API triggers, write direct response ad copy, and scale creative testing architectures.',
    icon: Zap,
    color: 'from-purple-500/10 to-indigo-500/5',
    btnLabel: 'Enroll in Paid Social Ads',
    features: [
      'Conversions API Tracking',
      'AIDA Copywriting Secrets',
      'Custom & Lookalike Audiences'
    ],
    stats: {
      duration: '4 Hours',
      xp: '+1500 XP',
      level: 'Advanced'
    }
  },
  {
    courseId: 'dm-google-ppc',
    badge: 'GOOGLE SEARCH PPC',
    title: 'Google Search Ads & Performance Max',
    desc: 'Design high-yield Google Search PPC and Performance Max campaigns. Master keyword bidding, negative keyword siloing, Smart Bidding optimization, and retargeting systems.',
    icon: TrendingUp,
    color: 'from-amber-500/10 to-orange-500/5',
    btnLabel: 'Enroll in Google Ads PPC',
    features: [
      'Responsive Search Ads (RSA)',
      'Smart Bidding: Target CPA/ROAS',
      'Performance Max & Display Ads'
    ],
    stats: {
      duration: '4 Hours',
      xp: '+1600 XP',
      level: 'Advanced'
    }
  }
];

const onboardingSteps = [
  {
    number: '01',
    title: 'Select Your Strategy',
    desc: 'Browse highly concentrated practical sessions covering SEO, paid social funnels, Google PPC, and email marketing pipelines.',
    icon: BookOpen,
    color: 'from-emerald-500/10 to-teal-500/5',
    textColor: 'text-emerald-600',
    borderColor: 'hover:border-emerald-500/30'
  },
  {
    number: '02',
    title: 'Connect with Growth Mentors',
    desc: 'Get live campaign feedback, ad copy reviews, and direct personalized advice from elite, world-class digital marketing specialists.',
    icon: Users,
    color: 'from-indigo-500/10 to-purple-500/5',
    textColor: 'text-indigo-600',
    borderColor: 'hover:border-indigo-500/30'
  },
  {
    number: '03',
    title: 'Launch Practice Hubs',
    desc: 'Test real campaign tactics using integrated ROI calculators, budget analyzers, and mock ad designer playgrounds on your dashboard.',
    icon: TrendingUp,
    color: 'from-purple-500/10 to-pink-500/5',
    textColor: 'text-purple-600',
    borderColor: 'hover:border-purple-500/30'
  },
  {
    number: '04',
    title: 'Claim Certified Credentials',
    desc: 'Publish your campaign case studies, receive accredited marketing certifications, and unlock elite alumni growth networks.',
    icon: Award,
    color: 'from-amber-500/10 to-orange-500/5',
    textColor: 'text-amber-600',
    borderColor: 'hover:border-amber-500/30'
  }
];

const weatherCityData = {
  Lagos: { temp: 31.4, humidity: 78, wind: 14.2, cond: 'Humid & Sunny' },
  Abuja: { temp: 28.5, humidity: 62, wind: 10.5, cond: 'Clear & Breezy' },
  London: { temp: 16.2, humidity: 85, wind: 22.4, cond: 'Passing Showers' },
  Nairobi: { temp: 21.0, humidity: 55, wind: 12.8, cond: 'Cool & Sunny' }
};

const languagePhrases = {
  Yoruba: [
    { english: 'Welcome', native: 'Ẹ n lẹ / Ẹ kààbọ̀', pron: 'Eh n-le / Eh kah-bo', meaning: 'Standard greeting for welcoming group or respect.' },
    { english: 'Thank you', native: 'Ẹ ṣe pupọ', pron: 'Ẹ ṣe pupọ', meaning: 'Expression of gratitude.' },
    { english: 'Good morning', native: 'Ẹ káàárọ̀', pron: 'Eh kah-ah-raw', meaning: 'Respectful morning greeting.' }
  ],
  Igbo: [
    { english: 'Welcome', native: 'Nnọọ', pron: 'N-naw-aw', meaning: 'Warm welcome greeting.' },
    { english: 'Thank you', native: 'Imela', pron: 'Ee-mey-lah', meaning: 'Gratitude expression.' },
    { english: 'Good morning', native: 'Ị bọlah chi', pron: 'Ee baw-lah chee', meaning: 'Morning greeting.' }
  ],
  Hausa: [
    { english: 'Welcome', native: 'Sannu da zuwa', pron: 'Sahn-noo dah zoo-wah', meaning: 'Welcome greeting.' },
    { english: 'Thank you', native: 'Nagode', pron: 'Nah-gaw-dey', meaning: 'Sincere appreciation.' },
    { english: 'Good morning', native: 'Ina kwana', pron: 'Ee-nah kwah-nah', meaning: 'Literally "How did you sleep?"' }
  ]
};

const languageQuiz = {
  Yoruba: {
    question: "Which of these means 'How is the family / household?' in Yoruba?",
    options: ['Bawo ni ile?', 'Kedu?', 'Sannu da gida?'],
    correct: 'Bawo ni ile?',
    hint: 'Uses "Bawo ni" (How is/are) paired with "ile" (home/house).'
  },
  Igbo: {
    question: "Which of these means 'How are you?' in Igbo?",
    options: ['Kedu ka ị mere?', 'Bawo ni?', 'Ina kwana?'],
    correct: 'Kedu ka ị mere?',
    hint: 'Starts with "Kedu", the universal greeting prefix in Igbo.'
  },
  Hausa: {
    question: "Which of these means 'Goodbye' in Hausa?",
    options: ['Sai an jima', 'O dabo', 'Ka ọ dị nma'],
    correct: 'Sai an jima',
    hint: 'Roughly translates to "Until later".'
  }
};

const testimonialsList = [
  {
    quote: "The 4-hour SEO session was incredibly dense with practical value. I learned how to run deep site audits and configure content clusters immediately.",
    author: "Sade O.",
    role: "SEO & Growth Learner",
    avatar: "SO",
    category: "Students",
    stars: 5,
    tag: "SEO Audit Class"
  },
  {
    quote: "The Physical Ads class in Lagos gave me the exact hands-on conversion funnel experience I needed. I am now managing campaigns for local business brands!",
    author: "Emeka K.",
    role: "Graduate Trainee",
    avatar: "EK",
    category: "Students",
    stars: 5,
    tag: "Meta & PPC Sessions"
  },
  {
    quote: "The CRM & Email Automation session was a game-changer. I optimized our team's lead pipelines and boosted email click rates by 40%.",
    author: "Mr. Ibrahim A.",
    role: "Growth Marketer",
    avatar: "IA",
    category: "Students",
    stars: 5,
    tag: "CRM & Automations"
  },
  {
    quote: "Enrolling our marketing team in the Physical Class was the best investment. We designed a complete programmatic ad schedule and split-testing structure.",
    author: "Dr. Florence W.",
    role: "Brand Owner",
    avatar: "FW",
    category: "Students",
    stars: 5,
    tag: "Group Enrollment"
  },
  {
    quote: "I went from zero knowledge to confident marketer. The Google Ads session taught me Smart Bidding and negative keyword silos in under 4 hours.",
    author: "Babajide A.",
    role: "Career Switcher",
    avatar: "BA",
    category: "Students",
    stars: 5,
    tag: "PPC Conversion Ready"
  }
];


export function getSandboxHtml(courseId: string, title: string): string {
  let content = '';
  let initScript = '';

  if (courseId === 'reception-tynker') {
    content = `
      <div class="flex flex-col md:flex-row gap-3 h-full overflow-hidden">
        <div class="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
          <div>
            <h4 class="text-xs font-bold text-slate-700 mb-2">🧩 Code Blocks</h4>
            <div class="grid grid-cols-2 gap-1.5 mb-2">
              <button onclick="addBlock('fwd')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded-lg text-[10px]">➡️ Move Forward</button>
              <button onclick="addBlock('back')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded-lg text-[10px]">⬅️ Move Backward</button>
              <button onclick="addBlock('right')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded-lg text-[10px]">🔄 Turn Right</button>
              <button onclick="addBlock('left')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded-lg text-[10px]">↩️ Turn Left</button>
            </div>
            <div id="seq-list" class="border border-slate-200 bg-white rounded-lg p-2 h-24 overflow-y-auto space-y-1 text-[11px] shadow-inner">
              <p id="empty-msg" class="text-slate-400 italic text-center pt-4">Click blocks to script sequence</p>
            </div>
          </div>
          <div class="flex gap-1.5 mt-2">
            <button onclick="resetTynker()" class="flex-1 bg-slate-200 text-slate-700 font-bold py-2 rounded-lg text-[10px]">Reset</button>
            <button onclick="runTynker()" class="flex-1 bg-emerald-500 text-white font-bold py-2 rounded-lg text-[10px]">▶️ Run Program</button>
          </div>
        </div>
        <div class="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-center min-h-[160px] relative">
          <div class="grid grid-cols-5 gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-48 h-48 relative shadow-inner">
            <div id="grid-cells" class="contents"></div>
            <div id="robot" class="absolute w-8 h-8 flex items-center justify-center text-xl transition-all duration-300" style="top:0;left:0;">🤖</div>
          </div>
        </div>
      </div>
    `;
    initScript = `
      let seq = [];
      const cells = document.getElementById('grid-cells');
      for(let i=0; i<25; i++) {
        const d = document.createElement('div');
        d.className = 'bg-white border border-slate-200/40 rounded flex items-center justify-center';
        if(i===24) d.innerHTML = '🔋';
        cells.appendChild(d);
      }
      let rx = 0, ry = 0, ra = 0;
      function upRobot() {
        const r = document.getElementById('robot');
        r.style.top = (ry * 20) + '%';
        r.style.left = (rx * 20) + '%';
        r.style.transform = 'rotate(' + ra + 'deg)';
      }
      window.addBlock = function(type) {
        playSound('click');
        seq.push(type);
        renderSeq();
      };
      function renderSeq() {
        const l = document.getElementById('seq-list');
        l.innerHTML = seq.map((b,i) => '<div class="flex items-center justify-between bg-indigo-50 p-1 rounded font-bold"><span>' + (b=='fwd'?'➡️ Forward':b=='back'?'⬅️ Backward':b=='right'?'🔄 Right':'↩️ Left') + '</span><span onclick="event.stopPropagation(); seq.splice('+i+',1); renderSeq();" class="text-slate-400 hover:text-red-500 cursor-pointer">✕</span></div>').join('') || '<p class="text-slate-400 italic text-center pt-4">Click blocks to script sequence</p>';
      }
      window.resetTynker = function() {
        playSound('click'); seq = []; renderSeq(); rx=0; ry=0; ra=0; upRobot();
        log('Goal: Guide the Robot to the Battery 🔋!');
      };
      window.runTynker = async function() {
        if(!seq.length) { playSound('error'); return; }
        rx=0; ry=0; ra=0; upRobot(); log('🏃 Executing program...');
        for(let b of seq) {
          await new Promise(r => setTimeout(r, 500));
          if(b === 'fwd') {
            let n = ((ra%360)+360)%360;
            if(n===0) rx=Math.min(4, rx+1);
            else if(n===90) ry=Math.min(4, ry+1);
            else if(n===180) rx=Math.max(0, rx-1);
            else if(n===270) ry=Math.max(0, ry-1);
          } else if(b === 'back') {
            let n = ((ra%360)+360)%360;
            if(n===0) rx=Math.max(0, rx-1);
            else if(n===90) ry=Math.max(0, ry-1);
            else if(n===180) rx=Math.min(4, rx+1);
            else if(n===270) ry=Math.min(4, ry+1);
          } else if(b === 'right') { ra += 90; }
          else if(b === 'left') { ra -= 90; }
          playSound('click'); upRobot();
        }
        await new Promise(r => setTimeout(r, 300));
        if(rx===4 && ry===4) {
          playSound('success'); log('🎉 Success! Target reached! +100 XP');
        } else {
          playSound('error'); log('❌ Missed the battery! Adjust your sequence and retry.');
        }
      };
    `;
  } else if (courseId === 'reception-swift') {
    content = `
      <div class="flex flex-col md:flex-row gap-3 h-full overflow-hidden">
        <div class="flex-1 bg-slate-900 text-slate-100 rounded-xl p-3 flex flex-col justify-between overflow-hidden shadow-md">
          <div>
            <h4 class="text-xs font-mono font-bold text-indigo-400 mb-2">👩‍💻 Swift Workspace</h4>
            <div class="bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[10px] text-emerald-400 mb-2 min-h-[90px] overflow-y-auto" id="code-lines">
              <span class="text-slate-500">// Tap command cards to insert</span>
            </div>
            <div class="grid grid-cols-3 gap-1">
              <button onclick="addSwift('moveForward()')" class="bg-slate-800 text-[9px] font-mono p-1.5 rounded text-slate-300">moveForward()</button>
              <button onclick="addSwift('turnLeft()')" class="bg-slate-800 text-[9px] font-mono p-1.5 rounded text-slate-300">turnLeft()</button>
              <button onclick="addSwift('collectGem()')" class="bg-slate-800 text-[9px] font-mono p-1.5 rounded text-slate-300">collectGem()</button>
            </div>
          </div>
          <div class="flex gap-1.5 mt-2">
            <button onclick="resetSwift()" class="bg-slate-800 text-slate-400 font-bold py-2 rounded-lg text-[10px]">Reset</button>
            <button onclick="runSwift()" class="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg text-[10px]">🚀 Compile & Run</button>
          </div>
        </div>
        <div class="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-center min-h-[160px] relative">
          <div class="grid grid-cols-4 gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 w-44 h-44 relative shadow-inner">
            <div id="swift-cells" class="contents"></div>
            <div id="swift-player" class="absolute w-9 h-9 flex items-center justify-center text-xl transition-all duration-300" style="top:0;left:0;">👾</div>
          </div>
        </div>
      </div>
    `;
    initScript = `
      let code = [];
      const swCells = document.getElementById('swift-cells');
      for(let i=0; i<16; i++) {
        const d = document.createElement('div');
        d.className = 'bg-white border border-slate-200 rounded flex items-center justify-center';
        if(i===15) d.innerHTML = '<span id="gem">💎</span>';
        swCells.appendChild(d);
      }
      let px=0, py=0, dir='E';
      function upPlayer() {
        const p = document.getElementById('swift-player');
        p.style.top = (py * 25) + '%';
        p.style.left = (px * 25) + '%';
        p.style.transform = 'rotate(' + (dir=='E'?0:dir=='S'?90:dir=='W'?180:270) + 'deg)';
      }
      window.addSwift = function(cmd) {
        playSound('click'); code.push(cmd); renderSwift();
      };
      function renderSwift() {
        const b = document.getElementById('code-lines');
        b.innerHTML = code.map((c,i) => '<div class="flex items-center justify-between"><span>' + c + '</span><span onclick="event.stopPropagation(); code.splice('+i+',1); renderSwift();" class="text-slate-600 hover:text-red-400 cursor-pointer">✕</span></div>').join('') || '<span class="text-slate-500">// Tap command cards to insert</span>';
      }
      window.resetSwift = function() {
        playSound('click'); code=[]; renderSwift(); px=0; py=0; dir='E'; upPlayer();
        const g = document.getElementById('gem'); if(g) g.innerText = '💎';
        log('Goal: Get 👾 to the Gem 💎 & collect it!');
      };
      window.runSwift = async function() {
        if(!code.length) { playSound('error'); return; }
        px=0; py=0; dir='E'; upPlayer(); log('⚡ Compiling Swift challenge...');
        let collected = false;
        const g = document.getElementById('gem'); if(g) g.innerText = '💎';
        for(let c of code) {
          await new Promise(r => setTimeout(r, 500));
          if(c === 'moveForward()') {
            if(dir==='E') px=Math.min(3, px+1);
            else if(dir==='S') py=Math.min(3, py+1);
            else if(dir==='W') px=Math.max(0, px-1);
            else if(dir==='N') py=Math.max(0, py-1);
          } else if(c === 'turnLeft()') {
            dir = (dir==='E'?'N':dir==='N'?'W':dir==='W'?'S':'E');
          } else if(c === 'collectGem()') {
            if(px===3 && py===3) { collected = true; if(g) g.innerText='✨'; }
          }
          playSound('click'); upPlayer();
        }
        await new Promise(r => setTimeout(r, 300));
        if(px===3 && py===3 && collected) {
          playSound('success'); log('✨ Success! Swift sequence compiled & Gem Collected! +150 XP');
        } else {
          playSound('error'); log('❌ Missed the target or forgot collectGem()! Retry!');
        }
      };
    `;
  } else if (courseId === 'reception-khan') {
    content = `
      <div class="flex flex-col md:flex-row gap-3 h-full overflow-hidden">
        <div class="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
          <div>
            <h4 class="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>🎨 Creative Stamps</span>
              <button onclick="ctx.clearRect(0,0,can.width,can.height)" class="text-[9px] bg-slate-100 px-2 py-0.5 rounded">Clear Pad</button>
            </h4>
            <div class="flex gap-1.5 mb-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
              <button onclick="col='#ef4444'; stmp=null; playSound('click');" class="w-5 h-5 rounded-full bg-red-500"></button>
              <button onclick="col='#3b82f6'; stmp=null; playSound('click');" class="w-5 h-5 rounded-full bg-blue-500"></button>
              <button onclick="col='#10b981'; stmp=null; playSound('click');" class="w-5 h-5 rounded-full bg-emerald-500"></button>
              <button onclick="col='#eab308'; stmp=null; playSound('click');" class="w-5 h-5 rounded-full bg-yellow-500"></button>
              <button onclick="stmp='🦁'; playSound('click');" class="bg-white border border-slate-200 px-1 text-xs rounded">🦁</button>
              <button onclick="stmp='🐼'; playSound('click');" class="bg-white border border-slate-200 px-1 text-xs rounded">🐼</button>
              <button onclick="stmp='🦄'; playSound('click');" class="bg-white border border-slate-200 px-1 text-xs rounded">🦄</button>
            </div>
            <div class="bg-slate-50 border border-slate-200 rounded-lg relative overflow-hidden h-28 cursor-crosshair">
              <canvas id="canvas" class="absolute inset-0 w-full h-full"></canvas>
            </div>
          </div>
        </div>
        <div class="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
          <div class="bg-white border border-slate-200 rounded-lg p-2.5 text-center shadow-xs">
            <p class="text-[10px] font-bold text-slate-500">COUNT THE APPLES: 🍎</p>
            <div class="text-2xl py-1 select-none">🍎🍎🍎</div>
          </div>
          <div class="grid grid-cols-3 gap-2 mt-2">
            <button onclick="ans(1)" class="bg-white border border-slate-200 hover:bg-slate-50 py-3.5 rounded-lg font-black text-slate-800 text-xs shadow-xs">1</button>
            <button onclick="ans(3)" class="bg-white border border-slate-200 hover:bg-slate-50 py-3.5 rounded-lg font-black text-slate-800 text-xs shadow-xs">3</button>
            <button onclick="ans(5)" class="bg-white border border-slate-200 hover:bg-slate-50 py-3.5 rounded-lg font-black text-slate-800 text-xs shadow-xs">5</button>
          </div>
        </div>
      </div>
    `;
    initScript = `
      const can = document.getElementById('canvas');
      const ctx = can.getContext('2d');
      let col = '#ef4444', stmp = null, drawing = false;
      function fit() {
        can.width = can.parentElement.clientWidth;
        can.height = can.parentElement.clientHeight;
        ctx.lineCap = 'round'; ctx.lineWidth = 4;
      }
      fit(); setTimeout(fit, 300);
      can.onmousedown = (e) => {
        const r = can.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        if(stmp) {
          playSound('click'); ctx.font='24px serif'; ctx.fillText(stmp, x-12, y+8);
        } else {
          drawing = true; ctx.beginPath(); ctx.moveTo(x, y);
        }
      };
      can.onmousemove = (e) => {
        if(!drawing) return;
        const r = can.getBoundingClientRect();
        ctx.lineTo(e.clientX - r.left, e.clientY - r.top);
        ctx.strokeStyle = col; ctx.stroke();
      };
      can.onmouseup = () => drawing = false;
      can.onmouseleave = () => drawing = false;
      
      window.ans = function(n) {
        if(n === 3) {
          playSound('success'); log('🎉 Perfect count! Excellent logic! +80 XP');
        } else {
          playSound('error'); log('❌ Try again! Count the apples one by one.');
        }
      };
    `;
  } else if (courseId === 'reception-codemonkey') {
    content = `
      <div class="flex flex-col md:flex-row gap-3 h-full overflow-hidden">
        <div class="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
          <div>
            <h4 class="text-xs font-bold text-slate-700 mb-1.5">🐒 Scripting Area</h4>
            <div class="bg-slate-900 text-yellow-400 p-2 rounded-lg border border-slate-800 font-mono text-[10px] mb-2 min-h-[90px] overflow-y-auto" id="mon-lines">
              <span class="text-slate-500">// Script monkey walk distance</span>
            </div>
            <div class="grid grid-cols-2 gap-1">
              <button onclick="addM('monkey.walk(60)')" class="bg-white border border-slate-200 text-slate-700 font-mono p-1 rounded text-[9px]">walk(60)</button>
              <button onclick="addM('monkey.walk(120)')" class="bg-white border border-slate-200 text-slate-700 font-mono p-1 rounded text-[9px]">walk(120)</button>
              <button onclick="addM('monkey.turnLeft()')" class="bg-white border border-slate-200 text-slate-700 font-mono p-1 rounded text-[9px]">turnLeft()</button>
              <button onclick="addM('monkey.turnRight()')" class="bg-white border border-slate-200 text-slate-700 font-mono p-1 rounded text-[9px]">turnRight()</button>
            </div>
          </div>
          <div class="flex gap-1.5 mt-2">
            <button onclick="resetM()" class="bg-slate-200 text-slate-700 font-bold py-2 rounded-lg text-[10px]">Reset</button>
            <button onclick="runM()" class="flex-1 bg-yellow-500 text-slate-900 font-black py-2 rounded-lg text-[10px]">🍌 Feed Monkey</button>
          </div>
        </div>
        <div class="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-center min-h-[160px] relative">
          <div class="relative w-44 h-24 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center p-3 overflow-hidden shadow-inner">
            <div id="monkey" class="absolute text-3xl transition-all duration-300" style="left:10px;">🐒</div>
            <div id="banana" class="absolute text-2xl" style="left:125px;">🍌</div>
          </div>
        </div>
      </div>
    `;
    initScript = `
      let cmds = [];
      window.addM = function(c) {
        playSound('click'); cmds.push(c); renderM();
      };
      function renderM() {
        const b = document.getElementById('mon-lines');
        b.innerHTML = cmds.map((c,i) => '<div class="flex items-center justify-between"><span>' + c + '</span><span onclick="event.stopPropagation(); cmds.splice('+i+',1); renderM();" class="text-slate-500 cursor-pointer">✕</span></div>').join('') || '<span class="text-slate-500">// Script monkey walk distance</span>';
      }
      window.resetM = function() {
        playSound('click'); cmds=[]; renderM();
        const m = document.getElementById('monkey'); m.style.left = '10px'; m.style.transform = 'scaleX(1)';
        log('Goal: Guide the Monkey to the Banana (120 steps).');
      };
      window.runM = async function() {
        if(!cmds.length) { playSound('error'); return; }
        let pos = 10, scale = 1;
        const m = document.getElementById('monkey'); m.style.left = pos+'px';
        log('🐒 Executing monkey walk...');
        for(let c of cmds) {
          await new Promise(r => setTimeout(r, 500));
          if(c === 'monkey.walk(60)') pos += 60 * scale;
          else if(c === 'monkey.walk(120)') pos += 120 * scale;
          else if(c === 'monkey.turnLeft()') scale = -1;
          else if(c === 'monkey.turnRight()') scale = 1;
          pos = Math.max(10, Math.min(130, pos));
          playSound('click'); m.style.left = pos+'px'; m.style.transform = 'scaleX('+scale+')';
        }
        await new Promise(r => setTimeout(r, 300));
        if(pos >= 110) {
          playSound('success'); log('🎉 Yummy! Monkey ate the banana! +120 XP');
        } else {
          playSound('error'); log('❌ Monkey did not reach the banana. Adjust distance and retry!');
        }
      };
    `;
  } else if (courseId === 'reception-codemoji') {
    content = `
      <div class="flex flex-col md:flex-row gap-3 h-full overflow-hidden">
        <div class="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
          <div>
            <h4 class="text-xs font-bold text-slate-700 mb-1.5">🏷️ Codemoji Tags</h4>
            <div class="grid grid-cols-2 gap-1.5 mb-2">
              <button onclick="addE('h1')" class="bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2"><span class="text-lg">🏠</span> <span class="text-[10px] font-bold">Header</span></button>
              <button onclick="addE('p')" class="bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2"><span class="text-lg">📝</span> <span class="text-[10px] font-bold">Text</span></button>
              <button onclick="addE('div')" class="bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2"><span class="text-lg">🏷️</span> <span class="text-[10px] font-bold">Box</span></button>
              <button onclick="addE('art')" class="bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2"><span class="text-lg">🎨</span> <span class="text-[10px] font-bold">Theme</span></button>
            </div>
            <div id="html-lines" class="bg-slate-900 text-slate-300 p-2 rounded-lg font-mono text-[9px] h-20 overflow-y-auto space-y-0.5">
              <span class="text-slate-500">&lt;!-- Page tags output --&gt;</span>
            </div>
          </div>
          <button onclick="clearE()" class="w-full bg-slate-200 text-slate-700 font-bold py-2 rounded-lg text-[10px] mt-2">Reset Page</button>
        </div>
        <div class="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between overflow-hidden min-h-[160px]">
          <div id="live" class="flex-1 bg-slate-50 border border-slate-100 rounded-lg p-3 overflow-y-auto space-y-2 flex flex-col justify-center items-center">
            <p id="live-placeholder" class="text-slate-400 text-[10px] italic">Your live page is empty!</p>
          </div>
        </div>
      </div>
    `;
    initScript = `
      let blocks = [];
      const l = document.getElementById('live');
      const h = document.getElementById('html-lines');
      window.addE = function(t) {
        playSound('click'); blocks.push(t); renderE();
      };
      window.clearE = function() {
        playSound('click'); blocks = []; renderE();
      };
      function renderE() {
        l.innerHTML = ''; h.innerHTML = '';
        if(!blocks.length) {
          l.innerHTML = '<p class="text-slate-400 text-[10px] italic">Your live page is empty!</p>';
          h.innerHTML = '<span class="text-slate-500">&lt;!-- Page tags output --&gt;</span>';
          l.style.background = ''; return;
        }
        let theme = false;
        blocks.forEach(b => {
          const div = document.createElement('div');
          if(b === 'h1') {
            div.className = 'text-base font-black text-slate-900'; div.innerText = '🏠 Welcome Home';
            h.innerHTML += '<div>&lt;h1&gt;🏠 Welcome Home&lt;/h1&gt;</div>';
          } else if(b === 'p') {
            div.className = 'text-[10px] text-slate-500'; div.innerText = '📝 Playful emoji blocks are live!';
            h.innerHTML += '<div>&lt;p&gt;📝 Emoji blocks are live!&lt;/p&gt;</div>';
          } else if(b === 'div') {
            div.className = 'bg-indigo-600 text-white font-bold text-[9px] px-3 py-1 rounded-full'; div.innerText = '🏷️ Kids Coding Club';
            h.innerHTML += '<div>&lt;div class="club"&gt;🏷️ Kids Coding&lt;/div&gt;</div>';
          } else if(b === 'art') {
            theme = true;
            h.innerHTML += '<div>style.theme = "rainbow"</div>';
          }
          l.appendChild(div);
        });
        l.style.background = theme ? 'linear-gradient(to right, #fdf2f8, #ecfeff)' : '';
        playSound('success');
      }
    `;
  }

  return `
<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-slate-800 h-full p-2.5 flex flex-col justify-between overflow-hidden select-none">
  <div class="flex-1 overflow-hidden h-full">
    \${content}
  </div>
  <div id="status" class="mt-2 text-[10.5px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 p-2 rounded-lg text-center shadow-xs">
    Status: Sandbox Live and practice ready!
  </div>

  <script>
    function playSound(type) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        if (type === 'success') {
          osc.frequency.setValueAtTime(523.25, ctx.currentTime);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start(); osc.stop(ctx.currentTime + 0.45);
        } else if (type === 'click') {
          osc.frequency.setValueAtTime(600, ctx.currentTime);
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
          osc.start(); osc.stop(ctx.currentTime + 0.1);
        } else if (type === 'error') {
          osc.type = 'sawtooth'; osc.frequency.setValueAtTime(140, ctx.currentTime);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
          osc.start(); osc.stop(ctx.currentTime + 0.3);
        }
      } catch (e) {}
    }
    function log(m) {
      document.getElementById('status').innerText = m;
    }
    \${initScript}
  </script>
</body>
</html>
  `;
}



interface AcademyPageProps {
  onEnroll: (course: Course) => void;
  onSelectPlan?: (amount: number, planName: string) => void;
  currentUser: UserProfile | null;
  onUserChanged: (user: UserProfile | null) => void;
  onNavigate: (page: string) => void;
  onOpenFreeTrialModal?: (initialEmail?: string) => void;
  onOpenAuthModal?: () => void;
}

export default function AcademyPage({ onEnroll, onSelectPlan, currentUser, onUserChanged, onNavigate, onOpenFreeTrialModal, onOpenAuthModal }: AcademyPageProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [trialSuccess, setTrialSuccess] = useState(false);
  const [trialEmail, setTrialEmail] = useState('');

  // Selected role for pending sign-in/up
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [pendingAction, setPendingAction] = useState<{
    type: 'enroll' | 'launch_reception';
    course: any;
  } | null>(null);

  // Active Reception Iframe sandbox states
  const [activeIframeCourse, setActiveIframeCourse] = useState<any | null>(null);
  const [sandboxNotes, setSandboxNotes] = useState('');
  const [sandboxChecklist, setSandboxChecklist] = useState<string[]>([]);
  const [notesSuccess, setNotesSuccess] = useState(false);

  // Flagship Enrollment Flow States
  const [enrollingCourse, setEnrollingCourse] = useState<Course | null>(null);
  const [enrollMode, setEnrollMode] = useState<'Online' | 'Physical'>('Online');
  const [enrollTier, setEnrollTier] = useState<'Individual' | 'Group'>('Individual');
  const [enrollType, setEnrollType] = useState<'Trial' | 'Paid'>('Paid');
  const [physicalAddress, setPhysicalAddress] = useState('');
  const [enrollDate, setEnrollDate] = useState('2026-07-20');
  const [enrollTime, setEnrollTime] = useState('11:00 AM');
  const [syncCalendar, setSyncCalendar] = useState(true);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isSubmittingEnrollment, setIsSubmittingEnrollment] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reception course launching states (removes iframe modal)
  const [launchingReceptionCourse, setLaunchingReceptionCourse] = useState<any | null>(null);
  const [isSyncingReception, setIsSyncingReception] = useState(false);
  const [receptionSuccess, setReceptionSuccess] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Carousel states for Multi-Role Workspaces
  const [currentWsIndex, setCurrentWsIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  React.useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentWsIndex((prev) => (prev + 1) % workspacesList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Carousel states for flagship Tech Course spotlights
  const [currentTechIndex, setCurrentTechIndex] = useState(0);
  const [isTechAutoPlaying, setIsTechAutoPlaying] = useState(true);

  React.useEffect(() => {
    if (!isTechAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentTechIndex((prev) => (prev + 1) % techAdsList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isTechAutoPlaying]);

  // Carousel states for Onboarding Path
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isOnboardingAutoPlaying, setIsOnboardingAutoPlaying] = useState(true);

  React.useEffect(() => {
    if (!isOnboardingAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % onboardingSteps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOnboardingAutoPlaying]);

  // Interactive Project Demos States
  const [selectedDemoId, setSelectedDemoId] = useState<'weather' | 'ai-task' | 'indigenous' | 'ad-roi'>('weather');
  
  // 1. Weather Data Visualizer State
  const [weatherCity, setWeatherCity] = useState<'Lagos' | 'Abuja' | 'London' | 'Nairobi'>('Lagos');
  const [weatherUnit, setWeatherUnit] = useState<'C' | 'F'>('C');
  const [isRefreshingWeather, setIsRefreshingWeather] = useState(false);
  const [weatherRandomOffset, setWeatherRandomOffset] = useState(0);

  const handleRefreshWeather = () => {
    setIsRefreshingWeather(true);
    setTimeout(() => {
      setIsRefreshingWeather(false);
      setWeatherRandomOffset((Math.random() * 3) - 1.5);
    }, 600);
  };

  // 2. AI Task Estimator State
  const [taskTitle, setTaskTitle] = useState('Create database schema and migrations');
  const [taskComplexity, setTaskComplexity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [taskImpact, setTaskImpact] = useState<'Low' | 'Medium' | 'High'>('High');
  const [isTaskAnalyzing, setIsTaskAnalyzing] = useState(false);
  const [taskAnalysisLog, setTaskAnalysisLog] = useState<string[]>([]);
  const [taskResult, setTaskResult] = useState<{
    priority: string;
    xp: number;
    hours: number;
    reasoning: string;
  } | null>(null);

  const handleAnalyzeTask = () => {
    setIsTaskAnalyzing(true);
    setTaskResult(null);
    setTaskAnalysisLog(['[System] Initializing Gemini cognitive agent...']);
    
    setTimeout(() => {
      setTaskAnalysisLog(prev => [...prev, '[Parse] Input task title parsed & tokenized.']);
    }, 300);

    setTimeout(() => {
      setTaskAnalysisLog(prev => [...prev, `[Model] Parameters: Complexity=${taskComplexity}, Impact=${taskImpact}.`]);
    }, 600);

    setTimeout(() => {
      setTaskAnalysisLog(prev => [...prev, '[Weights] Querying cognitive developer bandwidth.']);
    }, 900);

    setTimeout(() => {
      let calcHours = 4;
      if (taskComplexity === 'Medium') calcHours = 12;
      if (taskComplexity === 'High') calcHours = 28;
      if (taskImpact === 'High') calcHours = Math.round(calcHours * 1.2);

      let calcXP = 150;
      if (taskComplexity === 'Medium') calcXP = 450;
      if (taskComplexity === 'High') calcXP = 1000;
      if (taskImpact === 'High') calcXP += 200;

      let calcPriority = 'P2';
      if (taskComplexity === 'High' && taskImpact === 'High') calcPriority = 'P1 (Critical)';
      else if (taskImpact === 'High') calcPriority = 'P1';
      else if (taskComplexity === 'Low' && taskImpact === 'Low') calcPriority = 'P3';

      const reasoningNotes = `This task is classified as a ${calcPriority} initiative. Based on the selected ${taskComplexity} complexity scale and ${taskImpact} commercial impact, a developer would typically commit ${calcHours} hours of deep build time. Completing this will yield +${calcXP} XP toward your next certification badge.`;

      setTaskResult({
        priority: calcPriority,
        xp: calcXP,
        hours: calcHours,
        reasoning: reasoningNotes
      });
      setTaskAnalysisLog(prev => [...prev, '[Success] Complete recommendation compiled!']);
      setIsTaskAnalyzing(false);
    }, 1200);
  };

  // 3. Indigenous Language Sandbox
  const [indigenousLang, setIndigenousLang] = useState<'Yoruba' | 'Igbo' | 'Hausa'>('Yoruba');
  const [pronounceWord, setPronounceWord] = useState<string | null>(null);
  const [indigenousQuizAnswer, setIndigenousQuizAnswer] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);

  // 4. Ad Campaign ROI Calculator
  const [roiBudget, setRoiBudget] = useState(250000); // ₦
  const [roiCPC, setRoiCPC] = useState(250); // ₦
  const [roiConvRate, setRoiConvRate] = useState(4.5); // %

  // Testimonials Carousel States
  const [selectedTestimonialCategory, setSelectedTestimonialCategory] = useState<'All' | 'Students' | 'Parents' | 'Teachers' | 'Schools' | 'Sponsors'>('All');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isTestimonialsAutoPlaying, setIsTestimonialsAutoPlaying] = useState(true);

  // Auto-slide effect for testimonials carousel
  useEffect(() => {
    if (!isTestimonialsAutoPlaying) return;

    const filtered = selectedTestimonialCategory === 'All'
      ? testimonialsList
      : testimonialsList.filter(t => t.category === selectedTestimonialCategory);
    
    const slideCount = Math.ceil(filtered.length / 2);
    if (slideCount <= 1) {
      setCurrentTestimonialIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % slideCount);
    }, 5000);

    return () => clearInterval(interval);
  }, [isTestimonialsAutoPlaying, selectedTestimonialCategory]);

  // Load PayPal script dynamically when enrollment modal is active
  useEffect(() => {
    if (enrollingCourse) {
      const scriptId = 'paypal-sdk-academy';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://www.paypal.com/sdk/js?client-id=sb&currency=USD';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [enrollingCourse]);

  const handleTestimonialCategoryChange = (category: 'All' | 'Students' | 'Parents' | 'Teachers' | 'Schools' | 'Sponsors') => {
    setSelectedTestimonialCategory(category);
    setCurrentTestimonialIndex(0);
  };

  const handleWorkspaceAccess = (role: UserRole) => {
    if (currentUser) {
      if (currentUser.role === role) {
        onNavigate('dashboard');
      } else {
        const updatedProfile = {
          ...currentUser,
          role: role,
          profileCompleted: true
        };
        onUserChanged(updatedProfile);
        onNavigate('dashboard');
      }
    } else {
      setPendingRole(role);
      setCustomName('');
      setCustomEmail('');
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingRole) return;

    const mockUid = `${pendingRole.toLowerCase()}-${Date.now()}`;
    const newProfile: UserProfile = {
      uid: mockUid,
      email: customEmail || `${pendingRole.toLowerCase()}@sac.com`,
      displayName: customName || `${pendingRole} Member`,
      role: pendingRole,
      profileCompleted: true
    };

    onUserChanged(newProfile);
    setPendingRole(null);
    resumePendingAction(newProfile);
  };

  const getCourseDurationDetails = (courseId: string) => {
    switch (courseId) {
      case 'course-1': // Advanced AI
        return { days: 3, hoursPerDay: 3 };
      case 'course-2': // Digital Marketing
        return { days: 2, hoursPerDay: 3 };
      case 'course-3': // React & Vite
        return { days: 3, hoursPerDay: 4 };
      case 'course-kidztech-scratch': // Scratch
        return { days: 2, hoursPerDay: 2 };
      default:
        return { days: 2, hoursPerDay: 3 };
    }
  };

  const handleTriggerEnrollment = (course: Course) => {
    setEnrollingCourse(course);
    setEnrollmentSuccess(false);
    setIsSubmittingEnrollment(false);
    setEnrollMode('Online');
    setEnrollType('Paid');
    setPhysicalAddress('');
    setEnrollDate('2026-07-20');
    setEnrollTime('11:00 AM');
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
  };

  const handleSubmitEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Please sign in or use Google sign-in below to proceed.");
      return;
    }
    if (!enrollingCourse) return;

    if (enrollMode === 'Physical' && !physicalAddress.trim()) {
      showToast("Please enter your physical class address to continue.");
      return;
    }

    setIsSubmittingEnrollment(true);

    const finalPrice = enrollMode === 'Online'
      ? (enrollTier === 'Individual' ? 9000 : 30000)
      : (enrollTier === 'Individual' ? 30000 : 60000);

    const completeEnrollmentLocally = async () => {
      try {
        const durationInfo = getCourseDurationDetails(enrollingCourse.id);
        await enrollInCourse(
          currentUser.uid,
          currentUser.email,
          enrollingCourse.id,
          enrollingCourse.title,
          enrollMode,
          finalPrice,
          enrollDate,
          enrollTime,
          durationInfo.days,
          durationInfo.hoursPerDay,
          'Paid',
          enrollMode === 'Physical' ? physicalAddress : undefined
        );

        // Dashboard synchronization notification
        await sendNotification(
          currentUser.uid,
          `Tuition Payment Confirmed: You have successfully enrolled in "${enrollingCourse.title}" (${enrollMode} mode).`
        );

        if (enrollMode === 'Physical' && physicalAddress.trim()) {
          await sendNotification(
            currentUser.uid,
            `Physical Address Registered: Lectures will be customized for your address: ${physicalAddress}.`
          );
        }

        setEnrollmentSuccess(true);
        setIsSubmittingEnrollment(false);
        showToast(`Successfully enrolled in ${enrollingCourse.title}! Synchronized with your dashboard.`);
      } catch (err) {
        console.error("Enrollment failed:", err);
        showToast("Error during enrollment database sync.");
        setIsSubmittingEnrollment(false);
      }
    };

    try {
      console.log(`Processing PayPal enrollment for merchant pulzitive@gmail.com by ${currentUser.email}, Amount: ₦${finalPrice}`);
      setTimeout(() => {
        completeEnrollmentLocally();
      }, 1500);
    } catch (err: any) {
      console.warn("PayPal gateway initialization error, completing enrollment locally:", err);
      setTimeout(() => {
        completeEnrollmentLocally();
      }, 1500);
    }
  };

  const handleLaunchReception = (course: any, userProfile?: UserProfile) => {
    const activeUser = userProfile || currentUser;
    if (!activeUser) {
      setPendingAction({ type: 'launch_reception', course });
      setPendingRole('Student');
      showToast("Please authenticate first to sync your sandbox progress with the dashboard!");
      return;
    }
    setLaunchingReceptionCourse(course);
    setReceptionSuccess(false);
    setIsSyncingReception(false);
  };

  const resumePendingAction = (profile: UserProfile) => {
    if (pendingAction) {
      if (pendingAction.type === 'enroll') {
        handleTriggerEnrollment(pendingAction.course);
        showToast(`Authenticated successfully! Resuming your enrollment for ${pendingAction.course.title}.`);
      } else if (pendingAction.type === 'launch_reception') {
        handleLaunchReception(pendingAction.course, profile);
        showToast(`Authenticated successfully! Launching ${pendingAction.course.title} sandbox.`);
      }
      setPendingAction(null);
    } else {
      onNavigate('dashboard');
    }
  };

  const handleConfirmReceptionLaunch = async () => {
    if (!currentUser || !launchingReceptionCourse) return;

    setIsSyncingReception(true);

    // Open the window synchronously in the user click call stack to bypass browser popup-blocker
    let newWindow: Window | null = null;
    try {
      newWindow = window.open(launchingReceptionCourse.url, '_blank');
    } catch (e) {
      console.warn("Popup blocked synchronously:", e);
    }

    try {
      await enrollInCourse(
        currentUser.uid,
        currentUser.email,
        launchingReceptionCourse.id,
        launchingReceptionCourse.title,
        'Online',
        0, // Free!
        'Instant Access',
        'Self-Paced Sandbox',
        1, // 1 day
        2, // 2 hours/day
        'Paid'
      );

      // Fallback try in case the synchronous window.open didn't register or returned null
      if (!newWindow) {
        try {
          newWindow = window.open(launchingReceptionCourse.url, '_blank');
        } catch (e) {
          console.error("Delayed attempt failed:", e);
        }
      }

      setReceptionSuccess(true);
      setIsSyncingReception(false);
      showToast(`Synchronized ${launchingReceptionCourse.title} with your Pulzitive Dashboard! Opened launch portal.`);
    } catch (err) {
      console.error("Sandbox sync failed:", err);
      showToast("Error synchronizing sandbox with profile.");
      setIsSyncingReception(false);
    }
  };

  // Courses Search and Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Webinars'>('All');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const courses = getCourses();
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handleStartTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trialEmail.trim()) {
      onOpenFreeTrialModal?.(trialEmail);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-16">
      
      {/* Brand Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 py-3 text-center text-white text-xs font-semibold px-4 flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse animate-duration-1000" />
        <span>Now introducing the Executive Digital Marketing Program & Performance Campaigns Certification!</span>
        <span className="bg-yellow-400 text-slate-950 px-2 py-0.5 rounded text-[10px] uppercase font-black">NEW</span>
      </div>

      {/* Main Container */}
      <div className="w-full space-y-0 mt-0">
        
        {/* Hero Section */}
        <section id="academy-hero" className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
            
            {/* Floating Background Icons */}
            <div className="absolute top-1/4 left-[8%] opacity-[0.07] animate-bounce" style={{ animationDuration: '6s' }}>
              <GraduationCap className="w-16 h-16 text-emerald-600" />
            </div>
            <div className="absolute bottom-1/4 right-[8%] opacity-[0.07] animate-pulse" style={{ animationDuration: '4s' }}>
              <BookOpen className="w-20 h-20 text-indigo-600" />
            </div>
            <div className="absolute top-1/3 right-[15%] opacity-[0.06] animate-bounce" style={{ animationDuration: '8s' }}>
              <Award className="w-14 h-14 text-pink-600" />
            </div>
            <div className="absolute bottom-1/3 left-[15%] opacity-[0.06] animate-pulse" style={{ animationDuration: '5s' }}>
              <Sparkles className="w-12 h-12 text-teal-600" />
            </div>
            <div className="absolute top-1/2 left-[5%] opacity-[0.05] animate-pulse" style={{ animationDuration: '7s' }}>
              <Laptop className="w-14 h-14 text-indigo-600" />
            </div>
            <div className="absolute bottom-1/2 right-[6%] opacity-[0.05] animate-bounce" style={{ animationDuration: '9s' }}>
              <Code className="w-14 h-14 text-emerald-600" />
            </div>
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
            
            <AnimatedHeroTitle 
              primaryText="Unlock Your Tech & Digital Marketing"
              highlightText="Career Potential."
              className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto text-slate-900"
            />

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Training professionals, marketers, and business owners on certified Tech & Digital Marketing paths.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <button 
                onClick={() => onNavigate('community')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl cursor-pointer text-xs transition-all flex items-center gap-2 shadow-md hover:scale-[1.01]"
              >
                Join Webinar <ChevronRight className="w-4 h-4" />
              </button>
              <a 
                href="#courses" 
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold px-6 py-3 rounded-xl cursor-pointer text-xs transition-all flex items-center gap-2 hover:scale-[1.01]"
              >
                View Courses <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* ONBOARDING PATH */}
        <section id="onboarding-journey" className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
                Launch Your Career Journey in 4 Simple Steps
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Embark on an exciting learning path with Pulzitive Digital Academy. It's quick, easy, and highly rewarding to begin.
              </p>
            </div>

            {/* Controllable Auto-Slide Onboarding Carousel with Small Cards */}
            <div className="relative max-w-2xl mx-auto">
              
              {/* Main Sliding Component */}
              <div 
                className="relative bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md group overflow-hidden"
                onMouseEnter={() => setIsOnboardingAutoPlaying(false)}
                onMouseLeave={() => setIsOnboardingAutoPlaying(true)}
              >
                {/* Active Indicator Highlight Border */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${onboardingSteps[currentStepIndex].color}`} />

                {/* Left/Right Controls overlay */}
                <button
                  onClick={() => {
                    setCurrentStepIndex((prev) => (prev - 1 + onboardingSteps.length) % onboardingSteps.length);
                    setIsOnboardingAutoPlaying(false);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 p-2.5 rounded-full border border-slate-200 transition-all cursor-pointer z-10 opacity-0 group-hover:opacity-100"
                  aria-label="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentStepIndex((prev) => (prev + 1) % onboardingSteps.length);
                    setIsOnboardingAutoPlaying(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 p-2.5 rounded-full border border-slate-200 transition-all cursor-pointer z-10 opacity-0 group-hover:opacity-100"
                  aria-label="Next Step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Animated Step Slide */}
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col sm:flex-row items-center gap-5 text-left"
                >
                  {/* Left part: Large step number and matching icon */}
                  <div className={`p-5 rounded-2xl bg-slate-50 border ${onboardingSteps[currentStepIndex].borderColor} shrink-0`}>
                    {React.createElement(onboardingSteps[currentStepIndex].icon, { 
                      className: `w-9 h-9 ${onboardingSteps[currentStepIndex].textColor}` 
                    })}
                  </div>

                  {/* Right part: Title, description, and visual progress indicators */}
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-white ${onboardingSteps[currentStepIndex].textColor} px-2.5 py-1 rounded-full border border-slate-200 shadow-sm`}>
                        {React.createElement(onboardingSteps[currentStepIndex].icon, { className: "w-3.5 h-3.5" })}
                        <span>{onboardingSteps[currentStepIndex].title}</span>
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {onboardingSteps[currentStepIndex].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {onboardingSteps[currentStepIndex].desc}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Slider Controls Bar (Dots + Play/Pause) */}
              <div className="flex items-center justify-between mt-4 px-2">
                {/* Auto Play status info */}
                <span className="text-[10px] text-slate-400 font-medium font-mono flex items-center gap-1">
                  {isOnboardingAutoPlaying ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active (Hover to pause)
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Paused
                    </>
                  )}
                </span>

                {/* Indicators / Dot navigation */}
                <div className="flex items-center gap-1.5">
                  {onboardingSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentStepIndex(index);
                        setIsOnboardingAutoPlaying(false);
                      }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentStepIndex === index 
                          ? 'w-5 bg-slate-800' 
                          : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to step ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Play / Pause Toggle Button */}
                <button
                  onClick={() => setIsOnboardingAutoPlaying(!isOnboardingAutoPlaying)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer transition-all"
                  aria-label={isOnboardingAutoPlaying ? "Pause autoplay" : "Start autoplay"}
                >
                  {isOnboardingAutoPlaying ? (
                    <>
                      <Pause className="w-3 h-3 text-slate-600" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-slate-600 fill-slate-600" />
                      <span>Play</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* DYNAMIC TECH COURSE SPOTLIGHT AD */}
        <section id="academy-features" className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
                Flagship Digital Marketing Spotlights
              </h2>
              <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                Explore our high-impact performance marketing curricula engineered to build production-ready growth skills, accelerate professional careers, and master advanced search, paid social, and CRM workflows.
              </p>
            </div>

            {/* Controllable Auto-Slide Tech Ads Carousel */}
            <div className="relative max-w-4xl mx-auto">
              
              {/* Carousel Tab bar (quick select) */}
              <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200">
                {techAdsList.map((ad, index) => {
                  const Icon = ad.icon;
                  const isActive = currentTechIndex === index;
                  return (
                    <button
                      key={ad.courseId}
                      onClick={() => {
                        setCurrentTechIndex(index);
                        setIsTechAutoPlaying(false); // Pause auto-play when user manually overrides
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50 font-black' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{ad.badge}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Sliding Component */}
              <div 
                className="relative bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg group overflow-hidden"
                onMouseEnter={() => setIsTechAutoPlaying(false)}
                onMouseLeave={() => setIsTechAutoPlaying(true)}
              >
                {/* Active Indicator Highlight Border */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

                {/* Left/Right Controls overlay */}
                <button
                  onClick={() => {
                    setCurrentTechIndex((prev) => (prev - 1 + techAdsList.length) % techAdsList.length);
                    setIsTechAutoPlaying(false);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 p-2.5 rounded-full border border-slate-200 transition-all cursor-pointer z-10 opacity-0 group-hover:opacity-100 animate-fade-in"
                  aria-label="Previous Ad"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setCurrentTechIndex((prev) => (prev + 1) % techAdsList.length);
                    setIsTechAutoPlaying(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 p-2.5 rounded-full border border-slate-200 transition-all cursor-pointer z-10 opacity-0 group-hover:opacity-100 animate-fade-in"
                  aria-label="Next Ad"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Animated Tech Ad Slide */}
                <motion.div
                  key={currentTechIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
                >
                  {/* Left Column: Tech Program Details */}
                  <div className="md:col-span-7 space-y-5 text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner border border-indigo-100">
                        {React.createElement(techAdsList[currentTechIndex].icon, { className: "w-7 h-7" })}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full border border-indigo-150">
                          {techAdsList[currentTechIndex].badge}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 leading-tight">
                          {techAdsList[currentTechIndex].title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {techAdsList[currentTechIndex].desc}
                    </p>

                    <div className="space-y-2.5">
                      <p className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-indigo-600">
                        Core Learning Highlights
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {techAdsList[currentTechIndex].features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                            <span className="p-0.5 rounded bg-emerald-100 text-emerald-700 shrink-0">
                              <Check className="w-3 h-3" />
                            </span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Promotional Telemetry & Call to Action */}
                  <div className="md:col-span-5 bg-slate-50 border border-slate-200 p-6 rounded-3xl flex flex-col justify-between h-full min-h-[240px]">
                    <div className="space-y-4 text-left">
                      <p className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-400">
                        Course Summary
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-xl border border-slate-150 shadow-sm">
                          <span className="block text-[8px] font-mono text-slate-400 uppercase">Duration</span>
                          <span className="text-xs font-black text-slate-800">{techAdsList[currentTechIndex].stats.duration}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-150 shadow-sm">
                          <span className="block text-[8px] font-mono text-slate-400 uppercase">Level</span>
                          <span className="text-xs font-black text-slate-800">{techAdsList[currentTechIndex].stats.level}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-150 shadow-sm">
                          <span className="block text-[8px] font-mono text-slate-400 uppercase">Gamified XP</span>
                          <span className="text-xs font-black text-emerald-600">{techAdsList[currentTechIndex].stats.xp}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-150 shadow-sm flex flex-col justify-center">
                          <span className="block text-[8px] font-mono text-slate-400 uppercase">Status</span>
                          <span className="text-[9px] font-bold text-indigo-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                            HOT CLASS
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => {
                          const targetCourse = courses.find(c => c.id === techAdsList[currentTechIndex].courseId);
                          if (targetCourse) {
                            handleTriggerEnrollment(targetCourse);
                          }
                        }}
                        className="w-full py-3 rounded-xl text-xs font-black cursor-pointer transition-all shadow-md bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        <span>{techAdsList[currentTechIndex].btnLabel}</span>
                        <ArrowRight className="w-4 h-4 text-emerald-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Slider Controls Bar (Dots + Play/Pause) */}
              <div className="flex items-center justify-between mt-6 px-4">
                {/* Auto Play status info */}
                <span className="text-[10px] text-slate-400 font-medium font-mono flex items-center gap-1">
                  {isTechAutoPlaying ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Promo active (Hover to pause)
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Paused
                    </>
                  )}
                </span>

                {/* Indicators / Dot navigation */}
                <div className="flex items-center gap-2">
                  {techAdsList.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentTechIndex(index);
                        setIsTechAutoPlaying(false);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentTechIndex === index 
                          ? 'w-6 bg-slate-800' 
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to promo ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Play / Pause Toggle Button */}
                <button
                  onClick={() => setIsTechAutoPlaying(!isTechAutoPlaying)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer transition-all"
                  aria-label={isTechAutoPlaying ? "Pause autoplay" : "Start autoplay"}
                >
                  {isTechAutoPlaying ? (
                    <>
                      <Pause className="w-3 h-3 text-slate-600" />
                      <span className="hidden sm:inline">Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-slate-600 fill-slate-600" />
                      <span className="hidden sm:inline">Play</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* COURSES DIRECTORY */}
        <section id="courses" className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
                Explore Our Dynamic Course Catalog
              </h2>
              <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                Dive into our curated selection of industry-standard courses designed to master advanced search optimization, paid social campaign management, CRM automation, and high-impact copywriting. Enroll today to start earning gamified XP.
              </p>
            </div>

            {/* Interactive Search & Filter Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Input */}
              <div className="relative w-full md:max-w-sm flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {(['All', 'Beginner', 'Intermediate', 'Advanced', 'Webinars'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      selectedLevel === lvl 
                        ? 'bg-emerald-500 text-white shadow-sm' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl === 'Webinars' ? 'Upcoming Webinars' : lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses Dynamic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedLevel === 'Webinars' ? (
                <div className="col-span-full bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 border border-indigo-800 text-center space-y-6 max-w-2xl mx-auto shadow-xl">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-bold">
                    🔥 Free Masterclasses
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black">Upcoming Free Webinars</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      All of our webinars are 100% free to incentivize enrollment in our premium, high-density live 4-hour courses. Join live specialist sessions and level up.
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => onNavigate('community')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <span>Go to Webinars (Community Page)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-500 bg-slate-50 border border-slate-200 rounded-2xl">
                  No courses found matching your query.
                </div>
              ) : (
                filteredCourses.map(course => {
                  const isExpanded = expandedCourseId === course.id;
                  return (
                    <div 
                      key={course.id} 
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border border-emerald-100">
                            {course.level === 'Reception' ? 'Reception - Free' : course.level}
                          </span>
                          <span className="text-slate-500 text-[10px] flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> {course.duration}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">{course.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{course.description}</p>

                        {/* Syllabus Accordion section */}
                        <div className="border-t border-slate-100 pt-3">
                          <button
                            onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                            className="w-full text-left text-[11px] font-bold text-indigo-600 hover:text-indigo-500 flex items-center justify-between cursor-pointer"
                          >
                            <span>Syllabus Breakdown</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {isExpanded && (
                            <ul className="mt-2.5 pl-4 list-disc text-[10px] text-slate-500 space-y-1.5 leading-relaxed">
                              {course.syllabus.map((s, idx) => (
                                <li key={idx}>{s}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                        <div>
                          <span className="block text-[8px] font-mono uppercase text-slate-400">Access Tier</span>
                          {course.level === 'Reception' ? (
                            <span className="text-xs font-black text-emerald-600 font-mono bg-emerald-50 border border-emerald-150 px-2.5 py-0.5 rounded-full uppercase tracking-wide inline-block mt-0.5">
                              FREE COHORT
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-150 px-2.5 py-0.5 rounded-full uppercase tracking-wide font-mono inline-block mt-0.5">
                              PREMIUM
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            if (course.level === 'Reception') {
                              if (currentUser) {
                                handleLaunchReception(course);
                              } else {
                                handleTriggerEnrollment(course);
                              }
                            } else {
                              handleTriggerEnrollment(course);
                            }
                          }}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          {course.level === 'Reception' ? (
                            <>
                              <Play className="w-3.5 h-3.5 fill-white text-transparent" /> Launch Sandbox
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-3.5 h-3.5" /> Enroll Now
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>







        {/* REMOVED_PROJECTS_HOLDER_SECTION */}
        <div className="hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Project Tabs / Selectors */}
              <div className="lg:col-span-4 space-y-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Select a Portfolio Project Demo</p>
                
                {[
                  {
                    id: 'weather' as const,
                    title: 'Weather Data Visualizer',
                    subtitle: 'Data Science & APIs',
                    badge: 'HOT CLASS',
                    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
                    icon: CloudSun
                  },
                  {
                    id: 'ai-task' as const,
                    title: 'AI Task Prioritizer & Estimator',
                    subtitle: 'Cognitive Computing',
                    badge: 'NEW',
                    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                    icon: Brain
                  },
                  {
                    id: 'indigenous' as const,
                    title: 'Yoruba/Igbo/Hausa Sandbox',
                    subtitle: 'STEAM & Cultural Arts',
                    badge: 'CREATIVE',
                    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                    icon: Globe2
                  },
                  {
                    id: 'ad-roi' as const,
                    title: 'Ad ROI & Funnel Calculator',
                    subtitle: 'Growth Ads & Business',
                    badge: 'PRACTICAL',
                    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
                    icon: TrendingUp
                  }
                ].map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = selectedDemoId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedDemoId(item.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 relative overflow-hidden ${
                        isSelected 
                          ? 'bg-white border-slate-900 shadow-md ring-2 ring-slate-900/5' 
                          : 'bg-white/60 border-slate-200 hover:border-slate-350 hover:bg-white'
                      }`}
                    >
                      {/* Selection accent bar */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-900" />
                      )}

                      <div className={`p-2 rounded-xl border shrink-0 ${
                        isSelected ? 'bg-slate-900 text-white border-slate-950' : 'bg-slate-100 text-slate-600 border-slate-150'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-slate-900 tracking-tight">{item.title}</span>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">{item.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Live Demo Canvas Container */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md relative min-h-[460px] flex flex-col justify-between">
                
                {/* Header of Active Demo */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                      Live Dynamic Sandbox Code Sandbox
                    </span>
                  </div>
                  <span className="text-[9px] font-mono bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded font-bold uppercase">
                    Compiled: Ready
                  </span>
                </div>

                {/* Main Interactive Demo Area */}
                <div className="flex-grow">
                  
                  {/* DEMO 1: WEATHER DATA VISUALIZER */}
                  {selectedDemoId === 'weather' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-950">
                          Weather Data Visualizer Dashboard
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          This student-built dashboard models real-time data fetching from custom weather APIs, parsing live telemetry coordinates, and rendering precise metric trackers.
                        </p>
                      </div>

                      {/* Controls Row */}
                      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500">Target City:</span>
                          {(['Lagos', 'Abuja', 'London', 'Nairobi'] as const).map((city) => (
                            <button
                              key={city}
                              onClick={() => {
                                setWeatherCity(city);
                                handleRefreshWeather();
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                                weatherCity === city
                                  ? 'bg-slate-900 text-white shadow-sm'
                                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {city}
                            </button>
                          ))}
                        </div>

                        {/* Units and Refresh triggers */}
                        <div className="flex items-center gap-3">
                          <div className="flex border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-white">
                            <button
                              onClick={() => setWeatherUnit('C')}
                              className={`px-2.5 py-1 text-[10px] font-bold ${
                                weatherUnit === 'C' ? 'bg-slate-200 text-slate-950' : 'text-slate-500'
                              }`}
                            >
                              °C
                            </button>
                            <button
                              onClick={() => setWeatherUnit('F')}
                              className={`px-2.5 py-1 text-[10px] font-bold ${
                                weatherUnit === 'F' ? 'bg-slate-200 text-slate-950' : 'text-slate-500'
                              }`}
                            >
                              °F
                            </button>
                          </div>

                          <button
                            onClick={handleRefreshWeather}
                            disabled={isRefreshingWeather}
                            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 cursor-pointer shadow-sm disabled:opacity-50 transition-all"
                            title="Force Refresh API Sync"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingWeather ? 'animate-spin text-emerald-600' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Display Data Board */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        
                        {/* Temperature Card */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left relative overflow-hidden">
                          <span className="text-[8px] font-bold font-mono uppercase tracking-wide text-slate-400">Temperature</span>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-3xl font-black text-slate-950">
                              {(weatherUnit === 'C'
                                ? (weatherCityData[weatherCity].temp + weatherRandomOffset)
                                : ((weatherCityData[weatherCity].temp + weatherRandomOffset) * 1.8 + 32)
                              ).toFixed(1)}
                              °{weatherUnit}
                            </span>
                          </div>
                          <p className="text-[10px] font-semibold text-emerald-600 mt-1">
                            {weatherCityData[weatherCity].cond}
                          </p>
                        </div>

                        {/* Humidity Card */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-1.5">
                          <span className="text-[8px] font-bold font-mono uppercase tracking-wide text-slate-400">Humidity</span>
                          <p className="text-2xl font-black text-slate-950">{weatherCityData[weatherCity].humidity}%</p>
                          {/* Simulated bar */}
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                              style={{ width: `${weatherCityData[weatherCity].humidity}%` }}
                            />
                          </div>
                        </div>

                        {/* Wind Speed Card */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left">
                          <span className="text-[8px] font-bold font-mono uppercase tracking-wide text-slate-400">Wind Velocity</span>
                          <p className="text-2xl font-black text-slate-950 mt-1">
                            {weatherCityData[weatherCity].wind.toFixed(1)} <span className="text-xs font-normal text-slate-500">km/h</span>
                          </p>
                          <span className="text-[8px] font-bold font-mono text-slate-500 uppercase tracking-widest block mt-1.5">
                            API: CONNECTED
                          </span>
                        </div>

                      </div>

                      {/* Mock JSON Stream */}
                      <div className="bg-slate-950 text-emerald-400 p-3.5 rounded-2xl border border-slate-800 font-mono text-[9px] space-y-1 text-left relative overflow-hidden shadow-inner">
                        <div className="flex items-center justify-between text-[8px] text-slate-500 border-b border-slate-900 pb-1.5 mb-1.5">
                          <span>STREAMED JSON DATA RESPONSE</span>
                          <span className="text-emerald-500 animate-pulse">● FEED ONLINE</span>
                        </div>
                        <p>{`{`}</p>
                        <p className="pl-4">{`"city": "${weatherCity}",`}</p>
                        <p className="pl-4">{`"temp_c": ${(weatherCityData[weatherCity].temp + weatherRandomOffset).toFixed(2)},`}</p>
                        <p className="pl-4">{`"humidity_pct": ${weatherCityData[weatherCity].humidity},`}</p>
                        <p className="pl-4">{`"status": "success",`}</p>
                        <p className="pl-4">{`"source": "PulzitiveSolarTelemetryStation"`}</p>
                        <p>{`}`}</p>
                      </div>

                    </div>
                  )}

                  {/* DEMO 2: AI TASK PRIORITIZER & ESTIMATOR */}
                  {selectedDemoId === 'ai-task' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-950">
                          AI Task Prioritizer & Estimator
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Interact with our dynamic prompt pipeline engine. Type any development initiative to compute optimal hours, assigned priority ranks, and gamified XP rewards.
                        </p>
                      </div>

                      {/* Input controls */}
                      <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-500 uppercase">Interactive Task Title</label>
                          <input 
                            type="text" 
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className="w-full text-xs font-bold text-slate-900 border border-slate-250 bg-white px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                            placeholder="e.g. Build Google Maps Platform store locator integration"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold text-slate-500 uppercase">Difficulty / Complexity</label>
                            <div className="flex gap-1 bg-white border border-slate-200 p-1 rounded-xl">
                              {(['Low', 'Medium', 'High'] as const).map((comp) => (
                                <button
                                  key={comp}
                                  type="button"
                                  onClick={() => setTaskComplexity(comp)}
                                  className={`flex-1 py-1 rounded-lg text-[9px] font-black transition-all cursor-pointer ${
                                    taskComplexity === comp
                                      ? 'bg-purple-600 text-white shadow-sm'
                                      : 'text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {comp}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold text-slate-500 uppercase">Commercial Impact</label>
                            <div className="flex gap-1 bg-white border border-slate-200 p-1 rounded-xl">
                              {(['Low', 'Medium', 'High'] as const).map((imp) => (
                                <button
                                  key={imp}
                                  type="button"
                                  onClick={() => setTaskImpact(imp)}
                                  className={`flex-1 py-1 rounded-lg text-[9px] font-black transition-all cursor-pointer ${
                                    taskImpact === imp
                                      ? 'bg-indigo-600 text-white shadow-sm'
                                      : 'text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {imp}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleAnalyzeTask}
                          disabled={isTaskAnalyzing || !taskTitle.trim()}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-50 transition-all active:scale-[0.99]"
                        >
                          <Brain className="w-3.5 h-3.5 text-purple-400" />
                          <span>Estimate & Run AI Agent Analyze</span>
                        </button>
                      </div>

                      {/* Simulated Logs & output panel */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Terminal Log */}
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 font-mono text-[9px] text-left text-indigo-400 space-y-1 min-h-[140px] flex flex-col justify-between">
                          <div>
                            <p className="text-[8px] text-slate-500 uppercase border-b border-slate-900 pb-1.5 mb-1.5 font-bold">
                              Gemini Agent Real-Time Run Log
                            </p>
                            {taskAnalysisLog.length === 0 ? (
                              <p className="text-slate-600 italic">Waiting for live pipeline triggers...</p>
                            ) : (
                              <div className="space-y-1">
                                {taskAnalysisLog.map((logLine, logIdx) => (
                                  <p key={logIdx} className={logLine.includes('[Success]') ? 'text-emerald-400' : ''}>
                                    {logLine}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                          {isTaskAnalyzing && (
                            <span className="text-[8px] font-black text-purple-400 animate-pulse mt-2">● PROCESSING COGNITIVE MATRIX...</span>
                          )}
                        </div>

                        {/* Analysis Result */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left flex flex-col justify-between min-h-[140px]">
                          <div>
                            <span className="text-[8px] font-bold font-mono uppercase tracking-wide text-slate-400 block">AI Agent Recommendation</span>
                            {taskResult ? (
                              <div className="space-y-2 mt-1.5">
                                <div className="flex gap-2 items-center flex-wrap">
                                  <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-black">
                                    {taskResult.priority} Priority
                                  </span>
                                  <span className="text-xs bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-black">
                                    +{taskResult.xp} XP Points
                                  </span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-700 leading-tight">
                                  Estimated Dev commitment: <span className="text-slate-900 text-xs font-black">{taskResult.hours} deep hours</span>
                                </p>
                                <p className="text-[9px] text-slate-500 leading-relaxed font-semibold">
                                  {taskResult.reasoning}
                                </p>
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <Sparkles className="w-6 h-6 text-slate-300 mx-auto mb-2 animate-bounce" />
                                <p className="text-[10px] text-slate-400 font-bold">Trigger estimation to compile recommendations.</p>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* DEMO 3: INDIGENOUS LANGUAGES & ARTS SANDBOX */}
                  {selectedDemoId === 'indigenous' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-black text-slate-950">
                            Yoruba, Igbo & Hausa STEAM Integration
                          </h3>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          We merge technical skills with cultural heritage. Explore translation cards and challenge your understanding with instant feedback loops that earn you practice XP!
                        </p>
                      </div>

                      {/* Language Selection bar */}
                      <div className="flex gap-1.5 bg-slate-50 p-1.5 border border-slate-200 rounded-2xl">
                        {(['Yoruba', 'Igbo', 'Hausa'] as const).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => {
                              setIndigenousLang(lang);
                              setPronounceWord(null);
                              setIndigenousQuizAnswer(null);
                              setSelectedQuizOption(null);
                            }}
                            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              indigenousLang === lang
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            {lang} Curricula
                          </button>
                        ))}
                      </div>

                      {/* Visual word cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {languagePhrases[indigenousLang].map((phrase, idx) => (
                          <div 
                            key={idx}
                            className="bg-white border border-slate-200 hover:border-emerald-500/40 rounded-xl p-3 text-left space-y-1.5 relative group hover:shadow transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-bold font-mono text-slate-400">Word {idx + 1}</span>
                              <button
                                onClick={() => {
                                  setPronounceWord(phrase.pron);
                                  // Simulated Audio wave trigger
                                  setTimeout(() => setPronounceWord(null), 1800);
                                }}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors"
                                title="Hear Pronunciation Code"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <h4 className="text-xs font-black text-slate-900">{phrase.english}</h4>
                            <p className="text-sm font-black text-emerald-600">{phrase.native}</p>
                            <p className="text-[9px] text-slate-500 leading-tight italic font-medium">{phrase.meaning}</p>
                          </div>
                        ))}
                      </div>

                      {/* Speech audio active feedback */}
                      {pronounceWord && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-left flex items-center justify-between text-[10px] text-emerald-800 font-bold animate-pulse">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            Audio Pronunciation: <span className="font-mono text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded">"{pronounceWord}"</span>
                          </span>
                          <span className="text-[8px] font-mono text-emerald-600">AUDIO SIGNAL: STREAMING</span>
                        </div>
                      )}

                      {/* Real Interactive quiz challenges */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-black uppercase">
                            DIASPORA CHALLENGE
                          </span>
                          <span className="text-[9px] font-bold text-slate-500">Solve & earn +50 XP Welcome Points</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900">
                          {languageQuiz[indigenousLang].question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {languageQuiz[indigenousLang].options.map((option) => {
                            const isSelected = selectedQuizOption === option;
                            const isCorrect = option === languageQuiz[indigenousLang].correct;
                            return (
                              <button
                                key={option}
                                onClick={() => {
                                  setSelectedQuizOption(option);
                                  if (isCorrect) {
                                    setIndigenousQuizAnswer('correct');
                                  } else {
                                    setIndigenousQuizAnswer('incorrect');
                                  }
                                }}
                                className={`p-2.5 rounded-xl text-left text-[11px] font-bold border transition-all cursor-pointer ${
                                  isSelected
                                    ? isCorrect
                                      ? 'bg-emerald-150 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/10'
                                      : 'bg-red-50 border-red-300 text-red-900'
                                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        {/* Answers outcome banners */}
                        {indigenousQuizAnswer === 'correct' && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-800 text-[10px] font-black flex items-center gap-2">
                            <span className="text-emerald-500">✔</span>
                            <span>Correct! Outstanding! You have secured +50 XP and initialized your profile record.</span>
                          </div>
                        )}
                        {indigenousQuizAnswer === 'incorrect' && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-[10px] font-bold flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-amber-500">⚠</span>
                              <span>Not quite right. Give it another try!</span>
                            </div>
                            <p className="text-[9px] text-slate-500 font-normal pl-4">
                              <strong>Hint:</strong> {languageQuiz[indigenousLang].hint}
                            </p>
                          </div>
                        )}

                      </div>

                    </div>
                  )}

                  {/* DEMO 4: GROWTH MARKETS & AD ROI CALCULATOR */}
                  {selectedDemoId === 'ad-roi' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-950">
                          Digital Ad ROI & Funnel Calculator
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Drag sliders to model budget, ad bidding values, and target metrics. This shows real dynamic pipeline modeling designed to optimize client-facing returns.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Sliders Block */}
                        <div className="space-y-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left">
                          
                          {/* Budget */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">Monthly Ad Budget</span>
                              <span className="text-xs font-black text-slate-900">₦{roiBudget.toLocaleString()}</span>
                            </div>
                            <input 
                              type="range"
                              min="50000"
                              max="1000000"
                              step="25000"
                              value={roiBudget}
                              onChange={(e) => setRoiBudget(Number(e.target.value))}
                              className="w-full accent-slate-900 cursor-pointer"
                            />
                            <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                              <span>₦50k</span>
                              <span>₦1 Million</span>
                            </div>
                          </div>

                          {/* CPC */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">Cost Per Click (CPC)</span>
                              <span className="text-xs font-black text-slate-900">₦{roiCPC} /click</span>
                            </div>
                            <input 
                              type="range"
                              min="100"
                              max="1000"
                              step="10"
                              value={roiCPC}
                              onChange={(e) => setRoiCPC(Number(e.target.value))}
                              className="w-full accent-slate-900 cursor-pointer"
                            />
                            <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                              <span>₦100</span>
                              <span>₦1,000</span>
                            </div>
                          </div>

                          {/* Conversion */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">Conversion Rate</span>
                              <span className="text-xs font-black text-slate-900">{roiConvRate.toFixed(1)}%</span>
                            </div>
                            <input 
                              type="range"
                              min="1.0"
                              max="15.0"
                              step="0.5"
                              value={roiConvRate}
                              onChange={(e) => setRoiConvRate(Number(e.target.value))}
                              className="w-full accent-slate-900 cursor-pointer"
                            />
                            <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                              <span>1.0%</span>
                              <span>15.0%</span>
                            </div>
                          </div>

                        </div>

                        {/* Formula output projections card */}
                        {(() => {
                          const projectedClicks = Math.floor(roiBudget / roiCPC);
                          const projectedConversions = Math.floor(projectedClicks * (roiConvRate / 100));
                          // Customer Value is course standard fee: ₦15,000
                          const clv = 15000;
                          const projectedRevenue = projectedConversions * clv;
                          const netProfit = projectedRevenue - roiBudget;
                          const roas = roiBudget > 0 ? (projectedRevenue / roiBudget) : 0;
                          const isProfitable = netProfit > 0;

                          return (
                            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left flex flex-col justify-between shadow-sm">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">Projections Summary</span>
                                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                    isProfitable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {isProfitable ? '● Profitable Funnel' : '● Needs Optimization'}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase font-mono block">Projected Clicks</span>
                                    <span className="text-sm font-black text-slate-900">{projectedClicks.toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase font-mono block">Conversions</span>
                                    <span className="text-sm font-black text-slate-900">{projectedConversions.toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase font-mono block">Projected Revenue</span>
                                    <span className="text-xs font-black text-slate-900">₦{projectedRevenue.toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase font-mono block">ROAS Return</span>
                                    <span className="text-xs font-black text-slate-900">{roas.toFixed(2)}x Return</span>
                                  </div>
                                </div>
                              </div>

                              <div className={`p-3 rounded-xl mt-4 text-left border ${
                                isProfitable 
                                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                                  : 'bg-amber-50 border-amber-100 text-amber-800'
                              }`}>
                                <p className="text-[8px] font-bold font-mono uppercase tracking-wider">Projected Net Income</p>
                                <p className="text-lg font-black tracking-tight mt-0.5">
                                  ₦{netProfit.toLocaleString()}
                                </p>
                                <p className="text-[9px] font-semibold mt-0.5 leading-relaxed opacity-90">
                                  {isProfitable 
                                    ? 'Outstanding! Your funnel returns a net positive profit. Accelerate this configuration on Meta/Google platforms.' 
                                    : 'Caution: Ad spend exceeds generated client revenue. Increase conversion rate or scale down budget to achieve margin profitability.'
                                  }
                                </p>
                              </div>
                            </div>
                          );
                        })()}

                      </div>

                    </div>
                  )}

                </div>

                </div>

              </div>

            </div>

        {/* TESTIMONIALS - TWO-COLUMN CONTROLLABLE AUTO-SLIDE CAROUSEL */}
        <section id="academy-testimonials" className="py-20 bg-white border-b border-slate-200 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Header Block */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
                Student Stories
              </h2>
              <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                Read how our 4-hour live practical digital marketing sessions have accelerated the career journeys of our students.
              </p>
            </div>

            {/* Category Filter Tabs Hidden for Learners-Only */}

            {/* Carousel Interactive Sandbox */}
            {(() => {
              const filtered = selectedTestimonialCategory === 'All'
                ? testimonialsList
                : testimonialsList.filter(t => t.category === selectedTestimonialCategory);

              const slideCount = Math.ceil(filtered.length / 2);
              
              // Get current pair
              const startIndex = currentTestimonialIndex * 2;
              const activePair = filtered.slice(startIndex, startIndex + 2);
              
              // Fallback wrap-around to keep dual columns layout beautiful
              if (activePair.length === 1 && filtered.length > 1) {
                activePair.push(filtered[0]);
              }

              // Color helper for initials avatar based on segment
              const getAvatarColors = (cat: string) => {
                switch(cat) {
                  case 'Students': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
                  case 'Parents': return 'bg-blue-100 text-blue-700 border-blue-200';
                  case 'Teachers': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
                  case 'Schools': return 'bg-purple-100 text-purple-700 border-purple-200';
                  case 'Sponsors': return 'bg-amber-100 text-amber-700 border-amber-200';
                  default: return 'bg-slate-100 text-slate-700 border-slate-200';
                }
              };

              return (
                <div className="relative max-w-5xl mx-auto space-y-6">
                  
                  {/* Slider Window */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsTestimonialsAutoPlaying(false)}
                    onMouseLeave={() => setIsTestimonialsAutoPlaying(true)}
                  >
                    
                    {/* Navigation Buttons */}
                    {slideCount > 1 && (
                      <>
                        <button
                          onClick={() => {
                            setCurrentTestimonialIndex((prev) => (prev - 1 + slideCount) % slideCount);
                            setIsTestimonialsAutoPlaying(false);
                          }}
                          className="absolute left-0 lg:-left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-slate-700 p-2.5 rounded-full border border-slate-200 shadow-md transition-all cursor-pointer z-10"
                          title="Previous Testimonials"
                          aria-label="Previous Slide"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentTestimonialIndex((prev) => (prev + 1) % slideCount);
                            setIsTestimonialsAutoPlaying(false);
                          }}
                          className="absolute right-0 lg:-right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-slate-700 p-2.5 rounded-full border border-slate-200 shadow-md transition-all cursor-pointer z-10"
                          title="Next Testimonials"
                          aria-label="Next Slide"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Sliding Frame */}
                    <motion.div
                      key={`${selectedTestimonialCategory}-${currentTestimonialIndex}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {activePair.map((item, idx) => (
                        <div 
                          key={`${item.author}-${idx}`}
                          className="bg-slate-50 border border-slate-200/85 p-6 sm:p-8 rounded-3xl relative flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left"
                        >
                          <div className="space-y-4">
                            {/* Stars and Tag line */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-0.5">
                                {[...Array(item.stars)].map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                              <span className="text-[9px] font-mono font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100/50">
                                {item.tag}
                              </span>
                            </div>

                            {/* Quote Content */}
                            <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium italic">
                              "{item.quote}"
                            </p>
                          </div>

                          {/* Profile Details */}
                          <div className="pt-4 border-t border-slate-200/60 flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs uppercase border ${getAvatarColors(item.category)}`}>
                              {item.avatar}
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-slate-900">{item.author}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.role}</p>
                            </div>
                            <span className="ml-auto text-[8px] font-bold font-mono text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded uppercase">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </motion.div>

                  </div>

                  {/* Dot navigators & PlayState widget */}
                  <div className="flex items-center justify-center gap-6 pt-2">
                    {/* Pause/Play indicator */}
                    <button
                      onClick={() => setIsTestimonialsAutoPlaying(!isTestimonialsAutoPlaying)}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold text-slate-400 hover:text-slate-700 bg-slate-50 rounded-xl border border-slate-200 transition-all cursor-pointer"
                      title={isTestimonialsAutoPlaying ? "Click to Pause" : "Click to Auto-Slide"}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isTestimonialsAutoPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                      <span>{isTestimonialsAutoPlaying ? 'AUTO-PLAY' : 'PAUSED'}</span>
                    </button>

                    {slideCount > 1 && (
                      <div className="flex gap-1.5">
                        {[...Array(slideCount)].map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setCurrentTestimonialIndex(idx);
                              setIsTestimonialsAutoPlaying(false);
                            }}
                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                              currentTestimonialIndex === idx 
                                ? 'bg-slate-900 w-5' 
                                : 'bg-slate-200 hover:bg-slate-350'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}

          </div>
        </section>

        {/* START TRIAL FORM */}
        <section id="start-trial" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Ready to Start Your <br />Digital Growth Adventure?
                </h2>
                <p className="text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
                  Join thousands of marketers and professionals worldwide and unlock an accredited universe of growth marketing expertise and digital commerce. Your first step starts today.
                </p>

                <form onSubmit={handleStartTrialSubmit} className="max-w-md mx-auto pt-4 space-y-3">
                  {trialSuccess ? (
                    <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-300" />
                      <span>Success! Your Academy enrollment interest has been prioritized.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="email" 
                        required
                        value={trialEmail}
                        onChange={(e) => setTrialEmail(e.target.value)}
                        placeholder="Enter student or parent email address"
                        className="flex-grow bg-white text-slate-900 placeholder-slate-400 border border-white/20 px-4 py-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                      <button 
                        type="submit"
                        className="bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-extrabold px-6 py-3 rounded-xl text-xs cursor-pointer transition-all shrink-0 shadow-sm"
                      >
                        Sign Up for Free
                      </button>
                    </div>
                  )}
                </form>

                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-[11px] text-emerald-100/80">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-300" /> Professional Pulzitive Certification
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-300" /> Real-time Cohort Mentorship
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-300" /> Career Alignment & Portfolios
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM NAV / BRAND REFERENCE */}
        <section className="py-12 bg-white border-t border-slate-200 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-slate-900">Pulzitive Digital <span className="text-emerald-500">Academy</span></span>
              <span>— Unlock your marketing potential.</span>
            </div>
            <div className="flex items-center gap-4 font-medium">
              <a href="#academy-hero" className="hover:text-emerald-600 transition-colors">Hero Overview</a>
              <span>•</span>
              <a href="#academy-features" className="hover:text-emerald-600 transition-colors">Mentorship</a>
              <span>•</span>
              <a href="#courses" className="hover:text-emerald-600 transition-colors font-bold text-emerald-500">Syllabus</a>
            </div>
          </div>
        </section>

      </div>

      {/* PENDING ROLE SIMULATION MODAL */}
      {pendingRole && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-200 text-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6 text-left"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                  {pendingRole} Role Access Setup
                </span>
                <h3 className="text-xl font-black mt-2 tracking-tight text-slate-900">Enter Workspace</h3>
              </div>
              <button 
                onClick={() => setPendingRole(null)}
                className="text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Before accessing the <strong>{pendingRole} Workspace Dashboard</strong>, enter your registration details or sign in with Google to proceed.
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Pulzitive Student"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-800 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g., student@example.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-800 text-xs font-medium"
                />
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-extrabold py-2.5 rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1 shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Complete Sign Up & Go To Dashboard</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* FLAGSHIP ACADEMY INTERACTIVE ENROLLMENT & SCHEDULING WIZARD */}
      {enrollingCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden text-slate-900 shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="bg-slate-50 p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-950 leading-tight">Academy Enrollment Flow</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Pulzitive Certification</p>
                </div>
              </div>
              <button
                onClick={() => setEnrollingCourse(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-950 p-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Course Information Strip */}
            <div className="bg-slate-100/50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-indigo-700">
              <span className="truncate max-w-[280px]">Subject: {enrollingCourse.title}</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded font-mono uppercase">{enrollingCourse.level}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!currentUser ? (
                /* Login / Authentication Requirement Step */
                <div className="space-y-4 text-center py-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-900">User Identification Required</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                      Please register or authenticate your role below to synchronize your learning progress with your personalized dashboard.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setPendingAction({ type: 'enroll', course: enrollingCourse });
                        setPendingRole('Student');
                        setEnrollingCourse(null);
                      }}
                      className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <LogIn className="w-3.5 h-3.5" /> Sign In with Pulzitive Account
                    </button>
                  </div>
                </div>
              ) : enrollmentSuccess ? (
                /* Success screen */
                <div className="space-y-5 text-center py-6 animate-fade-in">
                  <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-slate-900">
                      Enrollment Completed
                    </h4>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Your tuition payment has been securely authorized and processed. Your credentials are now active!
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-[10.5px] space-y-2.5 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Learning Mode:</span>
                      <span className="font-semibold text-slate-900">{enrollMode}</span>
                    </div>
                    {enrollMode === 'Physical' && physicalAddress && (
                      <div className="flex flex-col border-b border-slate-150 pb-2">
                        <span className="text-slate-500">Physical Address:</span>
                        <span className="font-semibold text-slate-800 mt-0.5 leading-normal">{physicalAddress}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scheduled Date:</span>
                      <span className="font-semibold text-slate-900">{enrollDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Time Window:</span>
                      <span className="font-semibold text-slate-900">{enrollTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Standard Duration:</span>
                      <span className="font-semibold text-slate-900">
                        4 Hours Session
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-xs font-bold">
                      <span className="text-slate-600">Amount Paid:</span>
                      <span className="text-emerald-600">
                        ₦{(enrollMode === 'Online'
                          ? (enrollTier === 'Individual' ? 9000 : 30000)
                          : (enrollTier === 'Individual' ? 30000 : 60000)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setEnrollingCourse(null);
                        onNavigate('dashboard');
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 rounded-xl text-xs transition-all cursor-pointer shadow-md w-full"
                    >
                      Go to My Dashboard
                    </button>
                    <button
                      onClick={() => setEnrollingCourse(null)}
                      className="text-xs text-slate-500 hover:text-slate-900 font-medium"
                    >
                      Keep Browsing Academy
                    </button>
                  </div>
                </div>
              ) : (
                /* Primary Interactive Wizard Form */
                <form onSubmit={handleSubmitEnrollment} className="space-y-5 text-xs text-left text-slate-800">
                  
                  {/* Step 1: Choose Learning Mode */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">1. Choose Learning Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEnrollMode('Online')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer bg-white ${
                          enrollMode === 'Online'
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="block font-bold text-xs text-slate-900">Online Session</span>
                        <span className="block text-[9px] text-slate-500 mt-1 leading-normal">Live webinars & cloud terminal tools.</span>
                        <span className="block text-indigo-600 font-black text-xs mt-2 font-mono">
                          ₦{enrollTier === 'Individual' ? '9,000' : '30,000'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEnrollMode('Physical')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer bg-white ${
                          enrollMode === 'Physical'
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="block font-bold text-xs text-slate-900">Physical On-Site</span>
                        <span className="block text-[9px] text-slate-500 mt-1 leading-normal">Hands-on lab at Lagos HQ.</span>
                        <span className="block text-indigo-600 font-black text-xs mt-2 font-mono">
                          ₦{enrollTier === 'Individual' ? '30,000' : '60,000'}
                        </span>
                      </button>
                    </div>

                    {/* Physical Class Address Capture */}
                    {enrollMode === 'Physical' && (
                      <div className="mt-3.5 space-y-1.5 animate-fade-in bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                          Physical Class Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={physicalAddress}
                          onChange={(e) => setPhysicalAddress(e.target.value)}
                          placeholder="e.g. 12 Herbert Macaulay Way, Yaba, Lagos, Nigeria"
                          className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        />
                        <p className="text-[9px] text-slate-500 leading-normal">Your home or office address is required for coordination and physical classroom operations.</p>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Choose Tuition Tier */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">2. Select Enrollment Tier</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEnrollTier('Individual')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer bg-white ${
                          enrollTier === 'Individual'
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="block font-bold text-xs text-slate-900">Individual Student</span>
                        <span className="block text-[9px] text-slate-500 mt-1 leading-normal">Single attendee pass.</span>
                        <span className="block text-indigo-600 font-black text-xs mt-2 font-mono">
                          ₦{enrollMode === 'Online' ? '9,000' : '30,000'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEnrollTier('Group')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer bg-white ${
                          enrollTier === 'Group'
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="block font-bold text-xs text-slate-900">Group / Brand / Business</span>
                        <span className="block text-[9px] text-slate-500 mt-1 leading-normal">Up to 5 team members.</span>
                        <span className="block text-indigo-600 font-black text-xs mt-2 font-mono">
                          ₦{enrollMode === 'Online' ? '30,000' : '60,000'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Step 3: Scheduling Preferences */}
                  <div className="space-y-2.5 pt-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">3. Schedule Class Meetings</label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-semibold font-mono">Start Date</span>
                        <select
                          value={enrollDate}
                          onChange={(e) => setEnrollDate(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
                        >
                          <option value="2026-07-20">Mon, Jul 20, 2026</option>
                          <option value="2026-07-21">Tue, Jul 21, 2026</option>
                          <option value="2026-07-22">Wed, Jul 22, 2026</option>
                          <option value="2026-07-23">Thu, Jul 23, 2026</option>
                          <option value="2026-07-24">Fri, Jul 24, 2026</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-semibold font-mono">Preferred Slot</span>
                        <select
                          value={enrollTime}
                          onChange={(e) => setEnrollTime(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
                        >
                          <option value="09:00 AM">09:00 AM - 11:00 AM (Morning)</option>
                          <option value="11:30 AM">11:30 AM - 01:30 PM (Midday)</option>
                          <option value="02:00 PM">02:00 PM - 05:00 PM (Afternoon)</option>
                          <option value="05:30 PM">05:30 PM - 08:30 PM (Evening)</option>
                        </select>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={syncCalendar}
                        onChange={(e) => setSyncCalendar(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-0 focus:ring-offset-0 bg-white"
                      />
                      <span className="text-[10px] text-slate-500">Sync with Google Calendar and academic schedules</span>
                    </label>
                  </div>

                  {/* Step 4: Secure PayPal Integration */}
                  <div className="space-y-2.5 pt-1 border-t border-slate-200">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">4. Secure PayPal Merchant Payment</label>
                    
                    <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 space-y-3.5">
                      <div className="flex justify-between items-center text-xs font-bold border-b border-slate-200 pb-2.5">
                        <span className="text-slate-500 font-mono">Order Total:</span>
                        <div className="text-right">
                          <span className="text-blue-700 text-sm font-black font-mono block">
                            ${((enrollMode === 'Online'
                              ? (enrollTier === 'Individual' ? 9000 : 30000)
                              : (enrollTier === 'Individual' ? 30000 : 60000)) / 600).toFixed(2)} USD
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            (~₦{(enrollMode === 'Online'
                              ? (enrollTier === 'Individual' ? 9000 : 30000)
                              : (enrollTier === 'Individual' ? 30000 : 60000)).toLocaleString()} NGN)
                          </span>
                        </div>
                      </div>

                      <div className="text-slate-500 text-[10.5px] leading-relaxed space-y-2">
                        <p className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold font-mono">✓</span>
                          <span>Official PayPal transaction gateway secure checkout.</span>
                        </p>
                        <p className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold font-mono">✓</span>
                          <span>Merchant Account: <span className="font-mono font-bold text-blue-800">pulzitive@gmail.com</span></span>
                        </p>
                        <p className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold font-mono">✓</span>
                          <span>We do not store or process card details on Pulzitive.</span>
                        </p>
                      </div>

                      <div className="text-[9px] bg-blue-50 p-2.5 rounded-xl border border-blue-100 text-blue-900 text-center font-bold font-mono truncate">
                        PayPal Account: pulzitive@gmail.com
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingEnrollment}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-black rounded-xl text-xs transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSubmittingEnrollment ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Connecting to PayPal (pulzitive@gmail.com)...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" /> 
                        {`Pay Tuition with PayPal ($${((enrollMode === 'Online'
                          ? (enrollTier === 'Individual' ? 9000 : 30000)
                          : (enrollTier === 'Individual' ? 30000 : 60000)) / 600).toFixed(2)} USD)`}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* RECEPTION COURSES LAUNCH PORTAL MODAL */}
      {launchingReceptionCourse && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden text-slate-900 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-slate-50 p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">Launch Practice Portal</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Pulzitive Sandbox</p>
                </div>
              </div>
              <button
                onClick={() => setLaunchingReceptionCourse(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 p-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-center">
              {receptionSuccess ? (
                /* Success message */
                <div className="space-y-4 py-4 animate-fade-in">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Sandbox Access Synchronized</h4>
                    <p className="text-[11px] text-slate-600 max-w-xs mx-auto mt-1 leading-relaxed">
                      We have successfully launched your practice sandbox in a new window and registered your activity to your dashboard coursework.
                    </p>
                  </div>
                  <div className="pt-4 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        window.open(launchingReceptionCourse.url, '_blank');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Re-launch Sandbox Portal
                    </button>
                    <button
                      onClick={() => {
                        setLaunchingReceptionCourse(null);
                        onNavigate('dashboard');
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
                    >
                      Go to Dashboard Coursework
                    </button>
                  </div>
                </div>
              ) : (
                /* Main confirmation step */
                <>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-900">{launchingReceptionCourse.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      You are launching external access to this secure sandbox. Pulzitive automatically synchronizes this playground onto your dashboard, ensuring immediate certification logs.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-[10.5px] space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Workspace Type:</span>
                      <span className="font-semibold text-slate-800">Self-Paced Practice Sandbox</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Access Type:</span>
                      <span className="font-semibold text-indigo-700">100% Free Scholarship</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Goal Award XP:</span>
                      <span className="font-bold text-emerald-700">+{launchingReceptionCourse.points} XP Logged</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Security:</span>
                      <span className="font-semibold text-slate-700">Google Workspace Safe Connection</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-2">
                    <button
                      onClick={handleConfirmReceptionLaunch}
                      disabled={isSyncingReception}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-black py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      {isSyncingReception ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Synchronizing Dashboard...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-white text-white" /> Confirm & Launch Sandbox Portal
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setLaunchingReceptionCourse(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* LOCAL TOAST SYSTEM */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-white border border-slate-200 text-slate-900 text-xs font-semibold px-4.5 py-3 rounded-2xl shadow-xl flex items-center gap-2 z-50 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
