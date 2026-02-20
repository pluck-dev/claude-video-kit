# /video - 비디오 프로덕션 오케스트레이터 (모노레포)

모노레포 구조에서 모든 영상을 카테고리별로 관리하며, 스크립트 작성부터 렌더링/배포까지 전체 비디오 제작 과정을 지휘한다.

## 참조 스킬
반드시 `~/.claude/skills/video-orchestra.md`를 읽고 전체 적용합니다.

## 사용법
```
/video init [category/name]    ← 새 영상 초기화 (예: tutorials/react-hooks)
/video select [category/name]  ← 현재 작업 영상 선택
/video list                    ← 전체 영상 목록 + 상태 표시
/video scan                    ← 현재 영상 분석 → VIDEO.md 자동 생성 + 다음 단계 제안
/video status                  ← 현재 영상 진행 현황
/video next                    ← 다음 미완료 단계 실행
/video next N                  ← N개 단계 연속 실행
/video phase [phase-id]        ← 특정 단계 실행 (예: 1a, 3c)
/video sync                    ← 스크립트 ↔ 스토리보드 ↔ 코드 동기화 체크
```

## 영상 식별 로직
모든 커맨드에서 공통 적용:
1. 인자에 영상 이름이 있으면 → 사용
2. `.current-video` 파일이 있으면 → 사용
3. `videos/` 하위에 영상이 1개뿐이면 → 자동 선택
4. 여러 개면 → AskUserQuestion으로 선택 요청

## 경로 규칙
- `{VIDEO}` = `videos/{category}/{name}/` (기획, 스크립트, 씬 코드)
- `{PUBLIC}` = `public/videos/{category}/{name}/` (Remotion staticFile 에셋)
- `{OUTPUT}` = `output/{category}/{name}/` (렌더링 결과, gitignored)

## 6단계 파이프라인

### /video init [category/name]
- 최초 실행 시 루트에 Remotion 모노레포 초기화 (package.json, tsconfig, src/Root.tsx 등)
- `videos/{category}/{name}/` 하위 폴더 + VIDEO.md + Compositions.tsx 생성
- `public/videos/{category}/{name}/` 에셋 폴더 생성
- `output/{category}/{name}/` 출력 폴더 생성
- `src/Root.tsx`에 이 영상의 Compositions import 추가
- `VIDEO-INDEX.md`에 등록
- `.current-video`에 기록

### /video select [category/name]
- `.current-video` 파일에 현재 작업 영상 기록
- 이후 `/video next`, `/video phase` 등에서 자동 사용

### /video list
- `VIDEO-INDEX.md` 기반 전체 영상 목록 + 상태 표시
- `.current-video`에 해당하는 영상에 ▶ 마크

### /video scan (현재 영상)
- 서브에이전트 3개로 문서/코드/미디어 상태 병렬 스캔
- Phase별 완료 여부 자동 판정
- `{VIDEO}/VIDEO.md` 자동 생성 (이미 완료된 단계는 [x])
- `VIDEO-INDEX.md` 업데이트
- 다음 실행 가능한 단계 제안

### Phase 1: 기획 (Planning)
- 콘텐츠 기획 + 스크립트 작성 + 스토리보드 생성

### Phase 2: TTS (선택)
- 나레이션 음성 생성 (스킵 가능)

### Phase 3: 씬 개발 (Scene Dev)
- Remotion 프로젝트 확인 + 영상 전용 컴포넌트 + 씬 코드 + Compositions 등록

### Phase 4: 에셋 & 통합 (Integration)
- 에셋 배치 + 오디오 싱크 + 프리뷰 검증

### Phase 5: 렌더링 (Render)
- 롱폼/숏폼 렌더링 + 썸네일

### Phase 6: 배포 준비 (Publish)
- SEO 메타데이터 + 최종 체크 + 패키지 정리

## 핵심 원칙
- 모든 단계에 진행사항 기록 ({VIDEO}/VIDEO.md)
- VIDEO-INDEX.md로 전체 영상 목록 관리
- Remotion 프로젝트는 루트에 1개만 (모노레포)
- 영상별 Compositions.tsx에서 Composition 정의, src/Root.tsx에서 import
- 서브에이전트 병렬 처리로 효율 극대화
- 이전 단계 산출물을 다음 단계 입력으로 활용
