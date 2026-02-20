# /video - 비디오 프로덕션 오케스트레이터

스크립트 작성부터 렌더링/배포까지 전체 비디오 제작 과정을 지휘한다.

## 참조 스킬
반드시 `~/.claude/skills/video-orchestra.md`를 읽고 전체 적용합니다.

## 사용법
```
/video init [project-name]     ← 새 비디오 프로젝트 초기화
/video scan                    ← 기존 프로젝트 분석 → VIDEO.md 자동 생성 + 다음 단계 제안
/video status                  ← 전체 진행 현황
/video next                    ← 다음 미완료 단계 실행
/video next N                  ← N개 단계 연속 실행
/video phase [phase-id]        ← 특정 단계 실행 (예: 1a, 3c)
/video sync                    ← 스크립트 ↔ 스토리보드 ↔ 코드 동기화 체크
```

## 6단계 파이프라인

### /video scan (기존 프로젝트)
- 서브에이전트 3개로 문서/코드/미디어 상태 병렬 스캔
- Phase별 완료 여부 자동 판정
- VIDEO.md 자동 생성 (이미 완료된 단계는 [x])
- 다음 실행 가능한 단계 제안

### Phase 1: 기획 (Planning)
- 콘텐츠 기획 + 스크립트 작성 + 스토리보드 생성

### Phase 2: TTS (선택)
- 나레이션 음성 생성 (스킵 가능)

### Phase 3: 씬 개발 (Scene Dev)
- Remotion 프로젝트 세팅 + 공통 컴포넌트 + 씬 코드

### Phase 4: 에셋 & 통합 (Integration)
- 에셋 배치 + 오디오 싱크 + 프리뷰 검증

### Phase 5: 렌더링 (Render)
- 롱폼/숏폼 렌더링 + 썸네일

### Phase 6: 배포 준비 (Publish)
- SEO 메타데이터 + 최종 체크 + 패키지 정리

## 핵심 원칙
- 모든 단계에 진행사항 기록 (VIDEO.md)
- 서브에이전트 병렬 처리로 효율 극대화
- 이전 단계 산출물을 다음 단계 입력으로 활용
