import { Link } from '@/i18n/routing';

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  centered?: boolean;
}

export default function SectionHeader({
  kicker,
  title,
  subtitle,
  viewAllLink,
  viewAllText,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-2 mb-10 md:mb-12 ${
        centered ? 'items-center text-center' : 'items-start text-start'
      }`}
    >
      <div className="w-full flex justify-between items-end gap-6">
        <div className="flex flex-col gap-1.5 max-w-[620px]">
          {kicker && (
            <span className="text-[11px] md:text-[12px] font-semibold tracking-[0.2em] text-wood uppercase">
              {kicker}
            </span>
          )}
          <h2 className="font-serif font-medium text-3xl md:text-4xl text-cream-bright leading-tight whitespace-pre-line">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[14px] md:text-[15px] font-body font-light text-muted leading-relaxed mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {viewAllLink && viewAllText && (
          <Link
            href={viewAllLink}
            className="hidden sm:inline-flex items-center text-xs md:text-sm font-semibold tracking-[0.08em] text-wood hover:text-wood-soft uppercase border-b border-wood/30 hover:border-wood transition-all pb-0.5 whitespace-nowrap shrink-0"
          >
            {viewAllText}
          </Link>
        )}
      </div>

      {viewAllLink && viewAllText && (
        <div className="sm:hidden mt-2">
          <Link
            href={viewAllLink}
            className="inline-flex items-center text-xs font-semibold tracking-[0.08em] text-wood hover:text-wood-soft uppercase border-b border-wood/30 pb-0.5"
          >
            {viewAllText}
          </Link>
        </div>
      )}
    </div>
  );
}
