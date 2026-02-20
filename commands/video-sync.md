# /video-sync - 산출물 동기화 체크

스크립트, 스토리보드, Remotion 코드 간 일관성을 검증합니다.

## 참조 스킬
별도 스킬 파일 없음 (이 커맨드 파일에 전체 규칙 포함).

## 경로 규칙
- 영상 식별: `~/.claude/skills/video-orchestra.md` §3 (영상 식별 로직) 적용
- `{VIDEO}` = `videos/{category}/{name}/`
- `{PUBLIC}` = `public/videos/{category}/{name}/`
- `{OUTPUT}` = `output/{category}/{name}/`

## 사용법
```
/video-sync                    ← 전체 동기화 체크
/video-sync [scene-id]         ← 특정 씬만 체크
/video-sync --fix              ← 불일치 자동 수정 시도
/video-sync --skills           ← 스킬/커맨드/에이전트 MD 싱크 (실제 제작 경험 반영)
/video-sync --skills --fix     ← 불일치 발견 시 MD 자동 업데이트
```

## 체크 항목

### 1. 스크립트 ↔ 스토리보드
- {VIDEO}/scripts/ 의 씬 수 = {VIDEO}/storyboard/ 의 씬 수
- 씬 제목 일치
- 예상 길이 일치 (+-10% 허용)

### 2. 스토리보드 ↔ Remotion 코드
- {VIDEO}/storyboard/ 의 씬 수 = {VIDEO}/scenes/ 의 컴포넌트 수
- durationInFrames 일치
- 트랜지션 지정 반영 여부

### 3. Remotion 코드 ↔ Compositions
- {VIDEO}/scenes/ 의 모든 씬이 {VIDEO}/Compositions.tsx에 등록
- durationInFrames, fps, width, height 일치

### 4. Compositions ↔ Root.tsx
- {VIDEO}/Compositions.tsx가 src/Root.tsx에 import 되어 있는지

### 5. 에셋 참조 확인
- 코드에서 staticFile()로 참조하는 파일이 {PUBLIC}/에 존재
- 미사용 에셋 경고

### 6. 오디오 싱크 (TTS 사용 시)
- {PUBLIC}/narration/ 의 파일 수 = 씬 수
- timing.json의 duration과 durationInFrames 일치

### 7. SEO ↔ 스크립트
- {VIDEO}/publish/*-seo.md의 챕터 마커와 씬 길이 일치

### 8. 스킬/커맨드/에이전트 MD 싱크 (`--skills`)

실제 영상 제작 과정에서 배운 패턴, 워크어라운드, 새로운 도구 사용법을
스킬·커맨드·에이전트 MD 파일에 반영한다.

**스캔 대상 (코드에서 실제 사용된 패턴 추출)**:
1. `{VIDEO}/scenes/*.tsx` — 실제 사용된 Remotion API, 패키지, 컴포넌트 패턴
2. `{VIDEO}/components/*.tsx` — 영상 전용 컴포넌트 패턴
3. `{PUBLIC}/` — 실제 에셋 구조 (narration/, bgm/, assets/)
4. `scripts/` — TTS 생성 스크립트, 사용된 라이브러리/옵션
5. `package.json` — 설치된 Remotion 확장 패키지

**비교 대상 (MD 파일)**:
- `skills/remotion-patterns.md` — Remotion 코딩 패턴
- `skills/tts-integration.md` — TTS 워크플로우
- `skills/storyboard-design.md` — 스토리보드 설계 규칙
- `commands/gen-scene.md` — 씬 생성 커맨드
- `commands/gen-tts.md` — TTS 생성 커맨드
- `agents/scene-builder.md` — 씬 빌더 에이전트

**체크 항목**:

| 체크 | 설명 | 예시 |
|------|------|------|
| 패키지 누락 | 코드에서 쓰는데 MD에 없음 | `@remotion/gif` import → remotion-patterns.md에 없음 |
| 경로 불일치 | MD의 예시 경로가 실제와 다름 | MD: `public/audio/` → 실제: `{PUBLIC}/narration/` |
| API 변경 | 실제 사용법과 MD 설명이 다름 | MPS "자동 감지" → 실제: CPU 필수 |
| 패턴 누락 | 코드에서 반복 사용하는데 MD에 없음 | Series+offset 크로스페이드, GIF fadeIn/fadeOut |
| 워크어라운드 미기록 | 삽질 끝에 알아낸 해결책이 MD에 없음 | Python 3.11 경로, x_vector_only_mode |

**`--fix` 동작**:
- 발견된 불일치를 MD 파일에 자동 반영 (추가/수정)
- 기존 내용은 삭제하지 않고, 새로운 섹션 추가 또는 기존 내용 업데이트
- 변경 내역을 콘솔에 요약 출력

## 출력
- 콘솔에 체크 결과 출력 (통과 / 불일치 / 경고)
- {VIDEO}/VIDEO.md에 싱크 리포트 추가

## --fix 동작
- Compositions.tsx 누락 Composition 자동 등록
- src/Root.tsx 누락 import 자동 추가
- timing.json 불일치 자동 수정
- 스크립트 ↔ 스토리보드 씬 수 불일치는 경고만 (수동 수정 필요)
- `--skills --fix`: 스킬/커맨드/에이전트 MD 자동 업데이트

## 사용 시나리오

### 영상 제작 완료 후 스킬 싱크
```
/video-sync --skills
```
→ 실제 코드에서 사용된 패턴과 MD 파일을 비교
→ 불일치 목록 출력 (예: "remotion-patterns.md에 @remotion/gif 섹션 없음")

```
/video-sync --skills --fix
```
→ 불일치를 MD 파일에 자동 반영

### 간단한 요청 방법
다음과 같이 말해도 동일하게 동작:
- "스킬 싱크 맞춰줘"
- "영상에서 배운 것 스킬에 반영해"
- "MD 파일 최신화해줘"
- "/video-sync --skills"
