# /video-seo - YouTube SEO 메타데이터 생성

영상의 제목, 설명, 태그, 챕터 마커 등 SEO 메타데이터를 생성합니다.

## 참조 스킬
반드시 `~/.claude/skills/youtube-seo.md`를 읽고 전체 적용합니다.

## 경로 규칙
- 영상 식별: `~/.claude/skills/video-orchestra.md` §3 (영상 식별 로직) 적용
- `{VIDEO}` = `videos/{category}/{name}/`

## 사용법
```
/video-seo                     ← 롱폼 SEO 메타데이터 생성
/video-seo --shorts            ← 숏폼 SEO 메타데이터 생성
/video-seo --lang en           ← 영어 SEO
/video-seo --keywords "키워드" ← 타겟 키워드 지정
```

## 실행 절차
1. {VIDEO}/scripts/full-script.md에서 핵심 내용 추출
2. 제목 후보 3-5개 생성 → 사용자 선택
3. 설명 생성 (첫 2줄 핵심)
4. 태그 생성 (핵심 + 롱테일)
5. 챕터 마커 자동 생성 (스크립트 씬 기반)
6. 썸네일 텍스트 제안
7. {VIDEO}/publish/{name}-seo.md 저장

## 출력
- `{VIDEO}/publish/{name}-seo.md` — SEO 메타데이터
- `{VIDEO}/publish/{name}-shorts-seo.md` — 숏폼 SEO (--shorts)
- {VIDEO}/VIDEO.md Phase 6a 상태 업데이트
