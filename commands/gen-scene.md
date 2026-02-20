# /gen-scene - Remotion 씬 코드 생성

스토리보드를 기반으로 Remotion 씬 컴포넌트 코드를 생성합니다.

## 참조 스킬
반드시 `~/.claude/skills/remotion-patterns.md`를 읽고 전체 적용합니다.

## 경로 규칙
- 영상 식별: `~/.claude/skills/video-orchestra.md` §3 (영상 식별 로직) 적용
- `{VIDEO}` = `videos/{category}/{name}/`

## 사용법
```
/gen-scene                     ← 전체 씬 코드 생성
/gen-scene [scene-id]          ← 특정 씬만 생성
/gen-scene [scene-id] loop N   ← N개 씬 연속 생성
/gen-scene --dry-run           ← 코드 생성 없이 구조만 확인
```

## 실행 절차
1. {VIDEO}/storyboard/ 에서 스토리보드 읽기
2. 씬별 React 컴포넌트 생성 ({VIDEO}/scenes/Scene{N}-{Name}.tsx)
3. CSS animation 사용 금지 — interpolate/spring만 사용
4. 영상 전용 컴포넌트 재활용 ({VIDEO}/components/)
5. {VIDEO}/Compositions.tsx에 Composition 등록
6. src/Root.tsx에 이 영상의 Compositions import 확인
7. 타입 안전성 확보 (TypeScript)

## 생성 파일
- `{VIDEO}/scenes/Scene{NN}-{Name}.tsx` — 씬 컴포넌트
- `{VIDEO}/components/{Name}.tsx` — 필요 시 영상 전용 컴포넌트
- `{VIDEO}/Compositions.tsx` 업데이트 — Composition 등록

## 핵심 규칙
- CSS animation/transition/keyframes 절대 금지
- useCurrentFrame() + interpolate()/spring() 만 사용
- 모든 시간 단위는 프레임 (초 x fps)
- 에셋은 staticFile()로 참조 (경로: `videos/{category}/{name}/...`)
- {VIDEO}/VIDEO.md Phase 3c 상태 업데이트

## GIF 리액션 통합
- `@remotion/gif` 패키지 사용 (`<Gif src="..." />`)
- 스토리보드에서 계획된 씬별 GIF URL을 적용
- GIPHY 직접 URL 사용 (API 키 불필요): `https://media{N}.giphy.com/media/{ID}/giphy.gif`
- 크기: 400x400px, 위치: 절대 배치 (right/left: 60, bottom: 80)
- fadeIn/fadeOut 15프레임으로 자연스럽게 등장/퇴장

## 사용 가능한 Remotion 확장 패키지
- `@remotion/gif` — GIF 프레임 동기화
- `@remotion/transitions` — 씬 전환 효과
- `@remotion/shapes` — SVG 도형
- `@remotion/paths` — SVG 경로 애니메이션
- `@remotion/noise` — Perlin 노이즈 효과
- `@remotion/motion-blur` — 모션 블러
- `@remotion/layout-utils` — 텍스트 크기 자동 조절
- `@remotion/lottie` — Lottie 애니메이션
- `@remotion/captions` — 자막 렌더링
