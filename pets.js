const fs = require("fs");
const subcommand = process.argv[2];

switch (subcommand) {
  case "read":
    const index = process.argv[3];
    fs.readFile("./pets.json", "utf-8", (err, data) => {
      if (err) {
        throw err;
      }
      const parsedData = JSON.parse(data);
      if (process.argv[3] === undefined) {
        console.log(parsedData);
      } else if (index >= 0 && index < parsedData.length) {
        console.log(parsedData[index]);
      } else {
        console.error("Usage: node pets.js read INDEX");
        process.exit(2);
      }
    });
    break;
  case "create":
    fs.readFile("./pets.json", "utf-8", (err, data) => {
      if (err) {
        throw err;
      }
      const pets = JSON.parse(data);
      const age = Number.parseInt(process.argv[3]);
      const kind = process.argv[4];
      const name = process.argv[5];
      let object = {};

      if (
        process.argv[3] === undefined &&
        name === undefined &&
        kind === undefined &&
        age === undefined
      ) {
        console.log(pets);
      }
      object.age = age;
      object.name = name;
      object.kind = kind;
      pets.push(object);
      console.log(pets);
    });
    break;
  case "update":
    console.log("Update");
    break;
  case "destroy":
    console.log("Obliterate");
    break;
  default:
    console.error("Usage: node pets.js [read | create | update | destroy]");
    process.exit(1);
}
