import React, { useState } from 'react';
import { 
  X, 
  Hammer, 
  Tv, 
  XCircle, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Youtube,
  Monitor
} from 'lucide-react';

export default function AuditModal({ block, onClose, onSave }) {
  const [plannedGoal, setPlannedGoal] = useState(block.plannedGoal || '');
  const [status, setStatus] = useState(block.status === 'unlogged' ? 'creator' : block.status);
  const [outputProof, setOutputProof] = useState(block.outputProof || '');
  const [goalAligned, setGoalAligned] = useState(block.goalAligned ?? true);
  const [watchedMedia, setWatchedMedia] = useState(block.watchedMedia || false);
  const [mediaJustification, setMediaJustification] = useState(block.mediaJustification || '');
  const [appOpened, setAppOpened] = useState(block.appOpened || '');
  const [failureReason, setFailureReason] = useState(block.failureReason || '');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ruthless rule: If creator, outputProof must not be empty!
    if (status === 'creator' && (!outputProof || outputProof.trim().length < 5)) {
      alert("RUTHLESS AUDIT FAILED:\nYou selected 'Creator', but provided no physical proof of output. Either write what physically exists, or mark this hour as Failed.");
      return;
    }

    // Ruthless rule: If failed/consumer, failureReason must be documented!
    if ((status === 'consumer' || status === 'wasted') && (!failureReason || failureReason.trim().length < 5)) {
      alert("AUTOPSY MANDATORY:\nYou cannot clear a failed hour without documenting WHY you failed and what distracted you.");
      return;
    }

    onSave(block.id, {
      plannedGoal,
      status,
      outputProof: status === 'creator' ? outputProof : '',
      goalAligned,
      watchedMedia,
      mediaJustification: watchedMedia ? mediaJustification : '',
      appOpened: (status === 'consumer' || status === 'wasted') ? appOpened : '',
      failureReason: (status === 'consumer' || status === 'wasted') ? failureReason : '',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900/95 backdrop-blur z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold uppercase border border-amber-500/30">
                Hourly Interrogation
              </span>
              <span className="text-xs font-mono text-zinc-400">{block.label}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Accountability Check
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Target Goal */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              1. Target Goal for this Hour
            </label>
            <input
              type="text"
              value={plannedGoal}
              onChange={(e) => setPlannedGoal(e.target.value)}
              placeholder="e.g. Build React Modal component, study graph algorithms..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Mode Selector: Creator vs Consumer vs Wasted */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              2. Reality Verdict: Did you Create or Consume?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setStatus('creator')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition ${
                  status === 'creator'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Hammer className="w-5 h-5 mb-1.5 text-emerald-400" />
                <span className="font-bold text-sm">CREATOR</span>
                <span className="text-[11px] opacity-75 mt-0.5">Real output exists</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('consumer')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition ${
                  status === 'consumer'
                    ? 'bg-amber-950/40 border-amber-500 text-amber-300 ring-1 ring-amber-500/50'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Tv className="w-5 h-5 mb-1.5 text-amber-400" />
                <span className="font-bold text-sm">CONSUMER</span>
                <span className="text-[11px] opacity-75 mt-0.5">Passive watching/reading</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('wasted')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition ${
                  status === 'wasted'
                    ? 'bg-red-950/40 border-red-500 text-red-300 ring-1 ring-red-500/50'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <XCircle className="w-5 h-5 mb-1.5 text-red-400" />
                <span className="font-bold text-sm">DRIFTED / WASTED</span>
                <span className="text-[11px] opacity-75 mt-0.5">Distracted / 0 output</span>
              </button>
            </div>
          </div>

          {/* If Creator: Tangible Output Proof */}
          {status === 'creator' && (
            <div className="space-y-4 bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1.5">
                  Physical Output Proof (Mandatory)
                </label>
                <textarea
                  rows={3}
                  value={outputProof}
                  onChange={(e) => setOutputProof(e.target.value)}
                  placeholder="Describe what physically exists now that didn't exist an hour ago: e.g., 'Implemented storage utility in React, tested localStorage save/load, zero compiler bugs.'"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-emerald-950">
                <span className="text-zinc-300">Does this output get you closer to your 40-year mission?</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGoalAligned(true)}
                    className={`px-3 py-1 rounded text-xs font-bold ${
                      goalAligned ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoalAligned(false)}
                    className={`px-3 py-1 rounded text-xs font-bold ${
                      !goalAligned ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    NO (DRIFT)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* YouTube / Media Reality Check */}
          <div className="border border-zinc-800/80 rounded-xl p-4 bg-zinc-950/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                <span className="text-xs font-mono uppercase font-bold text-zinc-300">
                  Media & Video Surveillance Check
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
                <input
                  type="checkbox"
                  checked={watchedMedia}
                  onChange={(e) => setWatchedMedia(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0"
                />
                Watched Video / Reels
              </label>
            </div>

            {watchedMedia && (
              <div className="mt-2 space-y-2">
                <label className="block text-[11px] font-mono text-amber-400">
                  Ruthless Video Audit: Was this video 100% required practice, or entertainment scroll?
                </label>
                <input
                  type="text"
                  value={mediaJustification}
                  onChange={(e) => setMediaJustification(e.target.value)}
                  placeholder="e.g., 'Watched 10m tutorial on Tailwind v4 CSS imports to fix build error' or 'Fell into YouTube recommendations trap'"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* If Consumer or Wasted: Mandatory Failure Autopsy */}
          {(status === 'consumer' || status === 'wasted') && (
            <div className="space-y-4 bg-red-950/20 border border-red-900/60 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-xs uppercase">
                <ShieldAlert className="w-4 h-4" />
                Mandatory Failure Autopsy
              </div>
              <p className="text-xs text-zinc-400">
                You cannot erase this hour. Document the brutal truth so you do not repeat it.
              </p>

              <div>
                <label className="block text-[11px] font-mono text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-red-400" />
                  What application was opened on your computer?
                </label>
                <input
                  type="text"
                  value={appOpened}
                  onChange={(e) => setAppOpened(e.target.value)}
                  placeholder="e.g. Chrome (YouTube Shorts), Discord, Twitter/X, Netflix..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-300 mb-1">
                  Why is the output blank? (Confess the cause of failure):
                </label>
                <textarea
                  rows={2}
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  placeholder="e.g. 'Lost discipline after dinner, clicked one video and spiraled for 45 minutes with zero code written.'"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold bg-amber-400 text-zinc-950 hover:bg-amber-300 transition flex items-center gap-1.5 shadow-lg shadow-amber-950/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              LOCK IN TRUTH
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
