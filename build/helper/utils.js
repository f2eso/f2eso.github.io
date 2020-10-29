const fs = require('fs');
const yaml = require('js-yaml');

function convertYamlToJson(yamlFilePath) {
  return yaml.safeLoad(fs.readFileSync(yamlFilePath, 'utf8'));
}

module.exports = {
  convertYamlToJson,
};
