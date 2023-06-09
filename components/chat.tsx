import { SetStateAction, useState } from 'react';
import { Grid, Button, InputBase, IconButton } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai";
import prompt from '@/utils/systemPrompt';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';

type Chat = {
  minimize: () => void;
}

const Chat = (props: Chat) => {
  const defaultMessages: ChatCompletionRequestMessage[] = [
    { role: ChatCompletionRequestMessageRoleEnum.System, content: prompt },
    { role: ChatCompletionRequestMessageRoleEnum.Assistant, content: "Hello! I'm Maya a sales assistant for The READING Corner Bookstores Malaysia. How can I help you?" },
  ];

  const [chatLog, setChatLog] = useState<ChatCompletionRequestMessage[]>(defaultMessages);
  const [chatBox, setChatBox] = useState<string>("");
  const [isDebugMode, setIsDebugMode] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const generatePrompt = async () => {
    const message = chatBox.trim();
    if (!message) {
      return;
    }

    const clientMessage: ChatCompletionRequestMessage = { role: ChatCompletionRequestMessageRoleEnum.User, content: message };
    let messages: ChatCompletionRequestMessage[] = [...chatLog, clientMessage];
    setChatLog(messages);
    setChatBox("");

    setTimeout(() => {
      setIsTyping(true);
    }, 1000);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })
      .then(response => response.json())
      .catch(error => console.error(error));

    setIsTyping(false);

    if (!response || !response.message.choices[0].message) {
      return;
    } else if (response.error) {
      console.error(response.error);
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
    setIsDebugMode(event.target.checked);
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
  };

  const ChatHeader = () => {
    return (
      <div className={styles.chatHeader}>
        <div className={styles.chatAssistant}>
          <span style={{ color: 'green', marginRight: '5px' }}>● </span>Maya (Online)
        </div>
        <IconButton aria-label="close" style={{ color: 'white' }} onClick={props.minimize}>
          <CloseIcon />
        </IconButton>
      </div>
    );
  };

  const assistantBubble = (message: string) => {
    return (
      <Grid container>
        <Grid item xs={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className={styles.assistantIcon}>
            <Image
              src="/maya.svg"
              alt="MayaIcon"
              width={200}
              height={50}
              priority
            />
            Maya (Sales Assistant)
          </div>
        </Grid>
        <Grid item>
          <div className={styles.chatBubbleAssistant}>
            <ReactMarkdown>
              {message}
            </ReactMarkdown>
          </div>
        </Grid>
      </Grid>
    );
  };

  const userBubble = (message: string) => {
    return (
      <div className={styles.chatBubbleUser}>
        <ReactMarkdown>
          {message}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <>
      <div className={styles.chat}>
        <ChatHeader />
        <div className={styles.chatLog}>
          <Grid
            container
            rowSpacing={1}
            direction='column'
            justifyContent='end'
            alignItems='flex-end'
            padding={1}
          >
            {chatLog.filter((x) => x.content !== null && x.role !== ChatCompletionRequestMessageRoleEnum.Function).map((message, index) => (
              <Grid item key={index} className={message.role === ChatCompletionRequestMessageRoleEnum.System && !isDebugMode ? "hidden" : ""}>
                {message.role === ChatCompletionRequestMessageRoleEnum.User ? userBubble(message.content) : assistantBubble(message.content)}
              </Grid>
            ))}
            {isTyping && assistantBubble('Typing...')}
          </Grid>
        </div>
        <div className={styles.chatMessage}>
          <Grid container spacing={1}>
            <Grid item xs={10}>
              <InputBase
                fullWidth
                autoComplete='off'
                id="standard-basic"
                color="primary"
                placeholder='Enter you message here'
                value={chatBox}
                onChange={(event) => { setChatBox(event.target.value) }}
                onKeyDown={handleKeyDown}
                inputProps={{ 'aria-label': 'Enter you message here' }}
                style={{ color: '#ffffff', backgroundColor: '#78797a', borderRadius: '4px', padding: '3px 0 4px 15px' }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" onClick={generatePrompt}>Send</Button>
            </Grid>
            {/* <Grid item xs={1}>
            <Checkbox checked={isDebugMode} onChange={handleChange} />
            {!isDebugMode ? null : <Button variant="contained" onClick={initDB}>initDB</Button>}
          </Grid> */}
          </Grid>
          <div className={styles.subChat}>Powered by GPT3.5</div>
        </div>
      </div>
    </>
  );
};

export default Chat;
