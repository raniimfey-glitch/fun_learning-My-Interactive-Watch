export const ARABIC_HOURS_DISPLAY = [
  'الثانية عشرة', // 0 or 12
  'الواحدة',      // 1
  'الثانية',      // 2
  'الثالثة',      // 3
  'الرابعة',      // 4
  'الخامسة',      // 5
  'السادسة',      // 6
  'السابعة',      // 7
  'الثامنة',      // 8
  'التاسعة',      // 9
  'العاشرة',      // 10
  'الحادية عشرة', // 11
  'الثانية عشرة', // 12
];

// Fully diacritized hours for accurate, pristine text-to-speech pronunciation
export const ARABIC_HOURS_PHONETIC = [
  'اَلثَّانِيَةَ عَشْرَةَ', // 0 or 12
  'اَلْوَاحِدَةُ',        // 1
  'اَلثَّانِيَةُ',        // 2
  'اَلثَّالِثَةُ',        // 3
  'اَلرَّابِعَةُ',        // 4
  'اَلْخَامِسَةُ',        // 5
  'اَلسَّادِسَةُ',        // 6
  'اَلسَّابِعَةُ',        // 7
  'اَلثَّامِنَةُ',        // 8
  'اَلتَّاسِعَةُ',        // 9
  'اَلْعَاشِرَةُ',        // 10
  'اَلْحَادِيَةَ عَشْرَةَ', // 11
  'اَلثَّانِيَةَ عَشْرَةَ', // 12
];

export function getArabicHourName(hour12: number, phonetic: boolean = false): string {
  const norm = hour12 % 12 === 0 ? 12 : hour12 % 12;
  if (phonetic) {
    return ARABIC_HOURS_PHONETIC[norm] || `${norm}`;
  }
  return ARABIC_HOURS_DISPLAY[norm] || `${norm}`;
}

export function getNextArabicHourName(hour12: number, phonetic: boolean = false): string {
  const next = (hour12 % 12) + 1;
  const norm = next > 12 ? 1 : next;
  if (phonetic) {
    return ARABIC_HOURS_PHONETIC[norm] || `${norm}`;
  }
  return ARABIC_HOURS_DISPLAY[norm] || `${norm}`;
}

export function getPeriodOfDay(hours24: number): {
  name: string;
  spokenName: string;
  subText: string;
  icon: 'morning' | 'afternoon' | 'evening' | 'night';
  bgClass: string;
} {
  if (hours24 >= 5 && hours24 < 12) {
    return {
      name: 'صباحاً',
      spokenName: 'صَبَاحاً',
      subText: 'وقت الصباح الباكر وبداية اليوم المدرسي ☀️',
      icon: 'morning',
      bgClass: 'from-amber-100 via-sky-100 to-sky-200',
    };
  } else if (hours24 >= 12 && hours24 < 16) {
    return {
      name: 'بعد الظهر',
      spokenName: 'بَعْدَ الظُّهْرِ',
      subText: 'وقت الظهيرة واستراحة الغداء 🌤️',
      icon: 'afternoon',
      bgClass: 'from-sky-200 via-blue-100 to-amber-100',
    };
  } else if (hours24 >= 16 && hours24 < 20) {
    return {
      name: 'مساءً',
      spokenName: 'مَسَاءً',
      subText: 'وقت العودة للبيت والواجبات المدرسية 🌇',
      icon: 'evening',
      bgClass: 'from-orange-100 via-rose-100 to-indigo-200',
    };
  } else {
    return {
      name: 'ليلاً',
      spokenName: 'لَيْلًا',
      subText: 'وقت العشاء والراحة والنوم الهادئ 🌙',
      icon: 'night',
      bgClass: 'from-indigo-900 via-slate-800 to-slate-900',
    };
  }
}

/**
 * Returns natural Arabic spoken time for 2nd Grade pupils with high precision & Tashkeel.
 * Examples:
 *  - 03:00 -> "السَّاعَةُ الثَّالِثَةُ تَمَاماً صَبَاحاً"
 *  - 04:30 -> "السَّاعَةُ الرَّابِعَةُ وَالنِّصْفُ مَسَاءً"
 *  - 07:15 -> "السَّاعَةُ السَّابِعَةُ وَالرُّبْعُ صَبَاحاً"
 *  - 08:45 -> "السَّاعَةُ التَّاسِعَةُ إِلَّا رُبْعاً صَبَاحاً"
 */
