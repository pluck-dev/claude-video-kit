// 씬 10 — 체크리스트 정리
// durationInFrames: 780 (26s @ 30fps)
// 레이아웃: 6개 항목 순서대로 체크 → 완료 시 "수백만 원" 강조

import React from 'react';
import { Audio, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Gif } from '@remotion/gif';
import { Colors } from '../components/Colors';
import { Checklist } from '../components/Checklist';

export const Scene10Checklist: React.FC = () => {
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

  // 완료 메시지 — 체크리스트 전부 완료 후 등장 (580~640f)
  const completeOpacity = interpolate(frame, [580, 620], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "수백만 원" spring scale
  const hundredsScale = spring({
    frame: frame - 620,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 220, mass: 1 },
  });

  // 리액션 GIF fadeIn/fadeOut
  const gifOpacity = interpolate(
    frame,
    [300, 315, 600, 615],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 체크리스트 항목 (카테고리별 아이콘 포함)
  const checklistItems = [
    {
      label: '중소기업 청년 소득세 90% 감면 신청',
      description: '홈택스 → 청년 중소기업 취업자 소득세 감면 신청',
    },
    {
      label: '연금저축 + IRP 900만 원 납입 완료',
      description: '12월 31일 마감 — 최대 148만 원 환급',
    },
    {
      label: '고향사랑기부제 10만 원 기부',
      description: 'ilovegohyang.go.kr — 기부하면 오히려 3만 원 이익',
    },
    {
      label: '월세 납부 시 주소 일치 확인',
      description: '임대차계약서 주소 = 주민등록 주소 반드시 일치',
    },
    {
      label: '2025년 결혼했다면 결혼세액공제 신청',
      description: '부부 합산 100만 원 — 2026년까지 한시 적용',
    },
    {
      label: '신용카드 25% 초과분은 체크카드 사용',
      description: '체크카드 공제율 30% > 신용카드 15%',
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
      <Audio src={staticFile('videos/explainers/year-end-tax-tips/narration/scene-10.mp3')} />
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
          src="https://media3.giphy.com/media/w832CKAADJut6lBEOE/giphy.gif"
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
          marginBottom: 48,
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
          오늘 배운 것 정리해볼게요
        </div>
      </div>

      {/* 좌우 2분할 */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 80, flex: 1 }}>

        {/* 체크리스트 */}
        <div style={{ flex: 1.4 }}>
          <Checklist
            items={checklistItems}
            startFrame={30}
            itemDelay={70}
            itemDuration={20}
            checkDelay={35}
            checkColor={Colors.success}
            fontSize={24}
            itemGap={22}
          />
        </div>

        {/* 오른쪽: 완료 강조 메시지 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          {/* 완료 체크 원 */}
          <div
            style={{
              opacity: completeOpacity,
              width: 140,
              height: 140,
              borderRadius: '50%',
              backgroundColor: Colors.success,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: 72,
                color: Colors.bgDark,
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              ✓
            </div>
          </div>

          {/* "이 여섯 가지만 챙겨도" 텍스트 */}
          <div
            style={{
              opacity: completeOpacity,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 28,
                fontWeight: 600,
                color: Colors.textMuted,
                marginBottom: 12,
                lineHeight: 1.4,
              }}
            >
              이 여섯 가지만 챙겨도
            </div>

            {/* 평균 68만 원 → 수백만 원 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                  fontSize: 32,
                  fontWeight: 600,
                  color: Colors.textMuted,
                  textDecoration: 'line-through',
                  opacity: 0.6,
                }}
              >
                평균 68만 원
              </div>
              <div style={{ fontSize: 28, color: Colors.warning }}>→</div>
            </div>

            {/* 수백만 원 강조 */}
            <div
              style={{
                transform: `scale(${hundredsScale})`,
                display: 'inline-block',
              }}
            >
              <div
                style={{
                  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                  fontSize: 80,
                  fontWeight: 800,
                  color: Colors.success,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                수백만 원
              </div>
            </div>

            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 28,
                fontWeight: 600,
                color: Colors.textMuted,
                marginTop: 12,
              }}
            >
              달라집니다
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
