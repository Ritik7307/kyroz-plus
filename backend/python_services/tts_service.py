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
ENGLISH_VOICE = "en-IN-NeerjaExpressiveNeural"

class TTSRequest(BaseModel):
    text: str

def clean_tts_text(text: str, lang: str = "auto") -> str:
    if not text:
        return ""
    # Strip markdown bold, italic, strike, headers, pluses, and bullets
    clean_text = re.sub(r'[\*#`_\~\+•▪◦●○]', '', text)
    # Strip line-leading list dashes
    clean_text = re.sub(r'(?:^|\n)\s*[-–—]\s*', ' ', clean_text)
    
    detected_lang = lang if lang in {"hi", "en"} else detect_language(clean_text)
    
    # Fix Hindi pronunciation issues:
    # 1. 'स्टेप' (step) in Hindi TTS sounds like 'सतेप' (satep) because of the initial half-s conjunct.
    #    Replacing with natural Hindi 'चरण' (Charan) produces flawless, natural Hindi pronunciation.
    if detected_lang == "hi":
        # Replace 'स्टेप' or 'स्टेप्स' with 'चरण' using explicit unicode escapes:
        # \u0938\u094d\u091f\u0947\u092a = स्टेप, \u091a\u0930\u0923 = चरण
        clean_text = re.sub(r'\u0938\u094d\u091f\u0947\u092a(?:\u094d\u0938)?', '\u091a\u0930\u0923', clean_text)
        # Also replace English 'step' / 'steps' when in Hindi context
        clean_text = re.sub(r'\b[Ss]teps?\b', '\u091a\u0930\u0923', clean_text)
        # Prevent "10-15" being read as "10 minus 15"
        clean_text = re.sub(r'(\d+)\s*[-–—]\s*(\d+)', lambda m: f"{m.group(1)} \u0938\u0947 {m.group(2)}", clean_text)
        # Common kitchen units pronunciation expansions for natural speaking
        clean_text = re.sub(r'(\d+)\s*(?:gm|g|ग्राम)\b', r'\1 ग्राम', clean_text)
        clean_text = re.sub(r'(\d+)\s*(?:kg|किलो)\b', r'\1 किलो', clean_text)
        clean_text = re.sub(r'(\d+)\s*(?:ml|मिली)\b', r'\1 मिलीलीटर', clean_text)
        clean_text = re.sub(r'(\d+)\s*(?:tbsp|tbs)\b', r'\1 बड़ा चम्मच', clean_text)
        clean_text = re.sub(r'(\d+)\s*(?:tsp)\b', r'\1 छोटा चम्मच', clean_text)
    else:
        clean_text = re.sub(r'(\d+)\s*[-–—]\s*(\d+)', r'\1 to \2', clean_text)
        clean_text = re.sub(r'(\d+)\s*tbsp\b', r'\1 tablespoons', clean_text, flags=re.I)
        clean_text = re.sub(r'(\d+)\s*tsp\b', r'\1 teaspoons', clean_text, flags=re.I)
        clean_text = re.sub(r'(\d+)\s*gm?\b', r'\1 grams', clean_text, flags=re.I)
        clean_text = re.sub(r'(\d+)\s*ml\b', r'\1 milliliters', clean_text, flags=re.I)

    # Human-like pauses:
    # 1. Add a distinct pause after step numbers (e.g. "चरण 1: ..." or "Step 1: ...")
    clean_text = re.sub(r'((?:चरण|[Ss]tep)\s*\d+)\s*[:\.]?\s*', r'\1... ', clean_text)
    # 2. Add breathable pause after colons or section introductions
    clean_text = re.sub(r':\s*', ', ', clean_text)
    # 3. Add breathable pauses at paragraph and list item boundaries
    clean_text = re.sub(r'(?<=[.?!।])\s+', '... ', clean_text)

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
    detected_lang, voice = voice_for_text(text, lang)
    clean_text = clean_tts_text(text, lang=detected_lang)
    if not clean_text:
        raise ValueError("Text is required")

    logger.info("Generating TTS for language=%s voice=%s", detected_lang, voice)

    audio_stream = io.BytesIO()
    # Pacing: -3% rate introduces a relaxed, professional culinary delivery with natural breathing room
    communicate = edge_tts.Communicate(clean_text, voice, rate="-3%")
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
