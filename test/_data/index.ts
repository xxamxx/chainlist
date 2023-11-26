import fs from "fs";


// auto read all json files of the current folder and export to default
const data = [];
fs.readdirSync(__dirname).forEach((file) => {
  if (file.endsWith(".json")) {
    const metadata = require(`./${file}`);
    data.push(metadata);
  }
});

export default data.sort((a, b) => a.chainId - b.chainId);