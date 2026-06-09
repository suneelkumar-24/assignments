const fs = require("fs");
const path = require("path");

let baseDir = __dirname;

let result = {
  html: [],
  js: [],
  programming: [],
  mysql: [], // Added MySQL category
};

// Function to extract number from filename for natural sorting
function extractNumber(filename) {
  const match = filename.match(/\d+/);
  if (match) {
    return parseInt(match[0]);
  }
  return null;
}

// Natural sort function for filenames (A-Z with proper number ordering)
function naturalSort(a, b) {
  // Get just the filename without path
  const fileNameA = path.basename(a);
  const fileNameB = path.basename(b);

  // Remove extension for better comparison
  const nameA = fileNameA.replace(/\.(html|txt)$/i, "");
  const nameB = fileNameB.replace(/\.(txt)$/i, "");

  // Use localeCompare for proper alphabetical sorting (A-Z)
  // This handles numbers naturally (1,2,3,10,11 correctly)
  return nameA.localeCompare(nameB, undefined, {
    numeric: true, // This ensures 2 comes before 10
    sensitivity: "base", // Case insensitive
    ignorePunctuation: true,
  });
}

// Sort programming files by name (A-Z)
function sortProgrammingByName(a, b) {
  const nameA = a.name.replace(/\.txt$/i, "");
  const nameB = b.name.replace(/\.txt$/i, "");
  return nameA.localeCompare(nameB, undefined, {
    numeric: true,
    sensitivity: "base",
    ignorePunctuation: true,
  });
}

function scanFolder(folderPath) {
  let items = fs.readdirSync(folderPath);

  items.forEach((item) => {
    let fullPath = path.join(folderPath, item);
    let stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanFolder(fullPath);
    } else {
      let relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");

      if (relativePath.includes("HTML Assignments") && item.endsWith(".html")) {
        result.html.push(relativePath);
      } else if (
        relativePath.includes("Javascript assignments") &&
        item.endsWith(".html")
      ) {
        result.js.push(relativePath);
      } else if (relativePath.includes("Progarmming Assignment")) {
        result.programming.push({
          name: item,
          path: relativePath,
        });
      }
      // Added condition for MySQL assignments
      else if (relativePath.includes("MySQL Assignment")) {
        result.mysql.push({
          name: item,
          path: relativePath,
        });
      }
    }
  });
}

// Scan all folders
scanFolder(baseDir);

// Sort HTML assignments in alphabetical order (A-Z)
console.log("📝 Sorting HTML assignments...");
result.html.sort(naturalSort);

// Sort JavaScript assignments in alphabetical order (A-Z)
console.log("📝 Sorting JavaScript assignments...");
result.js.sort(naturalSort);

// Sort Programming assignments alphabetically (A-Z)
console.log("📝 Sorting Programming files...");
result.programming.sort(sortProgrammingByName);

// Sort MySQL assignments alphabetically (A-Z)
console.log("📝 Sorting MySQL assignments...");
result.mysql.sort(sortProgrammingByName); // Reusing the same sorting function

// Write to data.json
fs.writeFileSync("data.json", JSON.stringify(result, null, 2));

console.log("\n✅ data.json generated successfully!");
console.log("\n📊 STATISTICS:");
console.log(`   📄 HTML Assignments: ${result.html.length} files`);
console.log(`   ⚡ JavaScript Tasks: ${result.js.length} files`);
console.log(`   💻 Programming Files: ${result.programming.length} files`);
console.log(`   🗄️  MySQL Files: ${result.mysql.length} files`); // Added MySQL stats

console.log("\n📋 FIRST 10 HTML FILES (Alphabetical Order):");
result.html.slice(0, 10).forEach((file, i) => {
  const fileName = path.basename(file);
  console.log(`   ${(i + 1).toString().padStart(2)}. ${fileName}`);
});

console.log("\n📋 FIRST 10 JAVASCRIPT FILES (Alphabetical Order):");
result.js.slice(0, 10).forEach((file, i) => {
  const fileName = path.basename(file);
  console.log(`   ${(i + 1).toString().padStart(2)}. ${fileName}`);
});
console.log("\n📋 ALL MYSQL FILES (Alphabetical Order):"); // Added MySQL listing
result.mysql.forEach((file, i) => {
  console.log(`   ${(i + 1).toString().padStart(2)}. ${file.name}`);
});
console.log("\n📋 ALL PROGRAMMING FILES (Alphabetical Order):");
result.programming.forEach((file, i) => {
  console.log(`   ${(i + 1).toString().padStart(2)}. ${file.name}`);
});

console.log("\n🎯 Sorting complete! Files are now in A-Z alphabetical order.");
