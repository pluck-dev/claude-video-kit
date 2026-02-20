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
/gen-tts --voice ko-KR-SunHiNeural    ← 음성 지정
/gen-tts --skip                        ← TTS 건너뛰기 (Phase 2a → [-])
/gen-tts [scene-id]                    ← 특정 씬만 생성
```

## 실행 절차
1. {VIDEO}/scripts/ 에서 나레이션 텍스트 추출
2. [VISUAL], [TRANSITION] 등 태그 제거
3. 서비스 API 호출 → mp3 생성
4. {PUBLIC}/narration/ 에 저장
5. timing.json 생성 (씬별 길이)
6. {VIDEO}/VIDEO.md Phase 2a 상태 업데이트

## --skip 동작
- Phase 2a를 [-] 스킵 상태로 표기
- 이후 Phase에서 나레이션 없이 진행
- 오디오 싱크 단계(4b) 자동 스킵

## 사전 요구사항
- Edge TTS: `pip install edge-tts`
- ElevenLabs/Google/Azure/OpenAI: .env에 API 키 설정
