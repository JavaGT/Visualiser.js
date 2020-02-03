const express = require("express");
const getPort = require("get-port");

const app = express();
(async () => {
  app.use("/visualiser/Visualiser.js", (req, res) =>
    res.sendFile("Visualiser.js", { root: __dirname })
  );
  app.use("/visualiser/layers", express.static("layers"));
  app.use("/visualiser/plugins", express.static("plugins"));
  app.use(express.static("development"));

  const port = await getPort({ port: [5000, 5050] });
  app.listen(port);
  console.log('Listening @ http://localhost:%s', port)
})();
