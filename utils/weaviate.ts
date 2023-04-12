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
                name: 'bookId',
                description: 'The bookId',
                dataType: ['text'],
            },
            {
                name: 'title',
                description: 'The title',
                dataType: ['text'],
            },
            {
                name: 'series',
                description: 'The series',
                dataType: ['text'],
            },
            {
                name: 'author',
                description: 'The author',
                dataType: ['text'],
            },
            {
                name: 'rating',
                description: 'The rating',
                dataType: ['text'],
            },
            {
                name: 'description',
                description: 'The description',
                dataType: ['text'],
            },
            {
                name: 'language',
                description: 'The language',
                dataType: ['text'],
            },
            {
                name: 'isbn',
                description: 'The isbn',
                dataType: ['text'],
            },
            {
                name: 'genre',
                description: 'The genre',
                dataType: ['text'],
            },
            {
                name: 'characters',
                description: 'The characters',
                dataType: ['text'],
            },
            {
                name: 'bookFormat',
                description: 'The bookFormat',
                dataType: ['text'],
            },
            {
                name: 'edition',
                description: 'The edition',
                dataType: ['text'],
            },
            {
                name: 'pages',
                description: 'The number pages',
                dataType: ['text'],
            },
            {
                name: 'publisher',
                description: 'The publisher',
                dataType: ['text'],
            },
            {
                name: 'publishDate',
                description: 'The publishDate',
                dataType: ['text'],
            },
            {
                name: 'firstPublishDate',
                description: 'The firstPublishDate',
                dataType: ['text'],
            },
            {
                name: 'awards',
                description: 'The awards',
                dataType: ['text'],
            },
            {
                name: 'numRatings',
                description: 'The numRatings',
                dataType: ['text'],
            },
            {
                name: 'ratingsByStars',
                description: 'The ratingsByStars',
                dataType: ['text'],
            },
            {
                name: 'likedPercent',
                description: 'The likedPercent',
                dataType: ['text'],
            },
            {
                name: 'setting',
                description: 'The setting',
                dataType: ['text'],
            },
            {
                name: 'coverImg',
                description: 'The coverImg',
                dataType: ['text'],
            },
            {
                name: 'bbeScore',
                description: 'The bbeScore',
                dataType: ['text'],
            },
            {
                name: 'bbeVotes',
                description: 'The bbeVotes',
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
        bookId: string;
        title: string;
        series: string;
        author: string;
        rating: string;
        description: string;
        language: string;
        isbn: string;
        genres: string;
        characters: string;
        bookFormat: string;
        edition: string;
        pages: string;
        publisher: string;
        publishDate: string;
        firstPublishDate: string;
        awards: string;
        numRatings: string;
        ratingsByStars: string;
        likedPercent: string;
        setting: string;
        coverImg: string;
        bbeScore: string;
        bbeVotes: string;
        price: string;
        stock: number;
    }

    await data.forEach((book: Book) => {
        const obj = {
            class: 'Book',
            properties: {
                bookId: book.bookId,
                title: book.title,
                series: book.series,
                author: book.author,
                rating: book.rating,
                description: book.description,
                language: book.language,
                isbn: book.isbn,
                genres: book.genres,
                characters: book.characters,
                bookFormat: book.bookFormat,
                edition: book.edition,
                pages: book.pages,
                publisher: book.publisher,
                publishDate: book.publishDate,
                firstPublishDate: book.firstPublishDate,
                awards: book.awards,
                numRatings: book.numRatings,
                ratingsByStars: book.ratingsByStars,
                likedPercent: book.likedPercent,
                setting: book.setting,
                coverImg: book.coverImg,
                bbeScore: book.bbeScore,
                bbeVotes: book.bbeVotes,
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
