#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

console.log("🔍 Validating AI-SDLC Setup...\n");

const checks = [
  {
    name: "Git Hooks",
    command: "ls .git/hooks/pre-commit",
    success: "Pre-commit hooks installed",
  },
  {
    name: "ESLint",
    command: "npx eslint --version",
    success: "ESLint available",
  },
  {
    name: "Prettier",
    command: "npx prettier --version",
    success: "Prettier available",
  },
  {
    name: "Husky",
    command: "npx husky --version",
    success: "Husky available",
  },
];

// File existence checks
const fileChecks = [
  { file: ".clinerules", name: "Cline Rules Configuration" },
  { file: ".clinerules_modular", name: "Modular Cline Rules", isDirectory: true },
  { file: "cline_config", name: "Cline Configuration Directory", isDirectory: true },
  { file: "cline_templates", name: "Cline Templates Directory", isDirectory: true },
  { file: "cline_config/multi-model-strategy.json", name: "Multi-Model AI Strategy" },
];

let passed = 0;
const total = checks.length + fileChecks.length;

// Command checks
checks.forEach((check) => {
  try {
    execSync(check.command, { stdio: "ignore" });
    console.log(`✅ ${check.success}`);
    passed++;
  } catch {
    console.log(`❌ ${check.name} not properly configured`);
  }
});

// File existence checks
fileChecks.forEach((check) => {
  try {
    const exists = check.isDirectory ? fs.statSync(check.file).isDirectory() : fs.statSync(check.file).isFile();

    if (exists) {
      console.log(`✅ ${check.name} configured`);
      passed++;
    } else {
      console.log(`❌ ${check.name} missing`);
    }
  } catch {
    console.log(`❌ ${check.name} missing`);
  }
});

console.log(`\n📊 Validation Results: ${passed}/${total} checks passed`);

if (passed === total) {
  console.log("🎉 All systems ready for AI-powered development!");
  console.log("🧠 Cline AI configuration with 97% cost reduction strategy active");
} else {
  console.log("⚠️  Some components need attention. Check documentation.");
}
