import {default as collection, object} from "./feature";
import stitch from "./stitch";

export default function(topology) {
  return object(topology, meshArcs.apply(this, arguments));
}

export function meshes(topology) {
  return collection(topology, {
    type: "GeometryCollection",
    geometries: meshesArcs.apply(this, arguments)
  });
}

export function meshArcs(topology, object, filter) {
  var p, partition = meshesArcs(topology, object, !filter ? null : function() {
    return !!filter.apply(this, arguments);
  });
  return partition.length ? (p = partition[0], delete p.properties, p) : { type: 'MultiLineString', arcs: [] };
}

export function meshesArcs(topology, object, tag) {
  var partition, arcs, tags, i, n;

  if (arguments.length > 1) partition = extractArcs(topology, object, tag), tags = partition[1], partition = partition[0];
  else for (i = 0, arcs = new Array(n = topology.arcs.length); i < n; ++i) arcs[i] = i, partition = [arcs], tags = [true];
  
  return partition.map(function(arcs, i) {
    return {
      type: "MultiLineString",
      properties: { tag: tags[i] },
      arcs: stitch(topology, arcs)
    } 
  });
}

function extractArcs(topology, object, tag) {
  var tags = [],
      arcs = [],
      geomsByArc = [],
      geom;

  function extract0(i) {
    var j = i < 0 ? ~i : i;
    (geomsByArc[j] || (geomsByArc[j] = [])).push({i: i, g: geom});
  }

  function extract1(arcs) {
    arcs.forEach(extract0);
  }

  function extract2(arcs) {
    arcs.forEach(extract1);
  }

  function extract3(arcs) {
    arcs.forEach(extract2);
  }
  
  function tagpush(i, tag) {
    if (!tag) return;
    var t = tags.indexOf(tag);
    if (t === -1) tags.push(tag), t = arcs.length, arcs.push([]);
    arcs[t].push(i);
  }

  function geometry(o) {
    switch (geom = o, o.type) {
      case "GeometryCollection": o.geometries.forEach(geometry); break;
      case "LineString": extract1(o.arcs); break;
      case "MultiLineString": case "Polygon": extract2(o.arcs); break;
      case "MultiPolygon": extract3(o.arcs); break;
    }
  }

  geometry(object);

  geomsByArc.forEach(function(geoms) {
    tagpush(geoms[0].i, tag ? tag(geoms[0].g, geoms[geoms.length - 1].g) : true);
  });

  return [arcs, tags];
}
