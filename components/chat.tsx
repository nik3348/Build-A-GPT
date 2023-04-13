import { useState } from 'react';
import { Grid, Button, InputBase } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai";
import prompt from '@/utils/systemPrompt';
import styles from '@/styles/Home.module.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Chat = () => {
  const defaultMessages: ChatCompletionRequestMessage[] = [
    { role: ChatCompletionRequestMessageRoleEnum.System, content: prompt },
    { role: ChatCompletionRequestMessageRoleEnum.Assistant, content: "Hello I'm a sales assistant for a The READING Corner Bookstores Malaysia. How can I help you?" },
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
      <Grid container rowSpacing={5}>
        {chatLog.map((message, index) => (
          <Grid item xs={12} key={index} className={message.role === ChatCompletionRequestMessageRoleEnum.System && !isPromptHidden ? "hidden" : ""}>
            <Grid container>
              <Grid item xs={2}>
                <AccountCircleIcon fontSize="large" />
              </Grid>
              <Grid item xs={10}>
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
      <div className={styles.chat}>
        <div className={styles.chatLog}>
          <ChatLog />
        </div>
        <div className={styles.chatMessage}>
          <Grid container spacing={1}>
            <Grid item xs={10}>
              <InputBase
                fullWidth
                autoComplete='off'
                id="standard-basic"
                color="primary"
                value={chatBox}
                onChange={(event) => { setChatBox(event.target.value) }}
                onKeyDown={handleKeyDown}
                inputProps={{ 'aria-label': 'Enter message' }}
                style={{ color: '#ffffff', backgroundColor: '#78797a', borderRadius: '4px', padding: '3px 5px' }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" onClick={generatePrompt}>Send</Button>
            </Grid>
            {/* <Grid item xs={1}>
            <Checkbox checked={isPromptHidden} onChange={handleChange} />
            {!isPromptHidden ? null : <Button variant="contained" onClick={initDB}>initDB</Button>}
          </Grid> */}
          </Grid>
        </div>
      </div>
    </>
  );
};

export default Chat;
