# Claude Video Kit

Claude Code 기반 **스크립트 작성 → 스토리보드 → Remotion 씬 개발 → 렌더링 → 배포** 전체 비디오 프로덕션 파이프라인을 자동화하는 통합 도구 모음.

아이디어 하나로 시작해서 스크립트, 스토리보드, Remotion 코드, 렌더링, 썸네일, SEO 메타데이터까지 Claude Code가 단계별로 자동 생성합니다.

## 한눈에 보기

```
아이디어 → /video init → 스크립트 → 스토리보드 → TTS(선택)
                                                      ↓
         배포 준비 ← 렌더링 ← 에셋 통합 ← Remotion 씬 개발
```

---

## 목차

- [설치](#설치)
- [빠른 시작](#빠른-시작)
- [6단계 파이프라인](#6단계-파이프라인)
- [명령어 레퍼런스](#명령어-레퍼런스)
- [자동 에이전트](#자동-에이전트)
- [포함된 파일 목록 (23개)](#포함된-파일-목록-23개)
- [요구사항](#요구사항)

---

## 설치

```bash
git clone https://github.com/user/claude-video-kit.git
cd claude-video-kit
./install.sh
```

설치 스크립트가 3가지를 설정합니다:

| 파트 | 설치 위치 | 내용 |
|------|-----------|------|
| 스킬 | `~/.claude/skills/` | 6개 (오케스트레이터, 스크립트, 스토리보드, Remotion, SEO, TTS) |
| 커맨드 | `~/.claude/commands/` | 10개 (`/video`, `/write-script`, `/storyboard`, `/gen-scene`, `/render-video`, `/gen-thumbnail`, `/video-seo`, `/gen-tts`, `/video-sync`, `/to-shorts`) |
| 에이전트 | `~/.claude/agents/` | 3개 (`script-writer`, `scene-builder`, `video-reviewer`) |

---

## 빠른 시작

### 시나리오 1: 아이디어만 있을 때

```bash
# 1. 프로젝트 폴더 생성
mkdir ~/my-video && cd ~/my-video

# 2. 오케스트레이터로 초기화
claude "/video init my-tutorial"
```

Claude가 다음을 수행합니다:
1. 표준 폴더 구조 생성 (`plandata/`, `scripts/`, `storyboard/`, `remotion/`, `output/`)
2. `VIDEO.md` 마스터 진행표 생성
3. 인터랙티브 Q&A 시작 — 주제, 대상 시청자, 영상 길이, 스타일을 질문

```bash
# 3. Q&A 답변 후 다음 단계 진행
claude "/video next"

# 4. 현재 진행 상태 확인
claude "/video status"
```

### 시나리오 2: 기획 자료가 있을 때 (PDF, 참고 자료)

```bash
mkdir ~/my-video && cd ~/my-video
claude "/video init my-video"

# 기획 자료를 plandata/ 에 넣기
cp 기획서.pdf 참고자료.md plandata/

# Phase 1a 실행 — 자료 자동 분석
claude "/video phase 1a"
# → 자료를 읽고 분석 결과를 plandata/ANALYSIS.md로 저장

# 이후 단계 자동 진행
claude "/video next"
```

### 시나리오 3: 이미 진행 중인 프로젝트

```bash
cd ~/existing-video-project

# 현재 상태 자동 스캔
claude "/video scan"
# → 스크립트/스토리보드/코드 분석
# → VIDEO.md 자동 생성 (완료 단계는 [x], 미완료는 [ ])
# → 다음 단계 제안

# 제안된 다음 단계 실행
claude "/video next"
```

### 시나리오 4: 스크립트만 빠르게

```bash
# 특정 주제의 스크립트만 단독 생성
claude "/write-script React 훅 튜토리얼 --type tutorial --length 10m"
```

---

## 6단계 파이프라인

오케스트레이터(`/video`)가 관리하는 전체 비디오 프로덕션 파이프라인입니다.

```
Phase 1: 기획 (Planning)
  ├── 1a. 자료 수집/분석 ─── plandata/ 분석 or 인터랙티브 Q&A
  ├── 1b. 스크립트 생성 ──── scripts/script.md (씬별 나레이션 + 비주얼 메모)
  └── 1c. 스토리보드 ─────── storyboard/storyboard.md (씬 흐름 + 레이아웃)
           ↓
Phase 2: TTS (Text-to-Speech) — 선택
  └── 2a. 음성 생성 ───────── audio/ (edge-tts or 외부 서비스)
           ↓
Phase 3: Remotion 씬 개발 (Scene Development)
  ├── 3a. 프로젝트 세팅 ──── remotion/ (package.json, webpack, tsconfig)
  ├── 3b. 공통 컴포넌트 ──── remotion/src/components/ (텍스트, 배경, 트랜지션)
  ├── 3c. 씬 코드 생성 ────── remotion/src/scenes/ (스토리보드 기반 자동 생성)
  └── 3d. Root 등록 ───────── remotion/src/Root.tsx (Composition 등록)
           ↓
Phase 4: 에셋 & 통합 (Assets & Integration)
  ├── 4a. 에셋 준비 ───────── public/ (이미지, 폰트, 아이콘)
  ├── 4b. 오디오 싱크 ────── TTS 오디오 ↔ 씬 타이밍 맞추기
  └── 4c. 프리뷰 검증 ────── remotion preview 로컬 확인
           ↓
Phase 5: 렌더링 (Rendering)
  ├── 5a. 롱폼 렌더링 ────── output/main.mp4 (전체 영상)
  ├── 5b. 숏폼 변환 ───────── output/shorts.mp4 (9:16 세로)
  └── 5c. 썸네일 생성 ────── output/thumbnail.png
           ↓
Phase 6: 배포 준비 (Distribution)
  ├── 6a. SEO 메타데이터 ─── meta/youtube-seo.md (제목, 설명, 태그, 챕터)
  ├── 6b. 최종 체크리스트 ── 오디오/자막/해상도/길이 검증
  └── 6c. 배포 패키지 ────── output/package/ (영상 + 썸네일 + SEO 묶음)
```

### 의존성 맵

```
1a → 1b → 1c → 2a(선택) → 3a → 3b → 3c → 3d
                                              ↓
                              4a → 4b → 4c
                                         ↓
                              5a → 5b → 5c
                                         ↓
                              6a → 6b → 6c
```

각 단계는 이전 단계가 `[x]` 완료 상태여야 실행 가능합니다. `VIDEO.md`가 Single Source of Truth입니다.

### 진행 상태 표기

| 표기 | 의미 |
|------|------|
| `[ ]` | 미착수 |
| `[~]` | 진행중 |
| `[x]` | 완료 |
| `[!]` | 오류/불일치 |
| `[-]` | 건너뜀 (선택 단계) |

---

## 명령어 레퍼런스

### 오케스트레이터

| 명령어 | 설명 |
|--------|------|
| `/video init [name]` | 새 비디오 프로젝트 초기화 — 폴더 구조 + VIDEO.md 생성 |
| `/video scan` | 기존 프로젝트 분석 — 스크립트/코드/에셋 스캔 → VIDEO.md 자동 생성 |
| `/video status` | 전체 진행 상태 확인 (VIDEO.md 기반) |
| `/video next` | 다음 미완료 단계 자동 실행 (의존성 체크 포함) |
| `/video next N` | N개 단계 연속 실행 |
| `/video phase [id]` | 특정 단계만 실행 (예: `1b`, `3c`, `5a`) |
| `/video sync` | 전체 산출물 동기화 체크 (스크립트 ↔ 스토리보드 ↔ 씬 코드) |

**사용 예시:**
```bash
# 새 프로젝트 시작부터 Phase 2까지 한번에
claude "/video init my-tutorial"
# (Q&A 완료 후)
claude "/video next 4"

# 특정 단계만 다시 실행
claude "/video phase 3c"

# 전체 동기화 체크
claude "/video sync"
```

### 콘텐츠 생성

| 명령어 | 설명 |
|--------|------|
| `/write-script [주제]` | 스크립트 생성 — 씬별 나레이션 + 비주얼 메모 + 타임코드 |
| `/storyboard` | 스크립트 기반 스토리보드 생성 — 씬 흐름 + 레이아웃 + 애니메이션 메모 |
| `/gen-tts` | TTS 나레이션 생성 — edge-tts 기반 음성 파일 생성 |

**`/write-script` 옵션:**
```bash
# 유형 지정
claude "/write-script React 훅 이해하기 --type tutorial"
claude "/write-script 회사 소개 --type promo"
claude "/write-script 제품 데모 --type demo"

# 길이 지정
claude "/write-script 주제 --length 5m"    # 5분 분량
claude "/write-script 주제 --length 10m"   # 10분 분량
claude "/write-script 주제 --length 60s"   # 60초 숏폼

# 톤 지정
claude "/write-script 주제 --tone casual"    # 친근한 말투
claude "/write-script 주제 --tone formal"    # 공식적
claude "/write-script 주제 --tone energetic" # 활기찬
```

**`/gen-tts` 옵션:**
```bash
# edge-tts (무료) 사용
claude "/gen-tts --service edge"

# TTS 건너뜀 (나중에 직접 녹음)
claude "/gen-tts --skip"

# 음성 지정
claude "/gen-tts --voice ko-KR-SunHiNeural"
```

### Remotion 개발

| 명령어 | 설명 |
|--------|------|
| `/gen-scene` | 스토리보드 기반 Remotion 씬 코드 자동 생성 |
| `/render-video` | Remotion 렌더링 실행 — MP4 출력 |
| `/gen-thumbnail` | Remotion Still 기반 썸네일 PNG 생성 |

**`/gen-scene` 상세:**
```bash
# 전체 씬 일괄 생성
claude "/gen-scene"

# 특정 씬만 생성
claude "/gen-scene --scene 03-transition"

# 컴포넌트 타입 지정
claude "/gen-scene --type code-animation"
claude "/gen-scene --type text-reveal"
claude "/gen-scene --type chart"
```

**`/render-video` 옵션:**
```bash
# 전체 렌더링
claude "/render-video"

# 프리뷰 모드 (낮은 품질, 빠른 속도)
claude "/render-video --preview"

# 특정 Composition만 렌더링
claude "/render-video --composition MainVideo"
claude "/render-video --composition Shorts"
claude "/render-video --composition Thumbnail"
```

### 배포 & 유틸

| 명령어 | 설명 |
|--------|------|
| `/video-seo` | YouTube SEO 메타데이터 생성 — 제목, 설명, 태그, 챕터 |
| `/to-shorts` | 롱폼 → 숏폼 자동 변환 (16:9 → 9:16, 타임라인 재편집) |
| `/video-sync` | 스크립트 ↔ 스토리보드 ↔ 씬 코드 동기화 체크 |

**`/video-seo` 상세:**
```bash
# 기본 SEO 생성
claude "/video-seo"
# → meta/youtube-seo.md 생성
# → 제목 5가지 후보
# → 설명 (Hook + 본문 + CTA)
# → 태그 30개
# → 타임스탬프 챕터

# 플랫폼 지정
claude "/video-seo --platform youtube"
claude "/video-seo --platform shorts"
```

**`/to-shorts` 상세:**
```bash
# 롱폼에서 숏폼용 하이라이트 자동 추출
claude "/to-shorts"
# → 핵심 구간 감지
# → 9:16 레이아웃 Remotion Composition 생성
# → output/shorts.mp4 렌더링
```

---

## 자동 에이전트

설치되는 3개 에이전트는 Claude Code가 자동으로 활용합니다:

| 에이전트 | 동작 |
|---------|------|
| `script-writer` | 스크립트 작성/편집, 씬 분할, 워드카운트 기반 타이밍 검증. 나레이션 자연스러움 체크 포함 |
| `scene-builder` | 스토리보드 → Remotion 씬 코드 변환. CSS animation 금지, `useCurrentFrame` + `interpolate` 패턴 준수 |
| `video-reviewer` | 스크립트/코드/동기화/SEO 품질 리뷰. Critical / High / Medium / Low 4단계로 이슈 분류 |

### `scene-builder` 코딩 규칙

`scene-builder` 에이전트는 다음 Remotion 패턴을 강제합니다:

```tsx
// 올바른 패턴 — useCurrentFrame + interpolate
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

export const MyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* 컨텐츠 */}
    </AbsoluteFill>
  );
};

// 금지 패턴 — CSS animation, setTimeout, setInterval 사용 불가
```

### `video-reviewer` 리뷰 항목

| 카테고리 | 체크 항목 |
|---------|----------|
| 스크립트 | 씬 수 ↔ 스토리보드 일치, 나레이션 길이 = 영상 길이, 워드카운트 검증 |
| 코드 | CSS animation 미사용, `extrapolateLeft/Right: 'clamp'` 적용, TypeScript 타입 오류 없음 |
| 동기화 | 오디오 타이밍 ↔ 씬 프레임 일치, 자막 싱크 |
| SEO | 제목 60자 이내, 설명 Hook 포함, 태그 15개 이상 |

---

## 포함된 파일 목록 (23개)

### 스킬 (`~/.claude/skills/`)

| 파일 | 설명 |
|------|------|
| `video-orchestra.md` | 마스터 오케스트레이터 — 6단계 파이프라인, 의존성 맵, VIDEO.md 관리 |
| `script-writing.md` | 스크립트 작성 가이드 — 씬 분할 규칙, 나레이션 패턴, 워드카운트 기준 |
| `storyboard-design.md` | 스토리보드 설계 규칙 — 씬 레이아웃 표기법, 트랜지션 종류, 비주얼 메모 형식 |
| `remotion-patterns.md` | Remotion 베스트 프랙티스 — useCurrentFrame 패턴, 컴포넌트 설계, 성능 최적화 |
| `youtube-seo.md` | YouTube SEO 최적화 — 제목/설명/태그 규칙, 챕터 마커, 썸네일 텍스트 |
| `tts-integration.md` | TTS 서비스 연동 — 5개 서비스 비교, 스크립트→나레이션, 타이밍 정보 |

### 커맨드 (`~/.claude/commands/`)

| 파일 | 명령어 | 스킬 참조 |
|------|--------|-----------|
| `video.md` | `/video` | `video-orchestra.md` |
| `write-script.md` | `/write-script` | `script-writing.md` |
| `storyboard.md` | `/storyboard` | `storyboard-design.md` |
| `gen-scene.md` | `/gen-scene` | `remotion-patterns.md` |
| `render-video.md` | `/render-video` | 자체 포함 |
| `gen-thumbnail.md` | `/gen-thumbnail` | 자체 포함 |
| `video-seo.md` | `/video-seo` | `youtube-seo.md` |
| `gen-tts.md` | `/gen-tts` | `tts-integration.md` |
| `video-sync.md` | `/video-sync` | 자체 포함 |
| `to-shorts.md` | `/to-shorts` | `remotion-patterns.md` + `youtube-seo.md` |

### 에이전트 (`~/.claude/agents/`)

| 파일 | 설명 |
|------|------|
| `script-writer.md` | 스크립트 전문가 — 씬 분할, 타이밍 계산, 나레이션 검증 |
| `scene-builder.md` | Remotion 씬 전문가 — 스토리보드 → TSX 코드, 애니메이션 패턴 |
| `video-reviewer.md` | 품질 리뷰어 — 스크립트/코드/동기화/SEO 4개 영역 리뷰 |

### 기타

| 파일 | 설명 |
|------|------|
| `install.sh` | 설치 스크립트 — 스킬/커맨드/에이전트를 `~/.claude/`에 복사 |
| `README.md` | 이 문서 |
| `VERSION` | 버전 (`1.0.0`) |
| `.gitignore` | Git 무시 파일 (`node_modules/`, `output/`, `.omc/` 등) |

---

## 요구사항

### 필수

- [Claude Code](https://claude.ai/claude-code) (CLI)

### 선택

| 도구 | 용도 | 설치 |
|------|------|------|
| [Remotion](https://remotion.dev) | React 기반 프로그래매틱 비디오 렌더링 | `npm create video@latest` |
| [Node.js](https://nodejs.org) 18+ | Remotion 실행 환경 | [nodejs.org](https://nodejs.org) |
| [edge-tts](https://github.com/rany2/edge-tts) | 무료 TTS (Microsoft Edge 음성) | `pip install edge-tts` |
| [oh-my-claudecode](https://github.com/anthropics/oh-my-claudecode) | 멀티에이전트 병렬 실행 | 별도 설치 |

> **Remotion 없이도** 스크립트/스토리보드 생성(`/write-script`, `/storyboard`)과 SEO 메타데이터(`/video-seo`)는 사용 가능합니다. Remotion은 Phase 3 씬 개발부터 필요합니다.

---

## 전체 워크플로우 예시

```bash
# 1. 설치
git clone https://github.com/user/claude-video-kit.git
cd claude-video-kit && ./install.sh

# 2. 새 프로젝트 시작
mkdir ~/my-tutorial && cd ~/my-tutorial
claude "/video init react-hooks-tutorial"

# 3. (Q&A 완료 후) 기획 Phase 전체 실행
claude "/video next 3"
# → 1a: 콘텐츠 기획 (대상, 구성, 길이 확정)
# → 1b: 스크립트 생성 (scripts/script.md)
# → 1c: 스토리보드 생성 (storyboard/storyboard.md)

# 4. TTS — 선택
claude "/gen-tts --skip"            # 직접 녹음할 경우 건너뜀
# 또는
claude "/gen-tts --service edge"    # edge-tts 무료 음성 생성

# 5. Remotion 씬 개발
claude "/video next 4"
# → 3a: 프로젝트 세팅 (remotion/ 초기화)
# → 3b: 공통 컴포넌트 (Title, Background, Transition 등)
# → 3c: 씬 코드 생성 (스토리보드 기반 TSX 자동 생성)
# → 3d: Root 등록 (Composition 등록 + 타이밍 확정)

# 6. 에셋 & 통합
claude "/video next 3"
# → 4a: 에셋 준비 (이미지/폰트 public/ 배치)
# → 4b: 오디오 싱크 (TTS 타이밍 ↔ 씬 프레임 맞추기)
# → 4c: 프리뷰 검증 (로컬 Remotion Studio 확인)

# 7. 렌더링
claude "/video next 3"
# → 5a: 롱폼 렌더링 (output/main.mp4)
# → 5b: 숏폼 변환 (output/shorts.mp4, 9:16)
# → 5c: 썸네일 생성 (output/thumbnail.png)

# 8. 배포 준비
claude "/video next 3"
# → 6a: SEO 메타데이터 (meta/youtube-seo.md)
# → 6b: 최종 체크리스트 (오디오/자막/해상도 검증)
# → 6c: 배포 패키지 (output/package/ 묶음)

# 9. 동기화 체크
claude "/video sync"
# → 스크립트 ↔ 스토리보드 ↔ 씬 코드 일치 여부 확인
# → 불일치 항목 [!] 표시 + 수정 가이드 제공
```

---

## License

MIT
