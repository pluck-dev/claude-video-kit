// 씬 11 — 아웃트로 + CTA
// durationInFrames: 480 (16s @ 30fps)
// 레이아웃: 채널 로고 placeholder + "구독" 버튼 spring + 다음 영상 예고 카드 slideIn

import React from 'react';
import { Audio, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Gif } from '@remotion/gif';
import { Colors } from '../components/Colors';

export const Scene11Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 씬 fadeIn / fadeOut
  const sceneOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const sceneOpacityOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );
  const finalOpacity = Math.min(sceneOpacity, sceneOpacityOut);

  // 메인 메시지 (0~40f)
  const mainMsgOpacity = interpolate(frame, [15, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const mainMsgY = interpolate(frame, [15, 40], [-30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 채널 로고 영역 (40~70f)
  const logoOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logoScale = spring({
    frame: frame - 40,
    fps,
    from: 0.5,
    to: 1,
    config: { damping: 12, stiffness: 200 },
  });

  // "구독" 버튼 spring (100f~)
  const subscribeScale = spring({
    frame: frame - 100,
    fps,
    from: 0,
    to: 1,
    config: { damping: 8, stiffness: 250, mass: 1 },
  });

  // pulse 애니메이션 (버튼 강조 — sin 곡선)
  const subscribePulse = frame > 130
    ? 1 + 0.05 * Math.sin(((frame - 130) / fps) * Math.PI * 2.5)
    : 1;

  // 다음 영상 예고 카드 slideIn (200f~)
  const nextCardX = interpolate(frame, [200, 240], [80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const nextCardOpacity = interpolate(frame, [200, 240], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 감사 인사 (350f~)
  const thankOpacity = interpolate(frame, [350, 390], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 리액션 GIF fadeIn/fadeOut
  const gifOpacity = interpolate(
    frame,
    [100, 115, 420, 435],
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
        overflow: 'hidden',
      }}
    >
      <Audio src={staticFile('videos/explainers/year-end-tax-tips/narration/scene-11.mp3')} />
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
          src="https://media2.giphy.com/media/PHJJcmWdzwDgTVtJoW/giphy.gif"
          width={400}
          height={400}
          fit="contain"
        />
      </div>
      {/* 배경 그라디언트 장식 */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: -200,
          width: 600,
          height: 600,
          borderRadius: '50%',
          backgroundColor: Colors.primary,
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -150,
          right: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          backgroundColor: Colors.success,
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      />

      {/* 메인 메시지 */}
      <div
        style={{
          opacity: mainMsgOpacity,
          transform: `translateY(${mainMsgY}px)`,
          textAlign: 'center',
          marginBottom: 48,
        }}
      >
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 48,
            fontWeight: 700,
            color: Colors.textLight,
            marginBottom: 12,
          }}
        >
          연말정산, 어렵지 않습니다.
        </div>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 32,
            fontWeight: 600,
            color: Colors.warning,
          }}
        >
          아는 만큼 돌려받는 거예요
        </div>
      </div>

      {/* 가운데 영역 — 로고 + 구독 버튼 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 64,
          marginBottom: 48,
        }}
      >
        {/* 채널 로고 placeholder */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: '50%',
              backgroundColor: Colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `4px solid ${Colors.textLight}`,
            }}
          >
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 56,
                fontWeight: 800,
                color: Colors.textLight,
              }}
            >
              CH
            </div>
          </div>
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: Colors.textMuted,
              textAlign: 'center',
              marginTop: 12,
            }}
          >
            채널명
          </div>
        </div>

        {/* 구독 버튼 */}
        <div
          style={{
            transform: `scale(${subscribeScale * subscribePulse})`,
            backgroundColor: '#FF0000',
            borderRadius: 16,
            padding: '24px 56px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 32 }}>🔔</div>
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 36,
              fontWeight: 800,
              color: Colors.textLight,
              letterSpacing: '0.02em',
            }}
          >
            구독
          </div>
        </div>
      </div>

      {/* 다음 영상 예고 카드 */}
      <div
        style={{
          opacity: nextCardOpacity,
          transform: `translateX(${nextCardX}px)`,
          backgroundColor: Colors.bgCard,
          border: `2px solid ${Colors.primary}`,
          borderRadius: 20,
          padding: '28px 48px',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          maxWidth: 900,
        }}
      >
        <div
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 12,
            padding: '8px 20px',
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: Colors.textLight,
            flexShrink: 0,
          }}
        >
          다음 영상
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 26,
              fontWeight: 700,
              color: Colors.textLight,
              marginBottom: 4,
            }}
          >
            프리랜서 종합소득세 신고 꿀팁
          </div>
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 20,
              fontWeight: 500,
              color: Colors.danger,
            }}
          >
            모르면 수십만 원 날려요
          </div>
        </div>
        <div style={{ fontSize: 32, marginLeft: 'auto' }}>▶</div>
      </div>

      {/* 감사 인사 */}
      <div
        style={{
          opacity: thankOpacity,
          position: 'absolute',
          bottom: 60,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 22,
            fontWeight: 500,
            color: Colors.textMuted,
          }}
        >
          영상이 도움이 됐다면 좋아요와 구독 부탁드립니다
        </div>
      </div>
    </div>
  );
};
