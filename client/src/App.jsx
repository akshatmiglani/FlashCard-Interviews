import { useState } from 'react'
import axios from 'axios';
import './App.css'
import { FlashCardList } from './FlashCardList';

function App() {
  const [flashcards,setFlashcards]=useState(SAMPLE_CARDS);
  const [topic, setTopic] = useState('');
  const [error, setError] = useState(null); 

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    if (!topic) {
      setError('Please enter a topic');
      return; 
    }

    try {
      const response = await axios.post('https://flash-card-interviews.vercel.app/flashcards', { topic }); 
      console.log(response.data);
      setFlashcards(response.data);
      setError(null); 
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again later.');
    } finally {
      setTopic(''); 
    }
  };

  return (
    <div className="container">
      <form className="form-center" onSubmit={handleSubmit}>
        <label htmlFor="topic">Enter Topic: 
        <input
          type="text"
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        </label>
        <button type="submit">Generate Flashcards</button>
        {error && <p className="error">{error}</p>}
      </form>
      <FlashCardList flashcards={flashcards} />    
    </div>
  );
}

const SAMPLE_CARDS=[
  {
    id:1,
    question:'What is 2+2',
    answer:'4',
    options:[
      '2',
      '3',
      '4',
      '5'
    ]
  },
  {
    id:2,
    question:'What is 3+5',
    answer:'4',
    options:[
      '2',
      '3',
      '4',
      '5'
    ]
  },
  {
    id:3,
    question:'What is 6+4',
    answer:'4',
    options:[
      '2',
      '3',
      '4',
      '5'
    ]
  },
  
]
export default App
