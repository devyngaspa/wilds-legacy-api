var repl    = require("repl");
var envName = process.env.NODE_ENV || "dev";

var server = repl.start({
  prompt: "Wilds (" + envName + ") > ",
});
