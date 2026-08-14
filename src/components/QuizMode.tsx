import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { InteractiveClock } from './InteractiveClock';
import { sounds } from '../utils/soundEffects';
import { formatArabicSpokenTime } from '../utils/timeFormatters';
import { QuizQuestion } from '../types';
import { Star, CheckCircle, XCircle, ArrowLeft, RotateCcw, HelpCircle, Volume2 } from 'lucide-react';

interface QuizModeProps {
  onEarnStar: () => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({ onEarnStar }) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const generateQuizQuestion = useCallback((lvl: number): QuizQuestion => {
    const id = `q-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    let h = Math.floor(Math.random() * 12) + 1;
    let m = 0;

    if (lvl === 1) {
      // Grade 2 Level 1: On the hour (00) or half past (30)
      m = Math.random() > 0.5 ? 0 : 30;
    } else if (lvl === 2) {
      // Grade 2 Level 2: Quarters (00, 15, 30, 45)
      const options = [0, 15, 30, 45];
      m = options[Math.floor(Math.random() * options.length)];
    } else {
      // Grade 2 Level 3: 5-minute increments & thirds
      const options = [5, 10, 15, 20, 30, 40, 45, 50];
      m = options[Math.floor(Math.random() * options.length)];
    }

    const correctSpoken = formatArabicSpokenTime(h, m, false, false);
    const correctPhonetic = formatArabicSpokenTime(h, m, false, true);

    // Build 3 plausible distractor answers for Grade 2
    const distractors: string[] = [];

    // Distractor 1: Next hour with same minutes
    const wrongH1 = (h % 12) + 1;
    distractors.push(formatArabicSpokenTime(wrongH1, m, false, false));

    // Distractor 2: Different minute fraction with same hour
    const diffMinutes = [0, 15, 30, 45, 20].filter((min) => min !== m);
    const wrongM = diffMinutes[Math.floor(Math.random() * diffMinutes.length)] || (m === 0 ? 30 : 0);
    distractors.push(formatArabicSpokenTime(h, wrongM, false, false));

    // Distractor 3: Hour & fraction shift
    const wrongH3 = (h + 2) % 12 || 12;
    distractors.push(formatArabicSpokenTime(wrongH3, (m === 30 ? 0 : 30), false, false));

    // Unique list of 4 options
    const uniqueOptions = Array.from(new Set([correctSpoken, ...distractors])).slice(0, 4);

    // Shuffle options
    const shuffled = uniqueOptions
      .map((text, i) => {
        const isCorr = text === correctSpoken;
        return {
          id: `opt-${i}`,
          text,
          spokenText: isCorr ? correctPhonetic : text,
          isCorrect: isCorr,
        };
      })
      .sort(() => Math.random() - 0.5);

    const explanation = `عَقْرَبُ السَّاعَاتِ (الأَحْمَر القَصِير) يُشِيرُ إِلَى ${h}، وَعَقْرَبُ الدَّقَائِقِ (الأَزْرَق الطَّوِيل) يُشِيرُ إِلَى ${
      m === 0 ? 'الرقم 12 أَيْ (تَمَاماً)' : m === 15 ? 'الرقم 3 أَيْ (وَالرُّبْع)' : m === 30 ? 'الرقم 6 أَيْ (وَالنِّصْف)' : m === 45 ? 'الرقم 9 أَيْ (إِلَّا رُبْعاً)' : `الدَّقِيقَة ${m}`
    }، فَتَكُونُ السَّاعَةُ: ${correctSpoken}.`;

    return {
      id,
      targetHours: h,
      targetMinutes: m,
      questionPrompt: 'كَمْ تُشِيرُ السَّاعَةُ فِي الرَّسْمِ الْمُجَاوِر؟',
      spokenPrompt: 'كَمْ تُشِيرُ السَّاعَةُ فِي الرَّسْمِ الْمُجَاوِر؟ اِخْتَرِ الْإِجَابَةَ الصَّحِيحَةَ.',
      options: shuffled,
      explanation,
      spokenExplanation: explanation,
    };
  }, []);

  const nextQuestion = useCallback(() => {
    const q = generateQuizQuestion(selectedLevel);
    setCurrentQuestion(q);
    setSelectedOptionId(null);
    setIsAnswered(false);
    // Speak the question prompt
    sounds.speakArabic('كَمْ تُشِيرُ السَّاعَةُ فِي الرَّسْمِ الْمُجَاوِر؟ اِخْتَرِ الْإِجَابَةَ الصَّحِيحَةَ.');
  }, [generateQuizQuestion, selectedLevel]);

  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  const handleSelectOption = (optionId: string, isCorrect: boolean, optText: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);
    setQuestionCount((c) => c + 1);

    if (isCorrect) {
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
      sounds.playCorrect();
      sounds.speakCheer(true);
      onEarnStar();

      try {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }
    } else {
      setStreak(0);
      sounds.playWrong();
      sounds.speakCheer(false);
    }
  };

  const handleSpeakOption = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    sounds.speakArabic(text);
  };

  const handleSpeakExplanation = () => {
    if (currentQuestion) {
      sounds.speakArabic(currentQuestion.explanation);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left Column: Clock Question Face */}
      <div className="w-full lg:w-[460px] bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
          <span className="text-amber-700">انظر إلى عقارب الساعة بتركيز ⏱️</span>
          <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-black">
            السؤال رقم: {questionCount + 1}
          </span>
        </div>

        {currentQuestion && (
          <InteractiveClock
            hours={currentQuestion.targetHours}
            minutes={currentQuestion.targetMinutes}
            interactive={false}
            showMinuteRing={selectedLevel === 3}
            showHandLabels={true}
            size={340}
          />
        )}

        {/* Level Switcher */}
        <div className="w-full mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
          <div className="text-xs font-bold text-slate-500">اختر مستوى الأسئلة (السنة 2):</div>
          <div className="grid grid-cols-3 gap-2 text-xs font-black">
            {[
              { id: 1, label: '1. تماماً ونصف' },
              { id: 2, label: '2. ربع وإلا ربعاً' },
              { id: 3, label: '3. كل 5 دقائق' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedLevel(lvl.id);
                }}
                className={`py-2 px-2 rounded-2xl transition text-center active:scale-95 cursor-pointer ${
                  selectedLevel === lvl.id
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

      {/* Right Column: Multiple Choice Options & Explanation */}
      <div className="w-full lg:flex-1 flex flex-col gap-4">
        {/* Header Stats */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3.5 py-1.5 rounded-2xl border border-amber-200 text-sm font-black">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>النقاط: {score}</span>
            </div>
            {streak > 1 && (
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-2xl border border-emerald-200 text-sm font-black animate-pulse">
                <span>متتالي: {streak} 🔥</span>
              </div>
            )}
          </div>

          <button
            onClick={nextQuestion}
            className="flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-2xl transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تخطي السؤال</span>
          </button>
        </div>

        {/* Question & Options */}
        {currentQuestion && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <span>{currentQuestion.questionPrompt}</span>
              </h3>

              <button
                onClick={() => sounds.speakArabic(currentQuestion.questionPrompt)}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer"
                title="استمع للسؤال"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentQuestion.options.map((opt) => {
                let btnClass = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
                let icon = null;

                if (isAnswered) {
                  if (opt.isCorrect) {
                    btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-black shadow-xs';
                    icon = <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />;
                  } else if (selectedOptionId === opt.id && !opt.isCorrect) {
                    btnClass = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                    icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                  } else {
                    btnClass = 'opacity-50 bg-slate-50 border-slate-200 text-slate-400';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id, opt.isCorrect, opt.text)}
                    disabled={isAnswered}
                    className={`p-4 rounded-2xl border-2 text-right text-base md:text-lg transition-all flex items-center justify-between gap-3 active:scale-[0.99] cursor-pointer ${btnClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => handleSpeakOption(e, opt.text)}
                        className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 shadow-xs border border-slate-200"
                        title="استمع للخيار"
                      >
                        <Volume2 className="w-4 h-4 text-amber-600" />
                      </button>
                      <span className="font-black">{opt.text}</span>
                    </div>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next Question Button */}
            {isAnswered && (
              <div className="mt-2 pt-4 border-t border-slate-100 flex flex-col gap-3">
                <div className="bg-blue-50 text-blue-900 p-4 rounded-2xl border border-blue-200 text-sm font-bold leading-relaxed flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-blue-950">💡 الشرح التوضيحي للسنة الثانية:</span>
                    <button
                      onClick={handleSpeakExplanation}
                      className="flex items-center gap-1 text-xs font-black bg-blue-100 hover:bg-blue-200 text-blue-900 px-2.5 py-1 rounded-xl transition cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>استمع للشرح</span>
                    </button>
                  </div>
                  <div>{currentQuestion.explanation}</div>
                </div>

                <button
                  id="quiz-next-question-btn"
                  onClick={nextQuestion}
                  className="w-full py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-base shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>السؤال التالي</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

