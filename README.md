# Building a GPT Chatbot
This repository provides a proof-of-concept for using a language model with vector database querying. The current implementation uses GPT-3.5, but future updates may provide a choice to switch to Llama. Weaviate is used as a database and long-term memory for the LLM.

## Getting Started
To get started with this project:

1. Clone the repository:
```bash
git clone https://github.com/nik3348/Build-A-GPT.git
```
2. Navigate to the project directory:
```bash
cd Build-A-GPT
```
3. Create a copy of .env and name it .env.local
4. Add your OpenAI API key and organization to the .env.local file
5. Start the Weaviate and Next.js app using docker-compose:
```bash
docker-compose up
```
6. Access the Next.js app at http://localhost:3000
7. Initialize the database with the schema and data by clicking the INITDB button.
8. Now you can ask the bot anything and it will retrieve records from the database. You can see the responses as system messages.

## Customizing the Chatbot
- The chatbot's behavior can be customized in the systemPrompt.ts file using Prompt Engineering. 
- You can change the book inventory data in the data.json file in the public folder.

We hope this guide helps you get started with building a GPT Chatbot using Weaviate and Next.js!
