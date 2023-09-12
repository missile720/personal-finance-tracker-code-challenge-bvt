if (process.argv.length !== 5) {
    console.error("Error: Incorrect number of arguments")
    console.log("Usage: node addToLedger.js <Item name> <Item category> <Amount>");
    process.exit(1);
}

const item = process.argv[2];
const category = process.argv[3];
const amount = parseFloat(process.argv[4]);

if (isNaN(amount) || (amount * 100) % 1 !== 0) {
    console.log("Amount must be a decimal with two points of precision (e.g., $5.99).");
    process.exit(1);
}

console.log("Item Name:", item);
console.log("Item Category:", category);
console.log("Amount:", amount.toFixed(2));