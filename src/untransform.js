import identity from "./identity";

export default function(transform) {
  if (transform == null) return identity;
  var x0,
      y0,
      kx = transform.scale[0],
      ky = transform.scale[1],
      dx = transform.translate[0],
      dy = transform.translate[1];
  return function(point, i) {
    if (!i) x0 = y0 = 0;
    var x1 = Math.round((point[0] - dx) / kx),
        y1 = Math.round((point[1] - dy) / ky),
        x = x1 - x0,
        y = y1 - y0;
    x0 = x1;
    y0 = y1;
    return [x, y];
  };
}
