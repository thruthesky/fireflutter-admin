const fs = require("fs");

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync("./tmp/sonub.key"),
      cert: fs.readFileSync("./tmp/sonub.cert")
    },
    host: "vue.sonub.com"
  }
};
