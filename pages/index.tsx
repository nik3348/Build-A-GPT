import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Header from '@/components/header';
import ChatWindow from '@/components/chatWindow';
import Carousel from '@/components/carousel';
import Catalog from '@/components/catalog';

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>ChatGPT Sales Assistant</title>
        <meta name="description" content="ChatGPT Sales Assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={inter.className}>
        <main className={styles.main}>
          <Header />
          <Carousel />
          <Catalog />
          <ChatWindow />
        </main>
      </div>
    </>
  )
}
