import React from 'react';
import { motion } from 'motion/react';
import { X, ArrowDown } from 'lucide-react';

export function NavLink({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, id: string }) {
  return (
    <div className={`nav-link ${active ? 'active' : ''}`} onClick={onClick}>
      {icon}
      {label}
    </div>
  );
}

export function HomeCard({ onClick, emoji, title, sub }: { onClick: () => void, emoji: string, title: string, sub: string }) {
  return (
    <div className="home-card" onClick={onClick}>
      <div className="home-card-icon text-[24px] mb-2">{emoji}</div>
      <div className="home-card-title text-[14px] font-medium text-text-main">{title}</div>
      <div className="home-card-sub text-[12px] text-text3 mt-1 leading-relaxed">{sub}</div>
    </div>
  );
}

export function Quote({ text, source }: { text: React.ReactNode, source: string }) {
  return (
    <div className="quote">
      <div className="quote-text text-[13px] text-text2 leading-relaxed italic">{text}</div>
      <div className="quote-source text-[11px] text-text3 mt-2">{source}</div>
    </div>
  );
}

export function PrincipleStep({ num, title, sub }: { num: string, title: string, sub: string }) {
  return (
    <div className="pf">
      <div className="pf-n font-syne text-[22px] font-extrabold text-teal">{num}</div>
      <div className="pf-w text-[12px] font-medium text-text-main my-1">{title}</div>
      <div className="pf-s text-[11px] text-text3 leading-tight">{sub}</div>
    </div>
  );
}

export function Card({ color, badge, title, body }: { color: 'teal' | 'blue' | 'amber' | 'coral', badge?: string, title: string, body: string }) {
  return (
    <div className={`card ${color}`}>
      {badge && <span className={`badge badge-${color} bg-${color}-dim text-[11px] font-medium px-[10px] py-[3px] rounded-full mb-[7px] inline-block`}>{badge}</span>}
      <div className="card-title text-[14px] font-medium text-text-main mb-1">{title}</div>
      <div className="card-body text-[13px] text-text2 leading-relaxed" dangerouslySetInnerHTML={{ __html: body }}></div>
    </div>
  );
}

export function CheckItem({ id, checked, onToggle, label }: { id: string, checked: boolean, onToggle: () => void, label: string }) {
  return (
    <div className="check-item flex items-start gap-3 py-3 border-b border-border last:border-none">
      <div className={`check-box ${checked ? 'checked' : ''}`} onClick={onToggle}></div>
      <div className={`check-label text-[13px] text-text2 leading-relaxed cursor-pointer ${checked ? 'text-text3 line-through' : ''}`} onClick={onToggle}>{label}</div>
    </div>
  );
}

export function Stat({ value, label }: { value: string, label: string }) {
  return (
    <div className="stat">
      <div className="stat-val font-syne text-[20px] font-bold text-text-main">{value}</div>
      <div className="stat-lbl text-[11px] text-text3 mt-1 leading-tight">{label}</div>
    </div>
  );
}

export function ScriptBox({ text, onCopy }: { text: string, onCopy: (text: string, e: React.MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <div className="script-box">
      <button className="copy-btn absolute top-2 right-2 bg-bg4 border border-border2 rounded-[var(--r2)] px-2 py-1 text-[11px] text-text2 cursor-pointer hover:bg-border hover:text-text-main transition-all" onClick={(e) => onCopy(text, e)}>Copy</button>
      <div className="script-text text-[13px] text-text2 leading-relaxed italic pr-12">{text}</div>
    </div>
  );
}

export function MilestoneItem({ id, checked, onToggle, color, title, body, tag }: { id: string, checked: boolean, onToggle: () => void, color: string, title: string, body: string, tag: string }) {
  return (
    <div className="tl-item">
      <div className="tl-dot" style={{ backgroundColor: color }}></div>
      <div className="flex justify-between items-start">
        <div className="tl-title text-[14px] font-medium text-text-main">{title}</div>
        <div className={`check-box shrink-0 ml-3 ${checked ? 'checked' : ''}`} onClick={onToggle}></div>
      </div>
      <div className="tl-body text-[13px] text-text2 leading-relaxed mt-1">{body}</div>
      <div className="tl-tag text-[11px] bg-bg4 text-text3 px-2 py-[2px] rounded-full inline-block mt-2">{tag}</div>
    </div>
  );
}

export function Rung({ num, id, current, open, onToggle, title, body, detail }: { num: string, id: string, current: boolean, open: boolean, onToggle: () => void, title: string, body: string, detail: string }) {
  return (
    <div className={`rung ${current ? 'current' : ''} ${open ? 'open' : ''}`} onClick={onToggle}>
      <div className={`rung-num ${current ? 'text-teal' : 'text-text3'}`}>{num}</div>
      <div>
        <div className="rung-title text-[14px] font-medium text-text-main mb-1">{title}</div>
        <div className="rung-body text-[13px] text-text2 leading-relaxed">{body}</div>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="rung-detail text-[12px] text-text3 mt-2 pt-2 border-t border-border leading-relaxed"
          >
            {detail}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function BottomNavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <div className={`bnav-item flex flex-col items-center gap-1 p-1 cursor-pointer flex-1 rounded-[var(--r2)] transition-colors ${active ? 'bg-bg3' : ''}`} onClick={onClick}>
      <div className={`bnav-svg ${active ? 'text-teal' : 'text-text3'}`}>{icon}</div>
      <span className={`bnav-lbl text-[10px] ${active ? 'text-teal' : 'text-text3'}`}>{label}</span>
    </div>
  );
}
