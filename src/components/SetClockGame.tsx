import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { InteractiveClock } from './InteractiveClock';
import { sounds } from '../utils/soundEffects';
import { formatArabicSpokenTime, formatDigitalTime } from '../utils/timeFormatters';
import { CheckCircle2, RotateCcw, HelpCircle, Star, Award, Sparkles, ArrowLeft, Volume2 } from 'lucide-react';

interface SetClockGameProps {
  onEarnStar: () => void;
}

interface Challenge {
  hours: number;
  minutes: number;
  promptText: string;
  phoneticPrompt: string;
  hintText: string;
  level: number;
}

export const SetClockGame: React.FC<SetClockGameProps> = ({ onEarnStar }) => {
  const [level, setLevel] = useState<number>(1);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [userHours, setUserHours] = useState<number>(12);
  const [userMinutes, setUserMinutes] = useState<number>(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const generateChallenge = useCallback((currentLevel: number): Challenge => {
    let h = Math.floor(Math.random() * 12) + 1;
    let m = 0;

    if (currentLevel === 1) {
      // Grade 2 Level 1: On the hour (00) & half past (30)
      m = Math.random() > 0.5 ? 0 : 30;
    } else if (currentLevel === 2) {
      // Grade 2 Level 2: Quarters (00, 15, 30, 45)
      const minOptions = [0, 15, 30, 45];
      m = minOptions[Math.floor(Math.random() * minOptions.length)];
    } else {
      // Grade 2 Level 3: 5-minute multiples & thirds (05, 10, 15, 20, 30, 40, 45, 50)
      const minOptions = [5, 10, 15, 20, 30, 40, 45, 50];
      m = minOptions[Math.floor(Math.random() * minOptions.length)];
    }

    const spoken = formatArabicSpokenTime(h, m, false, false);
    const phonetic = formatArabicSpokenTime(h, m, false, true);

    const prompt = `اضْبُطِ السَّاعَةَ عَلَى: ${spoken}`;
    const phoneticPrompt = `اِضْبُطِ السَّاعَةَ عَلَى: ${phonetic}`;

    const hint = `ضَعْ عَقْرَبَ السَّاعَاتِ (الأَحْمَر القَصِير) عِنْدَ الرَّقْمِ ${h}، وَعَقْرَبَ الدَّقَائِقِ (الأَزْرَق الطَّوِيل) عِنْدَ ${
      m === 0 ? 'الرقم 12 (:00)' : `الرقم ${m / 5} (:${m.toString().padStart(2, '0')})`
    }`;

    return {
      hours: h,
      minutes: m,
      promptText: prompt,
      phoneticPrompt,
      hintText: hint,
      level: currentLevel,
    };
  }, []);

  const speakPrompt = useCallback((phoneticText: string) => {
    setIsSpeaking(true);
    sounds.speakArabic(phoneticText, () => {
      setIsSpeaking(false);
    });
    setTimeout(() => setIsSpeaking(false), 3000);
  }, []);

  const loadNewChallenge = useCallback((lvl: number) => {
    const ch = generateChallenge(lvl);
    setCurrentChallenge(ch);
    // Randomize initial clock hands
    let randH = Math.floor(Math.random() * 12) + 1;
    if (randH === ch.hours) randH = (randH % 12) + 1;
    setUserHours(randH);
    setUserMinutes(0);
    setFeedback('idle');
    setShowHint(false);
    // Speak challenge on load
    speakPrompt(ch.phoneticPrompt);
  }, [generateChallenge, speakPrompt]);

  useEffect(() => {
    loadNewChallenge(level);
  }, [level, loadNewChallenge]);

  const checkAnswer = () => {
    if (!currentChallenge) return;

    const targetH12 = currentChallenge.hours % 12 === 0 ? 12 : currentChallenge.hours % 12;
    const userH12 = userHours % 12 === 0 ? 12 : userHours % 12;

    const minuteDiff = Math.abs(userMinutes - currentChallenge.minutes);
    const isMinCorrect = minuteDiff === 0 || minuteDiff === 60;
    const isHourCorrect = userH12 === targetH12;

    if (isMinCorrect && isHourCorrect) {
      setFeedback('correct');
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
      sounds.playCorrect();
      sounds.speakCheer(true);
      onEarnStar();

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti fallback
      }
    } else {
      setFeedback('wrong');
      setStreak(0);
      sounds.playWrong();
      sounds.speakCheer(false);
    }
  };

  const handleNext = () => {
    sounds.playClick();
    loadNewChallenge(level);
  };

  const userDigital = formatDigitalTime(userHours, userMinutes);
  const userSpoken = formatArabicSpokenTime(userHours, userMinutes, false, false);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left Column: Clock to Adjust */}
      <div className="w-full lg:w-[460px] bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
          <span className="text-amber-700">حرّك العقارب لتطابق المطلوب 🎯</span>
          <span className="font-mono bg-slate-100 px-2.5 py-1 rounded-xl text-slate-800 font-black">
            الساعة الآن: {userDigital.time12} ({userSpoken})
          </span>
        </div>

        <InteractiveClock
          hours={userHours}
          minutes={userMinutes}
          onChangeTime={(h, m) => {
            setUserHours(h);
            setUserMinutes(m);
            if (feedback !== 'idle') setFeedback('idle');
          }}
          showMinuteRing={true}
          showHandLabels={true}
          highlightTarget={showHint && currentChallenge ? { hours: currentChallenge.hours, minutes: currentChallenge.minutes } : null}
          size={340}
        />

        {/* Level Selector */}
        <div className="w-full mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
          <div className="text-xs font-bold text-slate-500">اختر مستوى التحدي (السنة 2):</div>
          <div className="grid grid-cols-3 gap-2 text-xs font-black">
            {[
              { id: 1, label: 'مستوى 1: تماماً (:00) ونصف (:30)' },
              { id: 2, label: 'مستوى 2: والربع (:15) وإلا ربعاً (:45)' },
              { id: 3, label: 'مستوى 3: كل 5 دقائق والأثلاث' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => {
                  sounds.playClick();
                  setLevel(lvl.id);
                }}
                className={`py-2 px-2.5 rounded-2xl transition text-center active:scale-95 cursor-pointer ${
                  level === lvl.id
                    ? 'bg-amber-500 text-white shadow-xs font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Mission Card & Feedback */}
      <div className="w-full lg:flex-1 flex flex-col gap-4">
        {/* Score & Streak Header */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3.5 py-1.5 rounded-2xl border border-amber-200 text-sm font-black">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>النقاط: {score}</span>
            </div>
            {streak > 1 && (
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-2xl border border-emerald-200 text-sm font-black animate-pulse">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>إجابات متتالية: {streak} 🔥</span>
              </div>
            )}
          </div>

          <button
            onClick={() => loadNewChallenge(level)}
            className="flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-2xl transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>سؤال آخر</span>
          </button>
        </div>

        {/* The Mission Question Box */}
        {currentChallenge && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-700 font-black text-sm">
                <Award className="w-5 h-5" />
                <span>المهمة المطلوبة للسنة الثانية:</span>
              </div>

              <button
                onClick={() => speakPrompt(currentChallenge.phoneticPrompt)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition border shadow-xs ${
                  isSpeaking
                    ? 'bg-amber-500 text-white border-amber-400 animate-pulse'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
                title="إعادة نطق السؤال صوتياً"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isSpeaking ? 'يجري النطق...' : 'استمع للسؤال 🔊'}</span>
              </button>
            </div>

            <div className="text-xl md:text-2xl font-black text-slate-900 leading-relaxed bg-amber-50/80 p-5 rounded-2xl border-2 border-amber-200 text-center sm:text-right">
              {currentChallenge.promptText}
            </div>

            {/* Hint toggler */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowHint(!showHint);
                }}
                className="self-start flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{showHint ? 'إخفاء التلميح' : 'أحتاج تلميحاً لمكان العقارب 💡'}</span>
              </button>

              {showHint && (
                <div className="text-sm font-bold text-blue-900 bg-blue-50 p-3.5 rounded-2xl border border-blue-200 animate-fadeIn leading-relaxed">
                  💡 {currentChallenge.hintText}
                </div>
              )}
            </div>

            {/* Action Buttons: Check Answer or Next */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              {feedback === 'idle' && (
                <button
                  id="check-clock-answer-btn"
                  onClick={checkAnswer}
                  className="flex-1 py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-black text-base shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>تحقق من إجابتي 🚀</span>
                </button>
              )}

              {feedback === 'correct' && (
                <div className="w-full flex flex-col gap-3">
                  <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-900 rounded-2xl border-2 border-emerald-300 font-black text-base animate-bounce">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <span>أَحْسَنْتَ يَا بَطَل! إِجَابَةٌ صَحِيحَةٌ تَمَاماً 🎉 (+10 نقاط)</span>
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>السؤال التالي</span>
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </div>
              )}

              {feedback === 'wrong' && (
                <div className="w-full flex flex-col gap-3">
                  <div className="p-4 bg-rose-50 text-rose-900 rounded-2xl border-2 border-rose-300 font-bold text-sm">
                    <span>حاول مرة أخرى! انظر إلى مكان عقرب الساعات (الأحمر) وعقرب الدقائق (الأزرق) جيداً 🧐</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={checkAnswer}
                      className="flex-1 py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm transition cursor-pointer active:scale-95"
                    >
                      إعادة التحقق
                    </button>
                    <button
                      onClick={() => setShowHint(true)}
                      className="py-3.5 px-4 rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-800 font-black text-sm transition cursor-pointer active:scale-95"
                    >
                      عرض التلميح 💡
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

