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
