// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatCompletionRequestMessageRoleEnum, Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import weaviate, { WeaviateClient } from 'weaviate-ts-client';

type Message = {
  history: string;
  message: CreateChatCompletionResponse;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message>
) {
  const { messages } = req.body;
  const configuration = new Configuration({
    organization: process.env.organization,
    apiKey: process.env.apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const oaiResp = await openai.createEmbedding({
    input: [messages[messages.length - 1].content],
    model: 'text-embedding-ada-002'
  });

  const oaiEmbedding = oaiResp.data.data[0].embedding;
  const client: WeaviateClient = weaviate.client({
    scheme: 'http',
    host: 'weaviate:8080',
    headers: { 'X-OpenAI-Api-Key': process.env.apiKey ?? "" },
  });
  const result = await client.graphql
    .get()
    .withClassName('Book')
    .withFields('bid title author genre stock price summary')
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

  for (let i = 0; i < result.Get.Book.length; i++) {
    messages.push({ role: ChatCompletionRequestMessageRoleEnum.System, content: `Vector Search result ${i + 1} - ${JSON.stringify(result.Get.Book[i])}` });
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  });

  res.status(200).json({ history: messages, message: completion.data });
}
