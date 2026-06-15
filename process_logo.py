import os
from PIL import Image

input_path = r"C:\Users\NDS\.gemini\antigravity\brain\dabd5877-5ed8-45dd-8e0b-ad07bbcb7782\media__1781334466629.jpg"
output_path = r"public\logo.png"

def process_logo(in_path, out_path, target_size=(2048, 2048)):
    # Open the image
    img = Image.open(in_path).convert("RGBA")
    
    # Resize to high quality 2K
    img = img.resize(target_size, Image.Resampling.LANCZOS)
    
    # Process data to remove black background
    datas = img.getdata()
    newData = []
    
    for item in datas:
        r, g, b, a = item
        intensity = max(r, g, b)
        
        if intensity < 10:
            newData.append((0, 0, 0, 0))
        else:
            factor = 255.0 / intensity
            new_r = min(255, int(r * factor))
            new_g = min(255, int(g * factor))
            new_b = min(255, int(b * factor))
            newData.append((new_r, new_g, new_b, intensity))

    img.putdata(newData)
    img.save(out_path, "PNG")
    print(f"Saved {out_path} at size {target_size}")

if __name__ == "__main__":
    process_logo(input_path, output_path)
