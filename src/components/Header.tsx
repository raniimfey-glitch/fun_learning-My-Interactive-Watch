import React from 'react';
import { AppMode } from '../types';
import { Clock, Gamepad2, HelpCircle, Calendar, BookOpen, Award, Volume2, VolumeX, Star, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  starsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenGuide: () => void;
  onOpenCertificate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  starsCount,
  soundEnabled,
  onToggleSound,
  onOpenGuide,
  onOpenCertificate,
}) => {
  const modes: { id: AppMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'explore', label: 'استكشف وتعلّم', icon: Clock },
    { id: 'set-clock', label: 'لعبة: اضبط الساعة', icon: Gamepad2 },
    { id: 'quiz', label: 'مسابقة: ما هو الوقت؟', icon: HelpCircle },
    { id: 'routine', label: 'أوقاتي اليومية', icon: Calendar },
  ];

  const handleSpeakWelcome = () => {
    sounds.speakArabic('مَرْحَباً بِكَ فِي دَرْسِ السَّاعَةِ لِلسَّنَةِ الثَّانِيَةِ اِبْتِدَائِي! هَيَّا نَتَعَلَّمْ قِرَاءَةَ السَّاعَةِ مَعاً.');
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-amber-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
        {/* Top bar: Title, Badge, Star Counter & Actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeakWelcome}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition cursor-pointer"
              title="اضغط للاستماع للترحيب الصوتي"
            >
              <Clock className="w-6 h-6 animate-pulse" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-none flex items-center gap-2">
                <span>ساعتي التفاعلية</span>
                <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                  السنة الثانية ابتدائي
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-bold mt-0.5 flex items-center gap-1">
                <span>تعلّم قراءة وضبط عقارب الساعة صوتياً بنطق عربي سليم ودقيق</span>
              </p>
            </div>
          </div>

          {/* Right Action Tools: Guide, Certificate, Sound, Stars */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Guide Button */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenGuide();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-black transition shadow-xs"
              title="دليل الدرس المصور"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">دليل الدرس</span>
            </button>

            {/* Certificate Button */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCertificate();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition shadow-xs"
              title="وسام بطل الوقت"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">لوحة الإنجاز</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                onToggleSound();
              }}
              className={`p-2 rounded-xl border transition ${
                soundEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
              title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت والمساعد الصوتي'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Stars Counter */}
            <div className="flex items-center gap-1.5 bg-amber-500 text-white px-3.5 py-1.5 rounded-xl shadow-xs text-xs font-black">
              <Star className="w-4 h-4 fill-white text-white animate-bounce" />
              <span>{starsCount} نجمة</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 scrollbar-none">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = currentMode === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectMode(mode.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm transition shrink-0 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 scale-[1.02]'
                    : 'bg-slate-100/90 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

