'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { useLocale, useTranslations } from 'next-intl';
import { submitBespokeRequestAction, getShowroomItemsAction } from '@/app/actions/storefrontActions';
import { uploadImageAction } from '@/app/actions/adminActions';
import dynamic from 'next/dynamic';

const Configurator3D = dynamic(() => import('@/components/Configurator3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-cream/[0.015] text-cream/40 aspect-[4/3] md:aspect-[16/10]">
      <div className="w-8 h-8 border border-wood border-t-transparent rounded-full animate-spin mb-3" />
      <span className="text-[10px] uppercase tracking-widest font-mono font-semibold">Initializing 3D Studio...</span>
    </div>
  ),
});

// Define model-viewer JSX typings for TypeScript compilation safety
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'touch-action'?: string;
        'shadow-intensity'?: string;
        'shadow-softness'?: string;
        alt?: string;
        style?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
  namespace React.JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'touch-action'?: string;
        'shadow-intensity'?: string;
        'shadow-softness'?: string;
        alt?: string;
        style?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
}

// 2D Visualizer Interfaces
interface PlacedItem {
  id: string; // unique instance ID
  productId: string;
  nameEn: string;
  nameAr: string;
  imageUrl: string;
  timberId: string;
  x: number; // percentage from left (0 to 100)
  y: number; // percentage from top (0 to 100)
  scale: number;
  rotation: number;
  brightness: number;
  contrast: number;
  shadowOpacity: number;
  isFlipped: boolean;
}

