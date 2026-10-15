import math
from PIL import Image, ImageDraw

def create_finder_icon(size: int, is_maskable: bool = False) -> Image.Image:
    # 32-bit RGBA image
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Scale factor
    s = size / 512.0
    
    # Background
    if is_maskable:
        # Maskable fills entire canvas
        draw.rectangle([0, 0, size, size], fill=(9, 10, 15, 255))
    else:
        # Squircle / rounded rect for standalone
        radius = int(112 * s)
        draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=(9, 10, 15, 255))
        # Subtle outer border
        draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, outline=(255, 255, 255, 24), width=int(2 * s))

    # Center coordinates
    cx, cy = size / 2.0, size / 2.0

    # Draw concentric radar rings with low opacity
    ring_radii = [180 * s, 120 * s, 65 * s]
    ring_alphas = [18, 30, 48]
    for r, a in zip(ring_radii, ring_alphas):
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(147, 197, 253, a), width=max(1, int(1.5 * s)))

    # Subtle radar sweep / crosshair ticks
    tick_len = 16 * s
    for r in [120 * s, 180 * s]:
        # 4 cardinal ticks
        draw.line([cx - r - tick_len/2, cy, cx - r + tick_len/2, cy], fill=(147, 197, 253, 60), width=max(1, int(2 * s)))
        draw.line([cx + r - tick_len/2, cy, cx + r + tick_len/2, cy], fill=(147, 197, 253, 60), width=max(1, int(2 * s)))
        draw.line([cx, cy - r - tick_len/2, cx, cy - r + tick_len/2], fill=(147, 197, 253, 60), width=max(1, int(2 * s)))
        draw.line([cx, cy + r - tick_len/2, cx, cy + r + tick_len/2], fill=(147, 197, 253, 60), width=max(1, int(2 * s)))

    # Main icon motif: A sleek geometric "F" / radar spark
    # Draw diamond/compass beacon
    pts = [
        (cx, cy - 80 * s),
        (cx + 45 * s, cy),
        (cx, cy + 80 * s),
        (cx - 45 * s, cy),
    ]
    # Draw glowing beacon polygon
    draw.polygon(pts, fill=(240, 244, 255, 240))

    # Inner core diamond with emerald/cyan accent
    inner_pts = [
        (cx, cy - 40 * s),
        (cx + 22 * s, cy),
        (cx, cy + 40 * s),
        (cx - 22 * s, cy),
    ]
    draw.polygon(inner_pts, fill=(16, 185, 129, 255))

    # Center pulse point
    cp_r = 7 * s
    draw.ellipse([cx - cp_r, cy - cp_r, cx + cp_r, cy + cp_r], fill=(255, 255, 255, 255))

    # Dynamic orbital dot (simulating idea blip on radar)
    orbit_angle = math.radians(-38)
    orbit_r = 120 * s
    blip_x = cx + orbit_r * math.cos(orbit_angle)
    blip_y = cy + orbit_r * math.sin(orbit_angle)
    
    # Glow around blip
    draw.ellipse([blip_x - 14 * s, blip_y - 14 * s, blip_x + 14 * s, blip_y + 14 * s], fill=(244, 63, 94, 70))
    draw.ellipse([blip_x - 6 * s, blip_y - 6 * s, blip_x + 6 * s, blip_y + 6 * s], fill=(251, 113, 133, 255))

    # Second blip (revenue idea blip)
    orbit_angle2 = math.radians(135)
    orbit_r2 = 140 * s
    blip2_x = cx + orbit_r2 * math.cos(orbit_angle2)
    blip2_y = cy + orbit_r2 * math.sin(orbit_angle2)
    draw.ellipse([blip2_x - 14 * s, blip2_y - 14 * s, blip2_x + 14 * s, blip2_y + 14 * s], fill=(16, 185, 129, 70))
    draw.ellipse([blip2_x - 6 * s, blip2_y - 6 * s, blip2_x + 6 * s, blip2_y + 6 * s], fill=(52, 211, 153, 255))

    return img

if __name__ == "__main__":
    import os
    os.makedirs("/home/shiva/finder/public", exist_ok=True)
    
    # 512x512
    icon512 = create_finder_icon(512, is_maskable=False)
    icon512.save("/home/shiva/finder/public/icon-512.png", "PNG")
    
    # 192x192
    icon192 = create_finder_icon(192, is_maskable=False)
    icon192.save("/home/shiva/finder/public/icon-192.png", "PNG")
    
    # 512x512 maskable
    maskable = create_finder_icon(512, is_maskable=True)
    maskable.save("/home/shiva/finder/public/icon-maskable.png", "PNG")
    
    # 180x180 apple-touch-icon
    apple_icon = create_finder_icon(180, is_maskable=False)
    apple_icon.save("/home/shiva/finder/public/apple-touch-icon.png", "PNG")
    
    print("PWA icons generated successfully!")
