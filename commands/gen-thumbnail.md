# /gen-thumbnail - 썸네일 이미지 생성

Remotion Still을 사용하여 YouTube 썸네일 이미지를 생성합니다.

## 참조 스킬
별도 스킬 파일 없음 (이 커맨드 파일에 전체 규칙 포함).

## 사용법
```
/gen-thumbnail                         ← 기본 썸네일 생성
/gen-thumbnail --text "핵심 텍스트"     ← 텍스트 지정
/gen-thumbnail --style dark            ← 다크 스타일
/gen-thumbnail --size 1280x720         ← 크기 지정
```

## 실행 절차
1. 스크립트에서 핵심 메시지 추출 (또는 --text 사용)
2. Remotion Thumbnail 컴포넌트 생성/수정
   - src/scenes/Thumbnail.tsx
3. Remotion Still로 PNG 생성
```bash
npx remotion still src/index.ts Thumbnail output/thumbnails/thumbnail.png
```

## 썸네일 컴포넌트 구조
```tsx
// src/scenes/Thumbnail.tsx
export const Thumbnail: React.FC<{
  title: string;
  subtitle?: string;
  style?: 'dark' | 'light' | 'gradient';
}> = ({ title, subtitle, style = 'dark' }) => {
  return (
    <div style={{ width: 1920, height: 1080 }}>
      {/* 배경 */}
      {/* 제목 텍스트 (큰 폰트) */}
      {/* 서브 텍스트 */}
      {/* 브랜드/로고 */}
    </div>
  );
};
```

## 디자인 규칙
- 텍스트: 5-7 단어 이내
- 폰트: 72pt 이상 (모바일 가독성)
- 고대비: 밝은 텍스트 + 어두운 배경 또는 그 반대
- 해상도: 1920x1080 또는 1280x720
- 형식: PNG (투명도 불필요), JPEG (파일 크기 최적화)

## 출력
- `output/thumbnails/{name}.png` — 썸네일 이미지
- VIDEO.md Phase 5c 상태 업데이트
