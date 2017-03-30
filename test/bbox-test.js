var fs = require("fs"),
    tape = require("tape"),
    topojson = require("../");

tape("topojson.bbox(topology) ignores the existing bbox, if any", function(test) {
  var bbox = [1, 2, 3, 4];
  test.deepEqual(topojson.bbox({type: "Topology", bbox: bbox, objects: {}, arcs: []}), [Infinity, Infinity, -Infinity, -Infinity]);
  test.end();
});

tape("topojson.bbox(topology) computes the bbox for a quantized topology, if missing", function(test) {
  var topology = JSON.parse(fs.readFileSync("test/topojson/polygon-q1e4.json"));
  test.deepEqual(topojson.bbox(topology), [0, 0, 10, 10]);
  test.end();
});

tape("topojson.bbox(topology) computes the bbox for a non-quantized topology, if missing", function(test) {
  var topology = JSON.parse(fs.readFileSync("test/topojson/polygon.json"));
  test.deepEqual(topojson.bbox(topology), [0, 0, 10, 10]);
  test.end();
});

tape("topojson.bbox(topology) considers points", function(test) {
  var topology = JSON.parse(fs.readFileSync("test/topojson/point.json"));
  test.deepEqual(topojson.bbox(topology), [0, 0, 10, 10]);
  test.end();
});

tape("topojson.bbox(topology) considers multipoints", function(test) {
  var topology = JSON.parse(fs.readFileSync("test/topojson/points.json"));
  test.deepEqual(topojson.bbox(topology), [0, 0, 10, 10]);
  test.end();
});
