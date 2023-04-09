import { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import Head from 'next/head';

import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";
import styles from '@/styles/Home.module.css';
import prompt from '@/systemPrompt';

export default function Home() {
  const defaultMessages: ChatCompletionRequestMessage[] = [
    { role: ChatCompletionRequestMessageRoleEnum.System, content: prompt },
    { role: ChatCompletionRequestMessageRoleEnum.Assistant, content: "Hello I'm a sales assistant for a Popular Bookstores Malaysia we sell books online. How can I help you?" },
  ];

  const [chatLog, setChatLog] = useState<ChatCompletionRequestMessage[]>(defaultMessages);
  const [chatBox, setChatBox] = useState<string>("");

  const generatePrompt = async () => {
    const configuration = new Configuration({
      organization: process.env.organization,
      apiKey: process.env.apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const clientMessage: ChatCompletionRequestMessage = { role: ChatCompletionRequestMessageRoleEnum.User, content: chatBox };
    let messages: ChatCompletionRequestMessage[] = [...chatLog, clientMessage];
    setChatLog(messages);
    setChatBox("");

    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    }).then((response) => {
      console.log(response.data);
      if (!response.data.choices[0].message) {
        return;
      }

      const { role, content } = response.data.choices[0].message;
      messages = [...messages, { role, content }];
      setChatLog(messages);
    });
  };

  const handleKeyDown = (event: { key: string; }) => {
    if (event.key === 'Enter') {
      generatePrompt();
    }
  };

  const ChatLog = () => {
    return (
      <Grid container rowSpacing={5} spacing={2}>
        {chatLog.map((message, index) => (
          <Grid item xs={12} key={index}>
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
        </Grid>
      </main>
    </>
  )
}
