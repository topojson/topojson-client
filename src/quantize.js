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

  function quantizeGeometry(input) {
    var output;
    switch (input.type) {
      case "GeometryCollection": output = {type: "GeometryCollection", geometries: input.geometries.map(quantizeGeometry)}; break;
      case "Point": output = {type: "Point", coordinates: quantizePoint(input.coordinates)}; break;
      case "MultiPoint": output = {type: "MultiPoint", coordinates: input.coordinates.map(quantizePoint)}; break;
      default: return input;
    }
    if (input.id != null) output.id = input.id;
    if (input.bbox != null) output.bbox = input.bbox;
    if (input.properties != null) output.properties = input.properties;
    return output;
  }

  function quantizeArc(input) {
    var i = 0, j = 1, n = input.length, p, output = new Array(n); // pessimistic
    output[0] = tp(input[0], 0);
    while (++i < n) if ((p = tp(input[i], i))[0] || p[1]) output[j++] = p; // non-coincident points
    if (j === 1) output[j++] = [0, 0]; // an arc must have at least two points
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
