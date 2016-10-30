var fs = require("fs"),
    os = require("os"),
    path = require("path"),
    child = require("child_process"),
    tape = require("tape");

require("./inDelta");

var tmpprefix = "geojson-command-test-" + process.pid + "-",
    testId = Math.random() * 0xffff | 0;

testConversion(
  "Polygons",
  "polygon",
  "test/geojson/polygon-feature.json",
  "test/topojson/polygon.json"
);

testConversion(
  "Non-quantized Polygons",
  "polygon",
  "test/geojson/polygon-feature.json",
  "test/topojson/polygon-no-quantization.json"
);

testConversion(
  "Projected polygons (clockwise)",
  "clockwise",
  "test/geojson/polygon-feature-mercator.json",
  "test/topojson/polygon-mercator.json"
);

testConversion(
  "Projected polygons (counterclockwise)",
  "counterclockwise",
  "test/geojson/polygon-feature-mercator.json",
  "test/topojson/polygon-mercator.json"
);

function testConversion(testName, objectName, expectedName, topologyName) {
  var actualName = path.join(os.tmpdir(), tmpprefix + (++testId).toString(16) + ".json");
  tape(testName, function(test) {
    child.exec("bin/topo2geo " + objectName + "=" + actualName + " < " + topologyName, function(error) {
      if (error) throw error;
      var actual = JSON.parse(fs.readFileSync(actualName), "utf-8");
      fs.unlinkSync(actualName);
      test.inDelta(actual, JSON.parse(fs.readFileSync(expectedName, "utf-8")));
      test.end();
    });
  });
}
