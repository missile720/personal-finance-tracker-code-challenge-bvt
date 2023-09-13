const { program } = require("commander"); //npm library for reading flags
const Decimal = require("decimal.js"); //library to handle decimal arithmetic
const fs = require("fs");
const filename = "./sample-data/GeneralLedger.json";

// Define a function to filter data based on the category and time interval if given
function filterDataByCategoryAndInterval(data, category, interval) {
  const now = new Date();
  const intervalMap = { d: "days", m: "months", y: "years" };

  // Validate the interval
  if (interval < 0) {
    console.error("Error: Negative interval values are not allowed.");
    process.exit(1);
  }

  const cutoffDate = new Date(now.getTime() - interval * 24 * 60 * 60 * 1000);

  return data.filter((entry) => {
    if (category && entry.category !== category) {
      return false; // Category doesn't match, exclude this entry
    }

    if (entry.timestamp) {
      const entryDate = new Date(entry.timestamp);
      if (entryDate < cutoffDate) {
        return false; // Date is before the cutoff, exclude this entry
      }
    }

    return true;
  });
}

program
  .version("1.0.0")
  .description(
    "Generate a summary of general ledger data based on category and time interval"
  )
  .option("-c, --category <category>", "Item category")
  .option("-i, --interval <interval>", "Time interval (e.g., 30d, 3m, 2y)")
  .parse(process.argv);

const category = program._optionValues.category || "";
const intervalStr = program._optionValues.interval || "";

// Parse the interval string (e.g., "30d" => interval = 30, unit = "d")
const interval = parseInt(intervalStr);
const unit = intervalStr.slice(-1);

// Validate the unit if exists
if (unit) {
  if (!["d", "m", "y"].includes(unit)) {
    console.error(
      "Error: Invalid interval unit. Use 'd' for days, 'm' for months, or 'y' for years."
    );
    process.exit(1);
  }
}

// Read the general ledger data (assuming it's in a JSON file)
try {
  const ledgerData = JSON.parse(fs.readFileSync(filename, "utf8"));

  // Filter and print the summary
  const filteredData = filterDataByCategoryAndInterval(
    ledgerData.items,
    category,
    interval
  );

  console.log(
    `Summary for ${category || "ledger"}${
      unit ? ` in the last ${interval}${unit}` : ""
    }:`
  );

  console.log(filteredData);

  //Add each item into its respective category
  const categoryMap = {};

  filteredData.forEach((entry) => {
    const category = entry.category;
    const amount = new Decimal(entry.amount);

    if (!categoryMap[category]) {
      categoryMap[category] = new Decimal(0);
    }

    categoryMap[category] = categoryMap[category].plus(amount);
  });

  for (const category in categoryMap) {
    console.log(`${category} - ${categoryMap[category]}`);
  }
} catch (err) {
  console.error("Error: Unable to read or parse the general ledger data file.");
  process.exit(1);
}
