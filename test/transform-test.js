var tape = require("tape"),
    topojson = require("../");

tape("topojson.transform(topology) returns the identity function if topology.transform is undefined", function(test) {
  var topology = {type: "Topology", objects: {}, arcs: []},
      transform = topojson.transform(topology),
      point;
  test.equal(transform(point = {}), point);
  test.end();
});

tape("topojson.transform(topology) returns a point-transform function if topology.transform is defined", function(test) {
  var topology = {type: "Topology", transform: {scale: [2, 3], translate: [4, 5]}, objects: {}, arcs: []},
      transform = topojson.transform(topology);
  test.deepEqual(transform([6, 7]), [16, 26]);
  test.end();
});

tape("transform(point) returns the input point, modifying it in-place", function(test) {
  var topology = {type: "Topology", transform: {scale: [2, 3], translate: [4, 5]}, objects: {}, arcs: []},
      transform = topojson.transform(topology),
      point = [6, 7];
  test.equal(transform(point), point);
  test.deepEqual(point, [16, 26]);
  test.end();
});

tape("transform(point) transforms individual points", function(test) {
  var topology = {type: "Topology", transform: {scale: [2, 3], translate: [4, 5]}, objects: {}, arcs: []},
      transform = topojson.transform(topology);
  test.deepEqual(transform([1, 2]), [6, 11]);
  test.deepEqual(transform([3, 4]), [10, 17]);
  test.deepEqual(transform([5, 6]), [14, 23]);
  test.end();
});

tape("transform(point, index) transforms delta-encoded arcs", function(test) {
  var topology = {type: "Topology", transform: {scale: [2, 3], translate: [4, 5]}, objects: {}, arcs: []},
      transform = topojson.transform(topology);
  test.deepEqual(transform([1, 2], 0), [6, 11]);
  test.deepEqual(transform([3, 4], 1), [12, 23]);
  test.deepEqual(transform([5, 6], 2), [22, 41]);
  test.deepEqual(transform([1, 2], 3), [24, 47]);
  test.deepEqual(transform([3, 4], 4), [30, 59]);
  test.deepEqual(transform([5, 6], 5), [40, 77]);
  test.end();
});

tape("transform(point, index) transforms multiple delta-encoded arcs", function(test) {
  var topology = {type: "Topology", transform: {scale: [2, 3], translate: [4, 5]}, objects: {}, arcs: []},
      transform = topojson.transform(topology);
  test.deepEqual(transform([1, 2], 0), [6, 11]);
  test.deepEqual(transform([3, 4], 1), [12, 23]);
  test.deepEqual(transform([5, 6], 2), [22, 41]);
  test.deepEqual(transform([1, 2], 0), [6, 11]);
  test.deepEqual(transform([3, 4], 1), [12, 23]);
  test.deepEqual(transform([5, 6], 2), [22, 41]);
  test.end();
});
