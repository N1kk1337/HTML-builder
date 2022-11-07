const fs = require("fs");
const path = require("path");

const PATH = path.join(__dirname, "files");

async function copyDirectory() {
  const projectFolder = PATH + "-copy";
  await fs.promises.rm(projectFolder, { force: true, recursive: true });
  const dirCreation = await fs.promises.mkdir(projectFolder, {
    recursive: true,
  });
  makeCopy(projectFolder);

  return dirCreation;
}

async function makeCopy(baseFolder) {
  fs.promises
    .readdir(PATH, { withFileTypes: true })
    .then(async (files) => {
      try {
        for (let file of files) {
          if (file.isFile()) {
            await fs.promises.copyFile(
              path.join(PATH, file.name),
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

copyDirectory().catch(console.error);
