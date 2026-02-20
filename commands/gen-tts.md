# /gen-tts - TTS 나레이션 음성 생성

스크립트의 나레이션을 TTS(Text-to-Speech)로 음성 파일을 생성합니다.

## 참조 스킬
반드시 `~/.claude/skills/tts-integration.md`를 읽고 전체 적용합니다.

## 경로 규칙
- 영상 식별: `~/.claude/skills/video-orchestra.md` §3 (영상 식별 로직) 적용
- `{VIDEO}` = `videos/{category}/{name}/`
- `{PUBLIC}` = `public/videos/{category}/{name}/`

## 사용법
```
/gen-tts                               ← 기본 TTS 생성 (Edge TTS)
/gen-tts --service elevenlabs          ← ElevenLabs 사용
/gen-tts --service google              ← Google Cloud TTS
/gen-tts --service azure               ← Azure TTS
/gen-tts --service openai              ← OpenAI TTS
/gen-tts --service qwen3               ← Qwen3-TTS (로컬 음성 클로닝)
/gen-tts --voice ko-KR-SunHiNeural    ← 음성 지정
/gen-tts --ref-audio path/to/voice.wav ← 음성 클로닝 레퍼런스 (qwen3)
/gen-tts --ref-text "레퍼런스 대사"     ← 레퍼런스 오디오 텍스트 (qwen3)
/gen-tts --skip                        ← TTS 건너뛰기 (Phase 2a → [-])
/gen-tts [scene-id]                    ← 특정 씬만 생성
```

## 실행 절차
1. {VIDEO}/scripts/ 에서 나레이션 텍스트 추출
2. [VISUAL], [TRANSITION] 등 태그 제거
3. 서비스 API 호출 → mp3 생성
   - qwen3: `python scripts/qwen3-tts.py` 로컬 실행 (음성 클로닝)
   - 기타: 외부 API 호출
4. {PUBLIC}/narration/ 에 저장
5. timing.json 생성 (씬별 길이)
6. {VIDEO}/VIDEO.md Phase 2a 상태 업데이트

## Qwen3-TTS (음성 클로닝) 사용 시
1. {PUBLIC}/reference/ 에 레퍼런스 오디오 + 대사 텍스트 준비
2. `--ref-audio`, `--ref-text` 옵션 또는 reference/ 폴더에서 자동 감지
3. 씬별 나레이션을 일괄 생성:
   ```bash
   python scripts/qwen3-tts.py \
     --batch-file {VIDEO}/scripts/narration-texts.txt \
     --output-dir {PUBLIC}/narration/ \
     --ref-audio {PUBLIC}/reference/my-voice.wav \
     --ref-text "레퍼런스 오디오의 대사 텍스트" \
     --language Korean --format mp3
   ```
4. 한 프로젝트 내에서 동일 레퍼런스 사용 (목소리 일관성)

## --skip 동작
- Phase 2a를 [-] 스킵 상태로 표기
- 이후 Phase에서 나레이션 없이 진행
- 오디오 싱크 단계(4b) 자동 스킵

## 사전 요구사항
- Edge TTS: `pip install edge-tts`
- Qwen3-TTS: `pip install -U qwen-tts` + `brew install ffmpeg`
  - Apple Silicon: MPS 자동 감지 (float32, ~3GB RAM for 0.6B)
  - 레퍼런스 오디오 필요 (3~30초, wav/mp3)
- ElevenLabs/Google/Azure/OpenAI: .env에 API 키 설정
