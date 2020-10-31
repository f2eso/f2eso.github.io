const fs = require('fs');
const path = require('path');
const execSync = require("child_process").execSync;
const yaml = require('js-yaml');

const { convertYamlToJson } = require('../helper');

const LOCAL_DATA_ROOT = path.resolve(__dirname, '../../_data/interview');
const INTERVIEW_DOC_ROOT = path.resolve(__dirname, '../../_interview');
const QUESTION_DOC_ROOT = `${INTERVIEW_DOC_ROOT}/questions`;
const QUESTION_DATA_ROOT = path.resolve(__dirname, '../../vendors/interview/data/questions');

function scanAndSortByAsc(filePath) {
  return fs.readdirSync(filePath).slice();
}

function generateQuestions(questions) {
  const doc = {};
  const sortedQuestions = questions.slice();

  sortedQuestions.sort((a, b) => a.date.getTime() < b.date.getTime() ? -1 : 1);
  sortedQuestions.forEach(({ id, ...q }) => { doc[id] = q; });

  const questionLocalData = `${LOCAL_DATA_ROOT}/questions.yml`

  if (!fs.existsSync(questionLocalData)) {
    execSync(`touch ${questionLocalData}`);
  }

  fs.writeFileSync(questionLocalData, yaml.safeDump(doc));
}

function generateCategorizedQuestions(subjects, tags) {
  const sortedSubjects = Object.keys(subjects);

  sortedSubjects.sort((a, b) => subjects[a].length > subjects[b].length ? -1 : 1);

  const sortedTags = Object.keys(tags);

  sortedTags.sort((a, b) => tags[a].length >= tags[b].length ? -1 : 1);

  const categorizedQuestionData = `${LOCAL_DATA_ROOT}/categorized-questions.yml`;

  if (!fs.existsSync(categorizedQuestionData)) {
    execSync(`touch ${categorizedQuestionData}`);
  }

  fs.writeFileSync(categorizedQuestionData, yaml.safeDump({
    subject: {
      questions: subjects,
      sequence: sortedSubjects,
    },
    tag: {
      questions: tags,
      sequence: sortedTags,
    },
  }));
}

function generateSubjectDocs() {
  const subjectDocRoot = `${INTERVIEW_DOC_ROOT}/subjects`;

  execSync(`rm -rf ${subjectDocRoot} && mkdir ${subjectDocRoot}`);

  const subjectData = convertYamlToJson(`${LOCAL_DATA_ROOT}/subjects.yml`);

  Object.keys(subjectData).forEach(k => {
    const subject = subjectData[k];

    fs.writeFileSync(`${subjectDocRoot}/${k}.md`, `---\ntitle: 「${subject.title}」主题的问题\n---\n`);
  });
}

function generateTagDocs() {
  const tagDocRoot = `${INTERVIEW_DOC_ROOT}/tags`;

  execSync(`rm -rf ${tagDocRoot} && mkdir ${tagDocRoot}`);

  const tagData = convertYamlToJson(`${LOCAL_DATA_ROOT}/tags.yml`);

  Object.keys(tagData).forEach(k => {
    const tag = tagData[k];

    fs.writeFileSync(`${tagDocRoot}/${k}.md`, `---\ntitle: 「${tag.title}」标签的问题\n---\n`);
  });
}

function generateMergedQuestions() {
  execSync(`rm -rf ${QUESTION_DOC_ROOT} && mkdir ${QUESTION_DOC_ROOT}`);

  const questions = [];
  const subjects = {};
  const tags = {};

  scanAndSortByAsc(QUESTION_DATA_ROOT).forEach(subject => {
    subjects[subject] = [];

    scanAndSortByAsc([QUESTION_DATA_ROOT, subject].join('/')).forEach(questionTitle => {
      if (questionTitle.indexOf('.') === 0) {
        return;
      }

      subjects[subject].push(questionTitle);

      const dataPath = [QUESTION_DATA_ROOT, subject, questionTitle].join('/');
      const data = convertYamlToJson(`${dataPath}/metadata.yml`);
      const frontMatterContent = fs.readFileSync(`${dataPath}/metadata.yml`).toString();
      const filePath = `${QUESTION_DOC_ROOT}/${questionTitle}.md`;

      if (Array.isArray(data.tags)) {
        data.tags.forEach(tag => {
          if (!tags[tag]) {
            tags[tag] = [];
          }

          tags[tag].push(questionTitle);
        });
      }

      let docContent = fs.readFileSync(`${dataPath}/readme.md`).toString();

      if (fs.existsSync(`${dataPath}/answer.md`)) {
        docContent += `\n\n## 回答\n\n${fs.readFileSync(`${dataPath}/answer.md`).toString()}`;
        data.answered = true;
      }

      if (fs.existsSync(`${dataPath}/explain.md`)) {
        docContent += `\n\n## 讲解\n\n${fs.readFileSync(`${dataPath}/explain.md`).toString()}`;
        data.explained = true;
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

  generateQuestions(questions);
  generateCategorizedQuestions(subjects, tags);

  generateSubjectDocs();
  generateTagDocs();
}

module.exports = {
  generateMergedQuestions,
};
