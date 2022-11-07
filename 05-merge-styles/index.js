const path = require("path");
const fs = require("fs");

const PATH = path.join(__dirname, "styles");
const BUNDLE_PATH = path.join(__dirname, "project-dist", "bundle.css");

fs.open(BUNDLE_PATH, "w", (err, file) => {
  if (err) {
    throw err;
  }
});

fs.promises
  .readdir(PATH, { withFileTypes: true })
  .then(async (files) => {
    try {
      for (let file of files) {
        if (file.isFile() && path.parse(file.name).ext === ".css") {
          await fs.readFile(
            path.join(PATH, file.name),
            "utf8",
            async (err, data) => {
              if (err) {
                console.error(err);
                return;
              }
              await fs.appendFile(BUNDLE_PATH, data, function (err) {
                if (err) return console.log(err);
              });
            }
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  })
  .catch((err) => {
    console.log(err);
  });

//bundle.css
