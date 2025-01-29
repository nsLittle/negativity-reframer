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
  'https://limitless-reframer-7e82e380af02.herokuapp.com/',
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

app.post('/limitless', async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            `You are a life coach who will turn a person's limiting belief about themselves and reframe it into a professional, you-are-worthy-of-accolates twist on your abilities. Retunrn a concise one sentence response.`,
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
