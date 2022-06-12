import { MongoClient } from 'mongodb';

async function connectToDatabase() {
    const client = await MongoClient.connect(
        'mongodb://127.0.0.1:27017/next-auth',
        {
            maxIdleTimeMS: 120 * 1000,
            socketTimeoutMS: 10 * 1000,
        }
    );

    return client;
}

export default connectToDatabase;
