# Claude Video Kit v2.0.0 (모노레포)

Claude Code 기반 비디오 프로덕션 오케스트레이터. Remotion + TypeScript로 모션그래픽/튜토리얼/설명 영상을 제작합니다.

**v2.0.0**: 모노레포 구조 — 하나의 프로젝트에서 모든 영상을 카테고리별로 관리합니다.

## 한눈에 보기

```
/video init tutorials/react-hooks
  → videos/tutorials/react-hooks/ 생성
  → 스크립트 → 스토리보드 → TTS(선택)
                                    ↓
     배포 준비 ← 렌더링 ← 에셋 통합 ← Remotion 씬 개발
```

---

## 설치

```bash
git clone https://github.com/user/claude-video-kit.git
cd claude-video-kit
chmod +x install.sh
./install.sh
```

`~/.claude/`에 skills 6개, commands 10개, agents 3개가 설치됩니다.

---

## 모노레포 구조

```
claude-video-kit/                    (git root, 단일 프로젝트)
├── package.json                     (공유 Remotion deps — 하나만!)
├── tsconfig.json
├── remotion.config.ts
│
├── src/
│   ├── index.ts                     (Remotion entry point)
│   ├── Root.tsx                     (마스터 — 모든 영상 Composition import)
│   └── shared/components/           (공유 컴포넌트)
│
├── videos/                          ★ 모든 영상 콘텐츠
│   ├── tutorials/
│   │   └── react-hooks/
│   │       ├── VIDEO.md             (진행 상태)
│   │       ├── plandata/            (기획)
│   │       ├── scripts/             (스크립트)
│   │       ├── storyboard/          (스토리보드)
│   │       ├── scenes/              (Remotion 씬 TSX)
│   │       ├── components/          (영상 전용 컴포넌트)
│   │       ├── Compositions.tsx     (Composition 정의)
│   │       └── publish/             (SEO 등 배포)
│   └── explainers/
│       └── ...
│
├── public/videos/{cat}/{name}/      (staticFile 에셋)
│   ├── narration/  bgm/  assets/
│
├── output/{cat}/{name}/             (렌더링 결과 — gitignored)
│   ├── video.mp4  shorts/  thumbnails/
│
├── VIDEO-INDEX.md                   (전체 영상 목록)
└── .current-video                   (현재 작업 영상)
```

### 경로 규칙

| 변수 | 경로 | 용도 |
|------|------|------|
| `{VIDEO}` | `videos/{category}/{name}/` | 기획, 스크립트, 씬 코드 |
| `{PUBLIC}` | `public/videos/{category}/{name}/` | Remotion staticFile 에셋 |
| `{OUTPUT}` | `output/{category}/{name}/` | 렌더링 결과 (gitignored) |

---

## 명령어 레퍼런스

### 프로젝트 관리

| 명령어 | 설명 |
|--------|------|
| `/video init [cat/name]` | 새 영상 초기화 (예: `tutorials/react-hooks`) |
| `/video select [cat/name]` | 현재 작업 영상 선택 |
| `/video list` | 전체 영상 목록 + 상태 표시 |
| `/video scan` | 현재 영상 분석 → VIDEO.md 자동 생성 |
| `/video status` | 현재 영상 진행 상태 확인 |

### 파이프라인 실행

| 명령어 | 설명 |
|--------|------|
| `/video next` | 다음 미완료 단계 자동 실행 |
| `/video next N` | N개 단계 연속 실행 |
| `/video phase [id]` | 특정 단계만 실행 (예: `1b`, `3c`) |
| `/video sync` | 산출물 동기화 체크 |

### 개별 도구

| 명령어 | 설명 |
|--------|------|
| `/write-script [주제]` | 스크립트 생성 |
| `/storyboard` | 스토리보드 생성 |
| `/gen-tts` | TTS 나레이션 생성 (선택) |
| `/gen-scene` | Remotion 씬 코드 자동 생성 |
| `/render-video` | 비디오 렌더링 |
| `/gen-thumbnail` | 썸네일 생성 |
| `/video-seo` | YouTube SEO 메타데이터 |
| `/to-shorts` | 롱폼→숏폼 변환 |

---

## 6단계 파이프라인

```
Phase 1: 기획        → plandata/ → scripts/ → storyboard/
Phase 2: TTS (선택)  → narration/ (--skip 가능)
Phase 3: 씬 개발     → components/ → scenes/ → Compositions.tsx
Phase 4: 통합        → assets/ → 오디오 싱크 → 프리뷰 검증
Phase 5: 렌더링      → mp4 → shorts → thumbnails
Phase 6: 배포        → SEO → 체크리스트 → 패키지
```

