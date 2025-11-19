import { WifiDesigner } from '@/components/wifi/wifi-designer';

const Page = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto flex flex-col gap-8 px-6 py-12">
        <header className="space-y-4 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            WiFi QR 카드
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              3:4 미니멀 카드 디자이너
            </h1>
            <p className="text-sm text-muted-foreground">
              브랜드명, SSID, 비밀번호, 배경색을 입력하면 즉시 QR 카드가
              생성되고 PNG·JPG로 다운로드할 수 있습니다.
            </p>
          </div>
        </header>

        <WifiDesigner />
      </section>
    </main>
  );
};

export default Page;
