import React, { useState } from 'react';
import { InteractiveClock } from './InteractiveClock';
import { sounds } from '../utils/soundEffects';
import { formatArabicSpokenTime, formatDigitalTime } from '../utils/timeFormatters';
import { DailyRoutineItem } from '../types';
import { Sun, School, Coffee, BookOpen, Home, Moon, Utensils, Award, Volume2 } from 'lucide-react';

interface DailyRoutineModeProps {
  onEarnStar: () => void;
}

const ROUTINE_ITEMS: DailyRoutineItem[] = [
  {
    id: 'wake',
    title: 'الاستيقاظ والنشاط 🌅',
    description: 'أَسْتَيْقِظُ مُبَكِّراً بِنَشَاطٍ، وَأَغْسِلُ وَجْهِي وَأَسْنَانِي، وَأُرَتِّبُ سَرِيرِي.',
    spokenDescription: 'أَسْتَيْقِظُ مُبَكِّراً بِنَشَاطٍ، وَأَغْسِلُ وَجْهِي وَأَسْنَانِي، وَأُرَتِّبُ سَرِيرِي.',
    defaultHours: 6,
    defaultMinutes: 30,
    period: 'morning',
    iconName: 'Sun',
  },
  {
    id: 'breakfast',
    title: 'وجبة الفطور 🥛',
    description: 'أَتَنَاوَلُ فُطُورِي الصِّحِّيَّ مَعَ الْحَلِيبِ لِأَكُونَ قَوِيّاً وَذَكِيّاً فِي الْمَدْرَسَةِ.',
    spokenDescription: 'أَتَنَاوَلُ فُطُورِي الصِّحِّيَّ مَعَ الْحَلِيبِ لِأَكُونَ قَوِيّاً وَذَكِيّاً فِي الْمَدْرَسَةِ.',
    defaultHours: 7,
    defaultMinutes: 15,
    period: 'morning',
    iconName: 'Coffee',
  },
  {
    id: 'school-start',
    title: 'بداية الدروس الصباحية 🏫',
    description: 'أَصِلُ إِلَى الْمَدْرَسَةِ بِنَشَاطٍ، وَأَقِفُ فِي الطَّابُورِ ثُمَّ أَدْخُلُ الْقِسْمَ.',
    spokenDescription: 'أَصِلُ إِلَى الْمَدْرَسَةِ بِنَشَاطٍ، وَأَقِفُ فِي الطَّابُورِ ثُمَّ أَدْخُلُ الْقِسْمَ.',
    defaultHours: 8,
    defaultMinutes: 0,
    period: 'morning',
    iconName: 'School',
  },
  {
    id: 'recess',
    title: 'استراحة اللمجة واللعب 🥪',
    description: 'أَتَنَاوَلُ لُمْجَتِي اللَّذِيذَةَ وَأَلْعَبُ مَعَ زُمَلائِي فِي سَاحَةِ الْمَدْرَسَةِ.',
    spokenDescription: 'أَتَنَاوَلُ لُمْجَتِي اللَّذِيذَةَ وَأَلْعَبُ مَعَ زُمَلائِي فِي سَاحَةِ الْمَدْرَسَةِ.',
    defaultHours: 10,
    defaultMinutes: 15,
    period: 'morning',
    iconName: 'Coffee',
  },
  {
    id: 'lunch',
    title: 'وجبة الغداء 🍽️',
    description: 'أَتَنَاوَلُ طَعَامَ الْغَدَاءِ اللَّذِيذَ مَعَ الْعَائِلَةِ فِي مُنْتَصَفِ النَّهَارِ.',
    spokenDescription: 'أَتَنَاوَلُ طَعَامَ الْغَدَاءِ اللَّذِيذَ مَعَ الْعَائِلَةِ فِي مُنْتَصَفِ النَّهَارِ.',
    defaultHours: 12,
    defaultMinutes: 30,
    period: 'afternoon',
    iconName: 'Utensils',
  },
  {
    id: 'school-end',
    title: 'العودة إلى المنزل 🎒',
    description: 'أَجْمَعُ أَدَوَاتِي وَأَعُودُ إِلَى الْبَيْتِ سَعِيداً بِمَا تَعَلَّمْتُهُ الْيَوْمَ.',
    spokenDescription: 'أَجْمَعُ أَدَوَاتِي وَأَعُودُ إِلَى الْبَيْتِ سَعِيداً بِمَا تَعَلَّمْتُهُ الْيَوْمَ.',
    defaultHours: 15,
    defaultMinutes: 30,
    period: 'afternoon',
    iconName: 'Home',
  },
  {
    id: 'homework',
    title: 'حل الواجبات والمطالعة 📚',
    description: 'أُرَاجِعُ دُرُوسِي وَأَحُلُّ وَاجِبَاتِي الْمَدْرَسِيَّةَ ثُمَّ أَقْرَأُ قِصَّةً شَيِّقَةً.',
    spokenDescription: 'أُرَاجِعُ دُرُوسِي وَأَحُلُّ وَاجِبَاتِي الْمَدْرَسِيَّةَ ثُمَّ أَقْرَأُ قِصَّةً شَيِّقَةً.',
    defaultHours: 17,
    defaultMinutes: 0,
    period: 'evening',
    iconName: 'BookOpen',
  },
  {
    id: 'dinner',
    title: 'العشاء مع العائلة 🥗',
    description: 'أَجْلِسُ مَعَ أُسْرَتِي لِتَنَاوُلِ الْعَشَاءِ وَنَتَبَادَلُ الْحَدِيثَ الْمُمْتِعَ.',
    spokenDescription: 'أَجْلِسُ مَعَ أُسْرَتِي لِتَنَاوُلِ الْعَشَاءِ وَنَتَبَادَلُ الْحَدِيثَ الْمُمْتِعَ.',
    defaultHours: 19,
    defaultMinutes: 30,
    period: 'evening',
    iconName: 'Utensils',
  },
  {
    id: 'sleep',
    title: 'النوم المبكر 🌙',
    description: 'أُنَظِّفُ أَسْنَانِي وَأَنَامُ مُبَكِّراً لِأَسْتَيْقِظَ نَشِيطاً فِي الصَّبَاحِ الْبَاكِرِ.',
    spokenDescription: 'أُنَظِّفُ أَسْنَانِي وَأَنَامُ مُبَكِّراً لِأَسْتَيْقِظَ نَشِيطاً فِي الصَّبَاحِ الْبَاكِرِ.',
    defaultHours: 20,
    defaultMinutes: 45,
    period: 'night',
    iconName: 'Moon',
  },
];

