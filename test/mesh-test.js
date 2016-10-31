var tape = require("tape"),
    topojson = require("../");

require("./inDelta");

tape("mesh ignores null geometries", function(test) {
  var topology = {
    "type": "Topology",
    "objects": {},
    "arcs": []
  };
  test.deepEqual(topojson.mesh(topology, {type: null}), {
    type: "MultiLineString",
    coordinates: []
  });
  test.end();
});

tape("mesh stitches together two connected line strings", function(test) {
  var topology = {
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
  };
  test.inDelta(topojson.mesh(topology, topology.objects.collection), {
    type: "MultiLineString",
    coordinates: [[[0, 0], [1, 0], [2, 0]]]
  });
  test.end();
});

tape("mesh does not stitch together two disconnected line strings", function(test) {
  var topology = {
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
  test.inDelta(topojson.mesh(topology, topology.objects.collection), {
    type: "MultiLineString",
    coordinates: [[[2, 0], [3, 0]], [[0, 0], [1, 0]]]
  });
  test.end();
});
