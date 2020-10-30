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
  const questions = [];

  scanAndSortByAsc(QUESTION_DATA_ROOT).forEach(subject => {
    scanAndSortByAsc([QUESTION_DATA_ROOT, subject].join('/')).forEach(questionTitle => {
      if (questionTitle.indexOf('.') === 0) {
        return;
      }

      const dataPath = [QUESTION_DATA_ROOT, subject, questionTitle].join('/');
      const data = convertYamlToJson(`${dataPath}/metadata.yml`);
      const frontMatterContent = fs.readFileSync(`${dataPath}/metadata.yml`).toString();
      const filePath = `${QUESTION_DOC_ROOT}/${questionTitle}.md`;

      let docContent = fs.readFileSync(`${dataPath}/readme.md`).toString();

      if (fs.existsSync(`${dataPath}/answer.md`)) {
        docContent += `\n\n## 回答\n\n${fs.readFileSync(`${dataPath}/answer.md`).toString()}`;
      }

      if (fs.existsSync(`${dataPath}/explain.md`)) {
        docContent += `\n\n## 讲解\n\n${fs.readFileSync(`${dataPath}/explain.md`).toString()}`;
      }

      fs.writeFileSync(filePath, `---\n${frontMatterContent.endsWith('\n') ? frontMatterContent.slice(0, -1) : frontMatterContent}\n---\n\n${docContent}`);

      questions.push({
        ...data,
        id: questionTitle,
        date: new Date(data.date),
        subjects: [subject],
      });
    });
  });

  questions.sort((a, b) => a.date.getTime() < b.date.getTime() ? -1 : 1);

  questions.forEach(({ id, ...q }) => {
    doc[id] = q;
  });

  if (!fs.existsSync(QUESTION_LOCAL_DATA)) {
    execSync(`touch ${QUESTION_LOCAL_DATA}`);
  }

  fs.writeFileSync(QUESTION_LOCAL_DATA, yaml.safeDump(doc));
}

module.exports = {
  generateMergedQuestions,
};
