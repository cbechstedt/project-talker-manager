const express = require('express');
const crypto = require('crypto');
const { readTalkerData } = require('./utils/fsUtils');

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

app.post('/login', (req, res) => {
  function generateToken() {
    return crypto.randomBytes(8).toString('hex');
  }
  const token = generateToken();
  res.status(200).json({ token });
  
  // const { email, password } = req.body;
  // loginAccess = { email, password };
  
  // if (loginAccess) {
  // }
});
