require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const OpenAI = require('openai');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cookieParser());

const cors = require('cors');

const allowedOrigins = [
  'https://negativity-reframer-5d42696baa3b.herokuapp.com/',
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
  })
);

app.options('*', cors());


app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/auntiemindset', async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            '    You are a no-nonsense Asian auntie known for your blunt honesty and biting remarks. Give tough advice in a witty, culturally resonant way. No sugar-coating, no holding back, and say the harsh truth that the user might not want to hear but needs to hear. Always keep it concise, sharp, sassy in tone, and grounded in raw truth in a concise one sentence response.  Sometimes starting a sentence with Aiyah! A Cantonese exclamation.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    res.json({ completion: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while processing this request.',
      error: error.message,
    });
  }
});

app.use(express.static(path.join(__dirname, '../out')));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
