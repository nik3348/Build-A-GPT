import weaviate, { ObjectsBatcher, WeaviateClient } from 'weaviate-ts-client';
import Data from "../public/data.json";

const getClient = (): WeaviateClient => {
    return weaviate.client({
        scheme: 'http',
        host: 'weaviate:8080',
        headers: { 'X-OpenAI-Api-Key': process.env.apiKey ?? "" },
    });
}

export const createClass = async () => {
    const classObj = {
        class: 'Book',
        description: 'Information about a book in the inventory',
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
                name: 'bid',
                description: 'The bid',
                dataType: ['int'],
            },
            {
                name: 'title',
                description: 'The title',
                dataType: ['text'],
            },
            {
                name: 'author',
                description: 'The author',
                dataType: ['text'],
            },
            {
                name: 'genre',
                description: 'The genre',
                dataType: ['text'],
            },
            {
                name: 'stock',
                description: 'The stock',
                dataType: ['int'],
            },
            {
                name: 'price',
                description: 'The price',
                dataType: ['int'],
            },
            {
                name: 'summary',
                description: 'The summary',
                dataType: ['text'],
            },
        ],
    };

    const client = getClient();
    client
        .schema
        .classCreator()
        .withClass(classObj)
        .do()
        .then((res: any) => {
            console.log(res);
        })
        .catch((err: Error) => {
            console.error(err);
        });
}

export const getData = async () => {
    const client = getClient();
    client
        .data
        .getter()
        .do()
        .then((res: any) => {
            console.log(res)
        })
        .catch((err: Error) => {
            console.error(err)
        });
}

export async function importData() {
    // Get the data from the data.json file
    const data = Data;
    // Prepare a batcher
    const client = getClient();
    let batcher: ObjectsBatcher = client.batch.objectsBatcher();
    let counter: number = 0;
    const batchSize: number = 100;

    interface Book {
        bid: number;
        title: string;
        author: string;
        genre: string;
        stock: number;
        price: number;
        summary: string;
    }

    data.forEach((book: Book) => {
        const obj = {
            class: 'Book',
            properties: {
                bid: book.bid,
                title: book.title,
                author: book.author,
                genre: book.genre,
                stock: book.stock,
                price: book.price,
                summary: book.summary,
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
