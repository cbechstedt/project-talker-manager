const fs = require('fs').promises;
const path = require('path');

async function readTalkerData() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, '../talker.json'));
    const talker = JSON.parse(data);

    return talker;
  } catch (error) {
    console.error(`Erro na leitura do arquivo: ${error}`);
  }
}

module.exports = {
  readTalkerData,
};