import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Edit3, 
  Tv, 
  Hammer, 
  Moon, 
  ChevronRight,
  ShieldAlert,
  Flame
} from 'lucide-react';

export default function TimelineGrid({ dayData, onOpenAudit, onQuickUpdateGoal }) {
  const now = new Date();
  const currentHourNum = now.getHours();

  const blocks = Object.values(dayData.blocks || {});
  const activeBlocks = blocks.filter((b) => !b.isRecharge);
  const rechargeBlock = blocks.find((b) => b.isRecharge);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            16-Hour Execution Arena
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Every hour must yield a physical output receipt. Empty hours count as failed.
          </p>
        </div>
        <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" /> Output
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 ml-2" /> Wasted
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-zinc-600 ml-2" /> Unlogged
        </div>
      </div>

      {/* Grid of 16 execution hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeBlocks.map((block) => {
          const isCurrent = currentHourNum === block.startHour;
          const isPast = currentHourNum > block.startHour;
          const isGhost = isPast && block.status === 'unlogged';

          return (
            <div
              key={block.id}
              onClick={() => onOpenAudit(block.id)}
              className={`group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                isCurrent 
                  ? 'ring-2 ring-amber-400/80 bg-zinc-900/90 border-amber-500/50 shadow-lg shadow-amber-950/20' 
                  : isGhost
                  ? 'bg-red-950/20 border-red-900/80 hover:border-red-600'
                  : block.status === 'creator'
                  ? 'bg-zinc-900/80 border-emerald-900/60 hover:border-emerald-600/80'
                  : block.status === 'consumer' || block.status === 'wasted'
                  ? 'bg-zinc-900/80 border-red-900/60 hover:border-red-600/80'
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Header of Block */}
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-200">{block.label}</span>
                  {isCurrent && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase border border-amber-500/40 animate-pulse">
                      NOW
                    </span>
                  )}
                  {isGhost && (
                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px] uppercase border border-red-500/40">
                      GHOST HOUR
                    </span>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-1.5">
                  {block.status === 'creator' && (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded text-[11px]">
                      <Hammer className="w-3 h-3" /> OUTPUT VERIFIED
                    </span>
                  )}
                  {(block.status === 'consumer' || block.status === 'wasted') && (
                    <span className="flex items-center gap-1 text-red-400 font-bold bg-red-950/60 border border-red-800/80 px-2 py-0.5 rounded text-[11px]">
                      <XCircle className="w-3 h-3" /> FAILED / CONSUMER
                    </span>
                  )}
                  {block.status === 'unlogged' && (
                    <span className="text-zinc-500 text-[11px]">Click to Audit &rarr;</span>
                  )}
                </div>
              </div>

              {/* Planned Target */}
              <div className="mb-2">
                <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono">Target Goal</div>
                <div className="text-sm font-semibold text-zinc-200 truncate">
                  {block.plannedGoal || <span className="text-zinc-600 italic">No target set for this hour</span>}
                </div>
              </div>

              {/* Verified Output or Autopsy Snippet */}
              {block.status === 'creator' && block.outputProof && (
                <div className="mt-2.5 p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs">
                  <span className="text-emerald-400 font-bold font-mono text-[10px] uppercase block mb-0.5">Physical Proof</span>
                  <p className="text-zinc-300 line-clamp-2">{block.outputProof}</p>
                </div>
              )}

              {(block.status === 'consumer' || block.status === 'wasted') && (
                <div className="mt-2.5 p-2 rounded-lg bg-red-950/30 border border-red-900/50 text-xs">
                  <span className="text-red-400 font-bold font-mono text-[10px] uppercase block mb-0.5 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Failure Autopsy
                  </span>
                  <p className="text-zinc-300 line-clamp-2">
                    {block.failureReason || <span className="text-red-400/80 italic font-medium">Autopsy not written yet. Document why you failed!</span>}
                  </p>
                </div>
              )}

              {isGhost && (
                <div className="mt-2 text-xs text-red-400/90 font-mono flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Time expired with no output registered. Face the interrogation.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 8-Hour Biological Recovery Chamber */}
      {rechargeBlock && (
        <div 
          onClick={() => onOpenAudit(rechargeBlock.id)}
          className="mt-6 rounded-xl border border-indigo-950 bg-gradient-to-r from-indigo-950/30 via-zinc-900 to-indigo-950/30 p-4 cursor-pointer hover:border-indigo-800 transition"
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Moon className="w-4 h-4" />
              <span>THE 8-HOUR RECHARGE CHAMBER (10:00 PM – 06:00 AM)</span>
            </div>
            <span className="text-zinc-500">Biological Recovery Protocol</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1.5">
            Sleep is not passive entertainment—it is biological fuel so tomorrow’s 16 hours operate at maximum processing speed.
          </p>
          {rechargeBlock.outputProof && (
            <div className="mt-2 text-xs text-indigo-300 bg-indigo-950/50 p-2 rounded border border-indigo-900/60">
              Recovery Notes: {rechargeBlock.outputProof}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
