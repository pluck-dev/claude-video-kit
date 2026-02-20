// 씬 06 — 꿀팁 4: 월세 세액공제 2025년 대폭 확대
// durationInFrames: 1050 (35s @ 30fps)
// 레이아웃: Before/After 테이블 + 조건 체크리스트 + 170만 원 CountUp

import React from 'react';
import { Audio, staticFile, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Gif } from '@remotion/gif';
import { Colors } from '../components/Colors';
import { CountUp } from '../components/CountUp';
import { Checklist } from '../components/Checklist';

export const Scene06RentDeduction: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

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

  // Before/After 테이블 (40~120f)
  const tableOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 변경사항 강조 (120~160f)
  const changeOpacity = interpolate(frame, [120, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 조건 체크리스트 (350~450f)
  const checklistOpacity = interpolate(frame, [350, 380], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 최대 환급액 (700~800f)
  const maxRefundOpacity = interpolate(frame, [700, 730], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 리액션 GIF fadeIn/fadeOut
  const gifOpacity = interpolate(
    frame,
    [150, 165, 400, 415],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const conditionItems = [
    { label: '본인 및 가족 전원 무주택자', description: '세대원 포함 모두 주택 없어야 함' },
    { label: '임대차계약서 주소 = 주민등록 주소', description: '두 주소가 반드시 일치해야 공제 가능' },
    { label: '계좌이체로 월세 납부 내역 보관', description: '현금 지급 시 영수증 필수 보관' },
  ];

  // Before/After 행 데이터
  const tableRows = [
    { label: '소득 기준', before: '7,000만 원 이하', after: '8,000만 원 이하', isImproved: true },
    { label: '공제 한도', before: '750만 원', after: '1,000만 원', isImproved: true },
    { label: '공제율 (이하)', before: '15%', after: '17%', isImproved: true },
    { label: '공제율 (초과)', before: '12%', after: '15%', isImproved: true },
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
      <Audio src={staticFile('videos/explainers/year-end-tax-tips/narration/scene-06.mp3')} />
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
          src="https://media3.giphy.com/media/BafZrA7tQuk4x997G0/giphy.gif"
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
          marginBottom: 40,
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
          꿀팁 4
        </div>
        <div
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: Colors.textLight,
          }}
        >
          월세 세액공제 — 2025년 기준이 확 바뀌었습니다
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 60, flex: 1 }}>

        {/* 왼쪽: Before/After 테이블 */}
        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 테이블 헤더 */}
          <div
            style={{
              opacity: tableOpacity,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 0,
            }}
          >
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: Colors.textMuted,
                padding: '12px 16px',
              }}
            >
              구분
            </div>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: Colors.danger,
                padding: '12px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '8px 0 0 8px',
                textAlign: 'center',
              }}
            >
              기존 (2024년)
            </div>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: Colors.success,
                padding: '12px 16px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '0 8px 8px 0',
                textAlign: 'center',
              }}
            >
              2025년 NEW
            </div>
          </div>

          {/* 테이블 행들 */}
          {tableRows.map((row, i) => {
            const rowOpacity = interpolate(
              frame,
              [70 + i * 20, 90 + i * 20],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            const rowTranslateX = interpolate(
              frame,
              [70 + i * 20, 90 + i * 20],
              [-20, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            return (
              <div
                key={i}
                style={{
                  opacity: rowOpacity,
                  transform: `translateX(${rowTranslateX}px)`,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 0,
                  borderBottom: `1px solid ${Colors.border}`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                    fontSize: 22,
                    fontWeight: 600,
                    color: Colors.textMuted,
                    padding: '16px 16px',
                  }}
                >
                  {row.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                    fontSize: 22,
                    fontWeight: 500,
                    color: Colors.textMuted,
                    padding: '16px 16px',
                    textAlign: 'center',
                    textDecoration: 'line-through',
                    opacity: 0.6,
                  }}
                >
                  {row.before}
                </div>
                <div
                  style={{
                    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                    fontSize: 24,
                    fontWeight: 700,
                    color: Colors.success,
                    padding: '16px 16px',
                    textAlign: 'center',
                  }}
                >
                  {row.after}
                </div>
              </div>
            );
          })}

          {/* 변경사항 강조 박스 */}
          <div
            style={{
              opacity: changeOpacity,
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: `2px solid ${Colors.success}`,
              borderRadius: 12,
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 24,
                fontWeight: 600,
                color: Colors.textLight,
              }}
            >
              월세 1,000만 원 한도 기준 최대 환급
            </div>
            <div style={{ opacity: maxRefundOpacity }}>
              <CountUp
                from={0}
                to={170}
                suffix="만 원"
                startFrame={720}
                durationFrames={80}
                fontSize={52}
                fontWeight={800}
                color={Colors.success}
              />
            </div>
          </div>
        </div>

        {/* 오른쪽: 조건 3가지 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 24,
            opacity: checklistOpacity,
          }}
        >
          <div
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: Colors.textLight,
            }}
          >
            필수 조건 3가지
          </div>
          <Checklist
            items={conditionItems}
            startFrame={380}
            itemDelay={30}
            itemDuration={20}
            checkDelay={15}
            checkColor={Colors.success}
            fontSize={22}
            itemGap={24}
          />

          {/* 경고 메시지 */}
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: `2px solid ${Colors.danger}`,
              borderRadius: 12,
              padding: '16px 24px',
              marginTop: 8,
            }}
          >
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: Colors.danger,
              }}
            >
              이 세 가지 중 하나라도 안 맞으면 공제 불가
            </div>
            <div
              style={{
                fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                fontSize: 18,
                fontWeight: 500,
                color: Colors.textMuted,
                marginTop: 6,
              }}
            >
              지금 바로 임대차계약서와 주민등록 주소 확인하세요
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
