'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { submitBespokeRequestAction } from '@/app/actions/storefrontActions';
import { uploadImageAction } from '@/app/actions/adminActions';

interface ConfiguratorProps {
  locale: string;
}



function ConfiguratorContent({ locale }: ConfiguratorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Wizard Step State
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [referenceNo, setReferenceNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 2. Custom Piece Options State
  const [category, setCategory] = useState('dining-tables');
  const [timber, setTimber] = useState('Natural Oak');
  const [length, setLength] = useState(200);
  const [width, setWidth] = useState(90);
  const [height, setHeight] = useState(240); // For doors
  const [doorWidth, setDoorWidth] = useState(100); // For doors
  const [doorType, setDoorType] = useState('Pivot Door'); // For doors
  const [customSizeText, setCustomSizeText] = useState(''); // For chairs/custom
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // 3. User Contact Info State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // 4. Pre-fill from URL parameters
  useEffect(() => {
    const catParam = searchParams.get('cat');
    const timberParam = searchParams.get('timber');
    const sizeParam = searchParams.get('size');

    if (catParam) setCategory(catParam);
    if (timberParam) setTimber(timberParam);
    if (sizeParam) {
      setCustomSizeText(sizeParam);
      // Parse numbers if applicable
      const lenMatch = sizeParam.match(/(\d+)cm/);
      if (lenMatch && lenMatch[1]) {
        setLength(Number(lenMatch[1]));
      }
    }
  }, [searchParams]);

  // Timber Swatches Data
  const timberOptions = [
    {
      id: 'Natural Oak',
      nameEn: 'Natural Solid Oak',
      nameAr: 'بلوط صلب طبيعي',
      hex: '#C99A63',
      descEn: 'Kiln-dried solid white oak, finished with matte protective oil. Warm, golden character with distinct continuous grain.',
      descAr: 'بلوط أبيض صلب مجفف بالفرن، مطلي بزيت واقٍ مطفأ. طابع دافئ وذهبي مع عروق متصلة مميزة.',
    },
    {
      id: 'Walnut',
      nameEn: 'American Walnut',
      nameAr: 'جوز أمريكي فاخر',
      hex: '#6B4226',
      descEn: 'Deep rich chocolate tones and elegant curving grain patterns. Hand-rubbed wax finish for a premium low-sheen.',
      descAr: 'نغمات شوكولاتة داكنة غنية وأنماط عروق منحنية أنيقة. تشطيب شمعي يدوي للمعان هادئ فاخر.',
    },
    {
      id: 'Espresso',
      nameEn: 'Espresso Stained Ash',
      nameAr: 'خشب رماد إسبريسو',
      hex: '#3A2A1E',
      descEn: 'A bold, dark chocolate-brown finish that lets the strong open grain of solid ash timber speak for itself.',
      descAr: 'تشطيب بني شوكولاتة داكن وجريء يسمح لعروق خشب الرماد الصلب القوية والمفتوحة بالتعبير عن نفسها.',
    },
    {
      id: 'Charcoal Oak',
      nameEn: 'Charcoal Oak',
      nameAr: 'بلوط فحم داكن',
      hex: '#2C2824',
      descEn: 'Nearly black matte finish with deep textured wood pores. Dramatic and architectural statement.',
      descAr: 'تشطيب أسود مطفأ تقريباً مع مسام خشبية عميقة الملمس. حضور درامي ومعماري مميز.',
    },
    {
      id: 'Premium Teak',
      nameEn: 'Burmese Teak',
      nameAr: 'خشب تيك بورمي فاخر',
      hex: '#A06A42',
      descEn: 'Sustainably-sourced golden-brown Burmese Teak. Exceptionally durable and water-resistant, ideal for prestigious indoor/outdoor installations.',
      descAr: 'خشب تيك بورمي مستدام بلون بني ذهبي. متين للغاية ومقاوم للعوامل الجوية ومثالي للأعمال الفاخرة الداخلية والخارجية.',
    },
    {
      id: 'Hard Maple',
      nameEn: 'Hard Maple',
      nameAr: 'خشب قيقب صلب',
      hex: '#EEDEC6',
      descEn: 'Dense, clean white North American Hard Maple. Fine, uniform texture and minimal, elegant grain lines.',
      descAr: 'خشب قيقب أمريكي صلب كثيف بلون أبيض كريمي. يتميز بملمس ناعم للغاية وعروق خشبية خفيفة وأنيقة.',
    },
    {
      id: 'American Cherry',
      nameEn: 'American Cherry',
      nameAr: 'خشب كرز أمريكي دافئ',
      hex: '#9C4C38',
      descEn: 'Rich reddish-brown timber that deepens into a warm amber patina over time. Fine satiny texture with gentle curving patterns.',
      descAr: 'خشب ذو لون بني محمر غني يكتسب بريقاً دافئاً بمرور الوقت. ذو ملمس حريري ناعم وأشكال متموجة لطيفة.',
    },
  ];

  // Category Options Data
  const categoryOptions = [
    { id: 'dining-tables', labelEn: 'Dining Tables', labelAr: 'طاولات الطعام', icon: '🪑' },
    { id: 'cabinets', labelEn: 'TV Cabinets & Sideboards', labelAr: 'خزائن التلفزيون والجانبية', icon: '📺' },
    { id: 'doors', labelEn: 'Bespoke Pivot Doors', labelAr: 'أبواب محورية مخصصة', icon: '🚪' },
    { id: 'shelving', labelEn: 'Custom Shelving', labelAr: 'الأرفف الجدارية', icon: '📚' },
    { id: 'custom', labelEn: 'Entirely Custom Space', labelAr: 'مشروع خاص بالكامل', icon: '✨' },
  ];

  // Image Upload handler to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10485760) {
      alert(locale === 'ar' ? 'حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 10 ميجابايت.' : 'Image file is too large. Please select an image under 10MB.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadImageAction(formData);
      if (res.success && res.url) {
        setImages([...images, res.url]);
      } else {
        setErrorMsg(res.error || 'Failed to upload image.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred during photo upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Compile dimensions text
  const getCompiledDimensions = () => {
    if (category === 'dining-tables' || category === 'cabinets' || category === 'shelving') {
      return `L: ${length}cm × W: ${width}cm × H: 75cm`;
    }
    if (category === 'doors') {
      const typeLabel = locale === 'ar'
        ? (doorType === 'Pivot Door' ? 'باب محوري' : doorType === 'Single Hinge' ? 'باب بمفصلات مفرد' : doorType === 'Double Door' ? 'باب مزدوج' : 'باب منزلق')
        : doorType;
      return `${typeLabel} · Approx: ${height}cm × ${doorWidth}cm (Site survey required)`;
    }
    return customSizeText || (locale === 'ar' ? 'حسب المواصفات' : 'Custom specs');
  };

  const getSelectedCategoryLabel = () => {
    const found = categoryOptions.find(c => c.id === category);
    return found ? found[locale === 'ar' ? 'labelAr' : 'labelEn'] : category;
  };

  const getSelectedTimberLabel = () => {
    const found = timberOptions.find(t => t.id === timber);
    return found ? found[locale === 'ar' ? 'nameAr' : 'nameEn'] : timber;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(4);
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await submitBespokeRequestAction({
        fullName,
        email,
        phone,
        category: getSelectedCategoryLabel(),
        timber: getSelectedTimberLabel(),
        dimensions: getCompiledDimensions(),
        notes,
        images,
      });

      if (res.success && res.referenceNo) {
        setReferenceNo(res.referenceNo);
        setSent(true);
      } else {
        setErrorMsg(res.error || 'Failed to submit request.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Styling helper tokens
  const labelClass = "text-xs font-semibold tracking-[0.08em] uppercase text-muted text-start mb-2.5 block";
  const inputClass = "w-full bg-cream/[0.04] border border-cream/16 text-cream text-[15px] p-4 rounded-[3px] outline-none focus:border-wood/70 transition-colors disabled:opacity-50";

  // Success view
  if (sent) {
    return (
      <div className="border border-wood/30 bg-cream/[0.02] rounded-[4px] p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-[680px] mx-auto animate-pc-fade">
        <div className="w-16 h-16 rounded-full border-2 border-wood flex items-center justify-center text-wood text-3xl font-serif select-none">
          ✦
        </div>
        <div className="space-y-2">
          <h2 className="font-serif font-medium text-3xl md:text-4xl text-cream-bright">
            {locale === 'ar' ? 'تم استلام طلبك بنجاح' : 'Commission Request Received'}
          </h2>
          <p className="text-faint text-sm max-w-[480px] mx-auto font-light leading-relaxed">
            {locale === 'ar' 
              ? 'شكراً لتواصلك مع ورشتنا. سيقوم كبير الحرفيين بمراجعة تصميمك ومواصفات الخشب والتواصل معك خلال يوم عمل واحد.'
              : 'Thank you for commissioning Pacific Carpentry. Our head carpenter will review your specifications, check timber availability, and get back to you with a detailed quote.'}
          </p>
        </div>

        <div className="bg-[#1A140F] border border-cream/10 px-6 py-4.5 rounded-[2px] inline-block select-all cursor-pointer">
          <span className="text-xs uppercase tracking-[0.16em] text-muted block mb-1">
            {locale === 'ar' ? 'رقم مرجع الطلب' : 'Request Reference'}
          </span>
          <span className="font-serif text-xl font-bold tracking-[0.08em] text-wood">
            {referenceNo}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.9fr] gap-9 md:gap-[56px] items-start max-w-[1280px] mx-auto text-start">
      
      {/* LEFT COLUMN: MULTI-STEP CONFIGURATOR */}
      <div className="space-y-6">
        {errorMsg && (
          <div className="border border-red-500/40 bg-red-500/[0.08] text-red-200 text-sm p-4 rounded-[3px] text-start">
            {errorMsg}
          </div>
        )}

        {/* STEP indicator bar */}
        <div className="flex justify-between items-center bg-cream/[0.02] border border-cream/10 rounded-[3px] p-4 text-xs font-semibold text-muted uppercase tracking-[0.08em]">
          <span className={step >= 1 ? "text-wood" : ""}>{locale === 'ar' ? '١. نوع القطعة' : '1. Canvas'}</span>
          <span className="opacity-30">/</span>
          <span className={step >= 2 ? "text-wood" : ""}>{locale === 'ar' ? '٢. نوع الخشب' : '2. Timber'}</span>
          <span className="opacity-30">/</span>
          <span className={step >= 3 ? "text-wood" : ""}>{locale === 'ar' ? '٣. المقاسات' : '3. Sizing'}</span>
          <span className="opacity-30">/</span>
          <span className={step >= 4 ? "text-wood" : ""}>{locale === 'ar' ? '٤. التفاصيل' : '4. Contact'}</span>
        </div>

        {/* STEP 1: CATEGORY SELECTION */}
        {step === 1 && (
          <div className="bg-cream/[0.015] border border-cream/10 p-6 md:p-8 rounded-[4px] space-y-6 animate-pc-fade">
            <div>
              <h2 className="font-serif text-xl md:text-2xl text-cream-bright mb-2">
                {locale === 'ar' ? 'ماذا ترغب في صنعه؟' : 'Select your canvas'}
              </h2>
              <p className="text-xs text-muted font-light">
                {locale === 'ar' ? 'اختر فئة القطعة التي ترغب في صياغتها بالخشب الصلب.' : 'Choose the basic type of custom woodwork item you wish to build.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categoryOptions.map((opt) => {
                const isSelected = category === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setCategory(opt.id);
                      setStep(2);
                    }}
                    className={`flex items-center gap-4 p-5 border text-start rounded-[3px] transition-all cursor-pointer ${
                      isSelected
                        ? 'border-wood bg-wood/[0.08] text-cream-bright font-semibold'
                        : 'border-cream/12 bg-transparent text-cream hover:border-wood/40'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{opt.icon}</span>
                    <span className="text-[15px] font-body">
                      {locale === 'ar' ? opt.labelAr : opt.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: TIMBER SELECTION */}
        {step === 2 && (
          <div className="bg-cream/[0.015] border border-cream/10 p-6 md:p-8 rounded-[4px] space-y-6 animate-pc-fade">
            <div className="flex justify-between items-baseline">
              <div>
                <h2 className="font-serif text-xl md:text-2xl text-cream-bright mb-1">
                  {locale === 'ar' ? 'اختر نوع الخشب والتشطيب' : 'Select timber & finish'}
                </h2>
                <p className="text-xs text-muted font-light">
                  {locale === 'ar' ? 'أخشاب صلبة مستدامة بنسبة ١٠٠٪ بتشطيب زيتي طبيعي.' : '100% sustainably-sourced solid wood finished in protective natural oils.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-wood hover:underline font-semibold uppercase cursor-pointer"
              >
                {locale === 'ar' ? 'السابق' : 'Back'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timberOptions.map((opt) => {
                const isSelected = timber === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setTimber(opt.id);
                      setStep(3);
                    }}
                    className={`p-5 border text-start rounded-[3px] transition-all cursor-pointer flex flex-col gap-3 ${
                      isSelected
                        ? 'border-wood bg-wood/[0.08]'
                        : 'border-cream/12 bg-transparent hover:border-wood/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span
                        style={{ backgroundColor: opt.hex }}
                        className="w-5 h-5 rounded-full border border-black/20 shrink-0 block"
                      ></span>
                      <span className="text-[15px] font-bold text-cream-bright leading-none">
                        {locale === 'ar' ? opt.nameAr : opt.nameEn}
                      </span>
                    </div>
                    <p className="text-xs text-faint leading-normal font-light">
                      {locale === 'ar' ? opt.descAr : opt.descEn}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: SIZING & INSPIRATION */}
        {step === 3 && (
          <div className="bg-cream/[0.015] border border-cream/10 p-6 md:p-8 rounded-[4px] space-y-6 animate-pc-fade">
            <div className="flex justify-between items-baseline">
              <div>
                <h2 className="font-serif text-xl md:text-2xl text-cream-bright mb-1">
                  {locale === 'ar' ? 'حدد المقاسات وأرفق التفاصيل' : 'Configure sizing & details'}
                </h2>
                <p className="text-xs text-muted font-light">
                  {locale === 'ar' ? 'حدد مقاسات مساحتك أو قم بتحميل أي صور إلهام للمشروع.' : 'Customize dimension specs or attach any design inspiration screenshots.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-wood hover:underline font-semibold uppercase cursor-pointer"
              >
                {locale === 'ar' ? 'السابق' : 'Back'}
              </button>
            </div>



            {/* Render Contextual Range Sliders */}
            {(category === 'dining-tables' || category === 'cabinets' || category === 'shelving') && (
              <div className="space-y-6">
                {/* Length Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-cream">
                    <span>{locale === 'ar' ? 'الطول المطلوب' : 'Desired Length'}</span>
                    <span className="text-wood font-mono font-bold text-sm bg-wood/12 px-2 py-0.5 rounded">{length} cm</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="350"
                    step="10"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full accent-wood h-1 bg-cream/12 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-faint font-light">
                    <span>120 cm</span>
                    <span>350 cm</span>
                  </div>
                </div>

                {/* Width Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-cream">
                    <span>{locale === 'ar' ? 'العرض المطلوب' : 'Desired Width'}</span>
                    <span className="text-wood font-mono font-bold text-sm bg-wood/12 px-2 py-0.5 rounded">{width} cm</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="150"
                    step="5"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full accent-wood h-1 bg-cream/12 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-faint font-light">
                    <span>80 cm</span>
                    <span>150 cm</span>
                  </div>
                </div>
              </div>
            )}

            {/* Pivot Door custom inputs and Survey Notice */}
            {category === 'doors' && (
              <div className="space-y-6 animate-pc-fade">
                {/* Site Survey Alert */}
                <div className="border border-wood/30 bg-wood/[0.04] rounded-[3px] p-4 text-xs text-cream/90 flex gap-3 items-start leading-relaxed text-start">
                  <span className="text-wood text-sm shrink-0">✦</span>
                  <div>
                    <span className="font-semibold text-cream-bright block mb-1">
                      {locale === 'ar' ? 'يتطلب معاينة موقعية' : 'Site Survey Required'}
                    </span>
                    {locale === 'ar'
                      ? 'نظراً لأن تركيب الأبواب يتطلب دقة بالغة بالمليمتر، يقوم فريقنا بإجراء معاينة موقعية مجانية للقياسات الدقيقة في دولة الإمارات. يرجى تزويدنا بالمعلومات التقريبية أدناه.'
                      : 'Due to the precise millimetre tolerances required for door frames, we conduct a professional, complimentary site survey across the UAE. Please provide your approximate estimates below.'}
                  </div>
                </div>

                {/* Door Configuration selection */}
                <div>
                  <label className={labelClass}>
                    {locale === 'ar' ? 'نوع الباب المطلوب' : 'Door Configuration'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'Pivot Door', en: 'Pivot Door', ar: 'باب محوري' },
                      { id: 'Single Hinge', en: 'Single Hinge Door', ar: 'باب بمفصلات مفرد' },
                      { id: 'Double Door', en: 'Double Entry Door', ar: 'باب مزدوج' },
                      { id: 'Sliding Barn', en: 'Sliding Barn Door', ar: 'باب منزلق (Barn)' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setDoorType(type.id)}
                        className={`p-3 border rounded-[2px] text-xs font-semibold tracking-wide text-center transition-all cursor-pointer ${
                          doorType === type.id
                            ? 'border-wood bg-wood/[0.08] text-cream-bright font-bold'
                            : 'border-cream/12 bg-transparent text-cream hover:border-wood/40'
                        }`}
                      >
                        {locale === 'ar' ? type.ar : type.en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Approximate dimensions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      {locale === 'ar' ? 'الارتفاع التقريبي (سم)' : 'Approx. Height (cm)'}
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 240"
                      className={inputClass}
                      value={height || ''}
                      onChange={(e) => setHeight(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      {locale === 'ar' ? 'العرض التقريبي (سم)' : 'Approx. Width (cm)'}
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 100"
                      className={inputClass}
                      value={doorWidth || ''}
                      onChange={(e) => setDoorWidth(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Custom / Chairs text input */}
            {(category === 'custom' || category === 'chairs') && (
              <div>
                <label className={labelClass}>
                  {locale === 'ar' ? 'المقاسات والتفاصيل المطلوبة' : 'Dimensions & Sizing Requirements'}
                </label>
                <input
                  type="text"
                  placeholder={locale === 'ar' ? 'مثال: ارتفاع المقعد ٤٥سم، أو عرض الجدار الكلي ٣ أمتار' : 'e.g. seat height 45cm, or total space length 3 meters'}
                  className={inputClass}
                  value={customSizeText}
                  onChange={(e) => setCustomSizeText(e.target.value)}
                />
              </div>
            )}

            {/* Design Notes */}
            <div>
              <label className={labelClass}>
                {locale === 'ar' ? 'ملاحظات وتفاصيل إضافية عن التصميم' : 'Design details & special instructions'}
              </label>
              <textarea
                rows={4}
                placeholder={locale === 'ar' ? 'أخبرنا عن مساحتك، تفاصيل الحواف، الميزانية المقدرة، أو أي مواصفات خاصة...' : 'Tell us about your home space, baseboard cutouts, budget limits, edge detailing...'}
                className={`${inputClass} resize-y min-h-[100px]`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            {/* Photo Upload Attachment */}
            <div className="space-y-3">
              <label className={labelClass}>
                {locale === 'ar' ? 'أرفق صور إلهام أو مخطط المساحة' : 'Attach inspiration photos or space blueprints'}
              </label>
              
              {/* Photo uploader dropzone */}
              <label className="border border-dashed border-cream/20 bg-cream/[0.015] hover:bg-cream/[0.035] hover:border-wood/50 rounded-[4px] p-6 text-center select-none cursor-pointer block transition-colors">
                <input
                  disabled={isUploading}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <span className="text-xs font-bold text-cream tracking-[0.02em] block">
                  {isUploading ? (locale === 'ar' ? 'جاري رفع الملف...' : 'Uploading file...') : (locale === 'ar' ? 'تحميل صورة للملف' : 'Upload Inspiration Photo')}
                </span>
                <span className="text-[10.5px] text-faint mt-1 block">Accepts JPG, PNG up to 10MB</span>
              </label>

              {/* Uploaded files listing */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded border border-cream/12 overflow-hidden group">
                      <img src={url} alt="Inspiration preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-red-400 font-bold transition-opacity cursor-pointer border-none"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-full bg-wood hover:bg-woodSoft text-bg text-[13px] font-bold tracking-[0.1em] uppercase py-4 rounded-[2px] cursor-pointer transition-colors duration-250 hover:brightness-105"
            >
              {locale === 'ar' ? 'التالي: معلومات التواصل' : 'Next: Contact Info'}
            </button>
          </div>
        )}

        {/* STEP 4: CONTACT & SUBMISSION */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="bg-cream/[0.015] border border-cream/10 p-6 md:p-8 rounded-[4px] space-y-6 animate-pc-fade">
            <div className="flex justify-between items-baseline">
              <div>
                <h2 className="font-serif text-xl md:text-2xl text-cream-bright mb-1">
                  {locale === 'ar' ? 'معلومات التواصل لتأكيد الطلب' : 'Provide your contact details'}
                </h2>
                <p className="text-xs text-muted font-light">
                  {locale === 'ar' ? 'سيتواصل معك فريقنا خلال ٢٤ ساعة لمناقشة التفاصيل والأسعار.' : 'Our team will contact you within 24 hours to discuss options and finalize pricing.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-xs text-wood hover:underline font-semibold uppercase cursor-pointer"
              >
                {locale === 'ar' ? 'السابق' : 'Back'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>{locale === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                <input
                  required
                  disabled={isLoading}
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Awtel Moussa"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input
                    required
                    disabled={isLoading}
                    type="email"
                    className={inputClass}
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>{locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                  <input
                    required
                    disabled={isLoading}
                    type="tel"
                    className={inputClass}
                    placeholder="+971 50 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="w-full bg-wood hover:bg-woodSoft text-bg text-[13px] font-bold tracking-[0.1em] uppercase py-4 rounded-[2px] cursor-pointer transition-colors duration-250 hover:brightness-105 disabled:opacity-50"
            >
              {isLoading 
                ? (locale === 'ar' ? 'جاري الإرسال...' : 'Submitting Request...') 
                : (locale === 'ar' ? 'تأكيد إرسال الطلب المخصص' : 'Submit Bespoke Request')}
            </button>
          </form>
        )}
      </div>

      {/* RIGHT COLUMN: CONFIGURATION PREVIEW CARD */}
      <div className="lg:sticky lg:top-[98px] space-y-6">
        <div className="border border-cream/10 bg-cream/[0.025] rounded-[4px] p-6 text-start space-y-4">
          <h3 className="font-serif font-medium text-lg text-cream-bright border-b border-line pb-3 mb-1">
            {locale === 'ar' ? 'ملخص المواصفات المخصصة' : 'Specification Summary'}
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between py-1 border-b border-line/40">
              <span className="text-muted">{locale === 'ar' ? 'القطعة المطلوبة' : 'Bespoke Item'}</span>
              <span className="font-semibold text-cream-bright">{getSelectedCategoryLabel()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/40">
              <span className="text-muted">{locale === 'ar' ? 'نوع الخشب' : 'Timber Selection'}</span>
              <span className="font-semibold text-cream-bright">{getSelectedTimberLabel()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/40">
              <span className="text-muted">{locale === 'ar' ? 'المقاسات التقريبية' : 'Approx. Dimensions'}</span>
              <span className="font-semibold text-cream-bright font-mono">{getCompiledDimensions()}</span>
            </div>
            {images.length > 0 && (
              <div className="flex justify-between py-1 border-b border-line/40">
                <span className="text-muted">{locale === 'ar' ? 'الصور المرفقة' : 'Inspiration Attachments'}</span>
                <span className="font-semibold text-cream-bright">{images.length} {locale === 'ar' ? 'صور' : 'files'}</span>
              </div>
            )}
          </div>


          
          <div className="pt-2">
            <span className="block text-[10px] text-faint uppercase tracking-[0.04em] leading-normal font-light">
              * {locale === 'ar' 
                  ? 'كل قطعة تصنع حسب الطلب وتأتي مع ضمان جودة joinery لمدة ١٠ سنوات.' 
                  : 'Every piece is crafted to order and carries a 10-year timber joinery guarantee.'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function BespokeConfigurator({ locale }: ConfiguratorProps) {
  return (
    <Suspense fallback={<div className="text-cream text-center py-10">Loading configurator...</div>}>
      <ConfiguratorContent locale={locale} />
    </Suspense>
  );
}
