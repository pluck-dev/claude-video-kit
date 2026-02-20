# VIDEO: 연말정산 꿀팁 — 놓치면 수백만 원 날린다

- **카테고리:** explainers
- **이름:** year-end-tax-tips
- **생성일:** 2026-02-20
- **상태:** 완료

---

## Phase 1: 기획
- [x] 1a. 콘텐츠 기획/분석 → `plandata/ANALYSIS.md`
- [x] 1b. 스크립트 작성 → `scripts/full-script.md`
- [x] 1c. 스토리보드 설계 → `storyboard/overview.md` + `storyboard/scene-01~11.md`

## Phase 2: TTS
- [x] 2a. TTS 나레이션 생성 → Qwen3-TTS 음성 클로닝 (0.6B-Base, 사용자 음성 37초 샘플)
  - 레퍼런스: `public/videos/explainers/year-end-tax-tips/assets/my-voice.wav`
  - 나레이션 11개: `public/videos/explainers/year-end-tax-tips/narration/scene-01~11.mp3`
  - 타이밍: `timing.json` (총 10,500프레임, 5분 50초)

## Phase 3: 씬 개발
- [x] 3a. 공유 컴포넌트 확인 → `src/shared/components/`
- [x] 3b. 영상 전용 컴포넌트 → `components/` (Colors, Typography, Card, CountUp, Checklist, ComparisonSplit, ProgressBar, Badge)
- [x] 3c. Remotion 씬 코드 → `scenes/` (Scene01~Scene11, 11개 씬)
- [x] 3d. Composition 등록 → `Compositions.tsx` (전체 + 씬별 개별 Composition)

## Phase 4: 통합
- [x] 4a. 에셋 통합 → TTS MP3 11개 + 사용자 음성 샘플
- [x] 4b. 오디오 싱크 → 씬별 `<Audio>` + `staticFile()` 연결, duration 재조정 (10,500프레임)
- [x] 4c. 프리뷰 검증 → Remotion 번들 + Composition 등록 확인 완료

## Phase 5: 렌더링
- [x] 5a. 본편 렌더링 → `output/explainers/year-end-tax-tips/year-end-tax-tips.mp4` (음성 포함, 10,500프레임)
- [ ] 5b. 숏폼 변환 → `output/explainers/year-end-tax-tips/shorts/`
- [ ] 5c. 썸네일 생성 → `output/explainers/year-end-tax-tips/thumbnails/`

## Phase 6: 배포
- [x] 6a. YouTube SEO → `publish/year-end-tax-tips-seo.md`
- [x] 6b. 배포 체크리스트
- [x] 6c. 패키지 완료

---

## 영상 정보
- **타겟:** 직장인 (2030 중심, 연말정산 초보~중급)
- **톤:** 친근하고 실용적, 충격적 수치로 후킹
- **예상 길이:** 8~12분 (본편), 60초 (숏폼 2~3개)
- **핵심 메시지:** "같은 연봉이어도 아는 만큼 돌려받는다"
