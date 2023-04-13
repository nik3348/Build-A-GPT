// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClass, getData, importData } from '@/utils/weaviate';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await getData();

  if (data.totalResults === undefined) {
    console.log('Initiating DB');
    await createClass();
    await importData();
  } else {
    console.log(data.objects[0].properties);
  }

  res.status(200).send('OK');
}
