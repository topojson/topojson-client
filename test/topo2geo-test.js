var fs = require("fs"),
    child = require("child_process"),
    tape = require("tape");

testCommand(
  "topo2geo polygon=- < test/topojson/polygon.json",
  "test/geojson/polygon.json"
);

testCommand(
  "topo2geo polygon=- < test/topojson/polygon-q1e4.json",
  "test/geojson/polygon.json"
);

testCommand(
  "topo2geo polygon=- < test/topojson/polygon-q1e5.json",
  "test/geojson/polygon.json"
);

testCommand(
  "topo2geo polygon=- < test/topojson/polygon-mercator.json",
  "test/geojson/polygon-mercator.json"
);

testCommand(
  "topo2geo polygon=- < test/topojson/polygon-mercator-q1e4.json",
  "test/geojson/polygon-mercator.json"
);

testCommand(
  "topo2geo polygon=- < test/topojson/polygon-mercator-q1e5.json",
  "test/geojson/polygon-mercator.json"
);

function testCommand(command, expectedName) {
  tape(command, function(test) {
    child.exec("bin/" + command, function(error, stdout) {
      if (error) throw error;
      test.deepEqual(JSON.parse(stdout), JSON.parse(fs.readFileSync(expectedName)));
      test.end();
    });
  });
}
