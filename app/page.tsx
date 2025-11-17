const highlights = [
  {
    title: '정돈된 구조',
    description: 'app router 기반 최소 파일 구성으로 시작 부담을 없앴습니다.',
  },
  {
    title: '스타일 가이드',
    description:
      '단일 CSS 파일에서 색상, 그리드, 버튼 토큰을 정의해 실험 속도를 높입니다.',
  },
  {
    title: '간단한 카피',
    description: 'README와 UI 모두 실제 프로젝트 설명으로 교체했습니다.',
  },
];

const nextSteps = [
  {
    label: '요구사항 정의',
    detail: 'README 템플릿을 따라 기능, API, UI 노트를 적어 보세요.',
  },
  {
    label: 'UI 설계',
    detail: '글로벌 토큰을 활용해 색상·타이포 일관성을 유지하세요.',
  },
  {
    label: '기능 구현',
    detail: 'app 디렉터리 아래에 feature 폴더를 만들고 실험을 분리하세요.',
  },
];

export default function Home() {
  return (
    <div className="home">
      <main className="shell">
        <section className="hero">
          <p className="eyebrow">Cursor AI Sandbox</p>
          <h1>필요한 것만 남긴 Next.js 실험실</h1>
          <p className="lede">
            기본 템플릿을 모두 치우고, 바로 기능을 만들 수 있도록 얇은 껍질만
            남겨둔 스타터입니다. 이 섹션을 프로젝트 소개로 자유롭게 바꿔 보세요.
          </p>
          <div className="actions">
            <a className="button primary" href="#guide">
              가이드 보기
            </a>
            <a
              className="button ghost"
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js 문서
            </a>
          </div>
        </section>

        <section id="guide" className="panel">
          <header className="panel-header">
            <div>
              <p className="eyebrow">구성 요소</p>
              <h2>스타터 하이라이트</h2>
            </div>
            <p className="muted">
              필요 없는 로고, CTA, 학습 링크를 제거하고 커스텀 카피만
              남겼습니다.
            </p>
          </header>
          <ul className="grid">
            {highlights.map((item) => (
              <li key={item.title} className="card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <header className="panel-header">
            <div>
              <p className="eyebrow">다음 단계</p>
              <h2>프로젝트 진행 순서</h2>
            </div>
            <p className="muted">
              아래 리스트를 자신의 워크플로에 맞춰 수정하면 체크리스트가 됩니다.
            </p>
          </header>
          <ol className="steps">
            {nextSteps.map((step) => (
              <li key={step.label}>
                <span className="step-label">{step.label}</span>
                <p>{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}
