from PIL import Image, ImageOps, ImageDraw, ImageFont
import os
Image.MAX_IMAGE_PIXELS = None
DIR='previews'
web=Image.open(os.path.join(DIR,'Bievo-Site-Completo-WEB.png')).convert('RGB')
mobile=Image.open(os.path.join(DIR,'Bievo-Site-Completo-MOBILE.png')).convert('RGB')
# Ajuste apenas de escala de apresentação; ambos mostram a página inteira.
target_h=20000
def resize_to_height(im,h):
    scale=h/im.height
    return im.resize((round(im.width*scale),h),Image.Resampling.LANCZOS)
web=resize_to_height(web,target_h)
mobile=resize_to_height(mobile,target_h)
margin=150;gap=180;header=280;footer=130
w=web.width+mobile.width+margin*2+gap
h=target_h+header+footer
out=Image.new('RGB',(w,h),'#F6F3ED')
d=ImageDraw.Draw(out)
try:
    font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',66)
    small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',33)
except OSError:
    font=ImageFont.load_default()
    small=font
d.text((margin,55),'BIEVO  /  WEBSITE COMPLETO',fill='#041E41',font=font)
d.text((margin,153),'VISUALIZAÇÃO DESKTOP + MOBILE   •   2026',fill='#A68772',font=small)
out.paste(web,(margin,header))
out.paste(mobile,(margin+web.width+gap,header))
d.text((margin,h-100),'DESKTOP  /  WEB',fill='#041E41',font=small)
d.text((margin+web.width+gap,h-100),'MOBILE',fill='#041E41',font=small)
out.save(os.path.join(DIR,'Bievo-Preview-WEB-e-MOBILE.jpg'),quality=96,subsampling=0,optimize=True)
print('SIZES',{'web':web.size,'mobile':mobile.size,'combined':out.size})
