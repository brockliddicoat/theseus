# usage: python3 phone.py <in.png> <out.png>  : the stage at 0.44x (845x475), as a phone sees it
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB')
im.resize((845, 475), Image.LANCZOS).save(sys.argv[2])
print(sys.argv[2])
