export default function(topology, n) {
  if (topology.transform) throw new Error("already quantized");
  if (!(bb = topology.bbox)) throw new Error("missing bbox");
  var bb, dx = bb[0], kx = (bb[2] - dx) / (n - 1) || 1,
          dy = bb[1], ky = (bb[3] - dy) / (n - 1) || 1;

  topology.arcs.forEach(function(arc) {
    var i = 1,
        j = 1,
        n = arc.length,
        pi = arc[0],
        x0 = pi[0] = Math.round((pi[0] - dx) / kx),
        y0 = pi[1] = Math.round((pi[1] - dy) / ky),
        pj,
        x1,
        y1;

    for (; i < n; ++i) {
      pi = arc[i];
      x1 = Math.round((pi[0] - dx) / kx);
      y1 = Math.round((pi[1] - dy) / ky);
      if (x1 !== x0 || y1 !== y0) {
        pj = arc[j++];
        pj[0] = x1 - x0, x0 = x1;
        pj[1] = y1 - y0, y0 = y1;
      }
    }

    if (j < 2) {
      pj = arc[j++];
      pj[0] = 0;
      pj[1] = 0;
    }

    arc.length = j;
  });

  topology.transform = {
    scale: [kx, ky],
    translate: [dx, dy]
  };

  return topology;
}
