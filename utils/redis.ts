import { SchemaFieldTypes, VectorAlgorithms, createClient } from 'redis';

async () => {
    const client = createClient();

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();

    await client.set('key', 'value');
    const value = await client.get('key');
    await client.disconnect();

    // Constants
    // const VECTOR_DIM = data['title_vector'][0].length // length of the vectors
    // const VECTOR_NUMBER = data.length                 // initial number of vectors
    // const INDEX_NAME = "idx:gpt-search"               // name of the search index
    // const PREFIX = "doc"                              // prefix for the document keys
    // const DISTANCE_METRIC = "COSINE"                  // distance metric for the vectors(ex.COSINE, IP, L2)

    // try {
    //     // Documentation: https://redis.io/docs/stack/search/reference/vectors/
    //     await client.ft.create(INDEX_NAME, {
    //         title: {
    //             type: SchemaFieldTypes.TEXT,
    //         },
    //         v: {
    //             type: SchemaFieldTypes.VECTOR,
    //             ALGORITHM: VectorAlgorithms.FLAT,
    //             TYPE: 'FLOAT32',
    //             DIM: 2,
    //             DISTANCE_METRIC: 'COSINE',
    //         }
    //     }, {
    //         ON: 'HASH',
    //         PREFIX: 'noderedis:knn'
    //     });
    // } catch (e) {
    //     if (e.message === 'Index already exists') {
    //         console.log('Index exists already, skipped creation.');
    //     } else {
    //         console.error(e);
    //         process.exit(1);
    //     }
    // }
}
