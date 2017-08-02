var tape = require("tape"),
    topojson = require("../");

require("./inDelta");

var emptyTopology = {
  "type": "Topology",
  "objects": {},
  "arcs": []
},
jointTopology = {
  "type": "Topology",
  "objects": {
    "collection": {
      "type": "GeometryCollection",
      "geometries": [
        {"type": "LineString", "arcs": [0]},
        {"type": "LineString", "arcs": [1]}
      ]
    }
  },
  "arcs": [
    [[1, 0], [2, 0]],
    [[0, 0], [1, 0]]
  ]
},
disjointTopology = {
  "type": "Topology",
  "objects": {
    "collection": {
      "type": "GeometryCollection",
      "geometries": [
        {"type": "LineString", "arcs": [0]},
        {"type": "LineString", "arcs": [1]}
      ]
    }
  },
  "arcs":[
    [[2, 0], [3, 0]],
    [[0, 0], [1, 0]]
  ]
};

tape("mesh ignores null geometries", function(test) {
  test.deepEqual(topojson.mesh(emptyTopology, {type: null}), {
    type: "MultiLineString",
    coordinates: []
  });
  test.end();
});

tape("mesh stitches together two connected line strings", function(test) {
  test.inDelta(topojson.mesh(jointTopology, jointTopology.objects.collection), {
    type: "MultiLineString",
    coordinates: [[[0, 0], [1, 0], [2, 0]]]
  });
  test.end();
});

tape("mesh does not stitch together two disconnected line strings", function(test) {
  test.inDelta(topojson.mesh(disjointTopology, disjointTopology.objects.collection), {
    type: "MultiLineString",
    coordinates: [[[2, 0], [3, 0]], [[0, 0], [1, 0]]]
  });
  test.end();
});


tape("meshesArcs return an array of meshArcs", function(test) {
  var meshes = topojson.meshesArcs(disjointTopology, disjointTopology.objects.collection, function(a, b) { return a; });
  test.assert(meshes.length, 2);
  test.equal(meshes[0].type, 'MultiLineString');
  test.assert(meshes[0].properties && !!meshes[0].properties.tag, true);
  test.end();
});

tape("meshes does partition", function(test) {
  var meshes = topojson.meshes(disjointTopology, disjointTopology.objects.collection, function(a, b) { return a; });
  test.equal(meshes.type, 'FeatureCollection');
  test.equal(meshes.features.length, 2);
  test.assert(meshes.features && meshes.features[0] && meshes.features[0].properties && !!meshes.features[0].properties.tag, true);
  test.end();
});