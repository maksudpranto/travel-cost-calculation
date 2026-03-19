import { db } from "../lib/db";

async function setup() {
    try {
        console.log("Creating tables...");
        
        // 1. Trips table
        await db.query(`
            CREATE TABLE IF NOT EXISTS trips (
                id BIGINT PRIMARY KEY,
                "userId" TEXT NOT NULL,
                "name" TEXT NOT NULL,
                "currency" TEXT DEFAULT 'BDT',
                "startDate" TEXT,
                "endDate" TEXT,
                "type" TEXT DEFAULT 'regular',
                "touristCount" INTEGER,
                "feePerPerson" NUMERIC,
                "status" TEXT DEFAULT 'active',
                "people" JSONB DEFAULT '[]',
                "expenses" JSONB DEFAULT '[]',
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Trips table ready.");

        // 2. User table
        await db.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                "emailVerified" BOOLEAN NOT NULL,
                image TEXT,
                "createdAt" TIMESTAMP NOT NULL,
                "updatedAt" TIMESTAMP NOT NULL,
                username TEXT
            );
        `);
        console.log("User table ready.");

        // 3. Session table
        await db.query(`
            CREATE TABLE IF NOT EXISTS session (
                id TEXT PRIMARY KEY,
                "expiresAt" TIMESTAMP NOT NULL,
                token TEXT NOT NULL UNIQUE,
                "createdAt" TIMESTAMP NOT NULL,
                "updatedAt" TIMESTAMP NOT NULL,
                "ipAddress" TEXT,
                "userAgent" TEXT,
                "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
            );
        `);
        console.log("Session table ready.");

        // 4. Account table
        await db.query(`
            CREATE TABLE IF NOT EXISTS account (
                id TEXT PRIMARY KEY,
                "accountId" TEXT NOT NULL,
                "providerId" TEXT NOT NULL,
                "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
                "accessToken" TEXT,
                "refreshToken" TEXT,
                "idToken" TEXT,
                "accessTokenExpiresAt" TIMESTAMP,
                "refreshTokenExpiresAt" TIMESTAMP,
                "scope" TEXT,
                password TEXT,
                "createdAt" TIMESTAMP NOT NULL,
                "updatedAt" TIMESTAMP NOT NULL
            );
        `);
        console.log("Account table ready.");

        // 5. Verification table
        await db.query(`
            CREATE TABLE IF NOT EXISTS verification (
                id TEXT PRIMARY KEY,
                identifier TEXT NOT NULL,
                value TEXT NOT NULL,
                "expiresAt" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP,
                "updatedAt" TIMESTAMP
            );
        `);
        console.log("Verification table ready.");

        console.log("Database setup completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error setting up database:", error);
        process.exit(1);
    }
}

setup();
