# 연말정산 꿀팁 — 이거 모르면 수백만 원 날린다
# 스토리보드 전체 개요

- **프로젝트:** year-end-tax-tips
- **유형:** Explainer (설명 영상)
- **해상도:** 1920 × 1080 (16:9)
- **FPS:** 30
- **작성일:** 2026-02-20

---

## 타임라인 테이블

| 씬 | 제목 | 시작 프레임 | durationInFrames | 길이(s) | 누적 시간 | 비주얼 유형 |
|----|------|------------|-----------------|--------|----------|------------|
| 01 | 훅 — Before/After 비교 | 0 | 450 | 15s | 0:15 | 모션그래픽 |
| 02 | 배경 — 왜 연말정산이 중요한가 | 450 | 900 | 30s | 0:45 | 인포그래픽 |
| 03 | 꿀팁 1 — 중소기업 청년 소득세 90% 감면 | 1350 | 1800 | 60s | 1:45 | 카드 + 타이포그래피 |
| 04 | 꿀팁 2 — 연금저축 + IRP 148만 원 환급 | 3150 | 1800 | 60s | 2:45 | 계산기 다이어그램 |
| 05 | 꿀팁 3 — 고향사랑기부제 10만 원의 마법 | 4950 | 1350 | 45s | 3:30 | 흐름도 |
| 06 | 꿀팁 4 — 월세 세액공제 2025년 대폭 확대 | 6300 | 1350 | 45s | 4:15 | Before/After 비교 |
| 07 | 2025년 NEW — 결혼세액공제 + 헬스장 공제 | 7650 | 1350 | 45s | 5:00 | 카드 2분할 |
| 08 | 흔한 실수 TOP 3 | 9000 | 1800 | 60s | 6:00 | 경고 카드 |
| 09 | 신용카드 25% 전략 + 자녀·교육비 공제 | 10800 | 1350 | 45s | 6:45 | 다이어그램 + 테이블 |
| 10 | 체크리스트 정리 | 12150 | 900 | 30s | 7:15 | 체크박스 애니메이션 |
| 11 | 아웃트로 + CTA | 13050 | 600 | 20s | 7:35 | 브랜딩 |

**총 프레임:** 13,650 프레임
**총 길이:** 7분 35초 (씬 전환·자막 여유 포함 약 8분 30초 예상)

---

## 색상 팔레트

| 역할 | 색상 코드 | 사용 컨텍스트 |
|------|-----------|--------------|
| 주색 (신뢰/공식) | `#2563EB` | 제목, 강조 박스, 버튼 |
| 보조색 (환급/이익) | `#10B981` | 환급 금액, 긍정 수치, 체크 아이콘 |
| 강조색 (손해/주의) | `#EF4444` | 경고, 손해 수치, 실수 아이콘 |
| 황금색 (꿀팁/포인트) | `#F59E0B` | 꿀팁 배지, 포인트 텍스트, 별 |
| 배경 | `#0F172A` | 전체 배경 (다크 네이비) |
| 서브 배경 | `#1E293B` | 카드, 박스 배경 |
| 텍스트 | `#F8FAFC` | 기본 텍스트 |
| 텍스트 보조 | `#94A3B8` | 부제목, 설명 텍스트 |

---

## 타이포그래피 시스템

| 역할 | 폰트 | 크기 | 굵기 |
|------|------|------|------|
| 대제목 | Pretendard | 56px | Bold (700) |
| 소제목 | Pretendard | 36px | SemiBold (600) |
| 본문 | Pretendard | 24px | Medium (500) |
| 숫자 강조 | Pretendard | 72px | ExtraBold (800) |
| 자막 | Pretendard | 20px | Regular (400) |
| 배지/태그 | Pretendard | 16px | SemiBold (600) |

---

## 레이아웃 공통 규칙

- **캔버스 크기:** 1920 × 1080px
- **양쪽 여백:** 100px
- **상하 여백:** 80px
- **자막 위치:** 하단 100px (y: 960px)
- **카드 border-radius:** 16px
- **카드 padding:** 32px
- **씬 전환 기본:** fadeIn 15f / fadeOut 15f

---

## 컴포넌트 네이밍 규칙

