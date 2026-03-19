import { Pool } from 'pg';

const getConnectionString = () => {
    let url = process.env.DATABASE_URL || "";
    // If the URL contains unencoded # (common in Supabase passwords), encode them
    if (url.includes('#') && !url.includes('%23')) {
        // We only want to encode # in the password/user part, but a global replace is usually safe for DB URIs
        url = url.replace(/#/g, '%23');
    }
    return url;
};

export const db = new Pool({
    connectionString: getConnectionString(),
    ssl: process.env.DATABASE_URL?.includes('supabase.com') ? { rejectUnauthorized: false } : false
});

export default db;
