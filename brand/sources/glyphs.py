import json, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import DecomposingRecordingPen

def load(wght):
    f = TTFont('ttf/PlusJakartaSans[wght].ttf')
    return instantiateVariableFont(f, {'wght': wght})

def glyph_info(font, name):
    gs = font.getGlyphSet()
    pen = SVGPathPen(gs)
    gs[name].draw(pen)
    bp = BoundsPen(gs); gs[name].draw(bp)
    return pen.getCommands(), gs[name].width, bp.bounds

def contours(font, name):
    gs = font.getGlyphSet()
    rp = DecomposingRecordingPen(gs); gs[name].draw(rp)
    cs=[]; cur=[]
    for op,args in rp.value:
        cur.append((op,args))
        if op in ('closePath','endPath'): cs.append(cur); cur=[]
    return cs

for w in (600,700,800):
    f = load(w)
    cmap = f.getBestCmap()
    upm = f['head'].unitsPerEm
    out = {'upm': upm, 'ascender': f['hhea'].ascent, 'descender': f['hhea'].descent, 'xHeight': getattr(f['OS/2'],'sxHeight',None), 'glyphs':{}}
    for ch in ['r','e','v','i','u','ı']:
        n = cmap[ord(ch)]
        d, adv, b = glyph_info(f, n)
        out['glyphs'][ch] = {'name':n,'d':d,'adv':adv,'bounds':b}
    # dot of i: contour with max yMin
    gs=f.getGlyphSet()
    from fontTools.pens.boundsPen import BoundsPen
    best=None
    for c in contours(f, cmap[ord('i')]):
        from fontTools.pens.recordingPen import RecordingPen
        bp=BoundsPen(gs)
        for op,args in c: getattr(bp,op)(*args)
        if bp.bounds and (best is None or bp.bounds[1]>best[1]): best=bp.bounds
    out['idot']=best
    # kerning pairs via GPOS is complex; skip
    json.dump(out, open(f'pjs{w}.json','w'))
    print(w, upm, out['xHeight'], out['idot'], {k:(v['adv'],v['bounds']) for k,v in out['glyphs'].items()})
