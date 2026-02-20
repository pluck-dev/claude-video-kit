# 비디오 프로덕션 오케스트레이터

## 개요
비디오 콘텐츠 제작의 전체 프로덕션 파이프라인을 지휘하는 마스터 스킬.
기획 → 스크립트 → TTS → Remotion 씬 개발 → 렌더링 → 배포 준비까지 단계별로 자동 진행한다.
Remotion 기반 모션 그래픽/설명 영상/튜토리얼 영상 제작에 최적화되어 있다.

## 명령어
```
/video init [project-name]    ← 새 프로젝트 초기화 + 폴더 구조 생성
/video scan                   ← 기존 프로젝트 분석 → VIDEO.md 자동 생성
/video status                 ← 전체 진행 상태 확인
/video next                   ← 다음 미완료 단계 자동 실행
/video next 3                 ← 다음 3개 단계 연속 실행
/video phase [phase-id]       ← 특정 단계 실행 (예: 1a, 3c)
/video sync                   ← 전체 산출물 싱크 체크
```

---

## 1. 비디오 프로덕션 파이프라인

```
Phase 1: 기획 (Planning)
  ├── 1a. 콘텐츠 기획 ──── plandata/ 분석 or 인터랙티브 Q&A
  ├── 1b. 스크립트 ──────── scripts/*.md
  └── 1c. 스토리보드 ────── storyboard/*.md
           ↓
Phase 2: TTS (선택)
  └── 2a. 음성 생성 ────── audio/narration/ (--skip 가능)
           ↓
Phase 3: 씬 개발 (Scene Dev)
  ├── 3a. 프로젝트 세팅 ── Remotion 프로젝트 확인/초기화
  ├── 3b. 공통 컴포넌트 ── src/components/
  ├── 3c. 씬 코드 생성 ── src/scenes/
  └── 3d. Root 등록 ────── src/Root.tsx
           ↓
Phase 4: 에셋 & 통합 (Integration)
  ├── 4a. 에셋 준비 ────── public/
  ├── 4b. 오디오 싱크 ──── 나레이션/BGM 타이밍
  └── 4c. 프리뷰 검증 ──── Remotion Studio 확인
           ↓
Phase 5: 렌더링 (Render)
  ├── 5a. 롱폼 렌더링 ──── output/*.mp4
  ├── 5b. 숏폼 변환 ────── output/shorts/*.mp4
  └── 5c. 썸네일 생성 ──── output/thumbnails/*.png
           ↓
Phase 6: 배포 준비 (Publish)
  ├── 6a. SEO 메타데이터 ── publish/*-seo.md
  ├── 6b. 최종 체크리스트 ── VIDEO.md 업데이트
  └── 6c. 산출물 정리 ──── publish/ 패키지
```

---

## 2. 기존 프로젝트 분석 (`/video scan`)

이미 제작이 진행된 프로젝트에서 현재 상태를 자동 감지하고 VIDEO.md를 생성한다.

### 실행 로직

**Step 1: 프로젝트 스캔 (서브에이전트 3개 병렬)**

Agent A: 문서 상태 스캔 (subagent_type: Explore)
```
1. plandata/ 폴더 존재 + 내용물 확인 → 1a 상태 판단
2. scripts/ 존재 + md 파일 수 + 씬 분할 여부 → 1b 상태 판단
3. storyboard/ 존재 + md 파일 수 + 씬별 레이아웃 테이블 → 1c 상태 판단
4. publish/ 존재 + *-seo.md 파일 수 → 6a 상태 판단
5. VIDEO.md 존재 + 체크리스트 완료율 → 6b 상태 판단

결과: 각 문서 Phase의 완료/미완료 + 파일 목록
```

Agent B: 코드 상태 스캔 (subagent_type: Explore)
```
1. package.json 존재 + remotion 의존성 확인 → 3a 상태 판단
2. src/components/ 존재 + 공통 컴포넌트 파일 수 → 3b 상태 판단
3. src/scenes/ 존재 + 씬 파일 수 → 3c 상태 판단
4. src/Root.tsx 존재 + Composition 등록 수 → 3d 상태 판단

결과: 각 코드 Phase의 완료/미완료 + 통계
```

