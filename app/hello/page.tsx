import { Badge } from '@/components/ui/badge';

const Page = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <section className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Shadcn Badge 예시</h1>
        <p className="text-muted-foreground">Badge 컴포넌트 variant 비교</p>
      </section>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </main>
  );
};

export default Page;
