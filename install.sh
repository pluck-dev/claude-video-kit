#!/bin/bash
#
# Claude Video Kit v2.0.0 - Installer (모노레포)
# 스크립트 → 스토리보드 → Remotion → 렌더링 → 배포
#
# 사용법:
#   git clone 후:  ./install.sh
#

set -e

# 색상
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 버전
SCRIPT_DIR_TMP="$(cd "$(dirname "${BASH_SOURCE[0]}" 2>/dev/null)" && pwd 2>/dev/null)" || SCRIPT_DIR_TMP=""
if [ -n "$SCRIPT_DIR_TMP" ] && [ -f "$SCRIPT_DIR_TMP/VERSION" ]; then
    VERSION=$(cat "$SCRIPT_DIR_TMP/VERSION" | tr -d '[:space:]')
else
    VERSION="unknown"
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Claude Video Kit - Installer              ║${NC}"
echo -e "${BLUE}║  모노레포 기반 비디오 프로덕션             ║${NC}"
echo -e "${BLUE}║  v${VERSION}                                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# 스크립트 위치 감지
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}" 2>/dev/null)" && pwd 2>/dev/null)" || SCRIPT_DIR=""

# 공통 함수
backup_if_exists() {
    local file="$1"
    if [ -f "$file" ]; then
        local backup="${file}.backup.$(date +%Y%m%d_%H%M%S)"
        cp "$file" "$backup"
        echo -e "  ${YELLOW}[백업]${NC} $(basename "$file")"
    fi
}

copy_file() {
    local src="$1"
    local dest="$2"
    if [ -n "$SCRIPT_DIR" ] && [ -f "$SCRIPT_DIR/$src" ]; then
        cp "$SCRIPT_DIR/$src" "$dest"
    else
        echo -e "  ${RED}[SKIP]${NC} $src 파일을 찾을 수 없음"
        return 1
    fi
}

# Claude Code 설치 확인
if ! command -v claude &> /dev/null; then
    echo -e "${RED}[ERROR] Claude Code가 설치되어 있지 않습니다.${NC}"
    echo "  npm install -g @anthropic-ai/claude-code"
    exit 1
fi

CLAUDE_DIR="$HOME/.claude"
SKILLS_DIR="$CLAUDE_DIR/skills"
COMMANDS_DIR="$CLAUDE_DIR/commands"
AGENTS_DIR="$CLAUDE_DIR/agents"

mkdir -p "$SKILLS_DIR" "$COMMANDS_DIR" "$AGENTS_DIR"

# ═══════════════════════════════════════════
# PART 1: Claude Code 설정 (~/.claude/)
# ═══════════════════════════════════════════

# ── 1/4: 스킬 (6개) ──
echo -e "${CYAN}[1/4] 스킬 설치 (6개)${NC}"

SKILLS=(
    "skills/video-orchestra.md|비디오 프로덕션 오케스트레이터 (모노레포)"
    "skills/script-writing.md|스크립트 작성 가이드"
    "skills/storyboard-design.md|스토리보드 설계 규칙"
    "skills/remotion-patterns.md|Remotion 베스트 프랙티스"
    "skills/youtube-seo.md|YouTube SEO 최적화"
    "skills/tts-integration.md|TTS 서비스 연동"
)

for entry in "${SKILLS[@]}"; do
    IFS='|' read -r src desc <<< "$entry"
    file=$(basename "$src")
    backup_if_exists "$SKILLS_DIR/$file"
    copy_file "$src" "$SKILLS_DIR/$file" && echo -e "  ${GREEN}[OK]${NC} $file — $desc"
done

# ── 2/4: 커맨드 (10개) ──
echo ""
echo -e "${CYAN}[2/4] 커맨드 설치 (10개)${NC}"

COMMANDS=(
    "commands/video.md|/video — 오케스트레이터 (모노레포)"
    "commands/write-script.md|/write-script — 스크립트 생성"
    "commands/storyboard.md|/storyboard — 스토리보드 생성"
    "commands/gen-scene.md|/gen-scene — Remotion 씬 코드"
    "commands/render-video.md|/render-video — 렌더링"
    "commands/gen-thumbnail.md|/gen-thumbnail — 썸네일"
    "commands/video-seo.md|/video-seo — SEO 메타데이터"
    "commands/gen-tts.md|/gen-tts — TTS 음성"
    "commands/video-sync.md|/video-sync — 동기화 체크"
    "commands/to-shorts.md|/to-shorts — 숏폼 변환"
)

for entry in "${COMMANDS[@]}"; do
    IFS='|' read -r src desc <<< "$entry"
    file=$(basename "$src")
    backup_if_exists "$COMMANDS_DIR/$file"
    copy_file "$src" "$COMMANDS_DIR/$file" && echo -e "  ${GREEN}[OK]${NC} $file — $desc"
done

# ── 3/4: 에이전트 (3개) ──
echo ""
echo -e "${CYAN}[3/4] 에이전트 설치 (3개)${NC}"

AGENTS=(
    "agents/script-writer.md|스크립트 작성 전문가"
    "agents/scene-builder.md|Remotion 씬 전문가"
    "agents/video-reviewer.md|품질 리뷰어"
)

