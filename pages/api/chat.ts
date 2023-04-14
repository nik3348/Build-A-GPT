// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatCompletionRequestMessageRoleEnum, Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import { WeaviateClient } from 'weaviate-ts-client';
import { getClient } from '@/utils/weaviate';
import { encode } from 'gpt-3-encoder';

type Message = {
  history: string;
  message: CreateChatCompletionResponse;
}

type ExceedsLimit = {
  history: string;
  message: {
    choices: { message: { role: string, content: string } }[];
  };
}

type Error = {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message | ExceedsLimit | Error>
) {
  try {
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
      .withFields('title author description pages coverImg price stock')
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

    console.log(result)

    const query = [...messages];
    for (let i = 0; i < result.Get.Book.length; i++) {
      query.push({ role: ChatCompletionRequestMessageRoleEnum.System, content: `Vector Search result ${i + 1} - ${JSON.stringify(result.Get.Book[i])}` });
    }

    const encoding = encode(JSON.stringify(query))
    if (encoding.length > 4096) {
      res.status(200).json({
        history: messages,
        message: {
          choices: [
            {
              message: {
                role: ChatCompletionRequestMessageRoleEnum.System,
                content: "Sorry, you've exceeded the limit for this demo thank you for trying out this ChatBot contact us at nik3348@gmail.com for more information.",
              },
            },
          ],
        },
      });
      return;
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: query,
    });

    res.status(200).json({ history: messages, message: completion.data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
