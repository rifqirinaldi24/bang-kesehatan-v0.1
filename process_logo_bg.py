import os
from PIL import Image

input_path = r"C:\Users\NDS\.gemini\antigravity\brain\dabd5877-5ed8-45dd-8e0b-ad07bbcb7782\media__1781334466629.jpg"
output_path = r"public\logo.png"

# senadee-dark = #14532D = (20, 83, 45)
BG_COLOR = (20, 83, 45, 255)

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
        
        # If it's pure black, use the background color
        if intensity < 10:
            newData.append(BG_COLOR)
        else:
            # We want to blend the logo color with the background color
            # The logo intensity acts as the alpha for the logo over the BG
            alpha = intensity / 255.0
            
            # The logo color was scaled to be fully bright
            factor = 255.0 / intensity
            logo_r = min(255, int(r * factor))
            logo_g = min(255, int(g * factor))
            logo_b = min(255, int(b * factor))
            
            # Blend
            new_r = int((logo_r * alpha) + (BG_COLOR[0] * (1 - alpha)))
            new_g = int((logo_g * alpha) + (BG_COLOR[1] * (1 - alpha)))
            new_b = int((logo_b * alpha) + (BG_COLOR[2] * (1 - alpha)))
            
            newData.append((new_r, new_g, new_b, 255))

    img.putdata(newData)
    img.save(out_path, "PNG")
    print(f"Saved {out_path} with BG at size {target_size}")

if __name__ == "__main__":
    process_logo(input_path, output_path)
