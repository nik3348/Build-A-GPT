import { useState } from 'react';
import { Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import styles from '@/styles/Home.module.css';
import Chat from './chat';

const ChatWindow = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  return (
    <>
      {isChatOpen && <Chat />}
      <div className={styles.fab}>
        <Fab color="primary" aria-label="chat" onClick={() => { setIsChatOpen(!isChatOpen) }}>
          <ChatIcon />
        </Fab>
      </div>
    </>
  );
}

export default ChatWindow;
