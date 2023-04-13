import weaviate, { ObjectsBatcher, WeaviateClient } from 'weaviate-ts-client';
import Data from "../public/book-5.json";

export const getClient = (): WeaviateClient => {
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
                name: 'description',
                description: 'The description',
                dataType: ['text'],
            },
            {
                name: 'pages',
                description: 'The number pages',
                dataType: ['text'],
            },
            {
                name: 'coverImg',
                description: 'The coverImg',
                dataType: ['text'],
            },
            {
                name: 'price',
                description: 'The price',
                dataType: ['text'],
            },
            {
                name: 'stock',
                description: 'The stock',
                dataType: ['int'],
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
    return client
        .data
        .getter()
        .do()
        .then((res: any) => res)
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
    const batchSize: number = 1000;

    interface Book {
        title: string;
        author: string;
        description: string;
        pages: string;
        coverImg: string;
        price: string;
        stock: number;
    }

    await data.forEach((book: Book) => {
        const obj = {
            class: 'Book',
            properties: {
                title: book.title,
                author: book.author,
                description: book.description,
                pages: book.pages,
                coverImg: book.coverImg,
                price: book.price,
                stock: book.stock,
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
    await batcher
        .do()
        .then((res: any) => {
            console.log(res)
        })
        .catch((err: Error) => {
            console.error(err)
        });

    console.log('Done');
}
