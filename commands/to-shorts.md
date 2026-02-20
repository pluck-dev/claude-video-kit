# /to-shorts - 롱폼→숏폼 변환

롱폼(16:9) 영상을 숏폼(9:16) YouTube Shorts/Reels로 변환합니다.

## 참조 스킬
반드시 다음 2개 스킬을 읽고 적용합니다:
- `~/.claude/skills/remotion-patterns.md` — Remotion 숏폼 변환 패턴
- `~/.claude/skills/youtube-seo.md` — 숏폼 SEO 차이점

## 경로 규칙
- 영상 식별: `~/.claude/skills/video-orchestra.md` §3 (영상 식별 로직) 적용
- `{VIDEO}` = `videos/{category}/{name}/`
- `{OUTPUT}` = `output/{category}/{name}/`

## 사용법
```
/to-shorts                     ← 전체 영상에서 숏폼 하이라이트 생성
/to-shorts --count 3           ← 3개 숏폼 생성
/to-shorts --scene 2,5         ← 특정 씬만 숏폼으로
/to-shorts --max-length 60     ← 최대 60초
```

## 실행 절차
1. {VIDEO}/scripts/에서 숏폼 적합 구간 추출 (핵심 메시지, 훅)
2. 레이아웃 변환: 1920x1080 → 1080x1920
   - 텍스트 크기 증가 (모바일 가독성)
   - 세로 레이아웃 재배치
   - 자막 중앙 하단 배치
3. 숏폼 씬 생성 ({VIDEO}/scenes/Shorts-{N}.tsx)
4. {VIDEO}/Compositions.tsx에 숏폼 Composition 등록
5. 렌더링: {OUTPUT}/shorts/{name}-shorts.mp4
6. 숏폼 SEO 메타데이터 생성

## 숏폼 규칙
- 최대 60초 (YouTube Shorts 제한)
- 세로 9:16 (1080x1920)
- 첫 3초에 강력한 훅 필수
- 자막 필수 (무음 시청 대비)
- 루프 가능한 구성 권장

## 출력
- `{VIDEO}/scenes/Shorts-{N}.tsx` — 숏폼 씬 컴포넌트
- `{OUTPUT}/shorts/{name}.mp4` — 렌더링 결과
- `{VIDEO}/publish/{name}-shorts-seo.md` — 숏폼 SEO
- {VIDEO}/VIDEO.md Phase 5b 상태 업데이트
