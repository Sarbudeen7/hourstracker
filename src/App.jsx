import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricsOverview from './components/MetricsOverview';
import TimelineGrid from './components/TimelineGrid';
import AuditModal from './components/AuditModal';
import OutputVault from './components/OutputVault';
import { 
  getTodayKey, 
  loadDayData, 
  saveDayData, 
  loadStreak, 
  saveStreak 
} from './utils/storage';
import { ShieldAlert, Zap, AlertTriangle } from 'lucide-react';

export default function App() {
  const [currentDate, setCurrentDate] = useState(getTodayKey());
  const [dayData, setDayData] = useState(() => loadDayData(getTodayKey()));
  const [streak, setStreak] = useState(() => loadStreak());
  const [activeModalBlockId, setActiveModalBlockId] = useState(null);

  // When date changes, reload data
  useEffect(() => {
    const loaded = loadDayData(currentDate);
    setDayData(loaded);
  }, [currentDate]);

  // Save changes whenever dayData changes
  const handleUpdateBlock = (blockId, updatedFields) => {
    setDayData((prev) => {
      const nextBlocks = {
        ...prev.blocks,
        [blockId]: {
          ...prev.blocks[blockId],
          ...updatedFields
        }
      };
      const nextData = { ...prev, blocks: nextBlocks };
      saveDayData(nextData, currentDate);

      // Check if this counts toward streak
      const hasAnyOutput = Object.values(nextBlocks).some(
        (b) => b.status === 'creator' && b.outputProof && b.outputProof.trim().length > 0
      );
      if (hasAnyOutput && streak.lastLoggedDate !== currentDate) {
        const nextStreak = {
          currentStreak: streak.currentStreak + 1,
          bestStreak: Math.max(streak.bestStreak, streak.currentStreak + 1),
          lastLoggedDate: currentDate
        };
        setStreak(nextStreak);
        saveStreak(nextStreak);
      }

      return nextData;
    });

    setActiveModalBlockId(null);
  };

  const activeBlockForModal = activeModalBlockId ? dayData.blocks[activeModalBlockId] : null;

  // Detect any ghost hours (past hours today that are unlogged)
  const now = new Date();
  const currentHourNum = now.getHours();
  const isToday = currentDate === getTodayKey();
  
  const ghostHours = isToday ? Object.values(dayData.blocks).filter(
    (b) => !b.isRecharge && currentHourNum > b.startHour && b.status === 'unlogged'
  ) : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Header */}
      <Header
        dayData={dayData}
        streak={streak}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Ghost Hour Warning Banner */}
        {ghostHours.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-red-300 font-mono">
                  {ghostHours.length} UNACCOUNTED "GHOST" HOUR{ghostHours.length > 1 ? 'S' : ''} DETECTED
                </h4>
                <p className="text-xs text-zinc-400">
                  Time has expired with no output registered. In this protocol, unaccounted time counts as complete failure.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveModalBlockId(ghostHours[0].id)}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-black text-xs font-mono font-bold shrink-0 transition"
            >
              CONFRONT HOUR ({ghostHours[0].label}) &rarr;
            </button>
          </div>
        )}

        {/* High-Density Metrics */}
        <MetricsOverview 
          dayData={dayData} 
          onOpenAutopsy={(blockId) => setActiveModalBlockId(blockId)}
        />

        {/* 16-Hour Execution Matrix */}
        <TimelineGrid
          dayData={dayData}
          onOpenAudit={(blockId) => setActiveModalBlockId(blockId)}
        />

        {/* The Compounding Output Vault */}
        <OutputVault dayData={dayData} />
      </main>

      {/* Audit Interrogation Modal */}
      {activeBlockForModal && (
        <AuditModal
          block={activeBlockForModal}
          onClose={() => setActiveModalBlockId(null)}
          onSave={handleUpdateBlock}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs font-mono text-zinc-600">
        OUTPUT 40 &bull; 19 YEARS OF HIGH-DENSITY EXECUTION &bull; COMPRESS 40 YEARS OF WORK &bull; ZERO DAYS OFF
      </footer>
    </div>
  );
}
