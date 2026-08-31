// Task Hint Helper: Injects Floating Hint Button & Modal for JavaScript Practice Tasks
(function() {
  const TASK_HINTS = {
    "task0-0": {
      title: "Task 0-0: 100 JS Beginner Fundamentals",
      logic: "Covering document.write, HTML outputs, variables, string concatenation, and math operations.",
      clue: `// Key Formulas:
document.write("Hello <br>");
let name = "Ali"; document.write("My name is " + name);
document.write(10 + 5); // 15
document.getElementById("a").style.color = "red";`,
      tip: "Open task0-0.html directly to view all 100 questions with individual search and clues!"
    },
    "task0-1": {
      title: "Task 0-1: 100 Practice Programs",
      logic: "Mastering button clicks, inputs, arithmetic, modulus, conditions, and DOM styles across 100 programs.",
      clue: `// Key Formulas:
let val = document.getElementById("in").value;
let square = Number(val) * Number(val);
if (Number(val) % 2 === 0) { /* Even */ }
element.style.color = "red";
str.toUpperCase();`,
      tip: "Open task0-1.html to search any of the 100 questions (Q1 to Q100) and reveal its individual logic clue!"
    },
    "task0-2": {
      title: "Task 0-2: 100 Intermediate Exercises",
      logic: "Covering compound conditions, loops, arrays, objects, functions, and interactive DOM widgets.",
      clue: `// Key Formulas:
if (num % 2 === 0 && num > 10) { ... }
for(let i=1; i<=10; i++) { ... }
let evens = arr.filter(n => n % 2 === 0);
function isPalindrome(s) { return s === s.split('').reverse().join(''); }`,
      tip: "Open task0-2.html to search questions on arrays, loops, objects, and functions with individual clues!"
    },
    "task0-3": {
      title: "Task 0-3: 100 Logic & Algorithms",
      logic: "100 logic puzzles, conditionals, algorithmic problem-solving tasks, and nested structures.",
      clue: `// Key Formulas:
if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) // Leap
if (a + b + c === 180) // Valid Triangle
Math.floor(distance / fuelLiters) // Mileage`,
      tip: "Open task0-3.html to explore all 100 algorithmic challenges with step-by-step logic clues!"
    },
    "task1": {
      title: "Task 1: Birth Year Finder",
      logic: "Prompt the user for Name and Age, subtract Age from current year 2026, and display via alert() and console.log().",
      clue: `let name = prompt("Enter name:");
let age = Number(prompt("Enter age:"));

// Subtract age from 2026:
let birthYear = 2026 - age;

alert("Hello " + name + ", you were born in " + birthYear + ".");`,
      tip: "prompt() returns a string; wrap with Number() before subtraction!"
    },
    "task2": {
      title: "Task 2: Even or Odd Checker",
      logic: "Read input value, compute remainder using modulus operator % 2, and update DOM result text.",
      clue: `let num = Number(document.getElementById("num").value);

if (num % 2 === 0) {
    document.getElementById("result").innerHTML = "Even Number";
} else {
    document.getElementById("result").innerHTML = "Odd Number";
}`,
      tip: "Even numbers leave a remainder of 0 when divided by 2 (num % 2 === 0)."
    },
    "task3": {
      title: "Task 3: Color Changer & Voter Eligibility",
      logic: "Change background color dynamically or verify if age >= 18; otherwise calculate remaining wait years (18 - age).",
      clue: `// 1. Color change:
document.body.style.backgroundColor = "yellow";

// 2. Voter eligibility:
let age = Number(prompt("Enter age:"));
if (age >= 18) {
    alert("Eligible to vote!");
} else {
    alert("Must wait " + (18 - age) + " more years.");
}`,
      tip: "You can modify any CSS style via element.style.propertyName in JavaScript."
    },
    "task4": {
      title: "Task 4: Smart Calculator",
      logic: "Perform addition, subtraction, multiplication, and guard against division by zero (if b === 0).",
      clue: `function div() {
    let a = Number(document.getElementById("num1").value);
    let b = Number(document.getElementById("num2").value);
    if (b === 0) {
        document.getElementById("result").innerHTML = "Cannot divide by zero";
    } else {
        document.getElementById("result").innerHTML = "Result: " + (a / b);
    }
}`,
      tip: "Always check division divisor to avoid infinite or NaN output bugs."
    },
    "task5": {
      title: "Task 5: Grade Evaluator",
      logic: "Check marks from highest to lowest: >=80 (Grade A), >=60 (Grade B), >=40 (Grade C), else (Fail).",
      clue: `let marks = Number(document.getElementById("marks").value);

if (marks >= 80) {
    // Grade A
} else if (marks >= 60) {
    // Grade B
} else if (marks >= 40) {
    // Grade C
} else {
    // Fail
}`,
      tip: "Evaluate conditions in descending order so highest thresholds match first."
    },
    "task5-1": {
      title: "Task 5-1: Grade Evaluator Variant",
      logic: "Evaluate score against stepped percentage thresholds (90+, 80+, 70+).",
      clue: `if (score >= 90) alert("Grade A+ (Distinction)");
else if (score >= 80) alert("Grade A");
else if (score >= 70) alert("Grade B");
else alert("Grade C");`,
      tip: "Match boundaries strictly to your assignment requirements."
    },
    "task5-2": {
      title: "Task 5-2: Attendance & Exam Qualification",
      logic: "Combine two requirements with logical AND: marks >= 50 AND attendance >= 75.",
      clue: `if (marks >= 50 && attendance >= 75) {
    alert("Eligible for Final Exam ✅");
} else {
    alert("Not Eligible ❌");
}`,
      tip: "Both conditions must be true when using &&."
    },
    "task6": {
      title: "Task 6: Portal Gatekeeper",
      logic: "Prompt for username and password. Grant access only if username === 'admin' && password === 'pass123'.",
      clue: `if (user === "admin" && pass === "pass123") {
    alert("Access Granted!");
} else {
    alert("Access Denied!");
}`,
      tip: "Use strict equality === for exact matches."
    },
    "task7": {
      title: "Task 7: Weekend Detector",
      logic: "Prompt for day name. Check if day === 'Saturday' || day === 'Sunday' using logical OR.",
      clue: `let day = prompt("Enter day:").toLowerCase();
if (day === "saturday" || day === "sunday") {
    console.log("It's the weekend! Relax!");
} else {
    console.log("It's a weekday.");
}`,
      tip: "Using .toLowerCase() avoids uppercase mismatches."
    },
    "task8": {
      title: "Task 8: Bill Discount Guard",
      logic: "Set limit = 100. Use logical NOT !(bill < limit) to verify bill >= 100, then subtract 15 using bill -= 15.",
      clue: `const limit = 100;
let bill = Number(prompt("Enter bill:"));

if (!(bill < limit)) {
    bill -= 15; // Deduct $15 discount
}
alert("Final Total: $" + bill);`,
      tip: "!(bill < 100) is equivalent to bill >= 100."
    },
    "task9": {
      title: "Task 9: Ticket Pricing Advisor",
      logic: "Under 12: $5; 65+: $8. For 12-64: nested check: if student -> $10, else -> $15.",
      clue: `if (age < 12) {
    price = 5;
} else if (age >= 65) {
    price = 8;
} else {
    if (isStudent === "yes") price = 10;
    else price = 15;
}`,
      tip: "Nested conditions allow clean sub-grouping."
    },
    "task10": {
      title: "Task 10: Even/Odd Classifier",
      logic: "Prompt for a number and log whether it is even or odd to console.",
      clue: `let num = Number(prompt("Enter number:"));
if (num % 2 === 0) {
    console.log(num + " is Even");
} else {
    console.log(num + " is Odd");
}`,
      tip: "Modulus % 2 yields remainder 0 for even integers."
    },
    "task11": {
      title: "Task 11: Number Guessing Game",
      logic: "Store secret = 7. Compare guess === secret (Won), guess > secret (Too high), else (Too low).",
      clue: `const secret = 7;
let guess = Number(prompt("Guess 1-10:"));

if (guess === secret) alert("🎉 Won!");
else if (guess > secret) alert("📈 Too High!");
else alert("📉 Too Low!");`,
      tip: "Use const for fixed game parameters."
    },
    "task12": {
      title: "Task 12: Electricity Bill Slabs",
      logic: "Stepped pricing: 0-100: units*5; 101-200: (100*5)+((units-100)*8); >200: (100*5)+(100*8)+((units-200)*12).",
      clue: `if (units <= 100) total = units * 5;
else if (units <= 200) total = (100 * 5) + ((units - 100) * 8);
else total = (100 * 5) + (100 * 8) + ((units - 200) * 12);`,
      tip: "Each tier only charges for consumption inside its range."
    },
    "task13": {
      title: "Task 13: ATM & Purchase Gateway",
      logic: "Verify PIN === 5588. ATM check: (amt <= balance && amt <= 2000 && amt % 10 === 0). SHOP check: senior/VIP discount.",
      clue: `// 1. PIN verification
// 2. ATM: amt <= balance && amt <= 2000 && amt % 10 === 0
// 3. SHOP: age >= 60 || coupon === "VIP"`,
      tip: "Multiples of 10 are verified via amt % 10 === 0."
    },
    "task14": {
      title: "Task 14: Cart & Shipping Calculator",
      logic: "Subtotal = price * qty. Gold (20%), VIP (10%), subtotal >= 200 (+5%). Free shipping if subtotal > 300 or Gold, else distance * 2.",
      clue: `let subtotal = price * qty;
// Calculate discount based on tier
// Deduct $15 if coupon === "SAVEMORE"
// Free shipping if subtotal > 300 or Gold`,
      tip: "Apply discount to subtotal before adding shipping charges."
    },
    "task15": {
      title: "Task 15: Utility Bill Calculator",
      logic: "Tiered commercial/residential tariffs. Surcharge: if commercial && units > 500 add 20%. Add $50 connection fee.",
      clue: `// Slabs calculation:
if (type === "commercial" && units > 500) cost *= 1.20;
let total = cost + 50;`,
      tip: "Use arithmetic assignment *= to apply percentage surcharges."
    },
    "task16": {
      title: "Task 16: Leap Year & Century Detector",
      logic: "Century: year % 100 === 0. Leap: (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0). Era: relative to 2026.",
      clue: `let isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
let isCentury = (year % 100 === 0);
let era = year < 2026 ? "Past" : (year === 2026 ? "Present" : "Future");`,
      tip: "Century years must be divisible by 400 to be leap years."
    },
    "task17": {
      title: "Task 17: Rock Paper Scissors Game",
      logic: "Compare player and random CPU choices. Check tie, win combos, and update persistent scores.",
      clue: `const options = ["rock", "paper", "scissors"];
let cpu = options[Math.floor(Math.random() * 3)];
// Tie: player === cpu
// Win: rock beats scissors || paper beats rock || scissors beats paper`,
      tip: "Math.floor(Math.random() * 3) yields 0, 1, or 2 randomly."
    },
    "task18": {
      title: "Task 18: Temperature & Weather Advisor",
      logic: "Convert to Celsius: (F - 32) * 5 / 9. Classify: >=38 (Hot), >=22 (Comfortable), >=5 (Cool), <5 (Freezing).",
      clue: `let c = (scale === "F") ? (temp - 32) * 5 / 9 : temp;
if (c >= 38) alert("🔥 Extreme Heat");
else if (c >= 22) alert("☀️ Pleasant");
else if (c >= 5) alert("🧥 Cool");
else alert("❄️ Freezing Frost");`,
      tip: "Use .toFixed(1) to format floating point temperature."
    },
    "task19": {
      title: "Task 19: Grade & GPA Calculator",
      logic: "Average = (m + s + e) / 3. Fail if any subject < 40. Else Distinction (>=90), Grade B (>=80), Grade C (>=70).",
      clue: `let avg = (m + s + e) / 3;
if (m < 40 || s < 40 || e < 40) {
    alert("Fail in individual subject");
} else if (avg >= 90) {
    alert("Distinction Grade A");
}`,
      tip: "Check minimum passing score before calculating average."
    },
    "task20": {
      title: "Task 20: Salary Tax Calculator",
      logic: "Apply region tax rate, add 3% surcharge if gross > 10000, and deduct $120 health insurance.",
      clue: `let taxRate = (region === "US") ? (gross <= 3000 ? 0.10 : (gross <= 8000 ? 0.20 : 0.30)) : 0.20;
if (gross > 10000) taxRate += 0.03;
let net = gross - (gross * taxRate) - 120;`,
      tip: "Apply tax percentage to gross before fixed deductions."
    },
    "task21": {
      title: "Task 21: Logical Gateway Challenge",
      logic: "PIN authentication gatekeeper. Branch for ATM and SHOP calculations, update DOM display status with colors.",
      clue: `if (enteredPin !== 5588) {
    document.getElementById("display").innerHTML = "STATUS: LOCKED OUT";
} else {
    // Process ATM or SHOP logic and update UI
}`,
      tip: "Capstone task uniting variables, operators, conditions, and DOM!"
    }
  };

  function getCurrentTaskKey() {
    const path = window.location.pathname.toLowerCase();
    const filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
    if (filename in TASK_HINTS) return filename;
    const match = filename.match(/task\d+(-\d+)?/);
    if (match && match[0] in TASK_HINTS) return match[0];
    return "task1";
  }

  function injectFloatingElements() {
    const key = getCurrentTaskKey();
    const hintData = TASK_HINTS[key] || TASK_HINTS["task1"];

    // Remove old container if present
    const oldContainer = document.getElementById("assignment-download-btn-container");
    if (oldContainer) oldContainer.remove();

    // Create Action Container
    const container = document.createElement("div");
    container.id = "assignment-floating-container";
    container.style.cssText = "position: fixed; bottom: 20px; right: 20px; z-index: 999999; font-family: system-ui, -apple-system, sans-serif; display: flex; gap: 10px; align-items: center;";

    // Hint Button
    const hintBtn = document.createElement("button");
    hintBtn.innerHTML = "💡 Need Hint?";
    hintBtn.style.cssText = "display: flex; align-items: center; justify-content: center; gap: 6px; background: rgba(15, 23, 42, 0.92); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.5); padding: 12px 18px; border-radius: 50px; font-weight: 600; cursor: pointer; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4); font-size: 14px; backdrop-filter: blur(10px); transition: all 0.2s;";
    hintBtn.onclick = toggleFloatingHintModal;

    // Download Button
    const downloadBtn = document.createElement("button");
    downloadBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download File`;
    downloadBtn.style.cssText = "display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #38bdf8, #a855f7); color: white; border: none; padding: 12px 18px; border-radius: 50px; font-weight: 600; cursor: pointer; box-shadow: 0 10px 25px rgba(56, 189, 248, 0.4), inset 0 1px 0 rgba(255,255,255,0.2); transition: all 0.3s ease; font-size: 14px;";
    downloadBtn.onclick = downloadCurrentAssignmentFile;

    container.appendChild(hintBtn);
    container.appendChild(downloadBtn);
    document.body.appendChild(container);

    // Create Modal
    const modal = document.createElement("div");
    modal.id = "taskFloatingHintModal";
    modal.style.cssText = "display: none; position: fixed; inset: 0; background: rgba(2, 6, 23, 0.85); backdrop-filter: blur(8px); z-index: 1000000; align-items: center; justify-content: center; padding: 20px; font-family: system-ui, -apple-system, sans-serif;";
    modal.onclick = (e) => { if (e.target === modal) toggleFloatingHintModal(); };

    modal.innerHTML = `
      <div style="background: #0f172a; border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 20px; max-width: 540px; width: 100%; color: #f8fafc; padding: 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); position: relative; max-height: 90vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.15rem; color: #fbbf24; display: flex; align-items: center; gap: 8px;">
              💡 ${hintData.title}
            </h3>
            <span style="font-size: 0.78rem; color: #94a3b8;">Step-by-Step Logic Guidance</span>
          </div>
          <button onclick="document.getElementById('taskFloatingHintModal').style.display='none'" style="background: rgba(255,255,255,0.1); border: none; color: #cbd5e1; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">✕</button>
        </div>
        <div style="font-size: 0.88rem; line-height: 1.55; color: #cbd5e1; display: flex; flex-direction: column; gap: 10px;">
          <p><strong>🎯 Objective / Logic:</strong> ${hintData.logic}</p>
          <div>
            <strong>🔑 Starter Blueprint / Clue:</strong>
            <pre style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 10px 12px; font-family: 'Fira Code', monospace, Consolas; font-size: 0.78rem; color: #38bdf8; margin-top: 6px; white-space: pre-wrap; word-break: break-word;">${hintData.clue}</pre>
          </div>
          <div style="background: rgba(56, 189, 248, 0.1); border-left: 3px solid #38bdf8; padding: 8px 12px; border-radius: 4px; font-size: 0.8rem; color: #94a3b8;">
            ⚠️ <strong>Pro-Tip:</strong> ${hintData.tip}
          </div>
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px;">
          <a href="roadmap_assignments.html" style="color: #38bdf8; text-decoration: none; font-size: 0.85rem; font-weight: 600;">🗺️ Full Roadmap</a>
          <button onclick="document.getElementById('taskFloatingHintModal').style.display='none'" style="background: #38bdf8; color: #020617; border: none; padding: 8px 20px; border-radius: 50px; font-weight: 700; cursor: pointer;">Got It!</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  function toggleFloatingHintModal() {
    const modal = document.getElementById("taskFloatingHintModal");
    if (!modal) return;
    modal.style.display = (modal.style.display === "flex") ? "none" : "flex";
  }

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

  window.toggleTaskFloatingHint = toggleFloatingHintModal;
  window.downloadCurrentAssignmentFile = downloadCurrentAssignmentFile;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectFloatingElements);
  } else {
    injectFloatingElements();
  }
})();
