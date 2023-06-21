// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatCompletionRequestMessageRoleEnum, Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import { WeaviateClient } from 'weaviate-ts-client';
import { getClient } from '@/utils/weaviate';
import { encode } from 'gpt-3-encoder';
import { Client } from 'pg'
import { Users } from './entity/User';
import { DataSource } from 'typeorm';

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

type AvailableFunctions = {
  [key: string]: Function;
}

const get_current_weather = (args: { location: string; unit: string }) => {
  return `The current weather in ${args.location} is 72 degrees and sunny.`;
};

const query_database = async (args: { query: string }) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
  })
  await client.connect()
  const result = await client.query(args.query)
  await client.end()
  return result.rows[0]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message | ExceedsLimit | Error>
) {
  try {
    const { messages } = req.body;
    // This input should be a string we ask chatgpt
    // Eg. We take the last 5 messages from the user and ask it what is the user looking for
    // const input = [messages[messages.length - 1].content];
    const configuration = new Configuration({
      organization: 'org-CTnT8VxUGbg6kjjgE5WFu8vt',
      apiKey: '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',
    });
    const openai = new OpenAIApi(configuration);
    const query = [...messages];
    
    // const oaiResp = await openai.createEmbedding({
    //   input,
    //   model: 'text-embedding-ada-002'
    // });

    // const oaiEmbedding = oaiResp.data.data[0].embedding;
    // const client: WeaviateClient = getClient();
    // const result = await client.graphql
    //   .get()
    //   .withClassName('Book')
    //   .withFields('title author description pages coverImg price stock')
    //   .withNearVector({
    //     vector: oaiEmbedding,
    //     certainty: 0.7
    //   })
    //   .withLimit(5)
    //   .do()
    //   .then((res: any) => {
    //     return res.data;
    //   })
    //   .catch((err: Error) => {
    //     console.error(err)
    //   });

    // for (let i = 0; i < result.Get.Book.length; i++) {
    //   query.push({ role: ChatCompletionRequestMessageRoleEnum.System, content: `Vector Search result ${i + 1} - ${JSON.stringify(result.Get.Book[i])}` });
    // }
    // console.log(query)

    const database_schema_string = `
      @Entity()
      export class Users {
          @PrimaryGeneratedColumn()
          id!: number
  
          @Column()
          firstname!: string
  
          @Column()
          lastname!: string
  
          @Column()
          age!: number
      }
      `
    const functions = [
      {
        "name": "get_current_weather",
        "description": "Get the current weather in a given location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "The city and state, e.g. San Francisco, CA",
            },
            "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] },
          },
          "required": ["location"],
        },
      },
      {
        "name": "query_database",
        "description": "Use this function to access the database in order to answer user questions about users. Output should be a fully formed SQL query.",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": `
                              SQL query extracting info to answer the user's question.
                              SQL should be written using this database schema:
                              ${database_schema_string}
                              The query should be returned in plain text, not in JSON.
                              `,
            }
          },
          "required": ["query"],
        },
      }
    ]

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

    let response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0613',
      messages: query,
      functions: functions,
    });

    const responseMessage = response.data.choices[0].message
    if (responseMessage && responseMessage.function_call) {
      const availableFunctions: AvailableFunctions = {
        get_current_weather: get_current_weather,
        query_database: query_database,
      };

      const functionCall = responseMessage.function_call;
      if (!functionCall.name || !functionCall.arguments) {
        throw new Error("No function call found");
      }

      const function_name = functionCall.name;
      const function_to_call = availableFunctions[function_name];
      const function_args = JSON.parse(functionCall.arguments);
      const function_response = await function_to_call(function_args);

      messages.push(responseMessage);
      messages.push({
        role: "function",
        name: function_name,
        content: function_response,
      });

      response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo-0613',
        messages: query,
      });
    }

    res.status(200).json({ history: messages, message: response.data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
