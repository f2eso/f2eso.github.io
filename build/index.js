#!/usr/bin/env node

const { generateMergedQuestions } = require('./generator');
const target = process.argv[2];

if (!target) {
  generateMergedQuestions();
}
else if (target === 'question') {
  generateMergedQuestions();
}
