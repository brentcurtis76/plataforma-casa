#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Read reports from command line argument or default location
const reportsFile = process.argv[2] || 'dev-reports.json';

try {
  const data = fs.readFileSync(reportsFile, 'utf8');
  const reports = JSON.parse(data);

  console.log(`\n${colors.bold}📊 Development Reports${colors.reset}`);
  console.log(`Found ${reports.length} reports\n`);

  // Group by type
  const bugs = reports.filter(r => r.type === 'bug');
  const features = reports.filter(r => r.type === 'feature');
  const improvements = reports.filter(r => r.type === 'improvement');

  // Display bugs
  if (bugs.length > 0) {
    console.log(`${colors.red}${colors.bold}🐛 Bugs (${bugs.length})${colors.reset}`);
    bugs.forEach((bug, i) => {
      console.log(`${colors.red}${i + 1}. ${bug.title}${colors.reset}`);
      console.log(`   Priority: ${bug.priority} | Status: ${bug.status}`);
      console.log(`   ${bug.description}`);
      console.log(`   URL: ${bug.url}`);
      console.log(`   Date: ${new Date(bug.timestamp).toLocaleString()}\n`);
    });
  }

  // Display features
  if (features.length > 0) {
    console.log(`${colors.blue}${colors.bold}✨ Features (${features.length})${colors.reset}`);
    features.forEach((feature, i) => {
      console.log(`${colors.blue}${i + 1}. ${feature.title}${colors.reset}`);
      console.log(`   Priority: ${feature.priority} | Status: ${feature.status}`);
      console.log(`   ${feature.description}`);
      console.log(`   URL: ${feature.url}`);
      console.log(`   Date: ${new Date(feature.timestamp).toLocaleString()}\n`);
    });
  }

  // Display improvements
  if (improvements.length > 0) {
    console.log(`${colors.green}${colors.bold}💡 Improvements (${improvements.length})${colors.reset}`);
    improvements.forEach((improvement, i) => {
      console.log(`${colors.green}${i + 1}. ${improvement.title}${colors.reset}`);
      console.log(`   Priority: ${improvement.priority} | Status: ${improvement.status}`);
      console.log(`   ${improvement.description}`);
      console.log(`   URL: ${improvement.url}`);
      console.log(`   Date: ${new Date(improvement.timestamp).toLocaleString()}\n`);
    });
  }

  // Summary
  console.log(`${colors.bold}📈 Summary${colors.reset}`);
  console.log(`- High Priority: ${reports.filter(r => r.priority === 'high').length}`);
  console.log(`- Medium Priority: ${reports.filter(r => r.priority === 'medium').length}`);
  console.log(`- Low Priority: ${reports.filter(r => r.priority === 'low').length}`);
  console.log(`- Open: ${reports.filter(r => r.status === 'open').length}`);
  console.log(`- Closed: ${reports.filter(r => r.status === 'closed').length}`);

} catch (error) {
  if (error.code === 'ENOENT') {
    console.error(`${colors.red}Error: File '${reportsFile}' not found${colors.reset}`);
    console.log('Usage: node view-reports.js [reports-file.json]');
  } else {
    console.error(`${colors.red}Error reading reports:${colors.reset}`, error.message);
  }
  process.exit(1);
}