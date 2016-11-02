var tape = require("tape"),
    topojson = require("../");

tape("topojson.untransform(topology) returns the identity function if topology.transform is undefined", function(test) {
  var topology = {type: "Topology", objects: {}, arcs: []},
      untransform = topojson.untransform(topology),
      point;
  test.equal(untransform(point = {}), point);
  test.end();
});

tape("topojson.untransform(topology) returns a point-transform function if topology.transform is defined", function(test) {
  var topology = {type: "Topology", transform: {scale: [2, 3], translate: [4, 5]}, objects: {}, arcs: []},
      untransform = topojson.untransform(topology);
  test.deepEqual(untransform([16, 26]), [6, 7]);
  test.end();
});

tape("untransform(point) returns the input point, modifying it in-place", function(test) {
  var topology = {type: "Topology", transform: {scale: [2, 3], translate: [4, 5]}, objects: {}, arcs: []},
      untransform = topojson.untransform(topology),
      point = [16, 26];
  test.equal(untransform(point), point);
  test.deepEqual(point, [6, 7]);
  test.end();
});

tape("untransform(point) untransforms individual points", function(test) {
  var topology = {type: "Topology", transform: {scale: [2, 3], translate: [4, 5]}, objects: {}, arcs: []},
      untransform = topojson.untransform(topology);
  test.deepEqual(untransform([6, 11]), [1, 2]);
  test.deepEqual(untransform([10, 17]), [3, 4]);
  test.deepEqual(untransform([14, 23]), [5, 6]);
  test.end();
});

tape("untransform(point, index) untransforms delta-encoded arcs", function(test) {
  var topology = {type: "Topology", transform: {scale: [2, 3], translate: [4, 5]}, objects: {}, arcs: []},
      untransform = topojson.untransform(topology);
  test.deepEqual(untransform([6, 11], 0), [1, 2]);
  test.deepEqual(untransform([12, 23], 1), [3, 4]);
  test.deepEqual(untransform([22, 41], 2), [5, 6]);
  test.deepEqual(untransform([24, 47], 3), [1, 2]);
  test.deepEqual(untransform([30, 59], 4), [3, 4]);
  test.deepEqual(untransform([40, 77], 5), [5, 6]);
  test.end();
});

tape("untransform(point, index) untransforms multiple delta-encoded arcs", function(test) {
  var topology = {type: "Topology", transform: {scale: [2, 3], translate: [4, 5]}, objects: {}, arcs: []},
      untransform = topojson.untransform(topology);
  test.deepEqual(untransform([6, 11], 0), [1, 2]);
  test.deepEqual(untransform([12, 23], 1), [3, 4]);
  test.deepEqual(untransform([22, 41], 2), [5, 6]);
  test.deepEqual(untransform([6, 11], 0), [1, 2]);
  test.deepEqual(untransform([12, 23], 1), [3, 4]);
  test.deepEqual(untransform([22, 41], 2), [5, 6]);
  test.end();
});
