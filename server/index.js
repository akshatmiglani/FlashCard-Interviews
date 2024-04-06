const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
const PORT = 5000;
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
app.use(bodyParser.json());
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

mongoose.connect('mongodb://localhost:27017/flashcards', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));

const flashcardSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    options: [{ type: String, required: true }]
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173' // Replace with your frontend origin
}));



app.post('/flashcards', async (req, res) => {
    console.log('request called');
    const { topic } = req.body; // Get the topic from the request body
  
    if (!topic) {
      return res.status(400).send('Missing required field: topic');
    }
  
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
    const prompt = `Generate 10 interview based mcq questions with answer on the topic ${topic}. Stricly Return response in the following format, never return in any other format excpet this :
    [{
      "id":"1",
      "question":"write question here",
      "answer":"correct answer",
      "options":["option1","option2","option3","option4"]
    }]`;
    
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log(response.text());
    
        const jsonStartIndex = response.text().indexOf('['); // Finding the start of JSON array
        const jsonEndIndex = response.text().lastIndexOf(']'); // Finding the end of JSON array
        const jsonResponse = response.text().substring(jsonStartIndex, jsonEndIndex + 1);
    
        
        const cleanedResponse = jsonResponse.replace(/\`/g, '').trim(); 
        console.log('Cleaned JSON:', cleanedResponse); // Log the cleaned JSON
    
        const jsonData = JSON.parse(cleanedResponse);
    
        // for (const flashcard of jsonData) {
        //     const newFlashcard = new Flashcard(flashcard);
        //     await newFlashcard.save();
        // }
    
        res.json(jsonData); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating or saving flashcards');
    }
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));