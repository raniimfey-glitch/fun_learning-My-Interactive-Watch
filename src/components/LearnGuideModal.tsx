import React, { useState } from 'react';
import { X, BookOpen, Clock, PieChart, Layers, Volume2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface LearnGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LearnGuideModal: React.FC<LearnGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'hands' | 'basic' | 'fractions' | 'multiples'>('hands');

  if (!isOpen) return null;

  const handleSpeakTab = (text: string) => {
    sounds.speakArabic(text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black">دليل درس الساعة (السنة الثانية ابتدائي) 📖</h2>
              <p className="text-xs text-amber-100 font-bold">
                شرح مبسط ومصوّر مع القراءة الصوتية الواضحة
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guide Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'hands', label: '1. عقارب الساعة', icon: Clock },
            { id: 'basic', label: '2. تماماً (:00) والنِّصْف (:30)', icon: Layers },
            { id: 'fractions', label: '3. الرُّبْع (:15) وإلا رُبْعاً (:45)', icon: PieChart },
            { id: 'multiples', label: '4. قراءة الدقائق (5 في 5)', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-black transition shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {activeTab === 'hands' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-black text-slate-900">
                  ما هي عقارب الساعة ذات الأرقام؟
                </h3>
                <button
                  onClick={() =>
                    handleSpeakTab(
                      'تَتَكَوَّنُ السَّاعَةُ مِنْ عَقْرَبَيْنِ رَئِيسِيَّيْنِ: عَقْرَبُ السَّاعَاتِ القَصِير بِاللَّوْنِ الأَحْمَر، وَعَقْرَبُ الدَّقَائِقِ الطَّوِيل بِاللَّوْنِ الأَزْرَق.'
                    )
                  }
                  className="flex items-center gap-1 text-xs font-black text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-xl border border-amber-200 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>استمع للشرح 🔊</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-red-800 font-black text-base">
                    <span className="w-4 h-4 rounded-full bg-red-600"></span>
                    <span>1. عقرب الساعات (القصير - أحمر)</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                    هو العقرب <strong>الأقصر والأسمك</strong>، ويشير إلى رقم الساعة الحالية (مثلاً: 1، 2، 3...). يتحرك ببطء ويدل على الساعة.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-blue-800 font-black text-base">
                    <span className="w-4 h-4 rounded-full bg-blue-600"></span>
                    <span>2. عقرب الدقائق (الطويل - أزرق)</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                    هو العقرب <strong>الأطول والأنحف</strong>، ويشير إلى عدد الدقائق. عندما يشير إلى الرقم 12 تكون الساعة تماماً، وعندما يشير إلى 6 تكون الساعة والنصف.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <p className="text-sm font-black text-amber-900 leading-relaxed">
                  قاعدة ذهبية: <strong>الساعة الواحدة فيها 60 دقيقة</strong>. ونصف الساعة فيها <strong>30 دقيقة</strong>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-black text-slate-900">
                  الساعة تماماً (:00) والساعة والنصف (:30)
                </h3>
                <button
                  onClick={() =>
                    handleSpeakTab(
                      'عِنْدَمَا يَكُونُ عَقْرَبُ الدَّقَائِقِ الأَزْرَق عَلَى الرَّقْمِ اِثْنَيْ عَشَرَ نَقُولُ تَمَاماً، مِثْلَ: السَّاعَةُ الثَّالِثَةُ تَمَاماً. وَعِنْدَمَا يَكُونُ عَلَى الرَّقْمِ سِتَّة نَقُولُ وَالنِّصْف، مِثْلَ: السَّاعَةُ الثَّالِثَةُ وَالنِّصْف.'
                    )
                  }
                  className="flex items-center gap-1 text-xs font-black text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-xl border border-amber-200 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>استمع للشرح 🔊</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 flex flex-col gap-2">
                  <div className="font-black text-sky-900 text-base">الساعة تماماً (:00)</div>
                  <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                    عقرب الدقائق يشير إلى <strong>الرقم 12</strong>.
                    <br />
                    مثال: <strong>04:00</strong> تُقرأ: «السَّاعَةُ الرَّابِعَةُ تَمَاماً».
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex flex-col gap-2">
                  <div className="font-black text-emerald-900 text-base">الساعة والنصف (:30)</div>
                  <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                    عقرب الدقائق يشير إلى <strong>الرقم 6</strong>.
                    <br />
                    مثال: <strong>04:30</strong> تُقرأ: «السَّاعَةُ الرَّابِعَةُ وَالنِّصْف».
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fractions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-black text-slate-900">
                  قراءة الأرباع: والرُّبْع (:15) وإلا رُبْعاً (:45)
                </h3>
                <button
                  onClick={() =>
                    handleSpeakTab(
                      'عِنْدَمَا يَكُونُ عَقْرَبُ الدَّقَائِقِ عَلَى الرَّقْمِ ثَلَاثَة نَقُولُ وَالرُّبْع، أَيْ خَمْسَ عَشْرَةَ دَقِيقَة. وَعِنْدَمَا يَكُونُ عَلَى الرَّقْمِ تِسْعَة نَقُولُ إِلَّا رُبْعاً، أَيْ خَمْسٌ وَأَرْبَعُونَ دَقِيقَة.'
                    )
                  }
                  className="flex items-center gap-1 text-xs font-black text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-xl border border-amber-200 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>استمع للشرح 🔊</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-yellow-50 border-2 border-yellow-200">
                  <div className="font-black text-yellow-900 text-base mb-1">والرُّبْع (:15)</div>
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    عقرب الدقائق الأزرق على <strong>الرقم 3</strong> (مرت 15 دقيقة).
                    <br />
                    مثال: <strong>08:15</strong> تُقرأ: «السَّاعَةُ الثَّامِنَةُ وَالرُّبْع».
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200">
                  <div className="font-black text-rose-900 text-base mb-1">إلا رُبْعاً (:45)</div>
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    عقرب الدقائق الأزرق على <strong>الرقم 9</strong> (بقي ربع ساعة لتكتمل الساعة التالية).
                    <br />
                    مثال: <strong>07:45</strong> تُقرأ: «السَّاعَةُ الثَّامِنَةُ إِلَّا رُبْعاً».
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'multiples' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-black text-slate-900">
                  العد بالخمسات لقراءة دقائق الساعة 🎯
                </h3>
                <button
                  onClick={() =>
                    handleSpeakTab(
                      'كُلُّ رَقْمٍ عَلَى السَّاعَةِ يُمَثِّلُ خَمْسَ دَقَائِق. الرَّقْمُ وَاحِد هُوَ خَمْسُ دَقَائِق، وَالرَّقْمُ اِثْنَان هُوَ عَشْرُ دَقَائِق، وَالرَّقْمُ ثَلَاثَة هُوَ خَمْسَ عَشْرَةَ دَقِيقَة.'
                    )
                  }
                  className="flex items-center gap-1 text-xs font-black text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-xl border border-amber-200 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>استمع للشرح 🔊</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { num: 1, min: '05 دقيقة', label: 'وخمس دقائق' },
                  { num: 2, min: '10 دقائق', label: 'وعشر دقائق' },
                  { num: 3, min: '15 دقيقة', label: 'والرُّبْع' },
                  { num: 4, min: '20 دقيقة', label: 'والثُّلُث' },
                  { num: 5, min: '25 دقيقة', label: 'ونصف إلا خمس' },
                  { num: 6, min: '30 دقيقة', label: 'والنِّصْف' },
                  { num: 9, min: '45 دقيقة', label: 'إلا رُبْعاً' },
                  { num: 12, min: '00 دقيقة', label: 'تَمَاماً' },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col gap-0.5"
                  >
                    <span className="text-xs font-black text-slate-500">الرقم {item.num}</span>
                    <span className="text-sm font-black text-blue-700 font-mono">{item.min}</span>
                    <span className="text-[11px] font-bold text-amber-800">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm transition cursor-pointer active:scale-95"
          >
            فهمت الشرح، هيا نلعب ونتعلم! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

