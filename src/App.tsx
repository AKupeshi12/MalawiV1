/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  Info, 
  Sprout, 
  Users, 
  Calendar, 
  Layout, 
  DollarSign, 
  X, 
  ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  NavLink,
  HomeCard,
  Quote,
  PrincipleStep,
  Card,
  CheckItem,
  Stat,
  ScriptBox,
  MilestoneItem,
  Rung,
  BottomNavItem
} from './components';

const QUOTES = [
  '"The rich and the poor have one thing in common — it is how they see." — Munroe',
  '"God doesn\'t give money. He gives ideas. Your problem is you want cash, not ideas." — Munroe',
  '"A legal mandate is better than any sales team." — Boring Businesses',
  '"Management is the effective, efficient, correct and timely use of another person\'s property to produce added value." — Munroe',
  '"Whoever can be trusted with little can also be trusted with much." — Luke 16',
  '"A good man leaves an inheritance for his children\'s children." — Proverbs 13:22',
  '"From 9 to 5 you are employed. From 5 to midnight you are deployed." — Munroe',
  '"He who gathers money little by little makes it grow." — Proverbs 13:11',
  '"Every problem is a business. One man sees bare feet, another sees a shoe company." — Munroe',
  '"Innovation does not mean starting big. It means starting smart." — Boring Businesses',
  '"If I stopped marketing tomorrow, would this business still make money next month? If yes — you have a real business." — Boring Businesses',
  '"Blessed are the meek — the self-disciplined — for they shall inherit the earth." — Matthew 5:5'
];

type PageId = 'home' | 'foundation' | 'seed' | 'customers' | 'plan' | 'assets' | 'numbers';

interface Lead {
  name: string;
  contact: string;
  status: string;
  date: string;
}

interface IncomeEntry {
  month: string;
  amount: number;
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [milestones, setMilestones] = useState<Record<string, boolean>>({});
  const [leads, setLeads] = useState<Lead[]>([]);
  const [income, setIncome] = useState<IncomeEntry[]>([]);
  const [currentRung, setCurrentRung] = useState<string | null>(null);
  const [openRung, setOpenRung] = useState<string | null>(null);
  
  // Form states
  const [leadName, setLeadName] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [leadStatus, setLeadStatus] = useState('Contacted');
  const [incomeMonth, setIncomeMonth] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [landTarget, setLandTarget] = useState('');
  const [landSavings, setLandSavings] = useState('');
  const [clientCount, setClientCount] = useState(3);

  // Load state from localStorage
  useEffect(() => {
    const savedChecks = JSON.parse(localStorage.getItem('playbook_checks') || '{}');
    const savedMilestones = JSON.parse(localStorage.getItem('playbook_milestones') || '{}');
    const savedLeads = JSON.parse(localStorage.getItem('playbook_leads') || '[]');
    const savedIncome = JSON.parse(localStorage.getItem('playbook_income') || '[]');
    const savedRung = localStorage.getItem('playbook_currentRung');

    setChecks(savedChecks);
    setMilestones(savedMilestones);
    setLeads(savedLeads);
    setIncome(savedIncome);
    setCurrentRung(savedRung);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('playbook_checks', JSON.stringify(checks));
  }, [checks]);

