import edge_tts
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import io
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

HINDI_VOICE = "hi-IN-SwaraNeural"
ENGLISH_VOICE = "en-US-JennyNeural"

class TTSRequest(BaseModel):
    text: str

def clean_tts_text(text: str) -> str:
    if not text:
        return ""
    # Strip markdown bold, italic, strike, headers, pluses, and bullets
    clean_text = re.sub(r'[\*#`_\~\+•▪◦●○]', '', text)
    # Strip line-leading list dashes
    clean_text = re.sub(r'(?:^|\n)\s*[-–—]\s*', ' ', clean_text)
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()
    return clean_text

def detect_language(text: str) -> str:
    # Devanagari is a strong signal that Edge should use a Hindi voice.
    if re.search(r'[\u0900-\u097F]', text):
        return "hi"
    return "en"

def voice_for_text(text: str, requested_lang: str = "auto") -> tuple[str, str]:
    lang = requested_lang if requested_lang in {"hi", "en"} else detect_language(text)
    voice = HINDI_VOICE if lang == "hi" else ENGLISH_VOICE
    return lang, voice

async def synthesize_speech(text: str, lang: str = "auto") -> bytes:
    clean_text = clean_tts_text(text)
    if not clean_text:
        raise ValueError("Text is required")

    detected_lang, voice = voice_for_text(clean_text, lang)
    logger.info("Generating TTS for language=%s voice=%s", detected_lang, voice)

    audio_stream = io.BytesIO()
    communicate = edge_tts.Communicate(clean_text, voice)
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_stream.write(chunk["data"])

    audio = audio_stream.getvalue()
    if not audio:
        raise RuntimeError("TTS generated empty audio")
    return audio

@app.post("/generate-tts")
async def generate_tts(request: TTSRequest):
    try:
        audio = await synthesize_speech(request.text)
        return StreamingResponse(io.BytesIO(audio), media_type="audio/mpeg")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error generating TTS: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
