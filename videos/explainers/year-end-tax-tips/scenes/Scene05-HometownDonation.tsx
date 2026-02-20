// 씬 05 — 꿀팁 3: 고향사랑기부제 10만 원의 마법
// durationInFrames: 900 (30s @ 30fps)
// 레이아웃: 흐름도 — 10만 원 기부 → 세금 10만 원 환급 → 답례품 3만 원 → 순이익 +3만 원

import React from 'react';
import { Audio, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Gif } from '@remotion/gif';
import { Colors } from '../components/Colors';

// 흐름도 단계 컴포넌트
interface FlowStepProps {
  icon: string;
  label: string;
  amount: string;
  amountColor: string;
  bgColor: string;
  borderColor: string;
  startFrame: number;
  fps: number;
  frame: number;
}

const FlowStep: React.FC<FlowStepProps> = ({
  icon,
  label,
  amount,
  amountColor,
  bgColor,
  borderColor,
  startFrame,
  fps,
  frame,
}) => {
  const scale = spring({
    frame: frame - startFrame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 220, mass: 0.9 },
  });

  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: `3px solid ${borderColor}`,
        borderRadius: 20,
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        transform: `scale(${scale})`,
        minWidth: 220,
      }}
    >
      <div style={{ fontSize: 48 }}>{icon}</div>
      <div
        style={{
          fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
          fontSize: 20,
          fontWeight: 600,
          color: Colors.textMuted,
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
          fontSize: 36,
          fontWeight: 800,
          color: amountColor,
          textAlign: 'center',
          lineHeight: 1,
        }}
      >
        {amount}
      </div>
    </div>
  );
};

// 화살표 컴포넌트
interface ArrowProps {
  startFrame: number;
  frame: number;
  label?: string;
}

const Arrow: React.FC<ArrowProps> = ({ startFrame, frame, label }) => {
  const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateX = interpolate(frame, [startFrame, startFrame + 15], [-20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        opacity,
        transform: `translateX(${translateX}px)`,
        flexShrink: 0,
      }}
    >
      {label && (
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: Colors.textMuted,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          fontSize: 36,
          color: Colors.warning,
        }}
      >
        →
      </div>
    </div>
  );
};

export const Scene05HometownDonation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 씬 fadeIn / fadeOut
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

  // 헤더 (0~30f)
  const headerOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 설명 텍스트 (550~600f)
  const descOpacity = interpolate(frame, [550, 580], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 2025년 변경사항 (750~800f)
  const updateOpacity = interpolate(frame, [750, 780], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 리액션 GIF fadeIn/fadeOut
  const gifOpacity = interpolate(
    frame,
    [200, 215, 450, 465],
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
        padding: '60px 100px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Audio src={staticFile('videos/explainers/year-end-tax-tips/narration/scene-05.mp3')} />
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
          src="https://media2.giphy.com/media/s5piCL5QyFY1AyaJwD/giphy.gif"
          width={400}
          height={400}
          fit="contain"
        />
      </div>
      {/* 상단 헤더 */}
      <div
        style={{
          opacity: headerOpacity,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 60,
        }}
      >
        <div
          style={{
            backgroundColor: Colors.warning,
            borderRadius: 10,
            padding: '6px 20px',
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: '#1A0A00',
          }}
        >
          꿀팁 3
        </div>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: Colors.textLight,
          }}
        >
          고향사랑기부제 — 기부했는데 돈이 생긴다?
        </div>
      </div>

      {/* 흐름도 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          flex: 1,
        }}
      >
        {/* 단계 1: 10만 원 기부 */}
        <FlowStep
          icon="💸"
          label="기부"
          amount="10만 원"
          amountColor={Colors.textMuted}
          bgColor={Colors.bgCard}
          borderColor={Colors.border}
          startFrame={40}
          fps={fps}
          frame={frame}
        />

        <Arrow startFrame={100} frame={frame} label="세액공제" />

        {/* 단계 2: 세금 10만 원 전액 환급 */}
        <FlowStep
          icon="💰"
          label="세금 전액 환급"
          amount="+10만 원"
          amountColor={Colors.success}
          bgColor="rgba(16, 185, 129, 0.12)"
          borderColor={Colors.success}
          startFrame={130}
          fps={fps}
          frame={frame}
        />

        <Arrow startFrame={200} frame={frame} label="답례품" />

        {/* 단계 3: 답례품 3만 원 */}
        <FlowStep
          icon="🎁"
          label="답례품 추가"
          amount="+3만 원"
          amountColor={Colors.warning}
          bgColor="rgba(245, 158, 11, 0.12)"
          borderColor={Colors.warning}
          startFrame={230}
          fps={fps}
          frame={frame}
        />

        <Arrow startFrame={300} frame={frame} label="최종" />

        {/* 단계 4: 순이익 +3만 원 */}
        <FlowStep
          icon="🤑"
          label="기부했는데\n순이익!"
          amount="+3만 원"
          amountColor={Colors.success}
          bgColor="rgba(16, 185, 129, 0.2)"
          borderColor={Colors.success}
          startFrame={330}
          fps={fps}
          frame={frame}
        />
      </div>

      {/* 설명 + 사이트 정보 */}
      <div
        style={{
          opacity: descOpacity,
          display: 'flex',
          flexDirection: 'row',
          gap: 40,
          marginTop: 32,
        }}
      >
        {/* 신청 방법 */}
        <div
          style={{
            flex: 1,
            backgroundColor: Colors.bgCard,
            borderRadius: 16,
            padding: '24px 32px',
          }}
        >
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: Colors.textLight,
              marginBottom: 8,
            }}
          >
            신청 방법
          </div>
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 20,
              fontWeight: 500,
              color: Colors.primary,
            }}
          >
            고향사랑e음 사이트
          </div>
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 18,
              fontWeight: 400,
              color: Colors.textMuted,
              marginTop: 4,
            }}
          >
            ilovegohyang.go.kr
          </div>
        </div>

        {/* 2025년 변경사항 */}
        <div
          style={{
            opacity: updateOpacity,
            flex: 1.5,
            backgroundColor: 'rgba(37, 99, 235, 0.12)',
            border: `2px solid ${Colors.primary}`,
            borderRadius: 16,
            padding: '24px 32px',
          }}
        >
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: Colors.primary,
              marginBottom: 8,
            }}
          >
            2025년 변경사항
          </div>
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: Colors.textLight,
            }}
          >
            10만 원 초과분 → 공제율 15%
          </div>
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: Colors.success,
              marginTop: 6,
            }}
          >
            기부 한도 2,000만 원으로 확대
          </div>
        </div>
      </div>
    </div>
  );
};
