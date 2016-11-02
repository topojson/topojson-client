var fs = require("fs"),
    tape = require("tape"),
    topojson = require("../");

tape("topojson.bbox(topology) returns the existing bbox, if any", function(test) {
  var bbox = [1, 2, 3, 4];
  test.equal(topojson.bbox({type: "Topology", bbox: bbox, objects: {}, arcs: []}), bbox);
  test.end();
});

tape("topojson.bbox(topology) computes and assigns the bbox for a quantized topology, if missing", function(test) {
  var topology = JSON.parse(fs.readFileSync("test/topojson/polygon-q1e4.json"));
  delete topology.bbox;
  test.equal(topojson.bbox(topology), topology.bbox);
  test.deepEqual(topology.bbox, [0, 0, 10, 10]);
  test.end();
});

tape("topojson.bbox(topology) computes and assigns the bbox for a non-quantized topology, if missing", function(test) {
  var topology = JSON.parse(fs.readFileSync("test/topojson/polygon.json"));
  delete topology.bbox;
  test.equal(topojson.bbox(topology), topology.bbox);
  test.deepEqual(topology.bbox, [0, 0, 10, 10]);
  test.end();
});

tape("topojson.bbox(topology) computes and assigns considers points", function(test) {
  var topology = JSON.parse(fs.readFileSync("test/topojson/point.json"));
  delete topology.bbox;
  test.deepEqual(topojson.bbox(topology), [0, 0, 10, 10]);
  test.end();
});

tape("topojson.bbox(topology) computes and assigns considers multipoints", function(test) {
  var topology = JSON.parse(fs.readFileSync("test/topojson/points.json"));
  delete topology.bbox;
  test.deepEqual(topojson.bbox(topology), [0, 0, 10, 10]);
  test.end();
});
