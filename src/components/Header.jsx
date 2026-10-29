import React from 'react';
import { Flame, Target, ShieldAlert, Zap, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { TARGET_YEAR, BIRTH_YEAR } from '../constants/defaultData';

export default function Header({ dayData, streak, currentDate, onDateChange }) {
  // Calculate remaining days until target year (approx)
  const now = new Date();
  const targetDate = new Date(TARGET_YEAR, 0, 1);
  const diffTime = targetDate - now;
  const daysLeft = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const currentAge = now.getFullYear() - BIRTH_YEAR;

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur sticky top-0 z-30">
      {/* Top Ruthless Mission Bar */}
      <div className="bg-gradient-to-r from-amber-950/40 via-red-950/30 to-zinc-950 border-b border-amber-500/20 px-4 py-2 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold tracking-wider uppercase border border-amber-500/30">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              THE 40-IN-19 PROTOCOL
            </span>
            <span className="text-zinc-400 hidden sm:inline">
              Age <strong className="text-zinc-200">{currentAge}</strong> &rarr; Target Age <strong className="text-amber-400">40</strong> (Year {TARGET_YEAR})
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span><strong className="text-white font-bold">{daysLeft.toLocaleString()}</strong> days left to compress 40 yrs of output</span>
            </div>
            <div className="h-3 w-px bg-zinc-800 hidden md:block" />
            <div className="flex items-center gap-1 text-orange-400 font-semibold">
              <Flame className="w-3.5 h-3.5 animate-pulse text-orange-500" />
              <span>STREAK: {streak.currentStreak} DAYS (NO DAYS OFF)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Title & Date Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              OUTPUT <span className="text-amber-400">40</span>
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-mono">
              16h High-Density Engine
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Output either physically exists or the hour is marked failed. No passive consumption.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 rounded-lg p-1.5">
          <CalendarIcon className="w-4 h-4 text-amber-400 ml-2" />
          <input
            type="date"
            value={currentDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent text-sm text-zinc-200 font-mono focus:outline-none pr-2 cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
}