for entry in "${AGENTS[@]}"; do
    IFS='|' read -r src desc <<< "$entry"
    file=$(basename "$src")
    backup_if_exists "$AGENTS_DIR/$file"
    copy_file "$src" "$AGENTS_DIR/$file" && echo -e "  ${GREEN}[OK]${NC} $file — $desc"
done

# ── 4/4: CLAUDE.md 규칙 ──
echo ""
echo -e "${CYAN}[4/4] CLAUDE.md 규칙 추가${NC}"

CLAUDE_MD="$CLAUDE_DIR/CLAUDE.md"
VIDEO_MARKER="<!-- VIDEO-KIT:START -->"
VIDEO_END="<!-- VIDEO-KIT:END -->"

VIDEO_RULES=$(cat <<'RULES'
<!-- VIDEO-KIT:START -->
# Video Kit 규칙 (모노레포)

## 비디오 프로덕션 (모노레포)
- `/video init [category/name]`: 새 영상 초기화 (예: tutorials/react-hooks)
- `/video select [category/name]`: 현재 작업 영상 선택
- `/video list`: 전체 영상 목록 + 상태 표시
- `/video scan`: 현재 영상 분석 → VIDEO.md 자동 생성
- `/video status`: 현재 영상 진행 상태 확인
- `/video next`: 다음 미완료 단계 자동 실행
- `/video phase [id]`: 특정 단계 실행

## 경로 규칙
- `{VIDEO}` = `videos/{category}/{name}/` (기획, 스크립트, 씬 코드)
- `{PUBLIC}` = `public/videos/{category}/{name}/` (Remotion staticFile 에셋)
- `{OUTPUT}` = `output/{category}/{name}/` (렌더링 결과, gitignored)

## 스크립트 & 스토리보드
- `/write-script [주제]`: 스크립트 생성
- `/storyboard`: 스토리보드 생성

## Remotion 씬 개발
- `/gen-scene`: Remotion 씬 코드 생성
- CSS animation/transition/keyframes 절대 금지 — useCurrentFrame() + interpolate()/spring() 사용
- `/render-video`: 비디오 렌더링
- `/gen-thumbnail`: 썸네일 생성

## 배포 & 유틸
- `/video-seo`: YouTube SEO 메타데이터 생성
- `/gen-tts`: TTS 나레이션 생성 (선택)
- `/video-sync`: 산출물 동기화 체크
- `/to-shorts`: 롱폼→숏폼 변환
<!-- VIDEO-KIT:END -->
RULES
)

if [ -f "$CLAUDE_MD" ]; then
    if grep -q "$VIDEO_MARKER" "$CLAUDE_MD"; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "/$VIDEO_MARKER/,/$VIDEO_END/d" "$CLAUDE_MD"
        else
            sed -i "/$VIDEO_MARKER/,/$VIDEO_END/d" "$CLAUDE_MD"
        fi
        echo "$VIDEO_RULES" >> "$CLAUDE_MD"
        echo -e "  ${GREEN}[OK]${NC} CLAUDE.md 규칙 업데이트"
    else
        echo "" >> "$CLAUDE_MD"
        echo "$VIDEO_RULES" >> "$CLAUDE_MD"
        echo -e "  ${GREEN}[OK]${NC} CLAUDE.md에 규칙 추가"
    fi
else
    echo "$VIDEO_RULES" > "$CLAUDE_MD"
    echo -e "  ${GREEN}[OK]${NC} CLAUDE.md 신규 생성"
fi

# 버전 기록
echo "$VERSION" > "$CLAUDE_DIR/.video-kit-version"
echo -e "  ${GREEN}[OK]${NC} 버전 기록: v${VERSION}"

# ═══════════════════════════════════════════
# 완료 리포트
# ═══════════════════════════════════════════
echo ""
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}설치 완료! (v${VERSION} 모노레포)${NC}"
echo ""
echo -e "${CYAN}Claude Code 설정:${NC}"
echo "  스킬 6개 + 커맨드 10개 + 에이전트 3개"
echo ""
echo "  사용 가능한 명령어:"
echo "    /video init [cat/name]     새 영상 초기화 (예: tutorials/react-hooks)"
echo "    /video select [cat/name]   작업 영상 선택"
echo "    /video list                전체 영상 목록"
echo "    /video scan                현재 영상 분석"
echo "    /video status              진행 상태 확인"
echo "    /video next                다음 단계 자동 실행"
echo "    /video phase [id]          특정 단계 실행"
echo "    /write-script [주제]       스크립트 생성"
echo "    /storyboard                스토리보드 생성"
echo "    /gen-scene                 Remotion 씬 코드 생성"
echo "    /render-video              비디오 렌더링"
echo "    /gen-thumbnail             썸네일 생성"
echo "    /video-seo                 YouTube SEO 메타데이터"
echo "    /gen-tts                   TTS 나레이션 생성"
echo "    /video-sync                산출물 동기화 체크"
echo "    /to-shorts                 롱폼→숏폼 변환"
echo ""
echo -e "시작하기:"
echo -e "  ${YELLOW}claude \"/video init tutorials/my-first-video\"${NC}"
echo ""
