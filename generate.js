const fs = require("fs");
const path = require("path");

let baseDir = __dirname;

let result = {
  html: [],
  js: [],
  php: [],
  programming: [],
  mysql: [], 
  practical: [], // Added Practical category
  progressive: [], // Progressive Full-Stack Projects Pathway
};

const progressiveMap = {
  "p1_html_resume.html": "Level 1.1: Personal Resume & Profile Page [HTML]",
  "p1_html_form.html": "Level 1.2: Student Admission & Course Form [HTML]",
  "p1_html_table.html": "Level 1.3: Course Timetable & Fee Structure [HTML]",
  "p2_css_landing.html": "Level 2.1: Product Showcase Landing Page [HTML + CSS]",
  "p2_css_portfolio.html": "Level 2.2: Multi-Page Corporate Portfolio [HTML + CSS]",
  "p2_css_responsive.html": "Level 2.3: Responsive Web Layout & Media Queries [HTML + CSS]",
  "p3_js_quiz.html": "Level 3.1: Interactive Quiz & Grade Calculator [HTML + CSS + JS]",
  "p3_js_todo.html": "Level 3.2: Smart Task & Habit Planner (LocalStorage) [HTML + CSS + JS]",
  "p3_js_weather_api.html": "Level 3.3: Weather & Currency REST API App [HTML + CSS + JS]",
  "p4_php_portal.html": "Level 4.1: Dynamic Student Portal & File Uploader [HTML + CSS + JS + PHP]",
  "p4_php_auth.html": "Level 4.2: Secure Auth & Session Management System [HTML + CSS + JS + PHP]",
  "p5_fullstack_sms.html": "Level 5.1: Full-Stack Student Management System (SMS) [HTML + CSS + JS + PHP + MySQL]",
  "p5_fullstack_ecommerce.html": "Level 5.2: Complete E-Commerce Store & Admin Panel [HTML + CSS + JS + PHP + MySQL]"
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
      // Don't recursively scan version control or vscode dirs
      if (item !== ".git" && item !== ".vscode") {
        scanFolder(fullPath);
      }
    } else {
      let relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");

      if (relativePath.includes("HTML Assignments") && item.endsWith(".html")) {
        result.html.push(relativePath);
      } else if (
        relativePath.includes("Javascript assignments") &&
        item.endsWith(".html")
      ) {
        result.js.push(relativePath);
      } else if (
        relativePath.includes("PHP Assignments") &&
        item.endsWith(".html")
      ) {
        result.php.push(relativePath);
      }
      else if (relativePath.includes("Progarmming Assignment")) {
        result.programming.push({
          name: item,
          path: relativePath,
        });
      }
      // Added condition for MySQL assignments
      else if (relativePath.includes("MySQL Assignment")) {
        let displayName = item;
        if (item.endsWith(".html")) {
          try {
            const fileContent = fs.readFileSync(fullPath, "utf8");
            const titleMatch = fileContent.match(/<title>([^<]+)<\/title>/i);
            if (titleMatch && titleMatch[1]) {
              displayName = titleMatch[1].trim();
            }
          } catch (e) {
            console.error("Error reading file title:", e);
          }
        }
        result.mysql.push({
          name: displayName,
          path: relativePath,
        });
      }
      // Added condition for Practical & Progressive assignments
      else if (relativePath.includes("Practical Assignments") && item.endsWith(".html")) {
        if (item.startsWith("p1_") || item.startsWith("p2_") || item.startsWith("p3_") || item.startsWith("p4_") || item.startsWith("p5_")) {
          const displayName = progressiveMap[item] || item.replace(".html", "");
          result.progressive.push({
            name: displayName,
            path: relativePath,
          });
        } else {
          let displayName = item;
          try {
            const fileContent = fs.readFileSync(fullPath, "utf8");
            const titleMatch = fileContent.match(/<title>([^<]+)<\/title>/i);
            if (titleMatch && titleMatch[1]) {
              displayName = titleMatch[1].trim();
            }
          } catch (e) {
            console.error("Error reading file title:", e);
          }
          result.practical.push({
            name: displayName,
            path: relativePath,
          });
        }
      }
    }
  });
}

// Scan all folders
scanFolder(baseDir);

