// 씬 01 — 훅: Before/After 비교
// durationInFrames: 330 (11s @ 30fps)
// 레이아웃: 2분할 비교 — A씨(빨강) vs B씨(초록), 하단 질문 텍스트

import React from 'react';
import { Audio, staticFile, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Gif } from '@remotion/gif';
import { Colors } from '../components/Colors';
import { CountUp } from '../components/CountUp';

// 씬 전체 배경 fadeIn
const FADE_IN_DURATION = 15;

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // 씬 전체 fadeIn
  const sceneOpacity = interpolate(frame, [0, FADE_IN_DURATION], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 씬 끝부분 fadeOut
  const sceneOpacityOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );
  const finalOpacity = Math.min(sceneOpacity, sceneOpacityOut);

  // 상단 제목 슬라이드 (0f~20f)
  const titleTranslateY = interpolate(frame, [5, 25], [-40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 왼쪽 카드 슬라이드 (20f~45f)
  const leftCardX = interpolate(frame, [20, 45], [-100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const leftCardOpacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 오른쪽 카드 슬라이드 (25f~50f)
  const rightCardX = interpolate(frame, [25, 50], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rightCardOpacity = interpolate(frame, [25, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 하단 질문 텍스트 fadeIn (80f~100f)
  const questionOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const questionTranslateY = interpolate(frame, [80, 100], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "같은 연봉 3,500만 원" 강조 텍스트 (50f~70f)
  const sameOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 리액션 GIF fadeIn/fadeOut
  const gifOpacity = interpolate(
    frame,
    [120, 135, 300, 315],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

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
      }}
    >
      <Audio src={staticFile('videos/explainers/year-end-tax-tips/narration/scene-01.mp3')} />
      {/* 리액션 GIF */}
      <div style={{
        position: 'absolute',
        right: 60,
        bottom: 80,
        opacity: gifOpacity,
        width: 400,
        height: 400,
      }}>
        <Gif
          src="https://media2.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif"
          width={400}
          height={400}
          fit="contain"
        />
      </div>
      {/* 상단 제목 */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleTranslateY}px)`,
          marginBottom: 48,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 36,
            fontWeight: 600,
            color: Colors.textMuted,
            marginBottom: 8,
          }}
        >
          연봉 3,500만 원 직장인 두 명
        </div>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 28,
            fontWeight: 500,
            color: Colors.warning,
          }}
        >
          연말정산 결과가 다릅니다
        </div>
      </div>

      {/* 2분할 비교 카드 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 40,
          width: '100%',
          alignItems: 'stretch',
        }}
      >
        {/* A씨 — 빨강 (손해) */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: `3px solid ${Colors.danger}`,
            borderRadius: 20,
            padding: '48px 56px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            opacity: leftCardOpacity,
            transform: `translateX(${leftCardX}px)`,
          }}
        >
          {/* 라벨 */}
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 30,
              fontWeight: 700,
              color: Colors.textMuted,
            }}
          >
            A씨
          </div>
          {/* 아이콘 */}
          <div style={{ fontSize: 56 }}>😢</div>
          {/* 환급액 CountUp */}
          <div style={{ textAlign: 'center' }}>
            <CountUp
              from={0}
              to={52}
              suffix="만 원"
              startFrame={40}
              durationFrames={60}
              fontSize={88}
              fontWeight={800}
              color={Colors.danger}
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
              환급
            </div>
          </div>
        </div>

        {/* vs 구분자 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            opacity: sameOpacity,
          }}
        >
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 40,
              fontWeight: 800,
              color: Colors.textMuted,
            }}
          >
            VS
          </div>
        </div>

        {/* B씨 — 초록 (환급) */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: `3px solid ${Colors.success}`,
            borderRadius: 20,
            padding: '48px 56px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            opacity: rightCardOpacity,
            transform: `translateX(${rightCardX}px)`,
          }}
        >
          {/* 라벨 */}
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 30,
              fontWeight: 700,
              color: Colors.textMuted,
            }}
          >
            B씨
          </div>
          {/* 아이콘 */}
          <div style={{ fontSize: 56 }}>😄</div>
          {/* 환급액 CountUp */}
          <div style={{ textAlign: 'center' }}>
            <CountUp
              from={0}
              to={286}
              suffix="만 원"
              startFrame={45}
              durationFrames={70}
              fontSize={88}
              fontWeight={800}
              color={Colors.success}
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
              환급
            </div>
          </div>
        </div>
      </div>

      {/* 하단 질문 텍스트 */}
      <div
        style={{
          opacity: questionOpacity,
          transform: `translateY(${questionTranslateY}px)`,
          marginTop: 48,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 40,
            fontWeight: 700,
            color: Colors.textLight,
          }}
        >
          두 사람의 차이, 뭘까요?
        </div>
      </div>
    </div>
  );
};
