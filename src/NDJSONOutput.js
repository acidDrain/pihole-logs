const ndjson = require("ndjson");

const serialize = ndjson.serialize();

serialize.on("data", function(line) {
  // line is a line of stringified JSON with a newline delimiter at the end
  console.log(JSON.stringify(line));
});

serialize.write({ foo: "bar" });

serialize.end();
