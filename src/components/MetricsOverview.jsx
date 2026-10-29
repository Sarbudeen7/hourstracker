import React from 'react';
import { Hammer, Tv, AlertTriangle, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function MetricsOverview({ dayData, onOpenAutopsy }) {
  const blocks = Object.values(dayData.blocks || {});
  const activeBlocks = blocks.filter((b) => !b.isRecharge);

  const creatorHours = activeBlocks.filter((b) => b.status === 'creator').length;
  const consumerHours = activeBlocks.filter((b) => b.status === 'consumer' || b.status === 'wasted').length;
  const unloggedHours = activeBlocks.filter((b) => b.status === 'unlogged').length;

  const totalLogged = creatorHours + consumerHours;
  const creatorRatio = totalLogged > 0 ? Math.round((creatorHours / totalLogged) * 100) : 0;
  
  // Output density multiplier: (creatorHours * 2.5) / 8 typical hours
  const dailyMultiplier = ((creatorHours * 2.2) / 8).toFixed(1);

  // Unresolved autopsies (hours that are wasted/consumer without a filled failureReason)
  const pendingAutopsies = activeBlocks.filter(
    (b) => (b.status === 'wasted' || b.status === 'consumer') && (!b.failureReason || b.failureReason.trim() === '')
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* 1. Real Output Hours */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
          <span>PROVEN OUTPUT</span>
          <Hammer className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">{creatorHours}</span>
            <span className="text-sm text-zinc-500 font-mono">/ 16 Target Hrs</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (creatorHours / 16) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Creator vs Consumer Ratio */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
          <span>CREATOR VS CONSUMER</span>
          <TrendingUp className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${creatorRatio >= 75 ? 'text-emerald-400' : creatorRatio >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {creatorRatio}%
            </span>
            <span className="text-xs text-zinc-500 font-mono">Creator Mode</span>
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            {consumerHours > 0 ? (
              <span className="text-red-400">{consumerHours} wasted / consumer hrs</span>
            ) : (
              <span className="text-zinc-500">Zero consumer distraction</span>
            )}
          </p>
        </div>
      </div>

      {/* 3. Output Compression Multiplier */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
          <span>SPEED MULTIPLIER</span>
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-400">{dailyMultiplier}x</span>
            <span className="text-xs text-zinc-500 font-mono">Normal Person Pace</span>
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Compressing 40 yrs of progress into 19 yrs
          </p>
        </div>
      </div>

      {/* 4. Failure Autopsy Alert */}
      <div className={`border rounded-xl p-4 flex flex-col justify-between transition-colors ${
        pendingAutopsies.length > 0 
          ? 'bg-red-950/20 border-red-800/80' 
          : 'bg-zinc-900/60 border-zinc-800'
      }`}>
        <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
          <span>FAILURE AUTOPSY</span>
          <ShieldAlert className={`w-4 h-4 ${pendingAutopsies.length > 0 ? 'text-red-400 animate-pulse' : 'text-zinc-500'}`} />
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${pendingAutopsies.length > 0 ? 'text-red-400' : 'text-zinc-400'}`}>
              {pendingAutopsies.length}
            </span>
            <span className="text-xs text-zinc-500 font-mono">Pending Reports</span>
          </div>
          <p className="text-xs mt-2">
            {pendingAutopsies.length > 0 ? (
              <button
                onClick={() => onOpenAutopsy(pendingAutopsies[0].id)}
                className="text-red-400 hover:text-red-300 underline font-semibold flex items-center gap-1"
              >
                Document why you failed &rarr;
              </button>
            ) : (
              <span className="text-zinc-500">All failed hours accounted for</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
