# FlashCard-Interviews
FlashCard-Interviews is a dynamic web application that helps users practice multiple-choice questions (MCQs) for interviews or learning new topics. By simply entering a topic of interest, the application fetches a set of MCQs along with the correct answers. The project is built using React for the frontend and uses an LLM (Language Model API) like Google or Gemini AI to fetch the answers in the backend. It aims to provide an engaging and interactive way to learn, revise, or prepare for interviews.


## Features
1. Interactive Flashcards: Users can input any topic, and the app presents a set of multiple-choice questions based on the entered topic.
2. Dynamic Topic Support: The system generates questions related to any given topic in real time using the power of LLM APIs like Google/Gemini AI.
3. Answer Validation: The correct answer is fetched and validated at the backend using the API, ensuring accurate and updated responses.
4. Simple UI: Built with React, the interface is clean, responsive, and easy to navigate, ensuring a smooth user experience.
5. Efficient Question Loading: The backend dynamically fetches and serves questions, minimizing delays and maintaining quick response times.


## Setup Instructions
### Prerequisites

Make sure you have the following installed on your system:

1. Node.js (version 14 or higher)
2. npm or yarn (for managing dependencies)
3. Google/Gemini AI API key (Make sure you have access to the API for generating questions.)


Steps:

1. 
```bash git clone https://github.com/your-username/flashcard-interviews.git
cd flashcard-interviews

```

2. 
```bash
cd client
npm install

cd ..
cd server
npm install

```

3. Run the frontend and backend
```bash
cd client
npm run dev

cd ..
cd server
nodemon index.js
```