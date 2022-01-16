const fs = require('fs')

function getProjectNames(path) {
  const files = fs.readdirSync(path)

  return files
    .filter((fileName) => fileName.endsWith('.csv'))
    .map((fileName) => fileName.replace('.csv', ''))
}

module.exports = getProjectNames
