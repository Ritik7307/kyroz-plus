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

    # 1. Remove URLs
    s = re.sub(r'https?://\S+', '', s, flags=re.I)

    # 2. Remove emojis and pictographs completely (so TTS does not read symbol names aloud)
    s = re.sub(r'[\U0001F300-\U0001F9FF\U0001FA00-\U0001FAFF\u2600-\u26FF\u2700-\u27BF\uFE00-\uFE0F\u200D\u200C\u20E3\U000E0020-\U000E007F]', '', s)

    # 3. Fix Brand Name pronunciation (KYROZ / KYROZ+ / KOSA)
    # Prevents TTS from spelling letter-by-letter (K-Y-R-O-Z) and reads as the word "Kyroz" / "कैरोज़"
    if is_hindi and is_devanagari:
        s = re.sub(r'\bKYROZ\s*\+', 'कैरोज़ प्लस', s, flags=re.I)
        s = re.sub(r'\bKYROZ\s+PLUS\b', 'कैरोज़ प्लस', s, flags=re.I)
        s = re.sub(r'\bKYROZ\b', 'कैरोज़', s, flags=re.I)
        s = re.sub(r'\bKOSA\b', 'कोसा', s, flags=re.I)
    else:
        s = re.sub(r'\bKYROZ\s*\+', 'Kyroz Plus', s, flags=re.I)
        s = re.sub(r'\bKYROZ\s+PLUS\b', 'Kyroz Plus', s, flags=re.I)
        s = re.sub(r'\bKYROZ\b', 'Kyroz', s, flags=re.I)
        s = re.sub(r'\bKOSA\b', 'Kosa', s, flags=re.I)

    # 4. Fix fractions and cooking measurements with slashes
    if is_hindi and is_devanagari:
        s = re.sub(r'\b1/2\b', 'आधा', s)
        s = re.sub(r'\b1/4\b', 'एक चौथाई', s)
        s = re.sub(r'\b3/4\b', 'तीन चौथाई', s)
    else:
        s = re.sub(r'\b1/2\b', 'half', s)
        s = re.sub(r'\b1/4\b', 'one fourth', s)
        s = re.sub(r'\b3/4\b', 'three fourths', s)

    # Replace word/word with "word or word" / "word ya word"
    or_word = " या " if (is_hindi and is_devanagari) else (" ya " if is_hindi else " or ")
    s = re.sub(r'([A-Za-z\u0900-\u097F]+)\s*/\s*([A-Za-z\u0900-\u097F]+)', lambda m: f"{m.group(1)}{or_word}{m.group(2)}", s)
    # Replace remaining slashes
    s = re.sub(r'[\\/]', ' ', s)

    # 5. Fix percentages and degrees
    s = re.sub(r'(\d+)\s*%', lambda m: f"{m.group(1)} प्रतिशत" if (is_hindi and is_devanagari) else f"{m.group(1)} percent", s)
    s = re.sub(r'(\d+)\s*°\s*C\b', lambda m: f"{m.group(1)} डिग्री सेल्सियस" if (is_hindi and is_devanagari) else f"{m.group(1)} degrees Celsius", s, flags=re.I)
    s = re.sub(r'(\d+)\s*°\s*F\b', lambda m: f"{m.group(1)} डिग्री फ़ारेनहाइट" if (is_hindi and is_devanagari) else f"{m.group(1)} degrees Fahrenheit", s, flags=re.I)
    s = re.sub(r'(\d+)\s*°\b', lambda m: f"{m.group(1)} डिग्री" if (is_hindi and is_devanagari) else f"{m.group(1)} degrees", s)

    # 6. Fix currencies
    s = re.sub(r'(?:₹|Rs\.?)\s*(\d+(?:\.\d+)?)', lambda m: f"{m.group(1)} रुपये" if (is_hindi and is_devanagari) else f"{m.group(1)} rupees", s, flags=re.I)
    s = re.sub(r'\$\s*(\d+(?:\.\d+)?)', lambda m: f"{m.group(1)} डॉलर" if (is_hindi and is_devanagari) else f"{m.group(1)} dollars", s)

    # 7. Fix ampersand (&)
    and_word = " और " if (is_hindi and is_devanagari) else (" aur " if is_hindi else " and ")
    s = re.sub(r'&', and_word, s)

    # 8. Specific symbol corrections for: " , : ; . ' ~ ` - _ + =
    # 8a. Tilde (~) -> approximately before numbers, else space
    tilde_word = "लगभग " if (is_hindi and is_devanagari) else ("lagbhag " if is_hindi else "about ")
    s = re.sub(r'~\s*([0-9\u0966-\u096F]+)', lambda m: f"{tilde_word}{m.group(1)}", s)
    s = re.sub(r'~', ' ', s)

    # 8b. Plus (+) -> between numbers (2 + 2) or as conjunction (paneer + onion)
    plus_sym_word = " प्लस " if (is_hindi and is_devanagari) else " plus "
    s = re.sub(r'([0-9\u0966-\u096F]+)\s*\+\s*([0-9\u0966-\u096F]+)', lambda m: f"{m.group(1)}{plus_sym_word}{m.group(2)}", s)
    s = re.sub(r'\s*\+\s*', and_word, s)
    s = re.sub(r'\+', ' ', s)

    # 8c. Equals (=) -> equals / बराबर
    eq_word = " बराबर " if (is_hindi and is_devanagari) else (" barabar " if is_hindi else " equals ")
    s = re.sub(r'\s*=\s*', eq_word, s)
    s = re.sub(r'=', ' ', s)

    # 8d. Underscore (_) -> space
    s = re.sub(r'_+', ' ', s)

    # 8e. Quotes (" ' ` “ ” ‘ ’) -> remove completely so TTS does not read symbol names
    s = re.sub(r'["\'`“”‘’]', '', s)

    # 8f. Brackets, hashes, asterisks, and decorative markers
    s = re.sub(r'[()\[\]{}#*^|<><>@•▪◦●○■□★☆✓✔✕✖✗➤➜➡◆◇▲▼※]', ' ', s)

    # 9. Fix Hindi step pronunciation if Hindi:
    if is_hindi:
        s = re.sub(r'(?:स्टेप्स|स्टेप)', 'चरण', s)
        s = re.sub(r'\b[Ss]teps?\b', 'चरण', s)

    # 10. Hyphens / Dashes (-):
    # 10a. Number ranges: 10-15 -> 10 to 15 in English / 10 से 15 in Hindi
    s = re.sub(
        r'([0-9\u0966-\u096F]+(?:\.[0-9\u0966-\u096F]+)?)\s*[-–—]\s*([0-9\u0966-\u096F]+(?:\.[0-9\u0966-\u096F]+)?)',
        lambda m: f"{m.group(1)}{to_word}{m.group(2)}",
        s
    )
    # 10b. Word-based ranges: low-medium -> low to medium
    s = re.sub(r'(low|medium|high)\s*[-–—]\s*(medium|high|low)', r'\1 to \2', s, flags=re.I)
    s = re.sub(r'(धीमी|मध्यम|तेज)\s*[-–—]\s*(मध्यम|तेज|धीमी)', lambda m: f"{m.group(1)} से {m.group(2)}" if is_hindi else f"{m.group(1)} to {m.group(2)}", s)
    # 10c. Bullet points at start of line
    s = re.sub(r'(?:^|\n|(?<=[:.,!?]))\s*[-–—]\s*', ' ', s)
    # 10d. Separator dashes like " - " -> comma pause
    s = re.sub(r'\s+[-–—]+\s+', ', ', s)
    # 10e. Compound words: deep-fry -> deep fry
    s = re.sub(r'([A-Za-z\u0900-\u097F]+)[-–—]([A-Za-z\u0900-\u097F]+)', r'\1 \2', s)
    # 10f. Remaining hyphens
    s = re.sub(r'[-–—]+', ' ', s)

    # 11. Unit expansions
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

    # 12. Punctuation timing (: ; , .)
    # Step numbers
    s = re.sub(r'((?:चरण|[Ss]tep)\s*\d+)\s*[:\.,]?\s*', r'\1, ', s)
    # Colons and semicolons (: ;) -> replace with comma pause
    s = re.sub(r'[:;]+', ', ', s)
    # Clean ellipses (...) -> single dot
    s = re.sub(r'\.{2,}', '. ', s)
    # Comma cleanup: multiple commas (,,,) -> single comma
    s = re.sub(r',\s*,+', ', ', s)
    s = re.sub(r'\s*,\s*', ', ', s)
    # Comma directly before or after dot -> single dot
    s = re.sub(r',\s*\.', '.', s)
    s = re.sub(r'\.\s*,', '.', s)
    # Space after sentence punctuation (. ? ! ।), preserving decimals like 1.5
    s = re.sub(r'(?<=[?!।])\s*|(?<=[a-zA-Z\u0900-\u097F]\.)\s*', ' ', s)

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
