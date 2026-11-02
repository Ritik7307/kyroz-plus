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

    is_devanagari = bool(re.search(r'[\u0900-\u097F]', text))
    is_hindi = (
        lang == "hi"
        or is_devanagari
        or bool(re.search(r'\b(karein|kare|kijiye|dalen|chammach|ke|liye|aur|se|mein|ko|hai|hain|bhi|tak|ka|ki|pakaen|kholiye|dhyan|rakhein)\b', text, re.I))
    )

    to_word = " \u0938\u0947 " if (is_hindi and is_devanagari) else (" se " if is_hindi else " to ")

    s = text

    # 1. Remove markdown, emojis, bullets, and structural markers
    s = re.sub(r'[\*#`_\~\+•▪◦●○=]', '', s)

    # 2. Fix Hindi step pronunciation if Hindi:
    if is_hindi:
        s = re.sub(r'(?:स्टेप्स|स्टेप)', 'चरण', s)
        s = re.sub(r'\b[Ss]teps?\b', 'चरण', s)

    # 3. Number ranges: 10-15, 10 - 15, 1.5-2, 10–15, १०-१५, etc.
    s = re.sub(
        r'([0-9\u0966-\u096F]+(?:\.[0-9\u0966-\u096F]+)?)\s*[-–—]\s*([0-9\u0966-\u096F]+(?:\.[0-9\u0966-\u096F]+)?)',
        lambda m: f"{m.group(1)}{to_word}{m.group(2)}",
        s
    )

    # 4. Word-based ranges: two-three, low-medium, धीमी-मध्यम
    s = re.sub(r'(low|medium|high)\s*[-–—]\s*(medium|high|low)', r'\1 to \2', s, flags=re.I)
    s = re.sub(r'(धीमी|मध्यम|तेज)\s*[-–—]\s*(मध्यम|तेज|धीमी)', r'\1 \u0938\u0947 \2' if is_hindi else r'\1 to \2', s)

    # 5. Bullet points at start of line or after punctuation
    s = re.sub(r'(?:^|\n|(?<=[:.,!?]))\s*[-–—]\s*', ' ', s)

    # 6. Separator dashes like " - " -> replace with comma pause
    s = re.sub(r'\s+[-–—]+\s+', ', ', s)

    # 7. Compound words: deep-fry -> deep fry, गरम-गरम -> गरम गरम
    s = re.sub(r'([A-Za-z\u0900-\u097F]+)[-–—]([A-Za-z\u0900-\u097F]+)', r'\1 \2', s)

    # 8. Any remaining hyphens or dashes
    s = re.sub(r'[-–—]+', ' ', s)

    # 9. Unit expansions
    if is_hindi:
        s = re.sub(r'(\d+)\s*(?:gm|g|ग्राम)\b', r'\1 ग्राम', s, flags=re.I)
        s = re.sub(r'(\d+)\s*(?:kg|किलो)\b', r'\1 किलो', s, flags=re.I)
        s = re.sub(r'(\d+)\s*(?:ml|मिली)\b', r'\1 मिलीलीटर', s, flags=re.I)
        s = re.sub(r'(\d+)\s*(?:tbsp|tbs)\b', r'\1 बड़ा चम्मच', s, flags=re.I)
        s = re.sub(r'(\d+)\s*(?:tsp)\b', r'\1 छोटा चम्मच', s, flags=re.I)
    else:
        s = re.sub(r'(\d+)\s*tbsp\b', r'\1 tablespoons', s, flags=re.I)
        s = re.sub(r'(\d+)\s*tsp\b', r'\1 teaspoons', s, flags=re.I)
        s = re.sub(r'(\d+)\s*(?:gm|g)\b', r'\1 grams', s, flags=re.I)
        s = re.sub(r'(\d+)\s*kg\b', r'\1 kilograms', s, flags=re.I)
        s = re.sub(r'(\d+)\s*ml\b', r'\1 milliliters', s, flags=re.I)

    # 10. Human-like natural breath pauses
    s = re.sub(r'((?:चरण|[Ss]tep)\s*\d+)\s*[:\.,]?\s*', r'\1, ', s)
    s = re.sub(r':\s*', ', ', s)
    s = re.sub(r',\s*,+', ',', s)
    s = re.sub(r'(?<=[.?!।])\s+', ' ', s)

    return re.sub(r'\s+', ' ', s).strip()

def detect_language(text: str) -> str:
    # Devanagari or Hindi keywords
    if re.search(r'[\u0900-\u097F]', text) or re.search(r'\b(karein|kare|kijiye|dalen|chammach|ke|liye|aur|se|mein|ko|hai|hain|bhi|tak|ka|ki)\b', text, re.I):
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
