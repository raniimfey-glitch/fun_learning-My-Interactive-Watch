import React, { useState } from 'react';
import { Volume2, Sun, Moon, Sunrise, Sunset, Plus, Minus, Sparkles } from 'lucide-react';
import { formatArabicSpokenTime, formatDigitalTime, getPeriodOfDay } from '../utils/timeFormatters';
import { sounds } from '../utils/soundEffects';

interface DigitalDisplayProps {
  hours: number;
  minutes: number;
  seconds?: number;
  onChangeTime: (hours: number, minutes: number) => void;
}

export const DigitalDisplay: React.FC<DigitalDisplayProps> = ({
  hours,
  minutes,
  seconds = 0,
  onChangeTime,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const digital = formatDigitalTime(hours, minutes, seconds);
  const periodInfo = getPeriodOfDay(hours);
  const spokenPhrase = formatArabicSpokenTime(hours, minutes, true, false);
  const phoneticPhrase = formatArabicSpokenTime(hours, minutes, true, true);

  const handleSpeak = () => {
    setIsSpeaking(true);
    sounds.speakArabic(phoneticPhrase, () => {
      setIsSpeaking(false);
    });
    // Safety timeout in case onend is delayed
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  const adjustHours = (delta: number) => {
    sounds.playClick();
    const newH = (hours + delta + 24) % 24;
    onChangeTime(newH, minutes);
  };

  const adjustMinutes = (delta: number) => {
    sounds.playClick();
    let totalMinutes = hours * 60 + minutes + delta;
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    totalMinutes = totalMinutes % (24 * 60);

    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    onChangeTime(newH, newM);
  };

  const toggleAmPm = () => {
    sounds.playClick();
    const newH = (hours + 12) % 24;
    onChangeTime(newH, minutes);
  };

  const renderPeriodIcon = () => {
    switch (periodInfo.icon) {
      case 'morning':
        return <Sunrise className="w-5 h-5 text-amber-500" />;
      case 'afternoon':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'evening':
        return <Sunset className="w-5 h-5 text-orange-500" />;
      case 'night':
        return <Moon className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col gap-4">
      {/* Top Banner: Period of Day */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-amber-50 border border-amber-200">
            {renderPeriodIcon()}
          </div>
          <div>
            <div className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <span>فترة اليوم:</span>
              <span className="text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md font-bold">
                {periodInfo.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{periodInfo.subText}</p>
          </div>
        </div>

        {/* AM / PM Toggle */}
        <button
          onClick={toggleAmPm}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition border border-slate-200"
          title="تبديل الفترة بين صباحاً ومساءً"
        >
          <span>التبديل إلى:</span>
          <span className="text-amber-700 font-extrabold">{digital.isPm ? 'صباحاً (ص)' : 'مساءً (م)'}</span>
        </button>
      </div>

      {/* Big Digital Display Box */}
      <div className="flex flex-col items-center justify-center py-4 px-4 bg-slate-900 text-white rounded-2xl shadow-inner border-2 border-slate-700 relative overflow-hidden">
        <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
          <span>الساعة الرقمية (السنة الثانية)</span>
        </div>

        <div className="flex items-baseline justify-center gap-3 font-mono mt-2">
          {/* Main Digits */}
          <div className="text-5xl md:text-6xl font-black tracking-wider text-amber-400 drop-shadow">
            {digital.time12}
          </div>

          {/* AM / PM indicator */}
          <div className="text-sm md:text-base font-black px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700">
            {digital.isPm ? 'مساءً' : 'صباحاً'}
          </div>
        </div>
      </div>

      {/* Arabic Spoken Time Box with Diacritics & Prominent TTS */}
      <div className="bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex-1 text-center sm:text-right">
          <div className="text-xs text-amber-900 font-bold mb-1 flex items-center justify-center sm:justify-start gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>نطق وقراءة الساعة بالعربية الفصحى (مُشكَّلة):</span>
          </div>
          <div className="text-lg md:text-xl font-black text-slate-900 leading-snug">
            {spokenPhrase}
          </div>
        </div>

        <button
          id="listen-arabic-time-btn"
          onClick={handleSpeak}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm md:text-base font-black transition-all shadow-md active:scale-95 shrink-0 ${
            isSpeaking
              ? 'bg-amber-500 text-white animate-pulse ring-4 ring-amber-300'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
          title="استمع إلى نطق الساعة صوتياً"
        >
          <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
          <span>{isSpeaking ? 'يجري النطق...' : 'استمع للساعة 🔊'}</span>
        </button>
      </div>

      {/* Step Adjustment Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {/* Hours Stepper */}
        <div className="flex items-center justify-between bg-red-50 p-2 rounded-2xl border border-red-200">
          <button
            onClick={() => adjustHours(-1)}
            className="w-8 h-8 rounded-xl bg-red-100 hover:bg-red-200 active:scale-95 text-red-700 flex items-center justify-center font-black transition"
            title="إنقاص ساعة"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-red-900">ساعة (1±)</span>
          <button
            onClick={() => adjustHours(1)}
            className="w-8 h-8 rounded-xl bg-red-100 hover:bg-red-200 active:scale-95 text-red-700 flex items-center justify-center font-black transition"
            title="زيادة ساعة"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 15 Minutes Stepper (Quarters) */}
        <div className="flex items-center justify-between bg-blue-50 p-2 rounded-2xl border border-blue-200">
          <button
            onClick={() => adjustMinutes(-15)}
            className="w-8 h-8 rounded-xl bg-blue-100 hover:bg-blue-200 active:scale-95 text-blue-700 flex items-center justify-center font-black transition"
            title="إنقاص ربع ساعة (15 د)"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-blue-900">ربع ساعة (15±)</span>
          <button
            onClick={() => adjustMinutes(15)}
            className="w-8 h-8 rounded-xl bg-blue-100 hover:bg-blue-200 active:scale-95 text-blue-700 flex items-center justify-center font-black transition"
            title="زيادة ربع ساعة (15 د)"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Minutes Stepper */}
        <div className="flex items-center justify-between bg-emerald-50 p-2 rounded-2xl border border-emerald-200">
          <button
            onClick={() => adjustMinutes(-5)}
            className="w-8 h-8 rounded-xl bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-700 flex items-center justify-center font-black transition"
            title="إنقاص 5 دقائق"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-emerald-900">5 دقائق (5±)</span>
          <button
            onClick={() => adjustMinutes(5)}
            className="w-8 h-8 rounded-xl bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-700 flex items-center justify-center font-black transition"
            title="زيادة 5 دقائق"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 1 Minute Stepper */}
        <div className="flex items-center justify-between bg-purple-50 p-2 rounded-2xl border border-purple-200">
          <button
            onClick={() => adjustMinutes(-1)}
            className="w-8 h-8 rounded-xl bg-purple-100 hover:bg-purple-200 active:scale-95 text-purple-700 flex items-center justify-center font-black transition"
            title="إنقاص دقيقة"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-purple-900">دقيقة (1±)</span>
          <button
            onClick={() => adjustMinutes(1)}
            className="w-8 h-8 rounded-xl bg-purple-100 hover:bg-purple-200 active:scale-95 text-purple-700 flex items-center justify-center font-black transition"
            title="زيادة دقيقة"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

