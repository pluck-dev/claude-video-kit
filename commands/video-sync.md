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

## 출력
- 콘솔에 체크 결과 출력 (통과 / 불일치 / 경고)
- {VIDEO}/VIDEO.md에 싱크 리포트 추가

## --fix 동작
- Compositions.tsx 누락 Composition 자동 등록
- src/Root.tsx 누락 import 자동 추가
- timing.json 불일치 자동 수정
- 스크립트 ↔ 스토리보드 씬 수 불일치는 경고만 (수동 수정 필요)
