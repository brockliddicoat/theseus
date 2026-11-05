"""Stand-in for segno.make(): OpenCV's QR encoder (cv2.QRCodeEncoder), checked by decoding it back."""
import numpy as np, cv2

_LEVEL = {'l': 'L', 'm': 'M', 'q': 'Q', 'h': 'H'}


class _QR:
    def __init__(self, M):
        self.matrix = tuple(tuple(int(v) for v in row) for row in M)
        self.version = (M.shape[0] - 17) // 4


def make(content, error='m', micro=False, boost_error=True, **kw):
    p = cv2.QRCodeEncoder_Params()
    p.correction_level = getattr(cv2, 'QRCODE_ENCODER_CORRECT_LEVEL_' + _LEVEL[(error or 'm').lower()])
    img = cv2.QRCodeEncoder.create(p).encode(content)
    M = (img < 128).astype(np.uint8)                      # 1 = dark module
    big = cv2.copyMakeBorder(cv2.resize(img, None, fx=8, fy=8, interpolation=cv2.INTER_NEAREST), 32, 32, 32, 32,
                             cv2.BORDER_CONSTANT, value=255)
    if cv2.QRCodeDetector().detectAndDecode(big)[0] != content:
        raise RuntimeError('shim segno: the QR does not decode back to its content')
    return _QR(M)
