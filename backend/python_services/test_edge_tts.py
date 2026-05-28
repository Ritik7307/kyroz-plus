import asyncio
import edge_tts

async def test():
    print("Testing edge-tts voices...")
    try:
        # Test English voice
        communicate_en = edge_tts.Communicate("Hello, this is a test of the English female voice model.", "en-US-AriaNeural")
        en_data = b""
        async for chunk in communicate_en.stream():
            if chunk["type"] == "audio":
                en_data += chunk["data"]
        print(f"English voice (en-US-AriaNeural) synthesis success: {len(en_data)} bytes generated")

        # Test Hindi voice
        communicate_hi = edge_tts.Communicate("नमस्ते, यह हिंदी महिला आवाज़ मॉडल का परीक्षण है।", "hi-IN-SwaraNeural")
        hi_data = b""
        async for chunk in communicate_hi.stream():
            if chunk["type"] == "audio":
                hi_data += chunk["data"]
        print(f"Hindi voice (hi-IN-SwaraNeural) synthesis success: {len(hi_data)} bytes generated")

    except Exception as e:
        print("Error during synthesis:", e)

if __name__ == "__main__":
    asyncio.run(test())
