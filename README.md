# Cursor AI Sandbox

필요한 파일만 남긴 Next.js 16 실험용 베이스입니다. 기본 텍스트, 로고, 링크 등
boilerplate 요소를 모두 제거하고, 즉시 기능을 붙일 수 있는 상태로 정리했습니다.

## 사용 방법

```bash
npm install
npm run dev
```

개발 서버는 기본적으로 http://localhost:3000 에서 실행됩니다.

## 폴더 구조

- `app/page.tsx` – 소개/가이드 섹션이 포함된 메인 페이지
- `app/globals.css` – 색상, 레이아웃, 버튼 토큰을 정의한 단일 스타일 시트
- `app/layout.tsx` – 공통 메타데이터와 폰트 설정

## 커스터마이징 팁

1. Hero 섹션 문구를 실제 프로젝트 소개로 교체하세요.
2. `highlights`와 `nextSteps` 배열을 수정하면 카드와 체크리스트가 바로 갱신됩니다.
3. 필요하지 않은 경우 `next/font`를 제거하거나 원하는 폰트로 교체해도 됩니다.
