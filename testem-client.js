var testemNode = require("testem-node");

testemNode({
    port: 7357
    , host: "localhost"
    , command: "tap"
    , args: ["--tap", "test"]
});