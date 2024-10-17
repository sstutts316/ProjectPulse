import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Updated model
      messages: [{ role: "user", content: "Hello, OpenAI!" }],
      max_tokens: 10,
    });
    console.log(response.choices[0].message.content.trim());
  } catch (error) {
    console.error("Error with OpenAI:", error);
  }
}

testOpenAI();




