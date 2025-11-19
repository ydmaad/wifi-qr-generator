'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { toJpeg, toPng } from 'html-to-image';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { CardPreview } from '@/components/wifi/card-preview';
import { getSafeContrastState } from '@/lib/color';
import { generateWifiQrDataUrl, getCardDimensions } from '@/lib/wifi';
import { cn } from '@/lib/utils';

const COLOR_PRESETS = ['#F4F1EB', '#F6FBFF', '#E8F5E9', '#FFF5F5', '#1F1F1F'];

const wifiFormSchema = z.object({
  brandName: z
    .string()
    .trim()
    .min(2, '브랜드 이름은 2자 이상이어야 합니다.')
    .max(24, '브랜드 이름은 24자 이하여야 합니다.'),
  ssid: z
    .string()
    .min(2, 'SSID는 2자 이상이어야 합니다.')
    .max(32, 'SSID는 32자 이하여야 합니다.')
    .regex(
      /^[A-Za-z0-9._-]+$/,
      'SSID는 공백 없이 영문/숫자와 _-. 만 사용할 수 있습니다.'
    ),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .max(32, '비밀번호는 32자 이하여야 합니다.')
    .regex(
      /^[\x20-\x7E]+$/,
      '비밀번호는 공백을 제외한 ASCII 문자만 허용됩니다.'
    ),
  backgroundColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/, 'HEX 형식(#RRGGBB)으로 입력해 주세요.'),
  downloadFormat: z.enum(['png', 'jpg']),
  scale: z.number().int().min(1).max(2),
});

type WifiFormValues = z.infer<typeof wifiFormSchema>;

const DEFAULT_VALUES: WifiFormValues = {
  brandName: '브랜드 이름',
  ssid: 'MyCafe_WiFi',
  password: 'password123',
  backgroundColor: '#F4F1EB',
  downloadFormat: 'png',
  scale: 2,
};

export const WifiDesigner = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const form = useForm<WifiFormValues>({
    resolver: zodResolver(wifiFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  const { control, handleSubmit, setValue, formState } = form;
  const watchedValues =
    (useWatch({ control }) as WifiFormValues | undefined) ?? DEFAULT_VALUES;
  const deferredValues = useDeferredValue(watchedValues);
  const selectedBackground = (
    form.watch('backgroundColor') ?? ''
  ).toUpperCase();

  const contrastState = useMemo(
    () => getSafeContrastState(deferredValues.backgroundColor),
    [deferredValues.backgroundColor]
  );

  useEffect(() => {
    let active = true;
    setQrError(null);

    generateWifiQrDataUrl({
      ssid: deferredValues.ssid,
      password: deferredValues.password,
      size: 240,
    })
      .then((url) => {
        if (!active) return;
        setQrDataUrl(url);
      })
      .catch(() => {
        if (!active) return;
        setQrError('QR 코드를 생성할 수 없어요.');
        setQrDataUrl(null);
      });

    return () => {
      active = false;
    };
  }, [deferredValues.ssid, deferredValues.password]);

  const handlePresetSelect = (hex: string) => {
    setValue('backgroundColor', hex, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleDownload = async (values: WifiFormValues) => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      const node = cardRef.current;
      const { scale, downloadFormat, backgroundColor } = values;
      const { width, height } = getCardDimensions(scale);
      const options = {
        cacheBust: true,
        backgroundColor,
        pixelRatio: scale,
        canvasWidth: width,
        canvasHeight: height,
      };

      const dataUrl =
        downloadFormat === 'png'
          ? await toPng(node, options)
          : await toJpeg(node, options);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${values.brandName || 'wifi-card'}.${downloadFormat}`;
      link.click();
    } catch (error) {
      console.error(error);
      setQrError('이미지 저장 중 문제가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(320px,420px)_1fr]">
      <form
        className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm"
        onSubmit={handleSubmit(handleDownload)}
      >
        <section className="space-y-4">
          <header>
            <p className="text-sm font-semibold text-muted-foreground">
              브랜드 & WiFi 정보
            </p>
          </header>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              브랜드 이름
            </label>
            <Input placeholder="브랜드 이름" {...form.register('brandName')} />
            {formState.errors.brandName && (
              <p className="text-xs text-destructive">
                {formState.errors.brandName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              네트워크 이름(SSID)
            </label>
            <Input placeholder="MyCafe_WiFi" {...form.register('ssid')} />
            {formState.errors.ssid && (
              <p className="text-xs text-destructive">
                {formState.errors.ssid.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              비밀번호
            </label>
            <Input
              type="password"
              placeholder="비밀번호"
              {...form.register('password')}
            />
            {formState.errors.password && (
              <p className="text-xs text-destructive">
                {formState.errors.password.message}
              </p>
            )}
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <header>
            <p className="text-sm font-semibold text-muted-foreground">
              카드 스타일
            </p>
          </header>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              배경색
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  aria-label={`${hex} 배경색 선택`}
                  onClick={() => handlePresetSelect(hex)}
                  className={cn(
                    'h-10 w-10 rounded-2xl border border-border shadow-sm transition hover:scale-105',
                    selectedBackground === hex ? 'ring-2 ring-primary' : ''
                  )}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            <Input
              placeholder="#F4F1EB"
              {...form.register('backgroundColor')}
            />
            {formState.errors.backgroundColor && (
              <p className="text-xs text-destructive">
                {formState.errors.backgroundColor.message}
              </p>
            )}
          </div>

          {!contrastState.qrSafe && (
            <Badge variant="destructive">
              QR 대비가 낮아요. 조금 더 진한 배경색을 선택해 주세요.
            </Badge>
          )}
        </section>

        <Separator />

        <section className="space-y-4">
          <header>
            <p className="text-sm font-semibold text-muted-foreground">
              출력 옵션
            </p>
          </header>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                이미지 형식
              </label>
              <Controller
                control={control}
                name="downloadFormat"
                render={({ field }) => (
                  <select
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    {...field}
                  >
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                  </select>
                )}
              />
            </div>

            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                배율
              </label>
              <Controller
                control={control}
                name="scale"
                render={({ field }) => (
                  <div className="flex h-10 items-center gap-2 rounded-md border border-input px-3">
                    {[1, 2].map((value) => (
                      <label
                        key={value}
                        className={cn(
                          'flex items-center gap-1 text-sm',
                          field.value === value ? 'font-semibold' : 'opacity-70'
                        )}
                      >
                        <input
                          type="radio"
                          className="accent-foreground"
                          value={value}
                          checked={field.value === value}
                          onChange={() => field.onChange(value)}
                        />
                        {value}x
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>
        </section>

        <Button
          className="w-full"
          type="submit"
          disabled={isDownloading || formState.isSubmitting}
        >
          {isDownloading ? '이미지 생성 중...' : 'PNG/JPG로 다운로드'}
        </Button>
      </form>

      <section className="flex flex-col gap-4">
        <div
          ref={cardRef}
          className="mx-auto w-64 max-w-full"
          style={{ aspectRatio: '3 / 4' }}
        >
          <CardPreview
            brandName={deferredValues.brandName}
            ssid={deferredValues.ssid}
            qrDataUrl={qrDataUrl}
            backgroundColor={contrastState.background}
            textColor={contrastState.text}
            qrSafe={contrastState.qrSafe}
            qrError={qrError}
          />
        </div>

        <div className="rounded-3xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          <p>
            입력값이 변경되면 즉시 미리보기가 갱신되며, 다운로드 시 3:4 비율의
            256px 카드를 최대 2배 스케일로 저장합니다.
          </p>
        </div>
      </section>
    </div>
  );
};
