var tape = require("tape"),
    topojson = require("../");

tape("topojson.transform(topology) returns the identity function if transform is undefined", function(test) {
  var transform = topojson.transform(null),
      point;
  test.equal(transform(point = {}), point);
  test.end();
});

tape("topojson.transform(topology) returns a point-transform function if transform is defined", function(test) {
  var transform = topojson.transform({scale: [2, 3], translate: [4, 5]});
  test.deepEqual(transform([6, 7]), [16, 26]);
  test.end();
});

tape("transform(point) returns a new point", function(test) {
  var transform = topojson.transform({scale: [2, 3], translate: [4, 5]}),
      point = [6, 7];
  test.deepEqual(transform(point), [16, 26]);
  test.deepEqual(point, [6, 7]);
  test.end();
});

tape("transform(point) preserves extra dimensions", function(test) {
  var transform = topojson.transform({scale: [2, 3], translate: [4, 5]});
  test.deepEqual(transform([6, 7, 42]), [16, 26, 42]);
  test.deepEqual(transform([6, 7, "foo"]), [16, 26, "foo"]);
  test.deepEqual(transform([6, 7, "foo", 42]), [16, 26, "foo", 42]);
  test.end();
});

tape("transform(point) transforms individual points", function(test) {
  var transform = topojson.transform({scale: [2, 3], translate: [4, 5]});
  test.deepEqual(transform([1, 2]), [6, 11]);
  test.deepEqual(transform([3, 4]), [10, 17]);
  test.deepEqual(transform([5, 6]), [14, 23]);
  test.end();
});

tape("transform(point, index) transforms delta-encoded arcs", function(test) {
  var transform = topojson.transform({scale: [2, 3], translate: [4, 5]});
  test.deepEqual(transform([1, 2], 0), [6, 11]);
  test.deepEqual(transform([3, 4], 1), [12, 23]);
  test.deepEqual(transform([5, 6], 2), [22, 41]);
  test.deepEqual(transform([1, 2], 3), [24, 47]);
  test.deepEqual(transform([3, 4], 4), [30, 59]);
  test.deepEqual(transform([5, 6], 5), [40, 77]);
  test.end();
});

tape("transform(point, index) transforms multiple delta-encoded arcs", function(test) {
  var transform = topojson.transform({scale: [2, 3], translate: [4, 5]});
  test.deepEqual(transform([1, 2], 0), [6, 11]);
  test.deepEqual(transform([3, 4], 1), [12, 23]);
  test.deepEqual(transform([5, 6], 2), [22, 41]);
  test.deepEqual(transform([1, 2], 0), [6, 11]);
  test.deepEqual(transform([3, 4], 1), [12, 23]);
  test.deepEqual(transform([5, 6], 2), [22, 41]);
  test.end();
});