export default function VisualizePage() {
  const locale = useLocale();
  const tNav = useTranslations('nav');
  const tDetail = useTranslations('detail');
  const tVis = useTranslations('visualizer');

  // Page level tabs: 'showroom' (3D) or 'visualizer' (2D Room Planner)
  const [activeTab, setActiveTab] = useState<'showroom' | 'visualizer'>('showroom');
  const [currentUrl, setCurrentUrl] = useState('');

  // -------------------------------------------------------------
  // 3D SHOWROOM STATE
  // -------------------------------------------------------------
  const [activeItem3D, setActiveItem3D] = useState('dining-table');
  const [activeTimber3D, setActiveTimber3D] = useState('oak');

  // 3D Configurator Scale States
  const [scaleX, setScaleX] = useState(1.0);
  const [scaleY, setScaleY] = useState(1.0);
  const [scaleZ, setScaleZ] = useState(1.0);
  const [showGrid3D, setShowGrid3D] = useState(true);

  // WebAR and QR Code State
  const [isMobile, setIsMobile] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(/Mobi|Android|iPhone/i.test(navigator.userAgent));
    }
  }, []);

  // Reset scale vectors when switching furniture designs
  useEffect(() => {
    setScaleX(1.0);
    setScaleY(1.0);
    setScaleZ(1.0);
  }, [activeItem3D]);

  // Set page URL for QR code generator
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const DEFAULT_ITEMS_3D = [
    {
      id: 'dining-table',
      nameEn: 'Oakline Dining Table',
      nameAr: 'طاولة طعام أوكلاين',
      descEn: 'Kiln-dried solid oak table featuring traditional joinery and oil finishes.',
      descAr: 'طاولة خشب بلوط صلب مجفف بالفرن تتميز بوصلات تعشيق تقليدية وتشطيب زيتي.',
      modelUrl: '/models/chair.glb', // Reusing chair.glb for 3D demo
    },
    {
      id: 'wardrobe',
      nameEn: 'Bespoke Wardrobe',
      nameAr: 'خزانة ملابس مخصصة',
      descEn: 'Handcrafted solid wood wardrobe with sliding panels.',
      descAr: 'خزانة ملابس من الخشب الصلب مصنوعة يدوياً بألواح منزلقة.',
      modelUrl: '/models/wardrobe.glb', // Points to public/models/wardrobe.glb
    },
    {
      id: 'untitled-design',
      nameEn: 'My Custom Design',
      nameAr: 'تصميمي المخصص',
      descEn: 'Imported model loaded from Untitled.glb.',
      descAr: 'نموذج مخصص تم تحميله من ملف Untitled.glb.',
      modelUrl: '/models/Untitled.glb',
    },
    {
      id: 'pivot-door',
      nameEn: 'Harbor Pivot Door',
      nameAr: 'باب هاربور المحوري',
      descEn: 'Concealed pivot hinge entryway door designed in solid Burmese Teak.',
      descAr: 'باب مدخل محوري بنظام مفصلات مخفية مصمم بالكامل من خشب التيك البورمي.',
      modelUrl: '/models/chair.glb',
    },
    {
      id: 'sideboard',
      nameEn: 'Monterey Sideboard',
      nameAr: 'خزانة مونتيري الجانبية',
      descEn: 'American Walnut storage cabinet with grain-matched continuous panels.',
      descAr: 'خزانة تخزين من خشب الجوز الأمريكي مع ألواح واجهة متناسقة العروق.',
      modelUrl: '/models/chair.glb',
    },
  ];

  const [items3D, setItems3D] = useState<any[]>(DEFAULT_ITEMS_3D);

  useEffect(() => {
    async function fetchShowroomItems() {
      const res = await getShowroomItemsAction();
      if (res.success && res.items && res.items.length > 0) {
        setItems3D(res.items);
        setActiveItem3D((current) => {
          if (!res.items.some((item: any) => item.id === current)) {
            return res.items[0].id;
          }
          return current;
        });
      }
    }
    fetchShowroomItems();
  }, []);

  const timbers3D = [
    { id: 'oak', nameEn: 'Natural Oak', nameAr: 'بلوط طبيعي', hex: '#C99A63' },
    { id: 'walnut', nameEn: 'American Walnut', nameAr: 'جوز أمريكي', hex: '#6B4226' },
    { id: 'teak', nameEn: 'Burmese Teak', nameAr: 'تيك بورمي', hex: '#8B5A2B' },
  ];

  const selectedItem3D = items3D.find((x) => x.id === activeItem3D) || items3D[0];
  const qrCodeUrl = currentUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(currentUrl)}`
    : '';

  // -------------------------------------------------------------
  // 2D ROOM PLANNER STATE & DATA
  // -------------------------------------------------------------
  const canvasRef = useRef<HTMLDivElement>(null);

  // Placed items in the room
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Background rooms
  const sampleRooms = [
    { id: 'living', nameEn: 'Elegant Living Room', nameAr: 'غرفة معيشة أنيقة', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80' },
    { id: 'bedroom', nameEn: 'Cozy Bedroom', nameAr: 'غرفة نوم مريحة', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80' },
    { id: 'office', nameEn: 'Executive Office', nameAr: 'مكتب تنفيذي', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80' },
    { id: 'dining', nameEn: 'Minimalist Dining Area', nameAr: 'غرفة طعام هادئة', url: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=1200&q=80' },
  ];
  const [activeRoomBg, setActiveRoomBg] = useState<string>(sampleRooms[0].url);
  const [customRoomBg, setCustomRoomBg] = useState<string | null>(null);

  // Furniture items selection list (products with clean light backgrounds)
  const furnitureOptions = [
    {
      id: 'dining-table',
      nameEn: 'Oakline Dining Table',
      nameAr: 'طاولة طعام أوكلاين',
      imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80',
      descEn: 'Kiln-dried solid oak table with traditional joinery.',
      descAr: 'طاولة خشب بلوط صلب مجفف ووصلات تقليدية.'
    },
    {
      id: 'pivot-door',
      nameEn: 'Harbor Pivot Door',
      nameAr: 'باب هاربور المحوري',
      imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
      descEn: 'Oversized entryway pivot door built in solid timber.',
      descAr: 'باب مدخل محوري كبير مصنوع من الخشب الصلب.'
    },
    {
      id: 'sideboard',
      nameEn: 'Monterey Sideboard',
      nameAr: 'خزانة مونتيري الجانبية',
      imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
      descEn: 'American Walnut console storage cabinet.',
      descAr: 'خزانة جانبية كونسول من خشب الجوز الأمريكي.'
    },
    {
      id: 'dining-chair',
      nameEn: 'Lattice Dining Chair',
      nameAr: 'كرسي طعام لاتيس',
      imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80',
      descEn: 'Steam-bent backrest chair for elegant seating.',
      descAr: 'كرسي بمسند ظهر منحني بالبخار لجلوس أنيق.'
    },
    {
      id: 'wall-shelving',
      nameEn: 'Driftwood Wall Shelving',
      nameAr: 'أرفف دريفتوود الجدارية',
      imageUrl: 'https://images.unsplash.com/photo-1594636797501-ef436e11851d?auto=format&fit=crop&w=600&q=80',
      descEn: 'Minimal floating shelves with hidden steel brackets.',
      descAr: 'أرفف معلقة بسيطة بحوامل مخفية.'
    }
  ];

  // Active choices for adding items
  const [visActiveItem, setVisActiveItem] = useState(furnitureOptions[0].id);
  const [visActiveTimber, setVisActiveTimber] = useState('oak');

  const timbers = [
    { id: 'oak', nameEn: 'Natural Oak', nameAr: 'بلوط طبيعي', hex: '#C99A63' },
    { id: 'walnut', nameEn: 'American Walnut', nameAr: 'جوز أمريكي', hex: '#6B4226' },
    { id: 'espresso', nameEn: 'Espresso Stained Ash', nameAr: 'خشب رماد إسبريسو', hex: '#3A2A1E' },
    { id: 'charcoal', nameEn: 'Charcoal Oak', nameAr: 'بلوط فحم داكن', hex: '#2C2824' },
    { id: 'teak', nameEn: 'Burmese Teak', nameAr: 'تيك بورمي', hex: '#A06A42' },
    { id: 'maple', nameEn: 'Hard Maple', nameAr: 'خشب قيقب صلب', hex: '#EEDEC6' },
    { id: 'cherry', nameEn: 'American Cherry', nameAr: 'خشب كرز أمريكي دافئ', hex: '#9C4C38' }
  ];

  // Get dynamic CSS tint filter based on wood type
  const getTimberFilter = (timberId: string) => {
    switch (timberId) {
      case 'walnut':
        return 'sepia(0.35) saturate(0.85) hue-rotate(-15deg) brightness(0.65) contrast(1.1)';
      case 'espresso':
        return 'sepia(0.25) saturate(0.6) hue-rotate(-20deg) brightness(0.4) contrast(1.1)';
      case 'charcoal':
        return 'grayscale(1) brightness(0.3) contrast(1.15)';
      case 'teak':
        return 'sepia(0.4) saturate(1.25) hue-rotate(2deg) brightness(0.85)';
      case 'maple':
        return 'sepia(0.15) saturate(0.7) brightness(1.2) contrast(0.95)';
      case 'cherry':
        return 'sepia(0.5) saturate(1.35) hue-rotate(-30deg) brightness(0.75) contrast(1.05)';
      default: // oak: natural
        return 'sepia(0.2) saturate(1.1) brightness(1)';
    }
  };

  // Add selected item to the room
  const handleAddItemToRoom = () => {
    const furniture = furnitureOptions.find(f => f.id === visActiveItem) || furnitureOptions[0];
    const newItem: PlacedItem = {
      id: `${furniture.id}-${Date.now()}`,
      productId: furniture.id,
      nameEn: furniture.nameEn,
      nameAr: furniture.nameAr,
      imageUrl: furniture.imageUrl,
      timberId: visActiveTimber,
      x: 50, // default center
      y: 50,
      scale: 1.0,
      rotation: 0,
      brightness: 1.0,
      contrast: 1.0,
      shadowOpacity: 0.35,
      isFlipped: false
    };

    setPlacedItems([...placedItems, newItem]);
    setSelectedItemId(newItem.id);
  };

  // Handle room photo upload
  const handleRoomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCustomRoomBg(event.target.result as string);
        setActiveRoomBg(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop implementation
  const dragStartInfo = useRef<{
    itemId: string;
    startX: number;
    startY: number;
    startMouseX: number;
    startMouseY: number;
  } | null>(null);

  const handleItemDragStart = (e: React.MouseEvent | React.TouchEvent, item: PlacedItem) => {
    e.stopPropagation();
    setSelectedItemId(item.id);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragStartInfo.current = {
      itemId: item.id,
      startX: item.x,
      startY: item.y,
      startMouseX: clientX,
      startMouseY: clientY
    };

    // Attach listeners globally
    document.addEventListener('mousemove', handleItemDragMove);
    document.addEventListener('touchmove', handleItemDragMove, { passive: false });
    document.addEventListener('mouseup', handleItemDragEnd);
    document.addEventListener('touchend', handleItemDragEnd);
  };

  const handleItemDragMove = (e: MouseEvent | TouchEvent) => {
    if (!dragStartInfo.current || !canvasRef.current) return;

    // Prevent default scrolling on mobile when dragging
    if (e.cancelable) e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - dragStartInfo.current.startMouseX;
    const deltaY = clientY - dragStartInfo.current.startMouseY;

    const canvasWidth = canvasRef.current.clientWidth;
    const canvasHeight = canvasRef.current.clientHeight;

    const pctDeltaX = (deltaX / canvasWidth) * 100;
    const pctDeltaY = (deltaY / canvasHeight) * 100;

    let nextX = dragStartInfo.current.startX + pctDeltaX;
    let nextY = dragStartInfo.current.startY + pctDeltaY;

    // Keep item origin center inside canvas bounds
    nextX = Math.max(5, Math.min(95, nextX));
    nextY = Math.max(5, Math.min(95, nextY));

    setPlacedItems(prev =>
      prev.map(item =>
        item.id === dragStartInfo.current!.itemId
          ? { ...item, x: nextX, y: nextY }
          : item
      )
    );
  };

  const handleItemDragEnd = () => {
    dragStartInfo.current = null;
    document.removeEventListener('mousemove', handleItemDragMove);
    document.removeEventListener('touchmove', handleItemDragMove);
    document.removeEventListener('mouseup', handleItemDragEnd);
    document.removeEventListener('touchend', handleItemDragEnd);
  };

  // Selected item operations
  const activeItem = placedItems.find(item => item.id === selectedItemId);

  const updateActiveItem = (key: keyof PlacedItem, value: any) => {
    if (!selectedItemId) return;
    setPlacedItems(prev =>
      prev.map(item =>
        item.id === selectedItemId
          ? { ...item, [key]: value }
          : item
      )
    );
  };

  const handleDeleteItem = () => {
    if (!selectedItemId) return;
    setPlacedItems(prev => prev.filter(item => item.id !== selectedItemId));
    setSelectedItemId(null);
  };

  const handleBringToFront = () => {
    if (!selectedItemId) return;
    const target = placedItems.find(item => item.id === selectedItemId);
    if (!target) return;
    setPlacedItems(prev => [...prev.filter(item => item.id !== selectedItemId), target]);
  };

  const handleSendToBack = () => {
    if (!selectedItemId) return;
    const target = placedItems.find(item => item.id === selectedItemId);
    if (!target) return;
    setPlacedItems(prev => [target, ...prev.filter(item => item.id !== selectedItemId)]);
  };

  // -------------------------------------------------------------
  // HTML2CANVAS & IMAGE DOWNLOAD EXPORT
  // -------------------------------------------------------------
  const [isSavingDesign, setIsSavingDesign] = useState(false);

  const handleDownloadDesign = () => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    setIsSavingDesign(true);

    // Call html2canvas from CDN global
    const html2canvas = (window as any).html2canvas;
    if (!html2canvas) {
      alert(locale === 'ar' ? 'جاري تحميل برنامج الحفظ، يرجى المحاولة مرة أخرى.' : 'Loading export scripts, please try again.');
      setIsSavingDesign(false);
      return;
    }

    // Capture canvas
    html2canvas(canvasRef.current, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false
    }).then((canvas: HTMLCanvasElement) => {
      const link = document.createElement('a');
      link.download = `pacific-carpentry-design-${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsSavingDesign(false);
    }).catch((err: any) => {
      console.error(err);
      setIsSavingDesign(false);
    });
  };

  const handleExportPDF = async () => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    setIsSavingDesign(true);

    const html2canvas = (window as any).html2canvas;
    const jspdf = (window as any).jspdf;

    if (!html2canvas || !jspdf) {
      alert(locale === 'ar' ? 'جاري تحميل ملفات التصدير، يرجى المحاولة مرة أخرى.' : 'Loading PDF library, please try again.');
      setIsSavingDesign(false);
      return;
    }

    try {
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const { jsPDF } = jspdf;
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      // 3. Branded Header Block
      doc.setFillColor(24, 19, 16); // Brand dark Hex #181310
      doc.rect(0, 0, 210, 35, 'F');

      doc.setTextColor(237, 230, 216); // Cream Hex #EDE6D8
      doc.setFont('times', 'bold');
      doc.setFontSize(18);
      doc.text('PACIFIC CARPENTRY', 15, 18);
      
      doc.setFont('times', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(154, 139, 115); // Muted Hex #9A8B73
      doc.text('HEIRLOOM FURNITURE · DUBAI, UAE', 15, 23);

      doc.setTextColor(237, 230, 216);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`DATE: ${new Date().toLocaleDateString()}`, 155, 18);
      doc.text(`EXPORT ID: PLAN-${Math.floor(1000 + Math.random() * 9000)}`, 155, 23);

      // 4. Capture screenshot
      const canvasWidth = 180;
      const canvasHeight = (canvas.height * canvasWidth) / canvas.width;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(36, 28, 19);
      doc.text('Your Custom Room Layout:', 15, 50);

      doc.setDrawColor(234, 227, 213);
      doc.rect(14.5, 54.5, canvasWidth + 1, canvasHeight + 1);
      doc.addImage(imgData, 'JPEG', 15, 55, canvasWidth, canvasHeight);

      // 5. Placed Items
      let currentY = 55 + canvasHeight + 15;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(36, 28, 19);
      doc.text('Selected Timber Items:', 15, currentY);
      currentY += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(90, 80, 67);

      placedItems.forEach((item, i) => {
        const timber = timbers.find(t => t.id === item.timberId);
        const timberName = timber?.nameEn || item.timberId;
        doc.text(`${i + 1}. ${item.nameEn} — Finish: ${timberName}`, 20, currentY);
        currentY += 6;
      });

      // 6. Footer note
      doc.setDrawColor(234, 227, 213);
      doc.line(15, 275, 195, 275);
      
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(170, 155, 133);
      doc.text('Show this room plan to our team to obtain a final custom price quote.', 15, 281);
      doc.text('Pacific Carpentry Workshop — Dubai Al Quoz Industrial Area, UAE', 120, 281);

      doc.save(`pacific-carpentry-layout-${Date.now()}.pdf`);
      setIsSavingDesign(false);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF layout.');
      setIsSavingDesign(false);
    }
  };

  // -------------------------------------------------------------
  // QUOTE REQUEST MODAL & ACTION
  // -------------------------------------------------------------
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteName, setQuoteName] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState('');
  const [quoteErrorMsg, setQuoteErrorMsg] = useState('');

  const handleRequestQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (placedItems.length === 0) return;

    setIsSubmittingQuote(true);
    setQuoteErrorMsg('');
    setQuoteSuccessMsg('');

    try {
      // 1. Compile visual summary
      const itemsList = placedItems.map(item => {
        const timber = timbers.find(t => t.id === item.timberId);
        return `${item.nameEn} (${timber?.nameEn || item.timberId})`;
      }).join(', ');

      const detailedNotes = `[Visualize in My Room Design Submission]
Items Placed:
${placedItems.map((item, i) => `- ${i + 1}. ${item.nameEn} (${timbers.find(t => t.id === item.timberId)?.nameEn}) at x:${item.x.toFixed(0)}%, y:${item.y.toFixed(0)}% (Scale: ${item.scale}, Rotation: ${item.rotation}°)`).join('\n')}

Customer Sizing & Project Notes:
${quoteNotes}`;

      let uploadedImageUrl: string | null = null;

      // 2. Generate and upload Canvas screenshot if possible
      const html2canvas = (window as any).html2canvas;
      if (html2canvas && canvasRef.current) {
        const captureCanvas = await html2canvas(canvasRef.current, {
          useCORS: true,
          allowTaint: true,
          logging: false
        });

        const imageBlob = await new Promise<Blob | null>((resolve) => {
          captureCanvas.toBlob((blob: Blob | null) => resolve(blob), 'image/jpeg', 0.8);
        });

        if (imageBlob) {
          const file = new File([imageBlob], 'room_plan.jpg', { type: 'image/jpeg' });
          const formData = new FormData();
          formData.append('file', file);

          const uploadRes = await uploadImageAction(formData);
          if (uploadRes.success && uploadRes.url) {
            uploadedImageUrl = uploadRes.url;
          }
        }
      }

      // 3. Call DB Server Action
      const submitRes = await submitBespokeRequestAction({
        fullName: quoteName,
        email: quoteEmail,
        phone: quotePhone,
        category: 'Visualize Room',
        timber: 'Multiple Finishes',
        dimensions: itemsList,
        notes: detailedNotes,
        images: uploadedImageUrl ? [uploadedImageUrl] : []
      });

      if (submitRes.success && submitRes.referenceNo) {
        setReferenceNo(submitRes.referenceNo);
        setQuoteSuccessMsg(tVis('quoteSent'));
        setPlacedItems([]);
        setSelectedItemId(null);
        // Clear inputs
        setQuoteNotes('');
      } else {
        setQuoteErrorMsg(submitRes.error || 'Failed to submit quote request.');
      }
    } catch (err) {
      console.error(err);
      setQuoteErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const [referenceNo, setReferenceNo] = useState('');

  const handleWhatsAppForward = () => {
    const managerPhone = process.env.NEXT_PUBLIC_MANAGER_WHATSAPP || '+971501234567';
    const itemsList = placedItems.map(item => {
      const timber = timbers.find(t => t.id === item.timberId);
      return `${item.nameEn} (${timber?.nameEn || item.timberId})`;
    }).join(', ');
    const msg = `Hello Pacific Carpentry, I have submitted a bespoke quote request from the 3D visualizer:
Reference No: ${referenceNo}
Customer Name: ${quoteName}
Category: Visualize Room Layout
Sizing & Layout: ${itemsList}
Notes: ${quoteNotes || 'None'}`;
    const url = `https://wa.me/${managerPhone.replace(/[\s+-]+/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-bg text-cream min-h-screen">
      {/* CDN html2canvas library */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        strategy="lazyOnload"
      />
      {/* CDN jsPDF library */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        strategy="lazyOnload"
      />
      {/* Google's web components script for 3D model-viewer AR activation */}
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        strategy="afterInteractive"
      />

      {/* Page Header */}
      <header className="pt-[calc(74px+48px)] md:pt-[calc(74px+clamp(48px,7vw,90px))] pb-8 px-6 md:px-12 lg:px-[72px] max-w-[1280px] mx-auto text-start">
        <span className="text-[12px] font-semibold tracking-[0.24em] text-wood uppercase">
          — {tNav('showroom')}
        </span>

        {/* Toggle Slider Tabs */}
        <div className="flex items-center gap-1 mt-6 border border-cream/10 bg-cream/[0.01] p-1 rounded-[3px] max-w-[420px]">
          <button
            onClick={() => setActiveTab('showroom')}
            className={`flex-1 text-center py-2.5 text-xs font-bold tracking-wider uppercase cursor-pointer rounded-[2px] transition-all duration-300 ${activeTab === 'showroom'
              ? 'bg-wood text-bg font-black shadow-md'
              : 'text-cream/60 hover:text-cream'
              }`}
          >
            {tVis('tabShowroom')}
          </button>
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`flex-1 text-center py-2.5 text-xs font-bold tracking-wider uppercase cursor-pointer rounded-[2px] transition-all duration-300 ${activeTab === 'visualizer'
              ? 'bg-wood text-bg font-black shadow-md'
              : 'text-cream/60 hover:text-cream'
              }`}
          >
            {tVis('tabVisualize')}
          </button>
        </div>
      </header>

      {/* -------------------------------------------------------------
          TAB 1: 3D INTERACTIVE SHOWROOM
          ------------------------------------------------------------- */}
      {activeTab === 'showroom' && (
        <main className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-8 md:gap-14">
            {/* Controls Sidebar */}
            <div className="flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                {/* Product Selector */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold tracking-[0.15em] text-wood uppercase block text-start">
                    Select Design
                  </span>
                  <div className="flex flex-col gap-2">
                    {items3D.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveItem3D(item.id)}
                        className={`p-4 text-start border rounded-[3px] transition-all duration-300 cursor-pointer ${item.id === activeItem3D
                          ? 'bg-cream/[0.035] border-wood text-cream-bright shadow-lg shadow-black/20'
                          : 'bg-transparent border-cream/10 hover:border-cream/35 hover:bg-cream/[0.015]'
                          }`}
                      >
                        <h3 className="font-serif font-semibold text-lg leading-tight">
                          {locale === 'ar' ? item.nameAr : item.nameEn}
                        </h3>
                        <p className="text-xs text-cream/60 mt-1 font-light leading-relaxed">
                          {locale === 'ar' ? item.descAr : item.descEn}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timber Selection */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold tracking-[0.15em] text-wood uppercase block text-start">
                    {tDetail('color')}
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {timbers3D.map((timber) => (
                      <button
                        key={timber.id}
                        onClick={() => setActiveTimber3D(timber.id)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 border rounded-[2px] text-xs font-semibold tracking-[0.03em] transition-all duration-200 cursor-pointer ${timber.id === activeTimber3D
                          ? 'bg-cream/[0.045] border-wood text-cream'
                          : 'border-cream/10 hover:border-cream/30 text-cream/70'
                          }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner"
                          style={{ backgroundColor: timber.hex }}
                        />
                        {locale === 'ar' ? timber.nameAr : timber.nameEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3D Configurator Dimensions */}
                <div className="space-y-4 pt-5 border-t border-cream/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-[0.15em] text-wood uppercase block text-start">
                      {locale === 'ar' ? 'تعديل الأبعاد' : 'Adjust Dimensions'}
                    </span>
                    <button 
                      onClick={() => setShowGrid3D(!showGrid3D)}
                      className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-[2px] transition-colors border cursor-pointer ${
                        showGrid3D 
                          ? 'bg-wood text-bg border-wood' 
                          : 'border-cream/10 text-cream/60 hover:text-cream hover:border-cream/30'
                      }`}
                    >
                      {showGrid3D 
                        ? (locale === 'ar' ? 'إخفاء الشبكة' : 'Hide Grid') 
                        : (locale === 'ar' ? 'إظهار الشبكة' : 'Show Grid')}
                    </button>
                  </div>
                  
                  {/* Scale X (Length) */}
                  <div className="space-y-1.5 text-start">
                    <div className="flex justify-between text-xs">
                      <span className="text-cream/80">{locale === 'ar' ? 'الطول' : 'Length'}</span>
                      <span className="text-wood font-mono font-semibold">x{scaleX.toFixed(2)}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="1.5" 
                      step="0.05"
                      value={scaleX} 
                      onChange={(e) => setScaleX(parseFloat(e.target.value))}
                      className="w-full accent-wood bg-cream/10 h-1 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Scale Y (Height) */}
                  <div className="space-y-1.5 text-start">
                    <div className="flex justify-between text-xs">
                      <span className="text-cream/80">{locale === 'ar' ? 'الارتفاع' : 'Height'}</span>
                      <span className="text-wood font-mono font-semibold">x{scaleY.toFixed(2)}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="1.5" 
                      step="0.05"
                      value={scaleY} 
                      onChange={(e) => setScaleY(parseFloat(e.target.value))}
                      className="w-full accent-wood bg-cream/10 h-1 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Scale Z (Width/Depth) */}
                  <div className="space-y-1.5 text-start">
                    <div className="flex justify-between text-xs">
                      <span className="text-cream/80">{locale === 'ar' ? 'العرض / العمق' : 'Depth / Width'}</span>
                      <span className="text-wood font-mono font-semibold">x{scaleZ.toFixed(2)}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="1.5" 
                      step="0.05"
                      value={scaleZ} 
                      onChange={(e) => setScaleZ(parseFloat(e.target.value))}
                      className="w-full accent-wood bg-cream/10 h-1 rounded-lg cursor-pointer"
                    />
                  </div>
                  
                  {/* Reset Button */}
                  <button
                    onClick={() => {
                      setScaleX(1.0);
                      setScaleY(1.0);
                      setScaleZ(1.0);
                    }}
                    className="w-full py-2 border border-cream/15 hover:border-cream/35 text-cream/70 hover:text-cream text-[10px] font-bold uppercase tracking-wider rounded-[2px] transition-all cursor-pointer"
                  >
                    {locale === 'ar' ? 'إعادة ضبط الأبعاد الافتراضية' : 'Reset to Default Scale'}
                  </button>
                </div>
              </div>

              {/* Desktop Mobile AR Handoff Widget */}
              {qrCodeUrl && (
                <div className="hidden lg:flex items-center gap-5 p-4.5 bg-cream/[0.015] border border-cream/10 rounded-[3px] text-start">
                  <img
                    src={qrCodeUrl}
                    alt="Scan to Visualize in AR"
                    className="w-[110px] h-[110px] object-contain rounded-[2px] bg-white p-1 border border-cream/20 shadow-md shrink-0"
                  />
                  <div className="space-y-1.5">
                    <h4 className="font-serif font-semibold text-sm text-cream-bright">
                      Visualize in Your Room
                    </h4>
                    <p className="text-[11px] text-cream/70 leading-relaxed font-light">
                      Scan this QR code with your mobile phone camera to launch WebAR. You will be able to place this furniture item at 1:1 scale directly on your floor.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive 3D Model Viewer Container */}
            <div className="space-y-4">
              <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-cream/[0.015] border border-cream/10 rounded-[3px] shadow-2xl shadow-black/10 overflow-hidden flex items-center justify-center">
                <Configurator3D
                  modelUrl={selectedItem3D.modelUrl}
                  timberId={activeTimber3D}
                  scaleX={scaleX}
                  scaleY={scaleY}
                  scaleZ={scaleZ}
                  showGrid={showGrid3D}
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-bg/85 backdrop-blur-sm px-4 py-2 border border-cream/5 rounded-[2px] text-[10px] font-bold tracking-[0.1em] text-cream/65 uppercase select-none pointer-events-none z-10">
                  Drag to Rotate · Scroll to Zoom
                </div>
              </div>

              {/* AR Camera Button */}
              <div className="w-full">
                <button
                  onClick={() => {
                    if (isMobile) {
                      // Trigger hidden model-viewer AR
                      const arBtn = document.getElementById('hidden-ar-button');
                      if (arBtn) {
                        arBtn.click();
                      } else {
                        alert(locale === 'ar' ? 'عذراً، لا يدعم جهازك الواقع المعزز.' : 'AR is not supported on this device.');
                      }
                    } else {
                      setShowQrModal(true);
                    }
                  }}
                  className="w-full py-4 bg-wood hover:bg-wood/90 text-bg font-bold rounded-[3px] text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-wood/10 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {locale === 'ar' ? 'عرض في غرفتك بالكامل (كاميرا AR)' : 'View in Your Room (AR Camera)'}
                </button>

                {/* Hidden model-viewer for mobile AR launch */}
                <div className="hidden">
                  <model-viewer
                    id="hidden-viewer"
                    src={selectedItem3D.modelUrl}
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    alt="AR Model Launcher"
                    style={{ width: '1px', height: '1px' }}
                  >
                    <button 
                      slot="ar-button" 
                      id="hidden-ar-button" 
                    />
                  </model-viewer>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* -------------------------------------------------------------
          TAB 2: 2D ROOM PLANNER
          ------------------------------------------------------------- */}
      {activeTab === 'visualizer' && (
        <main className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] pb-24">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_2.1fr] gap-8 md:gap-12 items-start">

            {/* PLANNER SIDEBAR CONTROLS */}
            <div className="space-y-6 text-start">

              {/* 1. SELECT ROOM BACKGROUND */}
              <div className="border border-cream/10 bg-cream/[0.01] p-5 rounded-[3px] space-y-4">
                <span className="text-[11px] font-bold tracking-[0.15em] text-wood uppercase block">
                  {tVis('selectRoom')}
                </span>

                {/* Sample Rooms Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {sampleRooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => {
                        setCustomRoomBg(null);
                        setActiveRoomBg(room.url);
                      }}
                      className={`relative aspect-[3/2] rounded-[2px] overflow-hidden border cursor-pointer group transition-all duration-300 ${activeRoomBg === room.url && !customRoomBg
                        ? 'border-wood shadow-md shadow-wood/10'
                        : 'border-cream/10 opacity-70 hover:opacity-100 hover:border-cream/30'
                        }`}
                    >
                      <img src={room.url.replace('w=1200', 'w=250').replace('q=80', 'q=60')} alt={room.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-1.5 text-center">
                        <span className="text-[10px] font-semibold text-cream leading-tight">
                          {locale === 'ar' ? room.nameAr : room.nameEn}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Upload Custom Room Photo */}
                <div className="pt-2">
                  <label className="flex flex-col items-center justify-center border border-dashed border-cream/20 bg-cream/[0.015] hover:bg-cream/[0.03] hover:border-wood/50 p-4 rounded-[2px] cursor-pointer transition-colors text-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleRoomUpload}
                    />
                    <span className="text-[11px] font-bold tracking-[0.02em] text-cream">
                      {tVis('uploadRoom')}
                    </span>
                    <span className="text-[9.5px] text-faint mt-0.5">
                      {tVis('uploadRoomHelp')}
                    </span>
                  </label>
                </div>
              </div>

              {/* 2. CHOOSE FURNITURE & FINISH */}
              <div className="border border-cream/10 bg-cream/[0.01] p-5 rounded-[3px] space-y-4">
                <span className="text-[11px] font-bold tracking-[0.15em] text-wood uppercase block">
                  {tVis('selectFurniture')}
                </span>

                {/* Furniture list */}
                <div className="space-y-2">
                  {furnitureOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setVisActiveItem(opt.id)}
                      className={`w-full flex items-center gap-3.5 p-2.5 rounded-[2px] border text-start transition-all cursor-pointer ${visActiveItem === opt.id
                        ? 'border-wood bg-wood/[0.04]'
                        : 'border-cream/10 bg-transparent hover:border-cream/30'
                        }`}
                    >
                      <img src={opt.imageUrl.replace('w=600', 'w=100').replace('q=80', 'q=50')} alt={opt.nameEn} className="w-[52px] h-[52px] object-cover bg-white p-0.5 rounded border border-cream/10 shrink-0" />
                      <div className="leading-tight">
                        <h4 className="font-serif font-semibold text-[14px] text-cream-bright">
                          {locale === 'ar' ? opt.nameAr : opt.nameEn}
                        </h4>
                        <p className="text-[10px] text-cream/55 font-light leading-relaxed mt-0.5">
                          {locale === 'ar' ? opt.descAr : opt.descEn}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Timber Finish */}
                <div className="space-y-2 pt-2 border-t border-line/40">
                  <span className="text-[10px] font-bold tracking-[0.1em] text-muted uppercase block">
                    {tVis('timberColor')}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {timbers.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setVisActiveTimber(t.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-[2px] text-[10px] font-semibold transition-all cursor-pointer ${visActiveTimber === t.id
                          ? 'border-wood bg-cream/[0.04] text-cream'
                          : 'border-cream/10 text-cream/70 hover:border-cream/30'
                          }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/15"
                          style={{ backgroundColor: t.hex }}
                        />
                        {locale === 'ar' ? t.nameAr : t.nameEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to Room Button */}
                <button
                  onClick={handleAddItemToRoom}
                  className="w-full bg-wood hover:bg-woodSoft text-bg py-3 text-xs font-bold tracking-[0.12em] uppercase rounded-[2px] cursor-pointer transition-colors duration-250 mt-2 block"
                >
                  {tVis('addToRoom')}
                </button>
              </div>

            </div>

            {/* INTERACTIVE WORKSPACE CANVAS */}
            <div className="space-y-6 text-start">

              {/* Canvas Header Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-medium text-xl text-cream-bright">
                    {tVis('workspaceTitle')}
                  </h3>
                  <span className="text-[11px] text-faint leading-normal block mt-1 font-light">
                    {tVis('dragHelp')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Reset canvas */}
                  <button
                    onClick={() => {
                      setPlacedItems([]);
                      setSelectedItemId(null);
                    }}
                    disabled={placedItems.length === 0}
                    className="border border-cream/10 hover:border-red-400/50 text-cream hover:text-red-300/90 text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-[2px] transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                  >
                    {tVis('reset')}
                  </button>

                  {/* Save visualisation */}
                  <button
                    onClick={handleDownloadDesign}
                    disabled={placedItems.length === 0 || isSavingDesign}
                    className="bg-cream/[0.03] hover:bg-cream/[0.06] border border-cream/15 text-cream text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-[2px] transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
                  >
                    {isSavingDesign ? '...' : (locale === 'ar' ? 'تحميل الصورة' : 'Download JPG')}
                  </button>

                  {/* Export PDF */}
                  <button
                    onClick={handleExportPDF}
                    disabled={placedItems.length === 0 || isSavingDesign}
                    className="bg-[#9A6E3A] hover:bg-[#85602F] border border-none text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-[2px] transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
                  >
                    {isSavingDesign ? '...' : (locale === 'ar' ? 'تصدير PDF' : 'Export PDF')}
                  </button>
                </div>
              </div>

              {/* Actual Room Planner Canvas Area */}
              <div
                ref={canvasRef}
                className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-zinc-900 border border-cream/10 rounded-[3px] shadow-2xl overflow-hidden select-none bg-cover bg-center transition-all duration-300"
                style={{ backgroundImage: `url(${activeRoomBg})` }}
                onClick={() => setSelectedItemId(null)}
              >
                {/* Empty Canvas Placeholder */}
                {placedItems.length === 0 && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                    <p className="text-cream/60 max-w-[340px] text-xs font-light leading-relaxed">
                      {tVis('noItems')}
                    </p>
                  </div>
                )}

                {/* Render Placed Items */}
                {placedItems.map((item) => {
                  const isSelected = item.id === selectedItemId;
                  return (
                    <div
                      key={item.id}
                      className={`absolute cursor-move select-none p-1.5 transition-shadow duration-200`}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        width: '24%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: isSelected ? 30 : 10,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItemId(item.id);
                      }}
                      onMouseDown={(e) => handleItemDragStart(e, item)}
                      onTouchStart={(e) => handleItemDragStart(e, item)}
                    >
                      {/* Selection Box border */}
                      {isSelected && (
                        <div className="absolute inset-0 border border-dashed border-wood/90 bg-wood/[0.02] rounded pointer-events-none animate-pulse z-40" />
                      )}

                      {/* Floor shadow gradient indicator (grounding) */}
                      <div
                        className="absolute bottom-1 left-[15%] right-[15%] h-[10px] bg-black/75 rounded-full blur-[4px] pointer-events-none transition-opacity duration-200"
                        style={{
                          opacity: item.shadowOpacity,
                          transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
                        }}
                      />

                      {/* Overlaid Furniture Image */}
                      <img
                        src={item.imageUrl}
                        alt={locale === 'ar' ? item.nameAr : item.nameEn}
                        className="w-full h-auto object-contain select-none pointer-events-none"
                        style={{
                          filter: `${getTimberFilter(item.timberId)} brightness(${item.brightness}) contrast(${item.contrast})`,
                          mixBlendMode: 'multiply',
                          transform: `scale(${item.scale}) rotate(${item.rotation}deg) ${item.isFlipped ? 'scaleX(-1)' : 'scaleX(1)'}`,
                          transformOrigin: 'center center',
                          transition: 'transform 0.1s ease-out'
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* ACTIVE ITEM OPTIONS CONTROL PANEL */}
              {activeItem && (
                <div className="border border-cream/10 bg-cream/[0.015] p-5 rounded-[3px] space-y-5 animate-pc-fade text-start">
                  <div className="flex justify-between items-center border-b border-line/40 pb-3">
                    <div>
                      <h4 className="font-serif font-semibold text-base text-cream-bright">
                        {tVis('settingsTitle')}
                      </h4>
                      <span className="text-[11px] text-faint font-light">
                        {locale === 'ar' ? activeItem.nameAr : activeItem.nameEn}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleBringToFront}
                        className="border border-cream/10 hover:border-cream/30 text-cream/70 hover:text-cream text-[10px] font-semibold uppercase px-2.5 py-1.5 rounded-[1px] cursor-pointer"
                        title="Bring to Front"
                      >
                        ▲
                      </button>
                      <button
                        onClick={handleSendToBack}
                        className="border border-cream/10 hover:border-cream/30 text-cream/70 hover:text-cream text-[10px] font-semibold uppercase px-2.5 py-1.5 rounded-[1px] cursor-pointer"
                        title="Send to Back"
                      >
                        ▼
                      </button>
                      <button
                        onClick={handleDeleteItem}
                        className="bg-red-950/40 hover:bg-red-900/60 border border-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-[2px] transition-colors cursor-pointer"
                      >
                        {tVis('remove')}
                      </button>
                    </div>
                  </div>

                  {/* Visual controls range inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

                    {/* Scale */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-cream">
                        <span>{tVis('scale')}</span>
                        <span className="text-wood font-mono">{(activeItem.scale * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.3"
                        max="1.7"
                        step="0.05"
                        value={activeItem.scale}
                        onChange={(e) => updateActiveItem('scale', Number(e.target.value))}
                        className="w-full accent-wood h-1 bg-cream/12 rounded cursor-pointer"
                      />
                    </div>

                    {/* Rotation */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-cream">
                        <span>{tVis('rotate')}</span>
                        <span className="text-wood font-mono">{activeItem.rotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={activeItem.rotation}
                        onChange={(e) => updateActiveItem('rotation', Number(e.target.value))}
                        className="w-full accent-wood h-1 bg-cream/12 rounded cursor-pointer"
                      />
                    </div>

                    {/* Brightness */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-cream">
                        <span>{tVis('brightness')}</span>
                        <span className="text-wood font-mono">{(activeItem.brightness * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.4"
                        max="1.6"
                        step="0.05"
                        value={activeItem.brightness}
                        onChange={(e) => updateActiveItem('brightness', Number(e.target.value))}
                        className="w-full accent-wood h-1 bg-cream/12 rounded cursor-pointer"
                      />
                    </div>

                    {/* Drop shadow */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-cream">
                        <span>{tVis('shadow')}</span>
                        <span className="text-wood font-mono">{(activeItem.shadowOpacity * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={activeItem.shadowOpacity}
                        onChange={(e) => updateActiveItem('shadowOpacity', Number(e.target.value))}
                        className="w-full accent-wood h-1 bg-cream/12 rounded cursor-pointer"
                      />
                    </div>

                  </div>

                  {/* Flip Horizontally toggle button */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => updateActiveItem('isFlipped', !activeItem.isFlipped)}
                      className={`px-4 py-2 border rounded-[2px] text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${activeItem.isFlipped
                        ? 'border-wood bg-wood/[0.08] text-cream-bright font-bold'
                        : 'border-cream/10 bg-transparent text-cream hover:border-cream/30'
                        }`}
                    >
                      {tVis('flip')}
                    </button>

                    {/* Item Timber selector switch */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted font-semibold uppercase">{tVis('timberColor')}:</span>
                      <select
                        value={activeItem.timberId}
                        onChange={(e) => updateActiveItem('timberId', e.target.value)}
                        className="bg-bg border border-cream/12 text-cream text-xs rounded px-2.5 py-1.5 outline-none focus:border-wood/70"
                      >
                        {timbers.map(t => (
                          <option key={t.id} value={t.id}>
                            {locale === 'ar' ? t.nameAr : t.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* REQUEST A QUOTE ACTION CARD */}
              {placedItems.length > 0 && (
                <div className="border border-wood/35 bg-wood/[0.03] p-5 rounded-[4px] flex flex-col md:flex-row items-center justify-between gap-5 text-start animate-pc-fade">
                  <div>
                    <h4 className="font-serif font-semibold text-lg text-cream-bright mb-1">
                      {locale === 'ar' ? 'اطلب عرض سعر لتصميم غرفتك' : 'Love this room layout?'}
                    </h4>
                    <p className="text-xs text-cream/70 leading-relaxed font-light max-w-[480px]">
                      {locale === 'ar'
                        ? 'أرسل مواصفات الأثاث وتفاصيل التصميم إلى الورشة. سنقوم بتقدير التكاليف وحساب الخصم للمجموعة الكاملة.'
                        : 'Submit your custom furniture selections to our workshop. We will review your sizes, wood specifications, and reply with a bundle price estimate.'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setQuoteErrorMsg('');
                      setQuoteSuccessMsg('');
                      setIsQuoteModalOpen(true);
                    }}
                    className="bg-wood hover:bg-woodSoft text-bg text-xs font-bold tracking-[0.1em] uppercase px-5 py-3.5 rounded-[2px] transition-colors cursor-pointer shrink-0"
                  >
                    {tVis('requestQuote')}
                  </button>
                </div>
              )}

            </div>

          </div>
        </main>
      )}

      {/* -------------------------------------------------------------
          QUOTE REQUEST MODAL OVERLAY
          ------------------------------------------------------------- */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-pc-fade">
          <div className="bg-bg border border-cream/15 max-w-[620px] w-full p-6 md:p-8 rounded-[4px] text-start space-y-6 max-h-[90vh] overflow-y-auto relative">

            {/* Close button */}
            <button
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-4 right-4 text-cream/50 hover:text-cream text-lg border-none bg-transparent cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Headers */}
            <div className="space-y-1">
              <h2 className="font-serif font-medium text-2xl text-cream-bright">
                {tVis('quoteModalTitle')}
              </h2>
              <p className="text-xs text-muted font-light leading-relaxed">
                {tVis('quoteModalSub')}
              </p>
            </div>

            {/* Success state */}
            {quoteSuccessMsg ? (
              <div className="space-y-6 text-center py-6">
                <div className="w-12 h-12 rounded-full border border-wood text-wood flex items-center justify-center text-xl font-serif mx-auto">
                  ✦
                </div>
                <p className="text-cream text-sm leading-relaxed max-w-[400px] mx-auto font-light">
                  {quoteSuccessMsg}
                </p>
                {referenceNo && (
                  <div className="bg-[#1A140F] border border-cream/10 px-5 py-3 rounded inline-block">
                    <span className="text-[10px] uppercase tracking-wider text-muted block mb-0.5">Reference No</span>
                    <span className="font-serif text-lg font-bold text-wood">{referenceNo}</span>
                  </div>
                )}

                <div className="flex flex-col gap-3 w-full max-w-[400px] mx-auto mt-4">
                  <button
                    onClick={handleWhatsAppForward}
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold uppercase py-3.5 rounded-[2px] transition-colors cursor-pointer flex items-center justify-center gap-2 border-none"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.714-1.46L0 24zm10.158-4.22c1.723.239 3.584-.03 5.109-.858l.366-.216 3.792.993-.999-3.693.235-.374c1.077-1.717 1.644-3.729 1.643-5.802.003-5.698-4.595-10.334-10.252-10.334-5.656 0-10.252 4.636-10.252 10.334-.002 2.155.657 4.254 1.897 6.035l.261.378-1.258 4.594 4.708-1.23.385.228c1.611.955 3.486 1.348 5.216 1.134z" />
                    </svg>
                    {locale === 'ar' ? 'إرسال عبر واتساب' : 'Share via WhatsApp'}
                  </button>
                  <a
                    href={`/${locale}/requests/${referenceNo}`}
                    className="w-full bg-wood hover:bg-woodSoft text-bg text-xs font-bold uppercase py-3.5 rounded-[2px] transition-colors cursor-pointer flex items-center justify-center font-semibold text-center"
                  >
                    {locale === 'ar' ? 'تتبع حالة الطلب والدفع' : 'Track & Pay Online'}
                  </a>
                  <button
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="w-full border border-cream/30 hover:border-cream text-cream hover:text-white text-xs font-bold uppercase py-3.5 rounded-[2px] transition-colors cursor-pointer"
                  >
                    {locale === 'ar' ? 'إغلاق نافذة المعاينة' : 'Close Window'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRequestQuoteSubmit} className="space-y-5">
                {quoteErrorMsg && (
                  <div className="border border-red-500/40 bg-red-500/[0.08] text-red-200 text-xs p-3 rounded">
                    {quoteErrorMsg}
                  </div>
                )}

                {/* Form fields */}
                <div className="space-y-4">

                  {/* Placed Items List (Read-only review) */}
                  <div className="bg-cream/[0.02] border border-cream/8 p-4 rounded-[2px] space-y-2">
                    <span className="text-[10.5px] font-bold tracking-wider text-muted uppercase block">
                      {tVis('placedItems')}
                    </span>
                    <ul className="text-xs space-y-1.5 text-cream/85 font-mono">
                      {placedItems.map((item, idx) => (
                        <li key={item.id} className="flex justify-between border-b border-line/20 pb-1 last:border-0 last:pb-0">
                          <span>{idx + 1}. {locale === 'ar' ? item.nameAr : item.nameEn}</span>
                          <span className="text-wood">({locale === 'ar' ? timbers.find(t => t.id === item.timberId)?.nameAr : timbers.find(t => t.id === item.timberId)?.nameEn})</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-muted block mb-1.5">
                        {locale === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                      </label>
                      <input
                        required
                        disabled={isSubmittingQuote}
                        type="text"
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-cream/[0.04] border border-cream/15 text-cream text-sm p-3.5 rounded-[2px] outline-none focus:border-wood/70"
                        value={quoteName}
                        onChange={(e) => setQuoteName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-muted block mb-1.5">
                        {locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                      </label>
                      <input
                        required
                        disabled={isSubmittingQuote}
                        type="email"
                        placeholder="name@example.com"
                        className="w-full bg-cream/[0.04] border border-cream/15 text-cream text-sm p-3.5 rounded-[2px] outline-none focus:border-wood/70"
                        value={quoteEmail}
                        onChange={(e) => setQuoteEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-muted block mb-1.5">
                      {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      required
                      disabled={isSubmittingQuote}
                      type="tel"
                      placeholder="+971 50 000 0000"
                      className="w-full bg-cream/[0.04] border border-cream/15 text-cream text-sm p-3.5 rounded-[2px] outline-none focus:border-wood/70"
                      value={quotePhone}
                      onChange={(e) => setQuotePhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-muted block mb-1.5">
                      {tVis('notesLabel')}
                    </label>
                    <textarea
                      rows={3}
                      disabled={isSubmittingQuote}
                      placeholder={tVis('notesPlaceholder')}
                      className="w-full bg-cream/[0.04] border border-cream/15 text-cream text-sm p-3.5 rounded-[2px] outline-none focus:border-wood/70 resize-none"
                      value={quoteNotes}
                      onChange={(e) => setQuoteNotes(e.target.value)}
                    />
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={isSubmittingQuote}
                  className="w-full bg-wood hover:bg-woodSoft text-bg py-4 text-xs font-bold tracking-wider uppercase rounded-[2px] cursor-pointer transition-colors"
                >
                  {isSubmittingQuote
                    ? (locale === 'ar' ? 'جاري رفع التصميم وإرساله...' : 'Uploading snapshot & sending...')
                    : tVis('submitQuote')}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* QR Code Modal for Desktop AR Launch */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-bg border border-cream/15 p-6 rounded-[3px] max-w-[400px] w-full text-center space-y-5 relative shadow-2xl">
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-3 right-3 text-cream/60 hover:text-cream cursor-pointer text-lg font-bold"
            >
              ✕
            </button>
            <h3 className="font-serif font-semibold text-lg text-cream-bright">
              {locale === 'ar' ? 'عرض في غرفتك (AR)' : 'Visualize in AR'}
            </h3>
            <p className="text-xs text-cream/70 leading-relaxed font-light">
              {locale === 'ar' 
                ? 'امسح رمز الاستجابة السريعة (QR) بكاميرا هاتفك لتشغيل الواقع المعزز ووضع هذه القطعة في غرفتك بمقاسها الحقيقي.' 
                : 'Scan this QR code with your mobile phone camera to launch WebAR. You will be able to place this furniture item at 1:1 scale directly on your floor.'}
            </p>
            {qrCodeUrl && (
              <div className="flex justify-center pt-2">
                <img
                  src={qrCodeUrl}
                  alt="Scan to Visualize in AR"
                  className="w-[180px] h-[180px] object-contain rounded-[2px] bg-white p-2 border border-cream/20 shadow-md"
                />
              </div>
            )}
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-wood text-bg font-bold text-xs uppercase tracking-wider rounded-[2px] hover:bg-wood/90 transition-colors cursor-pointer"
            >
              {locale === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
