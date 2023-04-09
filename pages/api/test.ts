// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import weav from '@/utils/weaviate';
import type { NextApiRequest, NextApiResponse } from 'next'

type Message = {
  message: string;
  username: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message>
) {
  weav();
  res.status(200).json({ message: 'Hello World', username: 'John Doe'});
}
