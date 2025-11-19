import QRCode from 'qrcode';

const WIFI_TEMPLATE = 'WIFI:T:WPA;S:{ssid};P:{password};;';
const ESCAPE_PATTERN = /([\\;,":])/g;

const escapeValue = (value: string) =>
  value.replace(ESCAPE_PATTERN, (match) => `\\${match}`);

export const buildWifiPayload = (ssid: string, password: string) => {
  if (!ssid.trim()) {
    throw new Error('SSID 값은 비워둘 수 없습니다.');
  }

  return WIFI_TEMPLATE.replace('{ssid}', escapeValue(ssid)).replace(
    '{password}',
    escapeValue(password)
  );
};

export interface GenerateQrOptions {
  ssid: string;
  password: string;
  size?: number;
}

export const generateWifiQrDataUrl = async ({
  ssid,
  password,
  size = 320,
}: GenerateQrOptions) => {
  const payload = buildWifiPayload(ssid, password);

  return QRCode.toDataURL(payload, {
    width: size,
    margin: 0,
    color: {
      dark: '#1F1F1F',
      light: '#FFFFFF00',
    },
  });
};

export const CARD_BASE_WIDTH = 256;
export const CARD_ASPECT_RATIO = 3 / 4;

export const getCardDimensions = (scale: number) => {
  const width = CARD_BASE_WIDTH * scale;
  const height = Math.round((width / 3) * 4);
  return { width, height };
};
