# Remotion 베스트 프랙티스

## 개요

Remotion(React 기반 프로그래매틱 비디오)으로 영상을 만들 때의 핵심 패턴과 규칙.
Remotion은 React 컴포넌트를 프레임 단위로 렌더링하여 MP4 영상을 생성한다.

---

## 프로젝트 구조

```
src/
├── Root.tsx                  ← Composition 등록 (진입점)
├── scenes/                   ← 씬 컴포넌트 (씬 하나당 파일 하나)
│   ├── Scene01-Intro.tsx
│   ├── Scene02-Main.tsx
│   └── ...
├── components/               ← 재사용 컴포넌트
│   ├── AnimatedText.tsx
│   ├── CodeBlock.tsx
│   ├── TransitionWrapper.tsx
│   └── ...
├── hooks/                    ← 커스텀 훅
│   ├── useAnimationProgress.ts
│   └── useFadeIn.ts
├── lib/                      ← 유틸리티 및 상수
│   ├── constants.ts          ← FPS, 해상도, 공통 타이밍
│   ├── colors.ts             ← 색상 팔레트
│   └── fonts.ts              ← 폰트 등록
└── types/                    ← TypeScript 타입 정의
    └── scenes.ts
```

### `src/lib/constants.ts` 예시

```typescript
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// 공통 애니메이션 타이밍 (프레임 단위)
export const FADE_DURATION = 20;
export const SLIDE_DURATION = 25;
export const SPRING_DAMPING = 12;
```

---

## CSS Animation 금지 규칙

**절대 CSS animation, transition, keyframes를 사용하지 않는다.**

Remotion은 프레임 단위로 렌더링한다. 각 프레임은 독립적으로 캡처되기 때문에
CSS animation과 transition은 렌더링 시 동작하지 않는다.
반드시 `useCurrentFrame()` + `interpolate()` 또는 `spring()`을 사용한다.

```tsx
// Bad - 절대 사용 금지
const style = {
  animation: 'fadeIn 1s ease-in-out',
  transition: 'opacity 0.3s',
};

// Good - 항상 이 방식 사용
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: 'clamp',
});
const style = { opacity };
```

---

## 핵심 API 패턴

### Composition (루트 등록)

`Root.tsx`에서 모든 Composition을 등록한다.

```tsx
// src/Root.tsx
import { Composition } from 'remotion';
import { Scene01Intro } from './scenes/Scene01-Intro';
import { MainVideo } from './MainVideo';
import { FPS, WIDTH, HEIGHT } from './lib/constants';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 전체 영상 */}
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={690}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {/* 씬 단독 미리보기용 */}
      <Composition
        id="Scene01"
        component={Scene01Intro}
        durationInFrames={150}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
```

---

### Sequence (씬 순차 배치)

`MainVideo.tsx`에서 Sequence로 씬을 타임라인에 배치한다.

```tsx
// src/MainVideo.tsx
import { Sequence } from 'remotion';
import { Scene01Intro } from './scenes/Scene01-Intro';
import { Scene02Main } from './scenes/Scene02-Main';
import { Scene03Outro } from './scenes/Scene03-Outro';

export const MainVideo: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={150}>
        <Scene01Intro />
      </Sequence>
      <Sequence from={150} durationInFrames={300}>
        <Scene02Main />
      </Sequence>
      <Sequence from={450} durationInFrames={240}>
        <Scene03Outro />
      </Sequence>
    </>
  );
};
```

---

### interpolate (선형 보간)

가장 기본적인 애니메이션 도구. 프레임 범위를 값 범위로 매핑한다.

```tsx
import { interpolate, useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();

// opacity: 0프레임에서 0, 30프레임에서 1이 되고, 이후에는 1 유지
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

// translateX: 0프레임에서 -100%, 25프레임에서 0%
const translateX = interpolate(frame, [0, 25], [-100, 0], {
  extrapolateRight: 'clamp',
});

const style = {
  opacity,
  transform: `translateX(${translateX}%)`,
};
```

**extrapolate 옵션**

- `'clamp'`: 범위를 벗어나면 끝값으로 고정 (가장 많이 사용)
- `'extend'`: 범위를 벗어나면 선형 연장
- `'wrap'`: 범위를 벗어나면 순환
- `'identity'`: 출력값 = 입력값

