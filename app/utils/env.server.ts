import { z } from 'zod';
import * as process from 'process';

const env = z.object({
    APPLICATION_URL: z.string(),
    APPLICATION_SECRET: z.string(),
    ENCRYPTION_KEY: z.string(),
    JWT_ENCRYPTION_KEY: z.string(),
    //Auth provider stuff
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),

    //Other connections
    DATABASE_URL: z.string(),
    MIGRATE_DATABASE_URL: z.string(),
    EDGE_CONFIG: z.string(),
    VERCEL_TOKEN: z.string(),
    UNSPLASH_ACCESS_KEY: z.string(),
    UNSPLASH_SECRET_KEY: z.string(),
});

export const environmentVariables = env.parse(process.env);
