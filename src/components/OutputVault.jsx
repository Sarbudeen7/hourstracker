import React, { useState } from 'react';
import { Hammer, Copy, Check, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

export default function OutputVault({ dayData }) {
  const [copied, setCopied] = useState(false);
  const blocks = Object.values(dayData.blocks || {});
  
  const completedOutputs = blocks.filter((b) => b.status === 'creator' && b.outputProof);
  const documentedFailures = blocks.filter((b) => (b.status === 'consumer' || b.status === 'wasted') && b.failureReason);

  const handleCopyReceipt = () => {
    let receiptText = `🔥 OUTPUT 40 RECEIPT [${dayData.date}]\n`;
    receiptText += `Target: 16 High-Density Hours | 40-in-19 Protocol\n`;
    receiptText += `Total Output Hours: ${completedOutputs.length} / 16\n\n`;
    
    receiptText += `=== PROVEN PHYSICAL OUTPUTS ===\n`;
    if (completedOutputs.length === 0) {
      receiptText += `No outputs recorded today.\n`;
    } else {
      completedOutputs.forEach((item, idx) => {
        receiptText += `${idx + 1}. [${item.label}] ${item.plannedGoal ? `(${item.plannedGoal})` : ''}\n   Proof: ${item.outputProof}\n`;
      });
    }

    if (documentedFailures.length > 0) {
      receiptText += `\n=== FAILURE AUTOPSIES ===\n`;
      documentedFailures.forEach((item, idx) => {
        receiptText += `${idx + 1}. [${item.label}] App: ${item.appOpened || 'Unknown'}\n   Reason: ${item.failureReason}\n`;
      });
    }

    navigator.clipboard.writeText(receiptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Hammer className="w-4 h-4 text-emerald-400" />
            The Daily Output Vault (Proof Ledger)
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Undeniable evidence of what was produced today. No excuses, no illusions.
          </p>
        </div>

        <button
          onClick={handleCopyReceipt}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition border border-zinc-700/60 w-fit"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>COPIED TO CLIPBOARD</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>COPY DAILY RECEIPT</span>
            </>
          )}
        </button>
      </div>

      {/* Output items */}
      <div className="mt-4 space-y-3">
        {completedOutputs.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-xs font-mono">
            Zero output logged yet today. Win the next hour and record your proof!
          </div>
        ) : (
          completedOutputs.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-zinc-950/70 border border-emerald-950/60 flex items-start gap-3"
            >
              <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="font-bold text-emerald-400">{item.label}</span>
                  {item.plannedGoal && (
                    <span className="text-zinc-400 truncate">({item.plannedGoal})</span>
                  )}
                </div>
                <p className="text-xs text-zinc-200 mt-1 font-mono bg-zinc-900/60 p-2 rounded border border-zinc-800/60">
                  {item.outputProof}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Documented Failures Section */}
      {documentedFailures.length > 0 && (
        <div className="mt-6 pt-5 border-t border-zinc-800/80">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 mb-3">
            <ShieldAlert className="w-4 h-4" />
            <span>DOCUMENTED FAILURE AUTOPSIES ({documentedFailures.length})</span>
          </div>
          <div className="space-y-2.5">
            {documentedFailures.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-red-950/20 border border-red-900/40 text-xs font-mono"
              >
                <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-1">
                  <span className="text-red-400 font-bold">{item.label}</span>
                  <span>Distracting App: <strong className="text-zinc-200">{item.appOpened || 'Unspecified'}</strong></span>
                </div>
                <p className="text-zinc-300 italic">"{item.failureReason}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
