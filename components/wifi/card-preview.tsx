import Image from 'next/image';

import { cn } from '@/lib/utils';

export interface CardPreviewProps {
  brandName: string;
  ssid: string;
  qrDataUrl: string | null;
  backgroundColor: string;
  textColor: string;
  qrSafe: boolean;
  qrError: string | null;
}

export const CardPreview = ({
  brandName,
  ssid,
  qrDataUrl,
  backgroundColor,
  textColor,
  qrSafe,
  qrError,
}: CardPreviewProps) => {
  return (
    <div
      className="relative flex size-full flex-col rounded-3xl border border-border p-4 shadow-sm transition-all"
      style={{ backgroundColor }}
      aria-live="polite"
    >
      <p
        className="text-center text-[10px] font-semibold uppercase tracking-[0.4em]"
        style={{ color: textColor }}
      >
        WIFI 접속
      </p>

      <div className="mt-3 flex flex-1 items-center justify-center">
        {qrDataUrl ? (
          <Image
            src={qrDataUrl}
            alt="WiFi QR 코드"
            width={176}
            height={176}
            className="rounded-xl border border-white/30 shadow-md"
            unoptimized
          />
        ) : (
          <p
            className="text-center text-xs"
            style={{ color: textColor, opacity: 0.85 }}
          >
            {qrError ?? 'QR 코드를 준비 중이에요'}
          </p>
        )}
      </div>

      <div className="mt-4 text-center">
        <p
          className="truncate text-base font-semibold uppercase"
          style={{ color: textColor }}
        >
          {brandName || '브랜드 이름'}
        </p>
        <p
          className="mt-1 truncate text-xs uppercase tracking-[0.1em]"
          style={{
            color: textColor,
            opacity: qrSafe ? 0.8 : 0.6,
          }}
        >
          {ssid || 'MyCafe_WiFi'}
        </p>
      </div>

      <span
        className={cn(
          'pointer-events-none select-none text-[10px] font-medium',
          'absolute bottom-4 right-4'
        )}
        style={{ color: textColor, opacity: 0.7 }}
      >
        by ydmaad
      </span>
    </div>
  );
};
