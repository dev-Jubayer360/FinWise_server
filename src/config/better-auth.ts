import config from './env';
import { MongoClient } from 'mongodb';

// VERCEL NFT HINT: These requires are never executed but force Vercel to bundle the ESM packages
if (process.env.VERCEL_NEVER_TRUE === 'true') {
    require('better-auth');
    require('better-auth/adapters/mongodb');
    require('better-auth/node');
}

let _auth: any = null;

export const getAuth = async () => {
    if (_auth) return _auth;
    
    const { betterAuth } = await new Function('return import("better-auth")')();
    const { mongodbAdapter } = await new Function('return import("better-auth/adapters/mongodb")')();
    
    const client = new MongoClient(config.MONGODB_URI || "mongodb://localhost:27017/fallback");
    const db = client.db();

    const cleanClientUrl = config.CLIENT_URL.replace(/\/$/, "");
    const cleanBaseUrl = config.BETTER_AUTH_URL.replace(/\/$/, "");

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
        trustedOrigins: [cleanClientUrl],
        secret: config.BETTER_AUTH_SECRET,
        baseURL: cleanBaseUrl,
        advanced: {
            defaultCookieAttributes: {
                sameSite: "none",
                secure: true
            }
        }
    });
    
    return _auth;
};
