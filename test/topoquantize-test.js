var fs = require("fs"),
    child = require("child_process"),
    tape = require("tape");

testCommand(
  "topoquantize 1e4 < test/topojson/polygon.json",
  "test/topojson/polygon-q1e4.json"
);

testCommand(
  "topoquantize 1e5 < test/topojson/polygon.json",
  "test/topojson/polygon-q1e5.json"
);

testCommand(
  "topoquantize 1e4 < test/topojson/polygon-mercator.json",
  "test/topojson/polygon-mercator-q1e4.json"
);

testCommand(
  "topoquantize 1e5 < test/topojson/polygon-mercator.json",
  "test/topojson/polygon-mercator-q1e5.json"
);

testCommand(
  "topoquantize 1e5 < test/topojson/point.json",
  "test/topojson/point-q1e5.json"
);

testCommand(
  "topoquantize 1e5 < test/topojson/points.json",
  "test/topojson/points-q1e5.json"
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