---

### spring (스프링 애니메이션)

자연스럽고 탄력 있는 애니메이션. 물리 기반 시뮬레이션.

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// 기본 스프링 (from 0 to 1)
const scale = spring({
  frame,
  fps,
  from: 0,
  to: 1,
  config: {
    damping: 12,    // 감쇠 (높을수록 덜 튕김)
    stiffness: 200, // 강성 (높을수록 빠름)
    mass: 1,        // 질량 (높을수록 느림)
  },
});

const style = {
  transform: `scale(${scale})`,
};
```

---

## 20가지 애니메이션 레시피

### 01. fadeIn - 페이드 인

```tsx
const opacity = interpolate(frame, [0, FADE_DURATION], [0, 1], {
  extrapolateRight: 'clamp',
});
```

사용 상황: 씬 시작, 텍스트 등장, 이미지 등장

---

### 02. fadeOut - 페이드 아웃

```tsx
// durationInFrames가 150일 때 마지막 20프레임에서 페이드 아웃
const opacity = interpolate(
  frame,
  [durationInFrames - FADE_DURATION, durationInFrames],
  [1, 0],
  { extrapolateLeft: 'clamp' }
);
```

사용 상황: 씬 종료, 부드러운 퇴장

---

### 03. slideFromLeft - 왼쪽에서 슬라이드

```tsx
const translateX = interpolate(frame, [0, SLIDE_DURATION], [-100, 0], {
  extrapolateRight: 'clamp',
});
const style = { transform: `translateX(${translateX}%)` };
```

사용 상황: 새 단계 시작, 리스트 항목 순차 등장

---

### 04. slideFromRight - 오른쪽에서 슬라이드

```tsx
const translateX = interpolate(frame, [0, SLIDE_DURATION], [100, 0], {
  extrapolateRight: 'clamp',
});
```

사용 상황: 다음 항목, 비교 레이아웃 오른쪽

---

### 05. slideFromBottom - 아래에서 슬라이드

```tsx
const translateY = interpolate(frame, [0, SLIDE_DURATION], [100, 0], {
  extrapolateRight: 'clamp',
});
const style = { transform: `translateY(${translateY}%)` };
```

사용 상황: 자막 등장, 카드 팝업

---

### 06. scaleUp - 확대 등장

```tsx
const scale = spring({ frame, fps, from: 0, to: 1, config: { damping: 12 } });
const style = { transform: `scale(${scale})` };
```

사용 상황: 강조 요소, 아이콘, 버튼

---

### 07. scaleDown - 축소 퇴장

```tsx
const scale = interpolate(frame, [0, 15], [1, 0], {
  extrapolateRight: 'clamp',
});
```

사용 상황: 요소 제거, 씬 전환

---

### 08. typewriter - 타이프라이터 효과

```tsx
const text = "안녕하세요, Remotion입니다.";
const charsToShow = Math.floor(
  interpolate(frame, [0, 60], [0, text.length], { extrapolateRight: 'clamp' })
);
const displayText = text.slice(0, charsToShow);
```

사용 상황: 코드 타이핑, 텍스트 강조 소개

---

### 09. countUp - 숫자 카운트업

```tsx
const targetNumber = 1000;
const displayNumber = Math.floor(
  interpolate(frame, [0, 60], [0, targetNumber], { extrapolateRight: 'clamp' })
);
// JSX: <span>{displayNumber.toLocaleString()}</span>
```

사용 상황: 통계, 데이터 강조

---

### 10. progressBar - 프로그레스 바

```tsx
const progress = interpolate(frame, [0, 90], [0, 100], {
  extrapolateRight: 'clamp',
});
const style = { width: `${progress}%`, height: 8, backgroundColor: '#4ade80' };
```

사용 상황: 로딩, 진행률, 완료 표시

---

### 11. rotateIn - 회전 등장

```tsx
const rotate = interpolate(frame, [0, 30], [180, 0], {
  extrapolateRight: 'clamp',
});
const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
const style = { transform: `rotate(${rotate}deg)`, opacity };
```

사용 상황: 아이콘 강조, 주의 유도

---

### 12. blur - 블러 등장

```tsx
const blurAmount = interpolate(frame, [0, 30], [10, 0], {
  extrapolateRight: 'clamp',
});
const style = { filter: `blur(${blurAmount}px)` };
```

사용 상황: 배경 등장, 부드러운 포커스 인

---

### 13. colorChange - 색상 전환

```tsx
import { interpolateColors } from 'remotion';