export function formatArabicSpokenTime(
  hours24: number,
  minutes: number,
  includePeriod: boolean = true,
  phonetic: boolean = false
): string {
  const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const period = getPeriodOfDay(hours24);
  const periodText = phonetic ? period.spokenName : period.name;

  let phrase = '';

  if (phonetic) {
    // Phonetically tuned with Tashkeel for Web Speech API TTS
    if (minutes === 0) {
      phrase = `اَلسَّاعَةُ ${getArabicHourName(hour12, true)} تَمَاماً`;
    } else if (minutes === 15) {
      phrase = `اَلسَّاعَةُ ${getArabicHourName(hour12, true)} وَالرُّبْعُ`;
    } else if (minutes === 20) {
      phrase = `اَلسَّاعَةُ ${getArabicHourName(hour12, true)} وَالثُّلُثُ`;
    } else if (minutes === 30) {
      phrase = `اَلسَّاعَةُ ${getArabicHourName(hour12, true)} وَالنِّصْفُ`;
    } else if (minutes === 40) {
      phrase = `اَلسَّاعَةُ ${getNextArabicHourName(hour12, true)} إِلَّا ثُلُثاً`;
    } else if (minutes === 45) {
      phrase = `اَلسَّاعَةُ ${getNextArabicHourName(hour12, true)} إِلَّا رُبْعاً`;
    } else if (minutes === 5) {
      phrase = `اَلسَّاعَةُ ${getArabicHourName(hour12, true)} وَخَمْسُ دَقَائِقَ`;
    } else if (minutes === 10) {
      phrase = `اَلسَّاعَةُ ${getArabicHourName(hour12, true)} وَعَشْرُ دَقَائِقَ`;
    } else if (minutes === 50) {
      phrase = `اَلسَّاعَةُ ${getNextArabicHourName(hour12, true)} إِلَّا عَشْرَ دَقَائِقَ`;
    } else if (minutes === 55) {
      phrase = `اَلسَّاعَةُ ${getNextArabicHourName(hour12, true)} إِلَّا خَمْسَ دَقَائِقَ`;
    } else {
      if (minutes < 30) {
        phrase = `اَلسَّاعَةُ ${getArabicHourName(hour12, true)} وَ ${minutes} دَقِيقَة`;
      } else {
        const rem = 60 - minutes;
        phrase = `اَلسَّاعَةُ ${getNextArabicHourName(hour12, true)} إِلَّا ${rem} دَقِيقَة`;
      }
    }
  } else {
    // Standard visual Arabic formatting
    if (minutes === 0) {
      phrase = `الساعة ${getArabicHourName(hour12, false)} تماماً`;
    } else if (minutes === 15) {
      phrase = `الساعة ${getArabicHourName(hour12, false)} والرُّبْع`;
    } else if (minutes === 20) {
      phrase = `الساعة ${getArabicHourName(hour12, false)} والثُّلُث`;
    } else if (minutes === 30) {
      phrase = `الساعة ${getArabicHourName(hour12, false)} والنِّصْف`;
    } else if (minutes === 40) {
      phrase = `الساعة ${getNextArabicHourName(hour12, false)} إلا ثُلُثاً`;
    } else if (minutes === 45) {
      phrase = `الساعة ${getNextArabicHourName(hour12, false)} إلا رُبْعاً`;
    } else if (minutes === 5) {
      phrase = `الساعة ${getArabicHourName(hour12, false)} وخمس دقائق`;
    } else if (minutes === 10) {
      phrase = `الساعة ${getArabicHourName(hour12, false)} وعشر دقائق`;
    } else if (minutes === 50) {
      phrase = `الساعة ${getNextArabicHourName(hour12, false)} إلا عشر دقائق`;
    } else if (minutes === 55) {
      phrase = `الساعة ${getNextArabicHourName(hour12, false)} إلا خمس دقائق`;
    } else {
      if (minutes < 30) {
        phrase = `الساعة ${getArabicHourName(hour12, false)} و ${minutes} دقيقة`;
      } else {
        const rem = 60 - minutes;
        phrase = `الساعة ${getNextArabicHourName(hour12, false)} إلا ${rem} دقيقة`;
      }
    }
  }

  if (includePeriod) {
    return `${phrase} ${periodText}`;
  }
  return phrase;
}

/**
 * Returns formatted 12h digital strings for 2nd grade
 */
export function formatDigitalTime(hours24: number, minutes: number, seconds: number = 0) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const h12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const isPm = hours24 >= 12;

  return {
    time12: `${pad(h12)}:${pad(minutes)}`,
    time12WithSec: `${pad(h12)}:${pad(minutes)}:${pad(seconds)}`,
    period12: isPm ? 'م' : 'ص',
    isPm,
    h12,
    h24: hours24,
    min: minutes,
  };
}

/**
 * Calculates rotation angles in degrees for clock hands
 */
export function getClockAngles(hours24: number, minutes: number, seconds: number = 0) {
  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
  const hour12 = hours24 % 12;
  const hourAngle = ((hour12 + minutes / 60 + seconds / 3600) / 12) * 360;

  return {
    hourAngle,
    minuteAngle,
    secondAngle,
  };
}

/**
 * Convert angle in degrees from center to closest minute (0-59) or hour (1-12)
 */
export function angleToMinutes(angleDeg: number, snapToFive: boolean = true): number {
  let norm = (angleDeg % 360 + 360) % 360;
  let rawMin = Math.round((norm / 360) * 60) % 60;
  if (snapToFive) {
    rawMin = Math.round(rawMin / 5) * 5;
    if (rawMin === 60) rawMin = 0;
  }
  return rawMin;
}

export function angleToHour(angleDeg: number): number {
  let norm = (angleDeg % 360 + 360) % 360;
  let rawHour = Math.round((norm / 360) * 12);
  if (rawHour === 0) rawHour = 12;
  return rawHour;
}