  useEffect(() => {
    localStorage.setItem('playbook_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('playbook_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('playbook_income', JSON.stringify(income));
  }, [income]);

  useEffect(() => {
    if (currentRung) localStorage.setItem('playbook_currentRung', currentRung);
  }, [currentRung]);

  const dailyQuote = useMemo(() => {
    const today = new Date().getDay();
    return QUOTES[today % QUOTES.length];
  }, []);

  const sidebarQuote = useMemo(() => {
    const today = new Date().getDay();
    return QUOTES[(today + 3) % QUOTES.length];
  }, []);

  const milestoneProgress = useMemo(() => {
    const keys = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'];
    const done = keys.filter(k => milestones[k]).length;
    const pct = Math.round((done / keys.length) * 100);
    return { done, total: keys.length, pct };
  }, [milestones]);

  const toggleCheck = (id: string) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMilestone = (id: string) => {
    setMilestones(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addLead = () => {
    if (!leadName) return;
    const newLead: Lead = {
      name: leadName,
      contact: leadContact,
      status: leadStatus,
      date: new Date().toLocaleDateString()
    };
    setLeads(prev => [...prev, newLead]);
    setLeadName('');
    setLeadContact('');
  };

  const deleteLead = (index: number) => {
    setLeads(prev => prev.filter((_, i) => i !== index));
  };

  const addIncome = () => {
    if (!incomeMonth || !incomeAmount) return;
    const newEntry: IncomeEntry = {
      month: incomeMonth,
      amount: parseInt(incomeAmount)
    };
    setIncome(prev => [...prev, newEntry]);
    setIncomeMonth('');
    setIncomeAmount('');
  };

  const deleteIncome = (index: number) => {
    setIncome(prev => prev.filter((_, i) => i !== index));
  };

  const copyScript = (text: string, e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(text).then(() => {
      const btn = e.currentTarget;
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.color = '#5DCAA5';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.color = '';
      }, 2000);
    });
  };

  const landCalc = useMemo(() => {
    const target = parseInt(landTarget) || 0;
    const savings = parseInt(landSavings) || 0;
    if (target > 0 && savings > 0) {
      const months = Math.ceil(target / savings);
      const years = Math.floor(months / 12);
      const rem = months % 12;
      return { months, years, rem };
    }
    return null;
  }, [landTarget, landSavings]);

  const incomeCalc = useMemo(() => {
    const monthly = clientCount * 90000;
    const annual = monthly * 12;
    const notes: Record<number, string> = {
      1: 'At 1 client: proof of concept. Focus on delivering exceptional results.',
      3: 'At 3 clients: your foundation. Cover costs, save aggressively, fund land deposit.',
      5: 'At 5 clients: real business. Begin media company upsells and boring service add-ons.',
      8: 'At 8 clients: consider hiring one assistant. Your time shifts to sales and asset strategy.',
      10: 'At 10 clients: you are subduing the market. Dominion is beginning.',
      15: 'At 15 clients: you are the recognised name in northern Malawi. Leverage for asset deals.'
    };
    const closest = [1, 3, 5, 8, 10, 15].reduce((a, b) => Math.abs(b - clientCount) < Math.abs(a - clientCount) ? b : a);
    return { monthly, annual, note: notes[closest] };
  }, [clientCount]);

  const runningIncomeTotal = useMemo(() => {
    let total = 0;
    return income.map(e => {
      total += e.amount;
      return total;
    });
  }, [income]);

  return (
    <div className="shell flex min-h-screen">
      {/* SIDEBAR */}
      <nav className="sidebar w-[240px] bg-bg2 border-r border-border fixed top-0 left-0 h-screen overflow-y-auto z-100 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 -translate-x-full">
        <div className="logo p-6 border-b border-border">
          <div className="logo-title font-syne text-[16px] font-extrabold text-text-main tracking-tight">My Malawi Playbook</div>
          <div className="logo-sub text-[11px] text-text3 mt-1">Young entrepreneur · Mzuzu</div>
        </div>
        <div className="nav-links py-3 flex-1">
          <NavLink id="home" active={activePage === 'home'} onClick={() => setActivePage('home')} icon={<Home className="nav-icon" />} label="Dashboard" />
          <NavLink id="foundation" active={activePage === 'foundation'} onClick={() => setActivePage('foundation')} icon={<Info className="nav-icon" />} label="Foundation" />
          <NavLink id="seed" active={activePage === 'seed'} onClick={() => setActivePage('seed')} icon={<Sprout className="nav-icon" />} label="Your Seed" />
          <NavLink id="customers" active={activePage === 'customers'} onClick={() => setActivePage('customers')} icon={<Users className="nav-icon" />} label="Find Customers" />
          <NavLink id="plan" active={activePage === 'plan'} onClick={() => setActivePage('plan')} icon={<Calendar className="nav-icon" />} label="Day 1 Plan" />
          <NavLink id="assets" active={activePage === 'assets'} onClick={() => setActivePage('assets')} icon={<Layout className="nav-icon" />} label="Asset Ladder" />
          <NavLink id="numbers" active={activePage === 'numbers'} onClick={() => setActivePage('numbers')} icon={<DollarSign className="nav-icon" />} label="The Numbers" />
        </div>
        <div className="sidebar-quote p-5 border-t border-border text-[11px] text-text3 leading-relaxed italic">
          {sidebarQuote}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main md:ml-[240px] flex-1 min-h-screen pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="page active"
          >
            {activePage === 'home' && (
              <>
                <div className="page-header mb-8">
                  <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">Your entrepreneurship playbook</h1>
                  <p className="text-[14px] text-text2 mt-2 leading-relaxed">Everything you need to go from PC + phone to land ownership in Malawi. Saved right here, accessible anywhere.</p>
                </div>
                <div className="ring-wrap flex items-center gap-4 bg-bg2 border border-border rounded-[var(--r)] p-5 mb-5">
                  <svg className="ring-svg shrink-0" width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="28" fill="none" stroke="#1e1e1e" strokeWidth="8"/>
                    <circle 
                      cx="36" cy="36" r="28" fill="none" stroke="#1D9E75" strokeWidth="8" 
                      strokeDasharray="175.9" 
                      strokeDashoffset={175.9 - (175.9 * milestoneProgress.pct / 100)} 
                      strokeLinecap="round" 
                      transform="rotate(-90 36 36)" 
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                  </svg>
                  <div className="ring-label">
                    <h2 className="font-syne text-[22px] font-extrabold">{milestoneProgress.pct}%</h2>
                    <p className="text-[13px] text-text2 mt-1">Day 1 plan progress — <span>{milestoneProgress.done}</span> of {milestoneProgress.total} milestones complete</p>
                  </div>
                </div>
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">Your sections</div>
                <div className="home-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px] mb-6">
                  <HomeCard onClick={() => setActivePage('foundation')} emoji="🌱" title="Foundation" sub="Vision, management principles, Genesis 1:28 strategy" />
                  <HomeCard onClick={() => setActivePage('seed')} emoji="💡" title="Your Seed" sub="Your niche, your whopper, your unique position" />
                  <HomeCard onClick={() => setActivePage('customers')} emoji="🎯" title="Find Customers" sub="4 channels + pitch scripts you can copy and send now" />
                  <HomeCard onClick={() => setActivePage('plan')} emoji="📅" title="Day 1 Plan" sub="Interactive 90-day checklist tracking your progress" />
                  <HomeCard onClick={() => setActivePage('assets')} emoji="🏗️" title="Asset Ladder" sub="5 rungs from PC to land — tap your current rung" />
                  <HomeCard onClick={() => setActivePage('numbers')} emoji="📊" title="The Numbers" sub="Income calculator + lead tracker + savings goal" />
                </div>
                <hr className="divider border-none border-t border-border my-7" />
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">Today's quote</div>
                <div className="daily-quote bg-bg3 rounded-[var(--r)] p-[1.1rem] text-[13px] text-text2 leading-relaxed italic border-l-3 border-l-amber">
                  {dailyQuote}
                </div>
              </>
            )}

            {activePage === 'foundation' && (
              <>
                <div className="page-header mb-8">
                  <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">The Foundation</h1>
                  <p className="text-[14px] text-text2 mt-2 leading-relaxed">Three teachers, one truth. Vision applied through management builds wealth.</p>
                </div>
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">Three anchoring principles</div>
                <Quote text={<><strong>"The rich and the poor have one thing in common — it is how they see."</strong> The difference between rich and poor is not resources. It is vision applied through management. You are not poor. You see differently.</>} source="— Dr. Myles Munroe, Kingdom Business Principles" />
                <Quote text={<><strong>"God doesn't give money. He gives ideas. Your problem is you want cash, not ideas."</strong> You have the ideas. The multimedia company, the lodge contacts, the laptop, the phone. These are seeds — not gaps.</>} source="— Dr. Myles Munroe, The Principle of Management" />
                <Quote text={<><strong>"A legal mandate is better than any sales team."</strong> When your customer is forced to need you, selling disappears. Build recurring services. Stop chasing. Start planting.</>} source="— Boring Businesses Video" />
                <hr className="divider border-none border-t border-border my-7" />
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">God's business strategy — Genesis 1:28</div>
                <div className="pflow grid grid-cols-2 sm:grid-cols-5 gap-[6px] my-4">
                  <PrincipleStep num="1" title="Be fruitful" sub="Produce something. Your seed is already in you." />
                  <PrincipleStep num="2" title="Multiply" sub="Reproduce what you produce. Systems over effort." />
                  <PrincipleStep num="3" title="Replenish" sub="Distribute. Get it to every client who needs it." />
                  <PrincipleStep num="4" title="Subdue" sub="Control your niche. Own one market completely." />
                  <PrincipleStep num="5" title="Dominate" sub="When they think lodges in Malawi, they call you." />
                </div>
                <hr className="divider border-none border-t border-border my-7" />
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">Why management is your real product</div>
                <div className="grid2 grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                  <Card color="teal" badge="Your core service" title="You are selling management" body="You walk into a lodge owner's chaos — no booking system, no social media, no lead flow — and turn it into order. <strong>Order out of chaos is the product.</strong>" />
                  <Card color="blue" badge="Luke 16 principle" title="Manage others' property first" body="&quot;Who will give you property of your own if you cannot manage someone else's?&quot; Your lodge clients are your <strong>management training ground</strong> for the land you will own." />
                  <Card color="amber" badge="Boring businesses" title="Recurring over one-off" body="Every boring business runs on one principle: <strong>recurring revenue from people who need you whether they like it or not.</strong> Your lodge retainer must become the same — non-negotiable, monthly." />
                  <Card color="teal" badge="Malawi context" title="You are early" body="Digital marketing for lodges in northern Malawi is underdeveloped. Low competition, high demand, warm relationships already in place. <strong>You are not starting late. You are early.</strong>" />
                </div>
              </>
            )}

            {activePage === 'seed' && (
              <>
                <div className="page-header mb-8">
                  <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">Your Seed</h1>
                  <p className="text-[14px] text-text2 mt-2 leading-relaxed">The idea that won't leave you alone is your business. Find it. Refine it. Produce fruit from it.</p>
                </div>
                <Quote text={<><strong>"Your seed is the idea that won't let you go. Every problem is a business. One man sees bare feet — another sees a shoe company."</strong></>} source="— Dr. Myles Munroe" />
                <div className="card teal">
                  <span className="badge badge-teal bg-teal-dim text-[#5DCAA5] text-[11px] font-medium px-[10px] py-[3px] rounded-full mb-[7px] inline-block">Your seed profile</span>
                  <div className="card-title text-[14px] font-medium text-text-main mb-1">You can see what lodge owners cannot see about themselves</div>
                  <div className="card-body text-[13px] text-text2 leading-relaxed">You have a multimedia company at your back. You have warm lodge and farm relationships. You have digital marketing skills. And you can see that a lodge with no online presence is leaving <strong>5.4 million Kwacha a year</strong> on the table. That seeing is your seed.</div>
                  <div className="highlight bg-teal-dim rounded-[var(--r2)] p-4 text-[13px] text-[#5DCAA5] mt-3 leading-relaxed">The world doesn't eat seeds. The world eats fruit. Your seed is vision. Your fruit is the bookings and revenue you produce for lodge owners.</div>
                </div>
                <hr className="divider border-none border-t border-border my-7" />
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">Your whopper — what makes you different</div>
                <div className="grid2 grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                  <Card color="blue" title="Not just web design" body="Your whopper is the full growth system: website + Google presence + WhatsApp lead capture + Facebook content + monthly reporting. You become the lodge's <strong>entire digital department</strong>, not a one-time vendor." />
                  <Card color="blue" title="Your specific domain" body="Hospitality and agri-tourism in <strong>northern Malawi</strong> — Mzuzu, Nyika, Viphya, Livingstonia. You know the market. You know the owners. That specificity is your whopper." />
                  <Card color="teal" title="The media company multiplier" body="You have access to a media company with professionals and equipment. You sell the service. They produce the content. You <strong>split the margin</strong>. Find skilled labour that can't sell — then sell for them." />
                  <Card color="teal" title="The domain to subdue" body="Subdue means: when anyone wants what you offer, you are the first name they think of. Become the name every lodge and farm owner in northern Malawi associates with <strong>&quot;getting found online and getting bookings.&quot;</strong>" />
                </div>
                <hr className="divider border-none border-t border-border my-7" />
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">Seed to fruit checklist — track where you are</div>
                <div id="seedChecks">
                  <CheckItem id="s1" checked={checks['s1']} onToggle={() => toggleCheck('s1')} label="Seed identified — digital visibility and booking systems for lodges and farms in Malawi" />
                  <CheckItem id="s2" checked={checks['s2']} onToggle={() => toggleCheck('s2')} label="Resources confirmed — PC, phone, multimedia company access, warm lodge contacts" />
                  <CheckItem id="s3" checked={checks['s3']} onToggle={() => toggleCheck('s3')} label="First client contacted — at least one lodge owner pitched or audited" />
                  <CheckItem id="s4" checked={checks['s4']} onToggle={() => toggleCheck('s4')} label="First fruit produced — first paying retainer client signed" />
                  <CheckItem id="s5" checked={checks['s5']} onToggle={() => toggleCheck('s5')} label="Prototype refined — first client results documented and turned into a case study" />
                  <CheckItem id="s6" checked={checks['s6']} onToggle={() => toggleCheck('s6')} label="Multiply — 3+ clients using the same system you built for the first" />
                  <CheckItem id="s7" checked={checks['s7']} onToggle={() => toggleCheck('s7')} label="Media company upsell active — professional content sold to at least one client" />
                  <CheckItem id="s8" checked={checks['s8']} onToggle={() => toggleCheck('s8')} label="Domination signal — someone referred a new client because of your reputation" />
                </div>
                <div className="warn bg-amber-dim rounded-[var(--r2)] p-4 text-[13px] text-[#EF9F27] mt-3 leading-relaxed">Munroe's warning: do not rush to multiply before you have produced your first fruit. One lodge client with a real result is worth more than ten proposals that went nowhere.</div>
              </>
            )}

            {activePage === 'customers' && (
              <>
                <div className="page-header mb-8">
                  <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">Find Customers</h1>
                  <p className="text-[14px] text-text2 mt-2 leading-relaxed">PC + phone only. Four channels, all starting today, all free.</p>
                </div>
                <div className="stat-row grid grid-cols-1 sm:grid-cols-3 gap-[10px] mb-6">
                  <Stat value="MWK 450K" label="Value of 10 new lodge bookings/month" />
                  <Stat value="MWK 5.4M" label="Annual new revenue you create per lodge" />
                  <Stat value="20–25%" label="Your retainer as % of value created" />
                </div>
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">Channel 1 — Warm leads you already have (start here, today)</div>
                <div className="card teal">
                  <span className="badge badge-teal bg-teal-dim text-[#5DCAA5] text-[11px] font-medium px-[10px] py-[3px] rounded-full mb-[7px] inline-block">Highest priority</span>
                  <div className="card-title text-[14px] font-medium text-text-main mb-1">The lodge and farm owners you know</div>
                  <div className="card-body text-[13px] text-text2 leading-relaxed">Do not pitch "digital marketing." Ask one question instead:<br/><br/><strong>"What is your biggest challenge getting new guests or clients right now?"</strong><br/><br/>Let them tell you the problem. Then show them how you solve it. You already know the answer is online visibility — but they need to say it first.</div>
                  <div className="highlight bg-teal-dim rounded-[var(--r2)] p-4 text-[13px] text-[#5DCAA5] mt-3 leading-relaxed">Munroe: "Go make friends with them. They have your money. Find out what they do to get it." Your warm contacts are the door. Walk through it this week.</div>
                </div>
                <hr className="divider border-none border-t border-border my-7" />
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">Copy-ready pitch scripts</div>
                <ScriptBox text="Hi [Name], I help lodges and farms in Malawi get more bookings through Google and social media. I just ran a quick audit on [their lodge name] and found a few things that might be costing you guests. I'd love to share it with you — completely free. Can I send it through on WhatsApp?" onCopy={copyScript} />
                <ScriptBox text="I help lodges and farms in northern Malawi get found online and convert visits into bookings. I'm offering 3 free Google + social media audits this week to lodge owners. If you'd like to know what a potential guest sees when they search for accommodation near your area, DM me your lodge name and I'll send you a report within 24 hours." onCopy={copyScript} />
                <ScriptBox text="I run a digital growth service for lodges and farms in Malawi. I personally oversee every client — website, Google profile, Facebook content, WhatsApp booking flow. My last client went from 2 enquiries a month to 10. I work on a monthly retainer so you always know what you're paying. Can I give you a free audit this week?" onCopy={copyScript} />
                <hr className="divider border-none border-t border-border my-7" />
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">Channel 2 — WhatsApp groups</div>
                <Card color="blue" title="Groups to join in Malawi" body="Mzuzu Business Network · Malawi Tourism & Hospitality · Northern Malawi Landowners · Malawi Entrepreneurs · Area-specific community groups. Post one piece of value first (&quot;3 reasons lodges in Malawi don't show up on Google&quot;) — then offer the free audit. <strong>Value before selling, every time.</strong>" />
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3 mt-4">Channel 3 — Facebook organic</div>
                <Card color="amber" title="The free audit post — publish this today" body="Search &quot;lodges near Mzuzu&quot; on Google. Take screenshots. Note who is missing. Post those screenshots with the caption: &quot;I searched for lodges in northern Malawi today. Here is what I found — and who I didn't find. If your lodge is invisible, you are giving bookings to competitors for free. I am offering 3 free audits this week. DM me your lodge name.&quot;" />
                <hr className="divider border-none border-t border-border my-7" />
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">Lead tracker</div>
                <div className="lead-form flex gap-2 mb-4 flex-wrap">
                  <input className="lead-input" value={leadName} onChange={e => setLeadName(e.target.value)} placeholder="Lodge / contact name" />
                  <input className="lead-input" value={leadContact} onChange={e => setLeadContact(e.target.value)} placeholder="Phone / WhatsApp" />
                  <select className="bg-bg3 border border-border text-text-main rounded-[var(--r2)] px-3 py-2 text-[13px] font-dm focus:outline-none focus:border-teal" value={leadStatus} onChange={e => setLeadStatus(e.target.value)}>
                    <option>Contacted</option>
                    <option>Audit sent</option>
                    <option>Proposal made</option>
                    <option>Client signed</option>
                  </select>
                  <button className="btn" onClick={addLead}>Add</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="lead-table w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-[11px] text-text3 text-left p-3 border-b border-border font-medium uppercase tracking-wider">Name</th>
                        <th className="text-[11px] text-text3 text-left p-3 border-b border-border font-medium uppercase tracking-wider">Contact</th>
                        <th className="text-[11px] text-text3 text-left p-3 border-b border-border font-medium uppercase tracking-wider">Status</th>
                        <th className="text-[11px] text-text3 text-left p-3 border-b border-border font-medium uppercase tracking-wider">Date</th>
                        <th className="text-[11px] text-text3 text-left p-3 border-b border-border font-medium uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((l, i) => (
                        <tr key={i}>
                          <td className="text-[13px] text-text2 p-3 border-b border-border">{l.name}</td>
                          <td className="text-[13px] text-text2 p-3 border-b border-border">{l.contact}</td>
                          <td className="text-[13px] text-text2 p-3 border-b border-border">
                            <span className="status-pill" style={{ 
                              backgroundColor: l.status === 'Client signed' ? 'var(--color-teal-dim)' : l.status === 'Audit sent' ? 'var(--color-amber-dim)' : l.status === 'Proposal made' ? 'var(--color-coral-dim)' : 'var(--color-blue-dim)',
                              color: l.status === 'Client signed' ? '#5DCAA5' : l.status === 'Audit sent' ? '#EF9F27' : l.status === 'Proposal made' ? '#F0997B' : '#85B7EB'
                            }}>
                              {l.status}
                            </span>
                          </td>
                          <td className="text-[13px] text-text2 p-3 border-b border-border">{l.date}</td>
                          <td className="text-[13px] text-text2 p-3 border-b border-border">
                            <button className="btn-ghost p-1" onClick={() => deleteLead(i)}><X size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[12px] text-text3 mt-2">Leads saved automatically in your browser.</p>
              </>
            )}

            {activePage === 'plan' && (
              <>
                <div className="page-header mb-8">
                  <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">Day 1 — 90 Day Plan</h1>
                  <p className="text-[14px] text-text2 mt-2 leading-relaxed">PC + phone only. Tick each milestone as you complete it. Your progress saves automatically.</p>
                </div>
                <div id="planProgress" className="mb-6">
                  <div className="progress-wrap bg-bg4 rounded-full h-[6px] mb-2 overflow-hidden">
                    <div className="progress-fill h-full rounded-full bg-teal transition-all duration-400" style={{ width: `${milestoneProgress.pct}%` }}></div>
                  </div>
                  <div className="progress-label text-[12px] text-text3">{milestoneProgress.done} of {milestoneProgress.total} milestones complete</div>
                </div>
                <div className="timeline border-l-2 border-border2 ml-2 pl-5">
                  <MilestoneItem id="m1" checked={milestones['m1']} onToggle={() => toggleMilestone('m1')} color="#378ADD" title="Day 1 — Set up your presence" body="Create WhatsApp Business profile: &quot;Digital Growth for Lodges & Farms | Malawi.&quot; Create a Facebook Page. Write down every lodge and farm contact you have — that list is your entire sales pipeline. Send the warm outreach message to all of them today. Zero cost. Zero experience needed." tag="PC + phone" />
                  <MilestoneItem id="m2" checked={milestones['m2']} onToggle={() => toggleMilestone('m2')} color="#378ADD" title="Day 2 — Produce your first free audit" body="Search &quot;lodges near Mzuzu&quot; on Google. Screenshot results. Note who is missing. Create a 1-page PDF (Canva free) for 3 missing lodge owners showing what a guest sees when searching for them. Send it free with no ask. Pure value. This is your free cookie — give it away first." tag="PC only — Google + Canva free" />
                  <MilestoneItem id="m3" checked={milestones['m3']} onToggle={() => toggleMilestone('m3')} color="#378ADD" title="Day 3 — Follow up and pitch" body="Voice note or call (not text) the lodge owners who received your audit. One question: &quot;Did the audit make sense? Would you like me to fix it?&quot; If yes — propose a 3-month retainer: Google setup + Facebook management + monthly reporting for MWK 80,000–120,000/month. Take a 50% deposit upfront." tag="Phone call" />
                  <MilestoneItem id="m4" checked={milestones['m4']} onToggle={() => toggleMilestone('m4')} color="#1D9E75" title="Week 2 — Land first client, start work" body="Set up their Google Business Profile (free). Optimise Facebook page. Create a simple WhatsApp booking enquiry flow. Post 3 pieces of content using your phone camera. Deliver a weekly report — even with small early numbers. Proof of effort builds trust before proof of results arrives." tag="PC + phone camera" />
                  <MilestoneItem id="m5" checked={milestones['m5']} onToggle={() => toggleMilestone('m5')} color="#1D9E75" title="Month 2 — Multiply: add 2 more clients" body="Document your first client's results: before/after follower count, enquiries, Google reviews. Turn this into a case study. Approach 5 more lodge contacts. Use the case study as social proof. Close 2 more retainer clients. You now have recurring income from 3 sources." tag="Reproduce the prototype" />
                  <MilestoneItem id="m6" checked={milestones['m6']} onToggle={() => toggleMilestone('m6')} color="#1D9E75" title="Month 3 — Introduce the media company" body="Upsell professional photography and video shoots to your retainer clients. You project-manage, the media company produces, you split the margin. Your existing clients now generate additional income streams. This is the boring businesses model: find skilled labour that can't sell, then sell for them." tag="Partnership revenue begins" />
                  <MilestoneItem id="m7" checked={milestones['m7']} onToggle={() => toggleMilestone('m7')} color="#BA7517" title="Month 4 — Begin the asset conversation" body="With 3 clients and MWK 300K–400K/month recurring, approach your most trusted lodge contact as a partner — not a vendor. &quot;I am generating consistent results for you. I want to grow deeper — what does that look like?&quot; Plant the seed of a land or equity arrangement. Value for assets." tag="Vision to asset pathway opens" />
                  <MilestoneItem id="m8" checked={milestones['m8']} onToggle={() => toggleMilestone('m8')} color="#D85A30" title="Month 6 — Subdue: own northern Malawi niche" body="With 5–7 clients, you are the known name for lodge digital marketing in northern Malawi. Post your results publicly. Apply to speak at one Malawi Tourism Board or MCCCI meeting in Mzuzu. When they think &quot;digital for lodges&quot; in the north — your name comes up first. That is when you dominate." tag="Domination begins here" />
                </div>
              </>
            )}

            {activePage === 'assets' && (
              <>
                <div className="page-header mb-8">
                  <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">Asset Ladder</h1>
                  <p className="text-[14px] text-text2 mt-2 leading-relaxed">From PC to land. Five rungs. Tap each to expand. Mark your current rung.</p>
                </div>
                <Quote text={<><strong>"The only heritage the Bible teaches as generational heritage is real estate. You are not wealthy until you own land."</strong></>} source="— Dr. Myles Munroe" />
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3 mt-4">Where are you? Tap your current rung.</div>
                <div className="ladder flex flex-col gap-2">
                  <Rung num="0" id="rung0" current={currentRung === 'rung0'} open={openRung === 'rung0'} onToggle={() => { setOpenRung(openRung === 'rung0' ? null : 'rung0'); setCurrentRung('rung0'); }} title="Starting point — PC, phone, skills, warm contacts" body="You own your time, abilities, and relationships. Munroe started in a wooden house on four rocks. The seed is in you." detail="What qualifies you to move up: Send your first 3 free audits. Make your first pitch. Have at least one active lead conversation this week. You move to Rung 1 when your first retainer invoice is paid." />
                  <div className="arrow-down text-center text-text3 text-[18px] my-1 leading-none"><ArrowDown size={14} className="inline" /></div>
                  <Rung num="1" id="rung1" current={currentRung === 'rung1'} open={openRung === 'rung1'} onToggle={() => { setOpenRung(openRung === 'rung1' ? null : 'rung1'); setCurrentRung('rung1'); }} title="First recurring income — 3 lodge retainer clients" body="MWK 80K–120K per client × 3 = MWK 240K–360K/month. Save aggressively. No lifestyle inflation." detail="What to do here: Build your case study library. Systematise your delivery so you can serve 3 clients in 15 hours/week. Save 30% of every payment. Do not upgrade anything — phone, laptop, lifestyle. Move to Rung 2 when you have 3 paying clients and 3 months of savings set aside." />
                  <div className="arrow-down text-center text-text3 text-[18px] my-1 leading-none"><ArrowDown size={14} className="inline" /></div>
                  <Rung num="2" id="rung2" current={currentRung === 'rung2'} open={openRung === 'rung2'} onToggle={() => { setOpenRung(openRung === 'rung2' ? null : 'rung2'); setCurrentRung('rung2'); }} title="Value-for-equity deal with first lodge owner" body="You generate 5.4M MWK/year for a lodge owner. Propose: reduced cash rate in exchange for equity stake or land access. Luke 16 in action." detail="How to frame this conversation: &quot;I have been generating [X] enquiries and [Y] bookings for you over [Z] months. I want to grow together. Rather than just a vendor relationship, I am interested in a deeper partnership — a share of the growth I create. What would that look like for you?&quot; Let them propose the asset terms. You have earned the right to ask." />
                  <div className="arrow-down text-center text-text3 text-[18px] my-1 leading-none"><ArrowDown size={14} className="inline" /></div>
                  <Rung num="3" id="rung3" current={currentRung === 'rung3'} open={openRung === 'rung3'} onToggle={() => { setOpenRung(openRung === 'rung3' ? null : 'rung3'); setCurrentRung('rung3'); }} title="Add a boring physical service to lodge relationships" body="Pest control, water filtration, painting, cleaning — added to your digital clients. One relationship, multiple recurring revenue streams." detail="How to start: Identify which boring service your lodge clients already pay someone else for. The most common: pest control (year-round in Malawi), commercial cleaning, painting between seasons. Find one reliable subcontractor for each. You bring the contract — they bring the labour. Same model as your digital service. Add 15–25% margin on every job." />
                  <div className="arrow-down text-center text-text3 text-[18px] my-1 leading-none"><ArrowDown size={14} className="inline" /></div>
                  <Rung num="4" id="rung4" current={currentRung === 'rung4'} open={openRung === 'rung4'} onToggle={() => { setOpenRung(openRung === 'rung4' ? null : 'rung4'); setCurrentRung('rung4'); }} title="First land deposit — little by little" body="Proverbs 13:11: &quot;He who gathers money little by little makes it grow.&quot; Save toward a land deposit near Mzuzu." detail="Munroe and his wife lived with his mother-in-law for 4 years. Their sacrifice became a 1.2 million dollar paid-off home. In your context: research affordable land plots in areas around Mzuzu — Luwinga, Msongwe, Ekwendeni. Land registry plots can be found from as low as MWK 3M–8M for rural plots with title. Save 30% of income monthly. Set a target below." />
                  <div className="arrow-down text-center text-text3 text-[18px] my-1 leading-none"><ArrowDown size={14} className="inline" /></div>
                  <Rung num="5" id="rung5" current={currentRung === 'rung5'} open={openRung === 'rung5'} onToggle={() => { setOpenRung(openRung === 'rung5' ? null : 'rung5'); setCurrentRung('rung5'); }} title="Agri-tourism or lodge on your own land" body="You own land. You know exactly how to market a lodge — you have been doing it for years for others. Now do it for yourself. This is dominion." detail="By this point: you have digital skills, media company connections, boring business add-ons, and the management track record that makes investors and partners trust you. You no longer pitch for clients. Clients come because you have subdued the market. Your own property is just the visible fruit of years of invisible management. This is the inheritance Munroe described — generational, real, and already in motion the moment you take the first step today." />
                </div>
                <hr className="divider border-none border-t border-border my-7" />
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">Land savings goal tracker</div>
                <div className="calc-wrap bg-bg2 border border-border rounded-[var(--r)] p-5">
                  <label className="text-[13px] text-text2">Target land deposit (MWK)</label>
                  <input type="number" className="lead-input w-full my-2" value={landTarget} onChange={e => setLandTarget(e.target.value)} placeholder="e.g. 5000000" />
                  <label className="text-[13px] text-text2">Monthly savings (MWK)</label>
                  <input type="number" className="lead-input w-full my-2" value={landSavings} onChange={e => setLandSavings(e.target.value)} placeholder="e.g. 80000" />
                  {landCalc && (
                    <div className="calc-result bg-bg3 rounded-[var(--r2)] p-4 mt-3">
                      <div className="calc-big font-syne text-[26px] font-extrabold text-teal">{landCalc.months}</div>
                      <div className="calc-sub text-[12px] text-text3 mt-1">months{landCalc.years > 0 ? ` (${landCalc.years} year${landCalc.years > 1 ? 's' : ''} and ${landCalc.rem} months)` : ''} to reach your MWK {parseInt(landTarget).toLocaleString()} land deposit goal</div>
                    </div>
                  )}
                </div>
              </>
            )}

            {activePage === 'numbers' && (
              <>
                <div className="page-header mb-8">
                  <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">The Numbers</h1>
                  <p className="text-[14px] text-text2 mt-2 leading-relaxed">Two numbers separate businesses that make you rich from ones that just keep you busy: margin and recurring revenue.</p>
                </div>
                <Quote text={<><strong>"How much cash can I actually take out of this business every year? Not revenue. Not EBITDA on a spreadsheet. Real cash."</strong></>} source="— Boring Businesses Video" />
                <hr className="divider border-none border-t border-border my-7" />
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">Income calculator</div>
                <div className="calc-wrap bg-bg2 border border-border rounded-[var(--r)] p-5">
                  <label className="text-[13px] text-text2">Number of lodge retainer clients: <strong className="text-text-main">{clientCount}</strong></label>
                  <input type="range" min="1" max="15" value={clientCount} className="w-full my-3 accent-teal" onChange={e => setClientCount(parseInt(e.target.value))} />
                  <div className="calc-result bg-bg3 rounded-[var(--r2)] p-4 mt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div><div className="calc-big font-syne text-[26px] font-extrabold text-teal">MWK {Math.round(incomeCalc.monthly / 1000)}K</div><div className="calc-sub text-[12px] text-text3 mt-1">per month</div></div>
                      <div><div className="calc-big font-syne text-[26px] font-extrabold text-teal">MWK {(incomeCalc.annual / 1000000).toFixed(2)}M</div><div className="calc-sub text-[12px] text-text3 mt-1">per year</div></div>
                    </div>
                    <div className="mt-3 text-[12px] text-text3 leading-relaxed">{incomeCalc.note}</div>
                  </div>
                </div>
                <hr className="divider border-none border-t border-border my-7" />
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">Monthly income log</div>
                <div className="lead-form flex gap-2 mb-4 flex-wrap">
                  <input className="lead-input" value={incomeMonth} onChange={e => setIncomeMonth(e.target.value)} placeholder="Month (e.g. April 2026)" />
                  <input className="lead-input" type="number" value={incomeAmount} onChange={e => setIncomeAmount(e.target.value)} placeholder="Amount (MWK)" />
                  <button className="btn" onClick={addIncome}>Log</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="lead-table w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-[11px] text-text3 text-left p-3 border-b border-border font-medium uppercase tracking-wider">Month</th>
                        <th className="text-[11px] text-text3 text-left p-3 border-b border-border font-medium uppercase tracking-wider">Income (MWK)</th>
                        <th className="text-[11px] text-text3 text-left p-3 border-b border-border font-medium uppercase tracking-wider">Running total</th>
                        <th className="text-[11px] text-text3 text-left p-3 border-b border-border font-medium uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {income.map((e, i) => (
                        <tr key={i}>
                          <td className="text-[13px] text-text2 p-3 border-b border-border">{e.month}</td>
                          <td className="text-[13px] text-text2 p-3 border-b border-border">MWK {e.amount.toLocaleString()}</td>
                          <td className="text-[13px] text-text2 p-3 border-b border-border">MWK {runningIncomeTotal[i].toLocaleString()}</td>
                          <td className="text-[13px] text-text2 p-3 border-b border-border">
                            <button className="btn-ghost p-1" onClick={() => deleteIncome(i)}><X size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <hr className="divider border-none border-t border-border my-7" />
                <div className="section-label text-[10px] font-semibold tracking-widest text-text3 uppercase mb-3">Red flags — capital black holes to avoid</div>
                <div className="grid2 grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                  <Card color="amber" title="Large upfront equipment" body="You need: PC + phone. That is all. Do not buy camera equipment, office space, or software subscriptions before your income justifies it. The client's first payment funds the tools you need." />
                  <Card color="amber" title="Lifestyle inflation" body="Munroe lived with his mother-in-law for 4 years. You are in the saving phase. Every Kwacha not spent on essentials goes to the land deposit. Do not compete with people who are living on credit." />
                  <Card color="amber" title="One-off projects over retainers" body="&quot;If I stopped marketing tomorrow, would this business still make money next month?&quot; If yes, you have a real business. Chase retainers. Refuse projects that don't convert to recurring relationships." />
                  <Card color="amber" title="Too much ground too early" body="The boring businesses video says it plainly: the mistake is trying to cover too much ground too early. Concentrate demand. Start with Mzuzu. Start with northern Malawi. Win there first." />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* BOTTOM NAV (mobile) */}
      <div className="bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-bg2 border-t border-border z-100 p-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        <div className="bnav-inner flex justify-around">
          <BottomNavItem active={activePage === 'home'} onClick={() => setActivePage('home')} icon={<Home size={22} />} label="Home" />
          <BottomNavItem active={activePage === 'seed'} onClick={() => setActivePage('seed')} icon={<Sprout size={22} />} label="Seed" />
          <BottomNavItem active={activePage === 'customers'} onClick={() => setActivePage('customers')} icon={<Users size={22} />} label="Leads" />
          <BottomNavItem active={activePage === 'plan'} onClick={() => setActivePage('plan')} icon={<Calendar size={22} />} label="Plan" />
          <BottomNavItem active={activePage === 'numbers'} onClick={() => setActivePage('numbers')} icon={<DollarSign size={22} />} label="Numbers" />
        </div>
      </div>
    </div>
  );
}
