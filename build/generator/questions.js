const fs = require('fs');
const path = require('path');
const execSync = require("child_process").execSync;
const yaml = require('js-yaml');

const { convertYamlToJson } = require('../helper');

const QUESTION_LOCAL_DATA = path.resolve(__dirname, '../../_data/interview/questions.yml');
const QUESTION_DOC_ROOT = path.resolve(__dirname, '../../_interview/questions');
const QUESTION_DATA_ROOT = path.resolve(__dirname, '../../vendors/interview/data/questions');

function scanAndSortByAsc(filePath) {
  return fs.readdirSync(filePath).slice();
}

function generateMergedQuestions() {
  execSync(`rm -rf ${QUESTION_DOC_ROOT} && mkdir ${QUESTION_DOC_ROOT}`);

  const doc = {};

  scanAndSortByAsc(QUESTION_DATA_ROOT).forEach(subject => {
    scanAndSortByAsc([QUESTION_DATA_ROOT, subject].join('/')).forEach(questionTitle => {
      if (questionTitle.indexOf('.') === 0) {
        return;
      }

      const dataPath = [QUESTION_DATA_ROOT, subject, questionTitle].join('/');
      const data = convertYamlToJson(`${dataPath}/metadata.yml`);
      const frontMatterContent = fs.readFileSync(`${dataPath}/metadata.yml`).toString();
      const docContent = fs.readFileSync(`${dataPath}/readme.md`).toString();
      const filePath = `${QUESTION_DOC_ROOT}/${questionTitle}.md`;

      fs.writeFileSync(filePath, `---\n${frontMatterContent.endsWith('\n') ? frontMatterContent.slice(0, -1) : frontMatterContent}\n---\n\n${docContent}`);

      doc[questionTitle] = {
        ...data,
        subjects: [subject],
      };
    });
  });

  if (!fs.existsSync(QUESTION_LOCAL_DATA)) {
    execSync(`touch ${QUESTION_LOCAL_DATA}`);
  }

  fs.writeFileSync(QUESTION_LOCAL_DATA, yaml.safeDump(doc));
}

module.exports = {
  generateMergedQuestions,
};
