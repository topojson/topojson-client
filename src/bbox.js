import transform from "./transform";

export default function(topology) {
  var bbox = topology.bbox;
  if (!bbox) {
    var t = transform(topology), i = -1, n = topology.arcs.length, p0, p1 = new Array(2), x0 = Infinity, y0 = x0, x1 = -x0, y1 = -x0;
    while (++i < n) {
      var arc = topology.arcs[i], j = -1, m = arc.length;
      while (++j < m) {
        p0 = arc[j], p1[0] = p0[0], p1[1] = p0[1], t(p1, j);
        if (p1[0] < x0) x0 = p1[0];
        if (p1[0] > x1) x1 = p1[0];
        if (p1[1] < y0) y0 = p1[1];
        if (p1[1] > y1) y1 = p1[1];
      }
    }
    bbox = topology.bbox = [x0, y0, x1, y1];
  }
  return bbox;
}
