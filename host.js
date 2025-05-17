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
  // Assuming the first half are truth questions
  const truthQuestions = questions.slice(0, questions.length / 2);
  const randomQuestion = truthQuestions[Math.floor(Math.random() * truthQuestions.length)];
  res.json({ type: 'truth', question: randomQuestion });
});

app.get('/dare', async (req, res) => {
  const questions = await fetchQuestions();
  // Assuming the second half are dare questions
  const dareQuestions = questions.slice(questions.length / 2);
  const randomQuestion = dareQuestions[Math.floor(Math.random() * dareQuestions.length)];
  res.json({ type: 'dare', challenge: randomQuestion });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});