import bbox from "./bbox";
import untransform from "./untransform";

export default function(topology, n) {
  if (!((n = Math.floor(n)) >= 2)) throw new Error("n must be ≥2");
  if (topology.transform) throw new Error("already quantized");
  var bb = topology.bbox || bbox(topology), key,
      x0 = bb[0], y0 = bb[1], x1 = bb[2], y1 = bb[3],
      kx = x1 - x0 ? (x1 - x0) / (n - 1) : 1,
      ky = y1 - y0 ? (y1 - y0) / (n - 1) : 1,
      tf = {scale: [kx, ky], translate: [x0, y0]},
      tp = untransform(tf),
      inputs = topology.objects,
      outputs = {};

  function quantizePoint(point) {
    return tp(point);
  }

  function quantizeGeometry(geometry) {
    switch (geometry.type) {
      case "GeometryCollection": return {type: "GeometryCollection", geometries: geometry.geometries.map(quantizeGeometry)}; // TODO id, bbox, features
      case "Point": return {type: "Point", coordinates: quantizePoint(geometry.coordinates)}; // TODO id, bbox, features
      case "MultiPoint": return {type: "MultiPoint", coordinates: geometry.coordinates.map(quantizePoint)}; // TODO id, bbox, features
      default: return geometry;
    }
  }

  function quantizeArc(input/*, m*/) {
    var i = 0, j = 1, n = input.length, p, output = new Array(n); // pessimistic
    output[0] = tp(input[0], 0);
    while (++i < n) if ((p = tp(input[i], i))[0] || p[1]) output[j++] = p; // non-coincident points
    output.length = j;
    return output;
  }

  for (key in inputs) outputs[key] = quantizeGeometry(inputs[key]);

  return {
    type: "Topology",
    bbox: bb,
    transform: tf,
    objects: outputs,
    arcs: topology.arcs.map(quantizeArc)
  };
}
