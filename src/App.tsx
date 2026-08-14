import React, { useState, useEffect } from 'react';
import { AppMode, ClockSettings } from './types';
import { Header } from './components/Header';
import { ExploreMode } from './components/ExploreMode';
import { SetClockGame } from './components/SetClockGame';
import { QuizMode } from './components/QuizMode';
import { DailyRoutineMode } from './components/DailyRoutineMode';
import { LearnGuideModal } from './components/LearnGuideModal';
import { CertificateModal } from './components/CertificateModal';
import { sounds } from './utils/soundEffects';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('explore');
  const [starsCount, setStarsCount] = useState<number>(() => {
    const saved = localStorage.getItem('clock_stars');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Time State
  const [hours, setHours] = useState<number>(4);
  const [minutes, setMinutes] = useState<number>(15);
  const [seconds, setSeconds] = useState<number>(0);

  // Settings
  const [settings, setSettings] = useState<ClockSettings>({
    showMinuteNumbers: true,
    show24Hours: false,
    showFractionsOverlay: false,
    showHandNames: true,
    soundEnabled: true,
    isLiveTime: false,
  });

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isCertOpen, setIsCertOpen] = useState<boolean>(false);

  // Synchronize Live Clock if enabled
  useEffect(() => {
    if (!settings.isLiveTime) return;

    const syncWithSystem = () => {
      const now = new Date();
      setHours(now.getHours());
      setMinutes(now.getMinutes());
      setSeconds(now.getSeconds());
    };

    syncWithSystem();
    const interval = setInterval(syncWithSystem, 1000);
    return () => clearInterval(interval);
  }, [settings.isLiveTime]);

  const handleEarnStar = () => {
    setStarsCount((prev) => {
      const updated = prev + 1;
      localStorage.setItem('clock_stars', updated.toString());
      return updated;
    });
  };

  const handleUpdateSettings = (newPartial: Partial<ClockSettings>) => {
    setSettings((prev) => ({ ...prev, ...newPartial }));
  };

  const handleToggleSound = () => {
    const newSoundState = !settings.soundEnabled;
    sounds.enabled = newSoundState;
    setSettings((prev) => ({ ...prev, soundEnabled: newSoundState }));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-['Tajawal',sans-serif]">
      {/* Top Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        starsCount={starsCount}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenCertificate={() => setIsCertOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {currentMode === 'explore' && (
          <ExploreMode
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            onChangeTime={(h, m) => {
              setHours(h);
              setMinutes(m);
            }}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {currentMode === 'set-clock' && (
          <SetClockGame
            onEarnStar={handleEarnStar}
          />
        )}

        {currentMode === 'quiz' && (
          <QuizMode
            onEarnStar={handleEarnStar}
          />
        )}

        {currentMode === 'routine' && (
          <DailyRoutineMode
            onEarnStar={handleEarnStar}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-4 px-6 text-center text-xs text-slate-600 font-bold">
        <p>ساعتي التفاعلية - التعلم الممتع - سميرة عبد الصدوق -جميع الحقوق محفوظة</p>
      </footer>

      {/* Illustrated Guide Modal */}
      <LearnGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        starsCount={starsCount}
      />
    </div>
  );
}
