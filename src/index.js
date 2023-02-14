const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const validateLogin = require('./middlewares/validateLogin');
const { readTalkerData } = require('./utils/fsUtils');
const generateToken = require('./utils/generateToken');
const auth = require('./middlewares/auth');
const validateAge = require('./middlewares/validateAge');
const validateName = require('./middlewares/validateName');
const validateRate = require('./middlewares/validateRate');
const validateTalk = require('./middlewares/validateTalk');
const validateWatchedAt = require('./middlewares/validateWatchedAt');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const talkers = await readTalkerData();

  return res.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const talkers = await readTalkerData();
  const talker = talkers.find(({ id }) => id === Number(req.params.id));

  if (!talker) {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(HTTP_OK_STATUS).json(talker);
});

app.post('/login', validateLogin, (req, res) => {
  const token = generateToken();
  res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker', 
auth, 
validateName, 
validateAge, 
validateTalk, 
validateWatchedAt, 
validateRate, 
async (req, res) => {
  const talkers = await readTalkerData();
  const newTalker = { id: talkers.length + 1, ...req.body };
  const newTalkers = [...talkers, newTalker];
  await fs.writeFile(path.resolve(__dirname, './talker.json'), JSON.stringify(newTalkers));
  return res.status(201).json(newTalker);
});
