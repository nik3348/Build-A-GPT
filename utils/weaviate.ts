import weaviate, { ObjectsBatcher, WeaviateClient } from 'weaviate-ts-client';
import openai, { Configuration, OpenAIApi } from 'openai';

const weav = async () => {
    const client: WeaviateClient = weaviate.client({
        scheme: 'http',
        host: 'localhost:8080',
        headers: { 'X-OpenAI-Api-Key': process.env.apiKey ?? "" },
    });

    const classObj = {
        class: 'Question',
        description: 'Information from a Jeopardy! question',
        vectorizer: 'text2vec-openai',
        moduleConfig: {
            'text2vec-openai': {
                model: 'ada',
                modelVersion: '002',
                type: 'text',
            },
        },
        properties: [
            {
                name: 'question',
                description: 'The question',
                dataType: ['text'],
            },
            {
                name: 'answer',
                description: 'The answer',
                dataType: ['text'],
            },
            {
                name: 'category',
                description: 'The category',
                dataType: ['string'],
            },
        ],
    };

    // client
    //     .schema
    //     .classCreator()
    //     .withClass(classObj)
    //     .do()
    //     .then((res: any) => {
    //         console.log(res);
    //     })
    //     .catch((err: Error) => {
    //         console.error(err);
    //     });

    const model = 'text-embedding-ada-002';

    (async () => {
        const configuration = new Configuration({
            organization: process.env.organization,
            apiKey: process.env.apiKey,
        });
        const openai = new OpenAIApi(configuration);
        const oaiResp = await openai.createEmbedding({
            input: ["Questions about the world"],
            model: model
        });

        const oaiEmbedding = oaiResp.data.data[0].embedding;
        const result = await client.graphql
            .get()
            .withClassName('Question')
            .withFields('question answer category')
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

        console.log('API response:');
        console.log(JSON.stringify(result, null, 2));
    })();
}

async function getJsonData(): Promise<any> {
    const file: Response = await fetch('https://raw.githubusercontent.com/weaviate-tutorials/quickstart/main/data/jeopardy_tiny.json');
    return file.json();
}

async function importQuestions() {
    // Get the data from the data.json file
    const data = await getJsonData();
    const client: WeaviateClient = weaviate.client({
        scheme: 'http',
        host: 'localhost:8080',
        headers: { 'X-OpenAI-Api-Key': process.env.apiKey ?? "" },
    });

    // Prepare a batcher
    let batcher: ObjectsBatcher = client.batch.objectsBatcher();
    let counter: number = 0;
    let batchSize: number = 100;

    interface Question {
        Answer: string;
        Question: string;
        Category: string;
    }

    data.forEach((question: Question) => {
        const obj = {
            class: 'Question',
            properties: {
                answer: question.Answer,
                question: question.Question,
                category: question.Category,
            },
        }

        // add the object to the batch queue
        batcher = batcher.withObject(obj);

        // When the batch counter reaches batchSize, push the objects to Weaviate
        if (counter++ == batchSize) {
            // flush the batch queue
            batcher
                .do()
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.error(err)
                });

            // restart the batch queue
            counter = 0;
            batcher = client.batch.objectsBatcher();
        }
    });

    // Flush the remaining objects
    batcher
        .do()
        .then((res: any) => {
            console.log(res)
        })
        .catch((err: Error) => {
            console.error(err)
        });
}

export default weav;
