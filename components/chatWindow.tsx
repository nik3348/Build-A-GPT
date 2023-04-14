import { useState } from 'react';
import { Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import styles from '@/styles/Home.module.css';
import Chat from './chat';

const ChatWindow = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(true);

  const handleChatWindow = () => {
    setIsChatOpen(!isChatOpen)
  };

  return (
    <>
      {isChatOpen && <Chat minimize={handleChatWindow} />}
      <div className={styles.fab}>
        <Fab color="primary" aria-label="chat" onClick={handleChatWindow}>
          <ChatIcon />
        </Fab>
      </div>
    </>
  );
}

export default ChatWindow;
