require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const run = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.list();
    for await (const model of response) {
      if (model.name.includes('gemini')) console.log(model.name);
    }
  } catch (error) {
    console.error('ERROR:', error);
  }
};

run();
