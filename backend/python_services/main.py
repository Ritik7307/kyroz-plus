import os
import json
import asyncio
import tempfile
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, Form, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import groq
from tts_service import synthesize_speech, detect_language
import redis.asyncio as redis

load_dotenv()

app = FastAPI(title="Chef Core")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    print("FastAPI startup: Syncing SOPs from MongoDB disabled for instant startup.")
    # try:
    #     rag_engine.sync_sops_from_mongo()
    #     print("FastAPI startup: SOP sync complete.")
    # except Exception as e:
    #     print(f"FastAPI startup: Failed to sync SOPs from MongoDB on startup: {e}")


# Clients
groq_client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))
redis_client = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))

@app.get("/health")
async def health():
    return {"status": "ok", "service": "Chef Core"}

@app.post("/upload-docs")
async def upload_docs(file: UploadFile = File(...)):
    suffix = os.path.splitext(file.filename or "document.txt")[1] or ".txt"
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    temp_path = temp_file.name

    try:
        temp_file.write(await file.read())
        temp_file.close()
        from rag_engine import rag_engine
        rag_engine.load_document(temp_path)
        return {"message": f"Document {file.filename} processed and indexed."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document processing failed: {str(e)}")
    finally:
        temp_file.close()
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/chat")
async def chat(message: str = Form(...), lang: str = Form("en")):
    try:
        if not message.strip():
            raise HTTPException(status_code=400, detail="Message is required")

        # Get response from RAG
        from rag_engine import rag_engine
        response_text = rag_engine.query(message, lang=lang)
        
        return {
            "reply": response_text,
            "lang": lang
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@app.post("/speak")
async def speak(text: str = Form(...), lang: str = Form("auto")):
    try:
        audio_data = await synthesize_speech(text, lang=lang)
        detected_lang = lang if lang in {"hi", "en"} else detect_language(text)
        return Response(
            content=audio_data,
            media_type="audio/mpeg",
            headers={
                "Cache-Control": "no-store",
                "X-KOSA-Voice-Language": detected_lang,
            },
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS synthesis failed: {str(e)}")

@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...), lang: str = Form("auto")):
    suffix = os.path.splitext(audio.filename or "voice.webm")[1] or ".webm"
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    temp_filename = temp_file.name

    try:
        content = await audio.read()
        if len(content) < 1024:
            raise HTTPException(status_code=400, detail="Audio is too short or empty")

        temp_file.write(content)
        temp_file.close()

        whisper_language = lang if lang in ["hi", "en"] else None
        with open(temp_filename, "rb") as f:
            options = {
                "file": (audio.filename or f"voice{suffix}", f.read()),
                "model": "whisper-large-v3",
                "prompt": "Bilingual Hindi and English kitchen assistant conversation. Preserve mixed Hindi-English words accurately.",
                "response_format": "text",
            }
            if whisper_language:
                options["language"] = whisper_language

            transcription = groq_client.audio.transcriptions.create(**options)

        transcript = transcription.strip() if isinstance(transcription, str) else str(transcription).strip()
        if not transcript:
            raise HTTPException(status_code=422, detail="No speech detected")
        return {"transcript": transcript}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
    finally:
        temp_file.close()
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

@app.websocket("/ws/voice")
async def websocket_voice(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_bytes()
            # In a real implementation, we would stream audio chunks to Whisper
            # and pipe responses back. For now, acknowledge receipt.
            await websocket.send_json({"status": "received", "size": len(data)})
    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
