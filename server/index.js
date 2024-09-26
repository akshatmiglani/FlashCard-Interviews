const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
const PORT = 5000;
const OpenAI = require('openai');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
require('dotenv').config();
app.use(bodyParser.json());

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
  console.log('Request called');
  
  const { topic } = req.body; 
  
  if (!topic) {
    return res.status(400).send('Missing required field: topic');
  }
  
  // Initialize the Generative AI client
  const apiKey = process.env.API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are an expert computer science AI, based on the given topic you should return 10 hard mcq questions with answers in a json format with the keys id,question,answer. ",
  });
  
  const generationConfig = {
    temperature: 1.2,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  };
  
  try {
    // Start the chat session with the model
    const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {text: "topic is python"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"id\": 1,\n    \"question\": \"What is the primary difference between the `is` and `==` operators in Python?\",\n    \"answer\": \"The `is` operator checks for object identity (whether two variables refer to the same object in memory), while `==` checks for equality of values.\",\n    \"options\": [\n      \"Both operators are identical in functionality.\",\n      \"The `is` operator checks for value equality, while `==` checks for object identity.\",\n      \"The `is` operator checks for object identity (whether two variables refer to the same object in memory), while `==` checks for equality of values.\",\n      \"The `is` operator is only used for comparing integers, while `==` works for all data types.\"\n    ]\n  },\n  {\n    \"id\": 2,\n    \"question\": \"What is the purpose of the `__init__` method in a Python class?\",\n    \"answer\": \"It acts as the constructor, initializing the attributes (properties) of an object when it is created.\",\n    \"options\": [\n      \"It defines the class's main functionality.\",\n      \"It handles inheritance from parent classes.\",\n      \"It acts as the constructor, initializing the attributes (properties) of an object when it is created.\",\n      \"It is used to define static methods.\"\n    ]\n  },\n  {\n    \"id\": 3,\n    \"question\": \"What is the difference between a list and a tuple in Python?\",\n    \"answer\": \"Lists are mutable (can be changed), while tuples are immutable (cannot be modified after creation).\",\n    \"options\": [\n      \"Lists are ordered collections, while tuples are unordered.\",\n      \"Tuples are used for storing data, while lists are used for calculations.\",\n      \"Lists are mutable (can be changed), while tuples are immutable (cannot be modified after creation).\",\n      \"There is no significant difference; they are interchangeable.\"\n    ]\n  },\n  {\n    \"id\": 4,\n    \"question\": \"Explain the concept of decorators in Python.\",\n    \"answer\": \"Decorators are functions that modify the behavior of other functions without altering their source code, allowing for code reusability and adding functionalities.\",\n    \"options\": [\n      \"Decorators are used to create new classes.\",\n      \"Decorators are used to handle exceptions in a program.\",\n      \"Decorators are functions that modify the behavior of other functions without altering their source code, allowing for code reusability and adding functionalities.\",\n      \"Decorators are used to define the order in which methods are executed in a class.\"\n    ]\n  },\n  {\n    \"id\": 5,\n    \"question\": \"What is the significance of the `yield` keyword in Python?\",\n    \"answer\": \"It allows a function to return a generator object, which can produce a sequence of values iteratively rather than all at once, saving memory.\",\n    \"options\": [\n      \"It is used to define a class method.\",\n      \"It is used to raise exceptions.\",\n      \"It allows a function to return a generator object, which can produce a sequence of values iteratively rather than all at once, saving memory.\",\n      \"It is used to declare a variable with a specific data type.\"\n    ]\n  },\n  {\n    \"id\": 6,\n    \"question\": \"What is the purpose of the `try...except` block in Python?\",\n    \"answer\": \"It handles exceptions (errors) during program execution, allowing for graceful error handling and preventing program crashes.\",\n    \"options\": [\n      \"It defines a new function within a class.\",\n      \"It is used to create a loop that iterates over a sequence.\",\n      \"It handles exceptions (errors) during program execution, allowing for graceful error handling and preventing program crashes.\",\n      \"It is used to define a class attribute.\"\n    ]\n  },\n  {\n    \"id\": 7,\n    \"question\": \"Explain the concept of lambda functions in Python.\",\n    \"answer\": \"They are anonymous functions defined using the `lambda` keyword, allowing for concise code and often used for simple operations.\",\n    \"options\": [\n      \"Lambda functions are used to define classes.\",\n      \"Lambda functions are used for defining complex algorithms.\",\n      \"They are anonymous functions defined using the `lambda` keyword, allowing for concise code and often used for simple operations.\",\n      \"Lambda functions are only used for mathematical calculations.\"\n    ]\n  },\n  {\n    \"id\": 8,\n    \"question\": \"What is the difference between `range()` and `xrange()` in Python 2.x?\",\n    \"answer\": \"In Python 2.x, `range()` creates a list containing all values, while `xrange()` generates values on demand, saving memory for large ranges.\",\n    \"options\": [\n      \"`range()` and `xrange()` are identical in functionality in Python 2.x.\",\n      \"In Python 2.x, `xrange()` creates a list containing all values, while `range()` generates values on demand.\",\n      \"In Python 2.x, `range()` creates a list containing all values, while `xrange()` generates values on demand, saving memory for large ranges.\",\n      \"There is no `xrange()` function in Python 2.x.\"\n    ]\n  },\n  {\n    \"id\": 9,\n    \"question\": \"What is the purpose of the `__str__` method in a Python class?\",\n    \"answer\": \"It defines how an object should be represented as a string when printed or converted to a string.\",\n    \"options\": [\n      \"It is used to create an instance of a class.\",\n      \"It handles inheritance from parent classes.\",\n      \"It defines how an object should be represented as a string when printed or converted to a string.\",\n      \"It is used to define static methods.\"\n    ]\n  },\n  {\n    \"id\": 10,\n    \"question\": \"Explain the difference between a shallow copy and a deep copy in Python?\",\n    \"answer\": \"A shallow copy creates a new object but copies references to nested objects, while a deep copy creates a completely independent copy of all objects and their contents.\",\n    \"options\": [\n      \"Shallow copies and deep copies are identical in functionality.\",\n      \"Shallow copies create a completely independent copy of all objects, while deep copies only copy references to nested objects.\",\n      \"A shallow copy creates a new object but copies references to nested objects, while a deep copy creates a completely independent copy of all objects and their contents.\",\n      \"Shallow copies are used for primitive data types, while deep copies are used for complex objects.\"\n    ]\n  }\n]\n```"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "Generate 10 questions on the topic \"Java Programming\""},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"id\": 1,\n    \"question\": \"What is the difference between a class and an object in Java?\",\n    \"answer\": \"A class is a blueprint or template for creating objects, while an object is an instance of a class, representing a real-world entity.\",\n    \"options\": [\n      \"A class is a blueprint or template for creating objects, while an object is an instance of a class, representing a real-world entity.\",\n      \"A class is a collection of objects, while an object is a single instance of a class.\",\n      \"There is no difference between a class and an object in Java.\",\n      \"An object is a blueprint, and a class is an instance of the blueprint.\"\n    ]\n  },\n  {\n    \"id\": 2,\n    \"question\": \"What is the purpose of the 'main' method in a Java program?\",\n    \"answer\": \"The 'main' method is the entry point for execution of a Java program. It is where the program's execution begins.\",\n    \"options\": [\n      \"The 'main' method is used for initializing class variables.\",\n      \"The 'main' method is used for handling exceptions.\",\n      \"The 'main' method is used for defining the program's structure.\",\n      \"The 'main' method is the entry point for execution of a Java program. It is where the program's execution begins.\"\n    ]\n  },\n  {\n    \"id\": 3,\n    \"question\": \"What is the difference between a 'static' method and an instance method in Java?\",\n    \"answer\": \"A 'static' method belongs to the class itself and can be called without creating an object, while an instance method belongs to an object and requires an object to be called.\",\n    \"options\": [\n      \"A 'static' method is used for creating objects, while an instance method is used for accessing class variables.\",\n      \"A 'static' method belongs to the class itself and can be called without creating an object, while an instance method belongs to an object and requires an object to be called.\",\n      \"There is no difference between a 'static' method and an instance method.\",\n      \"A 'static' method is used for handling exceptions, while an instance method is used for defining the program's structure.\"\n    ]\n  },\n  {\n    \"id\": 4,\n    \"question\": \"Explain the concept of inheritance in Java.\",\n    \"answer\": \"Inheritance is a mechanism where a class (child class) derives properties and methods from another class (parent class), allowing code reuse and creating hierarchical relationships.\",\n    \"options\": [\n      \"Inheritance is used for creating multiple versions of the same class.\",\n      \"Inheritance is used for handling exceptions.\",\n      \"Inheritance is a mechanism where a class (child class) derives properties and methods from another class (parent class), allowing code reuse and creating hierarchical relationships.\",\n      \"Inheritance is used for defining the program's structure.\"\n    ]\n  },\n  {\n    \"id\": 5,\n    \"question\": \"What is the purpose of interfaces in Java?\",\n    \"answer\": \"Interfaces define contracts that classes can implement, specifying methods that must be implemented without providing their actual implementation.\",\n    \"options\": [\n      \"Interfaces are used for defining the program's structure.\",\n      \"Interfaces are used for handling exceptions.\",\n      \"Interfaces are used for creating multiple versions of the same class.\",\n      \"Interfaces define contracts that classes can implement, specifying methods that must be implemented without providing their actual implementation.\"\n    ]\n  },\n  {\n    \"id\": 6,\n    \"question\": \"What is the difference between 'abstract' classes and concrete classes in Java?\",\n    \"answer\": \"An 'abstract' class cannot be instantiated and may contain abstract methods that must be implemented by its subclasses, while concrete classes can be instantiated and provide full implementations for their methods.\",\n    \"options\": [\n      \"An 'abstract' class is used for creating objects, while a concrete class is used for handling exceptions.\",\n      \"An 'abstract' class cannot be instantiated and may contain abstract methods that must be implemented by its subclasses, while concrete classes can be instantiated and provide full implementations for their methods.\",\n      \"There is no difference between an 'abstract' class and a concrete class.\",\n      \"An 'abstract' class is used for defining the program's structure, while a concrete class is used for defining the program's functionality.\"\n    ]\n  },\n  {\n    \"id\": 7,\n    \"question\": \"Explain the concept of polymorphism in Java.\",\n    \"answer\": \"Polymorphism allows objects of different classes to be treated as objects of a common superclass, enabling flexibility and code reusability.\",\n    \"options\": [\n      \"Polymorphism is used for creating multiple versions of the same method.\",\n      \"Polymorphism is used for handling exceptions.\",\n      \"Polymorphism allows objects of different classes to be treated as objects of a common superclass, enabling flexibility and code reusability.\",\n      \"Polymorphism is used for defining the program's structure.\"\n    ]\n  },\n  {\n    \"id\": 8,\n    \"question\": \"What is the purpose of the 'final' keyword in Java?\",\n    \"answer\": \"The 'final' keyword makes a variable constant (its value cannot be changed), a method non-overridable, or a class non-inheritable.\",\n    \"options\": [\n      \"The 'final' keyword is used for creating objects.\",\n      \"The 'final' keyword is used for handling exceptions.\",\n      \"The 'final' keyword makes a variable constant (its value cannot be changed), a method non-overridable, or a class non-inheritable.\",\n      \"The 'final' keyword is used for defining the program's structure.\"\n    ]\n  },\n  {\n    \"id\": 9,\n    \"question\": \"What is the difference between a 'checked' exception and an 'unchecked' exception in Java?\",\n    \"answer\": \"A 'checked' exception must be handled explicitly by the programmer using 'try...catch' blocks, while an 'unchecked' exception is not required to be handled and can be thrown at runtime.\",\n    \"options\": [\n      \"A 'checked' exception is handled automatically by the JVM, while an 'unchecked' exception must be handled explicitly by the programmer.\",\n      \"A 'checked' exception must be handled explicitly by the programmer using 'try...catch' blocks, while an 'unchecked' exception is not required to be handled and can be thrown at runtime.\",\n      \"There is no difference between a 'checked' exception and an 'unchecked' exception.\",\n      \"A 'checked' exception is used for defining the program's structure, while an 'unchecked' exception is used for defining the program's functionality.\"\n    ]\n  },\n  {\n    \"id\": 10,\n    \"question\": \"What are the different types of access modifiers in Java?\",\n    \"answer\": \"Java access modifiers control the visibility of classes, methods, and variables. They are 'public', 'private', 'protected', and 'default' (package-private).\",\n    \"options\": [\n      \"Java access modifiers are used for creating objects.\",\n      \"Java access modifiers are used for handling exceptions.\",\n      \"Java access modifiers are used for defining the program's structure.\",\n      \"Java access modifiers control the visibility of classes, methods, and variables. They are 'public', 'private', 'protected', and 'default' (package-private).\"\n    ]\n  }\n]\n```"},
          ],
        },
      ],
    });
    
    const result = await chatSession.sendMessage(`Generate 10 questions on the topic: ${topic}`);
    const responseText = await result.response.text();
    
    // Extract JSON response from the text
    const jsonStartIndex = responseText.indexOf('[');
    const jsonEndIndex = responseText.lastIndexOf(']');
    const jsonResponse = responseText.substring(jsonStartIndex, jsonEndIndex + 1);
    
    // Clean the JSON by removing backticks and extra spaces
    // const cleanedResponse = jsonResponse.replace(/\`/g, '').trim();
    // console.log('Cleaned JSON:', cleanedResponse);
    
    const jsonData = JSON.parse(jsonResponse);
    
    // // Return the generated questions as JSON response
    // console.log(responseText);
    
    res.json(jsonData); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating or parsing flashcards');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));