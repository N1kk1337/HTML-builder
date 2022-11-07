const path = require("path");
const fs = require("fs");

fs.promises.rm(path.join(__dirname, "project - dist"), {
  force: true,
  recursive: true,
});
const projectDistFolder = fs.promises.mkdir(
  path.join(__dirname, "project-dist"),
  {
    recursive: true,
  }
);

const PATH = path.join(__dirname, "styles");
const BUNDLE_PATH = path.join(__dirname, "project-dist", "style.css");

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

const PATH_TO_COPY = path.join(__dirname, "assets");
const projectFolder = path.join(__dirname, "project-dist", "assets");

async function copyDirectory(copyFrom, copyTo) {
  await fs.promises.rm(copyTo, { force: true, recursive: true });
  const dirCreation = await fs.promises.mkdir(copyTo, {
    recursive: true,
  });
  makeCopy(copyTo, copyFrom);

  return dirCreation;
}

async function makeCopy(baseFolder, destinationPath) {
  fs.promises
    .readdir(destinationPath, { withFileTypes: true })
    .then(async (files) => {
      try {
        for (let file of files) {
          if (file.isFile()) {
            await fs.promises.copyFile(
              path.join(destinationPath, file.name),
              path.join(baseFolder, file.name)
            );
          } else {
            await copyDirectory(
              path.join(destinationPath, file.name),
              path.join(baseFolder, file.name)
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
}

copyDirectory(PATH_TO_COPY, projectFolder).catch(console.error);
