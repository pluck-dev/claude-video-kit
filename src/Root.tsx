import React from 'react';

// 영상별 Compositions import (새 영상 init 시 자동 추가)
import { YearEndTaxTipsCompositions } from '../videos/explainers/year-end-tax-tips/Compositions';

export const RemotionRoot: React.FC = () => (
  <>
    {/* 영상별 Compositions (새 영상 init 시 자동 추가) */}
    <YearEndTaxTipsCompositions />
  </>
);
