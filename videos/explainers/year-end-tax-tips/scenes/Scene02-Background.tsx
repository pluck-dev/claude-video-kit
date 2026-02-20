// 씬 02 — 배경: 왜 연말정산이 중요한가
// durationInFrames: 690 (23s @ 30fps)
// 레이아웃: 중앙 대형 숫자 68만 원 CountUp → 수백만 원 전환, 배경 그래프 실루엣

import React from 'react';
import { Audio, staticFile, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Gif } from '@remotion/gif';
import { Colors } from '../components/Colors';
import { CountUp } from '../components/CountUp';

export const Scene02Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // 씬 전체 fadeIn / fadeOut
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const sceneOpacityOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );
  const finalOpacity = Math.min(sceneOpacity, sceneOpacityOut);

  // 1단계: "비결은 하나" 텍스트 (0~90f)
  const step1Opacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const step1FadeOut = interpolate(frame, [80, 100], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 2단계: "평균 68만 원" CountUp (100~360f)
  const step2Opacity = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 3단계: 화살표 + "수백만 원" 전환 (360~540f)
  const arrowOpacity = interpolate(frame, [360, 380], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const arrowTranslateX = interpolate(frame, [360, 390], [-30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const hundredsOpacity = interpolate(frame, [390, 420], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const hundredsScale = interpolate(frame, [390, 420], [0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 4단계: 하단 설명 텍스트 (450~)
  const descOpacity = interpolate(frame, [450, 480], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const descTranslateY = interpolate(frame, [450, 480], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 리액션 GIF fadeIn/fadeOut
  const gifOpacity = interpolate(
    frame,
    [400, 415, 660, 675],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 배경 그래프 바 애니메이션 (장식용)
  const graphBars = [
    { height: 120, delay: 0, label: '1월' },
    { height: 80, delay: 5, label: '2월' },
    { height: 200, delay: 10, label: '3월' },
    { height: 150, delay: 15, label: '4월' },
    { height: 100, delay: 20, label: '5월' },
    { height: 180, delay: 25, label: '6월' },
    { height: 240, delay: 30, label: '7월' },
    { height: 130, delay: 35, label: '8월' },
    { height: 90, delay: 40, label: '9월' },
    { height: 170, delay: 45, label: '10월' },
    { height: 110, delay: 50, label: '11월' },
    { height: 300, delay: 55, label: '12월' },
  ];

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: Colors.bgDark,
        opacity: finalOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 100px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Audio src={staticFile('videos/explainers/year-end-tax-tips/narration/scene-02.mp3')} />
      {/* 리액션 GIF */}
      <div style={{
        position: 'absolute',
        left: 60,
        bottom: 80,
        opacity: gifOpacity,
        width: 400,
        height: 400,
      }}>
        <Gif
          src="https://media2.giphy.com/media/MuE5fJSHjlEFe1ndTK/giphy.gif"
          width={400}
          height={400}
          fit="contain"
        />
      </div>
      {/* 배경 그래프 실루엣 (장식) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 20,
          padding: '0 100px',
          opacity: 0.06,
        }}
      >
        {graphBars.map((bar, i) => {
          const barHeight = interpolate(
            frame,
            [bar.delay, bar.delay + 40],
            [0, bar.height],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: barHeight,
                backgroundColor: Colors.primary,
                borderRadius: '4px 4px 0 0',
              }}
            />
          );
        })}
      </div>

      {/* 1단계: 비결 텍스트 */}
      <div
        style={{
          opacity: step1Opacity * step1FadeOut,
          position: 'absolute',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 56,
            fontWeight: 700,
            color: Colors.textLight,
            marginBottom: 16,
          }}
        >
          비결은 하나입니다
        </div>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 36,
            fontWeight: 500,
            color: Colors.warning,
          }}
        >
          아는 만큼 돌려받는 거예요
        </div>
      </div>

      {/* 2단계: 평균 환급액 */}
      <div
        style={{
          opacity: step2Opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* 상단 설명 */}
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 32,
            fontWeight: 600,
            color: Colors.textMuted,
            marginBottom: 8,
          }}
        >
          직장인 평균 연말정산 환급액
        </div>

        {/* 평균 68만 원 + 화살표 + 수백만 원 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
          }}
        >
          {/* 68만 원 CountUp */}
          <div style={{ textAlign: 'center' }}>
            <CountUp
              from={0}
              to={68}
              suffix="만 원"
              startFrame={110}
              durationFrames={90}
              fontSize={100}
              fontWeight={800}
              color={Colors.textMuted}
            />
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 24,
                fontWeight: 500,
                color: Colors.textMuted,
                marginTop: 8,
              }}
            >
              평균
            </div>
          </div>

          {/* 화살표 */}
          <div
            style={{
              opacity: arrowOpacity,
              transform: `translateX(${arrowTranslateX}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 24,
                fontWeight: 600,
                color: Colors.warning,
              }}
            >
              꿀팁 몇 개만 알면
            </div>
            <div
              style={{
                fontSize: 48,
                color: Colors.warning,
              }}
            >
              →
            </div>
          </div>

          {/* 수백만 원 */}
          <div
            style={{
              opacity: hundredsOpacity,
              transform: `scale(${hundredsScale})`,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 100,
                fontWeight: 800,
                color: Colors.success,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              수백만 원
            </div>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 24,
                fontWeight: 500,
                color: Colors.success,
                marginTop: 8,
              }}
            >
              통장에 꽂힙니다
            </div>
          </div>
        </div>

        {/* 하단 설명 */}
        <div
          style={{
            opacity: descOpacity,
            transform: `translateY(${descTranslateY}px)`,
            marginTop: 40,
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 26,
              fontWeight: 500,
              color: Colors.textMuted,
              lineHeight: 1.6,
            }}
          >
            국세청 자료에서 확인된 실제 숫자예요.
            <br />
            공제 항목을 제대로 챙기면, 같은 연봉으로 전혀 다른 결과가 나옵니다.
          </div>
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 30,
              fontWeight: 700,
              color: Colors.warning,
              marginTop: 20,
            }}
          >
            오늘, 그 방법 다 알려드릴게요.
          </div>
        </div>
      </div>
    </div>
  );
};