// Sort Progressive assignments (Level 1.1 to Level 5.2 in exact order)
console.log("📝 Sorting Progressive Pathway assignments...");
result.progressive.sort((a, b) => {
  const nameA = a.name || "";
  const nameB = b.name || "";
  return nameA.localeCompare(nameB, undefined, {
    numeric: true,
    sensitivity: "base",
    ignorePunctuation: true,
  });
});

// Sort HTML assignments in alphabetical order (A-Z)
console.log("📝 Sorting HTML assignments...");
result.html.sort(naturalSort);

// Sort JavaScript assignments in alphabetical order (A-Z)
console.log("📝 Sorting JavaScript assignments...");
result.js.sort(naturalSort);

// Sort PHP assignments in alphabetical order (A-Z)
console.log("📝 Sorting PHP assignments...");
result.php.sort(naturalSort);

// Sort Programming assignments alphabetically (A-Z)
console.log("📝 Sorting Programming files...");
result.programming.sort(sortProgrammingByName);

// Sort MySQL assignments alphabetically (A-Z)
console.log("📝 Sorting MySQL assignments...");
result.mysql.sort(sortProgrammingByName); // Reusing the same sorting function

// Sort Practical assignments alphabetically (A-Z)
console.log("📝 Sorting Practical assignments...");
result.practical.sort(sortProgrammingByName);

// Function to inject download button script/style into assignment html pages
function injectDownloadButtons() {
  console.log("\n📦 Injecting floating download buttons into HTML files...");
  
  const buttonHtml = `
<!-- Floating Download Button -->
<div id="assignment-download-btn-container" style="position: fixed; bottom: 20px; right: 20px; z-index: 999999; font-family: system-ui, -apple-system, sans-serif;">
  <button onclick="downloadCurrentAssignmentFile()" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #38bdf8, #a855f7); color: white; border: none; padding: 12px 18px; border-radius: 50px; font-weight: 600; cursor: pointer; box-shadow: 0 10px 25px rgba(56, 189, 248, 0.4), inset 0 1px 0 rgba(255,255,255,0.2); transition: all 0.3s ease; font-size: 14px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
    Download File
  </button>
</div>
<script>
  function downloadCurrentAssignmentFile() {
    const url = window.location.href;
    const filename = url.substring(url.lastIndexOf('/') + 1) || 'assignment.html';
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(err => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }
</script>
`;

  let count = 0;

  function processPath(p) {
    const relativePath = typeof p === "string" ? p : p.path;
    if (!relativePath.endsWith(".html")) return;
    
    // Ignore main landing files
    const baseName = path.basename(relativePath);
    if (baseName.startsWith("index") || baseName.startsWith("ass")) {
      return;
    }
    
    const fullPath = path.join(baseDir, relativePath);
    if (!fs.existsSync(fullPath)) return;
    
    try {
      let content = fs.readFileSync(fullPath, "utf8");
      if (!content.includes('id="assignment-download-btn-container"')) {
        if (content.includes("</body>")) {
          content = content.replace("</body>", buttonHtml + "\n</body>");
        } else {
          content = content + "\n" + buttonHtml;
        }
        fs.writeFileSync(fullPath, content, "utf8");
        count++;
      }
    } catch (err) {
      console.error(`Error injecting into ${relativePath}:`, err);
    }
  }

  result.progressive.forEach(processPath);
  result.html.forEach(processPath);
  result.js.forEach(processPath);
  result.php.forEach(processPath);
  result.mysql.forEach(processPath);
  result.practical.forEach(processPath);

  console.log(`✅ Injected download buttons into ${count} HTML files.`);
}

// Inject buttons
injectDownloadButtons();

// Write to data.json
fs.writeFileSync("data.json", JSON.stringify(result, null, 2));

// Write to data.js (to bypass CORS on file:// protocol)
fs.writeFileSync("data.js", `window.assignmentsData = ${JSON.stringify(result, null, 2)};`);

console.log("\n✅ data.json and data.js generated successfully!");
console.log("\n📊 STATISTICS:");
console.log(`   🚀 Progressive Pathway: ${result.progressive.length} files`);
console.log(`   📄 HTML Assignments: ${result.html.length} files`);
console.log(`   ⚡ JavaScript Tasks: ${result.js.length} files`);
console.log(`   🐘 PHP Tasks: ${result.php.length} files`);
console.log(`   💻 Programming Files: ${result.programming.length} files`);
console.log(`   🗄️  MySQL Files: ${result.mysql.length} files`); 
console.log(`   🧪 Practical Files: ${result.practical.length} files`); // Added Practical stats

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
