import config from './env';
import { MongoClient } from 'mongodb';

let _auth: any = null;

export const getAuth = async () => {
    if (_auth) return _auth;
    
    // Use eval to bypass TypeScript transpilation of import() to require()
    // This fixes ERR_REQUIRE_ESM on Vercel
    const { betterAuth } = await eval('import("better-auth")');
    const { mongodbAdapter } = await eval('import("better-auth/adapters/mongodb")');
    
    const client = new MongoClient(config.MONGODB_URI || "mongodb://localhost:27017/fallback");
    const db = client.db();

    _auth = betterAuth({
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
    
    return _auth;
};
