var fs = require("fs"),
    tape = require("tape"),
    topojson = require("../");

tape("topojson.quantize(topology, n) quantizes the input topology", function(test) {
  test.deepEqual(topojson.quantize(JSON.parse(fs.readFileSync("test/topojson/polygon.json")), 1e4), JSON.parse(fs.readFileSync("test/topojson/polygon-q1e4.json")));
  test.deepEqual(topojson.quantize(JSON.parse(fs.readFileSync("test/topojson/polygon.json")), 1e5), JSON.parse(fs.readFileSync("test/topojson/polygon-q1e5.json")));
  test.end();
});

tape("topojson.quantize(topology, n) throws an error if n is not at least two", function(test) {
  var topology = JSON.parse(fs.readFileSync("test/topojson/polygon.json"));
  test.throws(function() { topojson.quantize(topology, 0); }, /n must be ≥2/);
  test.throws(function() { topojson.quantize(topology, 1.5); }, /n must be ≥2/);
  test.throws(function() { topojson.quantize(topology); }, /n must be ≥2/);
  test.throws(function() { topojson.quantize(topology, undefined); }, /n must be ≥2/);
  test.throws(function() { topojson.quantize(topology, NaN); }, /n must be ≥2/);
  test.throws(function() { topojson.quantize(topology, null); }, /n must be ≥2/);
  test.throws(function() { topojson.quantize(topology, -2); }, /n must be ≥2/);
  test.end();
});

tape("topojson.quantize(topology, n) throws an error if the topology is already quantized", function(test) {
  var topology = JSON.parse(fs.readFileSync("test/topojson/polygon-q1e4.json"));
  test.throws(function() { topojson.quantize(topology, 1e4); }, /already quantized/);
  test.end();
});

tape("topojson.quantize(topology, n) assigns a bounding box if it is missing", function(test) {
  var topology = JSON.parse(fs.readFileSync("test/topojson/polygon.json"));
  delete topology.bbox;
  test.deepEqual(topojson.quantize(topology, 1e4), JSON.parse(fs.readFileSync("test/topojson/polygon-q1e4.json")));
  test.deepEqual(topology.bbox, [0, 0, 10, 10]);
  test.end();
});
