const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 5001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', 
      messages: [
        {
          role: 'system',
          content: 'You are a helpful English tutor. Correct the user\'s English and provide feedback.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 150, // Limit response length
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});