import { betterAuth } from 'better-auth';
import config from './env';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const client = new MongoClient(config.MONGODB_URI || "mongodb://localhost:27017/fallback");
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: config.GOOGLE_CLIENT_ID as string,
            clientSecret: config.GOOGLE_CLIENT_SECRET as string,
        }
    },
    trustedOrigins: [config.CLIENT_URL],
    secret: config.BETTER_AUTH_SECRET,
    baseURL: config.BETTER_AUTH_URL,
});
