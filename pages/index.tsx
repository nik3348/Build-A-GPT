import { useState } from 'react';
import { Checkbox, Grid, TextField, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import Head from 'next/head';

import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";
import styles from '@/styles/Home.module.css';
import prompt from '@/utils/systemPrompt';

export default function Home() {
  const defaultMessages: ChatCompletionRequestMessage[] = [
    { role: ChatCompletionRequestMessageRoleEnum.System, content: prompt },
    { role: ChatCompletionRequestMessageRoleEnum.Assistant, content: "Hello I'm a sales assistant for a Stario Bookstores Malaysia. How can I help you?" },
  ];

  const [chatLog, setChatLog] = useState<ChatCompletionRequestMessage[]>(defaultMessages);
  const [chatBox, setChatBox] = useState<string>("");
  const [isPromptHidden, setIsPromptHidden] = useState<boolean>(false);

  const generatePrompt = async () => {
    const clientMessage: ChatCompletionRequestMessage = { role: ChatCompletionRequestMessageRoleEnum.User, content: chatBox };
    let messages: ChatCompletionRequestMessage[] = [...chatLog, clientMessage];
    setChatLog(messages);
    setChatBox("");

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })
      .then(response => response.json())
      .catch(error => console.error(error));

    if (!response.message.choices[0].message) {
      return;
    }

    const { role, content } = response.message.choices[0].message;
    messages = [...response.history, { role, content }];
    setChatLog(messages);
  };

  const handleKeyDown = (event: { key: string; }) => {
    if (event.key === 'Enter') {
      generatePrompt();
    }
  };

  const handleChange = (event: { target: { checked: boolean; }; }) => {
    setIsPromptHidden(event.target.checked);
  };

  const initDB = async () => {
    const response = await fetch('/api/initDB', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .catch(error => console.error(error));
  }

  const ChatLog = () => {
    return (
      <Grid container rowSpacing={5} spacing={2}>
        {chatLog.map((message, index) => (
          <Grid item xs={12} key={index} className={message.role === ChatCompletionRequestMessageRoleEnum.System && isPromptHidden ? "hidden" : ""}>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <p>
                  {message.role}
                </p>
              </Grid>
              <Grid item xs={11}>
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <Head>
        <title>ChatGPT Sales Assistant</title>
        <meta name="description" content="ChatGPT Sales Assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <ChatLog />
        <Grid container spacing={2}>
          <Grid item xs={11}>
            <TextField
              fullWidth
              id="standard-basic"
              label="Enter message"
              variant="standard"
              color="primary"
              value={chatBox}
              onChange={(event) => { setChatBox(event.target.value) }}
              onKeyDown={handleKeyDown} />
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" onClick={generatePrompt}>Send</Button>
          </Grid>
          <Checkbox checked={isPromptHidden} onChange={handleChange} />
          <Grid item xs={1}>
            {isPromptHidden ? null : <Button variant="contained" onClick={initDB}>initDB</Button>}
          </Grid>
        </Grid>
      </main>
    </>
  )
}