const color = interpolateColors(frame, [0, 60], ['#ff0000', '#0000ff']);
const style = { color };
```

사용 상황: 상태 변화, 강조 색상 전환

---

### 14. bounce - 바운스

```tsx
const translateY = spring({
  frame,
  fps,
  from: -50,
  to: 0,
  config: { damping: 6, stiffness: 300 }, // damping 낮을수록 많이 튕김
});
```

사용 상황: 알림, 아이콘, 중요 요소 강조

---

### 15. stagger - 순차 등장 (stagger)

```tsx
const items = ['항목 1', '항목 2', '항목 3'];
const STAGGER_DELAY = 15; // 항목당 15프레임 딜레이

items.map((item, i) => {
  const delayedFrame = Math.max(0, frame - i * STAGGER_DELAY);
  const opacity = interpolate(delayedFrame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });
  return <div style={{ opacity }}>{item}</div>;
});
```

사용 상황: 리스트, 기능 소개, 단계별 노출

---

### 16. parallax - 패럴랙스 (다중 레이어)

```tsx
// 배경은 느리게, 전경은 빠르게
const bgX = interpolate(frame, [0, 300], [0, -50]);
const fgX = interpolate(frame, [0, 300], [0, -150]);

// JSX
<div style={{ transform: `translateX(${bgX}px)` }}>배경</div>
<div style={{ transform: `translateX(${fgX}px)` }}>전경</div>
```

사용 상황: 인트로, 배경 효과, 깊이감 표현

---

### 17. morphing - 위치/크기 변환

```tsx
const x = interpolate(frame, [0, 60], [0, 300], { extrapolateRight: 'clamp' });
const width = interpolate(frame, [0, 60], [100, 400], { extrapolateRight: 'clamp' });
const style = { transform: `translateX(${x}px)`, width };
```

사용 상황: 레이아웃 전환, 카드 확장

---

### 18. wipeLeft - 와이프 전환

```tsx
const clipWidth = interpolate(frame, [0, 30], [0, 100], {
  extrapolateRight: 'clamp',
});
const style = { clipPath: `inset(0 ${100 - clipWidth}% 0 0)` };
```

사용 상황: 슬라이드 전환, 비교 전후

---

### 19. curtainReveal - 커튼 오픈

```tsx
// 위아래로 분할하여 열리는 효과
const topClip = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: 'clamp' });
const bottomClip = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: 'clamp' });
const style = { clipPath: `inset(${topClip}% 0 ${bottomClip}% 0)` };
```

사용 상황: 인트로 임팩트, 결과 공개

---

### 20. glitch - 글리치 효과

```tsx
const glitchOffset = Math.random() > 0.9
  ? interpolate(Math.random(), [0, 1], [-10, 10])
  : 0;
const style = { transform: `translateX(${glitchOffset}px)` };
```

사용 상황: 사이버펑크 스타일, 오류 표현

---

### 21. pulse - 펄스 (반복 확대/축소)

```tsx
const pulse = 1 + 0.05 * Math.sin((frame / fps) * Math.PI * 2);
const style = { transform: `scale(${pulse})` };
```

사용 상황: 주의 유도, 버튼 강조

---

### 22. wave - 웨이브 (사인 곡선)

```tsx
const wave = Math.sin((frame / fps) * Math.PI * 2) * 20;
const style = { transform: `translateY(${wave}px)` };
```

사용 상황: 로고 플로팅, 배경 요소

---

## 숏폼 (Shorts / Reels) 변환

롱폼(16:9) 프로젝트를 숏폼(9:16)으로 변환할 때의 규칙.

```tsx
// Root.tsx에 숏폼 Composition 추가
<Composition
  id="MainVideoShorts"
  component={MainVideoShorts}
  durationInFrames={Math.min(totalFrames, 60 * FPS)} // 최대 60초
  fps={FPS}
  width={1080}   // 9:16
  height={1920}
