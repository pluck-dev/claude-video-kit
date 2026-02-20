# /storyboard - 스토리보드 생성

스크립트를 기반으로 시각적 스토리보드를 생성합니다.

## 참조 스킬
반드시 `~/.claude/skills/storyboard-design.md`를 읽고 전체 적용합니다.

## 사용법
```
/storyboard                    ← 전체 스크립트 기반 스토리보드 생성
/storyboard [scene-id]         ← 특정 씬만 스토리보드 생성
/storyboard --format shorts    ← 숏폼(9:16) 레이아웃
```

## 실행 절차
1. scripts/ 폴더에서 스크립트 읽기
2. 씬별 레이아웃 테이블 생성
3. ASCII 스케치 작성
4. 프레임 계산 (FPS 기반)
5. 트랜지션 지정
6. Remotion 컴포넌트 매핑
7. storyboard/ 에 md 파일 생성

## 출력
- `storyboard/scene-{N}.md` — 씬별 스토리보드
- `storyboard/overview.md` — 전체 타임라인 개요
- VIDEO.md Phase 1c 상태 업데이트
