// 씬 08 — 흔한 실수 TOP 3: 이러면 가산세 맞습니다
// durationInFrames: 1650 (55s @ 30fps)
// 레이아웃: 경고 테마 — 실수 카드 3개 순서대로 등장, 각 카드에 X→O 전환

import React from 'react';
import { Audio, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Gif } from '@remotion/gif';
import { Colors } from '../components/Colors';

interface MistakeCardProps {
  number: number;
  title: string;
  wrongText: string;
  correctText: string;
  frame: number;
  fps: number;
  cardStartFrame: number;
  detailStartFrame: number;
}

const MistakeCard: React.FC<MistakeCardProps> = ({
  number,
  title,
  wrongText,
  correctText,
  frame,
  fps,
  cardStartFrame,
  detailStartFrame,
}) => {
  // 카드 등장 spring
  const cardScale = spring({
    frame: frame - cardStartFrame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, stiffness: 200, mass: 1 },
  });

  const cardOpacity = interpolate(
    frame,
    [cardStartFrame, cardStartFrame + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // X 표시 (카드 등장 직후)
  const wrongOpacity = interpolate(
    frame,
    [cardStartFrame + 10, cardStartFrame + 25],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // O 전환 (detailStartFrame)
  const correctOpacity = interpolate(
    frame,
    [detailStartFrame, detailStartFrame + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const correctScale = spring({
    frame: frame - detailStartFrame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 280, mass: 0.8 },
  });

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        border: `2px solid ${Colors.danger}`,
        borderRadius: 20,
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
      }}
    >
      {/* 번호 배지 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            backgroundColor: Colors.danger,
            borderRadius: '50%',
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 22,
              fontWeight: 800,
              color: Colors.textLight,
            }}
          >
            {number}
          </div>
        </div>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: Colors.textLight,
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
      </div>

      {/* 잘못된 예 (X) */}
      <div
        style={{
          opacity: wrongOpacity,
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          borderRadius: 10,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 22,
            fontWeight: 800,
            color: Colors.danger,
            flexShrink: 0,
          }}
        >
          ✗
        </div>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 20,
            fontWeight: 500,
            color: Colors.textMuted,
            lineHeight: 1.5,
          }}
        >
          {wrongText}
        </div>
      </div>

      {/* 올바른 예 (O) */}
      <div
        style={{
          opacity: correctOpacity,
          transform: `scale(${correctScale})`,
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: `1px solid ${Colors.success}`,
          borderRadius: 10,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 22,
            fontWeight: 800,
            color: Colors.success,
            flexShrink: 0,
          }}
        >
          ✓
        </div>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 20,
            fontWeight: 500,
            color: Colors.textLight,
            lineHeight: 1.5,
          }}
        >
          {correctText}
        </div>
      </div>
    </div>
  );
};

export const Scene08CommonMistakes: React.FC = () => {
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

  // 경고 문구 (30~60f)
  const warningOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const warningShake = interpolate(
    frame,
    [50, 55, 60, 65, 70],
    [0, -5, 5, -3, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 홈택스 팁 (1400~1450f)
  const hometaxTipOpacity = interpolate(frame, [1400, 1430], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 리액션 GIF fadeIn/fadeOut
  const gifOpacity = interpolate(
    frame,
    [100, 115, 400, 415],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const mistakes = [
    {
      number: 1,
      title: '맞벌이 부부 의료비 공제 배분',
      wrongText: '소득 높은 쪽에 의료비 몰아줬어요',
      correctText: '의료비는 소득 낮은 배우자에게! (총급여 3% 초과분부터 공제 — 기준선이 낮을수록 유리)',
      cardStart: 80,
      detailStart: 250,
    },
    {
      number: 2,
      title: '부양가족 중복 공제',
      wrongText: '형제가 부모님 공제를 둘이 같이 받았어요',
      correctText: '한 명만 신청 가능. 연간 소득금액 100만 원 이하 (근로소득만 있으면 총급여 500만 원 이하)만 공제 대상',
      cardStart: 180,
      detailStart: 400,
    },
    {
      number: 3,
      title: '실손보험금 미차감',
      wrongText: '의료비 지출액 전부를 공제 신청했어요',
      correctText: '실손보험금 수령액은 반드시 차감해야 합니다. 안 빼면 가산세 부과!',
      cardStart: 280,
      detailStart: 550,
    },
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
        padding: '60px 100px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Audio src={staticFile('videos/explainers/year-end-tax-tips/narration/scene-08.mp3')} />
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
          src="https://media3.giphy.com/media/mhIk0lHu6jJ3jUuZIH/giphy.gif"
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
          marginBottom: 16,
        }}
      >
        <div
          style={{
            backgroundColor: Colors.danger,
            borderRadius: 10,
            padding: '6px 20px',
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: Colors.textLight,
          }}
        >
          주의
        </div>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: Colors.textLight,
          }}
        >
          흔한 실수 TOP 3
        </div>
      </div>

      {/* 경고 문구 */}
      <div
        style={{
          opacity: warningOpacity,
          transform: `translateX(${warningShake}px)`,
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${Colors.danger}`,
          borderRadius: 12,
          padding: '14px 24px',
        }}
      >
        <span style={{ fontSize: 28 }}>🚨</span>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: Colors.danger,
          }}
        >
          이거 잘못하면 오히려 가산세 맞습니다
        </div>
      </div>

      {/* 실수 카드 3개 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 28,
          flex: 1,
        }}
      >
        {mistakes.map((m) => (
          <MistakeCard
            key={m.number}
            number={m.number}
            title={m.title}
            wrongText={m.wrongText}
            correctText={m.correctText}
            frame={frame}
            fps={fps}
            cardStartFrame={m.cardStart}
            detailStartFrame={m.detailStart}
          />
        ))}
      </div>

      {/* 홈택스 맞벌이 절세 안내 팁 */}
      <div
        style={{
          opacity: hometaxTipOpacity,
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          border: `1px solid ${Colors.primary}`,
          borderRadius: 12,
          padding: '14px 24px',
        }}
      >
        <span style={{ fontSize: 24 }}>💡</span>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 22,
            fontWeight: 600,
            color: Colors.primary,
          }}
        >
          홈택스 "맞벌이 절세 안내" 기능 — 최적 공제 배분을 자동으로 계산해드립니다
        </div>
      </div>
    </div>
  );
};