| 씬 | 컴포넌트명 | 파일 위치 |
|----|-----------|----------|
| 01 | `Scene01Hook` | `scenes/Scene01-Hook.tsx` |
| 02 | `Scene02Background` | `scenes/Scene02-Background.tsx` |
| 03 | `Scene03Tip1SmeSme` | `scenes/Scene03-Tip1-Sme.tsx` |
| 04 | `Scene04Tip2Pension` | `scenes/Scene04-Tip2-Pension.tsx` |
| 05 | `Scene05Tip3Hometown` | `scenes/Scene05-Tip3-Hometown.tsx` |
| 06 | `Scene06Tip4MonthlyRent` | `scenes/Scene06-Tip4-MonthlyRent.tsx` |
| 07 | `Scene07New2025` | `scenes/Scene07-New2025.tsx` |
| 08 | `Scene08Mistakes` | `scenes/Scene08-Mistakes.tsx` |
| 09 | `Scene09CardStrategy` | `scenes/Scene09-CardStrategy.tsx` |
| 10 | `Scene10Checklist` | `scenes/Scene10-Checklist.tsx` |
| 11 | `Scene11Outro` | `scenes/Scene11-Outro.tsx` |

---

## 에셋 디렉토리 구조

```
public/videos/explainers/year-end-tax-tips/
├── narration/
│   ├── scene-01.mp3
│   ├── scene-02.mp3
│   ├── ...
│   └── scene-11.mp3
└── assets/
    ├── icons/
    │   ├── icon-check.svg
    │   ├── icon-warning.svg
    │   ├── icon-gift.svg
    │   ├── icon-home.svg
    │   ├── icon-gym.svg
    │   ├── icon-ring.svg
    │   └── icon-card.svg
    ├── images/
    │   └── channel-logo.png
    └── fonts/
        └── Pretendard-Variable.woff2
```

---

## 비주얼 일관성 체크리스트

### 색상
- [ ] 주요 색상 팔레트 정의 (`src/lib/colors.ts`)
- [ ] 모든 씬에 동일한 배경색 `#0F172A` 적용
- [ ] 환급/긍정 수치는 `#10B981` (초록) 통일
- [ ] 손해/경고 수치는 `#EF4444` (빨강) 통일
- [ ] 꿀팁 배지는 `#F59E0B` (황금) 통일

### 타이포그래피
- [ ] Pretendard Variable 폰트 단일 사용
- [ ] 대제목 56px Bold 통일
- [ ] 숫자 강조 72px ExtraBold 통일
- [ ] 자막 20px Regular, 하단 100px 고정

### 레이아웃
- [ ] 16:9 (1920×1080) 일관 유지
- [ ] 양쪽 여백 100px 통일
- [ ] 카드 border-radius 16px 통일
- [ ] 자막 위치 하단 100px 고정

### 애니메이션
- [ ] 씬 시작: fadeIn 15f 기본
- [ ] 씬 종료: fadeOut 15f 기본
- [ ] 카드 등장: slideFromBottom 20f
- [ ] 숫자 강조: countUp (spring 기반)
- [ ] CSS animation/transition/keyframes 절대 미사용
- [ ] 모든 애니메이션 useCurrentFrame() + interpolate()/spring() 사용

### 씬 전환 흐름
- [ ] 씬 01→02: fadeOut/fadeIn
- [ ] 씬 02→03: wipe (가로)
- [ ] 씬 03→08: wipe (가로, 꿀팁 씬 간)
- [ ] 씬 08→09: wipe (가로)
- [ ] 씬 10→11: fadeOut/fadeIn

---

## 핵심 후킹 포인트 요약

| 씬 | 후킹 문구 | 비주얼 임팩트 |
|----|-----------|--------------|
| 01 | "A씨 52만 원 vs B씨 286만 원, 같은 연봉" | 숫자 카운트업 + 색상 대비 |
| 03 | "모르면 1,000만 원 손해" | 90% 대형 타이포그래피 |
| 04 | "900만 원 납입 → 148만 원 환급" | 계산 다이어그램 |
| 05 | "기부했는데 돈이 생긴다?" | 흐름도 + 강조 수치 |
| 06 | "2025년 기준 확 바뀌었습니다" | Before/After 비교 |
| 08 | "이거 잘못하면 가산세 맞습니다" | 빨간 경고 아이콘 |
| 10 | "이 여섯 가지만 챙겨도 수백만 원 달라진다" | 체크박스 6개 순차 체크 |
