var fs = require("fs"),
    tape = require("tape"),
    topojson = require("../");

tape("topojson.quantize(topology, n) quantizes the input topology", function(test) {
  test.deepEqual(topojson.quantize(JSON.parse(fs.readFileSync("test/topojson/polygon.json")), 1e4), JSON.parse(fs.readFileSync("test/topojson/polygon-q1e4.json")));
  test.deepEqual(topojson.quantize(JSON.parse(fs.readFileSync("test/topojson/polygon.json")), 1e5), JSON.parse(fs.readFileSync("test/topojson/polygon-q1e5.json")));
  test.end();
});

tape("topojson.quantize(topology, n) ensures that each arc has at least two points", function(test) {
  test.deepEqual(topojson.quantize(JSON.parse(fs.readFileSync("test/topojson/empty.json")), 1e4), JSON.parse(fs.readFileSync("test/topojson/empty-q1e4.json")));
  test.end();
});

tape("topojson.quantize(topology, n) preserves the id, bbox and properties of input objects", function(test) {
  test.deepEqual(topojson.quantize(JSON.parse(fs.readFileSync("test/topojson/properties.json")), 1e4), JSON.parse(fs.readFileSync("test/topojson/properties-q1e4.json")));
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

tape("topojson.quantize(topology, n) returns a new topology with a bounding box", function(test) {
  var before = JSON.parse(fs.readFileSync("test/topojson/polygon.json")),
      after = (before.bbox = null, topojson.quantize(before, 1e4));
  test.deepEqual(after, JSON.parse(fs.readFileSync("test/topojson/polygon-q1e4.json")));
  test.deepEqual(after.bbox, [0, 0, 10, 10]);
  test.equal(before.bbox, null);
  test.end();
});
