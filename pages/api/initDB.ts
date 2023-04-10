// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClass, getData, importData } from '@/utils/weaviate';
import type { NextApiRequest, NextApiResponse } from 'next'

type Message = {
  message: string;
  username: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message>
) {
  await createClass();
  await importData();  
  res.status(200).json({ message: 'Hello World', username: 'John Doe'});
}
