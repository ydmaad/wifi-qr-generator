const HEX_PATTERN = /^#([A-Fa-f0-9]{6})$/;

const hexToChannel = (hex: string, start: number) =>
  parseInt(hex.slice(start, start + 2), 16) / 255;

const channelToLinear = (channel: number) =>
  channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);

export const parseHexColor = (hex: string) => {
  if (!HEX_PATTERN.test(hex)) {
    throw new Error('유효하지 않은 HEX 색상 값입니다.');
  }

  const normalized = hex.toUpperCase();
  const r = hexToChannel(normalized, 1);
  const g = hexToChannel(normalized, 3);
  const b = hexToChannel(normalized, 5);

  return { r, g, b };
};

export const calculateLuminance = (hex: string) => {
  const { r, g, b } = parseHexColor(hex);
  const linearR = channelToLinear(r);
  const linearG = channelToLinear(g);
  const linearB = channelToLinear(b);

  return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
};

export const getContrastRatio = (hexA: string, hexB: string) => {
  const lumA = calculateLuminance(hexA);
  const lumB = calculateLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);

  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
};

export const isContrastSafe = (background: string, foreground: string) =>
  getContrastRatio(background, foreground) >= 4.5;

export const isDarkBackground = (hex: string) => calculateLuminance(hex) < 0.5;

export const getReadableTextColor = (hex: string) =>
  isDarkBackground(hex) ? '#FFFFFF' : '#0F172A';

export const ensureHex = (value: string, fallback = '#F4F1EB') =>
  HEX_PATTERN.test(value) ? value.toUpperCase() : fallback;

export const getSafeContrastState = (background: string) => {
  const bg = ensureHex(background);
  const text = getReadableTextColor(bg);
  const qrSafe = isContrastSafe(bg, '#000000');

  return {
    background: bg,
    text,
    qrSafe,
  };
};
