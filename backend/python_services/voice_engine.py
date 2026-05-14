import os
import azure.cognitiveservices.speech as speechsdk
from dotenv import load_dotenv

load_dotenv()

class VoiceEngine:
    def __init__(self):
        self.speech_key = os.getenv("AZURE_SPEECH_KEY")
        self.speech_region = os.getenv("AZURE_SPEECH_REGION")
        
        if self.speech_key and self.speech_region:
            self.speech_config = speechsdk.SpeechConfig(subscription=self.speech_key, region=self.speech_region)
            # Default voices
            self.voices = {
                "en": "en-US-AndrewNeural",
                "hi": "hi-IN-MadhurNeural"
            }
        else:
            self.speech_config = None
            print("Azure Speech keys not found. TTS will be disabled.")

    async def generate_speech(self, text: str, lang: str = "en"):
        if not self.speech_config:
            return None

        # Choose voice based on language
        voice_name = self.voices.get(lang, self.voices["en"])
        self.speech_config.speech_synthesis_voice_name = voice_name
        
        # Output to memory stream
        pull_stream = speechsdk.audio.PullAudioOutputStream()
        audio_config = speechsdk.audio.AudioConfig(stream=pull_stream)
        
        synthesizer = speechsdk.SpeechSynthesizer(speech_config=self.speech_config, audio_config=audio_config)
        result = synthesizer.speak_text_async(text).get()
        
        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            return result.audio_data
        else:
            print(f"Speech synthesis failed: {result.reason}")
            return None

voice_engine = VoiceEngine()