export const DailyRoutineMode: React.FC<DailyRoutineModeProps> = ({ onEarnStar }) => {
  const [selectedId, setSelectedId] = useState<string>('school-start');
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const selectedItem = ROUTINE_ITEMS.find((r) => r.id === selectedId) || ROUTINE_ITEMS[0];
  const digital = formatDigitalTime(selectedItem.defaultHours, selectedItem.defaultMinutes);
  const spoken = formatArabicSpokenTime(selectedItem.defaultHours, selectedItem.defaultMinutes, true, false);
  const phonetic = formatArabicSpokenTime(selectedItem.defaultHours, selectedItem.defaultMinutes, true, true);

  const handleSelect = (item: DailyRoutineItem) => {
    sounds.playClick();
    setSelectedId(item.id);
    if (!completedItems.includes(item.id)) {
      setCompletedItems((prev) => [...prev, item.id]);
      onEarnStar();
    }
    // Speak time and activity title
    const speakText = `وَقْتُ ${item.title}. السَّاعَةُ ${phonetic}. ${item.description}`;
    sounds.speakArabic(speakText);
  };

  const handleSpeakCurrent = () => {
    const speakText = `وَقْتُ ${selectedItem.title}. السَّاعَةُ ${phonetic}. ${selectedItem.description}`;
    sounds.speakArabic(speakText);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-orange-500" />;
      case 'School':
        return <School className="w-5 h-5 text-blue-500" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-emerald-500" />;
      case 'Home':
        return <Home className="w-5 h-5 text-indigo-500" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-rose-500" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-purple-500" />;
      default:
        return <Sun className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left Column: Clock & Active Event Detail */}
      <div className="w-full lg:w-[460px] bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col items-center">
        <div className="w-full text-center pb-2 border-b border-slate-100 mb-2 flex items-center justify-between">
          <div className="text-right">
            <span className="text-xs font-bold text-amber-700">الساعة تشير إلى وقت:</span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">{selectedItem.title}</h3>
          </div>
          <button
            onClick={handleSpeakCurrent}
            className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer active:scale-95"
            title="استمع للوصف صوتياً"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <InteractiveClock
          hours={selectedItem.defaultHours}
          minutes={selectedItem.defaultMinutes}
          interactive={false}
          showMinuteRing={true}
          showHandLabels={true}
          size={320}
        />

        {/* Event Time Summary Card */}
        <div className="w-full mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">الوقت:</span>
            <span className="font-mono font-black text-base text-slate-900 bg-white px-3 py-1 rounded-xl border border-amber-200 shadow-xs">
              {digital.time12} {digital.isPm ? 'مساءً' : 'صباحاً'}
            </span>
          </div>

          <div className="text-sm font-black text-slate-800 leading-snug">
            {spoken}
          </div>

          <p className="text-xs text-slate-700 leading-relaxed pt-2 border-t border-amber-200/60 font-semibold">
            {selectedItem.description}
          </p>
        </div>
      </div>

      {/* Right Column: Timeline Cards of the Day */}
      <div className="w-full lg:flex-1 flex flex-col gap-4">
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-slate-900 text-base">جدول أنشطة يوم التلميذ:</h3>
          </div>
          <span className="text-xs font-black text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-2xl">
            استكشفت {completedItems.length} من {ROUTINE_ITEMS.length} أنشطة ⭐
          </span>
        </div>

        {/* List of Routine Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ROUTINE_ITEMS.map((item) => {
            const isSelected = item.id === selectedId;
            const isViewed = completedItems.includes(item.id);
            const itemDig = formatDigitalTime(item.defaultHours, item.defaultMinutes);

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col gap-2 cursor-pointer active:scale-[0.99] ${
                  isSelected
                    ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-200'
                    : isViewed
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-white hover:bg-slate-50 border-slate-200/70 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-100">
                      {renderIcon(item.iconName)}
                    </div>
                    <span className="font-black text-sm md:text-base text-slate-900">
                      {item.title}
                    </span>
                  </div>

                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800">
                    {itemDig.time12}
                  </span>
                </div>

                <div className="text-xs text-slate-600 line-clamp-2 pr-1 font-medium leading-relaxed">
                  {item.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

