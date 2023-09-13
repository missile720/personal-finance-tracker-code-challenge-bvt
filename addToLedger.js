const Decimal = require('decimal.js');

if (process.argv.length !== 5) {
  console.error("Error: Incorrect number of arguments");
  console.log(
    "Usage: node addToLedger.js <Item name> <Item category> <Amount>"
  );
  process.exit(1);
}

//access terminal arguments
const item = process.argv[2];
const category = process.argv[3];
const amount = new Decimal(process.argv[4]);

if (isNaN(amount) || (amount.times(100)) % 1 !== 0) {
  console.log(
    "Amount must be a decimal with two points of precision (e.g., $5.99)."
  );
  process.exit(1);
}

const fs = require("fs");
const filename = "./sample-data/GeneralLedger.json";

try {
  const existingData = JSON.parse(fs.readFileSync(filename, "utf8"));
  console.log(existingData.items)

  //create current time in specified format
  const currentTime = new Date();
  const year = currentTime.getUTCFullYear();
  const month = String(currentTime.getUTCMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(currentTime.getUTCDate()).padStart(2, "0");
  const hours = String(currentTime.getUTCHours()).padStart(2, "0");
  const minutes = String(currentTime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(currentTime.getUTCSeconds()).padStart(2, "0");

  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const newData = {
    name: item,
    category,
    amount,
    timestamp: formattedTime,
  };

  existingData.items.push(newData);

  fs.writeFileSync(filename, JSON.stringify(existingData, null, 2), "utf8");
  console.log("Data added to the JSON file successfully.");
} catch (err) {
  console.error("Error:", err);
}