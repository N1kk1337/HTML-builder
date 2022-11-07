const path = require("path");

const PATH = path.join(__dirname, "secret-folder");

const fs = require("fs");

fs.promises
  .readdir(PATH, { withFileTypes: true })

  .then(async (files) => {
    try {
      for (let file of files) {
        if (file.isFile()) {
          const stats = await fs.promises.stat(path.join(PATH, file.name));
          console.log(
            path.parse(file.name).name +
              " - " +
              path.parse(file.name).ext +
              " - " +
              stats.size +
              "b"
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
