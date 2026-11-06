# Local stand-in for shapely (3d/pcb/tools/shim/README.md). Only what the PCB tools use.
import sdfgeom as _g
from sdfgeom import (Point, LineString, LinearRing, Polygon, MultiPolygon, MultiLineString, MultiPoint,
                     GeometryCollection, box, BaseGeometry)
__version__ = 'shim-sdf-1'
SHIM = True
