# /write-script - 비디오 스크립트 생성

영상 주제와 유형을 기반으로 체계적인 스크립트를 생성합니다.

## 참조 스킬
반드시 `~/.claude/skills/script-writing.md`를 읽고 전체 적용합니다.

## 경로 규칙
- 영상 식별: `~/.claude/skills/video-orchestra.md` §3 (영상 식별 로직) 적용
- `{VIDEO}` = `videos/{category}/{name}/`

## 사용법
```
/write-script [주제]                    ← 기본 튜토리얼 스크립트
/write-script [주제] --type tutorial    ← 튜토리얼
/write-script [주제] --type explainer   ← 설명 영상
/write-script [주제] --type motion      ← 모션그래픽
/write-script [주제] --type review      ← 리뷰
/write-script [주제] --length 5m        ← 5분 분량
/write-script [주제] --tone casual      ← 캐주얼 톤
/write-script [주제] --lang en          ← 영어 스크립트
```

## 실행 절차

### {VIDEO}/plandata/ 자료가 있는 경우
1. {VIDEO}/plandata/ 분석 → 주제/핵심 메시지 추출
2. 유형에 맞는 구조 적용
3. 씬 분할 + 나레이션 작성
4. {VIDEO}/scripts/ 에 개별 씬 md + 통합 md 생성

### 자료가 없는 경우 (인터랙티브)
1. AskUserQuestion으로 질문:
   - 영상 주제/목적
   - 타겟 시청자
   - 희망 길이
   - 톤/스타일
   - 핵심 전달 메시지 3-5개
2. 답변 기반 스크립트 초안 생성
3. 사용자 검토 후 수정

## 출력
- `{VIDEO}/scripts/scene-{N}.md` — 씬별 스크립트
- `{VIDEO}/scripts/full-script.md` — 전체 통합 스크립트
- {VIDEO}/VIDEO.md Phase 1b 상태 업데이트
