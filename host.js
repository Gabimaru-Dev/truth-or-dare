const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const URL = 'https://parade.com/966507/parade/truth-or-dare-questions/';

async function fetchQuestions() {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);
    const questions = [];

    $('ol li').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text) {
        questions.push(text);
      }
    });

    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

app.get('/truth', async (req, res) => {
  const questions = await fetchQuestions();
  const truthQuestions = questions.slice(0, questions.length / 2);
  const randomQuestion = truthQuestions[Math.floor(Math.random() * truthQuestions.length)];

  res.json({
    type: 'truth',
    question: randomQuestion,
    creator: 'Gabimaru',
    status: 'success'
  });
});

app.get('/dare', async (req, res) => {
  const questions = await fetchQuestions();
  const dareQuestions = questions.slice(questions.length / 2);
  const randomQuestion = dareQuestions[Math.floor(Math.random() * dareQuestions.length)];

  res.json({
    type: 'dare',
    challenge: randomQuestion,
    creator: 'Gabimaru',
    status: 'success'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Self-ping to prevent Render sleeping
setInterval(() => {
  axios.get('https://truth-or-dare-49lx.onrender.com/truth')
    .then(() => console.log('Self-ping sent'))
    .catch(err => console.error('Self-ping failed:', err.message));
}, 5 * 60 * 1000); // every 5 minutes