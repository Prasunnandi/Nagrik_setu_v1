'use client';
// components/Header.tsx

import { MessageSquare, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

interface Props {
  mobileView: 'chat' | 'dashboard';
  onToggleMobileView: () => void;
  complaintCount: number;
  onActiveClick?: () => void;
}

export default function Header({ mobileView, onToggleMobileView, complaintCount, onActiveClick }: Props) {
  const [dark, setDark] = useState(false);
  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <header
      className="h-14 flex items-center justify-between px-4 flex-shrink-0 z-10"
      style={{ background: 'var(--ns-ink)', borderBottom: '1px solid rgba(247,242,232,.08)' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--ns-sf)' }}
        >
          <span
            className="text-white text-xs font-bold leading-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            नस
          </span>
        </div>
        <div>
          <div
            className="text-sm font-bold leading-none"
            style={{ fontFamily: "'Playfair Display', serif", color: '#F7F2E8' }}
          >
            नागरिक सेतु
          </div>
          <div className="text-[9.5px] leading-none mt-0.5 tracking-widest"
            style={{ color: 'rgba(247,242,232,.38)' }}>
            NAGRIK SETU · CIVIC AI
          </div>
        </div>
      </div>

      {/* Centre tagline (desktop only) */}
      <div className="hidden lg:block">
        <span
          className="text-xs tracking-wide"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: 'rgba(247,242,232,.42)' }}
        >
          Hum sirf report nahi karte — hum fix karate hain
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onActiveClick}
          className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 transition-opacity hover:opacity-80"
          style={{ background: 'rgba(224,96,10,.18)', border: '1px solid rgba(224,96,10,.30)', cursor: onActiveClick ? 'pointer' : 'default' }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--ns-sf)' }} />
          <span
            className="text-xs font-bold tracking-wide"
            style={{ color: '#FF9C60', fontFamily: "'Space Mono', monospace" }}
          >
            {complaintCount} ACTIVE
          </span>
        </button>

        <button
          onClick={toggleDark}
          data-demo="dark-mode-toggle"
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(247,242,232,.07)', border: '1px solid rgba(247,242,232,.12)' }}
        >
          {dark
            ? <Sun size={14} style={{ color: 'rgba(247,242,232,.55)' }} />
            : <Moon size={14} style={{ color: 'rgba(247,242,232,.55)' }} />}
        </button>

        <button
          onClick={onToggleMobileView}
          className="md:hidden flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
          style={{ background: 'var(--ns-sf)', color: '#fff' }}
        >
          {mobileView === 'chat'
            ? <><LayoutDashboard size={13} /> Dashboard</>
            : <><MessageSquare size={13} /> Chat</>}
        </button>
      </div>
    </header>
  );
}