### 의존성 맵

```
1a → 1b → 1c → 2a(선택) → 3a → 3b → 3c → 3d → 4a → 4b → 4c → 5a → 5b → 5c → 6a → 6b → 6c
```

### 진행 상태 표기

| 표기 | 의미 |
|------|------|
| `[ ]` | 미착수 |
| `[~]` | 진행중 |
| `[x]` | 완료 |
| `[!]` | 오류/불일치 |
| `[-]` | 건너뜀 |

---

## 빠른 시작

```bash
# 1. 새 영상 시작
claude "/video init tutorials/react-hooks"

# 2. 기획 자료가 있으면 넣기
cp 기획서.pdf videos/tutorials/react-hooks/plandata/

# 3. 기획 Phase 전체 실행
claude "/video next 3"

# 4. TTS 스킵
claude "/gen-tts --skip"

# 5. 씬 개발
claude "/video next 4"

# 6. 다른 영상으로 전환
claude "/video select explainers/dopamine-detox"

# 7. 전체 목록 확인
claude "/video list"
```

---

## Remotion 통합

### src/Root.tsx (마스터)
```tsx
import { ReactHooksCompositions } from '../videos/tutorials/react-hooks/Compositions';
import { DopamineDetoxCompositions } from '../videos/explainers/dopamine-detox/Compositions';

export const RemotionRoot: React.FC = () => (
  <>
    <ReactHooksCompositions />
    <DopamineDetoxCompositions />
  </>
);
```

### 영상별 Compositions.tsx
```tsx
import { Composition } from 'remotion';
import { Scene01 } from './scenes/Scene01-Intro';
import { FullVideo } from './FullVideo';

export const ReactHooksCompositions: React.FC = () => (
  <>
    <Composition id="react-hooks-full" component={FullVideo} ... />
    <Composition id="react-hooks-scene01" component={Scene01} ... />
  </>
);
```

### 핵심 규칙
- CSS animation/transition/keyframes **절대 금지** — `useCurrentFrame()` + `interpolate()`/`spring()` 사용
- 에셋은 `staticFile('videos/{cat}/{name}/...')` 로 참조
- Composition ID는 `{name}-` 접두사로 영상 간 충돌 방지

---

## 포함된 파일 (19개 + 3개)

### 스킬 (`~/.claude/skills/`) — 6개

| 파일 | 설명 |
|------|------|
| `video-orchestra.md` | 마스터 오케스트레이터 (모노레포 파이프라인) |
| `script-writing.md` | 스크립트 작성 규칙 |
| `storyboard-design.md` | 스토리보드 설계 규칙 |
| `remotion-patterns.md` | Remotion 애니메이션 패턴 |
| `youtube-seo.md` | YouTube SEO 최적화 |
| `tts-integration.md` | TTS 서비스 연동 |

### 커맨드 (`~/.claude/commands/`) — 10개

| 파일 | 명령어 |
|------|--------|
| `video.md` | `/video` |
| `write-script.md` | `/write-script` |
| `storyboard.md` | `/storyboard` |
| `gen-scene.md` | `/gen-scene` |
| `render-video.md` | `/render-video` |
| `gen-thumbnail.md` | `/gen-thumbnail` |
| `video-seo.md` | `/video-seo` |
| `gen-tts.md` | `/gen-tts` |
| `video-sync.md` | `/video-sync` |
| `to-shorts.md` | `/to-shorts` |

### 에이전트 (`~/.claude/agents/`) — 3개

| 파일 | 설명 |
|------|------|
| `script-writer.md` | 스크립트 작성 전문가 |
| `scene-builder.md` | Remotion 씬 전문가 |
| `video-reviewer.md` | 품질 리뷰어 |

---

## 요구사항

### 필수
- [Claude Code](https://claude.ai/claude-code) (CLI)

### 선택
| 도구 | 용도 | 설치 |
|------|------|------|
| [Remotion](https://remotion.dev) | 프로그래매틱 비디오 렌더링 | `npm create video@latest` |
| [Node.js](https://nodejs.org) 18+ | Remotion 실행 환경 | [nodejs.org](https://nodejs.org) |
| [edge-tts](https://github.com/rany2/edge-tts) | 무료 TTS | `pip install edge-tts` |

> Remotion 없이도 스크립트/스토리보드/SEO 생성은 사용 가능합니다.

---

## License

MIT