/>
```

**변환 체크리스트**

- [ ] 해상도 1080 × 1920으로 변경
- [ ] 최대 60초 (YouTube Shorts 제한)
- [ ] 레이아웃 세로 방향으로 재배치
- [ ] 텍스트 크기 1.3-1.5배 증가
- [ ] 자막 화면 하단 중앙 배치
- [ ] 핵심 정보를 화면 중앙 1/3에 집중
- [ ] 불필요한 요소 제거 (작은 화면에서 복잡하면 안 됨)

---

## 오디오 통합

```tsx
import { Audio, staticFile } from 'remotion';

// 나레이션 (씬별)
<Audio src={staticFile('audio/narration/scene-01.mp3')} />

// 배경 음악 (볼륨 낮춤)
<Audio
  src={staticFile('audio/bgm/background.mp3')}
  volume={0.2}
/>

// 특정 구간만 재생
<Audio
  src={staticFile('audio/narration/scene-01.mp3')}
  startFrom={30}   // 1초 후부터
  endAt={120}      // 4초까지
/>
```

**오디오 파일 구조**

```
public/
└── audio/
    ├── narration/
    │   ├── scene-01.mp3
    │   ├── scene-02.mp3
    │   └── ...
    └── bgm/
        └── background.mp3
```

---

## 폰트 등록

### Google Fonts 사용

```bash
npm install @remotion/google-fonts
```

```tsx
// src/lib/fonts.ts
import { loadFont } from '@remotion/google-fonts/Noto Sans KR';

const { fontFamily } = loadFont();
export { fontFamily };

// 사용
import { fontFamily } from '../lib/fonts';
<div style={{ fontFamily }}>한국어 텍스트</div>
```

### 로컬 폰트 사용

```tsx
// src/lib/fonts.ts
import { staticFile } from 'remotion';

const fontFace = `
  @font-face {
    font-family: 'Pretendard';
    src: url('${staticFile('fonts/Pretendard-Regular.woff2')}') format('woff2');
    font-weight: 400;
  }
`;

// Root.tsx에서 적용
<style>{fontFace}</style>
```

---

## 성능 가이드

### 에셋 관리

- 이미지, 폰트, 오디오는 `public/` 폴더에 배치한다
- `public/` 에셋은 반드시 `staticFile()`로 참조한다
- `src/` 폴더에 큰 바이너리 파일을 넣지 않는다

```tsx
// Good
<Img src={staticFile('images/logo.png')} />

// Bad
import logo from './assets/logo.png';
```

### 렌더링 최적화

```tsx
// 불필요한 리렌더 방지
const expensiveValue = useMemo(() => heavyCalculation(frame), [frame]);

// 큰 컴포넌트 분리
const HeavyChart = React.memo(({ data }) => <Chart data={data} />);
```

### 비동기 리소스 대기

```tsx
import { delayRender, continueRender } from 'remotion';

const handle = delayRender();
fetchData().then((data) => {
  setData(data);
  continueRender(handle);
});
```

---

## 렌더링 명령어

```bash
# 개발 미리보기 (Remotion Studio)
npx remotion studio

# 전체 영상 렌더링
npx remotion render src/index.ts MainVideo output/video.mp4

# 특정 씬만 렌더링 (개발/테스트용)
npx remotion render src/index.ts Scene01 output/scene-01.mp4

# 숏폼 렌더링
npx remotion render src/index.ts MainVideoShorts output/shorts.mp4

# 썸네일 생성 (특정 프레임을 이미지로)
npx remotion still src/index.ts Thumbnail --frame=30 output/thumbnail.png

# 렌더링 품질 조정
npx remotion render src/index.ts MainVideo output/video.mp4 \
  --codec=h264 \
  --crf=18
```

---

## 주의사항

- CSS animation / transition / keyframes 절대 금지
- `useCurrentFrame()` + `interpolate()` 또는 `spring()`만 사용한다
- 모든 시간 단위는 프레임(frame)으로 관리한다 (초 단위 혼용 금지)
- `durationInFrames = 초 × fps` 공식을 반드시 지킨다
- `public/` 폴더의 에셋은 `staticFile()`로만 참조한다
- 각 씬은 독립적인 파일(`Scene{N}-{제목}.tsx`)로 분리한다
- `Root.tsx`에서 전체 영상과 씬별 Composition을 모두 등록한다
