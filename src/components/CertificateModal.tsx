import React, { useState } from 'react';
import { Award, Star, X, Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  starsCount: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  starsCount,
}) => {
  const [studentName, setStudentName] = useState<string>('البطل الصغير');
  const [gradeText, setGradeText] = useState<string>('السنة الثانية ابتدائي');

  if (!isOpen) return null;

  const handlePrint = () => {
    sounds.playFanfare();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (hidden on print) */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
            <Award className="w-5 h-5 text-amber-500" />
            <span>شهادة بطل قراءة الساعة 🎖️</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input Name customization (hidden on print) */}
        <div className="p-4 bg-amber-50/50 border-b border-amber-100 flex flex-col sm:flex-row gap-3 items-center print:hidden">
          <label className="text-xs font-bold text-slate-700 shrink-0">اسم التلميذ(ة):</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="اكتب اسم التلميذ هنا"
            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
          />
          <select
            value={gradeText}
            onChange={(e) => setGradeText(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
          >
            <option value="السنة الثانية ابتدائي">السنة الثانية ابتدائي</option>
            <option value="السنة الثالثة ابتدائي">السنة الثالثة ابتدائي</option>
            <option value="السنة الثانية / الثالثة ابتدائي">المرحلة الابتدائية</option>
          </select>
        </div>

        {/* The Printable Certificate Design */}
        <div className="p-8 md:p-12 bg-linear-to-b from-amber-50/70 via-white to-amber-50/70 text-center relative flex flex-col items-center justify-between min-h-[440px] border-8 border-double border-amber-400 m-4 rounded-2xl">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-amber-400 text-2xl">✦</div>
          <div className="absolute top-2 right-2 text-amber-400 text-2xl">✦</div>
          <div className="absolute bottom-2 left-2 text-amber-400 text-2xl">✦</div>
          <div className="absolute bottom-2 right-2 text-amber-400 text-2xl">✦</div>

          <div className="space-y-2">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-100 text-amber-700 mb-2 border border-amber-300">
              <Award className="w-10 h-10" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-amber-900 tracking-wide">
              شهادة تفوّق وبراعة 🎓
            </h1>
            <p className="text-xs md:text-sm font-bold text-amber-700">
              في قراءة وكتابة وضبط الساعة بعقاربها والأرقام
            </p>
          </div>

          <div className="my-6 space-y-3">
            <p className="text-sm text-slate-600 font-medium">تُمنح هذه الشهادة بكل فخر للتلميذ(ة) المتميز(ة):</p>
            <div className="text-2xl md:text-4xl font-black text-slate-900 border-b-2 border-amber-400 pb-2 px-8 inline-block font-['Tajawal']">
              {studentName || 'البطل الصغير'}
            </div>
            <p className="text-xs md:text-sm font-bold text-slate-700">
              {gradeText}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 bg-amber-100/70 px-4 py-2 rounded-2xl border border-amber-300">
            <Star className="w-5 h-5 fill-amber-400 text-amber-600" />
            <span className="font-extrabold text-sm text-amber-950">
              رصيد النجوم المجمعة: {starsCount} نجمة تفوق ⭐
            </span>
          </div>

          <div className="w-full flex items-center justify-between pt-6 border-t border-amber-200 mt-6 text-xs text-slate-500 font-bold">
            <div>التاريخ: {new Date().toLocaleDateString('ar-EG')}</div>
            <div className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>مُتقن لقراءة الساعة بنجاح</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
