const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
});

const writeStream = fs.createWriteStream(path.join(__dirname, "text.txt"));

console.log("Enter some text:");
rl.on("line", (input) => {
  if (input === "exit") {
    rl.close();
  } else writeStream.write(input);
});
rl.on("close", function () {
  console.log("\nThis is the end.");
  rl.close();
});

function exitHandler() {
  console.log("\nThis is the end.");
  process.exit();
}
process.on("SIGINT", exitHandler.bind());