Agent C: 미디어 상태 스캔 (subagent_type: Explore)
```
1. audio/narration/ 존재 + mp3/wav 파일 수 → 2a 상태 판단
2. public/ 존재 + 에셋 파일 수 → 4a 상태 판단
3. output/ 존재 + mp4 파일 수 → 5a 상태 판단
4. output/shorts/ 존재 + mp4 파일 수 → 5b 상태 판단
5. output/thumbnails/ 존재 + png 파일 수 → 5c 상태 판단

결과: 미디어 Phase 완료/미완료 + 파일 목록
```

**Step 2: 상태 자동 판정 규칙**

| Phase | 완료 [x] 조건 | 부분 [~] 조건 | 미착수 [ ] 조건 |
|-------|---------------|---------------|-----------------|
| 1a | plandata/ANALYSIS.md 존재 | plandata/에 파일 있지만 ANALYSIS.md 없음 | plandata/ 없거나 비어있음 |
| 1b | scripts/에 md 파일 2개 이상 + 씬 분할 헤더(## Scene) 존재 | md 파일 존재하지만 씬 미분할 | scripts/ 없음 |
| 1c | storyboard/에 md 파일 2개 이상 + 씬별 레이아웃 테이블 존재 | md 파일 존재하지만 테이블 없음 | storyboard/ 없음 |
| 2a | audio/narration/에 mp3/wav 파일 1개 이상 존재 | 폴더 존재하지만 파일 없음 | audio/narration/ 없음 (또는 [-] 스킵) |
| 3a | package.json + @remotion/core 의존성 존재 | package.json 존재하지만 remotion 없음 | package.json 없음 |
| 3b | src/components/에 tsx 파일 3개 이상 존재 | 1~2개 존재 | src/components/ 없음 |
| 3c | src/scenes/에 씬 파일 (스토리보드 씬 수의 80% 이상) 존재 | 1개 이상 존재 | src/scenes/ 없음 |
| 3d | src/Root.tsx에 Composition 등록 (씬 수만큼) | 일부만 등록 | src/Root.tsx 없거나 Composition 없음 |
| 4a | public/에 에셋 파일 (이미지/폰트/svg) 존재 | 폴더 존재하지만 파일 없음 | public/ 없음 |
| 4b | 씬 코드 내 오디오 타이밍 코드 존재 (useAudioData 또는 타임코드 주석) | 일부 씬에만 존재 | 오디오 타이밍 미설정 |
| 4c | VIDEO.md의 4c 항목에 [x] 마킹 | [~] 마킹 | [ ] 마킹 또는 항목 없음 |
| 5a | output/에 mp4 파일 1개 이상 존재 | 출력 폴더 존재하지만 mp4 없음 | output/ 없음 |
| 5b | output/shorts/에 mp4 파일 1개 이상 존재 | 폴더 존재하지만 파일 없음 | output/shorts/ 없음 |
| 5c | output/thumbnails/에 png 파일 1개 이상 존재 | 폴더 존재하지만 파일 없음 | output/thumbnails/ 없음 |
| 6a | publish/에 *-seo.md 파일 존재 | publish/ 폴더 존재하지만 seo.md 없음 | publish/ 없음 |
| 6b | VIDEO.md의 최종 체크리스트 80% 이상 [x] | 1개 이상 [x] | 체크리스트 없음 |
| 6c | publish/에 패키지 파일 (zip 또는 완성 파일 묶음) 존재 | publish/ 존재하지만 패키지 없음 | publish/ 없음 |

**Step 3: VIDEO.md 생성**
스캔 결과를 기반으로 VIDEO.md를 자동 생성한다.
- 이미 완료된 단계: [x] + 감지된 산출물 경로
- 진행 중인 단계: [~] + 현재 상태 메모
- 미착수 단계: [ ]
- TTS 스킵: [-]

**Step 4: 다음 단계 제안**
```
VIDEO.md 기반으로:
1. 완료 현황 요약 (예: "Phase 1~2 완료, Phase 3 진행중")
2. 다음 실행 가능한 단계 제안 (의존성 체크 완료된 것만)
3. 불일치/누락 경고 (예: "스토리보드 5씬인데 src/scenes/ 파일 2개뿐")
```

---

## 3. 프로젝트 초기화 (`/video init`)

### 폴더 구조 생성
```
[project-root]/
├── plandata/                ← 기획 자료 업로드 (기획안, 참고 영상, 메모 등)
├── scripts/                 ← Phase 1b: 스크립트 md 파일
├── storyboard/              ← Phase 1c: 씬별 스토리보드 md 파일
├── audio/
│   ├── narration/           ← Phase 2a: TTS 또는 녹음 파일 (mp3/wav)
│   ├── bgm/                 ← 배경음악
│   └── sfx/                 ← 효과음
├── src/                     ← Phase 3: Remotion 소스 코드
│   ├── components/          ← Phase 3b: 공통 컴포넌트
│   ├── scenes/              ← Phase 3c: 씬별 코드
│   └── Root.tsx             ← Phase 3d: Composition 등록
├── public/                  ← Phase 4a: 이미지, 폰트, SVG 에셋
├── output/                  ← Phase 5a: 렌더링된 영상
│   ├── shorts/              ← Phase 5b: 숏폼 변환본
│   └── thumbnails/          ← Phase 5c: 썸네일 이미지
├── publish/                 ← Phase 6: 배포 패키지
├── VIDEO.md                 ← 오케스트레이션 마스터 진행표
└── CLAUDE.md                ← 프로젝트별 규칙
```

### VIDEO.md 생성 포맷
```markdown
# [프로젝트명] 비디오 프로덕션

## 프로젝트 정보
- 이름: [name]
- 유형: [tutorial/explainer/motion/review]
- 생성일: [date]
- 타겟 길이: [분]
- 해상도: 1920x1080 (롱폼) / 1080x1920 (숏폼)
- TTS 사용: [yes/no]
- 기술스택: Remotion + TypeScript

## 진행 현황

### Phase 1: 기획
| ID | 단계 | 상태 | 산출물 | 비고 |
|----|------|------|--------|------|
| 1a | 콘텐츠 기획 | [ ] | plandata/ANALYSIS.md | |
| 1b | 스크립트 | [ ] | scripts/*.md | |
| 1c | 스토리보드 | [ ] | storyboard/*.md | |

### Phase 2: TTS
| ID | 단계 | 상태 | 산출물 | 비고 |
|----|------|------|--------|------|
| 2a | 음성 생성 | [ ] | audio/narration/ | --skip으로 건너뜀 가능 |

### Phase 3: 씬 개발
| ID | 단계 | 상태 | 산출물 | 비고 |
|----|------|------|--------|------|
| 3a | 프로젝트 세팅 | [ ] | package.json + remotion | |
| 3b | 공통 컴포넌트 | [ ] | src/components/ | |
| 3c | 씬 코드 생성 | [ ] | src/scenes/ | |
| 3d | Root 등록 | [ ] | src/Root.tsx | |

### Phase 4: 에셋 & 통합
| ID | 단계 | 상태 | 산출물 | 비고 |
|----|------|------|--------|------|
| 4a | 에셋 준비 | [ ] | public/ | |
| 4b | 오디오 싱크 | [ ] | 씬 코드 내 타이밍 | |
| 4c | 프리뷰 검증 | [ ] | Remotion Studio 확인 | |

### Phase 5: 렌더링
| ID | 단계 | 상태 | 산출물 | 비고 |
|----|------|------|--------|------|
| 5a | 롱폼 렌더링 | [ ] | output/*.mp4 | |
| 5b | 숏폼 변환 | [ ] | output/shorts/*.mp4 | |
| 5c | 썸네일 생성 | [ ] | output/thumbnails/*.png | |

### Phase 6: 배포 준비
| ID | 단계 | 상태 | 산출물 | 비고 |
|----|------|------|--------|------|
| 6a | SEO 메타데이터 | [ ] | publish/*-seo.md | |
| 6b | 최종 체크리스트 | [ ] | VIDEO.md 업데이트 | |
| 6c | 산출물 정리 | [ ] | publish/ 패키지 | |

## 최종 체크리스트
- [ ] 롱폼 영상 재생 검증 (끊김 없음)
- [ ] 숏폼 크롭/비율 확인 (1080x1920)
- [ ] 썸네일 해상도 확인 (1280x720 이상)
- [ ] 자막/텍스트 가독성 확인
- [ ] 오디오 볼륨 정규화 (-14 LUFS)
- [ ] SEO 메타데이터 작성 완료
- [ ] 최종 파일 패키지 완성

## 변경 이력
- [date]: 프로젝트 초기화
```

---

## 4. Phase별 상세 실행 로직

### Phase 1a: 콘텐츠 기획

**plandata/ 폴더에 자료가 있는 경우:**
```
1. plandata/ 폴더 스캔 (서브에이전트 병렬)
   - PDF → Read 도구로 분석
   - 텍스트/md → 직접 읽기
   - 이미지 → 참고 레이아웃/스타일 분석
   - 참고 영상 URL → 구조 파악

2. 자료 종합 분석 결과 생성
   - 영상 주제 및 목적
   - 타겟 시청자 (입문자/중급자/전문가)
   - 영상 유형 (튜토리얼/설명/리뷰/모션)
   - 예상 길이 및 씬 구성
   - 핵심 메시지 및 CTA
   - 시각적 스타일 방향
   - 참고 레퍼런스

3. 분석 결과를 plandata/ANALYSIS.md로 저장
4. 사용자에게 분석 결과 확인 요청
```

**plandata/ 폴더가 비어있는 경우:**
```
1. 인터랙티브 Q&A 시작

   Q1. 영상 주제
   - 어떤 내용의 영상인가요? (자유 텍스트)

   Q2. 영상 유형
   - 튜토리얼 / 설명 영상 (Explainer) / 모션 그래픽 / 제품 리뷰 / 기타

   Q3. 타겟 시청자
   - 입문자 / 중급자 / 전문가 / 일반 대중

   Q4. 타겟 길이
   - 쇼츠 (60초 이하) / 미드폼 (3~10분) / 롱폼 (10분 이상)

   Q5. 시각적 톤
   - 미니멀 / 다이나믹 / 친근한 / 전문적 / 다크/라이트 테마

   Q6. TTS 사용 여부
   - 나레이션 있음 (TTS 생성) / 나레이션 있음 (직접 녹음) / 나레이션 없음

   Q7. 숏폼 변환 필요 여부
   - 예 (롱폼 + 숏폼) / 아니오 (롱폼만)

   Q8. 특별 요구사항
   - 브랜드 컬러, 폰트, 로고 삽입 여부 등 (자유 텍스트)

2. 답변 기반으로 plandata/ANALYSIS.md 생성
3. VIDEO.md의 프로젝트 정보 업데이트
```

### Phase 1b: 스크립트 작성

```
1. ANALYSIS.md 기반으로 /write-script 스킬 호출
2. 씬 단위로 스크립트 분할
   - ## Scene 01: [씬 제목] 형식
   - 각 씬: 나레이션 텍스트 + 화면 설명 + 예상 시간
3. scripts/[프로젝트명]-script.md 에 저장
4. scripts/SCENES.md 에 씬 목록 인덱스 생성
5. 사용자 리뷰 요청 (나레이션 톤, 길이 조정 등)
```

### Phase 1c: 스토리보드 작성

```
1. 스크립트 기반으로 /storyboard 스킬 호출
2. 씬별 스토리보드 md 생성
   - storyboard/scene-01.md ~ storyboard/scene-NN.md
3. 각 스토리보드 파일 포맷:
   ## Scene [번호]: [제목]
   - 시간: [시작] ~ [종료] ([총 초])
   - 나레이션: [텍스트]

   ### 레이아웃
   | 영역 | 컨텐츠 | 애니메이션 | 비고 |
   |------|--------|-----------|------|
   | 배경 | [색상/이미지] | [페이드인/슬라이드] | |
   | 제목 | [텍스트] | [타이핑 효과] | |
   | 서브 | [텍스트] | [딜레이 페이드] | |

   ### 에셋 목록
   - [에셋명]: [경로 또는 생성 필요 여부]

4. storyboard/INDEX.md 에 전체 씬 목록 + 총 길이 기록
5. 사용자 리뷰 요청 (씬 순서, 레이아웃 방향 등)
```

### Phase 2a: TTS 음성 생성 (선택)

```
--skip 플래그가 있는 경우:
  - VIDEO.md의 2a 상태를 [-] (스킵)으로 표기
  - 오디오 없이 진행 (Phase 4b는 BGM만 처리)

TTS 생성 진행 시:
1. /gen-tts 스킬 호출
   - 입력: scripts/[프로젝트명]-script.md
   - 출력: audio/narration/scene-NN.mp3
2. 씬별 나레이션 파일 생성
3. 각 파일의 실제 재생 시간 측정 → storyboard/INDEX.md에 기록
4. 볼륨 정규화 확인 (-14 LUFS 기준)
```

### Phase 3a: Remotion 프로젝트 세팅

```
프로젝트가 이미 있는 경우:
1. package.json 확인 → remotion 관련 의존성 목록 출력
2. tsconfig.json 확인
3. remotion.config.ts 존재 여부 확인
4. 이상 없으면 [x] 처리

Remotion 프로젝트가 없는 경우:
1. 사용자에게 안내:
   "Remotion 프로젝트를 초기화합니다. 터미널에서 실행하세요:"
   npx create-video@latest [project-name]

2. 초기화 후 필수 패키지 확인:
   - @remotion/core
   - @remotion/cli
   - @remotion/player (선택)
   - remotion

3. remotion.config.ts 에 기본 설정 적용:
   - 해상도: 1920x1080 (FPS: 30)
   - 출력 경로: ./output/
```

### Phase 3b: 공통 컴포넌트 생성

```
1. 스토리보드 분석 → 반복 사용 요소 추출
   (서브에이전트로 storyboard/ 전체 분석)

2. 공통 컴포넌트 목록 결정:
   - TitleCard: 제목 카드 컴포넌트
   - SubtitleText: 서브타이틀 텍스트
   - AnimatedBackground: 배경 애니메이션
   - CodeBlock: 코드 블록 (튜토리얼용)
   - BulletList: 불릿 리스트 애니메이션
   - ProgressBar: 진행 표시
   - LogoIntro: 인트로/아웃트로 로고
   - Transition: 씬 전환 효과

3. src/components/ 에 각 컴포넌트 생성
4. src/components/index.ts 에 barrel export 추가
5. 각 컴포넌트에 props 타입 정의 + 기본값 설정
```

### Phase 3c: 씬 코드 생성

```
1. /gen-scene 스킬 호출 (씬별 반복)
   - 입력: storyboard/scene-NN.md + src/components/
   - 출력: src/scenes/Scene[NN].tsx

2. 씬 파일 기본 구조:
   import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
   import { [필요한 컴포넌트] } from '../components';

   export const Scene[NN]: React.FC = () => {
     const frame = useCurrentFrame();
     // 애니메이션 로직
     return (
       <AbsoluteFill>
         <Sequence from={0} durationInFrames={[씬 길이 * fps]}>
           ...
         </Sequence>
       </AbsoluteFill>
     );
   };

3. 씬별 타이밍 계산:
   - 스토리보드의 씬 시간 → FPS 기준 프레임 수로 변환
   - TTS 파일이 있으면 실제 오디오 길이 기준 설정

4. 서브에이전트 병렬로 씬 생성 가능 (독립적인 씬들)
```

### Phase 3d: Root.tsx Composition 등록

```
1. src/scenes/ 의 모든 씬 파일 목록 확인
2. src/Root.tsx 에 각 씬 Composition 등록:

   <Composition
     id="Scene[NN]-[제목]"
     component={Scene[NN]}
     durationInFrames={[씬 길이 * fps]}
     fps={30}
     width={1920}
     height={1080}
   />

3. 전체 영상 Composition도 등록 (씬들을 순서대로 연결):
   <Composition
     id="FullVideo"
     component={FullVideoSequence}
     durationInFrames={[전체 프레임 수]}
     fps={30}
     width={1920}
     height={1080}
   />

4. src/FullVideoSequence.tsx 생성 (전체 씬 순서 연결)
```

### Phase 4a: 에셋 준비

```
1. storyboard/INDEX.md의 에셋 목록 취합
2. 에셋 유형별 처리:
   - 이미지: public/images/ 에 배치
   - 폰트: public/fonts/ 에 배치 + CSS 선언
   - SVG/아이콘: public/icons/ 에 배치
   - 로고: public/logo/ 에 배치
3. 존재하지 않는 에셋 목록 → 사용자에게 제공 또는 placeholder 사용 안내
4. public/ASSETS.md 에 에셋 목록 + 경로 문서화
```

### Phase 4b: 오디오 싱크

```
TTS 스킵한 경우 ([-]):
  - BGM만 설정 (audio/bgm/ 파일이 있는 경우)
  - 전체 영상에 Audio 컴포넌트 삽입

TTS 파일이 있는 경우:
1. 각 씬에 나레이션 오디오 삽입:
   <Audio src={staticFile('narration/scene-NN.mp3')} />
2. 씬 길이를 오디오 실제 길이에 맞춤
3. BGM이 있는 경우 볼륨 균형 설정 (나레이션 1.0, BGM 0.3~0.5)
4. SFX가 있는 경우 타이밍에 맞게 삽입
5. 전체 FullVideoSequence에서 오디오 연속성 확인
```

### Phase 4c: 프리뷰 검증

```
1. Remotion Studio 실행 안내:
   npx remotion studio

2. 확인 항목:
   - [ ] 각 씬 재생 정상 여부
   - [ ] 씬 전환 자연스러운지
   - [ ] 오디오 싱크 맞는지
   - [ ] 텍스트 가독성 (크기, 대비)
   - [ ] 에셋 로딩 정상 여부
   - [ ] 전체 타이밍 (예상 길이와 일치)

3. 이슈 발견 시 해당 씬 코드 수정
4. 확인 완료 후 VIDEO.md의 4c 항목 [x] 마킹
```

### Phase 5a: 롱폼 렌더링

```
1. /render-video 스킬 호출 또는 직접 실행:
   npx remotion render src/Root.tsx FullVideo output/[프로젝트명].mp4 \
     --codec=h264 \
     --crf=18 \
     --frames=0-[총프레임]

2. 렌더링 진행 중 예상 시간 표시
3. 완료 후 파일 크기 + 길이 확인
4. output/[프로젝트명].mp4 정상 재생 테스트
```

### Phase 5b: 숏폼 변환

```
TTS 스킵 + 숏폼 불필요 시: 상태 [-] 처리

숏폼 필요 시:
1. /to-shorts 스킬 호출
2. 전략:
   a. 핵심 씬 선택 (스크립트 기반 또는 사용자 지정)
   b. 세로 비율 크롭 설정 (1080x1920)
   c. src/compositions/ShortsVersion.tsx 생성
3. 렌더링:
   npx remotion render src/Root.tsx ShortsVersion \
     output/shorts/[프로젝트명]-shorts.mp4 \
     --width=1080 --height=1920
4. 숏폼 영상 재생 길이 60초 이하 확인
```

### Phase 5c: 썸네일 생성

```
1. /gen-thumbnail 스킬 호출 또는 직접 실행:
   npx remotion still src/Root.tsx ThumbnailComposition \
     output/thumbnails/thumbnail.png \
     --frame=0

2. 썸네일 Composition 별도 생성 권장:
   - 크기: 1280x720 (YouTube 표준)
   - 요소: 제목 텍스트, 임팩트 이미지, 채널 로고
   - 파일명: output/thumbnails/[프로젝트명]-thumb.png

3. 변형 썸네일 2~3종 생성 (A/B 테스트용)
```

### Phase 6a: SEO 메타데이터 작성

```
1. /video-seo 스킬 호출
2. publish/[프로젝트명]-seo.md 생성:
   - 제목 (메인 + A/B 변형 2종)
   - 설명문 (2000자 이내, 키워드 포함)
   - 태그 리스트 (15~30개)
   - 챕터 타임스탬프 (씬별 시간 기반)
   - CTA (구독, 좋아요, 댓글 유도)
   - 카드/엔드스크린 설정 안내
3. SNS 공유용 짧은 설명 (280자 이내) 포함
```

### Phase 6b: 최종 체크리스트 완료

```
1. VIDEO.md의 최종 체크리스트 항목 순서대로 확인
2. 미완료 항목 발견 시 해당 Phase로 되돌아가 수정
3. 모든 항목 [x] 완료 후 VIDEO.md 6b 상태 [x] 처리
4. 완료 일시 기록
```

### Phase 6c: 산출물 정리

```
1. publish/ 폴더에 최종 파일 정리:
   publish/
   ├── [프로젝트명]-seo.md          ← SEO 메타데이터
   ├── [프로젝트명]-final.mp4       ← 최종 롱폼 영상 (심볼릭 링크 또는 복사)
   ├── [프로젝트명]-shorts.mp4      ← 숏폼 영상
   ├── [프로젝트명]-thumb.png       ← 대표 썸네일
   ├── [프로젝트명]-thumb-b.png     ← 대안 썸네일
   └── CHECKLIST.md                 ← 업로드 전 최종 체크리스트

2. publish/CHECKLIST.md 생성:
   - YouTube 업로드 순서
   - 공개 예약 일정 (있을 경우)
   - 커뮤니티 포스트 내용
   - SNS 공유 문구

3. VIDEO.md 변경 이력에 최종 완료 기록
```

---

## 5. 서브에이전트 활용 전략

### 정보 수집 단계 (항상 병렬)
| Agent | 역할 | 입력 | 출력 |
|-------|------|------|------|
| A | 문서 상태 스캔 | scripts/, storyboard/, publish/ | 문서 Phase 상태 |
| B | 코드 상태 스캔 | package.json, src/ | 코드 Phase 상태 |
| C | 미디어 상태 스캔 | audio/, output/, public/ | 미디어 Phase 상태 |

### 생성 단계 (순차, 검증은 병렬)
```
씬 생성 (Phase 3c): 독립적인 씬들은 병렬 처리 가능
  Scene01 생성 ─┐
  Scene02 생성 ─┤→ 완료 후 Root.tsx 등록 (순차)
  Scene03 생성 ─┘

검증:
생성 → [검증 Agent A: scripts↔storyboard 일치] + [검증 Agent B: storyboard↔scenes 일치] → 결과 통합
```

### 컨텍스트 절약 전략
```
1. 큰 스크립트 파일은 서브에이전트에 분석 위임 (씬 목록만 받기)
2. 관련 없는 Phase 정보는 서브에이전트에 전달하지 않기
3. 씬 생성은 storyboard/scene-NN.md 하나만 참조하도록 범위 제한
4. VIDEO.md 읽기 → 현재 Phase만 집중
5. 렌더링 명령은 서브에이전트 대신 직접 터미널 실행 안내
```

---

## 6. VIDEO.md 자동 업데이트 규칙

```
작업 시작:    [ ] → [~] + 시작 시간 기록
작업 완료:    [~] → [x] + 완료 시간 + 산출물 경로
오류 발생:    [~] → [!] + 오류 내용 + 재시도 방법
TTS 스킵:     [ ] → [-] + 스킵 사유
싱크 불일치:  [x] → [!] + 불일치 내용

변경 이력에 모든 상태 변경 기록 (날짜 + 내용)
```

| 표기 | 의미 |
|------|------|
| `[ ]` | 미착수 |
| `[~]` | 진행중 |
| `[x]` | 완료 |
| `[!]` | 오류/불일치 |
| `[-]` | 스킵 (TTS 미사용 등) |

---

## 7. `/video next` 실행 로직

```python
# 의사 코드
def video_next(count=1, skip_tts=False):
    video = read("VIDEO.md")

    for i in range(count):
        # 1. 미완료 단계 중 첫 번째 찾기
        next_phase = find_first(video, status=["[ ]"])

        if not next_phase:
            print("모든 단계 완료!")
            return

        # 2. TTS 스킵 처리
        if next_phase.id == "2a" and skip_tts:
            update_video(next_phase, "[-]", note="TTS 스킵")
            continue

        # 3. 의존성 체크 (이전 단계가 완료되었는지)
        deps = get_dependencies(next_phase)
        blocking = [d for d in deps if d.status not in ["[x]", "[-]"]]
        if blocking:
            print(f"선행 단계 미완료: {blocking}")
            return

        # 4. 상태 업데이트: [~] 진행중
        update_video(next_phase, "[~]", start_time=now())

        # 5. 해당 단계 실행 (Phase별 로직)
        result = execute_phase(next_phase)

        # 6. 결과에 따라 상태 업데이트
        if result.success:
            update_video(next_phase, "[x]", artifacts=result.outputs)
        else:
            update_video(next_phase, "[!]", error=result.error)
            return

        # 7. 싱크 체크 (Phase 완료 시점)
        check_sync()
```

---

## 8. 의존성 맵

```
1a → 1b → 1c → 2a(선택) → 3a → 3b → 3c → 3d → 4a → 4b → 4c → 5a → 5b → 5c → 6a → 6b → 6c
                  ↓                                                    ↑
                 [-]  ────────────────────────────────────────────────┘
                (스킵 시 4b는 BGM만 처리)
```

각 단계는 **이전 단계가 [x] 또는 [-] 완료** 상태여야 실행 가능.
단, 같은 Phase 내에서 독립적인 단계는 병렬 실행 가능:
- 3b + 3c는 3a 완료 후 동시 진행 가능 (공통 컴포넌트와 씬 코드는 독립)
- 5b + 5c는 5a 완료 후 동시 가능 (숏폼과 썸네일은 독립)

---

## 9. 싱크 체크 (`/video sync`)

```
체크 항목:
1. scripts/ ↔ storyboard/ (씬 수 일치? 씬 제목 일치?)
2. storyboard/ ↔ src/scenes/ (스토리보드 씬 수 = 씬 파일 수?)
3. src/scenes/ ↔ src/Root.tsx (모든 씬이 Composition으로 등록되었는지?)
4. audio/narration/ ↔ scripts/ (씬 수만큼 오디오 파일 있는지? TTS 사용 시)
5. storyboard/ 에셋 목록 ↔ public/ (필요한 에셋 모두 배치되었는지?)
6. output/ ↔ publish/ (렌더링 결과가 publish/ 에 정리되었는지?)

결과: VIDEO.md 하단에 싱크 리포트 추가
불일치 발견 시: 해당 Phase를 [!] 상태로 변경 + 수정 필요 항목 목록화
```

---

## 10. Phase별 사용하는 기존 스킬

| Phase | 스킬 | 설명 |
|-------|------|------|
| 1a | - | plandata/ 분석 또는 인터랙티브 Q&A |
| 1b | `/write-script` | 씬 단위 스크립트 생성 |
| 1c | `/storyboard` | 씬별 스토리보드 md 생성 |
| 2a | `/gen-tts` | TTS 나레이션 오디오 생성 |
| 3a | - | Remotion 프로젝트 확인/초기화 안내 |
| 3b | - | 공통 컴포넌트 직접 생성 |
| 3c | `/gen-scene` | 스토리보드 기반 씬 코드 생성 |
| 3d | - | Root.tsx Composition 등록 |
| 4a | - | 에셋 배치 + ASSETS.md 생성 |
| 4b | - | 오디오 타이밍 코드 삽입 |
| 4c | - | Remotion Studio 프리뷰 확인 안내 |
| 5a | `/render-video` | 롱폼 mp4 렌더링 |
| 5b | `/to-shorts` | 숏폼 변환 |
| 5c | `/gen-thumbnail` | 썸네일 생성 |
| 6a | `/video-seo` | SEO 메타데이터 작성 |
| 6b | - | 최종 체크리스트 확인 |
| 6c | - | publish/ 패키지 정리 |
| 전체 | `/video sync` | 산출물 싱크 체크 |

---

## 11. 터미널 실행 예시

```bash
# 새 프로젝트 시작
claude "/video init my-tutorial-video"

# 기획 자료 넣고 분석
cp 기획안.pdf plandata/
claude "/video phase 1a"

# 다음 단계 자동 실행
claude "/video next"

# TTS 스킵하고 다음 단계
claude "/video next --skip-tts"

# Phase 3까지 한번에 (1b~3a: 5단계)
claude "/video next 5"

# 씬 개발만 실행
claude "/video phase 3c"

# 상태 확인
claude "/video status"

# 전체 싱크 체크
claude "/video sync"

# 기존 프로젝트 분석
claude "/video scan"
```

---

## 12. 주의사항

- 각 Phase 완료 후 사용자 확인을 받는다 (자동으로 다음 Phase 넘어가지 않음)
- 단, `/video next N` 으로 N개 연속 실행은 가능
- TTS 스킵 시 오디오 타이밍(Phase 4b)은 BGM/SFX만 처리하면 됨
- 씬 코드 생성(Phase 3c) 전에 반드시 공통 컴포넌트(Phase 3b) 완료 필요
- Remotion 렌더링(Phase 5a~5c)은 터미널 명령을 사용자에게 안내하는 방식 (직접 실행 불가)
- plandata/ 에 자료가 추가되면 1a부터 재분석 필요 (사용자 판단)
- VIDEO.md는 단일 진실 소스(Single Source of Truth)
- 모든 산출물은 상대 경로로 VIDEO.md에서 참조 가능
- 렌더링 시간이 길 수 있으므로 사전에 Remotion Studio에서 프리뷰 검증 필수
