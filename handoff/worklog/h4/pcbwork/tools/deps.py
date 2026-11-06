# The PCB tools need shapely, mapbox_earcut, HersheyFonts and segno. Where one is not installed (this container cannot
# install packages: pypi.org is refused), its stand-in from shim/ is used instead (shim/README.md). Installed packages
# always win: the shim folder goes at the end of sys.path, and only when something is missing.
import importlib.util, os, sys
_SHIM = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shim')
MISSING = [m for m in ('shapely', 'mapbox_earcut', 'HersheyFonts', 'segno') if importlib.util.find_spec(m) is None]
if MISSING and _SHIM not in sys.path:
    sys.path.append(_SHIM)
