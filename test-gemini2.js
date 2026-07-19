require('dotenv').config();
const { AIService } = require('./dist/modules/ai/ai.service');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    console.log("Connected to MongoDB. Testing chatWithAI...");
    const res = await AIService.chatWithAI('mock-user-id', 'Hello, how can I save money?');
    console.log("RESPONSE:", res);
  } catch (err) {
    console.error("ERROR CAUGHT:");
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
});
