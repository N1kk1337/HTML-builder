const path = require("path");
const fs = require("fs");

async function setUp() {
  fs.promises
    .rm(path.join(__dirname, "project-dist"), {
      force: true,
      recursive: true,
    })
    .then(() => {
      fs.promises.mkdir(path.join(__dirname, "project-dist"), {
        recursive: true,
      });
    })
    .then(() => {
      bundleCss();
      copyDirectory(PATH_TO_COPY, projectFolder).catch(console.error);

      fs.promises
        .copyFile(
          path.join(__dirname, "template.html"),
          path.join(__dirname, "project-dist", "index.html")
        )
        .then(() => {
          replacePlaceholder();
        });
    });
}

async function bundleCss() {
  const PATH = path.join(__dirname, "styles");
  const BUNDLE_PATH = path.join(__dirname, "project-dist", "style.css");

  fs.promises.open(BUNDLE_PATH, "w").then(() => {
    fs.promises
      .readdir(PATH, { withFileTypes: true })
      .then(async (files) => {
        try {
          for (let file of files) {
            if (file.isFile() && path.parse(file.name).ext === ".css") {
              fs.readFile(
                path.join(PATH, file.name),
                "utf8",
                async (err, data) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  fs.appendFile(BUNDLE_PATH, data, function (err) {
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
  });
}

const PATH_TO_COPY = path.join(__dirname, "assets");
const projectFolder = path.join(__dirname, "project-dist", "assets");

async function copyDirectory(copyFrom, copyTo) {
  fs.promises.rm(copyTo, { force: true, recursive: true }).then(() => {
    fs.promises
      .mkdir(copyTo, {
        recursive: true,
      })
      .then(() => {
        makeCopy(copyFrom, copyTo);
      });
  });
}

function makeCopy(baseFolder, destinationPath) {
  fs.promises
    .readdir(baseFolder, { withFileTypes: true })
    .then(async (files) => {
      try {
        for (let file of files) {
          if (file.isFile()) {
            await fs.promises.copyFile(
              path.join(baseFolder, file.name),
              path.join(destinationPath, file.name)
            );
          } else {
            await copyDirectory(
              path.join(baseFolder, file.name),
              path.join(destinationPath, file.name)
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

async function replacePlaceholder() {
  let componentsArr = {};
  fs.promises
    .readdir(path.join(__dirname, "components"), { withFileTypes: true })
    .then(async (files) => {
      try {
        for (let file of files) {
          if (file.isFile() && path.parse(file.name).ext === ".html") {
            fs.readFile(
              path.join(
                __dirname,
                "components",
                path.parse(file.name).name + ".html"
              ),
              "utf8",
              function (err, htmlData) {
                if (err) {
                  return console.log(err);
                }
                componentsArr[path.parse(file.name).name] = htmlData;
              }
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    })
    .then(() => {
      fs.readFile(
        path.join(__dirname, "project-dist", "index.html"),
        "utf8",
        function (err, data) {
          if (err) {
            return console.log(err);
          }
          let result = data;
          for (const [key, value] of Object.entries(componentsArr)) {
            const regexp = new RegExp("{{" + key + "}}");
            result = result.replace(regexp, value);
          }

          fs.writeFile(
            path.join(__dirname, "project-dist", "index.html"),
            result,
            "utf8",
            function (err) {
              if (err) return console.log(err);
            }
          );
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
}

setUp();
