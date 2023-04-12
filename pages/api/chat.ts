// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatCompletionRequestMessageRoleEnum, Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import weaviate, { WeaviateClient } from 'weaviate-ts-client';
import { getClient } from '@/utils/weaviate';

type Message = {
  history: string;
  message: CreateChatCompletionResponse;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message>
) {
  const { messages } = req.body;
  // This input should be a string we ask chatgpt
  // Eg. We take the last 5 messages from the user and ask it what is the user looking for
  const input = [messages[messages.length - 1].content];
  const configuration = new Configuration({
    organization: process.env.organization,
    apiKey: process.env.apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const oaiResp = await openai.createEmbedding({
    input,
    model: 'text-embedding-ada-002'
  });

  const oaiEmbedding = oaiResp.data.data[0].embedding;
  const client: WeaviateClient = getClient();
  const result = await client.graphql
    .get()
    .withClassName('Book')
    .withFields('bookId title series author rating description language isbn genres characters bookFormat edition pages publisher publishDate firstPublishDate awards numRatings ratingsByStars likedPercent setting coverImg bbeScore bbeVotes price stock')
    .withNearVector({
      vector: oaiEmbedding,
      certainty: 0.7
    })
    .withLimit(5)
    .do()
    .then((res: any) => {
      return res.data;
    })
    .catch((err: Error) => {
      console.error(err)
    });

  console.log(result);
  for (let i = 0; i < result.Get.Book.length; i++) {
    messages.push({ role: ChatCompletionRequestMessageRoleEnum.System, content: `Vector Search result ${i + 1} - ${JSON.stringify(result.Get.Book[i])}` });
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  });

  res.status(200).json({ history: messages, message: completion.data });
}
