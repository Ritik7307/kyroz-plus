import os
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

speechsdk = None
try:
    import importlib
    speechsdk = importlib.import_module("azure.cognitiveservices.speech")
    AZURE_AVAILABLE = True
except (ImportError, ModuleNotFoundError):
    speechsdk = None
    AZURE_AVAILABLE = False

class VoiceEngine:
    def __init__(self):
        self.speech_key = os.getenv("AZURE_SPEECH_KEY")
        self.speech_region = os.getenv("AZURE_SPEECH_REGION")
        
        if AZURE_AVAILABLE and self.speech_key and self.speech_region:
            self.speech_config = speechsdk.SpeechConfig(subscription=self.speech_key, region=self.speech_region)
            # Default voices (Indian English & Hindi)
            self.voices = {
                "en": "en-IN-NeerjaNeural",
                "hi": "hi-IN-SwaraNeural"
            }
        else:
            self.speech_config = None
            if not AZURE_AVAILABLE:
                logger.info("Azure Speech SDK not installed. Falling back to edge-tts.")
            else:
                logger.info("Azure Speech keys not found. TTS will use edge-tts.")

    async def generate_speech(self, text: str, lang: str = "en"):
        # If Azure Speech is configured and available, use it
        if self.speech_config and AZURE_AVAILABLE:
            try:
                voice_name = self.voices.get(lang, self.voices["en"])
                self.speech_config.speech_synthesis_voice_name = voice_name
                
                pull_stream = speechsdk.audio.PullAudioOutputStream()
                audio_config = speechsdk.audio.AudioConfig(stream=pull_stream)
                
                synthesizer = speechsdk.SpeechSynthesizer(speech_config=self.speech_config, audio_config=audio_config)
                result = synthesizer.speak_text_async(text).get()
                
                if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                    return result.audio_data
                else:
                    logger.warning(f"Azure speech synthesis failed: {result.reason}, falling back to edge-tts")
            except Exception as e:
                logger.error(f"Azure Speech Error: {e}")

        # Fallback to high-quality Indian edge-tts
        try:
            from tts_service import synthesize_speech
            return await synthesize_speech(text, lang=lang)
        except Exception as e:
            logger.error(f"Fallback synthesize_speech failed: {e}")
            return None

voice_engine = VoiceEngine()
