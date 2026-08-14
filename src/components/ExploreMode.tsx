import React, { useState } from 'react';
import { InteractiveClock } from './InteractiveClock';
import { DigitalDisplay } from './DigitalDisplay';
import { ClockSettings } from '../types';
import { Eye, Clock, Layers, Sparkles, Volume2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { formatArabicSpokenTime } from '../utils/timeFormatters';

interface ExploreModeProps {
  hours: number;
  minutes: number;
  seconds: number;
  onChangeTime: (hours: number, minutes: number) => void;
  settings: ClockSettings;
  onUpdateSettings: (newSettings: Partial<ClockSettings>) => void;
}

export const ExploreMode: React.FC<ExploreModeProps> = ({
  hours,
  minutes,
  seconds,
  onChangeTime,
  settings,
  onUpdateSettings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'fractions' | 'daily' | 'hours'>('fractions');

  const fractionPresets = [
    { label: 'تماماً (:00)', h: 4, m: 0, desc: 'عقرب الدقائق الأزرق على 12' },
    { label: 'والرُّبْع (:15)', h: 4, m: 15, desc: 'عقرب الدقائق الأزرق على 3' },
    { label: 'والثُّلُث (:20)', h: 4, m: 20, desc: 'عقرب الدقائق الأزرق على 4' },
    { label: 'والنِّصْف (:30)', h: 4, m: 30, desc: 'عقرب الدقائق الأزرق على 6' },
    { label: 'إلا ثُلُثاً (:40)', h: 4, m: 40, desc: 'عقرب الدقائق الأزرق على 8' },
    { label: 'إلا رُبْعاً (:45)', h: 4, m: 45, desc: 'عقرب الدقائق الأزرق على 9' },
  ];

  const dailyPresets = [
    { label: 'الاستيقاظ 🌅', h: 6, m: 30, desc: 'السادسة والنصف صباحاً' },
    { label: 'بداية الدوام 🏫', h: 8, m: 0, desc: 'الثامنة تماماً صباحاً' },
    { label: 'استراحة اللمجة 🥪', h: 10, m: 15, desc: 'العاشرة والربع صباحاً' },
    { label: 'وجبة الغداء 🍽️', h: 12, m: 30, desc: 'الثانية عشرة والنصف بعد الظهر' },
    { label: 'أداء الواجبات 🎒', h: 16, m: 30, desc: 'الرابعة والنصف مساءً' },
    { label: 'النوم المبكر 🌙', h: 20, m: 45, desc: 'التاسعة إلا ربعاً ليلاً' },
  ];

  const hourPresets = [
    { label: '1:00', h: 1, m: 0 },
    { label: '2:00', h: 2, m: 0 },
    { label: '3:00', h: 3, m: 0 },
    { label: '4:00', h: 4, m: 0 },
    { label: '5:00', h: 5, m: 0 },
    { label: '6:00', h: 6, m: 0 },
    { label: '7:00', h: 7, m: 0 },
    { label: '8:00', h: 8, m: 0 },
    { label: '9:00', h: 9, m: 0 },
    { label: '10:00', h: 10, m: 0 },
    { label: '11:00', h: 11, m: 0 },
    { label: '12:00', h: 12, m: 0 },
  ];

  const applyPreset = (h: number, m: number) => {
    sounds.playClick();
    if (settings.isLiveTime) {
      onUpdateSettings({ isLiveTime: false });
    }
    onChangeTime(h, m);
    // Speak time automatically for clear pronunciation
    const spoken = formatArabicSpokenTime(h, m, true, true);
    sounds.speakArabic(spoken);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left Column: The Interactive Clock Face */}
      <div className="w-full lg:w-[460px] bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col items-center">
        {/* Helper Note for Kids */}
        <div className="w-full flex items-center justify-between text-xs font-bold text-slate-500 mb-2 px-1">
          <span className="flex items-center gap-1.5 text-amber-700">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>حرّك العقارب مباشرة بإصبعك أو بالفأرة:</span>
          </span>
          {settings.isLiveTime && (
            <span className="bg-emerald-100 text-emerald-800 text-[11px] px-2.5 py-0.5 rounded-full font-black animate-pulse">
              ساعة حية الآن 🔴
            </span>
          )}
        </div>

        {/* The Clock Component */}
        <InteractiveClock
          hours={hours}
          minutes={minutes}
          seconds={settings.isLiveTime ? seconds : undefined}
          interactive={!settings.isLiveTime}
          onChangeTime={onChangeTime}
          showMinuteRing={settings.showMinuteNumbers}
          showFractionsOverlay={settings.showFractionsOverlay}
          showHandLabels={settings.showHandNames}
          size={340}
        />

        {/* Visual Layer Toggles for 2nd Grade */}
        <div className="w-full mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-black text-slate-700">
          <button
            onClick={() => {
              sounds.playClick();
              onUpdateSettings({ showMinuteNumbers: !settings.showMinuteNumbers });
            }}
            className={`p-2.5 rounded-2xl border flex items-center justify-center gap-1.5 transition ${
              settings.showMinuteNumbers
                ? 'bg-blue-50 border-blue-300 text-blue-800'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>أرقام الدقائق (:05-:55)</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onUpdateSettings({ showFractionsOverlay: !settings.showFractionsOverlay });
            }}
            className={`p-2.5 rounded-2xl border flex items-center justify-center gap-1.5 transition ${
              settings.showFractionsOverlay
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ألوان الأرباع والأنصاف</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onUpdateSettings({ isLiveTime: !settings.isLiveTime });
            }}
            className={`p-2.5 rounded-2xl border flex items-center justify-center gap-1.5 transition col-span-2 sm:col-span-1 ${
              settings.isLiveTime
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{settings.isLiveTime ? 'إيقاف الوقت الفعلي' : 'الوقت الحقيقي الآن'}</span>
          </button>
        </div>
      </div>

      {/* Right Column: Digital Display & Quick Presets */}
      <div className="w-full lg:flex-1 flex flex-col gap-5">
        <DigitalDisplay
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          onChangeTime={onChangeTime}
        />

        {/* Quick Presets / Learning Cards */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100 flex-wrap">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <span>أوقات نموذجية للتجربة والاستماع:</span>
            </h3>

            {/* Category tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-black">
              <button
                onClick={() => setSelectedCategory('fractions')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  selectedCategory === 'fractions'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                أجزاء الساعة (الربع/النصف)
              </button>
              <button
                onClick={() => setSelectedCategory('daily')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  selectedCategory === 'daily'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                أوقات اليوم المدرسي
              </button>
              <button
                onClick={() => setSelectedCategory('hours')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  selectedCategory === 'hours'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الساعات التامة (:00)
              </button>
            </div>
          </div>

          {/* Preset Buttons Grid */}
          {selectedCategory === 'fractions' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {fractionPresets.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(item.h, item.m)}
                  className="text-right p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100 border border-amber-200/80 transition flex flex-col gap-1 group active:scale-95 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm group-hover:text-amber-800">
                      {item.label}
                    </span>
                    <Volume2 className="w-4 h-4 text-amber-600 opacity-60 group-hover:opacity-100" />
                  </div>
                  <span className="text-xs text-slate-600 font-semibold">{item.desc}</span>
                </button>
              ))}
            </div>
          )}

          {selectedCategory === 'daily' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {dailyPresets.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(item.h, item.m)}
                  className="text-right p-3 rounded-2xl bg-sky-50/70 hover:bg-sky-100 border border-sky-200/80 transition flex flex-col gap-1 group active:scale-95 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm group-hover:text-sky-800">
                      {item.label}
                    </span>
                    <Volume2 className="w-4 h-4 text-sky-600 opacity-60 group-hover:opacity-100" />
                  </div>
                  <span className="text-xs text-slate-600 font-semibold">{item.desc}</span>
                </button>
              ))}
            </div>
          )}

          {selectedCategory === 'hours' && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {hourPresets.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(item.h, item.m)}
                  className="py-3 px-3 rounded-2xl bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-center font-black text-slate-800 hover:text-amber-800 transition active:scale-95 cursor-pointer flex flex-col items-center gap-0.5"
                >
                  <span>الساعة {item.label}</span>
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

